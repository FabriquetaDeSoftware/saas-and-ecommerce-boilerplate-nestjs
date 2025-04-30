<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A modular and scalable boilerplate for building SaaS and e-commerce applications with NestJS.
</p>

## Table of Contents

- [Description](#description)
- [Patterns](#patterns)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Recommended](#recommended)
- [Project setup](#project-setup)
- [License](#license)

## Description

This repository provides a modular and scalable boilerplate designed to simplify the development of SaaS (Software as a Service) and e-commerce applications using NestJS.

This project was born from the need to have advanced open source content in the area today. Its purpose is to facilitate the development of new back-end projects in the area of ​​e-commerce and SaaS.

The project follows best practices such as modular architecture, dependency injection, and clean code principles.

Welcome to open issues and and improvements on code-base. You are invited to contribute to the code base

### Following the Patterns

- **Clean Code**: The project follows Clean Code principles, ensuring that the code is clear, concise, and easy to maintain. Keeping the design simple helps with the project's evolution and facilitates collaboration among developers, making it easier to make changes and add new features without impacting other parts of the system.

- **Clean Architecture**: The separation of responsibilities across the layers of the system ensures that business logic and implementation details (such as the database and APIs) are decoupled. This makes it easier to replace components without affecting the core of the application, while also improving testability and scalability over time.

- **Solid**: Applying SOLID principles results in more modular and flexible code. The use of abstractions and clearly defined responsibilities for each component makes the system easier to understand, test, and extend, minimizing side effects when adding new features. In particular, the use of the Dependency Inversion Principle enhances dependency injection, allowing easy replacement of services without changing core code.

- **DDD**: Using DDD helps to model the business domain more accurately, creating a common language between developers and business experts. Dividing the system into bounded contexts allows different parts of the system to evolve independently, reflecting the real complexities of the domain. This results in a codebase that is more aligned with business needs and easier to maintain as the project grows.

### Features

- **Modular Clean Architecture**: Follows Clean Architecture and DDD, ensuring maintainability and scalability.

- **Loose Coupling**: Enables easy replacement of services without breaking the core system.

- **Authentication**: Includes JWT-based authentication and passwordless login.

- **Reverse Proxy**: Include reverse proxy with Ngnix configuration

- **RBAC & ABAC**: Supports Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) using CASL and Roles Guard.

- **Billing integration**: Supports Stripe for payments, designed to allow easy integration with other providers.

- **Queue processing**: Implements background job processing using BullMQ.

- **Docker support**: Runs efficiently in a containerized environment.

- **Testing**: Includes e2e testing strategies.

- **Environment**: Includes prod and dev environment, choose in the `.env`

## Prerequisites

To run the project you need to have the following software installed:

- [node](https://nodejs.org) (version 22.11.0 or higher)
- [pnpm](https://pnpm.io) (version 9.12.3 or higher)

## Recommended

- [Docker](https://www.docker.com/) to ensure it works optimally

## Project Setup

### Verify the .env.example file to configure your project.

```bash
$ pnpm install
```

### Compile and Run the Project

#### Permission to Execute the Shell Script and Run Project

```bash
# enable shell script and run docker
$ make run_docker
```

### Atention

```bash
# if received chmod +x shell/check_env_vars.sh
chmod +x shell/run-docker.sh
./shell/run-docker.sh
make: ./shell/run-docker.sh: No such file or directory
make: *** [Makefile:4: run_docker] Error 127

# run
$ sed -i 's/\r$//' ./shell/check_env_vars.sh
$ sed -i 's/\r$//' ./shell/run-docker.sh
```

### Activate Stripe WebHook Test

```bash
# webhook
$ stripe listen --forward-to http://localhost:<MAPPED_PORT_NGINX>/billing/webhook
```

### Run tests in Docker environment

```bash
# e2e tests
$ docker exec -it <container_id> pnpm run test:e2e
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
