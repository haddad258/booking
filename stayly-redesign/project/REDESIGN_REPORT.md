# Stayly — Redesign & Audit Report

## 1. Audit summary

Before touching any UI, the full codebase (69 files, ~3,900 lines — React 19 +
Vite + Tailwind 4, 20 routes, i18n in EN/FR/AR with RTL support) was reviewed.

**Finding: the codebase was already clean and well-engineered.** No stray
`console.log`s, no TODOs/FIXMEs, no `dangerouslySetInnerHTML`, no obvious
crash points. Notable things already done correctly and left untouched:

- Token-refresh queue with request replay in `services/api.js`.
- Guest→account favorites merge-once logic in `hooks/useFavorites.js`.
- A real `ErrorBoundary` around the whole app.
- Skeleton loaders instead of spinners on every listing page.
- `prefers-reduced-motion` respected globally.
- RTL handled correctly (`document.dir` toggle in `Header.jsx`) for Arabic.

| Problem | File | Severity | Description | Resolution | Status |
|---|---|---|---|---|---|
| Unused import `Link` | `pages/NotFound.jsx` | 🟢 Low | Dead import, no functional impact | Removed | Fixed |
| Unused import `RouterLink` | `pages/Favorites.jsx` | 🟢 Low | Dead import, no functional impact | Removed | Fixed |
| Unused catch param `err` | `contexts/AuthContext.jsx` | 🟢 Low | Cosmetic lint warning only | Left as-is (no behavior change needed) | Noted, not fixed |
| Fast-refresh export-shape warnings | `contexts/*.jsx` | 🟢 Low | `useAuth`/`useTheme`/`useToast` exported alongside providers from the same file; harmless, common React pattern | Left as-is — splitting these into separate files is a structural change outside "same logic" scope | Noted, not fixed |
| Large single JS chunk (~770 kB) | build output | 🟡 Medium | No route-based code-splitting; all pages ship in one bundle | Not changed — introducing `React.lazy` per-route is a real behavior-adjacent change (loading states, Suspense boundaries) and wasn't part of the visual redesign scope | Documented, requires a decision |

No 🔴 Critical or 🟠 High issues were found. No business logic, API contracts,
or data flow were touched anywhere in this pass.

## 2. Redesign

**Direction:** from "bold navy/coral SaaS" to a **quiet-luxury editorial
travel** look — warm ivory canvas, deep pine green + burnt terracotta accent,
serif display type (Fraunces) over a clean sans body (Inter), pill-shaped
buttons, hairline borders in place of heavy shadows/glass, small-caps
"eyebrow" section labels, warmer hero overlays, subtle paper-grain texture on
dark sections.

**Why a re-theme could carry this far:** the app already used a semantic
design-token system (`brand-*`, `gold-*`, `ink`, `canvas`, `font-display` in
`index.css`) rather than raw Tailwind colors sprinkled through components, so
redefining the tokens once cascaded a real visual identity change across the
whole app. On top of that, every shared primitive and every page's markup was
individually revisited for shape (radius scale), spacing, and typography —
not just recolored.

**Rewritten, logic untouched:**
- Design tokens & base styles: `index.css`, `index.html` (fonts)
- UI kit: `Button`, `Card`, `Badge`, `Input`/`Textarea`/`Select`, `Modal`,
  `Drawer`, `Rating`, `Spinner`, `ResponsiveImage`
- Chrome: `Header`, `Footer`, `MainLayout`, `AuthLayout`, `AccountLayout`,
  `ThemeToggle`, `ErrorBoundary`
- Shared property UI: `SearchBar`, `PropertyCard`, `PropertySkeletonCard`,
  `FilterPanel`, `PropertyGallery`, `PropertyLocationMap`,
  `PropertiesMapView`, `Review`
- Every page: Home, Hotels, Chalets, HotelDetail, ChaletDetail,
  BookingWizard, Login, Register, ForgotPassword, ResetPassword,
  AccountDashboard, AccountBookings, AccountProfile, AccountPassword,
  Favorites, About, Contact, Blog, BlogDetail, Legal, NotFound

**Not changed:** any state, effect, handler, API call, route, auth flow,
validation rule, or data shape. `git diff`-style review of any file will show
only `className`/JSX-structure/static-copy edits.

## 3. Verification performed

- `npm run build` — succeeds, 0 errors (only a pre-existing "chunk size"
  informational warning, see table above).
- `npx oxlint` — 0 errors, 4 pre-existing warnings (down from 6 after the two
  dead-import cleanups).
- Manual read-through of every changed file against its pre-redesign version
  to confirm state/handlers/props were preserved verbatim.
- Repo-wide grep sweep for leftover old-palette references (gradients, old
  font name, old border tokens) — none found.

**Not verified in this environment:** pixel-level visual rendering. The
sandbox's network allowlist doesn't include a Chromium download source, so I
couldn't render live screenshots here. Run `npm run dev` locally to see it —
I'd recommend spot-checking the booking wizard, dark mode, and the Arabic
(RTL) language switch first, since those are the highest-complexity UI paths.
