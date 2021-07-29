'use strict';

const { NodeTracerProvider } = require('@opentelemetry/node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { GrpcInstrumentation } = require('@opentelemetry/instrumentation-grpc');

const { Resource } = require('@opentelemetry/resources');
const { ResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { MongoDBInstrumentation } = require('@opentelemetry/instrumentation-mongodb');
const { RedisInstrumentation } = require('@opentelemetry/instrumentation-redis');
const CustomSpanProcessor = require('./CustomSpanProcessor');

const config = require('./config.json');

const exporter = new ZipkinExporter({
  url: `${config.endpoint}/spans`
})

const provider = new NodeTracerProvider({
  resource: new Resource({
    [ResourceAttributes.SERVICE_NAME]: config.serviceName,
  }),
});

provider.addSpanProcessor(
  new CustomSpanProcessor(exporter, {
    maxQueueSize: 6000, 
    maxExportBatchSize: 5120, 
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30000
  })
);

provider.register();

let dbOptions = config.dbOptions;

let options = [
  new HttpInstrumentation(),
  new GrpcInstrumentation(),
]

for (let prop in dbOptions) {
  if (prop === "mongodb" && dbOptions[prop]) options.push(new MongoDBInstrumentation());
  if (prop === "redis" && dbOptions[prop]) options.push(new RedisInstrumentation());
}

registerInstrumentations({
  instrumentations: options,
});