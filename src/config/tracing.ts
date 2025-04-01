import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://jaeger:4317',
  }),
  serviceName: 'api-service',
  instrumentations: [getNodeAutoInstrumentations()],
});

try {
  sdk.start();
  console.log('OpenTelemetry started');
} catch (err) {
  console.error('Erro ao iniciar OpenTelemetry', err);
}

process.on('SIGTERM', async () => {
  await sdk.shutdown();
  console.log('OpenTelemetry closed');
  process.exit(0);
});
