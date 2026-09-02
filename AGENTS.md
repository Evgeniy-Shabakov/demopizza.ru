# AGENTS.md — demopizza.ru

## Build / Dev / Test Commands

```bash
npm run dev      # Start dev server (port 80, opens browser)
npm run build    # Production build via Vite
npm run preview  # Preview production build
```

Port 80 requires elevated permissions: `sudo setcap 'cap_net_bind_service=+ep' $(which node)`. This was granted for VKID integration — remove if port 80 is no longer needed.

No test framework is installed. No linter (ESLint) or formatter (Prettier) is configured. If adding tests or linting, install the tooling first (`npm install -D vitest` for tests, `npm install -D eslint` for linting).

---

## Project Stack

- **Framework:** Vue 3 (Composition API + `<script setup>`)
- **Build tool:** Vite 8
- **Routing:** Vue Router 5 (createWebHistory)
- **Styling:** Tailwind CSS v4 (CSS-first config, `@import "tailwindcss"`) + tw-animate-css
- **UI library:** shadcn-vue (New York style, Inter font) via reka-ui primitives
- **HTTP client:** Axios
- **Utilities:** @vueuse/core, class-variance-authority, clsx, tailwind-merge
- **Icons:** @lucide/vue

---

## Directory Structure

```
src/
  api/            # Axios instance (api.js)
  app/            # App.vue, main.js, router.js, style.css, initialize.js
  components/     # App components (auto-imported)
    simple/       # Small standalone components
    structure/    # Layout structural components
  composables/    # Singleton reactive state modules (useX.js)
  constants/      # Enum-like frozen objects (orderType.js, orderStatus.js)
  helpers/        # Pure utility functions
  layouts/        # Layout wrappers (DefaultLayout.vue)
  pages/          # Route page components
  shadcn/         # shadcn-vue components
    lib/          # cn(), shadcn utilities
    ui/           # shadcn UI primitives (kebab-case dirs)
```

---

## Code Style Guidelines

### Language & Syntax
- Plain **JavaScript** — no TypeScript, no JSDoc annotations.
- `<script setup>` Composition API for **all** Vue components (never Options API).
- SFCs have `<template>`, `<script setup>`, `<style>` in that order (no `<style scoped>` — all classes are global Tailwind utilities). Some components omit `<style>` entirely.

### File Naming
- **Vue components:** PascalCase (e.g., `HomePage.vue`, `ProductCard.vue`, `BottomNav.vue`).
- **JS modules:** camelCase (e.g., `useCart.js`, `formatPhone.js`).
- **shadcn dirs:** kebab-case (e.g., `dropdown-menu/`, `native-select/`).

### Naming Conventions
- **Composables:** `use` prefix + camelCase (`useCart`, `useCategories`).
- **Exported state:** camelCase (`productsInCart`, `totalProductsInCart`, `isLoadingCategories`).
- **Exported functions:** camelCase (`loadCities`, `addProductToCart`, `clearCart`).
- **Props:** camelCase (`product`, `isBack`, `modelValue`).
- **Events:** kebab-case in emits (`'update:modelValue'`, `'update:open'`).
- **Environment variables:** UPPER_SNAKE_CASE with `VITE_` prefix.

### Imports
- Use `@` alias for project-internal imports (`@/api/api`, `@/composables/useCart`, `@/shadcn/lib/utils`).
- Third-party libs: bare specifiers (`import axios from 'axios'`).
- Relative imports only for same-directory index files (`import { badgeVariants } from '.'`).
- Destructure named exports from composables: `import { categories, loadCategories } from '@/composables/useCategories'`.

### Auto-imports (do NOT import these)
- **Vue APIs** (`ref`, `computed`, `watch`, `onMounted`, `defineProps`, `defineEmits`, etc.), **Vue Router APIs** (`useRoute`, `useRouter`, etc.), and **all @vueuse/core exports** (`useLocalStorage`, `useDark`, `useToggle`, etc.) are auto-imported via `unplugin-auto-import`. See `auto-imports.d.ts` for the full list.

