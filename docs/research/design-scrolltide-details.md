# Design Inspiration Research: Section and Component Patterns

Status: complete

Sources: https://www.scrolltide.co/sections and https://www.details.so/inspo
Purpose: inspiration for redesigning apps/website (Next.js 14) and apps/erp (React 18 + Vite).
Note: all patterns are described in our own words. No proprietary code, copy or assets were copied.

Research log tags (A1 to A4 for scrolltide, B1 to B31 for details.so) are used as source references throughout. The raw log follows the five report sections.

## 1. Site-by-site inventory

### 1a. scrolltide.co/sections (20 sections, all inspected)
What it is: a library of paid AI prompts, one per landing-page band. Each card opens a modal with a long description, tags and a preview. The prompt text is paywalled. 18 previews are static images and 2 are looping videos.

| Category | Items | Notable patterns |
|---|---|---|
| Footer | 9 | Oversized or cropped wordmarks (Wordmark Bleed, Portfolio Close, River Valley ghost serif), illustrated or photographic landscape bases (Lighthouse Toile, Dune Card, River Valley, Fog Forest, Loom skyline), shaped mountain top edge (Snow Summit), looping character video bleeding off the edge (Bean Bag Nap), floating copyright pill, newsletter panels |
| CTA | 2 | CTA and footer merged into one band over a photo (Meadow Capture, Hill Country), glass email-capture pill with an inline button, an inline icon chip inside the headline |
| Features | 4 | Asymmetric 5-card bento inside one dark container (Service Bento), 3D-render card grid with an italic-serif headline clause (Render Grid), bento built from real product-UI fragments with a chart callout (Ledger Bento), 3 cards each with a mini chart (bar, donut, stepped area) and one accent-filled hero card (Lime Metrics) |
| Contact | 4 | Form as the main content with a photo card and 3 contact tiles (Route Booking), promise checklist next to a form over a ghost wordmark (Studio Enquiry), form-free contact column with a color bloom and dotted grid (Contact Column), glass form over a corner glow (Signal Form) |
| Pricing | 1 | Glass tier cards, check lists, a monthly/yearly toggle, a ghost "pricing" wordmark and a floating pill navbar (Tier Cards) |

Interaction details seen on the site itself: on card hover the card lifts about 4px, the border brightens, a tinted glow shadow appears, the inner media zooms about 4% on a slower curve, and a "Preview" chip slides up and fades in. Focus-visible gets a tinted border. Video previews play muted, looped and inline, with a poster image. A numbered 3-step "how it works" strip appears in each modal.

### 1b. details.so/inspo (taxonomy of 3,300+ recorded examples; 300 reachable without an account)
What it is: a gallery of short screen recordings of real websites, tagged by pattern. Entries carry no written description, so motion was read from sampled frames. Counts are the numbers the site shows.

| Group | Category (count) | Notable patterns seen in sampled entries |
|---|---|---|
| UI Elements | 3D (73), Accordion (53), Button (174), Card (69), Carousel (135), List (116), Modal (69), Rows (79) | Horizontal journey accordion (Calendly), tabbed split-card carousel (Google Health), expanding-card carousel (Lovable), side-sheet modal (Linear), list with a cursor-following portrait (Griflan), dithered button fill (Heron), hover-animated line icons (Heron), stacked feature rows (OhMD), ambient 3D ribbons (Cerebrium) |
| Structure | CTA (31), Footer (337), Hero (405), Legal (14), Navigation (242), Drawer (57), Dropdown (74), Fullscreen (69), Morphing (24) | Split-headline CTA reveal (Fitosauna), interactive footer canvas (Hone), sticky-media hero (Google Health), floating collage hero (Sundrop), compact menu card with a booking card (Odyssee clinic), pill-to-panel morph (Apple), corner card growing into a drawer (Likova), two-tier full-screen menu (LPAS), sticky-TOC legal page (Diffusion) |
| Page sections | 404 (79), Article (32), Blog (69), Case Study (95), Contact (124), Content (225), About (96), FAQ (27), Features (429), Services (97), Steps (27), Newsletter (10), Portfolio (239), Pricing (62), Products (34), Social Proof (149), Logo (31), Testimonial (91), Stats (60), Team (81), Timeline (19) | Radial stat stepper (CoMinVi), gauge and list cards (Clarasight), parallax stat cards (Virugroup), gradient hover stat tiles (Biograph), grouped FAQ (Tengile), FAQ with a human contact (bymonolog), dental-clinic numbered steps (General Dental x2), scroll-spy team list (Telha Clarke), profile carousel (Curo), gantt timeline (Eleken), editorial contact and visit page (ESR), sticky pricing table (Heron), illustrated 404 (Maxima therapy), long-read article (Fora) |
| Transitions and loading | Contextual (24), Page Transition (140), Preloader (244), Section Transition (109) | Color-coded page transitions (Milledollars), line-draw preloader (Heron), stepped mask reveal (Virugroup), pixel dissolve between sections (Transform9), element-led transition into a grid (Tux) |
| Scroll | Media Showcase (198), Scroll Animations (470), Horizontal Scroll (46), Parallax (66), Pinned Scroll (208), Stacked Scroll (92), Text Showcase (82) | Cascading collage (Offforum), horizontal word track (Santalarch), content curtain over a slow image (Tengile), rising columns (Neutomni), stacked tilted cards (Agrumea), stacked collapsing service cards (Transform9), 3D card flip with a step counter (/zeroz), rotating keyword headline (Ferndesk) |
| Pointer and hover | Card Hover (124), Cursor Interaction (135) | Sibling-dim spotlight (ONOERA), faded-until-hovered (Odyssee), image swap (Noho), sparkle tile (Visuvate), diagram linked to a list (Heron) |
| Industries | AI 133, Architecture 48, Art 49, Crypto 26, Education 39, Fashion 28, Finance 42, Food 29, Health 42, Hospitality 26, Industrial 76, Legal 1, Media 60, Music 21, Portfolio 71, Product Design 107, Real Estate 26, SaaS 162, Sports 24, Studio 202, Video 80 | Health was sampled in full (all 8 visible entries). Other industries are listed by count only. |
| Styles | Brutalist 53, Corporate 61, Editorial 277, Experimental 218, Image-led 197, Luxury 26, Maximalist 4, Minimal 243, Organic 4, Playful 40, Retro 17 | Listed by count only. Health entries lean Editorial, Minimal and Image-led (my inference from the frames). |
| Vault (paid kit) | Navigation 8, Carousels and Galleries 11, Button 6, UI Details 12, Hero 2, Scroll Sections 5, Text Reveal 6, Section Transition 4, Page Transition 10 | Not accessed (paid) |
| Built-with collections | Framer, Webflow, GSAP, Three.js | Listed only |

Sampling depth: 65 recordings were viewed: 9 Health entries plus 56 more covering 48 of the 51 pattern categories. Newsletter had no anonymous entries, and Portfolio and Products were listed only. The per-entry notes are in the research log (B3 to B31).

## 2. Consolidated pattern catalog (deduplicated)
Each pattern lists: name and category | seen in (log IDs) | layout | interaction and motion | why it's engaging | build notes for our stack. "Inferred" marks anything I did not see directly. Shared building blocks used throughout: framer-motion `motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useInView`, `LayoutGroup`, shared `layoutId`; Radix Accordion, Tabs, Dialog, Popover, NavigationMenu; lucide icons; recharts.

### A. Scroll-linked and reveal patterns
**C01 Staggered scroll reveal** (Scroll, entrance) | General Dental P1, Clarasight S2, Daylight P3, Exoape CS1 | Ordinary section grid | Children fade in and rise a short distance as the section enters the viewport, one after another | Cheap and calm, and it adds rhythm without hijacking scroll | A `<Reveal>` wrapper using `whileInView` with `viewport={{ once: true, amount: 0.25 }}`, y 16 to 0, opacity 0 to 1, 0.45s, stagger 0.06s. With reduced motion use opacity only. Base primitive for everything below.

**C02 Sticky media with text scrolling over it** (Hero, pinned) | Google Health H1 | Full-bleed photo, short headline bottom-left | The photo stays fixed while a longer statement and pill chips scroll up over it, then the photo is released | Carries a story in one image and feels cinematic but calm | Section height about 200vh. Inner `sticky top-0 h-screen` image. Text in normal flow on top, with a gradient scrim for contrast. Pure CSS sticky with no JS needed, plus optional `useScroll` to fade the scrim. Reduced motion needs nothing extra, since sticky is not animation.

**C03 Pinned split screen with swapped image** (Services, pinned) | Odyssee H2 | 50/50: text list on the left, image on the right | The right image is replaced as each text block passes, the new image wiping in from below via a clip reveal | Ties each item to a picture without carousel controls | Left column: blocks with `useInView` to set an active index. Right: `sticky` panel with images stacked absolutely; animate `clipPath: inset(100% 0 0 0)` to `inset(0)`. Fallback with reduced motion: crossfade or instant swap. Mobile: image above each block, no pinning.

**C04 Stacked scroll cards** (Features/Services/Steps, stacked) | Transform9 H5, Daylight P3, Agrumea SS1, OhMD RO1 | Column of full-width rounded cards | Each card is `sticky` with an increasing `top` offset so the next slides over it. Variants: the previous card collapses to its title strip (Transform9), recedes and tilts (Agrumea), or becomes a deeper shade of one hue (Transform9) | A natural reading order, the visible pile shows progress, and it suits 3 to 6 services | CSS `sticky top-[calc(5rem+var(--i)*3.5rem)]` on each card, plus optional `useScroll({target})` mapping progress to a scale of 1 to 0.95 for the receding card. Skip tilt and rotation for a hospital. Reduced motion: plain stacked list.

**C05 Pinned stat stepper and radial gauge** (Stats, pinned) | CoMinVi S1, Clarasight S2 | One big figure in a ring of ticks (or a gauge card beside a list card) | The ring fills tick by tick and the figure and label step to the next stat while pinned | Turns dry numbers into a focal moment | SVG ring from 60 to 80 `<line>` ticks or a `strokeDasharray` circle. Progress from `useScroll`, or `useInView` plus a count-up via `animate(0, value)`. Recharts `RadialBarChart` also works. Always render the final number in the DOM for screen readers (`aria-live` off). Reduced motion: show final values.

**C06 Parallax layers** (Parallax) | Virugroup S3 (stat cards over aerial photo), Google Health H9 (photo bands), Tengile PX1 (content curtain), Sundrop HE1 (scattered decorations), Offforum MS1 (cascading collage) | Full-bleed image with floating cards or decorations | Foreground cards or decorations move at a different rate from the background; a content panel slides up over a slower photo | Depth and a premium feel | `useScroll({ target, offset: ['start end','end start'] })` plus `useTransform(progress, [0,1], ['-8%','8%'])` on the image inside an `overflow-hidden` frame. Keep offsets small (under 10%). Disable under reduced motion with `useReducedMotion`.

**C07 Scroll-spy list with pinned media** (Team/Social proof, pinned) | Telha Clarke TM1, ESR SP1 | Very large list of names on the left, one image on the right | The item crossing a focal line turns dark and the pinned image swaps to match | Works for long rosters without cards, and feels editorial | Each row uses `useInView({ margin: '-45% 0px -45% 0px' })` to set the active id. Right panel is `sticky` with `AnimatePresence mode="popLayout"` image crossfade. Rows are buttons/links to the profile pages. Keyboard focus also sets active.

**C08 Horizontal track driven by vertical scroll** (Horizontal scroll) | Santalarch HS1, General Dental P2 | Row of words or columns wider than the viewport | Vertical scroll translates the row sideways; the centered item brightens and its image grows from a sliver; or numbered columns slide in and compress | Novel but readable when items are few (3 to 5) | Outer section `h-[300vh]`, inner `sticky h-screen overflow-hidden`, `x = useTransform(progress, [0,1], ['0%', '-66%'])`. Provide a non-pinned stacked fallback on mobile and with reduced motion. Use sparingly: one per site at most.

**C09 Pinned card flip with step counter** (Pinned) | /zeroz H8 | Card on the left, text on the right, large 01/03 counter | The card turns in 3D between faces (charts, brand card) as the copy changes | Shows 3 related data views in one spot | `rotateY` with `perspective` on a parent. Faces use `backface-visibility: hidden`. Index from scroll. Reduced motion: crossfade. Low priority for us.

