"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Trash2, Upload, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import Image from "next/image"

export default function ManageVRPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { getEvent, currentUser, isLoggedIn } = useAppStore()
  const event = getEvent(params.id)

  const [vrScenes, setVrScenes] = useState([
    {
      id: 1,
      title: "Campus Main View",
      description: "The main campus view with the iconic circular fountain.",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-USfva6WNRrPKZfJ16T1ouOpnALuJcb.png",
    },
    {
      id: 2,
      title: "Campus Side View",
      description: "Another perspective of the campus showing the academic buildings and surroundings.",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8iCyRSWuQ8JRcBFHcJ4J6mXtWCLjnR.png",
    },
    {
      id: 3,
      title: "Hackathon Venue",
      description: "The main hall where the hackathon will take place.",
      imageUrl: "/modern-hackathon-auditorium.png",
    },
  ])

  const [newScene, setNewScene] = useState({
    title: "",
    description: "",
    imageUrl: "",
  })

  // Check if user is authorized to manage this event
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isLoggedIn || !currentUser || !event) {
        router.push("/events")
        return
      }

      if (currentUser.role !== "organizer" || currentUser.id !== event.organizerId) {
        router.push(`/events/${params.id}`)
        return
      }
    }
  }, [isLoggedIn, currentUser, event, router, params.id])

  if (
    !event ||
    !isLoggedIn ||
    !currentUser ||
    currentUser.role !== "organizer" ||
    currentUser.id !== event.organizerId
  ) {
    return null
  }

  const handleAddScene = () => {
    if (!newScene.title || !newScene.description || !newScene.imageUrl) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all fields for the new VR scene.",
        variant: "destructive",
      })
      return
    }

    setVrScenes([
      ...vrScenes,
      {
        id: Date.now(),
        title: newScene.title,
        description: newScene.description,
        imageUrl: newScene.imageUrl,
      },
    ])

    setNewScene({
      title: "",
      description: "",
      imageUrl: "",
    })

    toast({
      title: "VR Scene Added",
      description: "Your new VR scene has been added successfully.",
    })
  }

  const handleDeleteScene = (id: number) => {
    setVrScenes(vrScenes.filter((scene) => scene.id !== id))
    toast({
      title: "VR Scene Deleted",
      description: "The VR scene has been removed.",
    })
  }

  const handleSaveChanges = () => {
    // In a real app, this would save to a database
    toast({
      title: "Changes Saved",
      description: "Your VR scenes have been updated successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Event
        </Button>

        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Manage VR Views</h1>
            <p className="text-muted-foreground">
              Add and manage 360° images for {event.title} to create an immersive VR experience for participants.
            </p>
          </div>

          <Tabs defaultValue="scenes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scenes">VR Scenes</TabsTrigger>
              <TabsTrigger value="add">Add New Scene</TabsTrigger>
            </TabsList>

            <TabsContent value="scenes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vrScenes.map((scene) => (
                  <Card key={scene.id} className="border border-purple-900/30 bg-black shadow-lg shadow-purple-900/5">
                    <div className="relative h-48">
                      <Image
                        src={scene.imageUrl || "/placeholder.svg"}
                        alt={scene.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{scene.title}</CardTitle>
                      <CardDescription>{scene.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500 text-purple-400 hover:bg-purple-900/20"
                        onClick={() => router.push("/vr-view")}
                      >
                        <Eye className="h-4 w-4 mr-2" /> Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-900/20"
                        onClick={() => handleDeleteScene(scene.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {vrScenes.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No VR scenes added yet.</p>
                  <Button variant="outline" onClick={() => document.getElementById("add-tab")?.click()}>
                    Add Your First Scene
                  </Button>
                </div>
              )}

              {vrScenes.length > 0 && (
                <div className="mt-8 flex justify-end">
                  <Button className="bg-purple-700 hover:bg-purple-800" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add" className="mt-6" id="add-tab">
              <Card className="border border-purple-900/30 bg-black shadow-lg shadow-purple-900/5">
                <CardHeader>
                  <CardTitle>Add New VR Scene</CardTitle>
                  <CardDescription>
                    Upload a 360° image and provide details to create a new VR scene for your event.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Scene Title</Label>
                    <Input
                      id="title"
                      value={newScene.title}
                      onChange={(e) => setNewScene({ ...newScene, title: e.target.value })}
                      placeholder="e.g., Main Hall Entrance"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Scene Description</Label>
                    <Input
                      id="description"
                      value={newScene.description}
                      onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
                      placeholder="e.g., The entrance to the main hackathon hall"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={newScene.imageUrl}
                      onChange={(e) => setNewScene({ ...newScene, imageUrl: e.target.value })}
                      placeholder="https://example.com/360-image.jpg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the URL of a 360° image. For best results, use equirectangular panoramic images.
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-purple-900/30 rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your 360° image here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">Supports: JPG, PNG (Max size: 10MB)</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-purple-500 text-purple-400 hover:bg-purple-900/20"
                    >
                      Upload Image
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-purple-700 hover:bg-purple-800 w-full" onClick={handleAddScene}>
                    <Plus className="h-4 w-4 mr-2" /> Add VR Scene
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-6 border border-purple-900/30 rounded-lg bg-black shadow-lg shadow-purple-900/5">
            <h2 className="text-xl font-bold mb-4">Tips for Great VR Scenes</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Use high-quality 360° equirectangular images (minimum 4K resolution recommended)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Ensure good lighting conditions when capturing the images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Capture multiple connected areas to create a complete tour experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Include key areas where hackathon activities will take place</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Consider adding hotspots or information points in the VR view (coming soon)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
