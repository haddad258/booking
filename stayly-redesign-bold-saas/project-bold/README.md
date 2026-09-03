# Hotel Booking Platform — Public Website (Tailwind, Map/Split-Screen Format)

A third presentation of the same public booking site — same routes, same workflow, same API calls — this time in a bold "modern OTA" visual identity **and** a structurally different search format: split-screen results list + interactive map, like Airbnb/Booking.com.

## What's different from the other two website builds

| | MUI v1/v2 | Tailwind (boutique) | Tailwind (this one) |
|---|---|---|---|
| Framework | Material UI | Tailwind v4 | Tailwind v4 |
| Palette | pine/indigo | deep sage + gold | midnight navy + coral |
| Font | Inter / Plus Jakarta Sans | Cormorant Garamond + Manrope | Outfit (single family) |
| Hotel/Chalet search | Sidebar filters + grid | Sidebar filters + grid | **Split-screen: scrollable list + live map** |
| Property detail | — | — | Adds a **Location** map section |

## The map

No external maps API or key required. `src/components/MapView.jsx` is a small, dependency-free component that plots each property as a pin:

- If a property has `latitude`/`longitude`, its pin is positioned proportionally within the current result set's bounding box.
- If not (e.g. demo data without coordinates), it gets a **stable pseudo-position** derived from a hash of its id, so the map still looks populated instead of breaking.
- Hovering a pin highlights the matching list card and vice versa (shared `hoveredId` state).
- On mobile, a list/map toggle switches between the two (side-by-side doesn't fit small screens).

## Getting Started

```bash
cd website-tailwind-map
cp .env.example .env
npm install
npm run dev
```

## Provenance

This project started as a copy of the boutique Tailwind edition — same services, i18n, auth context, favorites hook, UI primitives (Button/Input/Card/Badge/Rating/Modal/Drawer) — only the design tokens (`src/index.css` `@theme` block), font, a few hardcoded gradient colors, and the Hotels/Chalets/detail pages changed. Because components reference semantic Tailwind classes (`bg-brand-800`, `text-gold-500`, etc.) rather than hardcoded hex values, redefining the `@theme` tokens re-skinned almost the entire app automatically.
