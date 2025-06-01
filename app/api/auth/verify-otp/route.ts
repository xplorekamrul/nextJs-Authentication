import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import OTP from "@/lib/models/OTP"
import { generateToken } from "@/lib/utils/jwt"
import { setAuthCookie } from "@/lib/utils/cookies"

export async function POST(request: NextRequest) {
  try {
    const { email, otp, type } = await request.json()

    if (!email || !otp || !type) {
      return NextResponse.json({ error: "Email, OTP, and type are required" }, { status: 400 })
    }

    await connectDB()

    // Find and verify OTP
    const otpDoc = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      type,
      expiresAt: { $gt: new Date() },
    })

    if (!otpDoc) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    if (type === "signup") {
      // Verify user account
      const user = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { isVerified: true },
        { new: true },
      ).select("-password")

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Generate JWT token
      const token = generateToken(user)
      setAuthCookie(token)

      // Delete used OTP
      await OTP.deleteOne({ _id: otpDoc._id })

      return NextResponse.json({
        message: "Account verified successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } else if (type === "password-reset") {
      // Just verify OTP for password reset
      return NextResponse.json({
        message: "OTP verified successfully",
        email: email.toLowerCase(),
      })
    }
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
