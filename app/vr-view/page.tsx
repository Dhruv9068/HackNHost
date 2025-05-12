"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Info,
  Maximize,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Compass,
  Map,
  MessageSquare,
  Camera,
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VRViewPage() {
  const [showInfo, setShowInfo] = useState(false)
  const [currentScene, setCurrentScene] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTab, setCurrentTab] = useState("info")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [activeHotspots, setActiveHotspots] = useState<string[]>([])
  const [showTour, setShowTour] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [capturedScreenshots, setCapturedScreenshots] = useState<string[]>([])
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const scenes = [
    {
      id: 0,
      title: "Campus Main View",
      description: "The main campus view of GL Bajaj Group of Institutions with the iconic circular fountain.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-USfva6WNRrPKZfJ16T1ouOpnALuJcb.png",
      audio: "/ambient-campus.mp3",
      hotspots: [
        {
          id: "fountain",
          title: "Central Fountain",
          position: "center",
          description: "The iconic fountain at the center of campus",
        },
        {
          id: "mainBuilding",
          title: "Main Building",
          position: "right",
          description: "Administrative offices and main lecture halls",
        },
        {
          id: "garden",
          title: "Campus Garden",
          position: "left",
          description: "Relaxation area with beautiful landscaping",
        },
      ],
    },
    {
      id: 1,
      title: "Campus Side View",
      description: "Another perspective of the campus showing the academic buildings and surroundings.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8iCyRSWuQ8JRcBFHcJ4J6mXtWCLjnR.png",
      audio: "/ambient-nature.mp3",
      hotspots: [
        {
          id: "library",
          title: "Library",
          position: "left",
          description: "State-of-the-art library with thousands of books and digital resources",
        },
        {
          id: "cafeteria",
          title: "Cafeteria",
          position: "right",
          description: "Campus food court with multiple cuisine options",
        },
        {
          id: "sportsField",
          title: "Sports Field",
          position: "bottom",
          description: "Multi-purpose sports field for various activities",
        },
      ],
    },
    {
      id: 2,
      title: "Hackathon Venue",
      description: "The main hall where the Qubitx 2025 hackathon will take place.",
      image: "/modern-hackathon-auditorium.png",
      audio: "/ambient-tech.mp3",
      hotspots: [
        {
          id: "stage",
          title: "Main Stage",
          position: "center",
          description: "Where keynote speakers and announcements happen",
        },
        {
          id: "hackingZone",
          title: "Hacking Zone",
          position: "right",
          description: "Dedicated area for teams to work on their projects",
        },
        {
          id: "networkingArea",
          title: "Networking Area",
          position: "left",
          description: "Space for participants to connect and collaborate",
        },
        {
          id: "techBooth",
          title: "Tech Booth",
          position: "bottom",
          description: "Get technical support and hardware for your projects",
        },
      ],
    },
    {
      id: 3,
      title: "Innovation Lab",
      description: "Cutting-edge innovation lab with the latest technology for prototyping and experimentation.",
      image: "/innovation-lab.png",
      audio: "/ambient-lab.mp3",
      hotspots: [
        {
          id: "3dPrinters",
          title: "3D Printing Station",
          position: "left",
          description: "Create physical prototypes with our 3D printers",
        },
        {
          id: "vrStation",
          title: "VR Testing Area",
          position: "right",
          description: "Test VR applications and experiences",
        },
        {
          id: "roboticsLab",
          title: "Robotics Corner",
          position: "bottom",
          description: "Work with various robotics platforms and components",
        },
      ],
    },
    {
      id: 4,
      title: "Collaboration Space",
      description: "Open collaboration space designed for team discussions and brainstorming sessions.",
      image: "/collaboration-space.png",
      audio: "/ambient-collab.mp3",
      hotspots: [
        {
          id: "meetingPods",
          title: "Meeting Pods",
          position: "left",
          description: "Private spaces for team discussions",
        },
        {
          id: "whiteboards",
          title: "Interactive Whiteboards",
          position: "right",
          description: "Digital and traditional whiteboards for brainstorming",
        },
        {
          id: "relaxZone",
          title: "Relaxation Zone",
          position: "bottom",
          description: "Take a break and recharge in our comfortable lounge area",
        },
      ],
    },
  ]

  const tourSteps = [
    {
      title: "Welcome to the Virtual Tour",
      description: "Explore our campus and hackathon venues in immersive 360° view",
    },
    { title: "Navigation Controls", description: "Use the arrows to move between different locations" },
    { title: "Interactive Hotspots", description: "Click on hotspots to learn more about specific areas" },
    { title: "Information Panel", description: "Toggle the info panel to see details about each location" },
    { title: "Map View", description: "Use the map to see your location and jump to different areas" },
    { title: "Take Screenshots", description: "Capture and save views to reference later" },
    { title: "Chat with Others", description: "Connect with other visitors in the same virtual space" },
  ]

  const virtualVisitors = [
    { id: 1, name: "Alex Chen", avatar: "/abstract-geometric-shapes.png", location: "Campus Main View" },
    { id: 2, name: "Priya Sharma", avatar: "/abstract-geometric-shapes.png", location: "Hackathon Venue" },
    { id: 3, name: "Marcus Johnson", avatar: "/abstract-geometric-shapes.png", location: "Innovation Lab" },
  ]

  const chatMessages = [
    { id: 1, sender: "Alex Chen", message: "The hackathon venue looks amazing!", time: "2 min ago" },
    { id: 2, sender: "System", message: "Priya Sharma has joined the tour", time: "1 min ago" },
    { id: 3, sender: "Priya Sharma", message: "Does anyone know where the 3D printers are located?", time: "Just now" },
  ]

  useEffect(() => {
    // Simulate loading of A-Frame and assets
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Simulate hotspots appearing based on where you're looking
    const interval = setInterval(() => {
      const currentSceneHotspots = scenes[currentScene].hotspots
      const randomHotspot = currentSceneHotspots[Math.floor(Math.random() * currentSceneHotspots.length)]

      if (!activeHotspots.includes(randomHotspot.id)) {
        setActiveHotspots((prev) => [...prev, randomHotspot.id])

        // Remove after some time to simulate looking away
        setTimeout(() => {
          setActiveHotspots((prev) => prev.filter((id) => id !== randomHotspot.id))
        }, 5000)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [currentScene, activeHotspots])

  const handleSceneChange = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentScene((prev) => (prev === scenes.length - 1 ? 0 : prev + 1))
    } else {
      setCurrentScene((prev) => (prev === 0 ? scenes.length - 1 : prev - 1))
    }
    // Reset active hotspots when changing scenes
    setActiveHotspots([])
  }

  const handleRotationChange = (newRotation: number) => {
    setRotation(newRotation)
    // Update the iframe rotation if it exists
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (iframeDocument) {
        const sky = iframeDocument.querySelector("a-sky")
        if (sky) {
          sky.setAttribute("rotation", `0 ${newRotation} 0`)
        }
      }
    }
  }

  const takeScreenshot = () => {
    // Simulate taking a screenshot
    const newScreenshot = scenes[currentScene].image
    setCapturedScreenshots((prev) => [...prev, newScreenshot])

    toast({
      title: "Screenshot Captured",
      description: `Saved view of ${scenes[currentScene].title}`,
    })
  }

  const toast = ({ title, description }: { title: string; description: string }) => {
    // Simple toast implementation
    const toastElement = document.createElement("div")
    toastElement.className =
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white p-4 rounded-lg z-50 flex flex-col"
    toastElement.innerHTML = `
      <div class="font-bold">${title}</div>
      <div class="text-sm">${description}</div>
    `
    document.body.appendChild(toastElement)

    setTimeout(() => {
      toastElement.style.opacity = "0"
      toastElement.style.transition = "opacity 0.5s ease"
      setTimeout(() => document.body.removeChild(toastElement), 500)
    }, 3000)
  }

  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1)
    } else {
      setShowTour(false)
      setTourStep(0)
      toast({
        title: "Tour Completed",
        description: "You can restart the tour anytime from the info panel",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <Link href="/events">
          <Button variant="outline" size="icon" className="bg-black/80 backdrop-blur-sm border-purple-900/30">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-white drop-shadow-md">HackNHost VR Campus Tour</h1>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/80 backdrop-blur-sm border-purple-900/30"
          onClick={() => setAudioEnabled(!audioEnabled)}
        >
          {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="bg-black/80 backdrop-blur-sm border-purple-900/30"
          onClick={() => setShowMap(!showMap)}
        >
          <Map className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="bg-black/80 backdrop-blur-sm border-purple-900/30"
          onClick={() => setShowChat(!showChat)}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="bg-black/80 backdrop-blur-sm border-purple-900/30"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="h-5 w-5" />
        </Button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <Card className="absolute top-16 right-4 z-10 w-80 bg-black/90 backdrop-blur-md border border-purple-900/30">
          <Tabs defaultValue="info" onValueChange={setCurrentTab}>
            <TabsList className="w-full bg-gray-900/50">
              <TabsTrigger value="info" className="flex-1">
                Info
              </TabsTrigger>
              <TabsTrigger value="controls" className="flex-1">
                Controls
              </TabsTrigger>
              <TabsTrigger value="visitors" className="flex-1">
                Visitors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="p-4">
              <h2 className="text-lg font-bold mb-2">{scenes[currentScene].title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{scenes[currentScene].description}</p>

              <h3 className="text-sm font-semibold mb-2">Points of Interest:</h3>
              <div className="space-y-2">
                {scenes[currentScene].hotspots.map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className={`p-2 rounded-md text-xs ${
                      activeHotspots.includes(hotspot.id)
                        ? "bg-purple-900/50 border border-purple-500"
                        : "bg-gray-800/50"
                    }`}
                  >
                    <div className="font-medium">{hotspot.title}</div>
                    <div className="text-gray-400">{hotspot.description}</div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4 bg-purple-700 hover:bg-purple-800" onClick={() => setShowTour(true)}>
                Start Guided Tour
              </Button>
            </TabsContent>

            <TabsContent value="controls" className="p-4">
              <h3 className="text-sm font-semibold mb-2">View Controls:</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Rotation</span>
                    <span>{rotation}°</span>
                  </div>
                  <Slider
                    value={[rotation]}
                    min={0}
                    max={360}
                    step={10}
                    onValueChange={(value) => handleRotationChange(value[0])}
                    className="mb-4"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Zoom</span>
                    <span>{zoomLevel.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[zoomLevel]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => setZoomLevel(value[0])}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button variant="outline" className="border-purple-900/30" onClick={takeScreenshot}>
                    <Camera className="h-4 w-4 mr-2" />
                    Screenshot
                  </Button>

                  <Button
                    variant="outline"
                    className="border-purple-900/30"
                    onClick={() => {
                      const elem = document.documentElement
                      if (elem.requestFullscreen) {
                        elem.requestFullscreen()
                      }
                    }}
                  >
                    <Maximize className="h-4 w-4 mr-2" />
                    Fullscreen
                  </Button>
                </div>
              </div>

              {capturedScreenshots.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Screenshots:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {capturedScreenshots.map((screenshot, index) => (
                      <div key={index} className="relative h-16 w-full rounded overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-blue-900" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="visitors" className="p-4">
              <h3 className="text-sm font-semibold mb-2">Currently Exploring:</h3>
              <div className="space-y-2">
                {virtualVisitors.map((visitor) => (
                  <div key={visitor.id} className="flex items-center gap-2 p-2 rounded-md bg-gray-800/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={visitor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{visitor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xs font-medium">{visitor.name}</div>
                      <div className="text-xs text-gray-400">{visitor.location}</div>
                    </div>
                    <Badge className="ml-auto text-[10px] h-5 bg-purple-900/50">Online</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}

      {/* Map Overlay */}
      {showMap && (
        <div className="absolute left-4 bottom-20 z-10 w-64 h-64 bg-black/80 backdrop-blur-md border border-purple-900/30 rounded-lg overflow-hidden">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30">
              {/* Map content would go here */}
              <div className="absolute top-2 left-2 text-xs font-bold">Campus Map</div>

              {/* Scene markers */}
              {scenes.map((scene, index) => (
                <div
                  key={scene.id}
                  className={`absolute w-3 h-3 rounded-full cursor-pointer ${
                    currentScene === index ? "bg-purple-500 ring-2 ring-purple-300 animate-pulse" : "bg-white/70"
                  }`}
                  style={{
                    top: `${20 + index * 15}%`,
                    left: `${20 + index * 12}%`,
                  }}
                  onClick={() => setCurrentScene(index)}
                >
                  {currentScene === index && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded whitespace-nowrap">
                      You are here
                    </div>
                  )}
                </div>
              ))}

              {/* Compass */}
              <div className="absolute bottom-2 right-2 w-10 h-10">
                <Compass className="w-full h-full text-white/70" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Overlay */}
      {showChat && (
        <div className="absolute right-4 bottom-20 z-10 w-72 bg-black/90 backdrop-blur-md border border-purple-900/30 rounded-lg overflow-hidden">
          <div className="p-2 border-b border-purple-900/30 flex justify-between items-center">
            <h3 className="text-sm font-bold">Live Chat</h3>
            <Badge className="bg-green-600 text-[10px]">3 Online</Badge>
          </div>

          <div className="h-48 overflow-y-auto p-2 space-y-2">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`text-xs ${msg.sender === "System" ? "text-center text-gray-500 italic my-1" : ""}`}
              >
                {msg.sender !== "System" && <span className="font-bold">{msg.sender}: </span>}
                <span>{msg.message}</span>
                <span className="text-[10px] text-gray-500 ml-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-purple-900/30 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded text-xs p-1"
            />
            <Button size="sm" className="h-6 text-xs bg-purple-700 hover:bg-purple-800 px-2">
              Send
            </Button>
          </div>
        </div>
      )}

      {/* Tour Guide Overlay */}
      {showTour && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 w-80 bg-black/90 backdrop-blur-md border border-purple-500 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Virtual Tour Guide</h3>
            <Badge className="bg-purple-700">
              {tourStep + 1}/{tourSteps.length}
            </Badge>
          </div>

          <h4 className="text-sm font-medium mb-1">{tourSteps[tourStep].title}</h4>
          <p className="text-xs text-gray-300 mb-4">{tourSteps[tourStep].description}</p>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" className="text-xs border-gray-700" onClick={() => setShowTour(false)}>
              Skip Tour
            </Button>
            <Button size="sm" className="text-xs bg-purple-700 hover:bg-purple-800" onClick={nextTourStep}>
              {tourStep < tourSteps.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading VR Experience...</p>
          </div>
        </div>
      )}

      {/* A-Frame Scene */}
      <div className="w-full h-screen">
        {!isLoading && (
          <iframe
            ref={iframeRef}
            src={`data:text/html;charset=utf-8,
              <html>
                <head>
                  <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
                  <style>
                    body { margin: 0; }
                    .a-enter-vr { display: none; }
                  </style>
                </head>
                <body>
                  <a-scene embedded>
                    <a-sky src="${scenes[currentScene].image}" rotation="0 ${rotation} 0"></a-sky>
                    <a-entity camera look-controls wasd-controls></a-entity>
                  </a-scene>
                </body>
              </html>
            `}
            className="w-full h-full border-none"
            title="VR View"
            allow="xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
          ></iframe>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/80 backdrop-blur-sm border-purple-900/30"
          onClick={() => handleSceneChange("prev")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-md">
          <p className="text-sm font-medium">
            {currentScene + 1} / {scenes.length}
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="bg-black/80 backdrop-blur-sm border-purple-900/30"
          onClick={() => handleSceneChange("next")}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Fullscreen Button */}
      <button
        onClick={() => {
          const elem = document.documentElement
          if (elem.requestFullscreen) {
            elem.requestFullscreen()
          }
        }}
        className="absolute bottom-8 right-8 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm"
      >
        <Maximize className="h-5 w-5" />
      </button>
    </div>
  )
}
