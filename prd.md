# AI Resume Tracker — Build PRD

> What to build. Setup/install lives in `setup.md`. Levels are progressive: ship **L1**, then layer **L2/L3**.

---

## 1. Overview

A single-user dashboard for tracking every job application — company, role, status, dates, notes — with analytics. Each user sees only their own data.

**Problem:** Job seekers apply to dozens of companies and lose track of status, interviews, rejections, and offers across spreadsheets and inboxes.

**Solution:** One authenticated dashboard. Create / read / update / delete applications, filter and search them, and see status analytics at a glance.

---

## 2. Goals

### In scope (MVP)
- Auth (Clerk) with protected routes
- Full CRUD on job applications
- Status lifecycle management
- Dashboard analytics (cards + charts)
- Search, filter, sort, pagination
- Responsive UI, server-rendered pages
- Strict per-user data isolation

### Out of scope (V2+)
Resume parsing/upload, AI resume review, AI cover letters, email notifications, interview scheduler, Chrome extension, LinkedIn integration, job-match scoring, team collaboration, real-time chat.

---

## 3. Architecture

```
Browser ──► Clerk middleware (auth gate)
        ──► Next.js App Router (RSC)
              ├─ Server Components: read via Drizzle (direct DB query)
              ├─ Server Actions:   mutations via Drizzle
              └─ Route Handlers:   /api/* (only if needed by client)
        ──► Neon Postgres (HTTP serverless driver)
```

Principles:
- **Reads** in Server Components — direct Drizzle query in the RSC, no client fetch waterfall.
- **Mutations** in Server Actions, revalidated with `revalidatePath`.
- **TanStack Query** only on the client for interactive lists (search/filter/paginate without full reload). Server-rendered first paint, hydrated client cache after.
- `user_id` is **always** taken from `auth()` on the server — never from the client payload.

---

## 4. Data Model

Single table. Status is a Postgres enum for integrity.

```ts
// src/db/schema.ts
import { pgTable, pgEnum, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const applicationStatus = pgEnum("application_status", [
  "applied", "oa", "interview", "hr_round", "rejected", "offer", "accepted",
]);

export const applications = pgTable("applications", {
  id:          uuid("id").primaryKey().defaultRandom(),
  userId:      varchar("user_id", { length: 255 }).notNull(),     // Clerk user id
  companyName: varchar("company_name", { length: 255 }).notNull(),
  role:        varchar("role", { length: 255 }).notNull(),
  status:      applicationStatus("status").notNull().default("applied"),
  jobUrl:      text("job_url"),
  location:    varchar("location", { length: 255 }),
  salary:      varchar("salary", { length: 100 }),
  notes:       text("notes"),
  appliedDate: timestamp("applied_date", { withTimezone: true }).notNull(),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
```

Indexes: `(user_id)`, `(user_id, status)`, `(applied_date DESC)`.

**Status display map:**

| Enum | Label | Badge |
|---|---|---|
| `applied` | Applied | neutral |
| `oa` | OA | blue |
| `interview` | Interview | indigo |
| `hr_round` | HR Round | violet |
| `rejected` | Rejected | red |
| `offer` | Offer | amber |
| `accepted` | Accepted | green |

---

## 5. Auth & Security

- Clerk wraps the app via `<ClerkProvider>` in the root layout.
- `middleware.ts` protects everything under `/dashboard`.
- Every server read/mutation calls `const { userId } = await auth();` and filters/sets `user_id = userId`.
- `if (!userId) redirect("/sign-in")` (or throw) on protected server code.

### Non-negotiable rules
1. `user_id` is set **only** from `auth()`, never from form data or client args.
2. Every UPDATE/DELETE includes `AND user_id = :userId` in the where clause — ownership enforced in the query, not just the UI.
3. A user requesting another user's `id` gets a 404, not their data.
4. Client never receives rows it doesn't own.

```ts
// pattern for every mutation
const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");

await db.update(applications)
  .set(data)
  .where(and(eq(applications.id, id), eq(applications.userId, userId)));
```

---

## 6. Routes / Pages

| Route | Type | Description |
|---|---|---|
| `/` | Public | Landing: navbar, hero, features, footer |
| `/sign-in` | Public (Clerk) | Sign in |
| `/sign-up` | Public (Clerk) | Sign up |
| `/dashboard` | Protected | Analytics: cards, charts, recent 5 |
| `/dashboard/applications` | Protected | Table: search, filter, sort, paginate |
| `/dashboard/applications/new` | Protected | Create form |
| `/dashboard/applications/[id]` | Protected | Edit form (pre-filled) |

**Landing hero:** headline "Track Every Job Application In One Dashboard", CTA "Get Started" → `/sign-up`. Features: Track Applications · Monitor Progress · Dashboard Analytics.

---

## 7. Server Actions — Contracts

File: `src/actions/application.actions.ts`. All return a discriminated result.

```ts
type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

| Action | Input | Output | Side effects |
|---|---|---|---|
| `createApplication` | `ApplicationInput` (validated) | `ActionResult<{ id }>` | insert; revalidate `/dashboard/applications` + `/dashboard` |
| `updateApplication` | `id`, `ApplicationInput` | `ActionResult` | update where owner; revalidate both |
| `deleteApplication` | `id` | `ActionResult` | delete where owner; revalidate both |
| `getApplications` | `{ search?, status?, sort?, page?, pageSize? }` | `ActionResult<{ rows, total }>` | read where owner |
| `getApplicationById` | `id` | `ActionResult<Application>` | read where owner (404 if not) |
| `getDashboardStats` | — | `ActionResult<Stats>` | aggregate where owner |

Each mutating action: (1) `auth()` → userId, (2) `zod.safeParse(input)`, (3) Drizzle query scoped to userId, (4) revalidate, (5) typed result. No throw to the client — return `{ ok:false }` and toast it.

---

## 8. Validation — Zod

File: `src/lib/validators.ts`.

```ts
import { z } from "zod";

