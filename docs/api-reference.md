# API reference

The interactive documentation (Swagger UI) is served at `/docs`. This page is a quick map of every route and its access rules.

- **Base URL (Docker):** `http://localhost:<MAPPED_PORT_NGINX>`
- **Authentication:** `Authorization: Bearer <access_token>`, obtained from one of the sign-in endpoints.
- **Access column:** *Public* = no token needed; *Authenticated* = any valid access token; a role name = the token must belong to a user with that role.
- **Errors** follow the NestJS format: `{ "statusCode": 400, "message": "...", "error": "Bad Request" }`.

## App

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/` | Public | Landing page (Handlebars view). |
| GET | `/protected` | Authenticated | Sample route for any authenticated user. |
| GET | `/user` | `USER` | Sample route for the `USER` role. |
| GET | `/admin` | `ADMIN` | Sample route for the `ADMIN` role. |
| GET | `/metrics` | Public | Prometheus metrics (`prom-client` default registry). |
| GET | `/app/metrics` | Authenticated | Same metrics, registered by `PrometheusModule`. |
| GET | `/docs` | Public | Swagger UI. |

## Auth — [details](modules/auth.md)

| Method | Path | Access | Body | Success |
| --- | --- | --- | --- | --- |
| POST | `/auth/sign-up-default` | Public | `name`, `email`, `password`, `terms_and_conditions_accepted`, `newsletter_subscription?` | `201` user |
| POST | `/auth/sign-up-password-less` | Public | `name`, `email`, `terms_and_conditions_accepted`, `newsletter_subscription?` | `201` user |
| POST | `/auth/verify-account` | Public | `email`, `code` (6-digit number) | `200` message |
| POST | `/auth/sign-in-default` | Public | `email`, `password` | `200` tokens |
| POST | `/auth/sign-in-magic-link` | Public | `email` | `200` message (link sent by e-mail) |
| POST | `/auth/send-one-time-password` | Public | `email` | `200` message (OTP sent by e-mail) |
| POST | `/auth/sign-in-one-time-password` | Public | `email`, `password` (the OTP) | `200` tokens |
| POST | `/auth/refresh-token` | Public | `refresh_token` | `200` tokens |
| POST | `/auth/forgot-password` | Public | `email` | `200` message (link sent by e-mail) |
| POST | `/auth/recovery-password?token=<token>` | Public | `password` | `200` message |

"Tokens" means `{ "access_token": "...", "refresh_token": "..." }`.

## Products — [details](modules/products.md)

`:type` is `single` or `subscription`.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/products/create/:type` | `ADMIN` (see note) | Create a product. `201` product. |
| PATCH | `/products/update/:type/:public_id` | `ADMIN` (see note) | Update a product. `200` product. |
| DELETE | `/products/delete/:type/:public_id` | `ADMIN` (see note) | Delete a product. `204`. |
| GET | `/products/list-many/:type?page=1&pageSize=10` | Public | Paginated list. |
| GET | `/products/show-one/:type/:slug` | Public | Product by slug. |

Note: the write routes accept the `ADMIN` and `USER` roles at the RBAC level, and the CASL check inside the use case rejects `USER` with `401 Unauthorized to perform this action`.

## Billing — [details](modules/billing.md)

| Method | Path | Access | Body | Success |
| --- | --- | --- | --- | --- |
| POST | `/billing/payment/one-time` | Authenticated | `public_id` of a `single` product | `303` `{ "url": "<Stripe Checkout URL>" }` |
| POST | `/billing/payment/subscription` | Authenticated | `public_id` of a `subscription` product | `303` `{ "url": "<Stripe Checkout URL>" }` |
| POST | `/billing/webhook` | Public (Stripe signature) | raw Stripe event, `stripe-signature` header | `201` |

## Email — [details](modules/email.md)

| Method | Path | Access | Body | Success |
| --- | --- | --- | --- | --- |
| POST | `/email/email-sender` | Public ⚠️ | `emailTo`, `subject`, `language`, `template`, `variables?` | `201` message |

⚠️ This route is public, so anyone can send e-mails through your SMTP account. Protect or remove it before deploying (see [Project status](project-status.md#security)).
