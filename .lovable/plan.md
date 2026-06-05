# Cloro — Production MVP Architecture & Build Plan

Building the operational app behind the marketing site, designed to scale to millions of users while shipping a minimal, working slice on day one.

## 1. System architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Clients (same codebase, PWA-installable on iOS/Android)    │
│  • Web app (desktop browser)                                │
│  • Mobile web / installed PWA (offline-capable later)       │
└───────────────┬─────────────────────────────────────────────┘
                │ HTTPS
┌───────────────▼─────────────────────────────────────────────┐
│  Edge (Cloudflare Workers) — TanStack Start SSR             │
│  • Public marketing routes (/, /contacto, /comparativa/*)   │
│  • App routes under /_authenticated/app/*                   │
│  • Server functions (createServerFn) = typed RPC            │
│  • Server routes /api/public/* = webhooks, cron             │
└───────────────┬─────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────────┐
│  Lovable Cloud (Postgres + Auth + Storage + Realtime)       │
│  • Auth: email/password + Google                            │
│  • Row-Level Security scoped to org_id + role               │
│  • Storage: fotos partes, firmas, documentos                │
│  • Realtime: live updates of partes en curso                │
└─────────────────────────────────────────────────────────────┘
```

**Multi-tenancy model.** Every business is an `organization`. Every row in every business table carries `org_id`. RLS enforces `org_id = current user's org` on every read/write. This is the single rule that keeps tenants isolated and the app safe at scale.

**Platforms.** Phase 1 ships as a responsive PWA — same code runs on iOS Safari, Android Chrome, and desktop. Phase 2 wraps it with Capacitor for true native iOS/Android (push, deep camera/GPS access, store presence). All business logic stays in one codebase.

## 2. Module roadmap

| Phase | Modules | Status |
|---|---|---|
| **MVP (this build)** | Auth + Orgs + Roles · Clientes · Piscinas · Partes de trabajo (mediciones + fotos) | ship now |
| Phase 2 | Rutas y planificación · Productos/stock · Notificaciones cliente | next |
| Phase 3 | Facturación + VeriFactu · Pagos (Stripe/Bizum) · SILOÉ export | later |
| Phase 4 | Analítica · Agente WhatsApp · Modo offline completo | later |

## 3. File structure

```text
src/
├── routes/
│   ├── __root.tsx                  marketing + app shell
│   ├── index.tsx                   landing
│   ├── contacto.tsx, comparativa.*.tsx, admin.mensajes.tsx  (existing)
│   ├── auth.tsx                    login + signup
│   └── _authenticated/
│       ├── route.tsx               managed gate (ssr:false → /auth)
│       └── app/
│           ├── index.tsx           dashboard
│           ├── clientes.index.tsx  list
│           ├── clientes.$id.tsx    detail + piscinas
│           ├── piscinas.$id.tsx    piscina detail + historial
│           ├── partes.index.tsx    feed de partes
│           ├── partes.nuevo.tsx    crear parte (mobile-first)
│           ├── partes.$id.tsx      detalle parte
│           └── ajustes.tsx         org settings + team
├── components/
│   ├── site/                       marketing (existing)
│   └── app/                        AppShell, Sidebar, MobileNav, DataTable…
├── lib/
│   ├── orgs.functions.ts           getMyOrg, switchOrg
│   ├── clientes.functions.ts       CRUD
│   ├── piscinas.functions.ts       CRUD
│   ├── partes.functions.ts         CRUD + upload fotos
│   └── schemas.ts                  shared Zod
└── integrations/supabase/*         (managed)
```

## 4. Database schema (MVP slice)

```text
organizations(id, name, slug, plan, created_at)
profiles(id=auth.users.id, full_name, avatar_url, default_org_id)
org_members(org_id, user_id, role)         role enum: owner|admin|tecnico
                                            PK(org_id,user_id)

clientes(id, org_id, nombre, email, telefono, direccion, notas, archived)
piscinas(id, org_id, cliente_id, alias, tipo, volumen_m3, sistema_desinfeccion,
         direccion, lat, lng, notas, archived)
partes(id, org_id, piscina_id, tecnico_id, fecha, estado,
       ph, cloro_libre, cloro_total, alcalinidad, cya, sal, temp_c,
       observaciones, productos_usados jsonb, firma_cliente_url, created_at)
parte_fotos(id, org_id, parte_id, storage_path, created_at)
```

All tables: RLS `org_id = (SELECT default_org_id FROM profiles WHERE id=auth.uid())` and membership check via `has_org_role(org_id, role[])` SECURITY DEFINER function (avoids recursive RLS). Roles live in `org_members`, never on profile.

## 5. API surface

**Server functions (typed RPC, app-internal):**
- `auth`: handled by Supabase client
- `orgs.*`: getMyOrgs, createOrg, inviteMember, setRole
- `clientes.*`: list(search, page), get, create, update, archive
- `piscinas.*`: listByCliente, get, create, update, archive
- `partes.*`: list(filters), get, create, update, addFoto (signed URL), delete

**Server routes (`/api/public/*`):**
- `/api/public/webhooks/*` — future Stripe, WhatsApp
- `/api/public/health` — uptime

All inputs validated with Zod (length, regex, ranges). All writes scoped through `requireSupabaseAuth` middleware so RLS enforces tenancy.

## 6. UI architecture

- **AppShell**: sidebar (desktop) + bottom-tab nav (mobile), org switcher in header.
- **Mobile-first parte form**: stepper (Piscina → Mediciones → Productos → Fotos → Firma), large touch targets, works with one hand in the field.
- **DataTable**: shared list component (search, pagination, empty state) for clientes/piscinas/partes.
- **Design tokens**: reuses Cloro tokens from `src/styles.css` (same blue, same fonts) so the app feels like the marketing site.
- **Realtime**: partes feed subscribes to `partes` changes for the org → técnicos see new partes appear live.

## 7. Scalability decisions baked in from day one

- Multi-tenant `org_id` everywhere → horizontal partitioning later is trivial.
- RLS as the single security boundary → no per-route auth logic to drift.
- Stateless edge workers → scale linearly with traffic.
- Indexed FKs on `org_id`, `cliente_id`, `piscina_id`, `(org_id, fecha desc)` for parte feeds.
- JSONB for `productos_usados` so we can iterate the shape without migrations.
- Storage paths namespaced `/{org_id}/partes/{parte_id}/...` for easy per-tenant lifecycle rules.
- Server functions return plain DTOs only → caches and CDN-friendly.

## 8. What I'll build in this first turn

1. Migration: `organizations`, `org_members` (+ role enum), `profiles`, `clientes`, `piscinas`, `partes`, `parte_fotos`, `has_org_role()`, RLS, GRANTs, trigger to auto-create profile + personal org on signup.
2. Auth: `/auth` (email+password + Google) and the managed `_authenticated` gate.
3. App shell under `/_authenticated/app` with sidebar + mobile bottom nav.
4. Modules: Clientes (list/detail/create/edit), Piscinas (nested under cliente), Partes (list + mobile-first create + detail).
5. Server fns + Zod validation for every mutation.
6. Empty states, loading skeletons, toasts, error boundaries on every route.

**Two confirmations before I build:**

a) **Multi-tenant from day one?** I strongly recommend yes (one account can own multiple piscineras, and you can sell to chains later). Say "single-tenant" if you'd rather skip orgs for now.

b) **PWA-first (web/iOS/Android same code) is the plan.** Native wrappers come in Phase 2 once the data layer is proven. OK?

Reply "go" (or with tweaks) and I'll execute steps 1–6 in the next turn.