export const STATUSES = ["applied","oa","interview","hr_round","rejected","offer","accepted"] as const;

export const applicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(255),
  role:        z.string().min(1, "Role is required").max(255),
  status:      z.enum(STATUSES),
  location:    z.string().max(255).optional().or(z.literal("")),
  salary:      z.string().max(100).optional().or(z.literal("")),
  jobUrl:      z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes:       z.string().max(5000).optional().or(z.literal("")),
  appliedDate: z.coerce.date({ required_error: "Applied date is required" }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
```

Required: company, role, status, applied date. Same schema validates on the client (RHF resolver) **and** on the server (action) — never trust client validation alone.

---

## 9. Dashboard Analytics

### Cards
| Card | Value |
|---|---|
| Total Applications | `count(*)` |
| Interviews | `count(status IN ('interview','hr_round'))` |
| Rejected | `count(status='rejected')` |
| Offers | `count(status='offer')` |
| Accepted | `count(status='accepted')` |

### Charts (Recharts)
- **Status Distribution** — Pie, one slice per status (count).
- **Monthly Applications** — Bar, count grouped by `to_char(applied_date,'YYYY-MM')`, last 6 months.

### Acceptance rate
```
acceptanceRate = total === 0 ? 0 : Math.round((accepted / total) * 100)
```
Guard against divide-by-zero (return 0 when no applications).

### Recent applications
Latest 5 by `applied_date DESC` — columns: Company · Role · Status · Date.

---

## 10. Applications Table Page

Features: search (company/role, case-insensitive `ILIKE`), filter by status, sort by date asc/desc, pagination (10/page).

Columns: Company · Role · Status (badge) · Location · Applied Date · Actions (Edit / Delete / View).

Server pagination via `LIMIT/OFFSET`; `getApplications` returns `{ rows, total }` so the client renders page controls. Client interactivity (typing in search, changing filter) uses TanStack Query against a route handler or server action so it doesn't full-reload.

---

## 11. UI Components (shadcn)

Used: Button, Card, Input, Textarea, Badge, Table, DropdownMenu, Dialog, Form, Select, Skeleton, Sheet, Sonner (toaster). Delete uses Dialog (confirm) → action → toast → revalidate.

---

## 12. States

**Empty** — no applications: "No applications found. Add your first application." + "Add Application" button.

**Loading** — Skeletons for: dashboard cards, table rows, chart areas. `loading.tsx` per route segment + `<Suspense>`.

**Error** — form validation (inline, from Zod), DB errors (toast + `error.tsx`), unauthorized (redirect to sign-in), `not-found.tsx` (404), `error.tsx` (500).

---

## 13. Folder Structure

```
src/
├── middleware.ts
├── app/
│   ├── layout.tsx                  # ClerkProvider, Toaster, QueryProvider
│   ├── page.tsx                    # landing
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   └── dashboard/
│       ├── layout.tsx              # sidebar/nav, auth guard
│       ├── page.tsx                # analytics
│       ├── loading.tsx
│       └── applications/
│           ├── page.tsx            # table
│           ├── loading.tsx
│           ├── new/page.tsx        # create
│           └── [id]/page.tsx       # edit
├── actions/
│   └── application.actions.ts
├── components/
│   ├── dashboard/                  # StatsCards, RecentTable
│   ├── charts/                     # StatusPie, MonthlyBar
│   ├── forms/                      # ApplicationForm
│   ├── applications/               # AppTable, DeleteDialog, StatusBadge
│   └── shared/                     # Navbar, Footer, EmptyState
├── db/
│   ├── index.ts
│   └── schema.ts
├── lib/
│   ├── validators.ts
│   ├── utils.ts                    # cn()
│   └── query-provider.tsx
└── types/
    └── index.ts
```

---

## 14. Capability Levels

### L1 — Core (ship first)
Clerk auth + protected `/dashboard` · `applications` schema · create / list / edit / delete via server actions · ownership enforced in queries · Zod validation both sides · Sonner toasts · basic dashboard cards. **Validate the full CRUD loop before anything else.**

### L2 — Polish
Pie + bar charts · search / status filter / sort / pagination · skeletons + `loading.tsx` · empty states · TanStack Query for interactive table · `error.tsx` / `not-found.tsx` · responsive nav (Sheet on mobile) · acceptance-rate stat.

### L3 — Hardening
Versioned migrations (`drizzle-kit generate` + `migrate`, committed SQL) · rate limiting on actions · optimistic UI on delete · seed script · DB indexes verified · Vercel deploy.

---

## 15. Acceptance Criteria (MVP)

A user can:
- [ ] Sign up, log in, log out (Clerk)
- [ ] Create an application (validated)
- [ ] View their applications (table + recent 5)
- [ ] Edit an application (pre-filled form)
- [ ] Delete an application (confirm dialog → toast)
- [ ] See dashboard analytics (cards + 2 charts + acceptance rate)
- [ ] Search / filter / sort / paginate
- [ ] Access **only** their own data (verified server-side)
- [ ] Deploys cleanly to Vercel

---

## 16. V2 Backlog

Resume upload · AI resume review · AI cover-letter generator · application reminders · email notifications · interview scheduler · Chrome extension · LinkedIn integration · job-match scoring · AI career insights.