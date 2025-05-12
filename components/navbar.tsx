"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  User,
  LogOut,
  Settings,
  Award,
  BookOpen,
  Calendar,
  Briefcase,
  FileText,
  Users,
  MessageSquare,
  PenTool,
  FolderPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import GlobalVoiceRecognition from "@/components/global-voice-recognition"
import { VoiceCommandHelpModal } from "@/components/voice-command-help-modal"

function LogoAnimation() {
  const [text, setText] = useState("H")
  const fullText = "HackNHost"
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    let currentIndex = 1
    let direction = 1 // 1 for typing, -1 for deleting

    const interval = setInterval(() => {
      if (direction === 1) {
        // Typing
        if (currentIndex < fullText.length) {
          setText(fullText.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          // Wait a bit before starting to delete
          setTimeout(() => {
            direction = -1
          }, 2000)
        }
      } else {
        // Deleting
        if (currentIndex > 1) {
          setText(fullText.substring(0, currentIndex - 1))
          currentIndex--
        } else {
          // Reset to typing
          direction = 1
          setText("H")
        }
      }
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <span className={`font-bold ${isMobile ? "text-lg" : "text-2xl"} text-purple-500`}>{text}</span>
        <span className="absolute right-[-4px] top-0 h-full w-[2px] bg-purple-500 animate-blink"></span>
      </div>
    </div>
  )
}

const routes = [
  {
    name: "Home",
    path: "/",
    icon: null,
  },
  {
    name: "Events",
    path: "/events",
    icon: <Calendar className="h-4 w-4 mr-2" />,
  },
  {
    name: "Courses",
    path: "/courses",
    icon: <BookOpen className="h-4 w-4 mr-2" />,
  },
  {
    name: "Jobs",
    path: "/jobs",
    icon: <Briefcase className="h-4 w-4 mr-2" />,
  },
  {
    name: "Blogs",
    path: "/blogs",
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
  {
    name: "Resources",
    path: "/resources",
    icon: <FolderPlus className="h-4 w-4 mr-2" />,
  },
  {
    name: "Community",
    path: "/community",
    icon: <Users className="h-4 w-4 mr-2" />,
  },
  {
    name: "Leaderboard",
    path: "/leaderboard",
    icon: <Award className="h-4 w-4 mr-2" />,
  },
  {
    name: "AI Assistant",
    path: "/ai-model",
    icon: <MessageSquare className="h-4 w-4 mr-2" />,
  },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, userProfile, loading, logoutUser, isOrganizer } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Get the first letter of the display name or email for avatar fallback
  const getAvatarFallback = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName.charAt(0).toUpperCase()
    }
    if (userProfile?.email) {
      return userProfile.email.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-900/30 bg-black">
      <div className="container flex h-16 items-center justify-between max-w-full px-4">
        <div className="hidden md:flex items-center space-x-4 flex-1">
          {routes.slice(1, Math.ceil(routes.length / 2)).map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-400",
                pathname === route.path ? "text-purple-500" : "text-white",
              )}
            >
              {route.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center mx-4">
          <Link href="/" className="flex items-center space-x-2 relative">
            <LogoAnimation />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
          {routes.slice(Math.ceil(routes.length / 2)).map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-400",
                pathname === route.path ? "text-purple-500" : "text-white",
              )}
            >
              {route.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <GlobalVoiceRecognition />
          <VoiceCommandHelpModal />
          {!loading && !user ? (
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">Login</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.photoURL || ""} alt={userProfile?.displayName || "User"} />
                    <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black border border-purple-900/30" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{userProfile?.displayName || "User"}</p>
                    <p className="text-xs leading-none text-purple-300">{userProfile?.email || user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-purple-900/30" />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center text-white hover:text-purple-400">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                {isOrganizer && (
                  <>
                    <DropdownMenuSeparator className="bg-purple-900/30" />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs text-purple-400">Create Content</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/create-event"
                          className="cursor-pointer flex items-center text-white hover:text-purple-400"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Create Event</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/blogs/create"
                          className="cursor-pointer flex items-center text-white hover:text-purple-400"
                        >
                          <PenTool className="mr-2 h-4 w-4" />
                          <span>Write Blog</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/jobs/create"
                          className="cursor-pointer flex items-center text-white hover:text-purple-400"
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Post Job</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/resources/create"
                          className="cursor-pointer flex items-center text-white hover:text-purple-400"
                        >
                          <FolderPlus className="mr-2 h-4 w-4" />
                          <span>Add Resource</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/courses/create"
                          className="cursor-pointer flex items-center text-white hover:text-purple-400"
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          <span>Create Course</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-purple-900/30" />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/my-events"
                        className="cursor-pointer flex items-center text-white hover:text-purple-400"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>My Events</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center text-white hover:text-purple-400">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-purple-900/30" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-white hover:text-purple-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black border-r border-purple-900/30">
              <div className="px-2 py-6 flex flex-col h-full">
                <Link href="/" className="flex items-center mb-6 justify-center" onClick={() => setIsOpen(false)}>
                  <span className="font-bold text-xl text-purple-500">HackNHost</span>
                </Link>
                <div className="flex flex-col space-y-3 flex-1 overflow-y-auto">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={cn(
                        "flex items-center text-sm font-medium transition-colors hover:text-purple-400 py-2",
                        pathname === route.path ? "text-purple-500" : "text-white",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.icon}
                      {route.name}
                    </Link>
                  ))}
                </div>
                {!loading && !user ? (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Login</Button>
                  </Link>
                ) : (
                  <div className="border-t border-purple-900/30 pt-4 mt-4">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={userProfile?.photoURL || ""} alt={userProfile?.displayName || "User"} />
                        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{userProfile?.displayName || "User"}</p>
                        <p className="text-xs text-purple-300">{userProfile?.email || user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2 overflow-y-auto max-h-[40vh]">
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-purple-500 text-white hover:bg-purple-900/20"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </Link>

                      {isOrganizer && (
                        <>
                          <p className="text-xs text-purple-400 mt-4 mb-2 px-2">Create Content</p>
                          <Link href="/create-event" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-purple-500 text-white hover:bg-purple-900/20"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              Create Event
                            </Button>
                          </Link>
                          <Link href="/blogs/create" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-purple-500 text-white hover:bg-purple-900/20"
                            >
                              <PenTool className="mr-2 h-4 w-4" />
                              Write Blog
                            </Button>
                          </Link>
                          <Link href="/jobs/create" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-purple-500 text-white hover:bg-purple-900/20"
                            >
                              <Briefcase className="mr-2 h-4 w-4" />
                              Post Job
                            </Button>
                          </Link>
                          <Link href="/resources/create" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-purple-500 text-white hover:bg-purple-900/20"
                            >
                              <FolderPlus className="mr-2 h-4 w-4" />
                              Add Resource
                            </Button>
                          </Link>
                          <Link href="/courses/create" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-purple-500 text-white hover:bg-purple-900/20"
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              Create Course
                            </Button>
                          </Link>
                          <Link href="/my-events" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-purple-500 text-white hover:bg-purple-900/20"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              My Events
                            </Button>
                          </Link>
                        </>
                      )}

                      <Link href="/settings" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-purple-500 text-white hover:bg-purple-900/20"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-purple-500 text-white hover:bg-purple-900/20"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