### Auto-registered components (do NOT import them)
- All `.vue` files in `src/shadcn/ui/` — `Button`, `Card`, `Badge`, `Spinner`, `DropdownMenu`, `NativeSelect`, etc.
- All `.vue` files in `src/components/` — `ProductCard`, `CartItem`, `PageHeader`, `BottomNav`, `BottomBar`, `BurgerMenu`, `CategoryNav`, `MobileHeader`, `CitySelect`, `SpinnerCenter`, `ThemeToggle`, `WorkSchedule`, `BaseLink`.
- `ContainerX` also registers as `Container` (via `unplugin-vue-components`).

### Components That MUST Be Explicitly Imported
- Layouts: `import DefaultLayout from '@/layouts/DefaultLayout.vue'` (in router.js).
- Page components: `import HomePage from '@/pages/HomePage.vue'` (in router.js).

### Props & Events
- Define props using **object syntax** with `type`, `required`, `default`:
  ```js
  defineProps({
    product: { type: Object, required: true },
    isBack: Boolean,
  })
  ```
- The `class` prop uses `skipCheck: true` for shadcn components: `{ type: [Boolean, null, String, Object, Array], required: false, skipCheck: true }`.
- Use `defineEmits(['update:modelValue'])` for v-model support.
- Use `defineOptions({ inheritAttrs: false })` in shadcn-style primitives.

### Class / Styling Utilities
- Use the `cn()` helper from `@/shadcn/lib/utils` (wraps `clsx` + `tailwind-merge`): `import { cn } from '@/shadcn/lib/utils'`.
- For variant-based styling, use `cva` from `class-variance-authority`.
- Tailwind CSS v4: use `@theme` for custom tokens in `style.css`, `@custom-variant dark` for dark mode.

### Composables Pattern
- Export singleton reactive state directly (not factory functions).
- Export `ref` values, not `reactive()` objects.
- Use `useLocalStorage` from @vueuse/core for persisted state.
- Expose loading flags and data together:
  ```js
  export const data = ref(null)
  export const isLoading = ref(false)
  export async function loadData() { ... }
  ```
- Some composables (e.g., `useCategories`) use a `lastFetched` + `maxAge` stale-while-revalidate pattern. Follow this when adding data-loading composables that fetch infrequently.

### API Layer
- Use the shared Axios instance from `src/api/api.js`: `import { api } from '@/api/api'`.
- Base URL from `import.meta.env.VITE_SEREVER_API_BASE_URL`.
- `api.get()`, `api.post()`, etc. — returns `response.data` from which composables typically destructure `response.data.data`.

### Error Handling
- **No error handling currently exists** — API errors are unhandled promise rejections.
- When adding new composables or API calls, **always wrap API calls in try/catch**.
- Expose an `error` ref from composables so UI can display error states.

### Router
- Routes use `DefaultLayout` as a parent wrapper (contains `<router-view />`).
- Use `createWebHistory()` (no hash mode).
- `scrollBehavior` saves/restores scroll positions per route name.
- All route names use kebab-case (`'legal-documents'`, `'company-datails'` — note typo is intentional to match existing).

### Misc
- `<router-link>` and `<router-view>` are auto-imported.
- `useRoute()` and `useRouter()` are auto-imported.
- Dark mode uses `useDark()` (auto-imported from @vueuse/core) + Tailwind dark variant.
- `.env` contains `VITE_BRAND_NAME`, `VITE_SERVER_BASE_URL`, `VITE_SEREVER_API_BASE_URL` (the misspelling is intentional — do not "fix" it).
- `src/app/initialize.js` runs at startup (imported in `main.js`), pre-loading cities, restaurants, and company data, and enabling dark mode.
- When modifying shadcn components, keep the same structure: component + `index.js` exporting variants.
