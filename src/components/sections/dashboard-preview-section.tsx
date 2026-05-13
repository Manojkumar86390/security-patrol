'use client';

import React, { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { usePatrolEvents } from '@/hooks/use-patrol-events';
import {
  computeDashboardStats,
  computeDashboardStatsFromDemoLogs,
  DEMO_PATROL_TABLE,
} from '@/lib/patrol-stats';

interface PatrolLog {
  id: string;
  guardName: string;
  guardId: string;
  checkpoint: string;
  date: string;
  time: string;
  deviceId: string;
  status: 'Verified' | 'Missed' | 'Late';
  bluetoothMac?: string;
}

const sampleLogs: PatrolLog[] = DEMO_PATROL_TABLE;

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

const gridCols = 'minmax(120px,1.1fr) minmax(130px,1fr) 88px minmax(100px,1fr) 92px 80px 88px 88px';

export default function DashboardPreviewSection() {
  const { events: live, loading } = usePatrolEvents({ limit: 100, intervalMs: 2500 });

  const displayLogs: PatrolLog[] = useMemo(() => {
    if (live.length === 0) return sampleLogs;
    return live.map((e) => ({
      id: e.id,
      guardName: e.name,
      guardId: e.guardId,
      checkpoint: e.location,
      date: e.date,
      time: e.time,
      deviceId: e.espId,
      status: e.status,
      bluetoothMac: e.bluetoothMac,
    }));
  }, [live]);

  const liveFeed = live.length > 0;

  const summaryCards = useMemo(() => {
    if (live.length > 0) {
      const s = computeDashboardStats(live);
      return [
        { label: 'Total Guards', value: String(s.totalGuards), color: 'from-[#2b7fff] to-[#0055dd]' },
        { label: 'Active Patrols', value: String(s.activePatrols), color: 'from-[#10d47e] to-[#059669]' },
        { label: 'Online Devices', value: String(s.onlineDevices), color: 'from-[#a855f7] to-[#7c3aed]' },
        { label: 'Missed Today', value: String(s.missedToday), color: 'from-[#ef4444] to-[#dc2626]' },
      ];
    }
    const s = computeDashboardStatsFromDemoLogs(
      DEMO_PATROL_TABLE.map((r) => ({
        guardId: r.guardId,
        bluetoothMac: r.bluetoothMac,
        status: r.status,
        date: r.date,
        deviceId: r.deviceId,
      }))
    );
    return [
      { label: 'Total Guards', value: String(s.totalGuards), color: 'from-[#2b7fff] to-[#0055dd]' },
      { label: 'Active Patrols', value: String(s.activePatrols), color: 'from-[#10d47e] to-[#059669]' },
      { label: 'Online Devices', value: String(s.onlineDevices), color: 'from-[#a855f7] to-[#7c3aed]' },
      { label: 'Missed Today', value: String(s.missedToday), color: 'from-[#ef4444] to-[#dc2626]' },
    ];
  }, [live]);

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
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
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
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    liveFeed ? 'animate-ping bg-[#10d47e]' : 'bg-transparent'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    liveFeed ? 'bg-[#10d47e]' : loading ? 'bg-[#f59e0b]' : 'bg-neutral-600'
                  }`}
                />
              </span>
              <span className="text-xs text-neutral-400">
                {liveFeed ? 'Live feed' : loading ? 'Connecting…' : 'Demo data'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1024px]">
              {/* Header */}
              <div
                className="px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wide border-b border-white/5"
                style={{
                  display: 'grid',
                  gridTemplateColumns: gridCols,
                  columnGap: '8px'
                }}
              >
                <div>Name</div>
                <div>Bluetooth MAC</div>
                <div>Guard ID</div>
                <div>Location</div>
                <div>Date</div>
                <div>Time</div>
                <div>ESP32</div>
                <div>Status</div>
              </div>

              {/* Rows */}
              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {displayLogs.map((log) => (
                  <motion.div key={log.id} variants={rowVariants}>
                    <div
                      className="px-6 py-4 hover:bg-white/[0.02] transition-colors border-b border-white/[0.03] last:border-0"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: gridCols,
                        columnGap: '8px'
                      }}
                    >
                      <div className="text-white font-medium text-sm">{log.guardName}</div>
                      <div className="text-neutral-400 text-sm font-mono truncate" title={log.bluetoothMac}>
                        {log.bluetoothMac ?? '—'}
                      </div>
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
