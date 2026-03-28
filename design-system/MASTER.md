# ICO Design System — Master (Global Source of Truth)

> **Premium Services For Premium Customers** — Mobiliteit ontmoet vakmanschap

---

## 1. Design Philosophy

**Style:** Dark Luxury Automotive — OLED Dark Mode + Trust & Authority
**Mood:** Sophisticated, premium, high-end car care. Donker en krachtig, met goud als enige accent. Denk aan een luxe garage, niet een budget wasstraat.
**Anti-patterns:** Felle neon kleuren, speelse fonts, emoji als iconen, felle witte achtergronden, goedkope gradients.

---

## 2. Color System

Alle kleuren via CSS custom properties in `src/styles/variables.css`. Nooit hardcoded hex in componenten — altijd `var(--color-*)`.

| Token | CSS Variable | Waarde (placeholder) | Gebruik |
|-------|-------------|----------------------|---------|
| Primary | `--color-primary` | `#C8A951` | Gouden accent — CTA, borders, icons |
| Primary Dark | `--color-primary-dark` | `#A88B35` | Hover state van primary |
| Primary Light | `--color-primary-light` | `#DFC57A` | Lichte goud-tint, shimmer |
| Secondary | `--color-secondary` | `#1A1A2E` | Donker navy — nav, panels |
| Accent | `--color-accent` | `#E8E8E8` | Heldere tekst op donker |
| Surface | `--color-surface` | `#0F0F1A` | Pagina-achtergrond |
| Surface Elevated | `--color-surface-elevated` | `#16162A` | Cards, nav, panels |
| Surface Overlay | `--color-surface-overlay` | `#1E1E35` | Modals, dropdowns |
| Text Primary | `--color-text-primary` | `#F5F5F5` | Hoofdtekst |
| Text Secondary | `--color-text-secondary` | `#B0B0C0` | Subtitels, metadata |
| Text Muted | `--color-text-muted` | `#6B6B85` | Placeholders, disabled |
| Text Inverse | `--color-text-inverse` | `#0F0F1A` | Tekst op gouden achtergrond |
| Border | `--color-border` | `#2A2A45` | Default borders |
| Border Light | `--color-border-light` | `#3A3A55` | Hover borders |
| Success | `--color-success` | `#22C55E` | Bevestigd, voltooid |
| Warning | `--color-warning` | `#F59E0B` | In afwachting |
| Error | `--color-error` | `#EF4444` | Fout, geannuleerd |
| Info | `--color-info` | `#3B82F6` | Informatie |

### Contrast Ratios (WCAG AA)
- Text Primary op Surface: **12.8:1** ✓ AAA
- Primary (goud) op Surface: **7.2:1** ✓ AAA
- Text Secondary op Surface Elevated: **6.1:1** ✓ AA

---

## 3. Typografie

**Nooit wijzigen — vastgelegd door klant en geladen in index.html.**

| Rol | Font | Weight | Gebruik |
|-----|------|--------|---------|
| Display / Headings | `Bebas Neue` | 400 | H1–H4, sectietitels, hero tekst, badges |
| Body | `DM Sans` | 300–700 | Paragrafen, labels, buttons, nav |

### Typografische Schaal

| Element | Size (mobile) | Size (desktop) | Weight | Line Height |
|---------|--------------|----------------|--------|-------------|
| H1 Hero | 3.5rem (56px) | 6rem (96px) | 400 (Bebas) | 1.0 |
| H1 Page | 2.5rem (40px) | 4rem (64px) | 400 (Bebas) | 1.05 |
| H2 Section | 2rem (32px) | 3rem (48px) | 400 (Bebas) | 1.1 |
| H3 Card | 1.5rem (24px) | 1.75rem (28px) | 400 (Bebas) | 1.15 |
| Body Large | 1.125rem (18px) | 1.25rem (20px) | 400 (DM Sans) | 1.6 |
| Body | 1rem (16px) | 1rem (16px) | 400 (DM Sans) | 1.6 |
| Body Small | 0.875rem (14px) | 0.875rem (14px) | 400 (DM Sans) | 1.5 |
| Caption | 0.75rem (12px) | 0.75rem (12px) | 500 (DM Sans) | 1.4 |
| Button | 0.875rem (14px) | 0.875rem (14px) | 600 (DM Sans) | 1 |
| Badge | 0.75rem (12px) | 0.75rem (12px) | 600 (DM Sans) | 1 |

---

## 4. Spacing & Layout

**Schaal:** 4px base unit — gebruik altijd veelvouden van 4.

| Token | Waarde | Tailwind |
|-------|--------|---------|
| xs | 4px | `p-1` |
| sm | 8px | `p-2` |
| md | 12px | `p-3` |
| base | 16px | `p-4` |
| lg | 24px | `p-6` |
| xl | 32px | `p-8` |
| 2xl | 48px | `p-12` |
| 3xl | 64px | `p-16` |

**Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` → klasse `container-ico`
**Section padding:** `py-12 md:py-16 lg:py-24` → klasse `section-padding`

### Breakpoints
| Naam | Breedte | Doelgroep |
|------|---------|-----------|
| xs | 375px | Kleine smartphones |
| sm | 640px | Grote smartphones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1440px | Brede schermen |

---

## 5. Componenten

### Button
- **Variants:** `primary` (goud bg), `secondary` (goud border, transparant), `ghost` (geen border), `danger` (rood)
- **Sizes:** `sm` (h-8), `md` (h-10, default), `lg` (h-12)
- **States:** default, hover (primary-dark / border-light), focus (ring), loading (spinner + disabled), disabled
- **Regels:** Altijd `cursor-pointer`. Minimum touch target 44x44px. `font-family: DM Sans, weight: 600`.

### Card
- **Variants:** `default` (surface-elevated + border), `elevated` (shadow-md), `glass` (backdrop blur), `highlight` (primary border)
- **Hover:** `translateY(-2px)` + `shadow-lg` + border `color-border-light` — `transition: 250ms`
- **Padding:** `p-6` default

### Input / Select
- **States:** default, focus (primary border + ring), error (red border), disabled
- **Label:** Altijd boven het veld, nooit als placeholder alleen
- **Error:** Rode tekst direct onder het veld, `role="alert"`

### Modal
- **Backdrop:** `rgba(0,0,0,0.7)` + backdrop-blur
- **Animation:** slide-up 300ms
- **Focus trap:** Tab blijft binnen modal
- **Close:** Escape toets + X button

### Badge
- **Status kleuren:** pending (warning), confirmed/info (info), completed (success), cancelled (error), primary (goud)
- **Stijl:** Kleine pill, uppercase tekst, `font-weight: 600`

### Skeleton
- **Animatie:** Pulse 1.5s, `surface-elevated` → `surface-overlay`
- **Shapes:** line, circle, rect

### Toast
- **Positie:** Bottom-right (desktop), bottom-center (mobile)
- **Types:** success, error, warning, info
- **Auto-dismiss:** 5 seconden default
- **Animatie:** Slide in van rechts

### Accordion
- **Stijl:** Border-bottom divider tussen items, chevron rotatie 180° bij open
- **Animatie:** Max-height transition 300ms

---

## 6. Iconen

**Bibliotheek:** Lucide React — uitsluitend SVG icons. **Nooit emoji als iconen.**
**Standaard grootte:** `w-5 h-5` (20px) in buttons/badges, `w-6 h-6` (24px) in navigatie, `w-8 h-8` (32px) in feature cards.
**Kleur:** Erven van parent `currentColor` — of `var(--color-primary)` voor decoratieve accenten.

---

## 7. Animaties & Transities

**Regel:** Altijd `transition-*` classes. Nooit animeren op `width/height` — gebruik `transform/opacity`.

| Interactie | Duur | Easing |
|-----------|------|--------|
| Hover (kleuren) | 150ms | ease |
| Hover (transform) | 250ms | ease |
| Modal open | 300ms | ease-out |
| Accordion | 300ms | ease |
| Toast slide | 300ms | ease-out |
| Page transition | 200ms | ease |

**prefers-reduced-motion:** Alle animaties worden uitgeschakeld via `@media (prefers-reduced-motion: reduce)` in `variables.css`.

---

## 8. Afbeeldingen & Media

- **Formaat:** WebP (met JPEG/PNG fallback)
- **Lazy loading:** `loading="lazy"` op alle `<img>` buiten de fold
- **Aspect ratios:** Hero `16:9`, cards `4:3`, profielfotos `1:1`
- **Alt tekst:** Altijd beschrijvend, nooit leeg voor decoratieve afbeeldingen (gebruik dan `alt=""`)
- **Placeholder:** Skeleton loader tot afbeelding geladen is

---

## 9. Formulieren

- **Labels:** Altijd zichtbaar boven het veld (`for` attribuut)
- **Foutmeldingen:** Direct onder het veld, rood, `role="alert"`, icoon + tekst
- **Verplichte velden:** Asterisk (*) in label, `aria-required="true"`
- **Succes:** Green checkmark na submit
- **Submit button:** Disabled + spinner tijdens verzending

---

## 10. Toegankelijkheid (WCAG AA)

- Contrast ratio tekst: minimum 4.5:1 (we halen 7:1+)
- Focus states: zichtbare ring `var(--color-primary)` op alle interactieve elementen
- Toetsenbordnavigatie: Tab volgorde = visuele volgorde
- `aria-label` op icon-only buttons
- `role="alert"` op foutmeldingen
- `aria-expanded` op accordeons en dropdowns
- `aria-live="polite"` op toast notificaties
- Formulier labels altijd met `htmlFor`

---

## 11. Z-index Schaal

| Naam | Waarde | Gebruik |
|------|--------|---------|
| base | 0 | Normale elementen |
| raised | 10 | Cards met hover |
| dropdown | 100 | Dropdowns, select menus |
| sticky | 200 | Sticky header/nav |
| overlay | 300 | Modal backdrop |
| modal | 400 | Modal content |
| toast | 500 | Toast notificaties |

---

## 12. Gouden Accent Gebruik

Het goud (`--color-primary`) is spaarzaam maar impactvol:
- CTA buttons (primary variant)
- Actieve nav links / actieve state
- Section dividers (`.divider-gold`)
- Icon accenten in feature sections
- Borders op highlight cards
- Tekstgradient op hero subtitels (`.text-gradient-gold`)
- Badge borders voor "premium" labels
- Glow effect op hover (`.glow-gold`)

**Niet:** goud als achtergrond voor grote vlakken, goud op goud, goud voor alle tekst.
