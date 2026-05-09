'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'login' | 'code' | 'success'>('login');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setStep('code');
    }
  };

  useEffect(() => {
    if (step === 'code') {
      setTimeout(() => codeInputRefs.current[0]?.focus(), 500);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) codeInputRefs.current[index + 1]?.focus();
      if (index === 5 && value) {
        const isComplete = newCode.every(d => d.length === 1);
        if (isComplete) {
          setTimeout(() => setStep('success'), 1000);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-[#080b10] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(43,127,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,212,126,0.08),transparent_50%)]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2b7fff] to-[#0055dd] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold tracking-tight">SecurePatrol</span>
        </Link>
        <Link href="/" className="text-neutral-400 text-sm hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center items-center px-4">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {step === 'login' ? (
              <motion.div
                key="login-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8 text-center"
              >
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2b7fff] to-[#0055dd] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#2b7fff]/20">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">Secure Admin Portal</h1>
                  <p className="text-neutral-400">Sign in to access patrol monitoring</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Username or Admin ID"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#111827]/80 text-white border border-white/10 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#2b7fff]/50 focus:ring-1 focus:ring-[#2b7fff]/30 transition-all placeholder:text-neutral-500"
                      required
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#111827]/80 text-white border border-white/10 rounded-xl py-3.5 px-4 pr-12 focus:outline-none focus:border-[#2b7fff]/50 focus:ring-1 focus:ring-[#2b7fff]/30 transition-all placeholder:text-neutral-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#2b7fff] to-[#0055dd] text-white rounded-xl py-3.5 font-semibold hover:shadow-lg hover:shadow-[#2b7fff]/25 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-xs text-neutral-500 pt-4">
                  Authorized personnel only. All access attempts are logged.
                </p>
              </motion.div>
            ) : step === 'code' ? (
              <motion.div
                key="code-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white">Verification Code</h1>
                  <p className="text-neutral-400">Enter the 6-digit code sent to your device</p>
                </div>

                <div className="relative rounded-xl py-4 px-5 border border-white/10 bg-[#111827]/50">
                  <div className="flex items-center justify-center">
                    {code.map((digit, i) => (
                      <div key={i} className="flex items-center">
                        <div className="relative">
                          <input
                            ref={(el) => { codeInputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleCodeChange(i, e.target.value)}
                            onKeyDown={e => handleKeyDown(i, e)}
                            className="w-8 text-center text-xl bg-transparent text-white border-none focus:outline-none focus:ring-0 appearance-none"
                            style={{ caretColor: 'transparent' }}
                          />
                          {!digit && (
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                              <span className="text-xl text-neutral-600">0</span>
                            </div>
                          )}
                        </div>
                        {i < 5 && <span className="text-white/20 text-xl">|</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex w-full gap-3">
                  <button
                    onClick={() => { setStep('login'); setCode(['', '', '', '', '', '']); }}
                    className="rounded-xl bg-[#111827] text-white font-medium px-6 py-3 border border-white/10 hover:bg-[#1e293b] transition-colors w-[30%]"
                  >
                    Back
                  </button>
                  <button
                    className={`flex-1 rounded-xl font-medium py-3 transition-all duration-300 ${
                      code.every(d => d !== '')
                        ? "bg-gradient-to-r from-[#2b7fff] to-[#0055dd] text-white hover:shadow-lg hover:shadow-[#2b7fff]/25 cursor-pointer"
                        : "bg-[#111827] text-neutral-500 border border-white/10 cursor-not-allowed"
                    }`}
                    disabled={!code.every(d => d !== '')}
                  >
                    Verify
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white">Access Granted</h1>
                  <p className="text-neutral-400">Welcome to the Security Dashboard</p>
                </div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="py-8"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#10d47e] to-[#059669] flex items-center justify-center shadow-2xl shadow-[#10d47e]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.div>

                <Link
                  href="/dashboard"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2b7fff] to-[#0055dd] text-white font-medium py-3 hover:shadow-lg hover:shadow-[#2b7fff]/25 transition-all"
                >
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
