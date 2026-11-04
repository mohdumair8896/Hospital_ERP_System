'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { Calendar, Stethoscope, Search, AlignRight, Phone } from 'lucide-react';
import SearchModal from './SearchModal';
import SidebarDrawer from './SidebarDrawer';
import MobileMenu, { type NavLink } from './sections/discovery/MobileMenu';

interface NavbarProps {
  onOpenBooking?: () => void;
}

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
const ICON_BUTTON = `rounded-full p-2.5 text-prohealth-body transition-colors duration-250 hover:bg-secondary hover:text-primary ${RING}`;

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Departments', href: '/departments' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Timetable', href: '/timetable' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'Contact', href: '/contact' },
];

/** Compact after 80px of scroll; back to full height under 60px (no flicker at the edge). */
function useCompactHeader() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  useEffect(() => setCompact(window.scrollY > 80), []);
  useMotionValueEvent(scrollY, 'change', (y) => {
    setCompact((was) => (was ? y > 60 : y > 80));
  });
  return compact;
}

/**
 * Site header. After 80px of scroll it condenses into a floating pill: the
 * full-width bar fades out and a rounded bar fades and scales in behind the
 * same content (opacity and transform only, no height change). The emergency
 * number is visible at every width and scroll position. Below 1280px the links
 * move into a full-screen menu on Radix Dialog.
 */
export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const pathname = usePathname();
  const compact = useCompactHeader();

  const handleBookingClick = (e: React.MouseEvent) => {
    if (onOpenBooking) {
      e.preventDefault();
      onOpenBooking();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* Full-width bar (top of page) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 border-b border-border bg-white/95 shadow-soft backdrop-blur-md transition-opacity duration-400 ease-out-soft ${
            compact ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="relative flex h-16 items-center justify-between gap-2 sm:gap-3 lg:h-20">
            {/* Floating pill (after scrolling) */}
            <div
              aria-hidden="true"
              className={`absolute -inset-x-2 inset-y-1.5 rounded-pill border border-border bg-white/90 shadow-lift backdrop-blur-md transition-[opacity,transform] duration-400 ease-out-soft sm:-inset-x-4 lg:inset-y-3 ${
                compact ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0'
              }`}
            />

            {/* Brand */}
            <Link href="/" className={`group relative flex shrink-0 items-center gap-2.5 rounded-xl ${RING}`}>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform duration-400 ease-out-soft sm:h-10 sm:w-10 ${
                  compact ? 'scale-90' : 'scale-100'
                }`}
              >
                <Stethoscope className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="flex items-center gap-1.5 font-display text-lg font-extrabold tracking-tight text-prohealth-heading sm:text-xl">
                  <span>
                    Pro<span className="text-prohealth-secondary">Health</span>
                  </span>
                  <span className="ml-1 hidden rounded-pill border border-primary/20 bg-secondary px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary 2xl:inline">
                    Hospital
                  </span>
                </span>
                <span
                  className={`hidden text-xs font-medium text-prohealth-muted transition-opacity duration-250 sm:block ${
                    compact ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  Academic Medical Center
                </span>
              </span>
            </Link>

            {/* Desktop links */}
            <nav aria-label="Main" className="relative hidden items-center gap-5 text-sm font-semibold text-prohealth-body xl:flex">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative rounded-md py-1 transition-colors duration-250 ${
                      isActive
                        ? 'text-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary'
                        : 'hover:text-primary'
                    } ${RING}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="relative flex items-center gap-1 sm:gap-2">
              <a
                href="tel:876256876"
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-pill bg-alert px-2.5 py-2 text-[13px] font-semibold text-white transition-colors duration-250 hover:bg-alert-strong min-[360px]:gap-1.5 min-[360px]:px-3 min-[360px]:text-sm ${RING}`}
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                {/* The label is visible when there is room; the number always is. */}
                <span className="sr-only md:not-sr-only xl:sr-only 2xl:not-sr-only">Ambulance</span>
                <span>876-256-876</span>
              </a>

              <button type="button" onClick={() => setSearchModalOpen(true)} className={`hidden sm:block ${ICON_BUTTON}`} aria-label="Search site">
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setSidebarDrawerOpen(true)}
                className={`hidden md:block ${ICON_BUTTON}`}
                aria-label="Open information sidebar"
              >
                <AlignRight className="h-5 w-5" aria-hidden="true" />
              </button>

              <Link
                href="/appointments"
                onClick={handleBookingClick}
                className={`hidden items-center gap-2 rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors duration-250 hover:bg-prohealth-primary-hover sm:flex ${RING}`}
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Appointment</span>
              </Link>

              <MobileMenu
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
                links={NAV_LINKS}
                pathname={pathname}
                onOpenSearch={() => setSearchModalOpen(true)}
                onOpenBooking={onOpenBooking}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onOpen={() => setSearchModalOpen(true)}
      />

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer
        isOpen={sidebarDrawerOpen}
        onClose={() => setSidebarDrawerOpen(false)}
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
