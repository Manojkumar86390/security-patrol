'use client';

import React from 'react';
import SectionWithMockup from "@/components/blocks/section-with-mockup";
import { FileSpreadsheet, Download, Activity, ShieldCheck } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works">
      <SectionWithMockup
        title={
          <>
            Real-Time Patrol
            <br />
            Monitoring Dashboard
          </>
        }
        description={
          <>
            Track every guard&apos;s patrol activity in real-time. View checkpoint 
            visits, timestamps, and device status at a glance. Get instant 
            alerts for missed checkpoints and generate comprehensive reports 
            for compliance auditing.
          </>
        }
        primaryContent={
          <div className="h-full rounded-2xl border border-white/10 bg-[#0f1320] p-4 md:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-xs text-[#8ea1b5]">Live Patrol Monitoring</p>
                <p className="text-sm font-semibold text-white">Zone Activity (Last 60 Min)</p>
              </div>
              <span className="rounded-full bg-[#10d47e]/10 px-2 py-1 text-[10px] font-medium text-[#10d47e]">Live</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { zone: "Main Gate", checkIns: 18, status: "On Track" },
                { zone: "Server Wing", checkIns: 13, status: "Late Alert" },
                { zone: "Warehouse", checkIns: 16, status: "On Track" },
              ].map((item) => (
                <div key={item.zone} className="rounded-xl border border-white/5 bg-black/30 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-white">{item.zone}</p>
                    <p className="text-xs text-neutral-400">{item.checkIns} scans</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className={`h-1.5 rounded-full ${item.status === "Late Alert" ? "bg-[#f59e0b]" : "bg-[#2b7fff]"}`}
                      style={{ width: `${Math.min(item.checkIns * 5, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
        secondaryContent={
          <div className="h-full rounded-2xl border border-white/10 bg-[#0f1320] p-4 md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#2b7fff]" />
              <p className="text-xs font-medium text-white">Patrol Efficiency Trend</p>
            </div>
            <div className="flex h-[220px] items-end justify-between gap-2 rounded-xl border border-white/5 bg-black/30 p-3 md:h-[320px]">
              {[72, 78, 75, 84, 88, 91, 94].map((value, index) => (
                <div key={index} className="flex w-full flex-col items-center gap-2">
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-[#2b7fff] to-[#10d47e]"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-[10px] text-neutral-500">D{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <SectionWithMockup
        title={
          <>
            ESP32 Device
            <br />
            Management Console
          </>
        }
        description={
          <>
            Register, monitor, and manage all your ESP32 checkpoint devices from 
            one central console. Track device health, online/offline status, and 
            last heartbeat timestamps. Configure BLE scanning parameters and 
            checkpoint assignments with ease.
          </>
        }
        primaryContent={
          <div className="h-full rounded-2xl border border-white/10 bg-[#0f1320] p-4 md:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <p className="text-sm font-semibold text-white">Device Status Board</p>
              <span className="text-xs text-neutral-400">18 Online / 2 Offline</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { id: "ESP-001", point: "Main Gate", state: "Online" },
                { id: "ESP-003", point: "Lobby", state: "Online" },
                { id: "ESP-007", point: "Parking A", state: "Offline" },
                { id: "ESP-011", point: "Server Room", state: "Online" },
              ].map((device) => (
                <div key={device.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-white">{device.id}</p>
                    <p className="text-[11px] text-neutral-500">{device.point}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${device.state === "Online" ? "bg-[#10d47e]/10 text-[#10d47e]" : "bg-[#ef4444]/10 text-[#ef4444]"}`}>
                    {device.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        }
        secondaryContent={
          <div className="h-full rounded-2xl border border-white/10 bg-[#0f1320] p-4 md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#10d47e]" />
              <p className="text-xs font-medium text-white">Checkpoint Compliance</p>
            </div>
            <div className="space-y-4 rounded-xl border border-white/5 bg-black/30 p-4">
              {[
                { label: "Visited on time", value: 91, color: "bg-[#10d47e]" },
                { label: "Late visits", value: 7, color: "bg-[#f59e0b]" },
                { label: "Missed", value: 2, color: "bg-[#ef4444]" },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-neutral-300">{metric.label}</span>
                    <span className="text-white">{metric.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className={`h-2 rounded-full ${metric.color}`} style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
        reverseLayout
      />

      <SectionWithMockup
        title={
          <>
            Export Full Patrol Data
            <br />
            to Excel & CSV Reports
          </>
        }
        description={
          <>
            Every patrol event can be stored and exported with guard ID, checkpoint,
            timestamp, BLE device ID, and verification status. Download daily or weekly
            reports in Excel or CSV for audits, management reviews, and compliance records.
          </>
        }
        primaryContent={
          <div className="h-full rounded-2xl border border-white/10 bg-[#0f1320] p-4 md:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-[#2b7fff]" />
                <p className="text-sm font-semibold text-white">Report Export Center</p>
              </div>
              <span className="text-xs text-neutral-400">Ready</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {[
                "Daily Patrol Summary - 2026-05-08.xlsx",
                "Weekly Compliance Report - Week 18.csv",
                "Missed Checkpoint Alerts - 2026-05.xlsx",
              ].map((file) => (
                <div key={file} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3 py-2">
                  <p className="text-xs text-neutral-300">{file}</p>
                  <button className="inline-flex items-center gap-1 rounded-lg bg-[#2b7fff]/15 px-2 py-1 text-[10px] font-medium text-[#2b7fff]">
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        }
        secondaryContent={
          <div className="h-full rounded-2xl border border-white/10 bg-[#0f1320] p-4 md:p-5">
            <p className="mb-3 text-xs font-medium text-white">Included Columns</p>
            <div className="rounded-xl border border-white/5 bg-black/30 p-3">
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                {[
                  "Guard ID",
                  "Guard Name",
                  "Checkpoint",
                  "Date",
                  "Time",
                  "Device ID",
                  "Status",
                  "Shift",
                ].map((col) => (
                  <div key={col} className="rounded-md border border-white/5 bg-[#111827] px-2 py-1.5">
                    {col}
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />
    </section>
  );
}
