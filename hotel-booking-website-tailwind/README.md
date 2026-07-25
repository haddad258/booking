# Hotel Booking Platform — Public Website (Tailwind Edition)

The same public booking site — identical routes, workflows, and API calls — rebuilt with **Tailwind CSS** instead of Material UI, in a warm, editorial "luxury chalet" style inspired by boutique hospitality sites.

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v4** (CSS-first config via `@theme`, no `tailwind.config.js` needed)
- **Headless UI** for accessible menus/dialogs/drawers, **Heroicons** for icons
- **React Router**
- **Axios** with automatic JWT refresh-on-401 (same customer-auth pattern as the MUI version)
- **React Hook Form**
- **i18next** — English, French, Arabic (RTL switching)
- Custom lightweight toast system (no MUI/notistack dependency)

## Design

Deep sage-green (`brand`) + warm gold (`gold`) palette, **Cormorant Garamond** for display headings paired with **Manrope** for UI/body — an elegant, boutique-hospitality feel distinct from the two MUI versions. Glass sticky header, soft rounded-2xl cards with lift-on-hover, gradient CTA buttons.

## Getting Started

```bash
cd website-tailwind
cp .env.example .env      # point VITE_API_URL at your backend
npm install
npm run dev
```

## What's identical to the MUI version

Every service module (`src/services/*.js`), the auth context, the favorites hook, the i18n locale files, and the blog placeholder data were copied **verbatim** from the MUI website — this is a pure presentation-layer rebuild. Same routes, same API calls, same booking wizard steps, same account area, same auth flow.

## What's different

- Tailwind utility classes + a small set of reusable primitives (`src/components/ui/`: Button, Input/Textarea/Select, Card, Badge, Rating, Spinner, Modal, Drawer) instead of MUI components.
- Headless UI powers the language/user dropdown menus and the mobile nav + filter drawers, fully keyboard/screen-reader accessible.
- No dark mode in this edition (kept scope focused on the requested modern/responsive redesign).
- Responsive filters: hotel/chalet listings use a sidebar on desktop (`md:` and up) and a slide-in drawer triggered by a "Filters" button on mobile, same pattern as the MUI redesign.

## Project Structure

```
website-tailwind/
  src/
    components/
      ui/           # Button, Input, Card, Badge, Rating, Spinner, Modal, Drawer
      Header.jsx, Footer.jsx, PropertyCard.jsx, SearchBar.jsx, FilterPanel.jsx, Review.jsx
    pages/           # Same page set as the MUI website
    layouts/         # MainLayout, AuthLayout, AccountLayout
    contexts/        # AuthContext (copied), ToastContext (new, Tailwind-native)
    services/        # Copied verbatim — zero UI framework coupling
    i18n/            # Copied verbatim
```
