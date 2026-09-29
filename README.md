<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">SaaS and E-commerce Boilerplate (NestJS)</h1>

<p align="center">A modular and scalable boilerplate for building SaaS and e-commerce back-ends with NestJS.</p>

## About

This project was born from the need for advanced open source content in the SaaS and e-commerce space. Its goal is to give new back-end projects a solid starting point: authentication, access control, a product catalog, payments, transactional e-mails and observability, all organized with Clean Architecture and DDD so that each piece can be replaced without touching the core.

> **Project status:** the project is under active development. Authentication, access control and the product catalog work end to end. The **payment flow is only partially implemented** (checkout works, but purchases are not persisted yet). See [Project status & roadmap](docs/project-status.md) before using it in production.

## Features

| Feature | Status |
| --- | --- |
| Clean Architecture + DDD modules with dependency inversion | ✅ |
| JWT authentication (access + refresh tokens) with encrypted claims | ✅ |
| Password-less sign-up, magic link and one-time password (OTP) sign-in | ✅ |
| Account verification and password recovery by e-mail | ⚠️ recovery has a known bug |
| RBAC (`@Roles`) and ABAC (CASL) | ✅ |
| Product catalog (single purchase and subscription products) | ✅ |
| Stripe Checkout (one-time and subscription) | 🚧 partial |
| Transactional e-mails through a BullMQ queue | ✅ (dev) / ⚠️ (prod image) |
| Observability: OpenTelemetry + Jaeger, Prometheus, Grafana | 🚧 partial |
| Nginx reverse proxy | ✅ |
| Docker environments for development, tests and production | ✅ |
| End-to-end tests | ✅ auth, products, root / ❌ billing |

## Tech stack

NestJS 10 (Fastify) · TypeScript · Prisma 6 + PostgreSQL 16 · Redis 7 + BullMQ · Passport (JWT/local) · CASL · Stripe · Nodemailer · OpenTelemetry · Jaeger · Prometheus · Grafana · Nginx · Jest + Supertest · Docker Compose · pnpm 10

## Quick start

Requirements: [Docker](https://www.docker.com/) with Docker Compose v2 and `make` (optional).

```bash
git clone https://github.com/FabriquetaDeSoftware/saas-and-ecommerce-boilerplate-nestjs.git
cd saas-and-ecommerce-boilerplate-nestjs

cp .env.example .env   # then fill in the values, see docs/configuration.md

make run_development_docker
```

Then open `http://localhost:<MAPPED_PORT_NGINX>/docs` to explore the API with Swagger.

The full guide, including the test and production environments, is in [Getting started](docs/getting-started.md).

## Documentation

| Document | What you will find |
| --- | --- |
| [Getting started](docs/getting-started.md) | Running the project with Docker, environments, useful commands |
| [Configuration](docs/configuration.md) | Every environment variable and hard-coded setting |
| [Architecture](docs/architecture.md) | Layers, modules, dependency injection, request lifecycle |
| [API reference](docs/api-reference.md) | All HTTP endpoints at a glance |
| [Database](docs/database.md) | Data model, migrations and seed |
| [Auth module](docs/modules/auth.md) | Sign-up, sign-in flows, tokens |
| [Products module](docs/modules/products.md) | Catalog and permissions |
| [Billing module](docs/modules/billing.md) | Stripe payment flow and what is missing |
| [Email module](docs/modules/email.md) | Queue, templates and how to add new ones |
| [Observability](docs/observability.md) | Tracing, metrics and dashboards |
| [Testing](docs/testing.md) | How the e2e suite works and how to extend it |
| [Troubleshooting](docs/troubleshooting.md) | Common errors and how to fix them |
| [Project status & roadmap](docs/project-status.md) | What is done, what is unfinished and known issues |

## Contributing

Contributions are welcome! Read the [contributing guide](CONTRIBUTING.md) to learn how to set up the project, the code conventions and how to open a pull request. You can also join the community on [Discord](https://discord.gg/W6sKEvXvtv).

## License

This project is licensed under the [MIT License](LICENSE).
