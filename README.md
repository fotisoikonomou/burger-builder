# 🍔 Burger Builder

A burger-building app for the React Exercise (v2.0.0), built with **React 18 + TypeScript**, plain **HTML5/CSS3** (CSS Modules), and no runtime dependencies beyond React itself.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts: `npm run build` (type-check + production build), `npm run preview`, `npm run typecheck`.

**Credentials:** `xm` / `exercise` (as provided in the exercise).

## Features

**Exercise requirements**

- **Login** — POSTs to `/login`, stores the JWT and sends it as a `Bearer` token on `/ingredients`.
- **Token expiry** — the API token lives for 10 minutes; the app tracks the TTL and logs the user out automatically with a friendly message (a `401` from the API triggers the same path).
- **Ingredient list** — fetched from the API, with loading, error and retry states. Images come from the API image host.
- **Ordered stacking** — clicking an ingredient adds one instance to the burger; layers appear in exactly the order they were added (first pick = bottom layer). Each ingredient is capped at 4 instances per burger — a realistic stacking limit — and its pantry button disables once maxed out.
- **Click to remove** — clicking a layer inside the visual burger removes that specific instance.
- **Live visual** — the burger is rendered as a stacked composition of the API images.

**Extras**

- **Burger grid** — build and keep multiple burgers; each card shows a live mini-preview.
- **Add / rename / remove / duplicate** — duplicating deep-copies the recipe with fresh item ids.
- **Edit mode** — a two-panel editor: pantry (click to add, capped at 4 per ingredient) and a live stack (click a layer to remove it).
- **View mode** — a read-only presentation of the finished burger plus its bottom-to-top recipe.
- **Persistence** — burgers are kept in `localStorage`, so the 10-minute re-login never loses work.

## Architecture

```
src/
├── api/            # transport layer: config, fetch wrapper, endpoint modules
│   ├── config.ts       # base URLs, image URL helper, token TTL
│   ├── client.ts       # JSON fetch wrapper, Bearer auth, typed ApiError
│   ├── auth.ts         # POST /login
│   └── ingredients.ts  # GET /ingredients
├── context/
│   ├── AuthContext.tsx     # login/logout, TTL auto-expiry, session storage
│   └── BurgersContext.tsx  # pure reducer for all burger operations + persistence
├── hooks/
│   └── useIngredients.ts   # data fetching with loading/error/retry + 401 handling
├── components/
│   ├── ui/          # reusable primitives: Button, Modal, Spinner
│   ├── auth/        # LoginForm
│   ├── ingredients/ # IngredientPicker (the "pantry")
│   └── burger/      # BurgerStack, BurgerCard, BurgerGrid, BurgerEditor, BurgerViewModal
├── pages/           # LoginPage, BuilderPage
├── styles/          # global.css: design tokens + reset + a11y floor
├── types/           # shared domain types
└── utils/           # ingredientRules.ts: per-ingredient stacking cap
```

### Decisions worth calling out

- **State**: `useReducer` + Context. The burger domain is a small state machine (create, remove, duplicate, rename, add/remove/move item), so a pure reducer keeps every mutation testable and in one place, without pulling in Redux/Zustand for an app this size.
- **Item identity**: the same ingredient can appear multiple times, so each layer is `{ uid, ingredientId }`. The `uid` gives React stable keys and makes "remove *this* bacon, not all bacon" trivial.
- **Order as the single source of truth**: the burger's ingredient array is stored in the exact order the layers appear, bottom to top — adding an ingredient puts it at the end (the new top layer). There's no separate "position" number to keep in sync — the array position *is* the position.
- **Token TTL**: rather than letting requests fail after 10 minutes, the auth context schedules a logout at expiry and explains why. A `401` from the API (clock skew, etc.) falls back to the same logout path.
- **Styling**: CSS Modules for scoping + a token layer (`global.css` custom properties) for consistency. Palette is drawn from the subject — ketchup for primary actions, mustard for highlights, pickle-green for counts/success. Keyboard focus is visible everywhere, all interactive layers are real buttons with labels, and `prefers-reduced-motion` is respected.

## Notes

- Sessions use `sessionStorage` (per-tab, cleared on close); built burgers use `localStorage` (survive re-login).
- No routing library — the app has exactly two screens gated by auth state, so a conditional render keeps it honest.
