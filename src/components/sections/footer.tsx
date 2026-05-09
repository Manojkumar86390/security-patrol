'use client';

import React from 'react';
import { Shield, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

const footerData = {
  company: {
    name: 'SecurePatrol',
    description: 'Smart Security Patrol Monitoring System powered by IoT, BLE, and ESP32 technology. Ensuring complete visibility over patrol operations.',
  },
  product: [
    { text: 'Dashboard', href: '/dashboard' },
    { text: 'Patrol Logs', href: '#' },
    { text: 'Live Monitoring', href: '#' },
    { text: 'Device Management', href: '#' },
  ],
  resources: [
    { text: 'Documentation', href: '#' },
    { text: 'API Reference', href: '#' },
    { text: 'ESP32 Setup Guide', href: '#' },
    { text: 'BLE Configuration', href: '#' },
  ],
  support: [
    { text: 'FAQs', href: '#' },
    { text: 'Contact Support', href: '#' },
    { text: 'System Status', href: '#' },
    { text: 'Report a Bug', href: '#' },
  ],
  contact: [
    { icon: Mail, text: 'admin@securepatrol.io' },
    { icon: Phone, text: '+91 8637373116' },
    { icon: MapPin, text: 'Kolkata, West Bengal, India' },
  ],
  social: [
    {
      label: 'Twitter',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.633 7.997c.013.176.013.353.013.53 0 5.387-4.099 11.605-11.604 11.605A11.561 11.561 0 010 18.29c.373.044.734.074 1.12.074a8.189 8.189 0 005.065-1.737 4.102 4.102 0 01-3.834-2.85c.25.04.5.065.765.065.37 0 .734-.049 1.08-.147A4.092 4.092 0 01.8 8.582v-.05a4.119 4.119 0 001.853.522A4.099 4.099 0 01.812 5.847c0-.02 0-.042.002-.062a11.653 11.653 0 008.457 4.287A4.62 4.62 0 0122 5.924a8.215 8.215 0 002.018-.559 4.108 4.108 0 01-1.803 2.268 8.233 8.233 0 002.368-.648 8.897 8.897 0 01-2.062 2.112z" />
        </svg>
      ),
    },
    {
      label: 'GitHub',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .29a12 12 0 00-3.797 23.401c.6.11.82-.26.82-.577v-2.17c-3.338.726-4.042-1.415-4.042-1.415-.546-1.387-1.332-1.756-1.332-1.756-1.09-.744.084-.729.084-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.306 3.495.999.106-.775.418-1.307.76-1.608-2.665-.301-5.466-1.332-5.466-5.933 0-1.31.469-2.381 1.236-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.007-.322 3.301 1.23a11.502 11.502 0 016.002 0c2.292-1.552 3.297-1.23 3.297-1.23.654 1.653.242 2.873.119 3.176.77.841 1.235 1.912 1.235 3.222 0 4.61-2.805 5.629-5.476 5.925.429.369.813 1.096.813 2.211v3.285c0 .32.217.694.825.576A12 12 0 0012 .29"></path>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14a5 5 0 00-5-5zm-11 19h-3v-9h3zm-1.5-10.268a1.752 1.752 0 110-3.505 1.752 1.752 0 010 3.505zm15.5 10.268h-3v-4.5c0-1.07-.02-2.45-1.492-2.45-1.495 0-1.725 1.166-1.725 2.372v4.578h-3v-9h2.88v1.23h.04a3.157 3.157 0 012.847-1.568c3.042 0 3.605 2.003 3.605 4.612v4.726z" />
        </svg>
      ),
    },
  ],
};

export default function Footer() {
  return (
    <footer className="relative z-10 w-full overflow-hidden bg-[#0a0d14] border-t border-white/5">
      {/* Glow effects */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2 select-none">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-[#2b7fff]/10 blur-3xl"></div>
        <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-[#2b7fff]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Company info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2b7fff] to-[#0055dd] flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">{footerData.company.name}</span>
            </Link>

            <p className="text-neutral-400 max-w-xs leading-relaxed text-sm mb-8">
              {footerData.company.description}
            </p>

            <div className="flex gap-4">
              {footerData.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="text-neutral-500 hover:text-[#2b7fff] transition-colors"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:col-span-2">
            <div>
              <h4 className="text-xs font-semibold tracking-widest text-[#2b7fff] uppercase mb-4">Product</h4>
              <ul className="space-y-3">
                {footerData.product.map(({ text, href }) => (
                  <li key={text}>
                    <a href={href} className="text-neutral-400 text-sm hover:text-white transition-colors">{text}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-widest text-[#2b7fff] uppercase mb-4">Resources</h4>
              <ul className="space-y-3">
                {footerData.resources.map(({ text, href }) => (
                  <li key={text}>
                    <a href={href} className="text-neutral-400 text-sm hover:text-white transition-colors">{text}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-widest text-[#2b7fff] uppercase mb-4">Contact</h4>
              <ul className="space-y-3">
                {footerData.contact.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#2b7fff] shrink-0" />
                    <span className="text-neutral-400 text-sm">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-neutral-500">
            &copy; 2025 {footerData.company.name}. All rights reserved. Smart Security Patrol Monitoring System.
          </p>
        </div>
      </div>
    </footer>
  );
}
