'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(43,127,255,0.15),transparent_60%)]" />
      
      <div className="container max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2b7fff] to-[#0055dd] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#2b7fff]/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Secure
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2b7fff] to-[#10d47e]">
              Your Facility?
            </span>
          </h2>
          
          <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-12">
            Start monitoring your security patrols with real-time BLE tracking. 
            Set up your first checkpoint in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-[#2b7fff] to-[#0055dd] text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-[#2b7fff]/25 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-[#1e293b] text-neutral-300 rounded-full font-medium text-lg hover:border-[#2b7fff]/50 hover:text-white transition-all duration-300"
            >
              View Documentation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
