import { NextResponse } from "next/server"
import { deleteAuthCookie } from "@/lib/utils/cookies"

export async function POST() {
  try {
    deleteAuthCookie()
    return NextResponse.json({ message: "Signed out successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 })
  }
}
