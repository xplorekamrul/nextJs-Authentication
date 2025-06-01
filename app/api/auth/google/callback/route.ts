import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { getGoogleUser } from "@/lib/utils/google-oauth"
import { generateToken } from "@/lib/utils/jwt"
import { setAuthCookie } from "@/lib/utils/cookies"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.redirect(new URL("/signin?error=google_auth_failed", request.url))
    }

    // Get user info from Google
    const googleUser = await getGoogleUser(code)

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/signin?error=google_auth_failed", request.url))
    }

    await connectDB()

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email.toLowerCase() })

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleUser.id
        user.isVerified = true
        await user.save()
      }
    } else {
      // Create new user
      user = new User({
        name: googleUser.name,
        email: googleUser.email.toLowerCase(),
        phone: `+1${Date.now()}`, // Temporary phone, user can update later
        country: "US", // Default country, user can update later
        googleId: googleUser.id,
        avatar: googleUser.picture,
        isVerified: true,
      })
      await user.save()
    }

    // Generate JWT token
    const token = generateToken(user)
    setAuthCookie(token)

    return NextResponse.redirect(new URL("/home", request.url))
  } catch (error) {
    console.error("Google callback error:", error)
    return NextResponse.redirect(new URL("/signin?error=google_auth_failed", request.url))
  }
}
