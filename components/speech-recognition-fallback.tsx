"use client"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SpeechRecognitionFallback() {
  // const [command, setCommand] = useState("")
  // const router = useRouter()
  // const { toast } = useToast()

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()

  //   if (!command.trim()) return

  //   // Simple command processing
  //   const lowerCommand = command.toLowerCase()

  //   if (lowerCommand.includes("go to home") || lowerCommand.includes("home page")) {
  //     router.push("/")
  //     showToast("Going to home page")
  //   } else if (lowerCommand.includes("events")) {
  //     router.push("/events")
  //     showToast("Going to events page")
  //   } else if (lowerCommand.includes("vr")) {
  //     router.push("/vr-view")
  //     showToast("Opening VR view")
  //   } else if (lowerCommand.includes("ai")) {
  //     router.push("/ai-model")
  //     showToast("Going to AI model")
  //   } else if (lowerCommand.includes("contact")) {
  //     router.push("/contact")
  //     showToast("Opening contact page")
  //   } else if (lowerCommand.includes("login")) {
  //     router.push("/login")
  //     showToast("Going to login page")
  //   } else if (lowerCommand.includes("community")) {
  //     router.push("/community")
  //     showToast("Going to community page")
  //   } else if (lowerCommand.includes("leaderboard")) {
  //     router.push("/leaderboard")
  //     showToast("Going to leaderboard page")
  //   } else {
  //     showToast("Command not recognized", "destructive")
  //   }

  //   setCommand("")
  // }

  // const showToast = (message: string, variant: "default" | "destructive" = "default") => {
  //   toast({
  //     title: "Command",
  //     description: message,
  //     variant,
  //   })
  // }

  // return (
  //   <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-[300px]">
  //     <Input
  //       type="text"
  //       placeholder="Type a command..."
  //       value={command}
  //       onChange={(e) => setCommand(e.target.value)}
  //       className="bg-black/50 border-purple-900/30 text-white text-sm"
  //     />
  //     <Button
  //       type="submit"
  //       size="icon"
  //       variant="outline"
  //       className="bg-purple-900/20 border-purple-500/30 flex-shrink-0"
  //     >
  //       <Send className="h-4 w-4" />
  //     </Button>
  //   </form>
  // )
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gray-700 text-white border-gray-600 cursor-not-allowed opacity-70"
            disabled
          >
            <AlertCircle className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Voice commands not supported in this browser</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
