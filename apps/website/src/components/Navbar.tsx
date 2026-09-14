'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, User, Menu, X, Stethoscope, Search, AlignRight, Clock } from 'lucide-react';
import SearchModal from './SearchModal';
import SidebarDrawer from './SidebarDrawer';

interface NavbarProps {
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Departments', href: '/departments' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Timetable', href: '/timetable' },
    { label: 'Appointments', href: '/appointments' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleBookingClick = (e: React.MouseEvent) => {
    if (onOpenBooking) {
      e.preventDefault();
      onOpenBooking();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <div className="flex justify-between items-center h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-prohealth-primary text-white flex items-center justify-center font-bold shadow-md shadow-prohealth-primary/20 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1 font-display">
                  Pro<span className="text-prohealth-secondary">Health</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-prohealth-ice text-prohealth-primary ml-1 border border-prohealth-primary/20">
                    Hospital
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Academic Medical Center</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors py-1 ${
                      isActive
                        ? 'text-prohealth-primary font-bold border-b-2 border-prohealth-primary'
                        : 'hover:text-prohealth-secondary'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2.5 rounded-full text-slate-600 hover:text-prohealth-primary hover:bg-prohealth-ice/60 transition-colors"
                aria-label="Search site"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Sidebar Drawer Toggle */}
              <button
                onClick={() => setSidebarDrawerOpen(true)}
                className="p-2.5 rounded-full text-slate-600 hover:text-prohealth-primary hover:bg-prohealth-ice/60 transition-colors"
                aria-label="Open information sidebar"
              >
                <AlignRight className="w-5 h-5" />
              </button>

              {/* Timetable Link */}
              <Link
                href="/timetable"
                className="flex items-center gap-1.5 text-slate-700 hover:text-prohealth-primary px-3.5 py-2.5 rounded-full text-xs font-bold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <Clock className="w-3.5 h-3.5 text-prohealth-primary" />
                <span>Timetable</span>
              </Link>

              {/* Book Appointment Pill */}
              <Link
                href="/appointments"
                onClick={handleBookingClick}
                className="flex items-center gap-2 bg-prohealth-primary hover:bg-prohealth-primary-hover text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-prohealth-primary/20 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Appointment</span>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-1.5">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/appointments"
                onClick={handleBookingClick}
                className="bg-prohealth-primary text-white p-2 rounded-lg text-xs font-semibold flex items-center gap-1"
                aria-label="Book Appointment"
              >
                <Calendar className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-3 duration-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm py-2.5 px-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-prohealth-ice text-prohealth-primary font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-prohealth-primary'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/appointments"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (onOpenBooking) {
                    e.preventDefault();
                    onOpenBooking();
                  }
                }}
                className="w-full bg-prohealth-primary hover:bg-prohealth-primary-hover text-white py-3 rounded-full font-bold text-xs text-center flex items-center justify-center gap-2 shadow-md"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment Now
              </Link>
              <Link
                href="/timetable"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-full font-semibold text-xs text-center flex items-center justify-center gap-2 border border-slate-200"
              >
                <Clock className="w-4 h-4 text-prohealth-primary" />
                Clinic Timetable &amp; OPD Shifts
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Instant Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer
        isOpen={sidebarDrawerOpen}
        onClose={() => setSidebarDrawerOpen(false)}
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}

