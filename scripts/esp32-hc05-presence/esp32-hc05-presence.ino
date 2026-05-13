/**
 * ESP32 + HC-05 presence -> POST /api/patrol-scan (Next.js -> Sheet).
 *
 * HC-05 does NOT send HTTP. ESP32 runs Bluetooth Classic *inquiry* (device discovery).
 * When your HC-05's MAC appears in scan results, ESP32 sends the JSON (name/location/etc.).
 *
 * REQUIREMENTS (Arduino IDE + ESP32 core)
 * - Board: ESP32 (Bluetooth Classic capable).
 * - Tools -> Partition Scheme: pick one with app space if you see build errors.
 * - ArduinoJson library installed.
 *
 * HC-05 MUST be discoverable when powered (default for many modules; if not, use AT commands).
 * Range is "Classic inquiry" range (not precise); no guaranteed RSSI on all stacks.
 *
 * Fill: WIFI_*, PC_IP, HTTP_PORT, PATROL_INGEST_SECRET, TARGET_HC05_MAC, and metadata below.
 */
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <BluetoothSerial.h>

// If compile fails around BluetoothSerial: enable Bluetooth + Bluedroid + SPP in your ESP32 core
// (Arduino IDE: esp32 board package menu options / sdkconfig). No #error here - avoids IDE/preprocessor issues.

BluetoothSerial SerialBT;

// ---- WiFi ----
const char *WIFI_SSID = "DMK";
const char *WIFI_PASS = "88888888";

// ---- Next.js on PC (same Wi-Fi / hotspot as ESP32) ----
const char *PC_IP = "192.168.137.1";
const uint16_t HTTP_PORT = 30000;
const char *PATROL_INGEST_SECRET = "a61c2efe6622f659d295b15bfc34c3a10798db5e199ad1c4";

// HC-05 Bluetooth address (from label / phone paired devices). Lowercase OK.
const char *TARGET_HC05_MAC = "44:a7:36:85:cb:22";

// Payload when HC-05 is seen
const char *GUARD_NAME = "Patrol tag HC-05";
const char *LOCATION_NAME = "Checkpoint 1";
const char *ESP_NAME = "ESP32-DMK-01";
const char *GUARD_ID = "HC05-001";

// How often to run a Classic BT inquiry scan (ms)
const unsigned long SCAN_INTERVAL_MS = 8000;
// Minimum gap between two successful POSTs for the same tag (ms)
const unsigned long COOLDOWN_MS = 30000;
// Inquiry duration passed to BluetoothSerial::discover (ms). Shorter = less blocking.
const int DISCOVER_MS = 5000;

unsigned long lastScanStart = 0;
unsigned long lastPostMs = 0;

String normalizeMac(const String &mac) {
  String s = mac;
  s.trim();
  s.toLowerCase();
  s.replace('-', ':');
  while (s.indexOf("  ") >= 0) {
    s.replace("  ", " ");
  }
  return s;
}

bool macMatches(const String &seen, const char *expected) {
  return normalizeMac(seen) == normalizeMac(String(expected));
}

bool sendPatrolPing() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected; skip POST");
    return false;
  }

  HTTPClient http;
  String url = String("http://") + PC_IP + ":" + HTTP_PORT + "/api/patrol-scan";
  Serial.print("POST ");
  Serial.println(url);

  http.begin(url);
  http.setTimeout(20000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + PATROL_INGEST_SECRET);

  StaticJsonDocument<512> doc;
  doc["bluetoothMac"] = TARGET_HC05_MAC;
  doc["name"] = GUARD_NAME;
  doc["location"] = LOCATION_NAME;
  doc["espId"] = ESP_NAME;
  doc["guardId"] = GUARD_ID;
  doc["status"] = "Verified";

  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  Serial.printf("HTTP %d\n", code);
  String resp = http.getString();
  if (resp.length() > 0) {
    Serial.println(resp);
  }
  http.end();
  return code >= 200 && code < 300;
}

bool scanForHc05() {
  Serial.println("Bluetooth inquiry running...");
  SerialBT.discoverClear();

  BTScanResults *results = SerialBT.discover(DISCOVER_MS);
  if (!results) {
    Serial.println("discover() returned null");
    return false;
  }

  int n = results->getCount();
  Serial.printf("Devices seen: %d\n", n);

  for (int i = 0; i < n; i++) {
    BTAdvertisedDevice *dev = results->getDevice(i);
    if (!dev) continue;

    String addr = dev->getAddress().toString(true);
    Serial.print("  ");
    Serial.println(addr);

    if (macMatches(addr, TARGET_HC05_MAC)) {
      Serial.println("*** TARGET HC-05 MAC MATCH ***");
      return true;
    }
  }
  return false;
}

void setup() {
  Serial.begin(115200);
  delay(300);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("WiFi connecting");
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 60000) {
    delay(400);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi OK ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi FAILED - fix SSID/password before BT scans matter.");
  }

  // Classic BT device name for this ESP32 (shown on inquiries). Third arg disableBLE frees radio for Classic on some builds.
  if (!SerialBT.begin("ESP32-Patrol", false, true)) {
    Serial.println("BluetoothSerial.begin failed");
  } else {
    Serial.println("Bluetooth Classic ready (inquiry mode).");
  }

  lastScanStart = millis() - SCAN_INTERVAL_MS; // allow first scan soon
}

void loop() {
  unsigned long now = millis();

  if (now - lastScanStart < SCAN_INTERVAL_MS) {
    delay(50);
    return;
  }
  lastScanStart = now;

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi down - reconnecting...");
    WiFi.reconnect();
    delay(2000);
    return;
  }

  if (scanForHc05()) {
    if (now - lastPostMs >= COOLDOWN_MS) {
      if (sendPatrolPing()) {
        lastPostMs = now;
      }
    } else {
      Serial.println("Cooldown active; no POST yet.");
    }
  }

  delay(50);
}
