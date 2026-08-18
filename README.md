# Pokémon Explorer

A modern, responsive, high-performance Pokémon Explorer and Battle Matrix application built with React 19, TypeScript, and Tailwind CSS. Featuring real-time search, multi-faceted elemental filtering, interactive stat radar charts, battle move repertoires, head-to-head Pokémon comparisons, and deep-linkable URLs.

---

## Features

- **Real-Time Search & URL Persistence**:
  - Instant debounced search by Pokémon name or Pokédex number (e.g. `Pikachu`, `025`, `Groudon`).
  - Search query and active filters synchronize directly to browser URL query parameters (`?search=...&type=...`) and persist across page refreshes.

- **Multi-Dimensional Filter Modal**:
  - **18 Elemental Types**: Filter by Grass, Fire, Water, Electric, Dragon, Fairy, and more.
  - **Generation Selector**: Filter by Generation I (Kanto) through Generation IX (Paldea).
  - **Special Traits**: Filter by Legendary / Mythical status and Evolution availability.
  - **Dynamic Sorting**: Sort by Pokédex ID, Name (A-Z), Base HP, Attack power, or Speed.

- **Interactive Details Modal**:
  - **Dual Stat Visualization**: Toggle between an interactive multi-axis SVG Radar Matrix and Linear Stat Bars with magnitude-colored indicators.
  - **Pokédex Biography & Elemental Defenses**: View biometrics (Mass, Height, Combat EXP), special abilities with Hidden/Standard badges, and calculated type matchup weaknesses & resistances.
  - **Multi-Angle Sprite Studio**: Switch dynamically between Official Artwork, Shiny Form, Retro Pixel Sprites, and Back Angle renders with a custom spinning Pokéball loading state.

- **Battle Move Arsenal**:
  - Repertoire of all combat moves categorized by learning method (**Level Up**, **TM / HM**, **Egg Moves**, **Tutor**).
  - Dedicated move search bar with live filtering and attack badges.

- **Side-by-Side Comparison Matrix**:
  - Compare any 2 Pokémon head-to-head in a visual battle card with winning stat trophies, composite radar overlay, and random opponent suggestions.
  - Quick-access floating Battle Dock for staging Pokémon comparisons across pages.

- **Persistent Favorites Manager**:
  - Save favorite Pokémon with local storage persistence.
  - Dedicated slide-over drawer with quick search, sorting, and 1-click management.

- **Shareable Deep Links (`/pokemon/:name`)**:
  - Direct URL routing (e.g. `/pokemon/charizard`) automatically opens the selected Pokémon details modal on page load.
  - 1-click "Share Link" button with instant clipboard feedback.

- **Dark & Light Theme**:
  - Full Neobrutalist design with a blueprint dot-grid canvas pattern, bold borders, offset shadows, and high-contrast color palettes tailored for both Light and Dark modes.

---

## Tech Stack

- **Frontend Framework**: React 19 (Hooks, Suspense, Concurrent Rendering)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + Custom Design System
- **Animations & Micro-interactions**: Framer Motion
- **Icons**: Lucide React
- **Build Tool & Bundler**: Vite
- **Data Persistence**: Browser `localStorage` + History API

---

## API Used

