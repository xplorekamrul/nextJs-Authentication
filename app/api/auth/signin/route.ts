import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { comparePassword } from "@/lib/utils/password"
import { generateToken } from "@/lib/utils/jwt"
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/utils/cookies"

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json({ error: "Email/phone and password are required" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: "Please verify your account first" }, { status: 401 })
    }

    if (user.password) {
      const isValidPassword = await comparePassword(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
    } else {
      return NextResponse.json({ error: "Please sign in with Google" }, { status: 401 })
    }

    const token = generateToken(user)

    // ✅ Create response and set cookie
    const res = NextResponse.json({
      message: "Sign in successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)

    return res
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
