import { NextResponse } from "next/server"
import { getGoogleAuthURL } from "@/lib/utils/google-oauth"

export async function GET() {
  try {
    const url = getGoogleAuthURL()
    return NextResponse.json({ url })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate Google auth URL" }, { status: 500 })
  }
}