This project utilizes data from the public **[PokéAPI v2](https://pokeapi.co/)**:

- **Endpoints**:
  - `GET https://pokeapi.co/api/v2/pokemon?limit={limit}&offset={offset}` — Paginated Pokémon list.
  - `GET https://pokeapi.co/api/v2/pokemon/{id|name}` — Detailed stats, types, abilities, sprites, and moves.
  - `GET https://pokeapi.co/api/v2/type/{type}` — Type-specific Pokémon listings and elemental damage relations.
  - `GET https://pokeapi.co/api/v2/generation/{id}` — Generation-specific Pokémon rosters.
  - `GET https://pokeapi.co/api/v2/pokemon-species/{id}` — Species information, descriptions, and evolution data.

---

## Installation

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm** or **yarn** / **pnpm**

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/pokemon-explorer.git
   cd pokemon-explorer
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## Running Locally

1. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

2. **Run TypeScript Type-Checking**:
   ```bash
   npx tsc --noEmit
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## Project Structure

```
pokemon-explorer/
├── public/                     # Static assets and icons
├── src/
│   ├── components/             # Reusable UI Components
│   │   ├── CompareDock.tsx     # Floating bottom comparison dock
│   │   ├── CompareModal.tsx    # Head-to-head battle comparison matrix
│   │   ├── EmptyState.tsx      # Zero-results state with filter reset action
│   │   ├── ErrorState.tsx      # Error banner with retry callback
│   │   ├── FavoritesDrawer.tsx # Slide-over panel for saved favorites
│   │   ├── Footer.tsx          # Dynamic footer with type links & quick stats
│   │   ├── Header.tsx          # Sticky navigation bar with theme toggle & counters
│   │   ├── HeroSection.tsx     # Animated hero banner with companion shortcuts
│   │   ├── LoadingSkeleton.tsx # Skeleton card shimmer & spinning Pokéball loader
│   │   ├── PokemonAboutTab.tsx # Biography, elemental defenses & Sprite Studio
│   │   ├── PokemonCard.tsx     # Grid card item with artwork & stat highlights
│   │   ├── PokemonGrid.tsx     # Responsive grid layout with infinite pagination
│   │   ├── PokemonModal.tsx    # Tabbed Pokémon details view (Stats, About, Moves)
│   │   ├── PokemonMovesArsenal.tsx # Repertoire of battle moves with filter tabs
│   │   ├── PokemonSearchFilter.tsx # Unified search bar & dynamic filter popup
│   │   ├── StatBar.tsx         # Animated magnitude-colored linear stat bars
│   │   ├── StatRadarChart.tsx  # Interactive multi-axis SVG radar polygon chart
│   │   └── TypeBadge.tsx       # Elemental type badge pills with accessible colors
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useFavorites.ts     # LocalStorage state management for favorites
│   │   ├── usePokemon.ts       # PokéAPI data fetching, filtering & URL sync
│   │   └── useTheme.ts         # Dark / Light theme persistence
│   ├── services/               # API & Network Layer
│   │   └── pokemonApi.ts       # PokéAPI client with in-memory caching & batching
│   ├── styles/                 # Design Tokens & Theme Colors
│   │   └── typeColors.ts       # Accessible Pokémon elemental color definitions
│   ├── types/                  # TypeScript Data Models
│   │   └── pokemon.ts          # Type definitions for Pokémon, Stats, and Moves
│   ├── App.tsx                 # Root application component & URL route sync
│   ├── index.css               # Design system, dot-grid canvas & Neobrutalism styles
│   └── main.tsx                # React application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Challenges Faced

1. **High-Volume PokéAPI Network Latency**:
   - *Challenge*: Fetching full stat matrices, abilities, and sprites for multiple Pokémon simultaneously caused network congestion and rate-limiting.
   - *Solution*: Implemented an in-memory session cache (`Map<string, PokemonDetail>`) combined with batched `Promise.all` hydration and client-side pagination.

2. **Substring & Fuzzy Search Across 1,000+ Pokémon**:
   - *Challenge*: The base PokéAPI search only supports exact matches by default.
   - *Solution*: Built a lightweight in-memory Pokémon index that loads names and IDs on demand, allowing instant debounced prefix and substring matching (e.g. `"pika"` matching `"Pikachu"`).

3. **URL State Synchronization Without Disruptive Reloads**:
   - *Challenge*: Synchronizing active search terms, active filters, and open Pokémon modals to the browser address bar without causing unneeded page reloads or layout jumps.
   - *Solution*: Leveraged the browser `History API` (`replaceState` for filters and `pushState` for modals) with responsive `popstate` listeners for full Back/Forward browser navigation.

4. **Pixel-Perfect Sprite Scaling**:
   - *Challenge*: PokéAPI retro pixel sprites (96×96px) became blurry or distorted when scaled up in modern responsive layouts.
   - *Solution*: Applied custom CSS `[image-rendering: pixelated]` and `[image-rendering: crisp-edges]` properties to ensure crisp retro pixel art on high-DPI displays.

5. **Color Contrast & Theme Consistency**:
   - *Challenge*: Balancing bold Neobrutalist high-saturation colors with dark mode readability and WCAG AA contrast standards.
   - *Solution*: Curated specialized contrast tokens for all 18 elemental types, distinct hover states, and offset box shadows across Light and Dark themes.

---

## Future Improvements

- **Pokémon Audio Cries**: Integrate official cry audio playback from PokéAPI (`cries.latest`) on card hover and modal opening.
- **Damage Calculation Simulator**: Interactive combat calculator comparing type effectiveness, STAB (Same-Type Attack Bonus), and stat multipliers between two Pokémon.
- **Team Builder**: Allow trainers to assemble a 6-Pokémon team, analyze team type coverage, and export team sheets in Pokémon Showdown format.
- **PWA Offline Support**: Implement Service Worker caching to enable offline Pokédex browsing.
- **Internationalization (i18n)**: Support multilingual Pokémon names, abilities, and flavor text in Japanese, Spanish, French, German, and Korean.
