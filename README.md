# WebShop Admin — Example Solution

An example implementation of the [WebShop Admin exercise](https://github.com/Lexicon-Utbildning-Front-end-2026/Webshop-admin) for the Lexicon FE26 Next.js course.

## Overview

This repo demonstrates **one way** to build the admin interface described in the exercise spec. It is inspired by the [design mockup](https://github.com/Lexicon-Utbildning-Front-end-2026/Webshop-admin/raw/main/localhost_3002_admin.png) but is not a pixel-perfect reproduction — the goal is to show the architectural patterns rather than the exact visual design.

### What's implemented

- Dashboard with product stats
- Product listing with pagination, search, sorting, and category/stock filtering
- Create, edit, and delete products (full CRUD)
- All filtering/search/pagination driven by URL search params

## Tech Stack

| Dependency | Role |
| --- | --- |
| [Next.js 16](https://nextjs.org/) | App Router, Server Components, Server Actions |
| [React 19](https://react.dev/) | UI library |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Zod 4](https://zod.dev/) | Form validation & data coercion |
| [Biome](https://biomejs.dev/) | Linting, formatting & import organizing |
| [json-server 0.17](https://github.com/typicode/json-server/tree/v0.17.4) | Mock REST API |
| [lucide-react](https://lucide.dev/) | Icons |
| [react-hot-toast](https://react-hot-toast.com/) | Toast notifications |
| [use-debounce](https://github.com/xnimorz/use-debounce) | Debounced search input |

## Getting Started

Install dependencies:

```bash
npm install
```

Start the full development environment (Next.js + JSON Server):

```bash
npm run dev:full
```

- **App:** [http://localhost:3000](http://localhost:3000)
- **API:** [http://localhost:4000](http://localhost:4000)

> You can also run the servers separately with `npm run dev` and `npm run mock-server`.

## API Reference

The mock API is powered by [json-server v0.17](https://github.com/typicode/json-server/tree/v0.17.4) with custom middleware for pagination metadata and auto-generated fields (SKU, timestamps).

For full endpoint documentation (resources, pagination, sorting, filtering), see the **[starter code repository](https://github.com/Lexicon-Utbildning-Front-end-2026/projekt-agila-metoder-startkod)**.

## Architecture & Key Patterns

### Server Components for data fetching

The admin dashboard (`app/admin/page.tsx`) is an async Server Component. It passes `searchParams` down to child components that fetch data directly via the `lib/api.ts` layer — no client-side fetch waterfalls, no loading spinners for the initial render.

### Server Actions for mutations

Create, edit, and delete operations go through Server Actions in `app/admin/actions.ts`. This colocates Zod validation with the mutation logic and avoids creating separate API route handlers.

### Zod validation with coercion

`lib/schemas.ts` uses `z.coerce` to bridge the gap between `FormData` (where every value is a string) and the typed data the API expects (numbers, URLs, etc.). Validation errors are flattened and returned to the form for field-level error display.

### URL state for search, filter & sort

Search queries, category filters, stock filters, pagination, and sort order are all managed through URL `searchParams` — not React state. This makes every view bookmarkable and shareable, and works naturally with Server Components since `searchParams` are available on the server.

### Debounced search

The search input uses `use-debounce` to delay URL updates until the user stops typing, preventing an API call on every keystroke.

### Suspense with skeleton fallbacks

Each data-dependent section (stats box, filters, product table) is wrapped in its own `<Suspense>` boundary with a matching skeleton component. This enables streaming and shows meaningful loading states instead of a single full-page spinner.

### Server-only API layer

`lib/api.ts` imports `"server-only"` to guarantee the fetch wrapper and API URL never leak into the client bundle.

## Project Structure

```
app/
  layout.tsx                    # Root layout
  page.tsx                      # Root page (unused — navigate to /admin)
  admin/
    page.tsx                    # Dashboard — async Server Component
    actions.ts                  # Server Actions (create, edit, delete)
    products/
      create/page.tsx           # Create product page
      edit/[id]/page.tsx        # Edit product page (dynamic route)
components/
  admin/
    forms/
      product-form.tsx          # Shared create/edit form
      form-field.tsx            # Reusable form field with error display
      form-delete-product.tsx   # Delete confirmation form
    hooks/
      use-form-mutation.ts      # Form submission hook with useActionState
    product-table.tsx           # Product listing table
    skeletons.tsx               # Loading skeleton components
    stat-card.tsx               # Dashboard stat cards
    status-box.tsx              # Stats container
  navigation/
    admin-filters.tsx           # Filter bar (search + selects)
    filter-select.tsx           # Category/stock filter select
    search-input.tsx            # Debounced search input
    pagination.tsx              # Pagination controls
    reset-button.tsx            # Reset all filters
lib/
  api.ts                        # Fetch wrapper — server-only
  schemas.ts                    # Zod validation schemas
  types.ts                      # TypeScript type definitions
  utils.ts                      # Utility functions
server/
  products.json                 # Mock database (json-server)
  middleware.js                 # Custom json-server middleware
```
