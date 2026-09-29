# Documentation

## Using the project

- [Getting started](getting-started.md): run the stack with Docker, the dev/test/prod environments and everyday commands.
- [Configuration](configuration.md): every environment variable, and the settings that are still hard-coded.
- [API reference](api-reference.md): all routes with their access rules. The interactive version is at `/docs` (Swagger).
- [Troubleshooting](troubleshooting.md): known errors and how to solve them.

## Understanding the code

- [Architecture](architecture.md): design principles, layers, dependency injection, request lifecycle and how to add a module.
- [Database](database.md): data model, migrations and seed.
- Modules:
  - [Auth](modules/auth.md): sign-up, verification, sign-in flows, tokens and password recovery.
  - [Products](modules/products.md): single and subscription catalogs and their permissions.
  - [Billing](modules/billing.md): the Stripe payment flow, what is missing and a plan to finish it.
  - [Email](modules/email.md): the e-mail queue and templates.
- [Observability](observability.md): traces, metrics and Grafana.
- [Testing](testing.md): how the e2e suite is organized and how to extend it.

## Contributing

- [Contributing guide](../CONTRIBUTING.md): workflow, conventions and pull request checklist.
- [Project status & roadmap](project-status.md): what is done, what is unfinished and the known issues.
