import { trace } from "@opentelemetry/api"

const tracer = trace.getTracer('elite-store')

export { tracer }