**C10 Rising columns** (Pinned services) | Neutomni PS1 | 4 equal columns | Columns grow from the bottom at staggered heights (like bars), then settle into equal panels | A data-viz feel for a services grid | `scaleY` from 0.2 to 1 with `origin-bottom`, staggered. Could double as a calm "departments by volume" moment. Low priority.

**C11 Scroll-built timeline** (Timeline) | Eleken TL1, Eladio Dieste TL2 | Axis of phases/years with bars or photos | Bars appear in a staircase while a marker travels along them, or a centered year updates while photos glide past | Makes history or process tangible | Path or bars with `pathLength` or `scaleX` driven by `useScroll`. Markers use `useTransform`. Static fallback: an ordinary vertical list with years.

**C12 Section-to-section transitions** (Section transition, preloader) | Transform9 ST1 (pixel dissolve), Virugroup H4 (stepped mask reveal), Snow Summit (shaped divider), Tengile PX1 (curtain) | Boundary between dark and light sections | Grid squares fill in with stagger, a stepped mask eats away a color field, or a shaped edge (mountain silhouette) forms the boundary | Gives sections a branded seam | For us, prefer a static shaped divider (SVG wave or cross motif) or a soft gradient seam. A pixel dissolve is a CSS grid of squares with staggered opacity on `whileInView`, P2 at most.

### B. Hover, pointer and micro-interaction patterns
**C13 Card lift, glow and media zoom with a revealed action chip** (Card hover) | scrolltide listing (Log A2), Dessn CH1 | Rounded card: 16:9 media, title and meta below | On hover the card rises about 4px, the border brightens, a soft tinted shadow appears, the inner media scales about 1.04 on a slower curve than the card, and a small "view" chip slides up and fades in. Focus-visible mirrors the hover | Rich but quiet feedback, and the different timings feel physical | `group` plus `transition duration-500 ease-out-soft group-hover:-translate-y-1 group-hover:shadow-glow`, inner `duration-700 group-hover:scale-[1.04]`, chip `translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:...`. CSS only. Wrap in `motion-safe:`.

**C14 Spotlight hover: siblings dim, or faded until focused** (Card hover) | ONOERA H3, Odyssee CH3 | Row of 3 or 4 image cards | The hovered card stays vivid while siblings dim, or all start washed out and the hovered one restores color and reveals its description | Guides the eye across options | Parent `group/row`, children `group-hover/row:opacity-60 hover:!opacity-100`; or `grayscale opacity-60 hover:grayscale-0 hover:opacity-100`. Content must not be readable only on hover: show the text by default on touch devices (`@media (hover: none)`).

**C15 Gradient-fill stat tile** (Stats + card hover) | Biograph S4 | 3 square stat tiles | On hover a soft blurred gradient fills the tile and slowly shifts, and the number turns white | Makes static numbers feel alive | Absolute layer with `bg-[radial-gradient(...)] blur-2xl opacity-0 group-hover:opacity-100`, plus a slow `animate-[drift_8s_ease-in-out_infinite]` under `motion-safe`. Check contrast of white text on the lightest gradient stop.

**C16 Image swap and accent title on hover** (Testimonial, Blog) | Noho T1, LFS BL1 | Testimonial or news cards | The portrait swaps to a second photo and the card tint deepens, or the headline changes to the accent color | Feedback with zero layout shift | Two stacked `<Image>` elements with an opacity crossfade, or `group-hover:text-primary`. Cheap and accessible.

**C17 Button fill sweep** (Button) | Heron BU1 (dithered pixel fill) | Rectangular or pill button | The fill dissolves or sweeps from dark to light on hover | Clear affordance | Calm version: pseudo-element `before:scale-x-0 group-hover:before:scale-x-100 origin-left` behind the label. Keep text contrast AA in both states. The pixel/dither look is not recommended for a hospital.

**C18 Hover-animated line icons** (Card) | Heron CA1, Visuvate CH2 (sparkle) | Hairline grid of feature columns with line art | The line art redraws, rotates or gains detail on hover | A crafted feel at low cost | lucide icons are SVG strokes: animate `pathLength` from 0 to 1 with `motion.path`, or apply `stroke-dasharray` and `stroke-dashoffset` CSS on `group-hover`. Avoid the sparkle effect.

**C19 Cursor-following preview** (List, Cursor) | Griflan LI1, Maxima 404, Hone FO1 | List rows, or a playful canvas | A portrait follows the pointer over the hovered row; pupils follow the cursor (inferred); the cursor leaves a dot trail | Delight | `useMotionValue` for x and y plus `useSpring`. Pointer-fine only (`@media (pointer: fine)`), hidden from assistive technology. For us only the 404 eyes or a doctor-list preview, both P2.

### C. Carousels, tabs, accordions and text effects
**C20 Tabbed split-card carousel with per-slide color** (Carousel/Features) | Google Health C1 | One large rounded card: photo on one side, pastel panel on the other with title, copy and a bottom tab row with an underline indicator | Slides advance (autoplay inferred) and each has its own pastel and photo; the tab underline moves | Shows many categories in a calm, branded way | Radix Tabs with a framer-motion `layoutId` underline and an `AnimatePresence` crossfade of photo and panel. If autoplay is used, show a visible progress bar and a pause button, and pause on hover, focus and `prefers-reduced-motion` (WCAG 2.2.2).

**C21 Expanding-card carousel** (Testimonial) | Lovable T2 | Strip where the active card is wide (quote, person, 3 outcome metrics, link) and others are narrow logo tiles | Selecting a tile expands it while the previous one collapses | Pairs a story with proof numbers and invites browsing | Flex row with `layout` on each item and `flex-grow` animated via the `layout` prop. Collapsed tiles are buttons with `aria-expanded`. Mobile: vertical accordion.

**C22 Curved coverflow** (Testimonial carousel) | Dawn H6 (also Griflan T3, drag collage) | Cards fanned along a gentle arc, the center card opaque and larger | Prev/next rotates the fan | Warm and tactile | Position by offset from the active index: `x = d*260px`, `rotate = d*4deg`, `scale = 1 - |d|*0.08`, `opacity = 1 - |d|*0.35`. Optional `drag="x"` with snap. Respect reduced motion (no rotation).

**C23 Featured-profile carousel** (Team) | Curo Capital TM2 | Bio panel, a large portrait and a row of washed-out thumbnails | Arrows or thumbnail clicks swap the portrait and the bio together | One person at a time builds trust | `AnimatePresence` keyed by id. Thumbnails are a Radix ToggleGroup or buttons. Natural fit for "meet our specialists".

**C24 Horizontal hover accordion of journey stages** (Accordion/Features) | Calendly A1 | 4 columns (book, prepare, meet, follow up) | The active column widens and reveals a checklist and a small product-UI preview with a soft gradient glow at its base, while the others show title, one line and a faint big letter | Explains a multi-step service visually | Flex row, `layout` animation of `flex-basis` on hover and focus. On mobile becomes a Radix Accordion (vertical). The preview cards can be static JSX mocks of our booking UI.

**C25 FAQ accordions** (FAQ) | Hone F1, bymonolog F2, Tengile F3 | Single-open tinted panels; hairline rows with a hover highlight bar; grouped two-column layout (topic labels left, questions right) | Smooth height expand, the plus icon turns into a filled check or minus, the hover bar paints behind the row; a real person with a contact button sits beside the FAQ | Reduces anxiety and gives a next step | Radix Accordion `type="single" collapsible`, animate height via the Radix CSS variable `--radix-accordion-content-height` with `accordion-down` and `accordion-up` keyframes (tailwindcss-animate does not ship these; add them shadcn-style in the preset). Group headers as `<h3>`.

**C26 Rotating keyword headline** (Text showcase) | Ferndesk TS1 | Fixed lead-in and a cycling accent phrase, with a list of all phrases highlighted in sync | Phrase change with a short scramble | Communicates breadth in one line | `AnimatePresence mode="wait"` on a span with y and opacity (skip the scramble). Pause when off-screen. Under reduced motion show a static first phrase plus the full list. Keep the real sentence in an `sr-only` element so screen readers get stable text.

**C27 Logo or accreditation marquee with hover preview** (Logo) | Framer LG1 | Row of logo cells with vertical hairlines | Continuous sideways drift; the hovered cell raises a preview card | Social proof that keeps moving | CSS `@keyframes marquee` translating a duplicated track by -50%, with `hover:[animation-play-state:paused]` and `focus-within:` paused. Add a visible pause control when the motion lasts over 5 s (WCAG 2.2.2). Static grid under reduced motion.

### D. Navigation, overlays and transitions
**C28 Compact menu card with a built-in booking card** (Navigation dropdown) | Odyssee N1 | Panel anchored under the menu button: link list, a small image teaser and a solid card with booking/contact details | Panel scales and fades in from its corner while the page behind washes out | Keeps the primary action in the menu | Radix NavigationMenu or Popover, `data-[state=open]:animate-in zoom-in-95 fade-in` (tailwindcss-animate), with a backdrop `bg-white/60 backdrop-blur-sm`. Put the emergency number in this card.

**C29 Pill-to-panel morph and corner card to drawer** (Morphing, Drawer) | Apple N2, Likova N3 | A small pill or corner card | Expands in place into a large panel or side drawer, with a heavy backdrop blur | Spatial continuity: the user sees where the panel came from | framer-motion shared `layoutId` between the collapsed pill and the open panel, inside a Radix Dialog for focus trapping. Apply to the floating emergency button and the symptom-triage popover.

**C30 Full-screen two-tier menu** (Fullscreen nav) | LPAS N4 | Dark overlay: big primary links, smaller secondary links, a contact row | Overlay fades in and links stagger in | Clear hierarchy on mobile | Radix Dialog full-screen, staggered children. Use for mobile nav only.

**C31 Side-sheet detail panel** (Modal) | Linear MO1 | Tall panel sliding in from the right over a dimmed list | Content swaps as the selected item changes | Inspect a record without losing the list | Radix Dialog styled as a sheet: `data-[state=open]:slide-in-from-right`, width 480 to 640px. In the ERP, drive it from the URL (`?patient=123`) so it is linkable and survives the back button.

**C32 Shared-element expansion** (Contextual transition, Features) | Intent FE1, Tux CX1 | A chip or card | It grows into a large window or the next view | Continuity from summary to detail | framer-motion `layoutId` across states within a page. For Next.js route changes keep it simple (see C33).

**C33 Calm page transitions** (Page transition) | Milledollars PT1 (color-coded per page) | Stable grid across pages | Background color and content cross-fade or slide on navigation | Cohesion between pages | Next 14 app router: `app/template.tsx` with a `motion.div` initial opacity 0, y 8, 0.25s. Avoid exit animations (they are fragile with the app router). Per-department tint could echo the color-coding idea.

**C34 Preloaders** (Preloader) | Heron PL1, Virugroup H4 | Full-screen intro | Line drawing or masked reveal before content | Brand theater | Recommendation: do not use on a hospital site, because they delay urgent information. At most, a brief logo draw on first visit only, under 600ms, and never on emergency pages.

### E. Static layout and composition patterns
**C35 Bento grid built from real UI fragments and mini charts** (Features) | Service Bento, Ledger Bento, Lime Metrics (scrolltide) | Asymmetric grid (`grid-cols-6`, items spanning 2, 3 or 4) inside one rounded container | Mostly static in the previews; charts likely animate on entry (inferred, since only posters were visible) | Shows the product, not just icons | Tailwind grid with `col-span-*` and `row-span-*`; recharts `<BarChart>`, `<PieChart innerRadius>` and `<AreaChart type="stepAfter">` sized small with axes hidden; floating callout via a custom `<Tooltip>` or an absolutely positioned label. Charts animate by default; set `isAnimationActive={!reduce}`.

**C36 Ghost or oversized wordmark** (Footer/Contact/Pricing) | 8+ scrolltide entries | Huge, very low-contrast type behind content or cropped by the bottom edge | Static | Atmosphere and brand presence | `pointer-events-none select-none absolute text-[18vw] leading-none text-foreground/[0.04]`, `aria-hidden`. Must not reduce the contrast of foreground text.

