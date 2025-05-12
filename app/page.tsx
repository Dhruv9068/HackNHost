"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  Stars,
  Text3D,
  Float,
  Html,
  Environment,
  Sparkles,
  MeshDistortMaterial,
  GradientTexture,
  RoundedBox,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Code, Users, Trophy, Calendar, ChevronDown } from "lucide-react"
import type * as THREE from "three"
import { useRouter } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

// Animated floating cube component
function FloatingCube({ position, size = 1, color = "#6d28d9", speed = 1, distort = 0.3 }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.2) * 0.3
    mesh.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.003
  })

  return (
    <mesh ref={mesh} position={position}>
      <RoundedBox args={[size, size, size]} radius={0.1} smoothness={4}>
        <MeshDistortMaterial color={color} speed={3} distort={distort} metalness={0.6} roughness={0.2}>
          <GradientTexture stops={[0, 1]} colors={["#8b5cf6", "#6d28d9"]} size={1024} />
        </MeshDistortMaterial>
      </RoundedBox>
    </mesh>
  )
}

// Animated floating sphere component
function FloatingSphere({ position, radius = 1, color = "#6d28d9", speed = 1, distort = 0.3 }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.2) * 0.3
    mesh.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.003
  })

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        speed={3}
        distort={distort}
        envMapIntensity={0.8}
        clearcoat={0.8}
        metalness={0.2}
        roughness={0.2}
      />
    </mesh>
  )
}

// Animated text component
function AnimatedText({ text, position, size = 0.5, color = "#ffffff" }) {
  const textRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!textRef.current) return
    textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    textRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.002
  })

  return (
    <Text3D
      ref={textRef}
      font="/fonts/Inter_Bold.json"
      position={position}
      size={size}
      height={0.1}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.02}
      bevelOffset={0}
      bevelSegments={5}
    >
      {text}
      <meshStandardMaterial color={color} emissive="#6d28d9" emissiveIntensity={0.5} toneMapped={false} />
    </Text3D>
  )
}

// Main hero scene component
function HeroScene() {
  const { camera } = useThree()
  const [hovered, setHovered] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  // Set initial camera position
  useEffect(() => {
    if (isMobile) {
      camera.position.set(0, 0, 15) // Move camera further back on mobile
    } else {
      camera.position.set(0, 0, 10)
    }
  }, [camera, isMobile])

  const handleExploreClick = (e) => {
    e.preventDefault()
    router.push("/events")
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#6d28d9" />

      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="night" />
      <Sparkles count={100} scale={15} size={2} speed={0.3} opacity={0.5} />

      {/* Main objects */}
      <group scale={isMobile ? 0.7 : 1}>
        {/* Central sphere */}
        <FloatingSphere position={[0, 0, 0]} radius={2} color="#6d28d9" speed={0.8} distort={0.2} />

        {/* Orbiting objects */}
        <FloatingCube position={[-4, 1, 2]} size={0.8} color="#8b5cf6" speed={1.2} />
        <FloatingCube position={[4, -1, -1]} size={0.6} color="#a78bfa" speed={0.9} />
        <FloatingSphere position={[3, 2, -2]} radius={0.5} color="#c4b5fd" speed={1.5} />
        <FloatingSphere position={[-3, -2, 1]} radius={0.7} color="#7c3aed" speed={1.1} />

        {/* 3D Text */}
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <AnimatedText text="HackNHost" position={[-3.5, 0, 3]} size={0.8} />
        </Float>

        {/* HTML content inside 3D scene */}
        <Html position={[0, -2.5, 0]} transform distanceFactor={10}>
          <div className="w-80 text-center bg-black/80 p-5 rounded-lg backdrop-blur-md border border-purple-900/50">
            <h2 className="text-white text-xl font-bold mb-3">Join the next hackathon</h2>
            <p className="text-gray-300 text-sm mb-4">
              Explore events and showcase your skills in our immersive platform
            </p>
            <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white" onClick={handleExploreClick}>
              Explore Events
            </Button>
          </div>
        </Html>
      </group>
    </>
  )
}

