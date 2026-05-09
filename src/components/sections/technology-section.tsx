'use client';

import React from 'react';
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { motion } from 'framer-motion';
import { Cpu, Wifi, Radio, Database } from 'lucide-react';

const techStack = [
  { icon: Cpu, label: "ESP32", desc: "Microcontroller" },
  { icon: Radio, label: "BLE 5.0", desc: "Guard Detection" },
  { icon: Wifi, label: "WiFi", desc: "Data Transfer" },
  { icon: Database, label: "MySQL", desc: "Storage" },
];

export default function TechnologySection() {
  return (
    <section id="technology" className="relative py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(43,127,255,0.06),transparent_60%)]" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - CPU Architecture Animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="p-8 rounded-2xl bg-[#111827]/30 border border-white/5 backdrop-blur-sm">
              <CpuArchitecture
                text="ESP"
                className="text-[#2b7fff]/40"
              />
            </div>

            {/* Tech stack pills */}
            <div className="flex flex-wrap gap-3 mt-8 justify-center">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#111827]/50"
                >
                  <tech.icon className="w-4 h-4 text-[#2b7fff]" />
                  <div>
                    <span className="text-white text-sm font-medium">{tech.label}</span>
                    <span className="text-neutral-500 text-xs ml-2">{tech.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2b7fff]/20 bg-[#2b7fff]/5 mb-6">
              <span className="text-[#2b7fff] text-xs font-medium uppercase tracking-wider">Architecture</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Built on 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2b7fff] to-[#00E8ED]"> Industrial-Grade </span>
              IoT Hardware
            </h2>

            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
              Our ESP32-based system uses BLE (Bluetooth Low Energy) to detect guard wristbands at 
              checkpoints. Each device connects to WiFi and sends real-time patrol data to your 
              backend via REST API, ensuring millisecond-level accuracy.
            </p>

            <div className="space-y-4">
              {[
                "ESP32 scans for BLE signals at each checkpoint",
                "Guard's BLE tag detected within 1 second range",
                "POST request sent with device_id, guard_id, timestamp",
                "Dashboard updates in real-time with patrol data"
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#2b7fff]/10 border border-[#2b7fff]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#2b7fff] text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-neutral-300">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