**C37 Landscape-based footer and merged CTA footer** (Footer/CTA) | River Valley, Meadow Capture, Hill Country, Snow Summit, Fog Forest, Dune Card | Link bar or card over a full-width photo or illustration; glass email pill; floating copyright pill; shaped top edge | Static (2 entries loop video) | Ends the page with a sense of place and calm | `next/image` background with a gradient scrim, a `backdrop-blur-md bg-white/70` pill input, and an SVG `clipPath` or inline SVG for a shaped top edge. For us: a calm photo of the hospital campus or a soft illustrated skyline.

**C38 Contact and booking compositions** (Contact) | Route Booking, Studio Enquiry, Contact Column, Signal Form (scrolltide); ESR CO1 (details) | Form as the main content with a tall photo card and 3 contact tiles; promise checklist next to a short form; form-free column of channels; editorial visit info with location photos | Static plus focus states | Reassures before asking for data | 2-column `lg:grid-cols-[1.4fr_1fr]`, soft filled inputs (`bg-muted border-transparent focus:bg-background focus:ring-2 ring-ring`), and 3 tiles with lucide `Phone`, `Mail` and `MapPin`.

**C39 Ambient backgrounds** (decorative) | Contact Column (bloom, dotted grid), OhMD H7 (particles), Lime/Ledger (top glow), Tier Cards (blurred orb) | Soft radial gradients, dot grids, faint particles | Mostly static; particles drift (inferred) | Depth without imagery | `bg-[radial-gradient(ellipse_at_top,theme(colors.primary/15),transparent_60%)]`, dot grid via `bg-[radial-gradient(theme(colors.border)_1px,transparent_1px)] [background-size:20px_20px]`. Skip particles.

**C40 Numbered steps** (Steps) | General Dental P1 and P2, scrolltide modal strip | Oversized numerals with short title and copy, staggered zig-zag or columns | Reveal per step | Simplifies a process (booking, admission) | Ordered list `<ol>` with big tabular numerals (`font-display tabular-nums text-7xl text-primary/90`), plus C01 reveal.

**C41 Mixed-type headlines and accent words** (Typography) | Render Grid, Virugroup H4/S3, Griflan, Lime Metrics, Clarasight S2, Transform9 ST1 | Sans headline with one italic-serif clause, or 1-2 words in the accent color | Static | Personality with one simple move | `<em className="font-serif italic font-normal">` or `<span className="text-primary">`. Load one serif (for example Fraunces or Source Serif) via `next/font` if we adopt it.

**C42 Product-UI-in-hero** (Hero) | OhMD H7, Intent FE1, Ledger Bento | Hero copy above or beside a floating mock of real UI (messages, bookings) | Gentle float or entrance (inferred ambient) | Concrete and credible | For the hospital: a floating "next available appointment" card and a live wait-time chip built from real components, not screenshots.

## 3. Mapping table

Repo facts checked read-only. `framer-motion ^11.18.2` is already declared in both `apps/website/package.json` and `apps/erp/package.json` but is imported nowhere. `tailwind.preset.cjs` already zeroes CSS animation and transition durations under `prefers-reduced-motion`. That rule does not cover framer-motion's JS-driven animations, so wrap each app root in `<MotionConfig reducedMotion="user">` and use `useReducedMotion()` for scroll-linked effects. Dark mode is `class`-based, but only light tokens are defined.

### 3a. apps/website (Next.js 14)
| Our page / component | Recommended patterns | Priority | Build notes |
|---|---|---|---|
| Global motion foundation | C01 reveal, C13 card hover, C33 page fade | P0 | Client `<Reveal>` and `<Stagger>` components in `components/motion/`, plus `MotionConfig` in a client provider inside `app/layout.tsx`, plus `app/template.tsx` fade. Keep server components server-side by wrapping only leaves in client motion components. |
| Navbar | C28 menu card with a booking/emergency card; C30 full-screen mobile menu; header that condenses into a pill on scroll (inferred, a variation of C29) | P1 | Radix NavigationMenu desktop, Dialog mobile. `useScroll` to toggle a compact pill style after 80px. The emergency number stays visible at all sizes. |
| HeroSection | C42 product-UI-in-hero (next-slot card, wait-time chip), C01 staggered headline, C41 accent word; optional C02 sticky photo | P0 (C42, C01, C41), P2 (C02) | Avoid autoplay video and preloaders (C34). Use a real lifestyle/clinic photo with a scrim. CTA buttons get C17 calm fill sweep. |
| StatsAndTrust | C05 count-up / radial gauge, C27 accreditation marquee (with pause), C15 gradient hover tiles (subtle) | P0 (count-up), P1 (marquee, gauge), P2 (C15) | Count-up via framer `animate()` on `useInView`. Final numbers present in the markup. Awards as a static logo grid if fewer than 8 logos. |
| DepartmentsShowcase | C20 tabbed split-card carousel with per-department pastel, or C35 bento; C14 faded-until-focused for the "more departments" row | P0 (C20), P1 (C35) | Radix Tabs with a `layoutId` underline. No autoplay, or autoplay with a pause and progress bar. Each department tint pairs with AA text color. |
| departments/[id] | C03 pinned split (treatments with images), C04 stacked cards (services/procedures), C40 numbered "what to expect" | P1 | CSS sticky. Mobile fallback stacked. Pull data from the existing department model. |
| DoctorDirectory (home) | C23 featured-specialist carousel, C16 portrait swap on hover, filter chips with layout animation (inferred, standard `layout` prop) | P1 | `AnimatePresence` for the filtered grid (`layout` + `popLayout`). Profile links stay real anchors. |
| doctors page | C07 scroll-spy name list with pinned portrait (optional view mode), C13 cards | P1 (C13), P2 (C07) | Offer the list view as a toggle next to the grid, not a replacement. Search and filters stay primary. |
| doctors/[id] | C38-style composition: sticky booking card beside the bio; C01 reveal | P1 | `lg:sticky lg:top-24` booking card with next slots. |
| AppointmentSection (home) | C24 journey accordion (Book, Prepare, Visit, Follow-up) with mini UI previews | P0 | Flex `layout` animation on hover/focus. Radix Accordion under `md`. |
| appointments (5-step wizard) | C38 Route Booking composition (form as the page, photo card, 3 help tiles), animated step indicator (C20 underline idea), `AnimatePresence` step slide, C40 numbering | P0 | Steps slide x plus or minus 24px with fade (0.25s). Focus moves to the step heading on change. Progress bar `scaleX`. Reduced motion: no slide. |
| PatientReviews (3 static) | C21 expanding-card carousel with outcome facts, or C22 gentle coverflow; C16 hover | P0 | 3 items fit C21 well. Buttons with `aria-expanded`; no autoplay. |
| FAQSection | C25 grouped two-column FAQ (topics left), plus a "talk to a nurse/helpdesk" person card (bymonolog idea) | P0 | Radix Accordion with height animation. Group by visit, billing, insurance, emergency. |
| HealthInsights (blog cards) | C13 card lift + media zoom + chip, C16 accent title hover | P0 | CSS only. |
| blog/[slug] | Fora AR1 long-read layout, reading progress bar (inferred common pattern, not observed), related posts row | P1 | `useScroll` + `scaleX` progress bar under the header. |
| EmergencyBanner | Meadow Capture-style band (photo + glass pill holding the phone number), C36 ghost wordmark | P1 | No entrance animation that delays visibility. Red only for the emergency action, with AA contrast (see section 4). |
| Floating emergency button + SymptomTriagePopover | C29 pill-to-panel morph (shared `layoutId`) inside Radix Dialog/Popover | P1 | Keep the existing pulse but put it behind `motion-safe:`. Escape closes; focus returns to the button. |
| Footer | C37 calm landscape/campus base, glass newsletter pill, C36 ghost wordmark, optional shaped top edge (Snow Summit) | P1 | Static. `next/image` with `sizes`. |
| about | C11 timeline (history), C06 subtle parallax photo (curtain), C01 | P1 (C11), P2 (C06) | Timeline falls back to a vertical list. |
| contact | C38 editorial visit info (ESR) + Contact Column channels + map | P0 | 3 contact tiles, opening hours, directions. Form secondary. |
| timetable | Sticky header table (Heron PR1 idea), C14 row highlight | P1 | `sticky top-[header]` thead, `hover:bg-muted/50` rows, day tabs. |
| Policy pages (privacy, terms, cookie, refund) | Diffusion LE1 sticky TOC with scroll-spy | P0 | `IntersectionObserver` on h2s, sticky aside, `aria-current="true"` on the active link. |
| not-found | Maxima-style friendly illustrated 404, optional pupils following the cursor (C19) | P2 | Pointer-fine only. |

### 3b. apps/erp (React 18 + Vite, shadcn-style sidebar)
Principle (inferred from the sources plus ERP context): staff tools get micro-interactions only (150 to 250ms), with no scroll choreography, pinning or parallax. Motion should explain state changes such as a row arriving, a panel opening or a status changing.

| Our screen | Recommended patterns | Priority | Build notes |
|---|---|---|---|
| App shell / sidebar | `layoutId` active-item indicator (the C20 underline idea), C29 smooth collapse | P1 | `motion.div layoutId="nav-active"` behind the active item. Sidebar width animates via the `layout` prop. |
| Login | Contact Column ambient (bloom + dotted grid) on a split layout, C38 soft inputs | P2 | Static decoration only. Keep autofill and password managers working. |
| Analytics dashboard | C35 bento KPI grid with mini charts (Lime Metrics, Ledger Bento), C05 count-up KPIs and radial gauge (bed occupancy, SLA), Ledger-style floating chart callout | P0 (C35, count-up), P1 (gauge, callout) | recharts `ResponsiveContainer` in `col-span-*` tiles. Custom `<Tooltip content>` for the callout. `isAnimationActive` tied to reduced motion. One accent color per chart family. |
| Reception Desk (queue) | C31 side sheet for patient detail/check-in; animated queue reordering (inferred: framer `layout` on rows, which follows from stacked-card mechanics but was not observed as such); Ledger-style status pills | P0 (C31), P1 (layout reorder, pills) | `AnimatePresence` + `layout` on `<li>` rows, 200ms. New arrivals get a 1-time background flash (`bg-primary/10` fading out). Never auto-scroll the list under the user's pointer. |
| Clinical Workbench (EHR, SOAP, vitals, e-Rx) | Radix Tabs with `layoutId` underline (C20), C25 accordion sections for SOAP, C31 side sheet for e-Rx and drug details, C05 small vitals gauges or sparkline tiles (C35) | P0 (tabs, accordion), P1 (sheet, vitals tiles) | Preserve form state across tabs (`forceMount` on Tabs.Content or lift state). Unsaved-change indicator dot animates in. |
| Audit Log viewer | C31 side sheet for event detail, bymonolog-style row hover highlight bar (F2), sticky table header (PR1) | P0 (sheet, sticky header), P1 (hover bar) | URL-driven sheet (`?event=`). Virtualize long lists (not a design-site pattern; standard practice). |
| Staff Provisioning | C40 numbered steps / step indicator, C38 soft inputs, `AnimatePresence` step transitions | P1 | Same wizard primitives as the website booking wizard, so share them via a package if the monorepo allows. |
| Integration pipeline monitor | C11-style progress marker moving along a pipeline track (Eleken), status-colored squares grid (inferred from the Transform9 pixel grid as a status heatmap) | P1 (marker), P2 (heatmap) | SVG path + `pathLength`, or flex track with `motion.div` x. Pulse only on the failing stage, inside `motion-safe:`. |
| Global ERP feedback | C13-lite hover (border + shadow, no lift on dense tables), toast slide-in (tailwindcss-animate), skeleton shimmer under `motion-safe` | P0 | Tables: hover background only. Cards: `hover:shadow-md hover:border-primary/30`. |

## 4. Design-system observations and Tailwind token suggestions

