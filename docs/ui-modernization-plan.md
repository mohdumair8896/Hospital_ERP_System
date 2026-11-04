# ProHealth UI Modernization Plan

Sources: design research on scrolltide.co/sections, details.so/inspo (300 entries, 65 recordings studied), inspomcp.dev and Nutlope/inspo, and refero.design, plus a code audit of `apps/website` and `apps/erp`. Pattern IDs (C01, P-CMD-1, ...) refer to the research catalogs.

## 1. Principles

- **Website: calm, scroll-linked motion.** The health sites in the research use slow reveals, sticky media, stacked cards and staggered entrances, not flashy effects. Reveals take 400–450ms and move 12–16px. Hover lifts are 4px or less, and image zooms are 1.04x or less.
- **ERP: micro-interactions only (150–250ms).** No scroll choreography, pinning or parallax. Motion should explain a state change, such as a row arriving, a panel opening or a status changing.
- **Never hide urgent information behind animation.** No preloaders. Emergency numbers, the booking CTA and wait times show on first paint. Animate only `transform` and `opacity`.
- **Respect reduced motion everywhere.** Wrap each app in `<MotionConfig reducedMotion="user">` and guard scroll-linked effects with `useReducedMotion()`. Decorative CSS animations (pulse, marquee, drift) use `motion-safe:`. The shared preset already zeroes CSS animation durations under `prefers-reduced-motion`.
- **Content that moves on its own needs a pause control** (WCAG 2.2.2), must pause on hover and focus, and must never carry critical information.
- **Hover is never the only way to reveal content.** Mirror it with `focus-visible`, and show the content by default on `(hover: none)` devices.
- **WCAG 2.1 AA.** `#3B82F6` (3.68:1), `#0284C7` (4.10:1) and the old `#EF4444` (3.76:1) fail AA as body text on white. Use them only for large text, icons or borders, and use `primary`, `alert` and `care` for text.

## 2. Foundation (done, shared)

| Piece | Where |
|---|---|
| Semantic shadcn tokens (`background`, `primary`, `muted`, `sidebar`, ...) backed by CSS variables | `tailwind.preset.cjs` |
| `tailwindcss-animate` (`animate-in`, `fade-in`, `zoom-in`, `slide-in-*`) | preset |
| Shims for Tailwind v4 classes (`shadow-xs`, `shadow-2xs`, `backdrop-blur-xs`, `outline-hidden`) | preset |
| `darkMode: ['class']`, so stray `dark:` classes no longer follow the OS | preset |
| Global `prefers-reduced-motion` rule | preset |
| Accessible accents: `care`, `sand`, `alert`, `dept-{blue,green,amber,rose}-{bg,fg}` | preset |
| Type: `text-display-{xl,lg,md}`, `text-lead`, `text-eyebrow`; spacing `py-section`; radius `rounded-card` / `rounded-panel` / `rounded-pill` | preset |
| Shadows `soft` / `lift` / `glow-primary`; easing `ease-out-soft` / `ease-in-out-soft`; `duration-250` / `duration-400` / `duration-600` | preset |
| Keyframes `fade-up`, `marquee`, `drift`, `accordion-down`, `accordion-up` | preset |
| `brand.emergency` changed to `#DC2626` (4.83:1) | both app configs |
| Dependencies: framer-motion 11.18.2, @radix-ui/react-accordion (both apps); cmdk 1.1.1 and @radix-ui/react-popover (ERP) | package.json |

## 3. Website (`apps/website`)

