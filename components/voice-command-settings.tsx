"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Volume2, Globe, Bell } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { isSpeechRecognitionSupported } from "@/lib/speech-recognition"

export function VoiceCommandSettings() {
  const {
    voiceCommandEnabled,
    voiceCommandVolume,
    voiceCommandLanguage,
    voiceCommandFeedback,
    toggleVoiceCommand,
    setVoiceCommandVolume,
    setVoiceCommandLanguage,
    toggleVoiceCommandFeedback,
  } = useAppStore()

  const [isTestingVoice, setIsTestingVoice] = useState(false)

  const handleTestVoice = () => {
    if (!isTestingVoice) {
      setIsTestingVoice(true)

      // Use the browser's speech synthesis API to test voice feedback
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance("Voice command system is working correctly.")
        utterance.volume = voiceCommandVolume
        utterance.lang = voiceCommandLanguage

        utterance.onend = () => {
          setIsTestingVoice(false)
        }

        window.speechSynthesis.speak(utterance)
      } else {
        // If speech synthesis is not available, reset the state after a delay
        setTimeout(() => {
          setIsTestingVoice(false)
        }, 2000)
      }
    }
  }

  // Check if speech recognition is supported
  const isSupported = isSpeechRecognitionSupported()

  if (!isSupported) {
    return (
      <Card className="border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400">Voice Commands Not Supported</CardTitle>
          <CardDescription>
            Your browser doesn't support the Speech Recognition API. Please try using Chrome, Edge, or Safari.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Command Settings
        </CardTitle>
        <CardDescription>Configure how voice commands work in the application</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="voice-command-toggle">Enable Voice Commands</Label>
            <p className="text-sm text-muted-foreground">Turn on to use voice commands throughout the application</p>
          </div>
          <Switch id="voice-command-toggle" checked={voiceCommandEnabled} onCheckedChange={toggleVoiceCommand} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <Label>Feedback Volume</Label>
          </div>
          <Slider
            defaultValue={[voiceCommandVolume * 100]}
            max={100}
            step={1}
            disabled={!voiceCommandEnabled}
            onValueChange={(value) => setVoiceCommandVolume(value[0] / 100)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Off</span>
            <span>Max</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <Label htmlFor="language-select">Recognition Language</Label>
          </div>
          <Select disabled={!voiceCommandEnabled} value={voiceCommandLanguage} onValueChange={setVoiceCommandLanguage}>
            <SelectTrigger id="language-select">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="en-GB">English (UK)</SelectItem>
              <SelectItem value="es-ES">Spanish</SelectItem>
              <SelectItem value="fr-FR">French</SelectItem>
              <SelectItem value="de-DE">German</SelectItem>
              <SelectItem value="ja-JP">Japanese</SelectItem>
              <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <Label htmlFor="voice-feedback-toggle">Voice Feedback</Label>
            </div>
            <p className="text-sm text-muted-foreground">Receive voice responses when commands are recognized</p>
          </div>
          <Switch
            id="voice-feedback-toggle"
            disabled={!voiceCommandEnabled}
            checked={voiceCommandFeedback}
            onCheckedChange={toggleVoiceCommandFeedback}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => toggleVoiceCommand()}>
          {voiceCommandEnabled ? "Disable" : "Enable"}
        </Button>
        <Button onClick={handleTestVoice} disabled={!voiceCommandEnabled || isTestingVoice}>
          {isTestingVoice ? "Testing..." : "Test Voice"}
        </Button>
      </CardFooter>
    </Card>
  )
}
