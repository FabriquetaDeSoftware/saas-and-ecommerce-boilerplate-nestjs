# Project status & roadmap

Last reviewed: September 2026.

Legend: ✅ done · 🚧 partial · ❌ not started · 🐞 known bug

## Feature status

| Area | Feature | Status | Notes |
| --- | --- | --- | --- |
| Auth | Sign-up with password / password-less | ✅ | |
| Auth | Account verification by e-mail code | ✅ | |
| Auth | Sign-in with password, magic link, OTP | ✅ | OTP edge cases, see below |
| Auth | Refresh token | ✅ | No rotation or revocation |
| Auth | Password recovery | 🐞 | Fails when the recovery and refresh secrets differ |
| Auth | Logout / token revocation | ❌ | |
| Auth | Social login (OAuth) | ❌ | |
| Access control | RBAC (`@Roles`) | ✅ | |
| Access control | ABAC (CASL) | 🚧 | Only `ADMIN` → `Products` rules exist |
| Users | Profile routes (get/update me, change password, delete account) | ❌ | `UserModule` only has `findOneByPublicId` |
| Users | Admin user management | ❌ | |
| Products | CRUD for single and subscription products | ✅ | |
| Products | Stripe catalog sync | ❌ | `price_id` is copied by hand |
| Billing | Stripe Checkout (one-time and subscription) | ✅ | |
| Billing | Webhook signature verification | ✅ | |
| Billing | Save purchases after payment | 🐞 | Prisma validation error, nothing is saved |
| Billing | Payment confirmation e-mail | ❌ | Event emitted, no listener |
| Billing | Subscription lifecycle (renewal, cancel, failure) | ❌ | |
| Billing | Purchase history / "my subscriptions" routes | ❌ | |
| Billing | Entitlements (access based on purchases) | ❌ | |
| Billing | Tests | ❌ | |
| E-mail | Queue + templates (`pt_br`) | ✅ | |
| E-mail | Works in the production image | 🐞 | Templates are deleted with `src/` |
| E-mail | Other languages | ❌ | |
| Observability | Traces (OpenTelemetry → Jaeger) | ✅ | |
| Observability | Metrics (Prometheus) | 🚧 | Default metrics only; collector target only valid in dev |
| Observability | Grafana dashboards | ❌ | Nothing provisioned |
| Observability | Health check endpoint | ❌ | |
| Infrastructure | Docker (dev, test, prod) | ✅ | Fixed together with this documentation |
| Infrastructure | CI pipeline | ❌ | |
| Infrastructure | Dev container | 🐞 | Points to a `docker-compose.yml` that does not exist |
| Tests | e2e: auth, root, products | ✅ | 64 tests |
| Tests | Unit tests | ❌ | |

The billing module has its own detailed breakdown and a plan to finish it: [Billing — what is missing](modules/billing.md#what-is-missing).

## Known issues

Confirmed problems, grouped by area. Pick one, open an issue if there is none yet, and follow the [contributing guide](../CONTRIBUTING.md).

### Billing

- Purchases are never saved: the repositories use relation names that do not exist in the Prisma schema (`User`, `SinglePurchaseProducts`, `SubscriptionPurchaseProducts`), and the webhook answers `500`.
- The payment confirmation e-mail is never sent (no listener for `checkout.session.completed.send.email`).
- Subscription status is never updated after the first payment.
- There is no idempotency for Stripe retries, no payment history and no Stripe customer id.
- Unknown product in checkout and invalid webhook signature return `500`.
- Billing e2e tests are placeholders and are not part of the suite.

### Auth

- Password recovery verifies the token with the refresh secret instead of the recovery secret.
- Invalid or expired tokens return `500` instead of `401` (refresh and recovery).
- `500` when verifying an account with no pending code, or signing in with an OTP that was never requested.
- Requesting a second OTP before using the first fails (unique `user_id`), and an OTP validated from the cache can be used a second time.
- Cache TTLs are written in seconds but `cache-manager` expects milliseconds.
- `/auth/sign-in-one-time-password` uses the wrong DTO.
- E-mail links are hard-coded to `http://example.com`.

### Security

- `POST /email/email-sender` is public: anyone can send e-mails through the configured SMTP account.
- `.env` is not in `.dockerignore`, so it is copied into the production image with every secret.
- No rate limiting on sign-in, verification, OTP and recovery routes.
- No security headers (for example `@fastify/helmet`).
- User enumeration through `forgot-password` (`404`) and `sign-up` (`409`).
- Refresh tokens cannot be revoked and are not rotated.

### E-mail

- Templates are read from `src/` at runtime, and the production image deletes `src/`, so every e-mail fails in production.
- Failed jobs are not retried or logged.
- Sender name hard-coded as `Seu Nome`.

### Infrastructure

- The dev, test and prod compose files share the project name `composes`: `make run_test_docker` deletes the development database, and the three environments overwrite the same image tag.
- The base image `node:22.14-bullseye-slim` runs on Debian 11, which is out of support: `apt-get` fails with `404`.
- `.devcontainer/devcontainer.json` references `../docker-compose.yml`, which does not exist.
- The `Makefile` calls `docker-compose`, which is missing on installations that only have the `docker compose` plugin.
- `src/config/prometheus.yml` targets `otel-collector-dev`, which only exists in the development stack.
- Redis host, tracing endpoint and CORS origins are hard-coded (see [Configuration](configuration.md#hard-coded-settings)).
- Hot reload does not work on Windows when the repository is on the Windows file system.

### Repository and tooling

- There is no license. `package.json` says `UNLICENSED`, which in practice forbids reuse and makes outside contributions legally unclear. The maintainers need to choose one (for example MIT, like NestJS) and add a `LICENSE` file.
- `pnpm run lint` fails: ESLint 9 does not read the legacy `.eslintrc.js`.
- Without a `.gitattributes`, Windows checkouts get CRLF line endings, which break the shell scripts and make Prettier flag every file.
- No CI: lint, build and tests are not run on pull requests.
- No unit tests, so `pnpm test` fails with `No tests found`.
- `package.json` still uses the old name `auth-boilerplate-nestjs`.
- `Injectable();` is called as a function instead of used as a decorator in `SignInOneTimePasswordUseCase` and `SendOneTimePasswordService`, and `UserRepository` has no `@Injectable()`.

### Products

- A `USER` trying to write gets `401` instead of `403`.
- Deleting a product deletes the purchase history for it (`onDelete: Cascade`).
- Duplicate `slug`/`price_id` on update returns `500`.

## Roadmap ideas

Not planned or prioritized yet. Open a discussion or an issue before starting one of these:

- **Finish billing** following the [suggested plan](modules/billing.md#suggested-plan-to-finish-the-flow).
- **SaaS building blocks:** organizations/tenants, members and invitations, plans and feature entitlements.
- **E-commerce building blocks:** cart, orders, stock, coupons, shipping and taxes.
- **User self-service:** profile, password change, account deletion and data export (LGPD/GDPR).
- **Operations:** `/health` endpoint, CI pipeline, provisioned Grafana dashboards, structured logs.
- **Developer experience:** unit test setup, working ESLint config, working dev container, running without Docker.
- **Internationalization** of e-mails and API messages.
