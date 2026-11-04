/**
 * Shared ProHealth design tokens for apps/website and apps/erp (Tailwind 3 preset).
 *
 * - Semantic shadcn-style colors (background, primary, muted, sidebar, ...) backed by
 *   CSS variables so opacity modifiers like `bg-muted/40` work.
 * - tailwindcss-animate for `animate-in`, `fade-in`, `zoom-in`, `slide-in-*`.
 * - Shims for Tailwind v4 class names used by the copied UI components.
 * - Class-based dark mode, so stray `dark:` utilities no longer follow the OS setting.
 */
const plugin = require('tailwindcss/plugin');

const token = (name) => `hsl(var(--${name}) / <alpha-value>)`;

// HSL channels derived from the ProHealth palette in each app's tailwind.config.js
const lightTokens = {
  '--background': '0 0% 100%',
  '--foreground': '214 33% 17%', // #1D2939 heading
  '--card': '0 0% 100%',
  '--card-foreground': '214 33% 17%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '214 33% 17%',
  '--primary': '211 62% 32%', // #1F5084 deep trust blue
  '--primary-foreground': '0 0% 100%',
  '--secondary': '208 55% 95%', // #EAF2F9 ice
  '--secondary-foreground': '211 62% 32%',
  '--muted': '207 58% 96%', // #F0F6FB tint
  '--muted-foreground': '221 13% 46%', // #667085
  '--accent': '208 55% 95%',
  '--accent-foreground': '211 62% 32%',
  '--destructive': '0 72% 51%', // #DC2626
  '--destructive-foreground': '0 0% 100%',
  '--border': '218 17% 91%', // #E4E7EC
  '--input': '218 17% 91%',
  '--ring': '210 64% 47%', // #2B78C6
  '--sidebar': '0 0% 100%',
  '--sidebar-foreground': '214 33% 17%',
  '--sidebar-primary': '211 62% 32%',
  '--sidebar-primary-foreground': '0 0% 100%',
  '--sidebar-accent': '208 55% 95%',
  '--sidebar-accent-foreground': '211 62% 32%',
  '--sidebar-border': '218 17% 91%',
  '--sidebar-ring': '210 64% 47%',
};

module.exports = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        background: token('background'),
        foreground: token('foreground'),
        card: { DEFAULT: token('card'), foreground: token('card-foreground') },
        popover: { DEFAULT: token('popover'), foreground: token('popover-foreground') },
        primary: { DEFAULT: token('primary'), foreground: token('primary-foreground') },
        secondary: { DEFAULT: token('secondary'), foreground: token('secondary-foreground') },
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        accent: { DEFAULT: token('accent'), foreground: token('accent-foreground') },
        destructive: { DEFAULT: token('destructive'), foreground: token('destructive-foreground') },
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        sidebar: {
          DEFAULT: token('sidebar'),
          foreground: token('sidebar-foreground'),
          primary: token('sidebar-primary'),
          'primary-foreground': token('sidebar-primary-foreground'),
          accent: token('sidebar-accent'),
          'accent-foreground': token('sidebar-accent-foreground'),
          border: token('sidebar-border'),
          ring: token('sidebar-ring'),
        },
        // Accessible accents; every fg/bg pair below passes WCAG AA for body text
        care: { DEFAULT: '#0F766E', soft: '#ECFDF5' },
        sand: { DEFAULT: '#F7F4EE' },
        alert: { DEFAULT: '#B91C1C', strong: '#991B1B', soft: '#FEF2F2' },
        dept: {
          blue: { bg: '#EAF2F9', fg: '#1F5084' },
          green: { bg: '#ECFDF5', fg: '#0F766E' },
          amber: { bg: '#FFFBEB', fg: '#92400E' },
          rose: { bg: '#FFF1F2', fg: '#9F1239' },
        },
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 1.5rem + 4.5vw, 5rem)', { lineHeight: '1.04', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-lg': ['clamp(2.25rem, 1.4rem + 3vw, 3.75rem)', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '700' }],
        lead: ['1.1875rem', { lineHeight: '1.6' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.12em', fontWeight: '600' }],
      },
      spacing: {
        section: 'clamp(4rem, 2.5rem + 6vw, 8rem)',
      },
      borderRadius: {
        card: '1.25rem',
        panel: '2rem',
        pill: '9999px',
      },
      boxShadow: {
        // Tailwind v4 names (v4 `shadow-xs` equals v3 `shadow-sm`)
        '2xs': '0 1px rgb(0 0 0 / 0.05)',
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        soft: '0 1px 2px rgb(16 24 40 / 0.04), 0 4px 16px -4px rgb(16 24 40 / 0.06)',
        lift: '0 18px 40px -18px rgb(31 80 132 / 0.28)',
        'glow-primary': '0 18px 60px -20px rgb(43 120 198 / 0.45)',
      },
      backdropBlur: {
        xs: '4px',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
        600: '600ms',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        drift: { '0%, 100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(2%,-2%,0)' } },
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'fade-up': 'fade-up 450ms cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 40s linear infinite',
        drift: 'drift 10s ease-in-out infinite',
        'accordion-down': 'accordion-down 200ms ease-out',
        'accordion-up': 'accordion-up 200ms ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ addBase, addUtilities }) => {
      addBase({
        ':root': lightTokens,
        '@media (prefers-reduced-motion: reduce)': {
          html: { scrollBehavior: 'auto' },
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      });
      // v4 `outline-hidden` (v3 calls this `outline-none`)
      addUtilities({
        '.outline-hidden': { outline: '2px solid transparent', outlineOffset: '2px' },
      });
    }),
  ],
};
