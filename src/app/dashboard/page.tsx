'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getPatrols } from "@/lib/patrolService";
import {
  Shield, LayoutDashboard, FileText, Radio, Cpu, BarChart3,
  Settings, LogOut, Users, Activity, Wifi, AlertTriangle,
  Search, Bell, Menu
} from 'lucide-react';

interface PatrolLog {
  id: string;
  guardName: string;
  guardId: string;
  checkpoint: string;
  time: string;
  deviceId: string;
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

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Verified: { bg: 'bg-[#10d47e]/10', text: 'text-[#10d47e]', border: 'border-[#10d47e]/30' },
  Missed: { bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', border: 'border-[#ef4444]/30' },
  Late: { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', border: 'border-[#f59e0b]/30' },
};

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [logs, setLogs] = useState<PatrolLog[]>([]);

  // LIVE CLOCK
useEffect(() => {
  const updateTime = () => {
    setCurrentTime(
      new Date().toLocaleTimeString('en-US', { hour12: false })
    );
  };

  updateTime();
  const interval = setInterval(updateTime, 1000);

  return () => clearInterval(interval);
}, []);

  async function loadData() {
    const { data } = await getPatrols();

    if (data) {
      const formatted: PatrolLog[] = data.map((item: any) => ({
        id: item.id,
        guardName: item.guard_name,
        guardId: item.guard_name,
        checkpoint: item.checkpoint_id,
        time: new Date(item.created_at).toLocaleTimeString(),
        deviceId: item.checkpoint_id,
        status: 'Verified' // temporary since DB has no status column
      }));

      setLogs(formatted);
    }
  }

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
                  ? 'bg-[#2b7fff]/10 text-[#2b7fff]'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            <Menu className="text-white" />
          </button>

          <h1 className="text-white text-lg font-semibold">Dashboard</h1>

          <div className="text-green-400 text-sm">
            Live: {currentTime}
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, i) => (
              <div key={i} className="p-5 bg-[#111827]/50 rounded-xl border border-white/5">
                <p className="text-white text-2xl font-bold">{card.value}</p>
                <p className="text-gray-400 text-sm">{card.label}</p>
              </div>
            ))}
          </div>

          {/* TABLE */}
          <div className="bg-[#111827]/30 rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 text-white font-semibold">
              Patrol Logs
            </div>

            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="p-3 text-left">Guard</th>
                  <th className="p-3 text-left">Checkpoint</th>
                  <th className="p-3 text-left">Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-white/5 text-white">
                    <td className="p-3">{log.guardName}</td>
                    <td className="p-3">{log.checkpoint}</td>
                    <td className="p-3">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}
