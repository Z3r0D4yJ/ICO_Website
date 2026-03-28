# Shop (CleanTech Webshop) — Design Spec

> Inherits from `design-system/MASTER.md`

## Layout
```
1. Page Header ("CleanTech Webshop")
2. Filter bar (categorie tabs)
3. Product Grid
4. Cart Drawer (slide-in van rechts)
```

## Product Grid
- **Layout:** `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6`
- **ProductCard:**
  - Afbeelding (aspect-square, object-cover)
  - Badge "Nieuw" of "Uitverkocht" (overlay, rechtsboven)
  - Doorstreepprijs indien `compare_at_price`
  - Naam (DM Sans, font-semibold)
  - Prijs (goud, font-bold)
  - `[+ Toevoegen]` button (primary, volle breedte)
  - Hover: card lift + button opacity 100%

## Cart Drawer
- **Positie:** Slide van rechts (translateX), overlay backdrop
- **Header:** "Winkelwagen (X)" + X close button
- **Items lijst:** Thumbnail + naam + prijs + quantity stepper
- **Footer:** Subtotaal, verzending, totaal + `[Afrekenen]` button
- **Empty state:** Icon + "Uw winkelwagen is leeg" + `[Verder Winkelen]`

## Checkout
- **Layout:** 2-kolom — formulier links, besteloverzicht rechts (sticky)
- **Betaalknop:** Groot, "Betalen via Mollie" met Mollie logo-placeholder
