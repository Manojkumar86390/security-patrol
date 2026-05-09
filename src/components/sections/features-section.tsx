'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Bluetooth, Wifi, Shield, MapPin, Activity, Bell } from 'lucide-react';

const features = [
  {
    icon: Bluetooth,
    title: "BLE Guard Detection",
    description: "Automatic guard identification using Bluetooth Low Energy wristbands at every checkpoint.",
    gradient: "from-[#2b7fff] to-[#00E8ED]"
  },
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "Live patrol tracking with auto-refresh every 10-15 seconds. See guard positions in real time.",
    gradient: "from-[#10d47e] to-[#2b7fff]"
  },
  {
    icon: MapPin,
    title: "Checkpoint Mapping",
    description: "Map every checkpoint in your facility. Track visit times, missed stops, and patrol routes.",
    gradient: "from-[#f59e0b] to-[#ef4444]"
  },
  {
    icon: Wifi,
    title: "ESP32 IoT Devices",
    description: "Industrial-grade ESP32 devices with WiFi connectivity send patrol data via REST API.",
    gradient: "from-[#a855f7] to-[#ec4899]"
  },
  {
    icon: Shield,
    title: "Compliance Reports",
    description: "Generate daily and weekly patrol reports. Export as CSV or Excel for audit compliance.",
    gradient: "from-[#06b6d4] to-[#2b7fff]"
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Instant notifications for missed checkpoints. Configurable alert thresholds for your needs.",
    gradient: "from-[#f43f5e] to-[#f59e0b]"
  }
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 bg-black overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(43,127,255,0.08),transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2b7fff]/30 to-transparent" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2b7fff]/20 bg-[#2b7fff]/5 mb-6">
            <span className="text-[#2b7fff] text-xs font-medium uppercase tracking-wider">Core Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need for
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2b7fff] to-[#10d47e]">
              Complete Patrol Security
            </span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            From BLE detection to automated reports, our system covers every aspect of security patrol management.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-8 rounded-2xl border border-white/5 bg-[#111827]/50 backdrop-blur-sm hover:border-[#2b7fff]/30 transition-all duration-500"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#2b7fff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
