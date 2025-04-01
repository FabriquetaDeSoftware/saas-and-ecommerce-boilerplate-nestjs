import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { PrismaInstrumentation } from '@prisma/instrumentation'; // <-- Novo

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const instrumentations = [
  getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-http': {
      ignoreIncomingRequestHook: (request) => {
        const ignoredPaths = ['/health', '/metrics', '/favicon.ico'];
        return ignoredPaths.some((path) => request.url?.includes(path));
      },
    },
  }),
  new PrismaInstrumentation(),
];

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://jaeger:4317',
  }),
  serviceName: 'api-service',
  instrumentations,
});

try {
  sdk.start();
  console.log('OpenTelemetry started with Prisma instrumentation');
} catch (err) {
  console.error('Error starting OpenTelemetry', err);
}

process.on('SIGTERM', async () => {
  await sdk.shutdown();
  console.log('OpenTelemetry closed');
  process.exit(0);
});
