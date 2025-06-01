import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { comparePassword } from "@/lib/utils/password"
import { generateToken } from "@/lib/utils/jwt"
import { setAuthCookie } from "@/lib/utils/cookies"

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json({ error: "Email/phone and password are required" }, { status: 400 })
    }

    await connectDB()

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json({ error: "Please verify your account first" }, { status: 401 })
    }

    // Check password (skip for Google users)
    if (user.password) {
      const isValidPassword = await comparePassword(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
    } else {
      return NextResponse.json({ error: "Please sign in with Google" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken(user)
    setAuthCookie(token)

    return NextResponse.json({
      message: "Sign in successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
