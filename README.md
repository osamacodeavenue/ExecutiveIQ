# ExecutiveIQ

A CEO command center for **ABC Consumer Products** (FMCG / Retail, Pakistan), built from the
ExecutiveIQ desktop prototype. It runs entirely on mock data.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Screens

| Route | Screen | What it does |
| --- | --- | --- |
| `/` | Executive Overview | Health score, 6 KPIs with sparklines, ranked insights, revenue vs target and profitability charts with hover tooltips, monthly table |
| `/sales` | Sales | KPIs, deal funnel, unit/region breakdown, rep leaderboard |
| `/finance` | Finance | 7 P&L KPIs, May → June profit bridge (waterfall), revenue and margin trends, expenses, budget vs actual |
| `/operations` | Operations | KPIs, alerts, on-time delivery, delivery by region, low-stock SKUs with "Create PO" |
| `/customers` | Customers | KPIs, key accounts, receivables concentration and ageing, customer risk cards |
| `/analyst` | AI Analyst | Chat with suggested questions; structured answers with drivers, bars, next steps and sources |
| `/decisions` | Decision Center | Three decisions with an open → in review → resolved workflow |
| `/reports` | Reports | Animated executive report generation, plus four management report previews |
| `/data` | Data Center | Data-domain health, drag-and-drop / browse / sample upload with progress |
| `/settings` | Settings | Workspace details and notification preferences |

The top-bar filters (date range, business unit, region) apply across every screen. Changing
one shows a short loading state, then rescales the figures to that slice.

## Project layout

```
src/
  data/mock.ts        all mock figures, customers, reps, analyses, AI answers, reports, files
  data/types.ts       shared types
  lib/scope.ts        derives filter-scaled numbers (useScope)
  lib/format.ts       PKR / percent formatting, chart axis scaling
  state/AppContext.tsx app state: filters, decisions, modal, chat, reports, uploads, toasts
  components/         shell (Sidebar, TopBar, Layout), AnalysisModal, Icon, small UI parts
  pages/              one file per screen
```

## Connecting real data

Every number flows from `src/data/mock.ts`. To go live, replace those exports with API
calls (for example behind React Query) that return the same shapes. The AI Analyst uses a
keyword router (`matchQuestion`) in place of a language model, and uploads, PDF downloads,
sharing and purchase orders are simulated with toasts.
