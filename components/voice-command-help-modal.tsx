"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// Command categories for the help modal
const commandCategories = [
  {
    name: "Navigation",
    commands: [
      { command: "Go to home", description: "Navigate to the home page" },
      { command: "Go to events", description: "Navigate to the events page" },
      { command: "Go to courses", description: "Navigate to the courses page" },
      { command: "Go to jobs", description: "Navigate to the jobs page" },
      { command: "Go to blogs", description: "Navigate to the blogs page" },
      { command: "Go to resources", description: "Navigate to the resources page" },
      { command: "Go to community", description: "Navigate to the community page" },
      { command: "Go to leaderboard", description: "Navigate to the leaderboard page" },
      { command: "Go to AI", description: "Navigate to the AI assistant page" },
      { command: "Go to VR", description: "Navigate to the VR view" },
      { command: "Go to contact", description: "Navigate to the contact page" },
    ],
  },
  {
    name: "User Account",
    commands: [
      { command: "Login", description: "Navigate to the login page" },
      { command: "Register", description: "Navigate to the registration page" },
      { command: "Go to profile", description: "Navigate to your profile page" },
      { command: "Go to settings", description: "Navigate to your settings page" },
      { command: "Logout", description: "Log out of your account" },
    ],
  },
  {
    name: "Event Actions",
    commands: [
      { command: "Create event", description: "Navigate to the event creation page" },
      { command: "Join team", description: "Navigate to the team joining page" },
      { command: "Create team", description: "Navigate to the team creation page" },
      { command: "Submit project", description: "Navigate to the project submission page" },
      { command: "View submissions", description: "View all project submissions" },
      { command: "Judging", description: "Navigate to the judging page" },
    ],
  },
  {
    name: "Other Actions",
    commands: [
      { command: "Search", description: "Open the search functionality" },
      { command: "Help", description: "Navigate to the help page" },
      { command: "Notifications", description: "View your notifications" },
      { command: "Schedule", description: "View the event schedule" },
    ],
  },
]

export function VoiceCommandHelpModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gray-800 text-white border-gray-700"
          title="Voice command help"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-black border border-purple-900/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-400">Voice Commands</DialogTitle>
          <DialogDescription className="text-gray-300">
            Say any of these commands to navigate or perform actions
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {commandCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <h3 className="text-lg font-semibold text-purple-400">{category.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {category.commands.map((cmd) => (
                    <div
                      key={cmd.command}
                      className="p-2 border border-purple-900/30 rounded-md bg-gray-900/50 flex flex-col"
                    >
                      <span className="font-medium text-white">{cmd.command}</span>
                      <span className="text-sm text-gray-400">{cmd.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
