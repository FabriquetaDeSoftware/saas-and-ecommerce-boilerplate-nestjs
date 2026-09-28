# Testing

The project has an end-to-end (e2e) suite written with Jest and Supertest. It boots the whole `AppModule` and talks to a real Postgres and Redis, so it runs inside the test Docker environment.

## Running the e2e suite

```bash
# 1. Start the test stack with an empty database
make run_test_docker

# 2. Wait until the API has started
docker logs -f api-test   # "Nest application successfully started"

# 3. Seed the database and run the suite
docker exec api-test pnpm run seed
docker exec api-test pnpm run test:e2e
```

Expected result: `Tests: 64 passed, 64 total`.

The suite changes the database (it creates users and products), so it can only run once per fresh database. To run it again without recreating the stack:

```bash
docker exec api-test pnpm exec prisma migrate reset --force   # drops the data, reapplies the migrations and runs the seed
docker exec api-test pnpm run test:e2e
```

> `make run_test_docker` starts with `docker compose down -v`. Because the compose files share the project name, this also deletes the development volumes. See [Getting started](getting-started.md#environments).

## How the suite is organized

```text
test/
├── jest-e2e.json          # Jest config: only runs index.e2e-spec.ts
├── index.e2e-spec.ts      # imports every case file, in order
├── cases/
│   ├── auth/              # sign-up, verification, sign-in flows, refresh, recovery
│   ├── root/              # /protected, /user, /admin
│   ├── products/          # create, update, list, show, delete
│   └── billing/           # placeholders, not imported yet
└── mocks/data/            # objects shared between the case files
```

- **Order matters.** Jest only runs `index.e2e-spec.ts`, which imports the case files in sequence. Later files depend on data created by earlier ones: sign-up stores the user and verification code, sign-in stores the tokens, product creation stores the products used by update, list, show and delete.
- **Shared state** lives in the objects exported by `test/mocks/data/` (`userSignupDefaultData`, `tokensReturns`, `productSingleData`, ...). A case file writes to them and the next ones read from them.
- **Spies instead of inboxes.** Codes, OTPs and tokens sent by e-mail are captured with `jest.spyOn` on the helpers that generate them (`IGenerateNumberCodeUtil`, `IGenerateTokenHelper`).
- **Seed users** (see [Database](database.md#seed)) cover the admin, expired code and unverified account scenarios.
- Each case file creates its own Nest application. Most of them register the same global `ValidationPipe` as `main.ts`, but some do not (for example `sign-in-default` and `verify-account`), so validation errors behave differently there. The test apps use Nest's default HTTP adapter (Express), while production uses Fastify.
- E-mails are only queued. A fake SMTP configuration does not fail the tests.

## Writing a new e2e test

1. Create `test/cases/<module>/<scenario>.e2e-spec.ts`. Copy the `beforeAll`/`afterAll` structure of an existing file.
2. Import it in `test/index.e2e-spec.ts` after the files that create the data it needs.
3. Put data that other files need in `test/mocks/data/`.
4. Cover the success case, validation errors (`400`) and access control (`401`/`403`) at least.
5. Run the whole suite on a fresh database before opening the pull request.

## Unit tests

`pnpm test` is configured (Jest looks for `src/**/*.spec.ts`), but there are no unit tests yet, so the command exits with `No tests found`. Unit tests for use cases, with the repositories mocked through their interfaces, are very welcome.

## Known gaps

- Billing has no tests (`test/cases/billing/` holds placeholders and an empty file).
- Some tests assert the current `500` responses for invalid tokens, with a note that they should become `401`. Update them when the behavior is fixed.
- The suite is not run by any CI pipeline yet.
