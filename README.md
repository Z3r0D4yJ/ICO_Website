# ICO — Intensive Cleaning Organization

Premium mobiele car detailing website voor Team-ICO (Rico & Nico), actief in regio Vlaanderen.

## Quick Start

```bash
# 1. Clone & install
git clone <repo-url>
cd ico-website
npm install

# 2. UI UX Pro Max skill installeren
npm install -g uipro-cli
uipro init --ai claude

# 3. Environment variables
cp .env.example .env.local
# Vul Supabase credentials in

# 4. Supabase setup
# Maak een project aan op supabase.com
# Run de migration: supabase/migrations/001_initial_schema.sql
# Run de seed data: supabase/seed.sql

# 5. Development server
npm run dev
```

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Payments:** Mollie
- **Hosting:** Hetzner VPS + Nginx
- **i18n:** react-i18next (NL + EN)

## Project Structure

Zie `CLAUDE.md` voor de volledige architectuur en implementatie details.

## Deployment

```bash
npm run build
scp -r dist/ user@vps:/var/www/ico/
```

Nginx config: `nginx/ico.conf`
