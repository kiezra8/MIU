# MIU (Made In Uganda) — Cybersecurity Architecture & Security Policy

## 1. Overview & Threat Model
MIU is a multi-vendor national commercial marketplace handling financial transactions, personal delivery addresses, and authentic Ugandan origin verification. This document details the defense-in-depth security controls implemented across the entire application stack.

---

## 2. Fundamental Security Principles

### Principle 1: Zero Trust for Client Inputs
- **Prices, Discounts, and Order Totals**: Never trusted from client requests. The server or trusted backend recalculates every line item, verifies inventory availability, evaluates coupon conditions, and computes delivery fees based on verified district mappings.
- **Inventory Protection**: Optimistic locking and atomic decrement ensure stock quantities cannot be depleted below zero or oversold.
- **Role & Authorization Checks**: Client-side UI badges or navigation elements do not determine access. All protected routes (`/admin`, `/seller/dashboard`) and data mutations strictly enforce role validation via Supabase Auth and Row Level Security.

### Principle 2: Row Level Security (RLS)
Supabase PostgreSQL tables have RLS enforced (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
- **Profiles**: Users can only read and update their own profile; admins have global read access.
- **Products**: Public can read only `status = 'active'`; sellers can only create, update, or delete products where `seller_id = auth.uid()`.
- **Orders & Seller Orders**: Customers access only orders where `user_id = auth.uid()`; sellers access only their respective `seller_orders` fulfillment records; admins oversee global transactions.
- **Audit Logs**: Immutable insert-only records accessible solely by verified administrators.

### Principle 3: Payment Verification & USSD Security
- **No Simulated Direct Successes**: Payments are verified through server-to-server callbacks or trusted gateway responses from MTN Mobile Money and Airtel Money.
- **Transaction Idempotency**: Each order is assigned a cryptographically random, unique order number (e.g. `MIU-2026-XXXX`) and tracking code (`TRK-UG-XXXXXX`), preventing duplicate processing.
- **Payment State Machine**: State transitions (`pending` -> `processing` -> `completed` / `failed`) are one-way and strictly governed on the server.

---

## 3. Input Validation & Injection Defenses

### Zod Schema Validation
All user inputs are validated against strict Zod schemas before processing:
- **Phone Numbers**: Validated against Ugandan telecommunications numbering plans (`^(?:\+256|0)(?:7[0-9]|20[0-9]|39[0-9])[0-9]{7}$`).
- **Prices & Quantities**: Validated as strictly positive integers.
- **Text & Descriptions**: Sanitized and stripped of malicious HTML / script tags.

### SQL Injection Protection
- All database queries use parameterized prepared statements through PostgreSQL and Supabase Client SDK, completely mitigating SQL injection vectors.

### Cross-Site Scripting (XSS) Protection
- Next.js and React automatically escape variables rendered in JSX.
- Content Security Policy (CSP) headers restrict script execution to authorized origins.

---

## 4. Secrets & Environment Variable Isolation
- **Service Role Secrets**: `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side environments (Server Actions, API routes, background workers) and is NEVER prefixed with `NEXT_PUBLIC_`.
- **Payment Provider Secrets**: MTN and Airtel API keys, webhook signing secrets, and merchant tokens are stored strictly in private server environment variables.
- Client builds only expose `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, which are constrained by Row Level Security.

---

## 5. Audit Logging & Administrative Safeguards
- All administrative approvals, product origin verification adjustments, seller status changes, and platform commission alterations are logged with:
  - User ID / Admin actor
  - Timestamp
  - Action taken
  - Entity modified
  - IP Address & User Agent snapshot
- Role-based access control prevents privilege escalation.

---

## 6. Vulnerability Reporting
To report security vulnerabilities in MIU:
- Email: `security@miu.ug`
- Emergency Contact: `+256 700 123 456`
