import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import OTP from "@/lib/models/OTP"
import { hashPassword, validatePassword } from "@/lib/utils/password"

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Email, OTP, and new password are required" }, { status: 400 })
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
    }

    await connectDB()

    // Verify OTP
    const otpDoc = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      type: "password-reset",
      expiresAt: { $gt: new Date() },
    })

    if (!otpDoc) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update user password
    await User.findOneAndUpdate({ email: email.toLowerCase() }, { password: hashedPassword })

    // Delete used OTP
    await OTP.deleteOne({ _id: otpDoc._id })

    return NextResponse.json({
      message: "Password reset successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
