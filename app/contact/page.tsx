"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Github, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import VoiceInput from "@/components/voice-input"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)

      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.2

      if (success) {
        setIsSubmitted(true)
        setHasError(false)
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        setHasError(true)
      }

      // Reset status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setHasError(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about HackNHost or the upcoming hackathons? Get in touch with our team and we'll get back to
            you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-purple-900/30 bg-black shadow-lg shadow-purple-900/5">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach out to us through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-900/20 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">info@hacknhost.com</p>
                    <p className="text-muted-foreground">support@hacknhost.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-900/20 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">+91 123 456 7890</p>
                    <p className="text-muted-foreground">+91 987 654 3210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-900/20 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-muted-foreground">
                      GL Bajaj Group of Institutions,
                      <br />
                      Mathura, Uttar Pradesh,
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="p-3 bg-muted rounded-full hover:bg-primary/10 transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="p-3 bg-muted rounded-full hover:bg-primary/10 transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="#" className="p-3 bg-muted rounded-full hover:bg-primary/10 transition-colors">
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-purple-900/30 bg-black shadow-lg shadow-purple-900/5">
              <CardHeader>
                <CardTitle>Hackathon Venue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-md overflow-hidden mb-4 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.812214088315!2d77.59791491505726!3d27.50449998287382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397376b67cce0b2d%3A0xf17ed1516bfb5a5!2sG%20L%20Bajaj%20Group%20of%20Institutions!5e0!3m2!1sen!2sin!4v1651234567890!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                </div>
                <p className="text-sm text-muted-foreground">
                  The Qubitx 2025 hackathon will be held at the GL Bajaj Group of Institutions campus.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border border-purple-900/30 bg-black shadow-lg shadow-purple-900/5">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name
                      </label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <VoiceInput inputId="name" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Your Email
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <VoiceInput inputId="email" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <div className="relative">
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        className="pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <VoiceInput inputId="subject" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <div className="relative">
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message here..."
                        rows={6}
                        value={formState.message}
                        onChange={handleChange}
                        required
                        className="pr-10"
                      />
                      <div className="absolute top-3 right-3">
                        <VoiceInput inputId="message" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button className="bg-purple-700 hover:bg-purple-800 w-full" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Sending...</span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Send className="h-4 w-4" />
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <span className="mr-2">Send Message</span>
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-md bg-green-500/10 text-green-500 flex items-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Your message has been sent successfully!</span>
                    </motion.div>
                  )}

                  {hasError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-md bg-red-500/10 text-red-500 flex items-center gap-2"
                    >
                      <AlertCircle className="h-5 w-5" />
                      <span>There was an error sending your message. Please try again.</span>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <Card className="border border-purple-900/30 bg-black shadow-lg shadow-purple-900/5">
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">How can I participate in the hackathon?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      To participate, you need to register on our platform, form a team of 2-4 members, and submit your
                      application before the registration deadline. Check the Events page for specific hackathon
                      details.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-purple-900/30 bg-black shadow-lg shadow-purple-900/5">
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">Is there a registration fee?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      No, participation in Qubitx 2025 is free of cost. However, there are limited offline slots
                      available, so make sure to register early.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-purple-900/30 bg-black shadow-lg shadow-purple-900/5">
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">How do I get support during the hackathon?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      During the hackathon, we provide on-site mentors and technical support. You can also use our AI
                      assistant for guidance or join the WhatsApp group for quick responses.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