function AboutSection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            About HackNHost
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            HackNHost is a revolutionary platform that combines hackathons with immersive experiences. We provide tools
            for organizers to host events and participants to showcase their skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <motion.div
            className="p-8 border border-purple-900/30 rounded-xl bg-black/60 backdrop-blur-sm shadow-lg shadow-purple-900/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 p-4 bg-purple-900/20 rounded-full w-fit">
              <Code className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">For Developers</h3>
            <p className="text-gray-400">
              Participate in hackathons, showcase your skills, and connect with like-minded developers. Build innovative
              solutions and win exciting prizes.
            </p>
          </motion.div>

          <motion.div
            className="p-8 border border-purple-900/30 rounded-xl bg-black/60 backdrop-blur-sm shadow-lg shadow-purple-900/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 p-4 bg-purple-900/20 rounded-full w-fit">
              <Users className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">For Organizers</h3>
            <p className="text-gray-400">
              Host hackathons, manage participants, and create immersive experiences for attendees. Our platform
              provides all the tools you need.
            </p>
          </motion.div>

          <motion.div
            className="p-8 border border-purple-900/30 rounded-xl bg-black/60 backdrop-blur-sm shadow-lg shadow-purple-900/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 p-4 bg-purple-900/20 rounded-full w-fit">
              <Trophy className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">For Sponsors</h3>
            <p className="text-gray-400">
              Connect with talented developers, promote your brand, and discover innovative solutions. Sponsor
              hackathons and find your next big idea.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function UseCasesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            Use Cases
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Discover how HackNHost can transform your hackathon experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            className="flex flex-col md:flex-row gap-8 items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="p-5 bg-purple-900/20 rounded-full">
              <Calendar className="h-10 w-10 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Virtual Hackathons</h3>
              <p className="text-gray-400 mb-6 text-lg">
                Host completely virtual hackathons with our platform. Manage registrations, submissions, and judging all
                in one place.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-6 w-6 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Seamless participant registration and team formation</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-6 w-6 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Integrated project submission and evaluation</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-6 w-6 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Live leaderboards and announcements</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row gap-8 items-start"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="p-5 bg-purple-900/20 rounded-full">
              <Users className="h-10 w-10 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Hybrid Events</h3>
              <p className="text-gray-400 mb-6 text-lg">
                Combine in-person and virtual experiences with our hybrid event solutions. Perfect for global
                participation.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-6 w-6 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">VR venue exploration for remote participants</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-6 w-6 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Live streaming of in-person activities</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-6 w-6 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Collaborative tools for mixed teams</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function VideoSection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            See HackNHost in Action
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Watch our demo video to see how HackNHost can transform your hackathon experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-purple-900/30">
          <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-black flex items-center justify-center">
            <div className="text-center p-10">
              <div className="w-20 h-20 rounded-full bg-purple-700/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xl font-medium text-white mb-4">Demo Video</p>
              <p className="text-gray-400 mb-8">1-minute demonstration of HackNHost features</p>
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                Watch Full Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-purple-950/20 to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            Ready to Host Your Next Hackathon?
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
            Join HackNHost today and transform your hackathon experience with our immersive platform. Get started for
            free and explore all the features.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="px-10 py-6 text-lg bg-purple-700 hover:bg-purple-800">
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-6 text-lg border-purple-500 text-purple-400 hover:bg-purple-900/20"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  return (
    <div className="min-h-screen bg-black">
      {/* 3D Hero Section */}
      <div className={`${isMobile ? "h-[90vh]" : "h-screen"} relative`}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
          <HeroScene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            className="flex flex-col items-center cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            onClick={() => {
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <p className="text-gray-400 mb-2">Scroll to explore</p>
            <ChevronDown className="h-6 w-6 text-purple-500" />
          </motion.div>
        </motion.div>
      </div>

      {/* About Section */}
      <div id="about">
        <AboutSection />
      </div>

      {/* Use Cases */}
      <UseCasesSection />

      {/* Video Demo */}
      <VideoSection />

      {/* CTA */}
      <CTASection />
    </div>
  )
}
