<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A modular and scalable boilerplate for building SaaS and e-commerce applications with NestJS.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

## Description

<p>
This repository provides a modular and scalable boilerplate designed to simplify the development of SaaS (Software as a Service) and e-commerce applications using NestJS. The project follows best practices such as modular architecture, dependency injection, and clean code principles.
</p>

### Features

- **Modular Clean Architecture**: Follows Clean Architecture and DDD, ensuring maintainability and scalability.

- **Loose Coupling**: Enables easy replacement of services without breaking the core system.

- **Authentication**: Includes JWT-based authentication and passwordless login.

- **RBAC & ABAC**: Supports Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) using CASL and Roles Guard.

- **Billing integration**: Supports Stripe for payments, designed to allow easy integration with other providers.

- **Queue processing**: Implements background job processing using BullMQ.

- **Docker support**: Runs efficiently in a containerized environment.

- **Testing**: Includes e2e testing strategies.

## Prerequisites

To run the project you need to have the following software installed:

- [node](https://nodejs.org) (version 22.11.0 or higher)
- [pnpm](https://pnpm.io) (version 9.12.3 or higher)

## Recommended

- [Docker](https://www.docker.com/) to ensure it works optimally

## Project setup

### Verify the .env.example file to configure your project.

```bash
$ pnpm install
```

## Compile and run the project

```bash
# watch mode
$ docker-compose up -d
```

## Activate Stripe WebHook Test

```bash
# webhook
$ stripe listen --forward-to http://localhost:8080/billing/webhook
```

## Run tests in Docker environment

```bash
# e2e tests
$ docker exec -it <container_id> pnpm run test:e2e
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
