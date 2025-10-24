import { db, users } from "@/lib/db"
import { tracer } from "@/lib/tracing"
import { SpanStatusCode } from "@opentelemetry/api"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  affinityR: number
  affinityG: number
  affinityB: number
}

export async function hashPassword(password: string): Promise<string> {
  const span = tracer.startSpan('auth.hashPassword')

  const rounds = 12
  const hashedPassword = await bcrypt.hash(password, rounds)

  span.setAttributes({
    'auth.hashing.rounds': rounds,
  })
  span.end()
  return hashedPassword
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const span = tracer.startSpan('auth.verifyPassword')
  const isValid = await bcrypt.compare(password, hashedPassword)
  span.setAttributes({
    'auth.verification.success': isValid,
  })
  span.end()
  return isValid
}

export function generateToken(userId: string): string {
  const span = tracer.startSpan('auth.generateToken')
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
  span.setAttributes({
    'auth.token.expiresIn': "7d",
  })
  span.end()
  return token
}

export function verifyToken(token: string): { userId: string } | null {
  const span = tracer.startSpan('auth.verifyToken')

  try {
    const result = jwt.verify(token, JWT_SECRET) as { userId: string }
    span.end()
    return result
  } catch {
    return null
  }
}

export async function createUser(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  affinityR?: number
  affinityG?: number
  affinityB?: number
}) {
  const hashedPassword = await hashPassword(data.password)

  const [user] = await db!
    .insert(users)
    .values({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      affinityR: data.affinityR ?? Math.floor(Math.random() * 256),
      affinityG: data.affinityG ?? Math.floor(Math.random() * 256),
      affinityB: data.affinityB ?? Math.floor(Math.random() * 256),
    })
    .returning()

  return user
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const span = tracer.startSpan('auth.authenticateUser', {
    attributes: {
      'auth.email': email,
    }
  })

  try {
    const querySpan = tracer.startSpan('auth.queryUser')
    const [user] = await db!.select().from(users).where(eq(users.email, email))

    querySpan.setAttributes({
      'db.result': user ? 'found' : 'not_found'
    })
    querySpan.end()

    if (!user || !(await verifyPassword(password, user.password))) {
      span.setAttributes({ 'auth.result': 'invalid_password' })
      span.end()
      return null
    }

    span.setAttributes({
      'auth.result': 'success',
      'user.id': user.id,
    })
    span.end()

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      affinityR: user.affinityR,
      affinityG: user.affinityG,
      affinityB: user.affinityB,
    }
  } catch (error) {
    span.recordException?.(error as Error)
    span.setStatus({ code: SpanStatusCode.ERROR })
    span.end()
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const span = tracer.startSpan('auth.getCurrentUser', {
    attributes: {
      'auth.method': 'jwt_cookie',
      'cache.used': false, // We'll actually implement caching later
    }
  })

  try {
    const cookieSpan = tracer.startSpan('auth.readCookie')
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    cookieSpan.end()

    if (!token) {
      span.setAttributes({ 'auth.result': 'no_token' })
      span.end()
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      span.setAttributes({ 'auth.result': 'invalid_token' })
      span.end()
      return null
    }

    const dbSpan = tracer.startSpan('auth.fetchUserFromDB', {
      attributes: {
        'user.id': payload.userId,
      }
    })

    const [user] = await db!.select().from(users).where(eq(users.id, payload.userId))

    dbSpan.setAttributes({
      'db.result': user ? 'found' : 'not_found'
    })
    dbSpan.end()

    if (!user) {
      span.setAttributes({ 'auth.result': 'user_not_found' })
      span.end()
      return null
    }

    span.setAttributes({
      'auth.result': 'success',
      'user.email': user.email
    })
    span.end()

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      affinityR: user.affinityR,
      affinityG: user.affinityG,
      affinityB: user.affinityB,
    }
  } catch (error) {
    span.recordException?.(error as Error);
    span.setStatus({ code: SpanStatusCode.ERROR })
    span.end()
    throw error
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
