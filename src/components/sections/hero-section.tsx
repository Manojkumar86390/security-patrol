'use client';

import React from 'react';
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen">
      <Card className="w-full min-h-screen bg-black/[0.96] relative overflow-hidden border-0 rounded-none">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="#2b7fff"
        />

        <div className="flex flex-col lg:flex-row h-full min-h-screen">
          {/* Left content */}
          <div className="flex-1 p-8 md:p-16 relative z-10 flex flex-col justify-center pt-32 lg:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2b7fff]/30 bg-[#2b7fff]/10 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10d47e] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10d47e]"></span>
                </span>
                <span className="text-[#2b7fff] text-sm font-medium">IoT + BLE + ESP32 Powered</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
                Smart Security
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2b7fff] to-[#10d47e]">
                  Patrol System
                </span>
              </h1>
              <p className="mt-6 text-neutral-400 max-w-lg text-lg leading-relaxed">
                Real-time patrol monitoring using BLE technology and ESP32 devices. 
                Track guard checkpoints, verify patrol compliance, and ensure complete facility security.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2b7fff] to-[#0055dd] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-[#2b7fff]/25 transition-all duration-300"
                >
                  <Shield className="w-5 h-5" />
                  Access Dashboard
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#1e293b] text-neutral-300 rounded-full font-medium hover:border-[#2b7fff]/50 hover:text-white transition-all duration-300"
                >
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 border-t border-white/5 pt-8">
                <div>
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-neutral-500 mt-1">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">&lt;1s</div>
                  <div className="text-sm text-neutral-500 mt-1">Detection</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-neutral-500 mt-1">Checkpoints</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right content - 3D Scene */}
          <div className="relative min-h-[400px] flex-1 overflow-hidden lg:min-h-0">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>
    </section>
  );
}
