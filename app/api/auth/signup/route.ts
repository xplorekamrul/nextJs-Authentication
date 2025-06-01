import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import OTP from "@/lib/models/OTP"
import { hashPassword, validatePassword } from "@/lib/utils/password"
import { normalizePhoneNumber, validatePhoneNumber } from "@/lib/utils/phone"
import { generateOTP, sendOTPEmail } from "@/lib/utils/email"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, country, password } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !country || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone, country)
    if (!validatePhoneNumber(normalizedPhone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone: normalizedPhone }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or phone already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user (unverified)
    const user = new User({
      name,
      email: email.toLowerCase(),
      phone: normalizedPhone,
      country,
      password: hashedPassword,
      isVerified: false,
    })

    await user.save()

    // Generate and send OTP
    const otp = generateOTP()

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase(), type: "signup" })

    // Save new OTP
    const otpDoc = new OTP({
      email: email.toLowerCase(),
      otp,
      type: "signup",
    })
    await otpDoc.save()

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, "signup")

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({
      message: "User created successfully. Please check your email for verification code.",
      email: email.toLowerCase(),
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
