import { getCurrentUser, hasRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Edit, ImageIcon, Calendar } from "lucide-react"
import SignOutButton from "@/components/SignOutButton"

export default async function EditorPage() {
  const user = await getCurrentUser()

  if (!user || !hasRole(user, ["editor", "admin", "superAdmin"])) {
    redirect("/home")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editor Dashboard</h1>
            <p className="text-muted-foreground">Create and manage content</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Edit className="h-3 w-3" />
              {user.role}
            </Badge>
            <SignOutButton />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Articles
              </CardTitle>
              <CardDescription>Create and edit articles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Articles</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Media Library
              </CardTitle>
              <CardDescription>Upload and manage media files</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Media Manager</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Publishing
              </CardTitle>
              <CardDescription>Schedule and publish content</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Content Calendar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
