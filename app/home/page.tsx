import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin, Shield } from "lucide-react"
import SignOutButton from "@/components/SignOutButton"

export default async function HomePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "superAdmin":
        return "destructive"
      case "admin":
        return "default"
      case "editor":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
          <SignOutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{user.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.country}</span>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your account verification and security status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Verified</span>
                <Badge variant={user.isVerified ? "default" : "destructive"}>
                  {user.isVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Google Account</span>
                <Badge variant={user.googleId ? "default" : "outline"}>
                  {user.googleId ? "Connected" : "Not Connected"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Member Since</span>
                <span className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {(user.role === "admin" || user.role === "superAdmin") && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Administrative functions and controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button variant="outline">Manage Users</Button>
                  <Button variant="outline">System Settings</Button>
                  <Button variant="outline">View Reports</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === "editor" && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Editor Panel</CardTitle>
                <CardDescription>Content management and editing tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline">Manage Content</Button>
                  <Button variant="outline">Edit Articles</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
