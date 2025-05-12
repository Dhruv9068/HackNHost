import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ArrowRight, Calendar, Users, Award, Code, Zap } from "lucide-react"
import HeroAnimation from "../components/hero-animation"
import FeatureCard from "../components/feature-card"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background text-foreground overflow-hidden">
        <div className="absolute inset-0">
          <HeroAnimation />
        </div>
        <div className="hero-gradient absolute inset-0"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Revolutionize Your <span className="gradient-text">Tech Events</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                HackNHost streamlines event organization, enhances attendee engagement, and provides cutting-edge
                technology for a flawless experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-brand-teal-500 text-primary-foreground hover:bg-brand-teal-600">
                  <Link to="/events/create" className="flex items-center gap-2">
                    Create Event <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-brand-teal-500 hover:bg-brand-teal-900/20">
                  <Link to="/events" className="flex items-center gap-2">
                    Explore Events <Calendar size={18} />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden gradient-border">
                <div className="absolute inset-0 bg-card/50 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-2xl font-bold mb-2 gradient-text">Immersive Experiences</h3>
                    <p className="text-muted-foreground mb-4">VR & AR technology for next-gen events</p>
                    <div className="flex justify-center">
                      <div className="animate-float">
                        <div className="w-16 h-16 border border-brand-teal-500/50 rounded-full flex items-center justify-center">
                          <div className="w-12 h-12 border border-brand-cyan-500/50 rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 border border-brand-gold-500/50 rounded-full flex items-center justify-center">
                              <div className="w-4 h-4 bg-brand-teal-500 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Events</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to organize, manage, and elevate your tech events
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-brand-teal-400" />}
              title="Easy Event Setup"
              description="Create and customize your event in minutes with our intuitive interface"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-brand-teal-400" />}
              title="One-Click Registration"
              description="Streamline the sign-up process with social authentication"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-brand-teal-400" />}
              title="Smart Team Formation"
              description="Connect participants based on skills and interests"
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-brand-teal-400" />}
              title="Project Submissions & Judging"
              description="Manage submissions and multi-stage judging workflows"
            />
            <FeatureCard
              icon={<Code className="h-8 w-8 text-brand-teal-400" />}
              title="VR/AR Experiences"
              description="Immersive venue showcases and interactive AR content"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-brand-teal-400" />}
              title="Recruitment Integration"
              description="Connect talent with opportunities through resume-based matching"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-teal-900/50 to-brand-cyan-900/50 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Host Your Next Tech Event?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Join hundreds of event organizers who have transformed their hackathons and conferences with HackNHost.
          </p>
          <Button size="lg" className="bg-brand-gold-500 text-primary-foreground hover:bg-brand-gold-600">
            <Link to="/register" className="flex items-center gap-2">
              Get Started Today <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
