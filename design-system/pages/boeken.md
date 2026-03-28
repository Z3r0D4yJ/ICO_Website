# Boeken — Design Spec

> Inherits from `design-system/MASTER.md`

## Doel
Zo weinig mogelijk friction. Klant door 4 stappen loodsen naar bevestiging.

## Layout — Stepper
```
[Stap 1: Dienst & Voertuig] → [Stap 2: Datum & Tijdstip] → [Stap 3: Uw Gegevens] → [Stap 4: Bevestiging]
```

## Stepper Component
- **Desktop:** Horizontale stapper bovenaan, genummerd, actieve stap in goud
- **Mobile:** Compacte versie "Stap 2 van 4"
- **Completed stap:** Groen checkmark icoon

## Stap 1: Dienst & Voertuig
- **Dienst selectie:** Grote radio cards (niet standaard `<select>`), één per dienst
  - Lucide icon + naam + korte beschrijving + "Vanaf €XX"
  - Geselecteerde card: gouden border + lichte goudachtergrond
- **Voertuigtype:** `<Select>` component

## Stap 2: Datum & Tijdstip
- **Kalender:** Custom maandkalender
  - Verleden data: disabled (grijs)
  - Beschikbare data: klikbaar, hover goud
  - Geselecteerde datum: goud achtergrond
  - Geblokkeerde data: rood/oranje tint
- **Tijdslots:** 4 cards (`09:00-11:00`, `11:00-13:00`, `13:00-15:00`, `15:00-17:00`)
  - Beschikbaar: klikbaar, hover goud
  - Geblokkeerd: disabled, grijs, "Bezet" badge
  - Geselecteerd: goud

## Stap 3: Gegevens
- **Layout:** 2-koloms form op desktop (naam + telefoon, adres + gemeente, ...)
- **Alle Input componenten** uit design system
- **Validatie:** Real-time Zod validatie, errors direct zichtbaar

## Stap 4: Bevestiging (Overzicht)
- **Layout:** Samenvatting card (links) + `[Bevestig Boeking]` (rechts)
- **Samenvatting card:** Dienst, datum, tijdslot, adres, voertuig, prijs indicatie

## Bevestigingspagina (`/boeken/bevestiging`)
- **Groot groen checkmark icoon** (animatie: scale-in)
- **Boekingsnummer:** `ICO-2024-001` in goud, groot
- **Volgende stappen:** "U ontvangt een bevestigingsmail + WhatsApp bericht"
- **WhatsApp button:** "Chat met ons"
- **Terug naar home:** Ghost button
