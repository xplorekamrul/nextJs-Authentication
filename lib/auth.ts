import { getAuthCookie } from "./utils/cookies"
import { verifyToken } from "./utils/jwt"
import connectDB from "./db"
import User, { type IUser } from "./models/User"

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const token = getAuthCookie()
    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    await connectDB()
    const user = await User.findById(payload.userId).select("-password")
    return user
  } catch (error) {
    return null
  }
}

export async function requireAuth(): Promise<IUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export function hasRole(user: IUser, roles: string[]): boolean {
  return roles.includes(user.role)
}
