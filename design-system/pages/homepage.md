# Homepage — Design Spec

> Inherits from `design-system/MASTER.md`

## Doel
Eerste indruk. Converteer bezoekers naar boeking. Laat de premiumheid van ICO voelen.

## Sectie Volgorde

```
1. Hero (fullscreen, 100vh)
2. ServicesPreview (3 kaarten)
3. WhyICO (features grid)
4. WashbusShowcase (foto + tekst, alternating)
5. TestimonialsSlider (3 reviews)
6. CTASection (boek nu)
```

## 1. Hero
- **Layout:** Fullscreen `min-h-screen`, dark overlay op achtergrondafbeelding (gradient `from-surface/90 to-surface/60`)
- **Content positie:** Links-midden (niet gecentreerd) op desktop, gecentreerd op mobile
- **Badge:** Klein pill "Mobiel Car Detailing" in goud, boven de H1
- **H1:** "PREMIUM SERVICES" (Bebas Neue, 6rem desktop / 3.5rem mobile, wit)
- **Subtitel:** "FOR PREMIUM CUSTOMERS" (Bebas Neue, goud gradient)
- **Body:** "Mobiliteit ontmoet vakmanschap — wij komen naar u toe in Vlaanderen" (DM Sans, text-secondary)
- **CTA's:** `[Boek Uw DetailWash]` (primary button, groot) + `[Bekijk Diensten]` (secondary, ghost)
- **Scroll indicator:** Animated chevron-down icoon onderaan

## 2. ServicesPreview
- **Layout:** 3-column grid (1 col mobile → 3 col desktop)
- **Cards:** `card-highlight` variant met Lucide icon, dienst naam (H3, Bebas), korte beschrijving, "Vanaf €XX" prijs, "Boek Nu" link
- **Sectietitel:** "ONZE DIENSTEN" + gouden divider

## 3. WhyICO
- **Layout:** 2-column op desktop (tekst links, features grid rechts), gestapeld op mobile
- **Features:** 4 items met Lucide icon (goud) + titel + beschrijving
  - Mobiel — wij komen naar u
  - 2 personen — snel en grondig
  - Premium producten (CleanTech)
  - Regio Vlaanderen
- **Stijl:** Geen card borders, gewoon icon + tekst

## 4. WashbusShowcase
- **Layout:** `grid grid-cols-1 md:grid-cols-2` — afbeelding en tekst naast elkaar
- **Tekst:** H2 "DE WASHBUS", paragraaf over het mobiele concept, bullet list met features
- **Afbeelding:** Grote foto van de Washbus, rounded-lg, lichte glow

## 5. TestimonialsSlider
- **Layout:** 3 kaarten horizontaal (scroll op mobile)
- **Card:** Klant naam, voertuig, sterren (goud), quote
- **Achtergrond:** `surface-elevated`

## 6. CTASection
- **Achtergrond:** Gradient `from-primary/20 to-transparent` of grote afbeelding met overlay
- **Content:** H2 + body + `[Maak Een Afspraak]` button (primary, xl)
- **WhatsApp button:** Secondary, met WhatsApp icon