### 4a. What the sources do (observed)
- Type: very large display headlines with tight tracking and short line lengths (2 to 3 lines). Mixed sans plus italic-serif clauses (Render Grid, Virugroup, Griflan). One or two accent-colored words (Lime Metrics, Clarasight, Transform9, Cerebrium). Uppercase condensed numerals for steps (General Dental). Small pill eyebrow labels above headings (Route Booking, Fora). Ghost wordmarks at 15 to 25vw.
- Spacing: generous vertical rhythm, with one idea per band. Content often sits inside one big rounded container (Service Bento, Lime Metrics, Route Booking panel). Hairline dividers instead of boxes in editorial layouts (Tengile, Diffusion, Telha Clarke, Heron).
- Color: two families. (1) Near-black UI with a single accent and a radial glow from the top (scrolltide: lime, amber, blue, green). (2) The Health category leans calm: cream/sand (Odyssee, General Dental, Dawn), deep green (OhMD, General Dental), navy/blue (Transform9, Clarasight), and pastel per-category panels (Google Health). Gradients are radial blooms, blurred orbs, and a soft multicolor glow at the base of a card (Calendly), never hard linear rainbows.
- Radius: cards around 16 to 24px, big containers around 28 to 40px, pills for buttons, inputs, chips, nav bars and copyright tags. Frosted glass pills and panels are common (Meadow Capture, Tier Cards, Signal Form).
- Shadows and borders: on dark, 1px white-at-low-alpha borders replace shadows. On hover, a colored, very diffuse glow shadow (scrolltide card). On light, shadows are minimal and flat fills carry hierarchy.
- Dark mode: scrolltide is dark-only; details.so entries are mixed. Health sites in the sample are mostly light, warm and photographic. Dark sections are used as accents (OhMD hero, Transform9 hero).
- Micro-interactions: a 4px lift, a 1.04 media zoom, border brighten, a chip reveal, sibling dim, an image swap and an underline indicator. Durations look like about 300 to 700ms with strong ease-out (the scrolltide card uses a cubic-bezier(0.22, 1, 0.36, 1)-style curve, read from its class list; it is a generic easing value, not proprietary).

### 4b. Contrast check of current tokens (WCAG 2.1, computed against white unless noted)
| Token | Hex | Ratio | Verdict |
|---|---|---|---|
| prohealth.primary | #1F5084 | 8.27 | AA/AAA body text OK |
| prohealth.secondary | #2B78C6 | 4.56 | AA normal text (barely); white on it 4.56, OK for buttons |
| prohealth.accent / brand.accent | #3B82F6 | 3.68 | Fails AA for body text. Use only for large text (24px+, or 18.66px bold), icons or borders |
| prohealth.cyan | #0284C7 | 4.10 | Fails AA for body text; large text/UI only |
| prohealth.muted | #667085 | 4.97 (4.53 on #F7F4EE) | AA OK |
| prohealth.body | #475467 | 7.69 | OK |
| brand.emergency | #EF4444 | 3.76 | Fails as text or as a white-label button. Use #DC2626 (4.83) or #B91C1C (6.47) |

