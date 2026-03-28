# Diensten — Design Spec

> Inherits from `design-system/MASTER.md`

## Doel
Alle diensten tonen met prijzen. Klant overtuigen te boeken.

## Layout
```
1. Page Hero (korte banner, niet fullscreen)
2. Services Grid / List
3. CTA Section (zelfde als homepage)
```

## Page Hero
- **Hoogte:** `py-16 md:py-24` (niet fullscreen)
- **Achtergrond:** Donker met subtiele grain/texture overlay
- **H1:** "ONZE DIENSTEN" (Bebas, 4rem)
- **Subtitel:** DM Sans, text-secondary

## Services Grid
- **Layout:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Card inhoud:**
  - Afbeelding bovenaan (aspect-card, lazy loading)
  - Lucide icon badge over afbeelding (goud, rechtsboven)
  - H3 Dienst naam
  - Korte beschrijving (line-clamp-3)
  - Prijs "Vanaf €XX" (goud, groot)
  - Duur "~X uur"
  - `[Details]` ghost button + `[Boek Nu]` primary button

## Service Detail Pagina (`/diensten/:slug`)
```
1. Hero met dienst-afbeelding (fullwidth, 50vh)
2. Breadcrumb navigatie
3. Content grid: beschrijving links, boek-sidebar rechts (sticky)
4. What's included lijst
5. Gerelateerde diensten
```
- **Sticky sidebar:** Prijs, tijdsduur, `[Boek Deze Dienst]` button
- **Inclusielijst:** Groen checkmark icoon + tekst item
