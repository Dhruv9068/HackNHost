// Utility functions for speech recognition

// Check if the browser supports speech recognition
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false

  // Check for the SpeechRecognition API
  const hasSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  // Some browsers might have the API but not fully implement it
  if (hasSpeechRecognition) {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      return true
    } catch (error) {
      console.error("Speech recognition API exists but failed to initialize:", error)
      return false
    }
  }

  return false
}

// Get the speech recognition constructor
export function getSpeechRecognition(): any {
  if (!isSpeechRecognitionSupported()) return null
  return window.SpeechRecognition || window.webkitSpeechRecognition
}

// Calculate backoff delay for restart attempts
export function calculateBackoffDelay(attempts: number, baseDelay = 1000, maxDelay = 10000): number {
  // Exponential backoff with jitter
  const exponentialDelay = Math.min(baseDelay * Math.pow(1.5, attempts), maxDelay)
  // Add some randomness to prevent synchronized retries
  const jitter = Math.random() * 0.3 * exponentialDelay
  return exponentialDelay + jitter
}

// Helper to safely release microphone tracks
export async function releaseMicrophone(stream: MediaStream): Promise<void> {
  if (stream && stream.getTracks) {
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop()
      }
    })
  }
}

// Helper to get preferred voice for speech synthesis
export function getPreferredVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null

  const voices = window.speechSynthesis.getVoices()

  // Try to find a good female English voice
  const preferredVoice =
    voices.find((voice) => voice.name.includes("Female") && voice.lang.includes("en-US")) ||
    // Fallback to any English voice
    voices.find((voice) => voice.lang.includes("en")) ||
    // Fallback to default voice
    voices[0]

  return preferredVoice || null
}

// Speak text using speech synthesis
export function speakText(text: string, onStart?: () => void, onEnd?: () => void): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.volume = 1
  utterance.rate = 1
  utterance.pitch = 1

  // Set callbacks
  if (onStart) utterance.onstart = onStart
  if (onEnd) utterance.onend = onEnd

  // Try to find a good voice
  const preferredVoice = getPreferredVoice()
  if (preferredVoice) {
    utterance.voice = preferredVoice
  }

  window.speechSynthesis.speak(utterance)
}
