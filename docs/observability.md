# Observability

Every Docker environment starts Jaeger, an OpenTelemetry Collector, Prometheus and Grafana next to the API.

| Service | Container (dev) | Host access |
| --- | --- | --- |
| Jaeger UI | `jaeger-dev` | `http://localhost:<MAPPED_PORT_JAEGER_UI>` |
| Grafana | `grafana-dev` | `http://localhost:<MAPPED_PORT_GRAFANA_UI>` (default login `admin` / `admin`) |
| Prometheus | `prometheus-dev` | not published (uncomment `ports` to use `MAPPED_PORT_PROMETHEUS_UI`) |
| OpenTelemetry Collector | `otel-collector-dev` | not published |

## Traces

`src/config/tracing.ts` is the first import of `main.ts`. It starts the OpenTelemetry Node SDK with:

- the automatic instrumentations for Node.js (HTTP, Fastify, ioredis and others). Requests to `/health`, `/metrics` and `/favicon.ico` are ignored;
- `PrismaInstrumentation`, which creates spans for every query;
- an OTLP gRPC exporter that sends the spans **directly to Jaeger** (`http://jaeger:4317`), with the service name `api-service`.

Open the Jaeger UI and search for the `api-service` service to see the traces.

## Metrics

- The API exposes the default `prom-client` metrics (process, heap, event loop, GC) at `GET /metrics`, which is public. `PrometheusModule` also registers `/app/metrics`, but the global JWT guard protects it, so it answers `401` without a token.
- Prometheus (`src/config/prometheus.yml`) scrapes `api:3003/metrics` every 10 seconds, and the collector's Prometheus exporter at `otel-collector-dev:8889`.
- The collector (`src/config/otel-collector-config.yml`) also scrapes `api:3003` every 60 seconds and accepts OTLP on ports 4317/4318, but the API does not send anything to it today.

There are no custom business metrics yet (sign-ups, payments, queue size).

## Grafana

Grafana starts empty. To explore the data:

1. sign in with `admin` / `admin` and change the password;
2. add a Prometheus data source with the URL `http://prometheus:9090`;
3. optionally, add a Jaeger data source with the URL `http://jaeger:16686`;
4. import a Node.js dashboard or build your own.

Data sources and dashboards are not provisioned from files yet, so they live only in the `grafana_data` volume.

## Known limitations

- `prometheus.yml` points to `otel-collector-dev:8889`, a container name that only exists in the development stack. In the test and production stacks that target is down.
- The collector is not in the trace path (the API exports to Jaeger directly), so its pipelines are unused for traces.
- Grafana has no provisioned data sources or dashboards.
- Logs are plain `console`/Nest logger output with no correlation with traces.
- The tracing endpoint and service name are hard-coded.
