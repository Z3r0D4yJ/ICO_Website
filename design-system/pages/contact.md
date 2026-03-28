# Contact — Design Spec

> Inherits from `design-system/MASTER.md`

## Layout
```
1. Page Hero ("NEEM CONTACT OP")
2. 2-kolom: Formulier (links) + Contactinfo (rechts)
3. WhatsApp CTA banner
```

## Contactformulier
- **Fields:** Naam, E-mail, Telefoon (optioneel), Onderwerp, Bericht (textarea)
- **Submit:** `[Versturen]` primary button, loading state
- **Success:** Inline groen bericht, geen page redirect

## Contactinfo (rechts)
- **Items met Lucide icons:**
  - Phone: telefoonnummer (klikbaar)
  - Mail: e-mailadres (klikbaar)
  - MapPin: "Regio Vlaanderen (mobiel)"
  - Clock: openingstijden
- **Social links:** Instagram, Facebook icons (Lucide of custom SVG)

## WhatsApp CTA Banner
- **Achtergrond:** Gouden gradient of whatsapp-groen (subtle)
- **Tekst:** "Liever chatten? Stuur ons een WhatsApp bericht!"
- **Button:** `[Open WhatsApp]` met MessageCircle icon
