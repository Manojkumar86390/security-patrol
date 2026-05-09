'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current);
    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => setHeaderShapeClass('rounded-full'), 300);
    }
    return () => { if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current); };
  }, [isOpen]);

  const navLinksData = [
    { label: 'Features', href: '#features' },
    { label: 'Technology', href: '#technology' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Dashboard', href: '#dashboard' },
  ];

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       px-6 py-3 backdrop-blur-md
                       ${headerShapeClass}
                       border border-[#1e293b] bg-[#0a0d14]/80
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-all duration-300 ease-in-out
                       ${scrolled ? 'shadow-lg shadow-blue-500/5' : ''}`}>
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2b7fff] to-[#0066ff] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight hidden sm:block">SecurePatrol</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinksData.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link href="/login" className="px-4 py-2 text-sm border border-[#1e293b] bg-[rgba(15,19,32,0.62)] text-gray-300 rounded-full hover:border-[#2b7fff]/50 hover:text-white transition-colors duration-200 whitespace-nowrap">
            Log In
          </Link>
          <div className="relative group">
            <div className="absolute inset-0 -m-1 rounded-full bg-[#2b7fff] opacity-30 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-50 group-hover:blur-xl group-hover:-m-2"></div>
            <Link href="/dashboard" className="relative z-10 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-[#2b7fff] to-[#0055dd] rounded-full hover:from-[#3d8fff] hover:to-[#0066ff] transition-all duration-200 whitespace-nowrap">
              Dashboard
            </Link>
          </div>
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" onClick={toggleMenu}>
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors w-full text-center">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-3 mt-4 w-full">
          <Link href="/login" className="px-4 py-2 text-sm border border-[#1e293b] bg-[rgba(15,19,32,0.62)] text-gray-300 rounded-full hover:border-[#2b7fff]/50 hover:text-white transition-colors w-full text-center">
            Log In
          </Link>
          <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-[#2b7fff] to-[#0055dd] rounded-full w-full text-center">
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
