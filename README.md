# Mochabear's F1 Hub 🏎️

A personal Formula 1 dashboard — live race weekends, standings, countdowns, and a
data-driven fantasy form guide. Built with Next.js, deployed on Vercel.
Pure public-data mirror (no database, no logins). Data from the free Jolpica-F1
API and Open-Meteo.

## Run it locally
```bash
npm install
npm run dev      # open http://localhost:3000
```

## How it works
- Five pages: Home, Race Hub, Calendar, Standings, Fantasy
- Six API routes under /app/api proxy + cache F1 data so the site is fast and
  doesn't hammer the free Jolpica API
- Cache freshness windows live in /lib/f1.js (FRESH object) — lower the numbers
  during a live race weekend if you want fresher data

## Make it yours
- Branding: edit /components/Nav.js (the "P" mark + name) and /app/layout.js (metadata)
- Fantasy logic: /app/api/fantasy/route.js computes the Momentum Index
- Colors: CSS variables at the top of /app/globals.css
