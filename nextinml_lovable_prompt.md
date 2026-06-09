# NextInML — Lovable Design Prompt

## What we're building

Design the NextInML platform — a discovery and access platform for early-stage ML students in the Global South (MENA, Africa) to find ML summer schools, research fellowships, and internship programs. Think: the layer between "I finished fast.ai" and "I know what I'm doing with my career."

---

## Brand System

### Logo mark
The logo uses a **signal broadcast mark**: a central filled circle with two concentric semi-circle arcs radiating upward from it (like a wifi symbol rotated 90° upward), plus a thin upward arrow emerging from the center dot. The arcs decrease in opacity outward (100% → 55% → 28%). The arrow is teal (#1D9E75), the arcs and dot are purple (#534AB7).

**Wordmark**: "NEXT" in Inter 300 Light, letter-spacing wide, color #534AB7 — stacked above "InML" in Inter 800 ExtraBold, letter-spacing tight, where "In" is #1D9E75 and "ML" is #1A1A1A.

### Colors
```
--color-primary:        #534AB7   /* purple · brand, arcs, primary actions */
--color-accent:         #1D9E75   /* teal · CTA, arrow, "In" wordmark */
--color-accent-light:   #5DCAA5   /* light teal · hover states, icons */
--color-text:           #1A1A1A   /* near-black · body, "ML" wordmark */
--color-bg:             #F8F7FF   /* very light lavender · page background */
--color-surface:        #FFFFFF   /* white · cards */
--color-purple-50:      #EEEDFE   /* tag backgrounds, hover tints */
--color-teal-50:        #E1F5EE   /* badge backgrounds, success states */
--color-gray-50:        #F1EFE8   /* neutral section backgrounds */
--color-border:         #E8E7F5   /* subtle purple-tinted border */
--color-muted:          #6B6880   /* secondary text, metadata */
```

### Typography
- **Font**: Inter (Google Fonts)
- **Brand wordmark**: "NEXT" → weight 300, tracking wide | "InML" → weight 800, tracking tight
- **Headings (h1–h3)**: Inter 700–800, tight letter-spacing
- **Body**: Inter 400, line-height 1.7
- **Labels / eyebrows**: Inter 500, uppercase, wide tracking, 11–12px
- **Deadlines / codes / tags**: monospace, #534AB7

### Spacing rhythm
- xs: 4px · sm: 8px · md: 16px · lg: 24px · xl: 48px
- Section vertical padding: 80px desktop, 48px mobile

### Border radius
- Cards: 12px
- Inputs / small components: 8px
- Tags / badges / pills: 999px (full pill)
- Mark favicon container: 10px

---

## Pages to design

### 1. Homepage (`/`)

**Hero section**
- Full-width, background #F8F7FF with a subtle large faded signal-arc SVG watermark behind the text (very low opacity, purple)
- Eyebrow label: "FOR STUDENTS THE NETWORK NEVER REACHED"
- H1: "Your next step in ML — finally visible." (Inter 800, large, near-black)
- Subheading: "Summer schools, fellowships, and internships for early-stage ML students in MENA, Africa, and the Global South." (Inter 400, --color-muted)
- Two CTAs side by side: "Browse opportunities" (filled teal pill button) + "Read experiences" (ghost purple pill button)
- Below hero: 3 stat chips in a row — "50+ programs", "30+ countries", "100% free to access" — each in a small pill with purple-50 background

**Opportunity type cards (3 columns)**
Each card:
- Icon area: the signal mark in miniature at top-left
- Category label (uppercase monospace, purple)
- Title: "Summer & Winter Schools" / "Research Fellowships" / "Internship Programs"
- 1-sentence description
- Count badge (e.g. "24 programs") in teal-50 pill
- "Explore →" link in teal

**Featured programs strip**
Horizontal scroll row of program cards (see card spec below).

**Human layer section**
- Section headline: "From students who were there"
- 2–3 review cards with: avatar circle (initials), name + program name, star rating, 2-line quote snippet, "Read full experience →"

**CTA banner at bottom**
- Background: #534AB7
- White headline: "Found your next step? Tell us about it."
- Subtext in lavender: "Write a review. Help the next student."
- White outlined button: "Share your experience"

---

### 2. Programs directory (`/programs`)

**Filter bar (sticky)**
- Horizontal row: search input (full pill, subtle border) + filter pills for: Type (All / Schools / Fellowships / Internships) · Format (In-person / Remote / Hybrid) · Deadline (Open now / Upcoming / Any) · Region (MENA / Africa / Global)
- Active filter pill: filled purple-50 background, purple text, × to clear
- Results count: "Showing 24 programs" in muted text

**Program card grid (2 columns desktop, 1 mobile)**

Each card:
- Top row: category pill (type) left + deadline chip right (monospace, border, e.g. "Dec 15")
- Program name: Inter 700, 18px
- Organizer + location: muted, 13px
- 2-line description
- Tags row: format pill + region pill (teal-50 background)
- Bottom row: "last verified" timestamp in muted 11px left + "View program →" teal link right
- Card border: 1px #E8E7F5, hover: border-color shifts to #534AB7 (subtle), slight translateY(-2px) transition

**Verified badge**: small teal dot + "Verified May 2026" — this is a trust signal, make it visible but not loud.

---

### 3. Program detail page (`/programs/[slug]`)

**Header**
- Breadcrumb: Programs › Summer Schools
- Program name: h1, Inter 800
- Organizer, location, format in muted row
- Two action buttons: "Visit program website ↗" (teal filled) + "Save program" (ghost purple)
- Tags row

**Info grid (2 columns)**
- Left column: Description (full), Eligibility, What you'll get, Application process
- Right column (sticky sidebar): Deadline countdown card (prominent), Key dates, Format/Location details, Signal mark watermark subtle in corner

**Experience reviews section**
- Section header: "From students who attended"
- Review cards: avatar, name, year attended, program edition, rating stars, full review text
- "Write a review" CTA if user attended

---

### 4. Experience / review submission (`/submit`)

Simple single-column form:
- Program search (autocomplete)
- Year attended
- Rating (star selector)
- "What was the vibe?" (textarea)
- "Was it beginner-friendly?" (yes/no/somewhat toggle)
- "Would you recommend it?" (yes/no/depends toggle)
- "One thing you wish you knew before applying" (textarea)
- Submit button: teal filled pill "Submit experience"

---

## Component library

### Buttons
- **Primary**: background #1D9E75, white text, pill shape, Inter 600 14px, hover: #0F6E56
- **Secondary**: background transparent, border 1.5px #534AB7, purple text, pill shape, hover: background #EEEDFE
- **Ghost**: no border, purple text, hover: background #EEEDFE

### Tags / badges
- **Type pill**: purple-50 bg (#EEEDFE), purple text (#534AB7), pill, Inter 500 11px
- **Teal badge**: teal-50 bg (#E1F5EE), teal text (#0F6E56), pill
- **Deadline chip**: white bg, #534AB7 border 1px, monospace 11px, rx 4px
- **Verified dot**: 6px circle #1D9E75 + "Verified" text in muted

### Navigation
- Sticky top nav: white bg, subtle bottom border (#E8E7F5)
- Left: signal mark favicon (44px) + "NEXT InML" wordmark
- Center: links — Browse / Experiences / About
- Right: "Submit experience" teal pill button
- Mobile: hamburger → full-screen overlay with same links

### Empty state
- Large faded signal mark SVG centered
- "No programs found" Inter 600
- "Try adjusting your filters" muted
- "Clear filters" teal link

---

## Tone & motion

- Transitions: 150ms ease-out for hovers, 200ms for card lifts
- No heavy animations — this is a utility platform, not a marketing site
- The one moment of delight: the signal arcs on the logo can have a very subtle CSS pulse animation (opacity 0.3 → 0.6 → 0.3, 3s loop) — signaling that the broadcast is live
- Page feel: serious but warm. Academic without being sterile. Built for someone who just finished their first ML course and is hungry for what comes next.

---

## What this platform is NOT

- Not a course platform (no video embeds, no progress bars for learning)
- Not a job board (no salary, no "years of experience required")
- Not a conference aggregator (no talk schedules, no speaker lineups)
- Not a social network (no follower counts, no feeds, no likes)

It is a **directory with a soul** — the human layer of first-person reviews is what makes it more than a spreadsheet.

---

*NextInML — built from inside the gap it closes.*
