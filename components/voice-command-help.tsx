"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, Mic, Navigation, FileText, MousePointer2 } from "lucide-react"

export default function VoiceCommandHelp() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" title="Voice Command Help">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Command Help</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="navigation" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              <span>Navigation</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <MousePointer2 className="h-4 w-4" />
              <span>Actions</span>
            </TabsTrigger>
            <TabsTrigger value="typing" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Typing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="navigation" className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <Mic className="h-6 w-6 text-purple-700 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Navigation Commands</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click the microphone button and say a navigation command
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Available Commands:</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { command: "Go to Home", action: "Navigate to home page" },
                  { command: "Go to Events", action: "Navigate to events page" },
                  { command: "Go to VR View", action: "Open VR experience" },
                  { command: "Go to AI", action: "Open AI assistant" },
                  { command: "Go to Contact", action: "Open contact page" },
                  { command: "Go to Login", action: "Navigate to login page" },
                  { command: "Create Event", action: "Open event creation page" },
                  { command: "Go to Blogs", action: "Navigate to blogs page" },
                  { command: "Go to Jobs", action: "Navigate to jobs page" },
                  { command: "Go to Courses", action: "Navigate to courses page" },
                  { command: "Go to Resources", action: "Navigate to resources page" },
                  { command: "Go to Community", action: "Navigate to community page" },
                  { command: "Go to Leaderboard", action: "Navigate to leaderboard page" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="font-medium">"{item.command}"</span>
                    <span className="text-gray-600 dark:text-gray-300">→ {item.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <MousePointer2 className="h-6 w-6 text-purple-700 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">UI Action Commands</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Control buttons and forms with your voice</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Available Actions:</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { command: "Click Login", action: "Click the login button" },
                  { command: "Click Submit", action: "Submit the current form" },
                  { command: "Click Cancel", action: "Click the cancel button" },
                  { command: "Click Create Event", action: "Click the create event button" },
                  { command: "Submit Form", action: "Submit the current form" },
                  { command: "Cancel", action: "Cancel the current action" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="font-medium">"{item.command}"</span>
                    <span className="text-gray-600 dark:text-gray-300">→ {item.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="typing" className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <FileText className="h-6 w-6 text-purple-700 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Voice Typing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use your voice to type in forms and text fields
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">How to Use:</h4>
              <ol className="space-y-2 text-sm list-decimal ml-4">
                <li>Click on a text field to focus it</li>
                <li>Click the microphone button or say "Type [your text]"</li>
                <li>Speak clearly and your words will be typed into the field</li>
                <li>The microphone will automatically stop after 10 seconds</li>
              </ol>

              <h4 className="font-medium mt-4 mb-2">Example Commands:</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { command: "Type Hello world", action: "Types 'Hello world' in the active field" },
                  { command: "Type my email is example@email.com", action: "Types the email address" },
                  { command: "Type I'm interested in AI hackathons", action: "Types the complete sentence" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="font-medium">"{item.command}"</span>
                    <span className="text-gray-600 dark:text-gray-300">→ {item.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-sm mt-4">
          <p className="text-amber-800 dark:text-amber-300">
            Tip: The voice command system listens for 10 seconds and shows what it hears in real-time.
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
