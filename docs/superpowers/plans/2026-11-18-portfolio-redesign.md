# Vaibhav Badole Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Vaibhav Badole's motion graphics and AI video portfolio website into a premier, studio-grade creative showcase with new high-impact sections, upgraded header and footer, and enhanced micro-interactions while strictly preserving all existing interactive animation engines and the signature violet/plum/lilac/coral/butter color identity.

**Architecture:** The website remains a zero-dependency vanilla web app (HTML5, CSS3, ES6 JavaScript). The HTML structure is expanded with semantic sections and interactive widgets. The CSS stylesheet is upgraded with refined typography, responsive glassmorphism, fluid spacing, and tactile micro-interactions. The JavaScript engine extends existing scroll-linked lerp RAF loops with modular helpers for live timekeeping, clipboard interaction, category filtering, FAQ toggles, and navigation states without disrupting any existing component selectors.

**Tech Stack:** Vanilla HTML5, Modern CSS3 (Grid, Flexbox, Clamp, Backdrop-Filter, CSS Custom Properties), Vanilla ES6+ JavaScript (RequestAnimationFrame, IntersectionObserver, Clipboard API).

**Spec:** [docs/superpowers/specs/2026-11-18-portfolio-redesign-design.md](file:///C:/Users/JAY/Downloads/Vaibhav-port/docs/superpowers/specs/2026-11-18-portfolio-redesign-design.md)

---

## Global Constraints

- Preserve exact color tokens from spec: `--base: #19172d`, `--plum: #292443`, `--lilac: #e8e0f5`, `--ink: #fbf7ef`, `--coral: #ff765f`, `--coral-deep: #a9413b`, `--butter: #f4ca62`, `--deep: #201c38`.
- Preserve all existing selectors and data attributes: `#showreelTrack`, `[data-reel-card]`, `#soundToggle`, `#soundText`, `#showreelCursor`, `#cursorText`, `[data-about-copy]`, `[data-about-image]`, `#aboutImageCaption`, `#aboutImageCount`, `[data-pop-text]`, `#selectedWork`, `#projectWindow`, `#projectTrack`, `[data-project-card]`.
- No external runtime dependencies or build steps (zero npm packages required to view or run).
- Full mobile responsiveness with minimum touch target size of 44x44px.
- Support `prefers-reduced-motion` for all new transitions and animations.

---

## Review Focus

1. **Selector Preservation:** Existing RAF loop in `script.js` must find all existing DOM elements without throwing `null` errors.
2. **Video & Sound Autoplay Policy:** Videos must still strictly adhere to user presence inside the showreel track and gesture unmuting.
3. **Clipboard API Permissions:** One-click email copy must gracefully fallback if clipboard write access is blocked.
4. **Project Filtering Alignment:** Project filtering must not break the horizontal carousel step or leave dead space.
5. **High-Contrast Readability:** All text across both dark violet and light lilac sections must maintain WCAG AA contrast.

---

### Task 1: HTML Architecture & Section Additions

**Files:**
- Modify: `Vaibhav-port/index.html`

**Interfaces:**
- Consumes: Spec wireframe & layout structure.
- Produces: Complete semantic DOM elements including `.site-header`, `.scroll-progress-bar`, `.milestones-bar`, `.pipeline-panel`, `.faq-panel`, and `.site-footer`.

- [ ] **Step 1: Implement the Floating Glass Island Header and Scroll Progress Bar**
  Add `<div class="scroll-progress-bar" id="scrollProgressBar" aria-hidden="true"></div>` right inside `<body>`.
  Add `<header class="site-header" id="siteHeader">` containing:
  - Brand identity (`vaibhav badole`) + live availability pill (`<span class="status-indicator"></span> Available for Q2 Projects`)
  - Desktop nav list (`#showreelTrack`, `#aboutStory`, `#selectedWork`, `#pipeline`, `#tools`, `#contact`)
  - Time badge (`<span class="time-badge" id="localTimeBadge">Nagpur --:-- IST</span>`)
  - Mobile hamburger toggle button (`#menuToggle` with aria-label and aria-expanded)
  - Mobile slide-out drawer (`#mobileDrawer`)

- [ ] **Step 2: Enhance Hero Section Metadata & Interactive Indicator**
  Inside `<main class="hero" id="hero">`, retain existing layers and headlines.
  Add telemetry bar (`<div class="hero-telemetry">`) with frame rate, focal cues, and interactive prompt: `<a href="#showreelTrack" class="hero-scroll-cue">( SCROLL TO EXPLORE ↓ )</a>`.

- [ ] **Step 3: Upgrade Showreel Track Sound Toggle & Card Badges**
  Inside `<section class="showreel-track" id="showreelTrack">`:
  - Update `#soundToggle` to include `<span class="sound-bars" aria-hidden="true"><span></span><span></span><span></span></span>` for equalizer animation alongside `#soundText`.
  - Add metadata pill chips (`<div class="reel-badge">4K UHD • 60 FPS</div>`) to each `[data-reel-card]`.

- [ ] **Step 4: Add Studio Milestones & Telemetry Strip**
  Directly following the showreel track, insert `<section class="milestones-bar" id="milestones" aria-label="Studio Metrics">`:
  - Metric 1: `10+` Years Shaping Motion & Video
  - Metric 2: `150+` Commercials & Digital Deliveries
  - Metric 3: `40M+` Views Driven Across Campaigns
  - Metric 4: `100%` Bespoke Sound Design & AI Workflows

- [ ] **Step 5: Enhance Selected Work Carousel with Category Filter Chips**
  Inside `<section class="work-story work-panel" id="selectedWork">`:
  - Add category filter controls `<nav class="work-filters" id="workFilters" aria-label="Filter selected work">` with buttons: `All`, `Commercials`, `AI Video`, `Motion Graphics`.
  - Add `data-category` attributes to existing `[data-project-card]` elements (`commercial`, `ai-video`, `motion`).

- [ ] **Step 6: Add Creative Pipeline / 4-Step Methodology Section**
  Directly after the Selected Work carousel, add `<section class="story-panel pipeline-panel" id="pipeline" aria-label="Creative Methodology">`:
  - 4 pipeline step cards with step index, title, description, and toolkit badges:
    - `01 / CONCEPT & SCRIPTING`
    - `02 / VISUAL DEV & 3D FRAMES`
    - `03 / MOTION & NEURAL VIDEO`
    - `04 / SOUND & MASTER FINISHING`

- [ ] **Step 7: Add Interactive Studio FAQ & Inquiry Accordion**
  Directly after the Tools section, insert `<section class="story-panel faq-panel" id="faq" aria-label="Frequently Asked Questions">` containing 4 interactive accordion items:
  - Turnaround times and sprint schedules
  - Blending generative AI (Google Veo, Midjourney, ComfyUI) with human motion design
  - Custom sound design, scoring, and broadcast mastering
  - Project scoping, day rates, and commercial deliverables

- [ ] **Step 8: Redesign High-Impact Footer with Email Copy Action**
  Replace Section 7 footer with `<footer class="site-footer" id="contact" aria-label="Contact">`:
  - Massive headline: `LET'S MAKE SOMETHING THAT MOVES PEOPLE.`
  - Direct email block with `<button class="email-copy-btn" id="emailCopyBtn" data-email="vaibhavbadole@gmail.com" type="button">`
  - Inline toast feedback: `<span class="copy-toast" id="copyToast" aria-live="polite"></span>`
  - Social link pills (Behance, Instagram, LinkedIn, YouTube, Vimeo)
  - Location badge: `Nagpur, India • UTC+5:30`
  - Back-to-top trigger button (`#backToTopBtn`)

- [ ] **Step 9: Verify HTML DOM Integrity**
  Inspect `index.html` to confirm all existing IDs (`showreelTrack`, `soundToggle`, `showreelCursor`, `aboutStory`, `selectedWork`, `projectTrack`) exist without modifications to their required signatures.

---

### Task 2: CSS Redesign & Aesthetic Polish

**Files:**
- Modify: `Vaibhav-port/style.css`

**Interfaces:**
- Consumes: Existing `:root` variables and section classes.
- Produces: Fully styled responsive layouts, glassmorphism shells, interactive animations, and dark/light contrast rules.

- [ ] **Step 1: Configure Header, Progress Bar, and Navigation Styles**
  Add CSS for:
  - `.scroll-progress-bar`: Fixed top 0, height 2px, z-index 1000, gradient from `--coral` to `--butter`.
  - `.site-header`: Fixed floating pill, top 20px, left 50%, transform translateX(-50%), max-width 1240px, width calc(100% - 32px), z-index 990, frosted glass (`backdrop-filter: blur(16px)`), border 1px solid rgba(251, 247, 239, 0.1).
  - `.status-indicator`: 8px pulsing dot with ping animation in `--coral`/`--butter`.
  - `.mobile-drawer`: Responsive slide-down/fade drawer with backdrop blur and accessible touch targets.

- [ ] **Step 2: Style Sound Toggle Animated Equalizer & Showreel Badges**
  Add CSS for:
  - `.sound-bars`: Flex container with 3 vertical spans.
  - `.sound-bars span`: 2px wide, variable heights, animated with staggered keyframes when sound is ON; static flat bars when MUTED.
  - `.reel-badge`: Minimalist frosted pill pinned on reel cards showing resolution and frame rate.

- [ ] **Step 3: Style Studio Milestones Strip**
  Add CSS for `.milestones-bar`:
  - Responsive 4-column grid (2-column on mobile) in `--plum` with subtle glass highlight.
  - Metric numbers styled in large Archivo 700 with accent color `--butter`.
  - Metric labels styled in Archivo 400 with opacity 0.8.

- [ ] **Step 4: Style Creative Pipeline Grid**
  Add CSS for `.pipeline-panel`:
  - Bento-style 4-column responsive grid (1-column on mobile).
  - Cards styled in `--plum` with subtle `--coral` top border highlight on hover.
  - Step index numbers (`01`, `02`, `03`, `04`) in mono-style accent font.

- [ ] **Step 5: Style Selected Work Filters & Project Cards**
  Add CSS for:
  - `.work-filters`: Flex pill navigation with interactive buttons.
  - Active button state: Background `--coral`, text `--ink`, subtle box-shadow.
  - Smooth opacity/visibility transition when projects are filtered.

- [ ] **Step 6: Style Interactive FAQ Accordion**
  Add CSS for `.faq-panel`:
  - Light lilac background container (`--lilac`) for high-contrast pacing matching the About section.
  - `.faq-item`: Border bottom 1px solid rgba(32, 28, 56, 0.15), cursor pointer.
  - `.faq-question`: Flex between question and animated `+`/`−` chevron.
  - `.faq-answer`: Smooth CSS `max-height` and opacity transition when expanded.

- [ ] **Step 7: Style Redesigned High-Impact Footer**
  Add CSS for `.site-footer`:
  - Massive responsive display headline (`clamp(2.5rem, 6vw, 5.5rem)`).
  - `.email-copy-btn`: Tactile interactive button with magnetic hover feel and border highlight.
  - `.copy-toast`: Floating pill badge that animates in (`opacity: 1, translateY(0)`) upon copying.
  - Social link pills with smooth hover lift.
  - Back to top button with smooth hover animation.

- [ ] **Step 8: Responsive Layout & Accessibility Tuning**
  - Verify all touch targets on mobile (<768px) meet 44x44px.
  - Ensure `@media (prefers-reduced-motion: reduce)` disables intense transforms and animations.
  - Test text contrast across both dark sections (`--base`, `--plum`) and light sections (`--lilac`).

---

### Task 3: JavaScript Extensions & Interactive Polish

**Files:**
- Modify: `Vaibhav-port/script.js`

**Interfaces:**
- Consumes: DOM elements created in Task 1.
- Produces: Integrated handlers for scroll progress, digital clock, clipboard copy, project filter, and FAQ accordion.

- [ ] **Step 1: Implement Scroll Progress Bar Calculator**
  Create helper function `updateScrollProgress()`:
  - Calculate `(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100`.
  - Update `scrollProgressBar.style.width = '${percent}%'`.
  - Wire into existing `scroll` event listener and RAF loop.

- [ ] **Step 2: Implement Live Nagpur IST Digital Clock**
  Create helper function `initLiveClock()`:
  - Formats current time in `Asia/Kolkata` time zone (`HH:MM:SS IST`).
  - Updates `#localTimeBadge` every 1000ms.

- [ ] **Step 3: Implement Mobile Drawer Navigation**
  Add click listeners to `#menuToggle`:
  - Toggles `.is-open` on `#mobileDrawer` and `#menuToggle`.
  - Updates `aria-expanded` attribute.
  - Closes drawer when any drawer link is clicked.

- [ ] **Step 4: Implement One-Click Email Copy with Toast Feedback**
  Add listener to `#emailCopyBtn`:
  - Reads `data-email` attribute (`vaibhavbadole@gmail.com`).
  - Uses `navigator.clipboard.writeText()` with fallback to `document.execCommand('copy')`.
  - Displays "✓ Copied to clipboard!" inside `#copyToast`.
  - Auto-dismisses toast after 2500ms.

- [ ] **Step 5: Implement Selected Work Category Filtering**
  Add filter handler for `#workFilters` buttons:
  - Reads `data-filter` from clicked button.
  - Toggles `.is-active` class on filter buttons.
  - For each `[data-project-card]`, checks if category matches or filter is `'all'`.
  - Sets card visibility and re-triggers `measureScenes()` to recalculate horizontal track steps.

- [ ] **Step 6: Implement Interactive FAQ Accordion**
  Add accordion logic to `.faq-item`:
  - Clicking `.faq-question` toggles `.is-expanded` on the item.
  - Automatically collapses sibling items for a clean single-open accordion experience.
  - Manages `aria-expanded` for screen reader accessibility.

- [ ] **Step 7: Implement Smooth Scroll & Back-to-Top Handler**
  - Add listener to `#backToTopBtn` to execute `window.scrollTo({ top: 0, behavior: 'smooth' })`.
  - Ensure all navigation hash links (`href="#..."`) scroll smoothly to target elements.

---

### Task 4: End-to-End Verification & Quality Polish

**Files:**
- Review: `Vaibhav-port/index.html`, `Vaibhav-port/style.css`, `Vaibhav-port/script.js`

- [ ] **Step 1: Check File Syntax & Selector Integrity**
  Run powershell syntax checks or Node validation to ensure no broken tags, malformed CSS rules, or syntax errors.

- [ ] **Step 2: Verify Existing Interaction Engines**
  - Confirm showreel stack still scrolls and translates cards with scale and rotation.
  - Confirm custom follower cursor continues to lerp smoothly on mousemove.
  - Confirm sound toggle unmutes audio and equalizer bars animate.
  - Confirm about section splits words into `.about-word` and highlights on scroll.
  - Confirm selected work carousel handles horizontal scroll and hover video preview.

- [ ] **Step 3: Verify New Features**
  - Verify floating island header stays pinned and shows live availability and IST time.
  - Verify milestones telemetry renders smoothly.
  - Verify creative pipeline cards display responsive layout.
  - Verify work filter buttons filter cards cleanly.
  - Verify FAQ accordion opens and closes smoothly.
  - Verify email copy button copies text and displays toast.
  - Verify back to top button smoothly returns to the top.
