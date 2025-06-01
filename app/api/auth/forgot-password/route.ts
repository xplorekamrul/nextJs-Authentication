import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import OTP from "@/lib/models/OTP"
import { generateOTP, sendOTPEmail } from "@/lib/utils/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await connectDB()

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: "User with this email does not exist" }, { status: 404 })
    }

    // Generate and send OTP
    const otp = generateOTP()

    // Delete any existing password reset OTPs
    await OTP.deleteMany({ email: email.toLowerCase(), type: "password-reset" })

    // Save new OTP
    const otpDoc = new OTP({
      email: email.toLowerCase(),
      otp,
      type: "password-reset",
    })
    await otpDoc.save()

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, "password-reset")

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Password reset code sent to your email",
      email: email.toLowerCase(),
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
