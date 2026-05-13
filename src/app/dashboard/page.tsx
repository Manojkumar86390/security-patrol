'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePatrolEvents } from '@/hooks/use-patrol-events';
import {
  Shield, LayoutDashboard, FileText, Radio, Cpu, BarChart3,
  Settings, LogOut, Users, Activity, Wifi, AlertTriangle,
  Search, Bell, ChevronDown, Menu, X
} from 'lucide-react';

interface PatrolLog {
  id: string;
  guardName: string;
  guardId: string;
  checkpoint: string;
  date: string;
  time: string;
  deviceId: string;
  bluetoothMac: string;
  status: 'Verified' | 'Missed' | 'Late';
}

interface DeviceStatus {
  id: string;
  name: string;
  checkpoint: string;
  status: 'online' | 'offline';
  lastGuard: string;
  lastSeen: string;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FileText, label: 'Patrol Logs', active: false },
  { icon: Radio, label: 'Live Status', active: false },
  { icon: Cpu, label: 'Devices', active: false },
  { icon: BarChart3, label: 'Reports', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

const devices: DeviceStatus[] = [
  { id: 'ESP-001', name: 'Checkpoint Alpha', checkpoint: 'Main Gate', status: 'online', lastGuard: 'Ahmed Khan', lastSeen: '2 min ago' },
  { id: 'ESP-002', name: 'Checkpoint Beta', checkpoint: 'Server Room', status: 'online', lastGuard: 'Michael Chen', lastSeen: '5 min ago' },
  { id: 'ESP-003', name: 'Checkpoint Gamma', checkpoint: 'Building B', status: 'online', lastGuard: 'Rajesh Kumar', lastSeen: '8 min ago' },
  { id: 'ESP-005', name: 'Checkpoint Delta', checkpoint: 'Exit C', status: 'offline', lastGuard: 'David Wilson', lastSeen: '45 min ago' },
  { id: 'ESP-007', name: 'Checkpoint Epsilon', checkpoint: 'Parking A', status: 'online', lastGuard: 'Suresh Patel', lastSeen: '12 min ago' },
  { id: 'ESP-008', name: 'Checkpoint Zeta', checkpoint: 'Warehouse', status: 'offline', lastGuard: 'Ahmed Khan', lastSeen: '1 hr ago' },
];

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Verified: { bg: 'bg-[#10d47e]/10', text: 'text-[#10d47e]', border: 'border-[#10d47e]/30' },
  Missed: { bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', border: 'border-[#ef4444]/30' },
  Late: { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', border: 'border-[#f59e0b]/30' },
};

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const { events: livePatrol, error: patrolError, loading: patrolLoading } = usePatrolEvents({
    limit: 50,
    intervalMs: 2500,
  });

  const patrolLogs: PatrolLog[] = useMemo(
    () =>
      livePatrol.map((e) => ({
        id: e.id,
        guardName: e.name,
        guardId: e.guardId,
        checkpoint: e.location,
        date: e.date,
        time: e.time,
        deviceId: e.espId,
        bluetoothMac: e.bluetoothMac,
        status: e.status,
      })),
    [livePatrol]
  );

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const summaryCards = [
    { label: 'Total Guards', value: '24', icon: Users, color: 'from-[#2b7fff] to-[#0055dd]', change: '+2' },
    { label: 'Active Patrols', value: '8', icon: Activity, color: 'from-[#10d47e] to-[#059669]', change: '+1' },
    { label: 'Online Devices', value: '18', icon: Wifi, color: 'from-[#a855f7] to-[#7c3aed]', change: '0' },
    { label: 'Missed Today', value: '3', icon: AlertTriangle, color: 'from-[#ef4444] to-[#dc2626]', change: '-1' },
  ];

  return (
    <div className="flex h-screen bg-[#080b10] overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0d14] border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2b7fff] to-[#0055dd] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-semibold text-sm">SecurePatrol</span>
            <p className="text-neutral-500 text-[10px] uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                item.active
                  ? 'bg-[#2b7fff]/10 text-[#2b7fff] font-medium'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-neutral-400 hover:bg-white/5 hover:text-red-400 transition-all">
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#080b10]/90 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-neutral-400 hover:text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white font-semibold text-lg">Dashboard</h1>
              <p className="text-neutral-500 text-xs">Real-time patrol monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10d47e]/10 border border-[#10d47e]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10d47e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10d47e]"></span>
              </span>
              <span className="text-[#10d47e] text-xs font-medium">Live</span>
              <span className="text-neutral-400 text-xs font-mono">{currentTime}</span>
            </div>

            <button className="relative text-neutral-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] rounded-full text-white text-[10px] flex items-center justify-center">3</span>
            </button>

            <div className="flex items-center gap-2 pl-4 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2b7fff] to-[#0055dd] flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-neutral-300 text-sm hidden sm:block">Admin</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-5 rounded-2xl border border-white/5 bg-[#111827]/50 backdrop-blur-sm hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    card.change.startsWith('+') ? 'text-[#10d47e] bg-[#10d47e]/10' :
                    card.change.startsWith('-') ? 'text-[#ef4444] bg-[#ef4444]/10' :
                    'text-neutral-400 bg-neutral-400/10'
                  }`}>
                    {card.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <p className="text-neutral-500 text-sm mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Patrol Activity Table */}
          <div className="rounded-2xl border border-white/5 bg-[#111827]/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-white font-semibold">Recent Patrol Activity</h3>
                <p className="text-neutral-500 text-xs mt-1">
                  {patrolLoading
                    ? 'Loading scans…'
                    : patrolError
                      ? `Feed issue: ${patrolError}`
                      : `${patrolLogs.length} event(s) from ESP32 / Bluetooth`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-white/5">
                  <Search className="w-4 h-4 text-neutral-500" />
                  <input type="text" placeholder="Search..." className="bg-transparent text-sm text-white outline-none w-32 placeholder:text-neutral-600" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Bluetooth MAC</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Guard ID</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Time</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">ESP32</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patrolLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-neutral-500 text-sm">
                        No patrol scans yet. When your ESP32 posts to{' '}
                        <code className="text-neutral-400">/api/patrol-scan</code>, rows appear here automatically
                        (page refreshes every few seconds).
                      </td>
                    </tr>
                  ) : (
                    patrolLogs.map((log) => (
                      <tr key={log.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-white text-sm font-medium">{log.guardName}</td>
                        <td className="px-6 py-4 text-neutral-400 text-sm font-mono whitespace-nowrap">{log.bluetoothMac}</td>
                        <td className="px-6 py-4 text-neutral-400 text-sm font-mono">{log.guardId}</td>
                        <td className="px-6 py-4 text-neutral-300 text-sm">{log.checkpoint}</td>
                        <td className="px-6 py-4 text-neutral-400 text-sm whitespace-nowrap">{log.date}</td>
                        <td className="px-6 py-4 text-neutral-400 text-sm font-mono whitespace-nowrap">{log.time}</td>
                        <td className="px-6 py-4 text-neutral-400 text-sm font-mono">{log.deviceId}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[log.status].bg} ${statusColors[log.status].text} ${statusColors[log.status].border}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device Status */}
          <div>
            <h3 className="text-white font-semibold mb-4">ESP32 Device Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl border border-white/5 bg-[#111827]/30 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#2b7fff]" />
                      <span className="text-white text-sm font-medium">{device.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {device.status === 'online' ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10d47e] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10d47e]"></span>
                          </span>
                          <span className="text-[#10d47e] text-xs">Online</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
                          <span className="text-[#ef4444] text-xs">Offline</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Device ID</span>
                      <span className="text-neutral-300 font-mono">{device.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Checkpoint</span>
                      <span className="text-neutral-300">{device.checkpoint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Last Guard</span>
                      <span className="text-neutral-300">{device.lastGuard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Last Seen</span>
                      <span className="text-neutral-400">{device.lastSeen}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
