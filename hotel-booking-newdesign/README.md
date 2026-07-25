# Hotel Booking Platform — Public Website (Phase 3)

The public-facing booking site (vitrine): browse hotels & chalets, view details, book a stay, manage your account, and read the blog.

## Tech Stack

- **React 19** + **Vite**
- **Material UI** (warm "pine & apricot" travel-brand theme, glassmorphism header/search, light/dark mode)
- **React Router**
- **Axios** with automatic JWT refresh-on-401 (customer auth, separate from the admin dashboard's tokens)
- **React Hook Form** for auth/contact/profile forms
- **i18next** — English, French, Arabic (with RTL switching)
- **notistack** for toast notifications

## Getting Started

```bash
cd website
cp .env.example .env      # point VITE_API_URL at your backend, default http://localhost:5000/api/v1
npm install
npm run dev                # http://localhost:5173 (or whichever port Vite picks)
```

## Project Structure

```
website/
  src/
    components/    # Header, Footer, PropertyCard, SearchBar, FilterPanel, Review (list+form), etc.
    pages/          # One file per route
    layouts/        # MainLayout (header+footer), AuthLayout, AccountLayout (tabbed account nav)
    hooks/          # useFavorites
    contexts/       # AuthContext (customer), ThemeModeContext
    services/       # axios instance + one service module per API resource
    i18n/           # en/fr/ar translations
    styles/         # MUI theme + design tokens, global.css
    utils/          # blogData.js — placeholder blog content (no CMS backend yet)
```

## Pages

- **Home** — hero with glassmorphic search bar, featured hotels/chalets, popular destinations, testimonials, newsletter signup
- **Hotels / Chalets** — filterable, paginated grid (price range, rating, amenities, guest search query)
- **Hotel/Chalet Detail** — gallery, amenities, room selection (hotels) or direct booking (chalets), reviews + review form, similar properties
- **Booking wizard** — 3-step flow: guest details → review & confirm → confirmation with booking number
- **Login / Register / Forgot / Reset password**
- **Account** *(protected)* — dashboard, bookings (with cancel), favorites, profile + addresses, change password
- **Contact** — form + embedded map
- **About** — mission/vision
- **Blog** — list with category filter + search, article detail (placeholder content, see note below)
- **Privacy / Terms / Cookies** — static legal pages

## Design

Deep pine-green primary with a warm apricot accent, Fraunces (editorial serif) for headings, Inter for body copy — distinct from the admin dashboard's ink-and-brass ledger aesthetic to feel like a separate consumer brand. Frosted-glass header and hero search bar, soft rounded cards, subtle lift-on-hover.

## Notes

- **Blog** has no backend CMS yet — `src/utils/blogData.js` holds placeholder articles in the exact shape a future `/blog` API would return, so swapping in real content later is a one-file change.
- **Contact form** currently confirms client-side only; wire `Contact.jsx`'s `onSubmit` to a real endpoint once one exists.
- Customer auth tokens are stored under different localStorage keys than the admin dashboard, so both can run in the same browser without clashing.
