import { registerOTel } from '@vercel/otel'

export function register() {
  console.log('🚀 Register function called! Runtime:', process.env.NEXT_RUNTIME)

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('🔧 Initializing OpenTelemetry...')
    console.log('📡 Endpoint:', process.env.OTEL_EXPORTER_OTLP_ENDPOINT)
    console.log('🏷️  Service:', process.env.OTEL_SERVICE_NAME)
    console.log('🔑 Headers:', process.env.OTEL_EXPORTER_OTLP_HEADERS?.substring(0, 50) + '...')
    console.log('📋 Protocol:', process.env.OTEL_EXPORTER_OTLP_PROTOCOL)

    try {
      registerOTel({
        serviceName: process.env.OTEL_SERVICE_NAME || 'elite-store',
      })
      console.log('✅ OpenTelemetry initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize OpenTelemetry:', error)
    }
  }
}