# Configuration

The application reads its configuration from environment variables. With Docker, they come from the `.env` file at the project root (`env_file` in the compose files). Inside the code, use `EnvService` (`src/common/modules/services/env.service.ts`) instead of reading `process.env` directly.

Start from the template:

```bash
cp .env.example .env
```

Docker Compose interpolates `${VAR}` references inside `.env`, which is how `DATABASE_URL` reuses the Postgres credentials.

## Environment variables

"Checked" means the variable is validated by `shell/check_env_vars.sh`, which runs before every `make` target.

### Database

| Variable | Checked | Description |
| --- | --- | --- |
| `POSTGRES_USER` | yes | User created by the Postgres container. |
| `POSTGRES_PASSWORD` | yes | Password of that user. |
| `POSTGRES_DB` | yes | Database created by the Postgres container. |
| `DATABASE_URL` | yes | Prisma connection string. Inside Docker the host is the service name `postgres`. The `schema` query parameter selects the Postgres schema (`my_schema` in the template). |

### Tokens and encryption

| Variable | Checked | Description |
| --- | --- | --- |
| `SECRET_ACCESS_TOKEN_KEY` | yes | Signs access tokens (valid for 30 minutes). |
| `SECRET_REFRESH_TOKEN_KEY` | yes | Signs refresh tokens (valid for 7 days). |
| `SECRET_RECOVERY_PASSWORD_TOKEN_KEY` | yes | Signs password recovery tokens. **Known bug:** the recovery endpoint verifies these tokens with `SECRET_REFRESH_TOKEN_KEY`, so password recovery only works when both secrets have the same value. See [Auth](modules/auth.md#known-limitations). |
| `ENCRYPT_PASSWORD` | yes | Password used to derive (with scrypt) the AES-256 key that encrypts the JWT claims. |
| `ENCRYPT_SALT` | yes | Salt for that key derivation. |

Changing any of these values invalidates every token already issued.

### Ports

| Variable | Checked | Description |
| --- | --- | --- |
| `PORT_API` | yes | Port the API listens on inside the container. Keep `3003`: `nginx.conf`, `src/config/prometheus.yml` and `src/config/otel-collector-config.yml` point to `api:3003`. |
| `MAPPED_PORT_NGINX` | yes | Host port for Nginx, the public entry point of the API. |
| `MAPPED_PORT_DB` | no | Host port for Postgres. It is published by every compose file, so it must be set to a valid, free port. |
| `MAPPED_PORT_JAEGER_UI` | yes | Host port for the Jaeger UI. |
| `MAPPED_PORT_GRAFANA_UI` | yes | Host port for Grafana. |
| `MAPPED_PORT_API` | no | Only used if you uncomment the `ports` section of the `api` service. |
| `MAPPED_PORT_REDIS` | no | Only used if you uncomment the `ports` section of the `redis` service. |
| `MAPPED_PORT_PROMETHEUS_UI` | no | Only used if you uncomment the `ports` section of the `prometheus` service. |

### E-mail (SMTP)

| Variable | Checked | Description |
| --- | --- | --- |
| `EMAIL_HOST` | yes | SMTP host. |
| `EMAIL_PORT` | yes | SMTP port (number). |
| `EMAIL_USER` | yes | SMTP user. |
| `EMAIL_PASSWORD` | yes | SMTP password. |
| `EMAIL_FROM` | yes | Sender address. The sender display name is hard-coded as `Seu Nome` in `email_sender.services.ts`. |

For local development you can use a fake SMTP service such as [Mailpit](https://mailpit.axllent.org/) or [Ethereal](https://ethereal.email/). E-mails are sent by a background job, so a wrong SMTP configuration does not break the HTTP requests. Look at the [Email module](modules/email.md#troubleshooting) to inspect failed jobs.

### Stripe

| Variable | Checked | Description |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | yes | Stripe secret key (`sk_test_...` in development). |
| `STRIPE_WEBHOOK_SECRET` | yes | Signing secret of the webhook endpoint (`whsec_...`). With the Stripe CLI, it is printed by `stripe listen`. |
| `STRIPE_SUCCESS_URL` | no | Where Stripe Checkout redirects the customer after a successful payment. |
| `STRIPE_CANCEL_URL` | no | Where Stripe Checkout redirects the customer when they cancel. |

### Tooling

| Variable | Checked | Description |
| --- | --- | --- |
| `ENVIRONMENT` | yes | Only read by `shell/run-docker.sh` to choose between the development (`dev`/`development`) and production (`prod`/`production`) stacks. The application does not read it. |

## Hard-coded settings

Some settings are still in the source code. They are good candidates for new environment variables.

| Setting | Value | Where |
| --- | --- | --- |
| Redis connection (BullMQ) | `redis:6379` | `src/app.module.ts` |
| OTLP trace exporter | `http://jaeger:4317` | `src/config/tracing.ts` |
| CORS allowed origins | `localhost:3000`, `localhost:8080`, `localhost:3003` | `src/config/cors.config.ts` |
| Access / refresh token lifetime | 30 minutes / 7 days | `src/modules/auth/auth.module.ts`, `generate_token.helper.ts` |
| Request body limit | 10 MB | `src/main.ts`, `nginx.conf` |
| Links sent in e-mails | `http://example.com/...` | auth use cases and services |
| E-mail language | `pt_br` | auth use cases and services |
| Cache store | in-memory (not Redis) | `src/app.module.ts` |
| Swagger path | `/docs` | `src/config/swagger.config.ts` |

## Configuration files

| File | Purpose |
| --- | --- |
| `nginx.conf` | Reverse proxy from port 80 to `api:3003`. |
| `src/config/prometheus.yml` | Prometheus scrape targets. |
| `src/config/otel-collector-config.yml` | OpenTelemetry collector pipelines. |
| `src/config/tracing.ts` | OpenTelemetry SDK bootstrap (imported first in `main.ts`). |
| `src/config/swagger.config.ts` | Swagger document and tags. |
| `src/config/cors.config.ts` | CORS policy. |
| `src/config/render_page.config.ts` | Static assets (`public/`) and Handlebars views (`views/`). |
