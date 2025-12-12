# AGENTS.md - Quick Reference for Coding Agents

## Commands
- **Dev**: `pnpm dev` (http://localhost:3000)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **Tests**: No test suite configured
- **Database**: `pnpm db:migrate` (run migrations), `pnpm db:seed` (seed data)

## Code Style
- **TypeScript**: Strict mode enabled, no `any` types
- **Imports**: Use `@/*` path alias for all internal imports
- **Components**: Client components require `"use client"` directive at top
- **Naming**: camelCase for functions/variables, PascalCase for components/types
- **Error handling**: Try-catch with console.warn/error, fallback to mock data when DB unavailable
- **API routes**: Return `NextResponse.json()` with proper HTTP status codes
- **Async/await**: Always use for database queries and API calls
- **Types**: Define interfaces for all data structures (User, Product, Category, etc.)
- **Database**: Use Drizzle ORM with proper imports from `@/lib/db`
- **Auth**: JWT tokens in HTTP-only cookies via `auth-token`, never in localStorage
- **Forms**: Use react-hook-form with Zod validation via @hookform/resolvers
- **Toast notifications**: Use `toast()` from sonner for user feedback
- **Icons**: Use Lucide icons (`lucide-react`), store icon names as strings in DB
- **Tracing**: Wrap operations in OpenTelemetry spans for observability
