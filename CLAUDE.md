# ICO — Intensive Cleaning Organization Website

## Project Overview

Full-featured website for **Team-ICO (Intensive Cleaning Organization)**, a premium mobile car detailing service based in Flanders, Belgium. Founded by Rico & Nico, they operate a luxury mobile "Washbus" and serve customers at their location.

**Slogan:** "Premium Services For Premium Customers" — "Mobiliteit ontmoet vakmanschap"
**Werkgebied:** Regio Vlaanderen (mobiel, komen naar de klant)
**Talen:** Nederlands (primair) + Engels

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18+ with Vite |
| Styling | Tailwind CSS 3+ |
| Routing | React Router v6 |
| State Management | Zustand (lightweight, geen overkill) |
| Backend/Database | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| Payments | Mollie (Nederlandse/Belgische markt) |
| Notifications | E-mail (Resend of Supabase Edge Functions) + WhatsApp Business API |
| Hosting | Eigen VPS (Hetzner) met Nginx reverse proxy |
| i18n | react-i18next |
| Forms | React Hook Form + Zod validation |
| Icons | Lucide React (GEEN emoji als iconen) |
| Design Intelligence | UI UX Pro Max skill (geïnstalleerd via `uipro init --ai claude`) |

---

## Design System

### Approach
Gebruik de **UI UX Pro Max** skill om een volledig design system te genereren. Run het volgende commando om het design system te genereren:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "premium car detailing mobile wash automotive service" --design-system -p "ICO" --persist
```

### Brand Guidelines
- **Logo & huisstijlkleuren:** Worden later toegevoegd door de klant. Gebruik placeholders en CSS variables zodat kleuren eenvoudig geswapped kunnen worden.
- **Alle kleuren via CSS custom properties** in `src/styles/variables.css` zodat rebranding 1 file-change is.
- **Vibe:** Premium, professioneel, automotive. Denk aan donkere tonen met contrasterende accenten. Het moet "luxe car care" uitstralen, niet "budget wasstraat".
- **Typografie:** Kies iets met karakter — geen Inter/Roboto. Denk aan een sterk display font (headings) + clean sans-serif (body). Google Fonts.
- **Fotografie:** Veel ruimte voor hero images van gedetailleerde auto's, de Washbus, before/after shots.

### Design Constraints
- Mobile-first responsive design (375px → 768px → 1024px → 1440px)
- WCAG AA accessibility minimum
- cursor-pointer op alle klikbare elementen
- Hover states met smooth transitions (150-300ms)
- prefers-reduced-motion respecteren
- Geen emoji als iconen — altijd Lucide React SVG icons
- Lazy loading voor afbeeldingen
- Skeleton loaders voor async content

---

## Site Architecture

### Public Pages (Klant-zijde)

```
/                       → Homepage (hero, diensten preview, CTA, testimonials)
/diensten               → Alle diensten met prijzen en details
/diensten/:slug         → Detail pagina per dienst (DetailWash, Dieptereiniging, etc.)
/boeken                 → Booking systeem (kalender + tijdslots + formulier)
/boeken/bevestiging     → Booking bevestigingspagina
/shop                   → CleanTech webshop (producten grid)
/shop/:productSlug      → Product detail pagina
/shop/winkelwagen       → Winkelwagen
/shop/afrekenen         → Checkout (Mollie betaling)
/blog                   → Blog/nieuws overzicht
/blog/:slug             → Individueel blog artikel
/over-ons               → Over Team-ICO, Rico & Nico, de Washbus
/contact                → Contactformulier + locatie info + social links
/faq                    → Veelgestelde vragen (uitklapbaar/accordion)
/privacy                → Privacybeleid
/voorwaarden            → Algemene voorwaarden
```

### Admin Pages (Beschermd via Supabase Auth)

```
/admin                  → Dashboard (overzicht boekingen, omzet, recente activiteit)
/admin/boekingen        → Alle boekingen beheren (lijst + filters + status updates)
/admin/boekingen/:id    → Detail van individuele boeking
/admin/diensten         → Diensten beheren (CRUD + prijzen aanpassen)
/admin/producten        → Webshop producten beheren (CRUD + voorraad + prijzen)
/admin/blog             → Blog posts beheren (CRUD + rich text editor)
/admin/blog/nieuw       → Nieuwe blog post schrijven
/admin/blog/:id/edit    → Blog post bewerken
/admin/media            → Media library (foto's uploaden/beheren via Supabase Storage)
/admin/instellingen     → Website instellingen (contact info, werkgebied, openingstijden)
```

---

## Database Schema (Supabase/PostgreSQL)

### Tabellen

```sql
-- Diensten die ICO aanbiedt
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_nl TEXT NOT NULL,
    title_en TEXT,
    description_nl TEXT NOT NULL,
    description_en TEXT,
    short_description_nl TEXT,
    short_description_en TEXT,
    price_from DECIMAL(10,2),          -- "Vanaf" prijs
    price_to DECIMAL(10,2),            -- Optioneel: "tot" prijs
    price_note_nl TEXT,                 -- bv. "afhankelijk van staat voertuig"
    price_note_en TEXT,
    duration_minutes INTEGER,           -- Geschatte duur
    image_url TEXT,
    icon TEXT,                          -- Lucide icon naam
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Boekingen
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number TEXT UNIQUE NOT NULL, -- ICO-2024-001 format
    service_id UUID REFERENCES services(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,      -- Locatie van de wasbeurt
    customer_city TEXT NOT NULL,
    customer_postal_code TEXT,
    preferred_date DATE NOT NULL,
    preferred_time_slot TEXT NOT NULL,   -- '09:00-11:00', '11:00-13:00', etc.
    vehicle_type TEXT,                   -- 'sedan', 'suv', 'bestelwagen', etc.
    vehicle_brand TEXT,
    notes TEXT,                          -- Extra opmerkingen klant
    status TEXT DEFAULT 'pending',       -- pending, confirmed, in_progress, completed, cancelled
    total_price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Beschikbaarheid / geblokkeerde tijdslots
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    is_blocked BOOLEAN DEFAULT false,    -- Handmatig geblokkeerd door admin
    booking_id UUID REFERENCES bookings(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- CleanTech producten (webshop)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),     -- Doorstreepprijs
    image_url TEXT,
    images TEXT[],                       -- Extra productfoto's
    category TEXT,                       -- 'coating', 'droogdoek', 'accessoire'
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Webshop bestellingen
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_postal_code TEXT NOT NULL,
    shipping_country TEXT DEFAULT 'BE',
    items JSONB NOT NULL,               -- [{product_id, name, quantity, price}]
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',       -- pending, paid, shipped, delivered, cancelled
    mollie_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog posts
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_nl TEXT NOT NULL,
    title_en TEXT,
    content_nl TEXT NOT NULL,            -- Rich text / Markdown
    content_en TEXT,
    excerpt_nl TEXT,
    excerpt_en TEXT,
    cover_image_url TEXT,
    author TEXT DEFAULT 'Team ICO',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- FAQ items
CREATE TABLE faq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_nl TEXT NOT NULL,
    question_en TEXT,
    answer_nl TEXT NOT NULL,
    answer_en TEXT,
    category TEXT,                       -- 'diensten', 'boekingen', 'webshop', 'algemeen'
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Website instellingen (key-value store)
CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials / reviews
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    content_nl TEXT NOT NULL,
    content_en TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    vehicle TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)
- **Public read** op: services, products, blog_posts (where is_published/is_active), faq_items, testimonials, site_settings
- **Authenticated write** op alle tabellen (alleen voor admin users)
- **Public insert** op: bookings, orders (klanten mogen boekingen/bestellingen aanmaken)
- **Geen public delete/update** op bookings/orders

### Supabase Auth
- Twee vaste admin accounts voor Rico & Nico
- Geen self-registration — accounts worden handmatig aangemaakt
- Admin routes beschermd met auth guard component

---

## Project Structure

```
ico-website/
├── CLAUDE.md                          # Dit bestand
├── .claude/                           # UI UX Pro Max skill (via uipro init)
├── design-system/                     # Gegenereerd door UI UX Pro Max
│   ├── MASTER.md
│   └── pages/
├── public/
│   ├── favicon.ico
│   ├── og-image.jpg
│   └── locales/
│       ├── nl/translation.json        # Nederlandse vertalingen
│       └── en/translation.json        # Engelse vertalingen
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/
│   │   ├── variables.css              # CSS custom properties (brand kleuren)
│   │   └── globals.css
│   ├── config/
│   │   ├── supabase.js                # Supabase client init
│   │   ├── mollie.js                  # Mollie config
│   │   └── i18n.js                    # react-i18next setup
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useBookings.js
│   │   ├── useProducts.js
│   │   ├── useServices.js
│   │   ├── useBlog.js
│   │   └── useSettings.js
│   ├── stores/
│   │   ├── cartStore.js               # Zustand winkelwagen
│   │   └── uiStore.js                 # UI state (taal, mobile menu, etc.)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Accordion.jsx
│   │   ├── booking/
│   │   │   ├── BookingCalendar.jsx
│   │   │   ├── TimeSlotPicker.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   ├── BookingSummary.jsx
│   │   │   └── VehicleSelector.jsx
│   │   ├── shop/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── CheckoutForm.jsx
│   │   ├── blog/
│   │   │   ├── BlogCard.jsx
│   │   │   ├── BlogGrid.jsx
│   │   │   └── BlogContent.jsx
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── ServicesPreview.jsx
│   │   │   ├── WhyICO.jsx
│   │   │   ├── TestimonialsSlider.jsx
│   │   │   ├── CTASection.jsx
│   │   │   └── WashbusShowcase.jsx
│   │   └── admin/
│   │       ├── AuthGuard.jsx
│   │       ├── AdminSidebar.jsx
│   │       ├── DashboardStats.jsx
│   │       ├── BookingTable.jsx
│   │       ├── BookingStatusBadge.jsx
│   │       ├── ServiceForm.jsx
│   │       ├── ProductForm.jsx
│   │       ├── BlogEditor.jsx         # Rich text editor (TipTap)
│   │       ├── MediaUploader.jsx
│   │       └── SettingsForm.jsx
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── ServiceDetailPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── BlogPage.jsx
│   │   │   ├── BlogPostPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── FAQPage.jsx
│   │   │   ├── PrivacyPage.jsx
│   │   │   └── TermsPage.jsx
│   │   └── admin/
│   │       ├── AdminLoginPage.jsx
│   │       ├── DashboardPage.jsx
│   │       ├── BookingsListPage.jsx
│   │       ├── BookingDetailPage.jsx
│   │       ├── ServicesManagePage.jsx
│   │       ├── ProductsManagePage.jsx
│   │       ├── BlogManagePage.jsx
│   │       ├── BlogEditorPage.jsx
│   │       ├── MediaLibraryPage.jsx
│   │       └── SettingsPage.jsx
│   ├── lib/
│   │   ├── utils.js                   # Helpers (formatPrice, slugify, etc.)
│   │   ├── validators.js              # Zod schemas
│   │   └── constants.js               # Time slots, vehicle types, statuses
│   └── api/
│       ├── bookings.js                # Supabase queries voor boekingen
│       ├── products.js
│       ├── services.js
│       ├── blog.js
│       ├── orders.js
│       ├── settings.js
│       └── notifications.js           # E-mail + WhatsApp notificaties
├── supabase/
│   ├── migrations/                    # Database migrations
│   │   └── 001_initial_schema.sql
│   ├── seed.sql                       # Seed data (initiële diensten, FAQ, etc.)
│   └── functions/
│       ├── mollie-webhook/            # Mollie payment webhook handler
│       │   └── index.ts
│       ├── send-booking-notification/ # E-mail + WhatsApp bij nieuwe boeking
│       │   └── index.ts
│       └── send-order-notification/   # E-mail bij nieuwe bestelling
│           └── index.ts
├── nginx/
│   └── ico.conf                       # Nginx config voor Hetzner VPS
├── docker-compose.yml                 # Optioneel: containerized deployment
├── .env.example
├── .env.local
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## Key Features — Implementation Details

### 1. Booking Systeem
- Kalender component met beschikbare datums (minimaal 24u vooruit)
- Tijdslots van 2 uur: 09:00-11:00, 11:00-13:00, 13:00-15:00, 15:00-17:00
- Tijdslots die al geboekt of geblokkeerd zijn worden disabled getoond
- Voertuig type selectie (sedan, SUV, bestelwagen, etc.) — beïnvloedt prijsindicatie
- Adres invullen (de wasbeurt komt naar de klant)
- Samenvatting stap voor bevestiging
- Na boeking: bevestigingsmail naar klant + WhatsApp + e-mail notificatie naar Rico & Nico
- Booking referentienummer: ICO-YYYY-NNN formaat

### 2. Admin Dashboard
- Login via Supabase Auth (e-mail + wachtwoord, 2 vaste accounts)
- Dashboard met: boekingen vandaag, boekingen deze week, omzet deze maand, recente bestellingen
- Boekingen lijst met filters (status, datum range) + inline status updates
- CRUD voor diensten met inline prijsaanpassing
- CRUD voor producten met voorraad beheer
- Blog editor met TipTap rich text editor (headings, bold, italic, links, afbeeldingen)
- Media library: upload foto's naar Supabase Storage, kopieer URL voor gebruik in blog/producten
- Instellingen: contact info, WhatsApp nummer, openingstijden, werkgebied tekst

### 3. Webshop (CleanTech producten)
- Product grid met filters (categorie)
- Product detail met meerdere foto's
- Winkelwagen (Zustand state, persistent via localStorage)
- Checkout flow → Mollie betaling
- Mollie webhook verwerkt betaalstatus → order update in database
- Bevestigingsmail naar klant na succesvolle betaling

### 4. Meertaligheid (NL/EN)
- react-i18next met JSON translation files
- Language switcher in header
- URL structuur: GEEN taal prefix (standaard NL, taal opgeslagen in localStorage/cookie)
- Alle database content heeft _nl en _en velden
- Fallback: als EN vertaling ontbreekt, toon NL

### 5. Notificaties
- **Nieuwe boeking:** WhatsApp bericht naar Rico & Nico + bevestigingsmail naar klant
- **Boeking status wijziging:** E-mail naar klant
- **Nieuwe bestelling:** E-mail naar Rico & Nico + bevestigingsmail naar klant
- **Betaling ontvangen:** E-mail naar klant met orderbevestiging
- WhatsApp via WhatsApp Business API (of als fallback: WhatsApp click-to-chat link in admin)

### 6. Blog
- Overzichtspagina met cards (cover image, titel, excerpt, datum)
- Detail pagina met rich text rendering
- Tags/categorieën voor filtering
- SEO: meta tags, Open Graph, structured data
- Admin: TipTap editor met image upload, preview voor publicatie

---

## Coding Standards

### General
- Functionele componenten met hooks (geen class components)
- PropTypes of JSDoc voor component props
- Consistente error handling met try/catch + toast notificaties
- Loading states met Skeleton components
- Empty states met duidelijke messaging
- Nederlandse comments in code zijn OK (doelgroep is Belgisch team)

### File Naming
- Components: PascalCase (`BookingCalendar.jsx`)
- Hooks: camelCase met `use` prefix (`useBookings.js`)
- Utils/config: camelCase (`supabase.js`, `utils.js`)
- Pages: PascalCase met `Page` suffix (`HomePage.jsx`)

### Tailwind
- Gebruik Tailwind utility classes als primaire styling methode
- Custom CSS alleen voor complexe animaties of design system variabelen
- Geen inline styles tenzij dynamisch berekend
- Consistent spacing scale gebruiken (4, 8, 12, 16, 24, 32, 48, 64)

### Supabase
- Alle queries via custom hooks in `src/hooks/`
- Real-time subscriptions voor booking updates in admin
- Row Level Security altijd actief — nooit RLS bypassen
- Supabase client ALLEEN in config en hooks, niet in componenten direct

### Performance
- Code splitting via React.lazy() + Suspense voor route-level splitting
- Admin routes in aparte chunk (niet laden voor publieke bezoekers)
- Afbeeldingen optimaliseren: WebP format, responsive sizes, lazy loading
- Vite build optimalisaties: minification, tree shaking, chunk splitting

---

## Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx

# Mollie (server-side only, via Edge Functions)
MOLLIE_API_KEY=test_xxxxx
MOLLIE_REDIRECT_URL=https://ico-detailing.be/shop/bevestiging
MOLLIE_WEBHOOK_URL=https://ico-detailing.be/api/mollie-webhook

# WhatsApp Business (via Edge Functions)
WHATSAPP_PHONE_ID=xxxxx
WHATSAPP_ACCESS_TOKEN=xxxxx

# E-mail (Resend)
RESEND_API_KEY=re_xxxxx

# Site
VITE_SITE_URL=https://ico-detailing.be
VITE_SITE_NAME=ICO - Intensive Cleaning Organization
```

---

## Seed Data

### Initiële Diensten
1. **DetailWash** — Standaard premium wasbeurt (~2 uur, 2 personen)
2. **Dieptereiniging** — Extractiemachine voor zetels/tapijten, best i.c.m. DetailWash
3. **DetailWash + Dieptereiniging Combo** — Gecombineerd pakket (korting)

### Initiële Producten (CleanTech)
1. CleanTech | CeramicMax — €7,50
2. CleanTech | FiberMax — €5,00
3. CleanTech | Dryer+ — €15,00
4. CleanTech | ExtremeDryer+ — €25,00

### Initiële FAQ
- Hoe lang duurt een DetailWash? → ~2 uur afhankelijk van staat voertuig
- Werken jullie alleen of met twee? → Meestal met twee voor efficiëntie
- Kan ik een Dieptereiniging apart boeken? → Ja, maar best i.c.m. DetailWash
- Hoe maak ik een afspraak? → Via de boekingspagina of social media
- Wat is het werkgebied? → Regio Vlaanderen

---

## Deployment (Hetzner VPS)

### Setup
1. Node.js 20 LTS + npm op VPS
2. Nginx als reverse proxy
3. SSL via Let's Encrypt (certbot)
4. PM2 of systemd voor process management (Edge Functions via Supabase hosted)
5. GitHub Actions of handmatige deploy via SSH

### Nginx Config
- Static files serving voor Vite build output
- SPA fallback (alle routes → index.html)
- Gzip compression
- Cache headers voor assets
- SSL termination

### Build & Deploy
```bash
npm run build          # Vite production build
scp -r dist/ vps:/var/www/ico/   # Upload naar VPS
# Nginx serveert /var/www/ico/ als static site
```

---

## Development Workflow

### Volgorde van bouwen (aanbevolen)
1. **Project setup** — Vite + Tailwind + React Router + Supabase + i18n config
2. **Design system** — UI UX Pro Max genereren, CSS variables, base components (Button, Card, Input, etc.)
3. **Layout** — Header, Footer, MobileMenu, LanguageSwitcher
4. **Database** — Supabase project aanmaken, migrations runnen, seed data
5. **Homepage** — Hero, ServicesPreview, Testimonials, CTA
6. **Diensten pagina's** — Overzicht + detail (data uit Supabase)
7. **Booking systeem** — Kalender, tijdslots, formulier, bevestiging
8. **Admin basis** — Login, dashboard, AuthGuard
9. **Admin CRUD** — Diensten, producten, blog, instellingen
10. **Webshop** — Product pagina's, winkelwagen, checkout
11. **Mollie integratie** — Betaling flow + webhooks
12. **Blog** — Overzicht, detail, admin editor
13. **Overige pagina's** — Over ons, Contact, FAQ, Privacy, Voorwaarden
14. **Notificaties** — E-mail templates, WhatsApp integratie
15. **i18n** — Alle vertalingen NL + EN
16. **SEO & Performance** — Meta tags, Open Graph, Lighthouse optimalisatie
17. **Deployment** — VPS setup, Nginx, SSL, CI/CD

---

## Important Notes

- **Rico & Nico zijn GEEN developers** — het admin panel moet intuïtief zijn, geen technische kennis vereisen
- **Mobiel gebruik is belangrijk** — zij checken boekingen onderweg op hun telefoon, admin moet responsive zijn
- **WhatsApp is hun primaire communicatiekanaal** — maak WhatsApp integratie prominent (click-to-chat buttons op de site, notificaties)
- **Prijzen moeten ALTIJD aanpasbaar zijn via admin** — nooit hardcoded in de frontend
- **Belgische markt** — BTW vermelden waar nodig, Mollie voor betalingen, Nederlandse taal primair
- **Huisstijlkleuren worden later aangeleverd** — bouw alles met CSS custom properties zodat het een simpele swap is
