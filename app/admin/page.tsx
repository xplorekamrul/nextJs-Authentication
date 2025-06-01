import { getCurrentUser, hasRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Settings, BarChart3, Shield } from "lucide-react"
import SignOutButton from "@/components/SignOutButton"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || !hasRole(user, ["admin", "superAdmin"])) {
    redirect("/home")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and system settings</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {user.role}
            </Badge>
            <SignOutButton />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Users</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>Configure application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">System Config</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics
              </CardTitle>
              <CardDescription>View system analytics and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Reports</Button>
            </CardContent>
          </Card>
        </div>

        {user.role === "superAdmin" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-red-600">Super Admin Controls</CardTitle>
              <CardDescription>Dangerous operations - use with caution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="destructive">Database Management</Button>
                <Button variant="destructive">System Maintenance</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
