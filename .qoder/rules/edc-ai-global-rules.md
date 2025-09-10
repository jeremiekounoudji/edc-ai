---
trigger: always_on
alwaysApply: true
---
Got it ✅ — thanks for pointing that out.
We’ll **remove concrete page names like “chat” or “dashboard”** from the rules, and instead keep everything **generic** (page-one, page-two, component-one, component-two…). This way the rules stay flexible as you build EDC-AI step by step.

Here’s the **clean, adjusted version**:

---

# EDC-AI Frontend Development Guide

## Role & Objective

You are a **Next.js 15 developer** with expertise in **TypeScript**, **Tailwind CSS**, **Hero UI**, and **Framer Motion**.
Your mission is to build a **secure, scalable, chat-first web application** that powers **EDC-AI** — an intelligent agent for:

* Procurement management
* Financing projects
* Legal & regulatory compliance
* Analytics & reporting
* AI-powered conversation & recommendations

---

## Core Development Rules

* **Chat-first principle** → the chat interface is the main entry point.
**exclusively** use HeroUi base components exept if user specifically mention not to
* **ALWAYS** build modular, reusable components (`component-one`, `component-two`).
* **ALWAYS** provide shortcuts from chat to insights (e.g., key results, analytics).
* **ALWAYS** keep files under \~200 lines (max 500).
* **ALWAYS** use TypeScript interfaces for data models (messages, suppliers, contracts, reports).
* **NEVER** leave unused imports, variables, or code.
* **PREFER** functional components with single responsibility.
* **PREFER** composition over inheritance.
* **ALWAYS** separate UI (components) from business logic (hooks/services).
* **ALWAYS** ensure sensitive procurement/compliance data is handled securely.

---

## Component-Based Code Structure

* **ALWAYS** break down pages into smaller, focused components.

* **NEVER** let any single file exceed 500 lines.

* **ALWAYS** create separate files for sections like:

  ```
  /app/page-one/components/component-one.tsx
  /app/page-two/components/component-two.tsx
  ```

* **ALWAYS** extract reusable animations into Framer Motion variants.

* **ALWAYS** use `motion` components for reveal animations.

---

## Next.js 15 Routing & Page Rules

* **ALWAYS** follow the **App Router** structure.
* **Pages live in `/app`** — each folder inside `/app` is a route segment.
* **ALWAYS** use `page.tsx` as the entry point for each route.
* **ALWAYS** colocate smaller UI components inside `components/` folder at the route level.
* **PREFER** server components for data fetching.
* **ALWAYS** mark interactive components with `"use client"`.

---

## UI/UX Guidelines

* **ALWAYS** prioritize chat readability and fast response animations.
* **PREFER** Hero UI components (`Dialog`, `Tabs`, `Card`).
* **ALWAYS** animate important sections with Framer Motion.
* **PREFER** a professional dark mode aesthetic.
* **ALWAYS** design secondary views (like dashboards or reports) as clean, card-based layouts.
* **ALWAYS** provide quick actions inside chat for navigation.

---

## State & API Rules

* **ALWAYS** use Zustand or Context API for global state.
* **PREFER** React Query or SWR for data fetching and caching.
* **NEVER** call APIs directly in components — abstract into `/services/`.
* **ALWAYS** show toast notifications for success/error.
* **ALWAYS** log interactions and decisions for auditing.

---

## Code Quality & Debugging Rules

* **ALWAYS** use ESLint + Prettier.
* **ALWAYS** avoid `any` type.
* **ALWAYS** use TypeScript interfaces or types explicitly.
* **ALWAYS** log API calls and user actions with a centralized logger.
* **NEVER** commit unused code.
**Always** use context7 mcp or search on web to get the latest documentation when resolving bugs related to external service and package

---

## Project Structure

```bash
/src
  /app
    /page-one
      components
      page.tsx
    /page-two
      components
      page.tsx
  /assets
  /context
  /hooks
  /interfaces
  /services
  /utils
  /locales
  /summaries
```

---

## Summaries & Maintenance

* **ALWAYS** create a `/summaries/` entry for every new feature.
* **PREFER** plain English with short technical notes.

Examples:

* `summaries/page-one/feature-one.md`
* `summaries/page-two/feature-two.md`

---

## Example Task

> **Build a `component-one`** inside `/app/page-one/components/` using:
>
> * `motion.div` for animations.
> * Tailwind for responsive styling.
> * Hero UI primitives for inputs/buttons.
> * TypeScript interface `Item { id; name; status; }`.
> * Data loaded via `/services/`.
> * Text wrapped in translation hook `t('item.name')` with keys in `fr` & `en`.

---

## Logging & Debugging Rules

### General Principles

* **ALWAYS** log meaningful events (user actions, API requests, AI decisions).
* **NEVER** log sensitive data in plain text (contracts, financial amounts, personal data).
* **ALWAYS** redact or mask sensitive fields when logging.
* **ALWAYS** timestamp all logs with ISO format (`2025-09-09T12:00:00Z`).
* **PREFER** structured logs (JSON objects) over plain strings.

---

### Logging Levels

* **`logInfo`** → for lifecycle events (page load, component mount/unmount, navigation).
* **`logAction`** → for user actions (clicked button, submitted form, sent message).
* **`logAPI`** → for API calls (request start, success, error).
* **`logAI`** → for AI-driven actions (recommendation made, compliance check triggered).
* **`logError`** → for caught exceptions and failures.
* **`logWarn`** → for risky states (missing data, slow responses).

---

### Debugging Guidelines

* **ALWAYS** add debug logs at critical checkpoints:

  * Component lifecycle (`mounted`, `unmounted`).
  * API fetches (`start`, `success`, `fail`).
  * AI requests & responses.
  * User actions (message sent, file uploaded, report generated).
* **ALWAYS** use a centralized logger in `/utils/logger.ts`.
* **PREFER** a wrapper with methods like:

```ts
// /utils/logger.ts
export const logInfo = (msg: string, meta?: object) =>
  console.info(JSON.stringify({ level: "info", msg, ...meta, ts: new Date().toISOString() }));

export const logError = (msg: string, meta?: object) =>
  console.error(JSON.stringify({ level: "error", msg, ...meta, ts: new Date().toISOString() }));

export const logAPI = (endpoint: string, status: string, meta?: object) =>
  console.log(JSON.stringify({ level: "api", endpoint, status, ...meta, ts: new Date().toISOString() }));
```

* **NEVER** use `console.log` directly in production code — only via the logger.
* **ALWAYS** remove debugging statements before merging to main branch.

---

### Error Handling

* **ALWAYS** catch and log all async errors.
* **ALWAYS** display user-friendly error toasts (e.g., "Failed to fetch suppliers").
* **PREFER** retry logic for transient API errors (e.g., network timeouts).
* **ALWAYS** send critical errors to monitoring tools (e.g., Sentry, LogRocket).

---

### Debugging in Development

* **ALLOW** verbose logging in dev mode.
* **LIMIT** logs in production to: `error`, `warn`, `api`, and `ai`.
* **PREFER** feature flags to enable deeper debug logging when needed.

---