### P0
| Area | Change | Pattern |
|---|---|---|
| Motion foundation | `components/motion/` (`Reveal`, `Stagger`, `CountUp`); a client `MotionProvider` in `app/layout.tsx`; a soft fade in `app/template.tsx` | C01, C33 |
| HeroSection | Staggered headline with one accent word; a floating "next available appointment" card and wait-time chip built from real components; calm CTA hover; the hero fits 1280x800 | C42, C01, C41 |
| StatsAndTrust | Count-up stats on scroll into view (final numbers stay in the DOM); accreditation marquee with a pause button and a static grid under reduced motion | C05, C27 |
| DepartmentsShowcase | Tabbed split card with a pastel per department (Radix Tabs, `layoutId` underline, crossfade); skeleton while loading; check `res.ok` | C20 |
| DoctorDirectory | Filter chips with layout animation; `AnimatePresence` grid; card lift, media zoom and action chip; skeleton | C13 |
| AppointmentSection | Journey accordion (Book, Prepare, Visit, Follow-up) that widens on hover/focus on desktop and becomes a vertical accordion on mobile | C24 |
| Booking wizard | Animated step transitions and progress bar; focus moves to each step heading; real `<button>` cards; labels tied to inputs; consent unchecked by default | P-FORM-3, C40 |
| PatientReviews | Expanding-card carousel with outcome facts, no autoplay, `aria-expanded` | C21 |
| FAQSection | Grouped two-column FAQ on Radix Accordion with height animation, plus a "talk to our help desk" card; no card lift on accordion rows | C25 |
| HealthInsights | Card lift, image zoom, "Read" chip, accent title on hover | C13, C16 |
| Policy pages | Sticky table of contents with scroll-spy (`aria-current`) | Diffusion LE1 |
| Timetable (bug) | Department filter IDs don't match the row data, so most filters show an empty grid. Fix the IDs, add an empty state, a sticky header and row hover | — |
| Floating buttons (bug) | EmergencyFAB and the triage launcher both sit at `bottom-6 right-6`. Separate them, and move infinite pulses behind `motion-safe:` | — |
| Accessibility | Add accessible names to icon-only buttons; give hand-rolled modals `role="dialog"`, Escape to close and focus return (or move them to Radix Dialog) | audit §6 |

### P1
- Navbar: condenses into a pill on scroll; full-screen mobile menu (C30); the emergency number stays visible.
- Footer: ghost wordmark and newsletter pill (C36, C37).
- departments/[id]: stacked service cards and "what to expect" steps (C04, C40).
- doctors/[id]: sticky booking card next to the bio.
- blog/[slug]: reading progress bar.
- about: history timeline (C11).
- contact: visit information, three contact tiles, opening hours (C38).

### Not doing
Preloaders, pixel dissolves, 3D card flips, cursor trails, autoplaying video, and dark mode for the website.

## 4. ERP (`apps/erp`)

### P0
| Area | Change | Pattern |
|---|---|---|
| Motion and primitives | `MotionConfig` at the root, plus shared `Sheet` (a side panel built on Radix Dialog), `KpiCard`, `EmptyState`, `Skeleton`, `StatusPill` and `PatientBanner` | — |
| App shell | Active-item indicator that slides between menu items (`layoutId`); fix the sidebar badge layout; tab state kept in the URL; **bug:** the role's default tab is not applied after a reload | — |
| Command palette | Cmd/Ctrl+K: navigate between screens, find a patient by name or MRN through the API, run quick actions; grouped results and keyboard hints | P-CMD-1 |
| Notifications | Bell popover with grouped items and an "All clear" empty state; sonner toasts | P-NOTIF-1/2 |
| Analytics | KPI strip with count-up and delta pills; bento grid of charts; time-range control; a skeleton or empty state per widget; tokens instead of slate classes | P-DASH-1..4, C35 |
| Reception Desk | Queue with status pills and wait-time badges; animated row changes; side panel for patient detail and check-in; registration form with labels and inline validation | P-TBL-2, C31, P-FORM-4 |
| Clinical Workbench | Sticky patient banner (name, MRN, age/sex, allergies chip, attending, encounter status); tabs with a sliding underline (SOAP / Vitals / e-Rx / History); labelled vitals inputs with focus rings; keyboard-accessible queue; loading and empty states | P-REC-1 |
| Audit Log | Readable rows (actor, action pill, plain-language description, time); filter toolbar; sticky header; side panel with the raw record, hash and verification badge; **bug:** the disclosures toast reads `totalDisclosures`, but the API returns `disclosuresCount` | P-TBL-5 |
| Security (UI) | Remove LoginScreen's client-side fallback, which mints tokens without the server | — |

### P1
- Staff Provisioning: replace the hand-rolled modals with Dialog; numbered onboarding steps; first-run checklist.
- Integration monitor: live service health from `/api/v1/gateway/status` with status pills and last-checked times (it is fully static today).
- Login: help-desk link.

### Not doing in this pass
Dark/night-shift theme (needs every hardcoded colour removed first), a scheduler time grid (needs a decision on a library), and new backend modules. For those, see `docs/hospital-erp-benchmark.md`.

## 5. Definition of done (both apps)

- `npx tsc --noEmit` passes in the app.
- No console errors on any page or screen, checked in the browser with the backend running.
- Every changed interactive element is keyboard-reachable with a visible focus ring.
- Reduced motion has been checked (emulate `prefers-reduced-motion: reduce`).
- Pages work at 375px and at 1280px widths.
- No API contract changes and no backend edits. The existing `apiFetch` auth helper stays in use.
