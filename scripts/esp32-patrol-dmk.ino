/**
 * ESP32 - send patrol check-in to your PC running Next.js (then Sheet via Apps Script).
 *
 * SETUP
 * 1) On your PC: copy .env.example → .env.local, set PATROL_INGEST_SECRET and
 *    GOOGLE_SHEETS_WEBAPP_URL, then `npm run dev` in the website project.
 * 2) Use the SAME secret string below as PATROL_INGEST_SECRET (see .env.local).
 * 3) Set WIFI_PASS to your 2.4 GHz WiFi password (do not commit the filled sketch).
 * 4) Set PC_IP to your computer’s LAN address (ipconfig → IPv4, same subnet as ESP32).
 * 5) Arduino IDE: Board = your ESP32; install "ArduinoJson" from Library Manager.
 *
 * HC-05 note: this sketch posts a check-in for the tag MAC you configure. True
 * "auto-detect when HC-05 is near" on ESP32 usually needs Bluetooth Classic
 * inquiry or wiring HC-05 to UART; replace sendPatrolPing() with your detect logic.
 */
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ---- WiFi (2.4 GHz only on most ESP32) ----
const char *WIFI_SSID = "dmk";
// TODO: set your password here (keep this file private / don’t upload to git with password)
const char *WIFI_PASS = "YOUR_WIFI_PASSWORD";

// ---- Next.js on your PC ----
// Replace with your PC IPv4 (same Wi‑Fi as the ESP32), e.g. "192.168.1.105"
// Your ESP32 currently shows it is on 192.168.137.x, so set PC IP accordingly.
const char *PC_IP = "192.168.137.1";
const uint16_t HTTP_PORT = 3000;

// Must match PATROL_INGEST_SECRET in .env.local on the PC
const char *PATROL_INGEST_SECRET = "PASTE_SECRET_FROM_ENV_LOCAL";

// Your HC-05 Bluetooth MAC (lowercase with colons is fine)
const char *TAG_MAC = "44:a7:36:85:cb:22";

// Checkpoint metadata (change per ESP32 board / location)
const char *GUARD_NAME = "Patrol tag HC-05";
const char *LOCATION_NAME = "Checkpoint 1";
const char *ESP_NAME = "ESP32-DMK-01";
const char *GUARD_ID = "HC05-001";

// Demo: send once at boot; set to false when you trigger from Bluetooth detect
const bool ALSO_SEND_EVERY_MS = false;
const unsigned long REPEAT_MS = 60000;

unsigned long lastSend = 0;

bool sendPatrolPing() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return false;
  }

  HTTPClient http;
  String url = String("http://") + PC_IP + ":" + HTTP_PORT + "/api/patrol-scan";
  http.begin(url);
  http.setTimeout(15000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + PATROL_INGEST_SECRET);

  StaticJsonDocument<512> doc;
  doc["bluetoothMac"] = TAG_MAC;
  doc["name"] = GUARD_NAME;
  doc["location"] = LOCATION_NAME;
  doc["espId"] = ESP_NAME;
  doc["guardId"] = GUARD_ID;
  doc["status"] = "Verified";

  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  Serial.printf("POST /api/patrol-scan → HTTP %d\n", code);
  String resp = http.getString();
  if (resp.length() > 0) Serial.println(resp);
  http.end();

  return code >= 200 && code < 300;
}

void setup() {
  Serial.begin(115200);
  delay(200);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);
  unsigned start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 60000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi OK, IP: ");
    Serial.println(WiFi.localIP());
    sendPatrolPing();
    lastSend = millis();
  } else {
    Serial.println("WiFi failed - check SSID/password and 2.4 GHz network.");
  }
}

void loop() {
  if (ALSO_SEND_EVERY_MS && WiFi.status() == WL_CONNECTED) {
    unsigned long now = millis();
    if (now - lastSend >= REPEAT_MS) {
      sendPatrolPing();
      lastSend = now;
    }
  }
  delay(200);
}