### 4c. Suggested token additions (extend tailwind.preset.cjs so both apps share them)
```js
// theme.extend additions (suggested, original values)
colors: {
  care:   { DEFAULT: '#0F766E', soft: '#ECFDF5' },   // calm green accent: 5.47 on white, 5.20 on soft
  sand:   { DEFAULT: '#F7F4EE' },                    // warm canvas: heading 13.39, body 7.00, muted 4.53
  alert:  { DEFAULT: '#B91C1C', strong: '#991B1B', soft: '#FEF2F2' }, // emergency: 6.47 on white
  dept: {                                            // pastel panels + paired text (all pass AA)
    blue:  { bg: '#EAF2F9', fg: '#1F5084' },         // 7.31
    green: { bg: '#ECFDF5', fg: '#0F766E' },         // 5.20
    amber: { bg: '#FFFBEB', fg: '#92400E' },         // 6.84
    rose:  { bg: '#FFF1F2', fg: '#9F1239' },         // 7.30
  },
},
fontSize: {
  'display-xl': ['clamp(2.75rem, 1.5rem + 4.5vw, 5rem)',   { lineHeight: '1.04', letterSpacing: '-0.025em', fontWeight: '600' }],
  'display-lg': ['clamp(2.25rem, 1.4rem + 3vw, 3.75rem)',  { lineHeight: '1.08', letterSpacing: '-0.02em',  fontWeight: '600' }],
  'display-md': ['clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '600' }],
  lead:         ['1.1875rem', { lineHeight: '1.6' }],
  eyebrow:      ['0.75rem',   { lineHeight: '1', letterSpacing: '0.12em', fontWeight: '600' }], // pair with uppercase
},
spacing: { section: 'clamp(4rem, 2.5rem + 6vw, 8rem)' },   // py-section
borderRadius: { card: '1.25rem', panel: '2rem', pill: '9999px' },
boxShadow: {
  soft:           '0 1px 2px rgb(16 24 40 / 0.04), 0 4px 16px -4px rgb(16 24 40 / 0.06)',
  lift:           '0 18px 40px -18px rgb(31 80 132 / 0.28)',
  'glow-primary': '0 18px 60px -20px rgb(43 120 198 / 0.45)',
},
transitionTimingFunction: {
  'out-soft':    'cubic-bezier(0.22, 1, 0.36, 1)',
  'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
},
transitionDuration: { 250: '250ms', 400: '400ms', 600: '600ms' },  // 150 and 700 already exist in Tailwind 3
keyframes: {
  'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
  marquee:   { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
  drift:     { '0%, 100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(2%,-2%,0)' } },
},
animation: {
  'fade-up': 'fade-up 450ms cubic-bezier(0.22,1,0.36,1) both',
  marquee:   'marquee 40s linear infinite',
  drift:     'drift 10s ease-in-out infinite',
},
```
Dark tokens (for an ERP night-shift theme, and the website if wanted): add a `.dark` block next to `:root` in the preset. Suggested values: `--background: 222 47% 7%` (#0B1220); `--foreground: 213 38% 93%` (#E6EDF5, 15.87:1); `--primary: 213 94% 78%` (#93C5FD, 10.38:1 on background, with dark #0B1220 text on primary buttons, also 10.38:1); `--muted-foreground: 215 20% 65%` (#94A3B8, 7.30:1); borders at 8 to 10% white alpha. Alert text on dark: #F87171 (6.77:1).

### 4d. Motion rules for a calm, trustworthy healthcare brand
1. Durations: micro 150ms (hover, press), UI 250ms (menus, tabs, sheets), reveals 400 to 450ms, media 600 to 700ms. Use `out-soft` easing for entrances; no bounce or overshoot on content.
2. Distances: reveals of 12 to 16px, hover lift of 4px or less, scale of 1.04 or less, parallax offsets under 10%.
3. Reduced motion: `<MotionConfig reducedMotion="user">` at each app root. A `useReducedMotion()` guard on every `useScroll`/`useTransform` effect, swapping in a static layout. Tailwind `motion-safe:` on decorative CSS animations (pulse, drift, marquee). Keep the existing global CSS rule in the preset.
4. Auto-moving content (carousels, marquees, rotating headlines) needs a visible pause/stop control or must stop within 5s (WCAG 2.2.2), pauses on hover and focus, and never carries critical info (emergency numbers, wait times).
5. Never gate urgent content behind animation: no preloaders. The emergency banner, phone numbers and booking CTA are visible on first paint (server-rendered at opacity 1; animate transforms only).
6. Hover is never the only way to reveal content: mirror it with `focus-visible`, and show it by default on `(hover: none)` devices.
7. Performance: animate only `transform` and `opacity` (plus `clip-path` sparingly). Use `next/image` for parallax images. Lazy-mount heavy sections with `useInView`.

## 5. Not accessible, gated or failed
- scrolltide: the prompt text for every section (the actual product) is behind "Upgrade to unlock", and was not accessed. Only 2 of 20 previews are videos; the other 18 are static posters, so motion for those is described only where the description or tags state it, and otherwise not at all. Other scrolltide areas (Library/templates, Components, Shaders, UI, eBook) were out of scope and not visited.
- details.so, anonymous cap: each category page shows 8 entries without an account, and the site states that a visitor has "seen less than 1%". "Load more" fails without signing in. In total 300 unique entries were reachable; I did not sign in or create an account.
- details.so Newsletter category (10+): 0 entries in the anonymous render, on both attempts.
- details.so media: entries have no written descriptions, so motion was inferred from 4 to 6 evenly spaced frames of each 3 to 28 s recording. Exact easing, durations and trigger type (scroll, hover or autoplay) are my reading of those frames. 14 entries whose recording could not be matched with confidence were skipped, and 12 entries are static screenshots.
- details.so Vault (paid component kit), Save/Boards/Remix and the MCP integration need a paid plan or a login, and were not accessed.
- Industries other than Health, and all Style tags, were catalogued at count level only.
- Tool notes: one screenshot timed out while the browser pane was hidden and succeeded on retry. Nothing else failed twice.
- Browser tabs: the browser pane was not open when I started. Opening it created three tabs of mine that happened to get the IDs `seed` (left on scrolltide), `tab-1` and `tab-2` (both blank). To respect the rule not to use those IDs, I did all the work in `tab-3`, which I have closed. I left `seed`, `tab-1` and `tab-2` open; they can be closed safely. Tabs that appeared later (`tab-4` to `tab-7`: localhost:4000, :3001, :5173 and inspomcp.dev) belong to someone else and were not touched.

---

## Research log (raw findings, appended as work progresses)

### Log A1: scrolltide.co/sections, list level (via WebFetch, server-rendered HTML)
- Page claims "20 sections". Filter chips: All, Features, Pricing, Contact, CTA, Footer (no counts shown on chips; counts below are from tallying cards).
- Each card has a name, a one-line description and a "Preview" link. No tags.
- Footer (9): Bean Bag Nap (cream footer, clay character in bean bag, link columns + newsletter); Lighthouse Toile (full-height footer over engraved red-ink lighthouse illustration, 4 link columns); Portfolio Close (dark finance footer, newsletter panel, 3 link columns, giant wordmark over grass); Dune Card (footer card floating over orange dunes with truck on a track); River Valley (cream footer bar above illustrated valley, serif ghost wordmark, copyright pill); Wordmark Bleed (black minimal footer, 4 columns, huge green wordmark cropped off bottom edge); Snow Summit (navy footer with snowy mountain top edge, 4-col links, policy bar); Fog Forest (fire tower over misty forest illustration, 3 link columns + contact block); Loom Footer (terracotta heritage footer, cream card, newsletter, 4 columns, monument skyline).
- CTA (2): Hill Country (closing CTA over rolling hills, inline leaf glyph inside headline); Meadow Capture (CTA + footer combined over meadow, email capture pill, 3 link columns).
- Features (4): Service Bento (5-card asymmetric bento inside one dark rounded panel); Render Grid (5-card feature grid on black, each card a 3D render); Ledger Bento (4-panel fintech grid: avatar constellation, icon rail, transaction list, P&L bar chart); Lime Metrics (3 cards each with its own chart: bar, donut, stepped area).
- Contact (4): Studio Enquiry (dark; promise list + compact form + 3 contact tiles); Contact Column (no form; mail, phone, address, socials); Signal Form (dark; glass message panel + 3 linked contact rows); Route Booking (light; 7-field booking form + photo card + 3 contact tiles).
- Pricing (1): Tier Cards (3 tiers, glass plan cards, billed-yearly toggle).
- Site nav (context only, not in scope): Library/templates, Components, Shaders, Sections, UI, eBook, Pricing, FAQ, Contact, Log in. Paid "Unlimited" plan exists, so some previews or code may be gated (to verify).

### Log B1: details.so/inspo, list level (via WebFetch)
Nature of the site: a curated gallery of real third-party websites, each entry tagged with the element, section, interaction, industry and style it demonstrates (entries are recordings or captures of live sites, not code kits). Counts below are the numbers displayed beside each tag in the filter taxonomy.
- Quick filter bar: All, Hero, Footer, Button, About, Services, Navigation, Scroll Animations, Page Transitions, Section Transitions, More filters. Feed tabs: Featured, Recent, Pro, Staff picks, Soon. Taxonomy tabs: Elements, Sections, Interactions, Industries, Styles.
- UI Elements: 3D 73, Accordion 53, Button 174, Card 69, Carousel 135, List 116, Modal 69, Rows 79.
- Structure: CTA 31, Footer 337, Hero 405, Legal 14, Navigation 242, Drawer 57, Dropdown 74, Fullscreen 69, Morphing 24.
- Page sections: 404 79, Article 32, Blog 69, Case Study 95, Contact 124, Content 225, About 96, FAQ 27, Features 429, Services 97, Steps 27, Newsletter 10, Portfolio 239, Pricing 62, Products 34, Social Proof 149, Logo 31, Testimonial 91, Stats 60, Team 81, Timeline 19.
- Transitions and loading: Contextual Transition 24, Page Transition 140, Preloader 244, Section Transition 109.
- Scroll: Media Showcase 198, Scroll Animations 470, Horizontal Scroll 46, Parallax 66, Pinned Scroll 208, Stacked Scroll 92, Text Showcase 82.
- Pointer and hover: Card Hover 124, Cursor Interaction 135.
- Industries: AI 133, Architecture 48, Art 49, Crypto 26, Education 39, Fashion 28, Finance 42, Food 29, Health 42, Hospitality 26, Industrial 76, Legal 1, Media 60, Music 21, Portfolio 71, Product Design 107, Real Estate 26, SaaS 162, Sports 24, Studio 202, Video 80.
- Styles: Brutalist 53, Corporate 61, Editorial 277, Experimental 218, Image-led 197, Luxury 26, Maximalist 4, Minimal 243, Organic 4, Playful 40, Retro 17.
- Vault (paid component kit, separate area): components Navigation 8, Carousels and Galleries 11, Button 6, UI Details 12; sections Hero 2, Scroll Sections 5; animation effects Text Reveal 6, Section Transition 4, Page Transition 10.
- Featured entries visible without login (8): Heron AI (Button); SweetTape (Page Transition); Santalarch (Horizontal Scroll, Services/Features); SweetTape (Features, Pinned Scroll); Google Health (Features, Parallax); Tengile MalaMala (Content, Media Showcase); Agrumea Farm (Services/Features, Stacked Scroll); Eduard Bodak (Carousel, Services/Features).
- Poster grid shows about 56 sites by domain only (no tags in server HTML).
- Gating: page shows a "seen less than 1%" message with an upgrade prompt (Pro and Vault paid tiers); "load more" failed in server render with a "couldn't load more, sign in" message. Saving, boards and the MCP need login. Full coverage of thousands of entries is therefore not possible without an account; we cover the full taxonomy plus every entry reachable anonymously.

### Log A2: scrolltide, how entries work + detail modals for entries 1-10 (browser, tab-3)
- Each "section" is a paid AI prompt (layout + motion + stack notes) meant to be pasted into an AI coding tool. Clicking a card opens a modal (URL hash #s-<slug>) with a longer description, tag chips and a large preview; the prompt text itself is behind "Upgrade to unlock". So motion details below come from descriptions, tags and preview media, not from the prompts.
- Only 2 of 20 previews are video (Bean Bag Nap, Lighthouse Toile, both tagged VIDEO); the other 18 are static JPG posters. Stack tags on all entries: React plus Tailwind or plain CSS.
- Gallery-card micro-interaction observed on the listing itself (good reference for our cards): on hover the card lifts about 4px, its border brightens, a soft tinted glow shadow appears, the inner media scales up about 4% on a slower (about 700ms) ease-out curve than the card (about 500ms), and a "Preview" pill slides up a few px while fading in over a blurred translucent chip. Keyboard focus-visible gets a tinted border. Video previews use preload none + muted + loop + playsinline + poster image (play on hover, inferred from the setup; autoplay is off).
- Modal also shows a 3-step "how it works" strip (01 copy, 02 paste, 03 launch) with numbered cards: a simple numbered-steps pattern.
Entries (paraphrased):
1. Bean Bag Nap (Footer; tags video, clay, 3D character, newsletter, warm). Looping character film anchored to the left edge and bleeding off it under the wordmark; link columns and newsletter sit on the empty right side. Motion: looping video loop of the character dozing, waking, typing.
2. Lighthouse Toile (Footer; video, engraving, illustration, warm). Full-viewport footer inside an animated monochrome engraving (sea swell, drifting clouds, a passing ship); link columns float in the "sky" area. Motion: subtle ambient looping animation of the illustration.
3. Hill Country (CTA + footer; photographic, green, wordmark). Closing CTA over photo landscape, a small leaf icon inline within the headline text, horizontal nav row, oversized cropped wordmark at the bottom.
4. Portfolio Close (Footer; newsletter, finance, dark, wordmark). Dark footer, newsletter panel, 3 link columns, giant wordmark with registered mark over a blurred grass strip at the bottom edge.
5. Dune Card (Footer; illustration, desert, orange, logistics). Footer content in a floating card above an illustrated landscape with a vehicle on a winding road.
6. River Valley (Footer; illustration, landscape, serif, cream). Slim cream bar of links above a full-width illustrated valley; huge low-contrast serif wordmark over the treeline; small floating copyright pill.
7. Meadow Capture (CTA + footer; email capture, photographic, glass). One combined band: headline + frosted-glass email input pill over a photo, link columns along the bottom.
8. Wordmark Bleed (Footer; minimal, wordmark, dark, studio). Black footer, 4 tight columns, giant colored wordmark cropped by the bottom edge.
9. Snow Summit (Footer; illustration, mountains, navy, automotive). Top edge of the footer is a mountain silhouette (shaped divider), 4-column links, centered oval badge, policy bar.
10. Fog Forest (Footer; illustration, landscape, green, atmospheric). Layered illustration (fire tower over misty valley); links and contact block placed over the darkest region for contrast.

### Log A3: scrolltide detail modals for entries 11-20 (paraphrased)
11. Loom Footer (Footer; newsletter, heritage, illustration, warm). Terracotta band holding a cream inner card (wordmark, newsletter, 4 columns); closes with an illustrated skyline of national monuments along the bottom edge.
12. Service Bento (Features; services, bento, 3D, dark). One large rounded dark container holding an asymmetric 5-card bento; each card has a metallic 3D object and a short plain-language description.
13. Render Grid (Features; grid, 3D, dark, editorial). 5-card grid on pure black, each card topped by a moody 3D render; the headline ends in an italic serif clause (mixed sans + italic serif headline as a tone device).
14. Studio Enquiry (Contact; form, dark, studio). Two columns: a checklist of promises and a short message form; a huge faint "get in touch" style ghost wordmark behind; 3 bordered contact tiles in a row underneath.
15. Ledger Bento (Features; bento, fintech, dark, amber). 4 panels on near-black with warm amber accents: two wide panels (avatar cluster, icon rail), two with a transaction list and a P&L bar chart that has a floating callout/tooltip bubble.
16. Lime Metrics (Features; charts, cards, dark, lime). 3 cards, each with a different mini chart (bars, donut, stepped area); the headline highlights two words in the accent color.
17. Contact Column (Contact; dark, details, minimal). No form: a two-word headline on the left over a dotted grid background, and a right column of email, phone, address, social links lit by a soft color bloom (blurred radial gradient).
18. Tier Cards (Pricing; plans, toggle, dark, glass). Deep blue band, ghost "pricing" wordmark behind, pill-shaped navbar, frosted glass plan cards with check-mark feature lists, monthly/yearly toggle below the grid.
19. Signal Form (Contact; form, dark, glass, navbar). Pill navbar, oversized ghost wordmark behind content, a glass form panel floating over a green corner glow, 3 linked contact rows on the left.
20. Route Booking (Contact; form, booking, light). Light section where a 7-field booking form is the main content, a tall photo card beside it, 3 contact tiles below.
Recurring motifs across the 20: oversized or ghost wordmarks (8+ entries), illustrated or photographic landscape bases for footers, frosted glass panels, soft color blooms/glows, pill navbars and pills for inputs and copyright, bento grids with embedded mini charts, contact tiles in rows of 3.

### Log A4: scrolltide visual notes from preview images (static 1600x900 JPG posters, viewed at 0.5 scale)
- Service Bento: one dark rounded container on a brushed-metal backdrop; centered title + muted subtitle with a few words emphasized in brighter weight; asymmetric bento (tall left card, wide top-right card, three small cards, wide bottom-left); each card = title top-left, 1-2 line muted description, monochrome 3D object bottom-right. Very low-contrast card borders (1px, white at low alpha).
- Ledger Bento: near-black with warm orange radial glow from the top; 2x2 panels of unequal width; panels show live-looking UI fragments (avatar nodes connected to a glowing center app icon, a grid of integration icons, a list of transfers with green status pills, a monthly bar chart with a floating orange value callout). Pattern: "feature card that shows a miniature of the real product UI" rather than an icon.
- Lime Metrics: dark with lime glow at top; headline with 2 accent words; 3 equal cards, first card filled with the accent (lime gradient) as the "hero" card, the other two dark glass; each card has title + description + a chart (stacked bars, donut with legend, stepped area/histogram).
- Tier Cards: deep blue with a large blurred blue orb glow; giant faint "Pricing" wordmark behind cards; floating pill navbar; 3 glass cards with plan name, price, short line, check-list, full-width pill button; small switch toggle "billed yearly" bottom-left.
- Route Booking (most relevant to our appointment flow): light theme; small pill eyebrow label, very large tight-tracked headline, supporting copy right-aligned on the same row; left: a rounded light-grey panel holding a 2-column form (name, email, phone, select, date, number, textarea) with soft filled inputs (no strong borders), dark pill submit button plus a separate circular arrow button; right: tall rounded photo card with a small glass pill label; bottom: 3 icon + title + detail contact tiles.
- Studio Enquiry: dark; huge ghost wordmark behind (very low contrast); left: headline with arrow glyph, short copy, 3 check-bullet promises, social icon buttons; right: dark input panel with white pill submit; bottom row of 3 bordered tiles with small icon squares.
- Contact Column: dark navy; two-line huge headline top-left with a blue radial bloom behind it, dotted grid texture; right column of icon-labelled contact groups; blurred multi-color blob as decoration; second headline bottom-left.
- Meadow Capture: photo full-bleed, centered 2-line statement, single glass pill email input with an inline pill button inside it; footer columns sit on the photo's lower area; small star logo bottom-left.
- River Valley: cream link bar on top (logo + tagline left, 3 link columns right), illustrated valley below with giant translucent serif wordmark, floating white pill at the bottom with copyright + round social icons.
- Hill Country: full-bleed photo, centered CTA headline with a tiny inline image chip between words, small dark pill button; thin nav row and a gigantic wordmark at the bottom cut by the edge.
- The scrolltide listing page itself: dark UI, filter chips as rounded pills (active chip filled white), 3-col card grid, rounded-2xl cards with 16:9 media, title + category + description under each. A "Why" video pill button with a circular play icon and duration subtitle in the hero.

### Log B2: details.so entry structure (WebFetch of /inspo/healthapp-1c7b19 + browser)
- Every category has its own page at /inspo/category/<slug>; there are also "built with" collections: Framer, Webflow, GSAP, Three.js (/inspo/built-with/<tool>).
- An entry page = a screen recording (video with timecode, "Download media" button) of one live site's section, plus tag chips (e.g. Google Health entry: Parallax, Features, Health), Save and Remix actions, and 8 related entries with tags. No written description of the interaction: motion must be read from the video.
- Example related set for Parallax + Features: Likova (Features, Parallax, Pinned Scroll), Alethia (Features, Parallax), Tresmares Capital (Features, Parallax, Pinned Scroll), Floema (Features, Parallax, Pinned Scroll), Dgrees (About, Content, Features, Media Showcase, Parallax, Stacked Scroll), Google Health second entry (Features, Pinned Scroll), Intent (Features, Scroll Animations), Sundrop (Features, Scroll Animations).
- Site chrome: dark UI, serif display headline in the hero, search field "Try ..." with AI-style natural language prompt, pill filter chips with horizontal scroll, "Featured" sort dropdown, grid of cards with NEW badge and age ("4D AGO"). Feed lazy-loads inside an inner scroll container (body height stays at viewport), 30 video elements present after first load.

### Log B3: details.so Health industry category (42+ total; 8 visible anonymously; the cap is 8 per category without an account)
Method: each entry's screen recording (3-10 s mp4) was sampled into a grid of 4-6 evenly spaced frames and viewed. Motion descriptions are my reading of those frames; fine timing/easing is inferred, not measured.
- H1 Google Health (Hero, Scroll Animations; healthapp-490f38): full-bleed warm lifestyle photo hero with a short 2-line headline bottom-left and a small nav bar. On scroll the photo stays put (sticky) while a longer statement paragraph scrolls up over it, then pill-shaped feature chips appear under the text; finally the photo is released and the next section (centered heading on white) slides in. Pattern: sticky full-bleed media with scroll-driven text overlay.
- H2 Odyssee clinic (Scroll Animations, Services/Features; odysseeclinic-a85381): split screen. Left half is a cream column with small serif/sans list of services and copy that stays pinned; right half is a portrait image panel that swaps image as you scroll, the new photo wiping in from below over the old one (clip-path style vertical reveal). Calm, editorial, lots of whitespace. Pattern: pinned text column + scroll-swapped image stack.
- H3 ONOERA (Card Hover, Services/Features; onoera-7902cb): dark section, short intro paragraph, row of 3 tall photo cards (people in therapy settings) with a title label top-left and a small caption bottom-left. On hover, the hovered card remains bright and the siblings dim (spotlight hover); the cursor is visible moving across cards. Pattern: sibling-dim spotlight on a card row.
- H4 Virugroup (Hero, Preloader; virugroup-81b946): solid brand-green screen; the hero photo is revealed through a stepped, blocky staircase mask that eats away the green in chunks; then nav and a centered headline appear that mixes upright sans with an italic serif line. Pattern: masked block-reveal preloader into hero. (Short, about 2.5 s.)
- H5 Transform9 (Features, Stacked Scroll; transform9-a1ce86): large two-word heading pinned on the left (white background); on the right a column of service cards (healthcare outreach topics such as patient recall, appointment slot fill, scheduling support, prescription reminders). As you scroll, each new card slides up and stacks over the previous, which collapses to a thin title strip, so the stack reads like an accordion built by scrolling; each card is a deeper shade of blue than the last, with a small illustration at the bottom-right of the active card. Pattern: scroll-stacked cards collapsing to headers. Very relevant to healthcare services.
- H6 Dawn (Carousel, Testimonial/Social Proof; joindawn-61e143): warm sand-textured background, centered 2-line heading and small subtitle; testimonial cards (portrait cards, quote text) arranged along a gentle curve/fan, the center card lighter and fully opaque, side cards smaller and faded; two round prev/next buttons below (one accent orange). Advancing rotates the fan so a new card takes the center. Pattern: curved coverflow testimonial carousel.
- H7 OhMD (Hero; ohmd-3b8796): dark green hero, centered serif headline (2 lines), short subtitle, two pill buttons (filled mint primary, outline secondary); a field of tiny glowing dots spans the lower half; a stack of chat-message UI cards (patient messaging mock) floats below the CTAs. Frames nearly identical, so motion is ambient and subtle (inferred: drifting particles). Pattern: product-UI-in-hero over a calm ambient background.
- H8 /zeroz (Features, Pinned Scroll; otsuka-air-98d156): white page; a pale green card on the left is pinned while scrolling and rotates in 3D (flip / turn) between three faces: a donut chart, a grouped bar chart, then a brand card; the text on the right swaps per step; a large step counter (01, 02, 03 of 03) sits in the corners. Pattern: pinned card with scroll-driven 3D flip and step counter.
- H9 Google Health (Features, Parallax; healthapp-1c7b19; 28 s recording): long stack of full-bleed photo bands; inside each band the photo moves slower than the page (parallax within a mask), with thin connected-line data annotations and small UI chips overlaid on the imagery; text blocks (short title + paragraph) sit on top of some photos. Pattern: image-led parallax bands with floating data annotations.
Health-category takeaways: calm palettes (cream, sand, deep green, navy-blue), large photography of real people, serif or mixed serif headlines, and motion that is scroll-linked and slow rather than flashy. Two entries (Transform9, OhMD) show healthcare ops content (patient outreach, messaging), close to our product domain.

### Log B4: details.so breadth pass, anonymous entries per category (UI Elements). Format: site = entry's own tag title. Total shown in parentheses.
- 3D (73+): sweet-tape = Footer 3D; agrumeafarm = Products 3D + cursor interaction; coffee-tech = Hero 3D; seasats = 3D + scroll animations; seasats = Modal; cerebrium = Hero 3D; trevornoah = 3D. (7 visible)
- Accordion (53+): hone = FAQ accordion; wearetheromans = Features accordion; calendly = Features accordion; usavionix = Features accordion; white-desert = Accordion; customer = Features accordion; rogo = Testimonial accordion; produx = Services accordion.
- Button (174+): 3d-discovery, eduardbodak, heronaiapp, virugroup, cominvi, onlook (Hero button), zachwyt, ktappliance.
- Card (69+): heronaiapp = Features card + card hover; butter, ruul, onlook = Features card; tryarchitect = Steps card; ohmd = Stats card; clarasight = Stats card and Features card.
- Carousel (135+): healthapp (Google Health) = Features carousel; wearetheromans, esrbespoke, tengilemalamala = Carousel + media showcase; eduardbodak = Services carousel; maticrobots, virugroup = Features carousel; griflan = Testimonial carousel.
- List (116+): esrbespoke = Social proof list + pinned scroll; wearetheromans = Services list + scroll animations; griflan = Team list; cominvi = Features list and Portfolio list + scroll animations; nickho-motorsports = List + scroll animations; warmnfuzzy = Services list; everwonder = Portfolio list.
- Modal (69+): eduardbodak = Contact modal; tengilemalamala; cominvi = Products modal; white-desert (2); seasats; brandappart = Team modal; linear.
- Rows (79+): offforum = Portfolio rows + card hover; griflan = Portfolio rows and Content rows + cursor interaction; simonholm = About rows + parallax; ohmd = Features rows; revelatio = Services rows; echofi-bp = Features rows; unitedcarriers = Steps rows.

### Log B5: details.so breadth pass (Structure)
- CTA (31+): neutomni = CTA + cursor interaction; pensatori-irrazionali, fitosauna = CTA + scroll animations; shotbase, plnty = CTA section; plnty = CTA button; interfere, buildaustralia = Footer.
- Footer (337+): intentapp, hone, 3d-discovery = Footer + cursor interaction; kobbe, offforum, normalisboring = Footer; sweet-tape = Footer 3D; neutomni = CTA + cursor interaction.
- Hero (405+): trysundrop, intentapp, healthapp, segerman, neutomni = Hero + scroll animations; eduardbodak = Hero + preloader; plasma (2) = Hero.
- Legal (14+): buildaustralia, diffusion, trucknroll, studionamma, icomat, enerblock (6 visible).
- Navigation (242+): belgradearbor, odysseeclinic, 1367studio = Dropdown nav; sweet-tape, cominvi = Drawer nav; mariavasilyeva, lpas, agrumeafarm = Fullscreen nav.
- Drawer (57+): sweet-tape, white-desert, cominvi, threejs, likova, verostudio, stateofaidesign, giga (all Navigation drawer).
- Dropdown (74+): belgradearbor, odysseeclinic, shotbase, 1367studio, butter, fourmula, cerebrium, thanks (all Navigation dropdown).
- Fullscreen (69+): lpas, agrumeafarm, mariavasilyeva, virugroup, theartofdocumentary, exoape, nickho-motorsports, trevornoah (all Navigation fullscreen).
- Morphing (24+): havenconstructions, realevate, tengilemalamala, dobre, flowty, pensatori-irrazionali, apple, pacomepertant (all Navigation morphing, i.e. a nav element that changes shape).

### Log B6: details.so breadth pass (Page sections, part 1)
- 404 (79+): maximatherapy = 404 button; iyo, federicorosa, corentinbernadou, new, journey-digital, glenncatteeuw = 404 section; infracorp = 404 + cursor interaction.
- Article (32+): tengilemalamala = Article + parallax; luma = Article + pinned scroll; fora, studiodado, cantor8, appliedcompute, aave = Article; koto = Article modal.
- Blog (69+): 3d-discovery, lfs = Blog + card hover; tengilemalamala = Blog + parallax; cofactr, studiodado, wolverineworldwide = Blog; unitedcarriers = Blog list. (7 visible)
- Case Study (95+): offforum, lpas, kononenkogroup, betteroff, revelatio = Case study; exoape = Case study + scroll animations; wearetheromans = About; eduardbodak = Content + scroll animations.
- Contact (124+): heronaiapp, esrbespoke, lpas, 1367studio, virugroup, tengilemalamala (2) = Contact section; eduardbodak = Contact modal.
- Content (225+): offforum = About + media showcase; segerman, wearetheromans (2) = About; tengilemalamala = Content + parallax and + media showcase; maticrobots = About + scroll animations; agrumeafarm = Hero + scroll animations.
- About (96+): offforum, segerman, wearetheromans (2), maticrobots, driftime (+ scroll animations). (6 visible)
- FAQ (27+): hone, bymonolog, trucknroll = FAQ accordion; tengilemalamala, aave = FAQ section; virugroup = Content. (6 visible)
- Features (429+): trysundrop, sweet-tape, intentapp, hone = Features + scroll animations; healthapp = Features carousel, + pinned scroll, + parallax; sweet-tape = Features + text showcase.
- Services (97+): neutomni = + scroll animations and + pinned scroll; heronaiapp = + cursor interaction; eduardbodak = carousel; visuvate = + card hover; agrumeafarm = + stacked scroll; wearetheromans = list + scroll animations; lpas = + horizontal scroll.
- Steps (27+): tryarchitect = Steps card; theartofdocumentary = Steps + scroll animations; understory, godaylight = Steps + stacked scroll; generaldental (2), teamway = Steps; unitedcarriers = Steps rows. (generaldental is a dental clinic: directly relevant.)

### Log B7: details.so breadth pass (Page sections, part 2)
- Newsletter (10+): category page returned no entries in the anonymous server render (0 visible). Not retried further.
- Portfolio (239+): belgradearbor, eduardbodak = Portfolio; offforum = Portfolio rows + card hover; neutomni, wearetheromans = + pinned scroll; visuvate = + scroll animations; eduardbodak = + card hover; segerman = Hero + scroll animations.
- Pricing (62+): heronaiapp, diabrowser, butter, foglamp, shotbase, ideogram, cerebrium = Pricing; plasma = Pricing + cursor interaction.
- Products (34+): agrumeafarm = + card hover and 3D + cursor; cominvi = Products modal; noho = + cursor interaction; everyday; apple = 3D, + scroll animations, section.
- Social Proof (149+): esrbespoke = list + pinned scroll; griflan = carousel and testimonial carousel; uprock = testimonial + parallax; pensatori-irrazionali = logo; lovable = testimonial carousel; noho = testimonial + card hover; theartofdocumentary = logo + parallax.
- Logo (31+): pensatori-irrazionali, eleken, unitedcarriers, interfere, ecopiatech, bymonolog = logo wall; theartofdocumentary = logo + parallax; framer = logo carousel.
- Testimonial (91+): uprock = + parallax; noho = + card hover and carousel; griflan, lxlcreative, theartofdocumentary, lovable, get-ripe = testimonial carousel.
- Stats (60+): 1367studio = Content; cominvi = Stats + pinned scroll; ohmd, clarasight = Stats card; virugroup = Stats + parallax; noho, biograph = Stats + card hover; aircenter = Stats section.
- Team (81+): heronaiapp, k95, revelatio = Team section; aspensearch = Team carousel + cursor interaction; griflan = Team list; telhaclarke = Team + pinned scroll; curocapital, unitedcarriers = Team carousel.
- Timeline (19+): tengilemalamala, ario, betteroff = Timeline; eladiodieste, eleken = Timeline + scroll animations. (5 visible)

### Log B8: details.so breadth pass (Transitions, Scroll, Pointer)
- Contextual Transition (24+): realevate, pacomepertant, tux, fluid (4 visible).
- Page Transition (140+): offforum, wearetheromans, sweet-tape, mariavasilyeva, milledollars, segerman, virugroup, realevate.
- Preloader (244+): obys, sweet-tape, heronaiapp, neutomni, segerman = Preloader; eduardbodak, tengilemalamala, wearetheromans = Hero + preloader.
- Section Transition (109+): havenconstructions, realevate = Media showcase; griflan, transform9, horeca-social = Section transition; squarespace, realevate, lukebaffait = Scroll animations.
- Media Showcase (198+): offforum, tengilemalamala (2), wearetheromans, maticrobots, griflan, esrbespoke, neutomni.
- Scroll Animations (470+, the largest tag): trysundrop (Features, Hero), intentapp (Features, Hero), sweet-tape, hone (Features), healthapp (pinned, parallax).
- Horizontal Scroll (46+): sweet-tape (text showcase), lpas, santalarch (Services), butter (Content), sobha-privy-collection, white-desert (Content + pinned), zachwyt (Testimonial), sunday (Features).
- Parallax (66+): virugroup (Stats), tengilemalamala (Article, Blog, Content x2), healthapp (Features), uprock (Testimonial), theartofdocumentary (Logo).
- Pinned Scroll (208+): healthapp, heronaiapp, sweet-tape (Features), neutomni (Portfolio, Services), luma (Article), wearetheromans (Portfolio), esrbespoke (Social proof list).
- Stacked Scroll (92+): wearetheromans, virugroup, theartofdocumentary, uprock (Features); agrumeafarm, horeca-social, lxlcreative (Services); rectangles.
- Text Showcase (82+): sweet-tape (Features), eduardbodak, everwonder, ferndesk, nrg (Content), hazel (Hero), pensatori-irrazionali (CTA). (7 visible)
- Card Hover (slug hover-animations, 124+): offforum (Portfolio rows), 3d-discovery (Blog), dessn (Features), heronaiapp (Features card), visuvate (Services), auar, agrumeafarm (Products), odysseeclinic (Services).
- Cursor Interaction (135+): intentapp, hone, 3d-discovery, heronaiapp (Footer); vucko, heronaiapp (Services); neutomni (CTA); partizan (Navigation).
- Newsletter retried: still 0 entries anonymously.
Breadth pass complete: all 51 pattern categories plus Health industry listed. Next: deep pass, sampling recordings per pattern type.

### Log B9: details.so deep pass, method correction + first stats samples
- Anonymous reach: 300 unique entries across the 51 pattern categories (8 per category cap). 250 are screen recordings (mp4), 50 are static full-page/section screenshots (poster image only).
- Correction: my first media lookup took the first recording found on an entry page; for static-image entries that is a related entry's video. Fixed by detecting the entry's own poster. The Health entries in Log B3 were re-checked: all are genuine recordings of the named sites.
- S1 CoMinVi (Stats + Pinned Scroll; cominvi-8bbec0): light grey-green background; a large centered percentage with a small label sits inside a thin ring made of tick marks; while the section is pinned, scrolling advances the ring (ticks turn accent orange progressively) and the figure and label change from one stat to the next (35% to 65%); then a single-line statement reveals in the following band. Pattern: pinned radial progress stat that steps through several figures.
- S2 Clarasight recording (shown on the "OhMD stats card" entry page via its related media; the OhMD entry itself is a static image): pale lavender page, small eyebrow + 2-line centered headline with highlighted accent words; two cards side by side: white card with a big "100%" inside a tick-mark ring gauge, and a dark navy card listing 3 numbered percentage rows with labels; the cards rise into place on scroll and a closing 2-line statement fades in below. Pattern: gauge card + list card comparison.
- S3 Virugroup (Stats + Parallax; virugroup-7fc157): heading block ("we are an international group" style, with an italic serif word) on a pale band with a stepped/notched bottom edge; then a full-bleed aerial photo with white stat cards (big number + superscript plus sign + small label) scattered at different positions that move at different speeds than the photo as you scroll (parallax layers); next band starts with an icon, serif title and italic subtitle. Pattern: parallax floating stat cards over full-bleed imagery.
- S4 Biograph (Stats + Card Hover; biograph-5b1e9d): white page, row of 3 square stat tiles (big figure top-left, short description below each); on hover a tile fills with a soft, slowly shifting blurred gradient (pink, then blue, then green per tile) and the figure turns white; a row of partner logos sits below. Pattern: hover-revealed gradient stat tile.

### Log B10: details.so Testimonial samples
- T1 Noho (Testimonial + Card Hover; noho-d0b5b8): warm off-white page, plain heading; two wide testimonial cards side by side, each with a small portrait, name and role, a paragraph, and a large pull quote at the bottom. Hovering a card darkens its beige tint and swaps the portrait for a second photo of the same person (image swap on hover). Pattern: quiet hover state that adds life without moving layout.
- T2 Lovable (Testimonial Carousel; lovable-c3d362): centered heading + subtitle + small link; a horizontal strip where only the active card is wide (company logo, quote, author avatar and name, a column of 3 big outcome metrics, a "read story" button) and the inactive ones are narrow tiles showing just the company logo; advancing expands the next tile and collapses the current one; small pagination controls below. Pattern: expanding-card carousel (accordion-carousel hybrid) pairing a quote with outcome numbers.
- T3 Griflan (Testimonial Carousel; griflan-99d0f7): dark page, mixed sans + italic serif heading; testimonial quotes as tilted sticky-note cards (red and cream, quote-mark glyphs) loosely scattered; a round custom cursor badge suggests drag; the collage moves sideways as a drag carousel. Playful; useful only as a toned-down idea (slight tilt, drag to browse).

### Log B11: details.so FAQ samples (6 visible, all video)
- F1 Hone (FAQ accordion; hone-ed1861): big heading top-left; on the right a stack of pale teal accordion rows (question + small label); one open at a time; the open item gets a deeper tint, shows the answer and a small inline link/badge; the previously open one collapses as the next opens (smooth height change inferred). 
- F2 bymonolog (FAQ accordion; bymonolog-5c9b14): dark page; large 2-3 line headline; list of hairline-separated question rows; hovering a row paints a light grey highlight bar behind it; clicking expands the answer inline. Left column holds a small portrait of a real person with name and a contact button, so the FAQ is paired with a human you can reach. Pattern: FAQ + human contact card.
- F3 Tengile MalaMala (FAQ; tengilemalamala-c897d8): cream editorial page; FAQ grouped by topic, group titles in a left column, questions in a right column with hairline dividers and small square plus icons that turn into filled green circles when open; answers push content down. Pattern: grouped, two-column FAQ with state-colored toggles.

### Log B12: details.so Steps samples (8 visible). Media lookup refined again: entry's own recording = the recording whose filename starts with the entry's site name; result 274 recordings, 12 static images, 14 uncertain (skipped).
- P1 General Dental (Steps; generaldental-0fef07), a dental clinic site: warm beige editorial page; a wide interior photo of the clinic lounge on top; then 3 numbered steps in a staggered zig-zag (01 left, 02 lower right, 03 left beside a large candid photo of a smiling patient); oversized deep-green numerals, short heading and paragraph per step; sections reveal as you scroll; closes on a deep green band with a call to action. Pattern: staggered numbered steps with real patient photography.
- P2 General Dental (Steps; generaldental-cc332f): "why choose us" style band; giant condensed green numerals 1, 2, 3 each in a tall column separated by thin vertical rules; while pinned, each new column slides in from the right and the earlier columns compress leftwards until "1 2 3" sit side by side; the active step's heading and copy sit beside its numeral. Pattern: pinned horizontal step reveal with compressing columns.
- P3 Daylight (Steps + Stacked Scroll; godaylight-1bf62d): warm cream panels with an orange accent; each step is a full-width rounded panel that slides up over the previous (stacked cards); the second panel animates an isometric line drawing of a house where orange roof tiles assemble piece by piece as you scroll; ends on a dark photo band with a large serif statement. Pattern: stacked step panels with scroll-scrubbed line illustration.

### Log B13: details.so Accordion, Carousel, Card Hover samples
- A1 Calendly (Features accordion; calendly-1f7d31): light warm page, centered heading + subtitle + dark pill CTA; below, a horizontal accordion of 4 columns for stages of a meeting journey (book, prepare, meet, follow up). The hovered/active column widens slightly, shows a short checklist and a product UI snippet (booking widget, reminder email, video call tile, follow-up message) inside a card with a soft multicolor gradient glow at its base; inactive columns show only title, one line of copy and a faint large letterform. Pattern: horizontal hover accordion of journey stages with UI previews. Direct analogue for a patient journey (book, prepare, visit, follow up).
- C1 Google Health (Features carousel; healthapp-52a5c5): one large rounded card split into a lifestyle photo (left) and a pastel text panel (right) holding a title, short copy and a bottom row of tab labels with an underline indicator; slides advance (auto-play inferred from steady progression) and each slide has its own pastel (light blue, mint, warm grey, peach) and photo; categories like medical records, wearables, apps, devices. Pattern: tabbed split-card carousel with per-slide color. Direct analogue for DepartmentsShowcase.
- CH1 Dessn (Features + Card Hover; dessn-e74a90): dark container on a retro striped band; 3 tall beige cards (title, short copy, faint line icon); the hovered card lifts and lightens slightly while siblings stay put. Short, subtle.
- CH2 Visuvate (Services + Card Hover; visuvate-69e63b): black page, grid of square service tiles with thin borders (icon + 2-line label); the hovered tile shows a faint sparkle/particle field inside it; below, a tool-logo grid next to a short statement. Subtle, decorative.
- CH3 Odyssee clinic (Services + Card Hover; odysseeclinic-0657fe): off-white page; row of 4 image tiles shown washed-out, near white, with only a number + title under each; hovering a tile restores it to full color and reveals its short description, the others stay faded. Pattern: "faded until focused" reveal. A clinic site: calm and clinical-luxury.

### Log B14: details.so Navigation samples
- N1 Odyssee clinic (Navigation dropdown; odysseeclinic-a1cfa5): the menu button opens a compact panel anchored top-right rather than a full-screen takeover; it holds a short link list, a small image with a teaser line, and a navy card with booking/contact details; the page behind washes out (fade to near white, blur inferred). Pattern: compact menu card with a built-in "book" card. Strong fit for a hospital header (links + emergency/booking card).
- N2 Apple (Navigation morphing; apple-9f281c): a small sticky pill-shaped product bar expands (morphs in place) into a large dark rounded panel listing models and color swatches, while the page behind is heavily blurred; collapsing reverses it. Pattern: pill-to-panel morph with backdrop blur (shared layout animation).
- N3 Likova (Navigation drawer; likova-63dd55): over a full-bleed architecture photo, a small white card in the bottom-left corner (thumbnail + round button) grows into a tall white drawer covering the left part of the screen, with a stacked link list, a dark primary button and an outline secondary button at the bottom, and a faint isometric graphic in the corner. Pattern: corner card that expands into a side drawer.
- N4 LPAS (Navigation fullscreen; lpas-08e5ec): video hero with a large statement bottom-left; the menu opens a near-black full-screen overlay: big primary links in one column, smaller secondary links in another, contact and address details in a bottom row; the hero behind is dimmed. Pattern: two-tier full-screen menu with contact footer.

### Log B15: details.so Hero and Text Showcase samples
- HE1 Sundrop (Hero + Scroll Animations; trysundrop-8409a6): white page; centered bold 2-line headline, short subtitle, small blue pill CTA; around it float cut-out photos of children, bright flower/blob shapes and tiny UI notification chips. On scroll the decorations drift outward at different speeds (scattered parallax) while the headline scrolls away, and the next section (short heading above a phone mockup) rises in. Pattern: floating collage hero with depth on scroll.
- TS1 Ferndesk (Text Showcase; ferndesk-c03f66): dark band; headline built as a fixed lead-in plus an accent-colored phrase that cycles through several endings, with a brief character-scramble between phrases; a list on the right shows all phrases faded with the current one highlighted in sync; a row of quote cards sits below. Pattern: rotating keyword headline synced with a highlighted list.

### Log B16: details.so Page Transition and Preloader samples
- PT1 Milledollars (Page Transition; milledollars-487e7c): every page has its own flat background color (lilac, butter yellow, light grey) and the same layout grid (large uppercase statement left, rounded image card right, small meta columns); navigating swaps the whole background color while content fades and slides in, so each page change feels like turning a colored page. Pattern: color-coded route transitions on a stable grid.
- PL1 Heron AI (Preloader; heronaiapp-33aa2b): off-white canvas where thin architectural lines draw themselves stroke by stroke into a blueprint, which then resolves into a fully shaded building illustration; the nav, a large uppercase headline and meta text then fade in around it. Pattern: line-drawing preloader that becomes the hero image. (Inference: a hospital could do a much shorter version, e.g. a logo or cross mark drawing in under 1 s, or skip preloaders entirely.)

### Log B17: details.so Section Transition and Horizontal Scroll samples
- ST1 Transform9 (Section Transition; transform9-0a9c7d), a healthcare-ops AI site: the dark hero (headline with an accent-colored phrase about supporting patients) hands off to a white section through a pixel dissolve: a grid of squares in the brand colors (blue, mint, black, white) fills in with stagger as you scroll, then the next heading and a dark product-UI card rise in. Pattern: pixel-grid dissolve between dark and light sections.
- HS1 Santalarch (Services + Horizontal Scroll; santalarch-64a1f8): black page; a row of large service words slides horizontally as you scroll vertically; the word at the center becomes bright and an image beneath it grows from a thin sliver to a full portrait card with a short description, while neighbors stay faint; a thin progress line runs along the top. Pattern: scroll-driven horizontal word track with expanding image for the active item.

### Log B18: details.so Stacked Scroll and Pinned Scroll samples
- SS1 Agrumea Farm (Services + Stacked Scroll; agrumeafarm-4d0404): saturated orange page, large serif uppercase heading; numbered experience cards (photo on the left, big serif number, title and small meta on the right) slide up one after another; the card underneath tilts slightly and recedes as the next lands on top, like a stack of postcards. Pattern: tilted stacked cards.
- PS1 Neutomni (Services + Pinned Scroll; neutomni-8be939): white page with a red accent; while pinned, 4 red columns rise from the bottom at staggered heights (reading like an animated bar chart), grow until they form 4 equal full-height panels, and thin line drawings (circles, arcs) are traced across them; each panel carries a service title and short description at its foot. Pattern: rising-column services grid.

### Log B19: details.so Parallax and Media Showcase samples
- PX1 Tengile MalaMala (Content + Parallax; tengilemalamala-bcd24b): full-bleed wildlife photo with a large uppercase 2-line heading whose second line is indented; on scroll a cream content panel slides up over the photo like a curtain while the photo moves slower behind it; the panel holds a large, very readable intro paragraph, then small text columns and a second smaller photo. Pattern: content curtain over a slower background image.
- MS1 Offforum (About + Media Showcase; offforum-0362b8): white page, bold headline top-left; a diagonal staircase collage of photos of different sizes cascading down and right, drifting at different speeds as you scroll; then a large serif uppercase statement with a short list of dated rows with arrows; then a partner logo grid; then a large photo beside body copy. Pattern: cascading collage + event detail rows.

### Log B20: details.so Team samples
- TM1 Telha Clarke (Team + Pinned Scroll; telhaclarke-bf8bc5): white page; a long column of team names in large light-grey type scrolls past a focal line; the name at the focal line turns black and a portrait pinned on the right swaps to that person (with a small name caption). Pattern: scroll-spy name list with pinned portrait. Direct analogue for a doctor directory (name list + photo + specialty).
- TM2 Curo Capital (Team carousel; curocapital-f8aed5): cream page; left column shows the active person's name, role, short bio and two small buttons; a large portrait sits center; a row of smaller washed-out portraits of the others runs along the bottom/right; arrow buttons top-right advance, swapping the big portrait and the bio together, and the active thumbnail regains full color. Pattern: featured-profile carousel with bio panel.

### Log B21: details.so Timeline samples
- TL1 Eleken (Timeline + Scroll Animations; eleken-8d5f82): off-white page; centered heading + dark pill CTA; a horizontal row of phase labels acts as the time axis; as you scroll, grey gantt-style bars appear one by one in a descending staircase and an orange ball travels down along them like a progress marker; ends on a case card with a small chart. Pattern: scroll-built gantt timeline with a moving progress marker.
- TL2 Eladio Dieste (Timeline + Scroll Animations; eladiodieste-09b85c): dark page; a chronological gallery where photos of works sit at scattered positions and sizes; a year label and caption sit at the center and update as you scroll while images glide past at different depths. Pattern: scattered chronological gallery with centered year marker.

### Log B22: details.so Pricing and Contact samples
- PR1 Heron AI (Pricing; heronaiapp-eddac6): off-white with an orange accent; huge uppercase heading and one-line subtitle; a dark segmented toggle switches billing period and the prices in all columns update (a small savings badge appears); a 4-column plan comparison table with price, orange button, then rows of feature checkmarks; the plan header row stays sticky while the long table scrolls; flows directly into an FAQ list. Pattern: sticky-header comparison table with period toggle.
- CO1 ESR Bespoke (Contact; esrbespoke-03dcd3): large "get in touch" heading over a wide photo of the premises; below, an editorial two-column grid: left column labels (enquiries, visit us), right columns with phone, email, address and opening hours separated by hairlines, arrow links, and photos of the location's exterior and reception interspersed. Pattern: editorial contact + visit information with place photography. Good fit for hospital contact/visit page.

### Log B23: details.so Blog and 404 samples
- BL1 LFS film school (Blog + Card Hover; lfs-370f3b): dense 3-column news grid of photo cards with bold headlines and small meta lines; hovering a card switches its headline to the brand red and adds a small red label (accent color as the hover signal; no layout shift). Pattern: editorial news grid with accent-color hover.
- 404-1 Maxima therapy (404 + button; maximatherapy-158f45), a therapy practice: pastel pink page, giant rounded blue "404" numerals woven into a friendly illustration (a big-eyed character, clouds, plants, a bird); short uppercase message and a single pill button back home; the cursor moves around the character and the pupils appear to follow it (inferred from small eye changes between frames). Pattern: warm illustrated 404 with a playful cursor response.

### Log B24: details.so Modal and List samples
- MO1 Linear (Modal; linear-eb8d1a): dark product page with feature blocks; activating a feature opens a tall side sheet that slides in from the right over a dimmed page, containing a title, description, an embedded product-UI snippet and a property list; switching features swaps the sheet content. Pattern: side-sheet detail panel. Direct analogue for ERP record details (patient, order, audit event) without leaving the list.
- LI1 Griflan (Team list; griflan-ffeae0): dark page; a group photo, then a full-width list of names with roles right-aligned and hairline separators; hovering a row turns the name red and shows that person's portrait (on a red tile) floating next to the cursor. Pattern: list with cursor-following hover preview.

### Log B25: details.so Rows and Button samples
- RO1 OhMD (Features rows; ohmd-9b7a85), patient-communication product for clinics: below a partner logo strip, wide rounded feature rows (copy and a small mint pill button on the left, a warm photo of clinic front-desk staff on the phone on the right) slide up and overlap the previous row as you scroll; then a section with a message-thread UI card. Calm off-white and deep green palette. Pattern: stacked feature rows with real clinic photography.
- BU1 Heron AI (Button; heronaiapp-a814d6): rectangular dark button with an uppercase label and arrow; on hover the fill dissolves through a pixel/dither pattern into a light fill (and back on leave); the custom cursor is a small red square. Pattern: dithered fill-swap hover. (Inference: for us a simpler left-to-right fill sweep conveys the same feedback more calmly.)

### Log B26: details.so CTA and Footer samples
- CT1 Fitosauna (CTA + Scroll Animations; fitosauna-7e7f87), a wellness brand: full-bleed calm interior photo with a one-line headline centered; on scroll the headline splits, its two halves sliding to the left and right edges, and a cream offer card (risk-free trial message, a simple line icon, a short list, a dark full-width button) rises into the gap at center; then the next section heading appears. Pattern: split-headline reveal with a rising CTA card.
- FO1 Hone (Footer + Cursor Interaction; hone-1dc74a): above the footer, a pale dotted-grid canvas where moving the cursor leaves a trail of green dots (a small game-like toy with a green label tab); below, a black footer with link columns, a newsletter input with a green button, and a large logotype. Pattern: playful interactive footer canvas. (Too playful for a hospital as-is; a static dotted grid texture is the transferable part.)

### Log B27: details.so Logo and Cursor samples
- LG1 Framer (Logo carousel; framer-b78a3c): dark page, small heading and button; a row of client logos in tall cells divided by vertical hairlines drifts sideways continuously (marquee); the hovered cell lifts a tall preview card (a screenshot of that client's site) behind its logo while the rest stay plain; a glowing gradient CTA band sits below. Pattern: logo marquee with hover preview cards.
- CU1 Heron AI (Services + Cursor Interaction; heronaiapp-90cbbe): off-white technical-drawing aesthetic; feature rows as dark label bars; a thin red line links the active row to a floor-plan drawing where red markers pop in and annotation cards appear; moving down the page swaps the drawing per row. Pattern: annotated diagram linked to a feature list. (Inference: transferable to a hospital campus/wayfinding map with department markers.)

### Log B28: details.so Features and Contextual Transition samples
- FE1 Intent (Features + Scroll Animations; intentapp-2bb66f): dark page; a loose cloud of pill chips naming capabilities, arranged in staggered rows; the hovered chip glows yellow; selecting it zooms into a large product window mock (side panels, a map, a chart) that grows to fill most of the viewport, then the window's inner scenes change as you continue. Pattern: chip cloud that expands into a product demo (shared-element zoom).
- CX1 Tux (Contextual Transition; tux-66802c): neon green hero with a giant 2-line uppercase headline and a small photo in the middle that cycles images like a flipbook; following the CTA, a dark wipe covers the screen and a dense masonry grid of project cards rises into place. Pattern: element-led transition into the next context (the clicked context carries into the next view).

### Log B29: details.so Legal and Article samples
- LE1 Diffusion (Legal; diffusion-9cc716): dark 3-column document: a sticky left list of legal pages, a central readable column with numbered headings, bullet lists, accent-red inline links and simple data tables, and a sticky right-hand table of contents that tracks the current section (scroll-spy highlight). Pattern: sticky TOC legal layout. Direct fit for our policy pages.
- AR1 Fora (Article; fora-c3fa44): dark page; centered category pill, centered 2-3 line title, wide rounded hero photo; narrow reading column with step-numbered subheadings and lists; an inline product CTA block near the end; a "relevant posts" row of 3 image cards closes the page. Pattern: focused long-read with inline CTA and related posts. Fit for blog/[slug].

### Log B30: details.so Social Proof list and Case Study samples
- SP1 ESR Bespoke (Social proof list + Pinned Scroll; esrbespoke-f61bd1): white page; a tall list of client brand names in very large light-grey type; as you scroll, the name at the focal line turns black and a square image next to it swaps to match; then a dark band follows. Same scroll-spy-list mechanic as TM1 (Telha Clarke), so this is a recurring pattern.
- CS1 Exoape (Case study + Scroll Animations; exoape-bfd0cd; 17 s): dark hero photo with an intro statement and a row of meta columns (client, services, year, link); scrolling moves into a white collage of photos of different sizes drifting at different speeds; a small framed image then grows into a near full-width image as it enters (scale-up reveal). Pattern: meta-row intro + collage + scale-up media.

### Log B31: details.so 3D and Card samples
- 3D1 Cerebrium (Hero 3D; cerebrium-458097): dark magenta scene of large 3D ribbon arcs; a bright light streak travels along one ribbon; the headline (with one accent-colored phrase), copy and two buttons fade out as the camera pushes toward the ribbons on scroll and return afterwards. Pattern: ambient 3D hero with traveling highlight. (Not a fit for a hospital brand; noted for completeness.)
- CA1 Heron AI (Features card + Card Hover; heronaiapp-c5c2b3): off-white grid of 4 columns divided by hairlines; each column has a thin line-drawn wireframe object (cube, sphere, stacked forms) above a bold uppercase title and short copy; hovering a column animates its wireframe (lines redraw/rotate and gain detail) while the layout stays still. Pattern: hairline grid with hover-animated line icons. (Inference: lucide icons with a stroke-draw on hover give a calm version.)
Deep pass complete: 56 recordings sampled (plus the 9 Health entries), covering 48 of 51 pattern categories. Not sampled: Newsletter (no anonymous entries), Portfolio, Products, Morphing beyond Apple, Rows beyond OhMD; these were covered at list level only.

