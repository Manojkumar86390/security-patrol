'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface PatrolLog {
  id: string;
  guardName: string;
  guardId: string;
  checkpoint: string;
  date: string;
  time: string;
  deviceId: string;
  status: 'Verified' | 'Missed' | 'Late';
}

const sampleLogs: PatrolLog[] = [
  { id: '1', guardName: 'Ahmed Khan', guardId: 'GRD-001', checkpoint: 'Main Gate', date: '2025-05-07', time: '14:32:10', deviceId: 'ESP-001', status: 'Verified' },
  { id: '2', guardName: 'Rajesh Kumar', guardId: 'GRD-002', checkpoint: 'Building B - Floor 2', date: '2025-05-07', time: '14:28:45', deviceId: 'ESP-003', status: 'Verified' },
  { id: '3', guardName: 'Suresh Patel', guardId: 'GRD-003', checkpoint: 'Parking Lot A', date: '2025-05-07', time: '14:15:00', deviceId: 'ESP-007', status: 'Late' },
  { id: '4', guardName: 'Michael Chen', guardId: 'GRD-004', checkpoint: 'Server Room', date: '2025-05-07', time: '13:50:30', deviceId: 'ESP-002', status: 'Verified' },
  { id: '5', guardName: 'David Wilson', guardId: 'GRD-005', checkpoint: 'Emergency Exit C', date: '2025-05-07', time: '13:45:22', deviceId: 'ESP-005', status: 'Missed' },
  { id: '6', guardName: 'Ahmed Khan', guardId: 'GRD-001', checkpoint: 'Warehouse', date: '2025-05-07', time: '13:30:15', deviceId: 'ESP-008', status: 'Verified' },
];

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Verified: { bg: 'bg-[#10d47e]/10', text: 'text-[#10d47e]', border: 'border-[#10d47e]/30' },
  Missed: { bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', border: 'border-[#ef4444]/30' },
  Late: { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', border: 'border-[#f59e0b]/30' },
};

const containerVariants: Variants = {
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } }
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 400, damping: 25, mass: 0.7 },
  },
};

export default function DashboardPreviewSection() {
  return (
    <section id="dashboard" className="relative py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(43,127,255,0.05),transparent_60%)]" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2b7fff]/20 bg-[#2b7fff]/5 mb-6">
            <span className="text-[#2b7fff] text-xs font-medium uppercase tracking-wider">Live Dashboard</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Patrol Activity
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2b7fff] to-[#10d47e]"> at a Glance</span>
          </h2>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Guards', value: '24', color: 'from-[#2b7fff] to-[#0055dd]' },
            { label: 'Active Patrols', value: '8', color: 'from-[#10d47e] to-[#059669]' },
            { label: 'Online Devices', value: '18', color: 'from-[#a855f7] to-[#7c3aed]' },
            { label: 'Missed Today', value: '3', color: 'from-[#ef4444] to-[#dc2626]' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl border border-white/5 bg-[#111827]/50 backdrop-blur-sm"
            >
              <p className="text-neutral-400 text-sm">{card.label}</p>
              <p className={`text-3xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r ${card.color}`}>
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Patrol Logs Table */}
        <div className="bg-[#111827]/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-semibold">Recent Patrol Activity</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10d47e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10d47e]"></span>
              </span>
              <span className="text-xs text-neutral-400">Live</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header */}
              <div
                className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wide border-b border-white/5"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 100px 180px 120px 100px 100px 100px',
                  columnGap: '8px'
                }}
              >
                <div>Guard</div>
                <div>Guard ID</div>
                <div>Checkpoint</div>
                <div>Date</div>
                <div>Time</div>
                <div>Device</div>
                <div>Status</div>
              </div>

              {/* Rows */}
              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {sampleLogs.map((log) => (
                  <motion.div key={log.id} variants={rowVariants}>
                    <div
                      className="px-6 py-4 hover:bg-white/[0.02] transition-colors border-b border-white/[0.03] last:border-0"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 100px 180px 120px 100px 100px 100px',
                        columnGap: '8px'
                      }}
                    >
                      <div className="text-white font-medium text-sm">{log.guardName}</div>
                      <div className="text-neutral-400 text-sm font-mono">{log.guardId}</div>
                      <div className="text-neutral-300 text-sm">{log.checkpoint}</div>
                      <div className="text-neutral-400 text-sm">{log.date}</div>
                      <div className="text-neutral-400 text-sm font-mono">{log.time}</div>
                      <div className="text-neutral-400 text-sm font-mono">{log.deviceId}</div>
                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[log.status].bg} ${statusColors[log.status].text} ${statusColors[log.status].border}`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
