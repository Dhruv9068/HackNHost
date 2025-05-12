import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" className="text-gray-400 hover:text-white" asChild>
            <Link href="/leaderboard">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Leaderboard
            </Link>
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="bg-gray-900 border-gray-800 mb-8 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-purple-900 to-purple-700">
            <div className="absolute -bottom-16 left-8">
              <Skeleton className="h-32 w-32 rounded-full border-4 border-gray-900" />
            </div>
          </div>
          <div className="pt-20 pb-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Skeleton className="h-8 w-48 bg-gray-800" />
                  <Skeleton className="h-6 w-20 rounded-full bg-gray-800" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-40 bg-gray-800" />
                  <Skeleton className="h-4 w-32 bg-gray-800" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                <Skeleton className="h-10 w-32 rounded-md bg-gray-800" />
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-24 bg-gray-800 mb-2" />
                      <Skeleton className="h-8 w-16 bg-gray-800" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-full bg-gray-800" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-full max-w-md bg-gray-800 mb-6" />

          {/* Content Skeleton */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <Skeleton className="h-6 w-24 bg-gray-800" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full bg-gray-800 mb-2" />
                    <Skeleton className="h-4 w-full bg-gray-800 mb-2" />
                    <Skeleton className="h-4 w-3/4 bg-gray-800" />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <Skeleton className="h-6 w-24 bg-gray-800" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-6 w-24 rounded-full bg-gray-800" />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <Skeleton className="h-6 w-24 bg-gray-800" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <Skeleton className="h-4 w-24 bg-gray-800" />
                          <Skeleton className="h-4 w-12 bg-gray-800" />
                        </div>
                        <Skeleton className="h-2 w-full bg-gray-800" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <Skeleton className="h-6 w-48 bg-gray-800" />
                <Skeleton className="h-8 w-24 bg-gray-800" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-48 bg-gray-700 mb-2" />
                          <Skeleton className="h-4 w-64 bg-gray-700 mb-3" />
                          <div className="flex gap-3">
                            <Skeleton className="h-8 w-32 rounded-md bg-gray-700" />
                            <Skeleton className="h-8 w-32 rounded-md bg-gray-700" />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
