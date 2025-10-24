import { registerOTel } from '@vercel/otel'

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      registerOTel({
        serviceName: process.env.OTEL_SERVICE_NAME || 'elite-store',
      })
    } catch (error) {
      console.error('❌ Failed to initialize OpenTelemetry:', error)
    }
  }
}