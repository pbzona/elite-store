import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateToken } from "@/lib/auth"
import { db, users } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email))

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
    })

    const token = generateToken(user.id)
    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      affinityR: user.affinityR,
      affinityG: user.affinityG,
      affinityB: user.affinityB,
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
