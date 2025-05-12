"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, User, ThumbsUp, MessageSquare, Share2, Bookmark, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Blog post data
const blogPosts = [
  {
    id: 1,
    title: "How Google's Hackathons Drive Innovation and Product Development",
    excerpt:
      "Discover how Google uses internal hackathons to foster innovation and develop new products like Gmail and Google Maps.",
    content: `
      Google has long been known for its innovative approach to product development, and one of the key drivers behind this innovation is their hackathon culture. These time-bound coding events have become a cornerstone of Google's creative process, allowing engineers and designers to step away from their regular projects and explore new ideas.

      ## The 20% Time Connection

      Google's hackathons are closely tied to their famous "20% time" policy, which encourages employees to spend 20% of their work time on projects that interest them personally. Many of these side projects begin during hackathons and later evolve into full-fledged Google products.

      ## Notable Products Born from Google Hackathons

      Several of Google's most successful products originated from hackathon projects:

      - **Gmail**: Paul Buchheit's email project began as a side project before becoming one of the world's most popular email services.
      - **Google Maps**: The initial prototype for what would become Google Maps was developed during a hackathon.
      - **Google News**: Krishna Bharat developed the first version during a hackathon following the September 11 attacks.

      ## How Google Structures Their Hackathons

      Google's hackathons typically run for 24-48 hours and follow a specific format:

      1. **Ideation**: Participants pitch ideas and form teams
      2. **Development**: Teams work intensively to create a prototype
      3. **Presentation**: Each team presents their project to judges and peers
      4. **Evaluation**: Projects are evaluated based on innovation, feasibility, and impact

      ## The Benefits Beyond Product Development

      Beyond just creating new products, Google's hackathons serve several important purposes:

      - **Skill Development**: Engineers learn new technologies and approaches
      - **Cross-Team Collaboration**: People from different departments work together
      - **Morale Boost**: Hackathons break routine and energize employees
      - **Talent Identification**: Management can identify high-potential employees

      ## Implementing Hackathons in Your Organization

      Organizations looking to replicate Google's success with hackathons should focus on:

      - Creating a safe environment for experimentation
      - Ensuring leadership support and participation
      - Providing adequate resources and time
      - Celebrating all participants, not just winners
      - Having a clear path for promising projects to receive further development

      Google's approach to hackathons demonstrates how structured innovation events can lead to breakthrough products while simultaneously improving company culture and employee satisfaction.
    `,
    author: {
      name: "Priya Sharma",
      avatar: "/abstract-geometric-shapes.png",
      role: "Tech Journalist",
    },
    company: "Google",
    category: "Tech Giants",
    tags: ["Innovation", "Product Development", "Corporate Culture"],
    publishedAt: "2023-11-15",
    readTime: "8 min read",
    likes: 342,
    comments: 57,
    image: "/google-innovation-space.png",
  },
  {
    id: 2,
    title: "Microsoft's Hackathon: The World's Largest Corporate Hackathon",
    excerpt:
      "An inside look at Microsoft's annual hackathon event that brings together over 70,000 employees worldwide.",
    content: `
      Microsoft's annual hackathon has earned the title of the world's largest private hackathon, with participation from over 70,000 employees across more than 80 countries. This massive event has become a cornerstone of Microsoft's innovation strategy and cultural transformation under CEO Satya Nadella.

      ## The Scale and Scope

      What makes Microsoft's hackathon particularly impressive is not just its size but its scope. Projects range from accessibility innovations to cutting-edge AI applications, from internal tools to consumer-facing products. The event transcends team boundaries, with participants from engineering, marketing, sales, and even legal departments coming together to collaborate.

      ## OneWeek: More Than Just a Hackathon

      Microsoft's hackathon is part of a larger event called "OneWeek," which serves as a company-wide celebration of innovation and collaboration. Beyond the hackathon itself, OneWeek includes:

      - Product showcases
      - Technical training sessions
      - Leadership talks
      - Cultural events

      ## Notable Success Stories

      Several significant Microsoft products and features have emerged from their hackathons:

      - **Xbox Adaptive Controller**: An accessible gaming controller designed for people with limited mobility
      - **Learning Tools for OneNote**: Features that help people with dyslexia and other reading disabilities
      - **Seeing AI**: A free app that narrates the world for people who are blind or have low vision

      ## The Garage: Turning Hackathon Projects into Products

      Microsoft's "Garage" program provides a pathway for promising hackathon projects to receive additional support and potentially become official products. The Garage offers:

      - Dedicated space and resources
      - Mentorship from senior leaders
      - User testing opportunities
      - A structured development process

      ## Cultural Impact

      Beyond the tangible products, Microsoft's hackathon has played a crucial role in the company's cultural transformation. It embodies Nadella's vision of a "growth mindset" culture where experimentation is encouraged and failure is seen as a learning opportunity.

      ## Virtual Adaptation

      In recent years, Microsoft has successfully adapted its hackathon to a virtual format, maintaining the spirit of collaboration despite physical distance. This transition has actually increased participation and diversity, allowing employees from more remote locations to fully engage.

      Microsoft's hackathon demonstrates how even the largest organizations can foster a culture of innovation through structured events that encourage cross-team collaboration and creative problem-solving.
    `,
    author: {
      name: "Marcus Chen",
      avatar: "/abstract-geometric-shapes.png",
      role: "Technology Analyst",
    },
    company: "Microsoft",
    category: "Tech Giants",
    tags: ["Corporate Hackathon", "Innovation Culture", "Accessibility"],
    publishedAt: "2023-10-22",
    readTime: "10 min read",
    likes: 287,
    comments: 43,
    image: "/placeholder.svg?key=6idf4",
  },
  {
    id: 3,
    title: "How Amazon Uses Hackathons to Solve Customer Problems",
    excerpt: "Amazon's customer-obsessed approach to hackathons has led to innovations like Prime Day and Amazon Go.",
    content: `
      At Amazon, hackathons take on a unique flavor that reflects the company's core value of customer obsession. Unlike many tech companies that focus primarily on technological innovation, Amazon's hackathons begin with a customer problem and work backward to find solutions.

      ## Customer Obsession in Practice

      Amazon's hackathon process typically starts with participants writing a mock press release and FAQ document for their proposed solution. This "working backward" approach ensures that all innovations are grounded in real customer needs rather than technology for technology's sake.

      ## Two-Pizza Teams

      Following Jeff Bezos's famous "two-pizza team" philosophy (if you can't feed a team with two pizzas, it's too large), Amazon's hackathon teams remain small and agile. This approach encourages:

      - Rapid decision-making
      - Clear ownership
      - Efficient communication
      - Maximum creativity

      ## Notable Innovations from Amazon Hackathons

      Several of Amazon's most successful initiatives began as hackathon projects:

      - **Prime Day**: The concept for Amazon's massive shopping event was initially developed during a hackathon focused on creating new shopping experiences.
      - **Amazon Go**: The initial concept for checkout-free shopping was explored during an internal innovation event.
      - **Alexa Skills**: Many of the early capabilities for Amazon's voice assistant emerged from hackathon projects.

      ## The "Just Do It" Award

      A unique feature of Amazon's hackathons is the "Just Do It" award, given to projects that teams implement without seeking management approval. This award embodies Amazon's leadership principle of "bias for action" and encourages employees to take initiative.

      ## Technical Deep Dives

      Amazon's hackathons often include specialized tracks focused on deep technical challenges:

      - **Infrastructure optimization**: Reducing costs and improving efficiency
      - **Machine learning applications**: Enhancing recommendation systems
      - **Supply chain innovations**: Improving delivery speed and accuracy

      ## Global Reach with Local Focus

      While Amazon runs global hackathons, they also encourage regional events that focus on local market challenges. This approach has led to innovations specifically tailored to different countries and cultures, helping Amazon adapt its services to diverse markets.

      ## Failure as a Feature

      In line with Bezos's philosophy that Amazon should be "the best place in the world to fail," hackathon participants are encouraged to take risks. Projects that don't succeed are celebrated for their learning value, creating a safe environment for bold experimentation.

      Amazon's approach to hackathons demonstrates how innovation events can be structured to maintain a relentless focus on customer needs while still encouraging creative technical solutions.
    `,
    author: {
      name: "Jordan Rivera",
      avatar: "/abstract-geometric-shapes.png",
      role: "E-commerce Specialist",
    },
    company: "Amazon",
    category: "Tech Giants",
    tags: ["Customer Experience", "E-commerce", "Innovation"],
    publishedAt: "2023-09-18",
    readTime: "9 min read",
    likes: 312,
    comments: 48,
    image: "/amazon-office-innovation.png",
  },
  {
    id: 4,
    title: "Meta's Hackathons: Building the Future of Social Connection",
    excerpt:
      "How Meta (formerly Facebook) uses hackathons to develop new features for its family of apps and explore the metaverse.",
    content: `
      Meta (formerly Facebook) has built a strong hackathon culture that has been instrumental in developing many of the features users now take for granted across its family of apps. From the Like button to Facebook Dark Mode, hackathons have played a crucial role in Meta's product development process.

      ## The History of Hackathons at Meta

      Mark Zuckerberg brought the hackathon culture to Facebook in its early days, inspired by the hacker culture at Harvard. What began as all-night coding sessions has evolved into a sophisticated innovation program that maintains the company's ability to move quickly despite its massive size.

      ## "Hack-a-Month"

      Meta has institutionalized innovation through its "Hack-a-Month" program, which allows engineers to spend one month working on a project outside their regular responsibilities. This program has become a pipeline for new features and products.

      ## Notable Features Born from Meta Hackathons

      Many of Meta's most recognizable features originated in hackathons:

      - **The Like Button**: Perhaps the most iconic Facebook feature was prototyped during a hackathon.
      - **Facebook Timeline**: The redesigned profile experience emerged from a hackathon.
      - **Instagram Stories**: The popular ephemeral content feature was developed during a hackathon.
      - **Facebook Dark Mode**: The eye-friendly interface option began as a hackathon project.

      ## Hackathons for Hardware

      Unlike many software companies, Meta extends its hackathon culture to hardware development:

      - **Oculus Innovations**: Many VR interface improvements have come from hackathons.
      - **Portal Features**: New capabilities for Meta's video calling device often emerge from hackathons.
      - **Ray-Ban Stories**: Features for Meta's smart glasses have been prototyped in hackathons.

      ## Metaverse Focus

      Recent Meta hackathons have increasingly focused on building for the metaverse:

      - **Virtual environments**: Creating more immersive and interactive spaces
      - **Avatar technology**: Improving the expressiveness and realism of digital avatars
      - **Cross-platform experiences**: Building features that work across VR, mobile, and web

      ## Hackathons as Recruiting Tools

      Meta has also used public hackathons as recruiting events, identifying talented engineers through their hackathon performances. These events serve as both innovation generators and talent acquisition opportunities.

      ## The Prototype-to-Product Pipeline

      Meta has developed a structured process for moving hackathon projects toward production:

      1. **Prototype Review**: Initial evaluation by product managers
      2. **User Testing**: Small-scale testing with real users
      3. **Product Integration**: Incorporation into the product roadmap
      4. **Full Deployment**: Release to all users

      Meta's approach to hackathons demonstrates how these events can be integrated into a company's broader product development strategy, creating a consistent pipeline of user-focused innovations.
    `,
    author: {
      name: "Alex Washington",
      avatar: "/abstract-geometric-shapes.png",
      role: "Social Media Analyst",
    },
    company: "Meta",
    category: "Tech Giants",
    tags: ["Social Media", "Metaverse", "Product Features"],
    publishedAt: "2023-08-30",
    readTime: "7 min read",
    likes: 276,
    comments: 39,
    image: "/meta-facebook-office.png",
  },
  {
    id: 5,
    title: "Netflix's Hack Day: Fostering Innovation in Streaming Technology",
    excerpt:
      "Inside Netflix's biannual Hack Day events that have led to improvements in streaming quality, recommendation algorithms, and more.",
    content: `
      Twice a year, Netflix engineers, designers, and product managers set aside their regular work to participate in "Hack Day," a 24-hour innovation sprint that has become a cornerstone of Netflix's engineering culture. These events have led to significant improvements in the streaming experience and have helped Netflix maintain its technological edge in the competitive streaming landscape.

      ## The Structure of Netflix Hack Day

      Netflix's Hack Day follows a relatively simple format:

      1. **Pitches**: Participants pitch ideas and form teams
      2. **24-Hour Sprint**: Teams work intensively to create working prototypes
      3. **Demos**: Each team presents their project to the entire company
      4. **Awards**: Projects receive recognition in various categories

      What makes Netflix's approach unique is that there's no expectation that Hack Day projects will become official features. Instead, the event is primarily about exploration, learning, and creative expression.

      ## Technical Innovation Categories

      Netflix Hack Day projects typically fall into several categories:

      - **Streaming Quality Improvements**: Enhancing video and audio delivery
      - **User Interface Experiments**: New ways to browse and interact with content
      - **Recommendation Algorithm Enhancements**: Better ways to suggest content
      - **Internal Tools**: Improving Netflix's development and operations processes
      - **Whimsical Projects**: Fun, creative ideas that might never be implemented but showcase creativity

      ## Notable Hack Day Projects

      Some of the most interesting projects from Netflix Hack Days include:

      - **Jump to Shark**: A feature that lets viewers of shark movies skip directly to shark scenes
      - **Netflix for Apple Watch**: An experimental interface for the smallest screen
      - **Eye Navigation**: Browsing Netflix using only eye movements
      - **The Mind Flayer**: Using a headset to control Netflix with thoughts
      - **Netflix Hangouts**: A feature that makes Netflix look like a conference call to help people watch at work (though never officially released)

      ## Public Sharing

      Unlike many companies that keep hackathon projects confidential, Netflix regularly shares videos of Hack Day projects on its tech blog and YouTube channel. This transparency serves several purposes:

      - Showcasing Netflix's innovative culture to potential recruits
      - Giving engineers public recognition for their creativity
      - Gathering public feedback on experimental concepts
      - Demonstrating Netflix's technical capabilities to the industry

      ## Impact on Netflix's Technology

      While many Hack Day projects don't become official features, elements of these projects often find their way into the product:

      - Improvements to Netflix's adaptive streaming technology
      - Enhancements to the recommendation system
      - Accessibility features for users with disabilities
      - Developer tools that improve Netflix's ability to ship code quickly

      ## Remote Adaptation

      In recent years, Netflix has successfully adapted Hack Day to remote and hybrid formats, maintaining the collaborative spirit despite physical distance. This adaptation has actually increased participation from Netflix's global offices.

      Netflix's approach to Hack Day demonstrates how innovation events can balance practical product improvements with creative exploration, all while strengthening company culture and technical capabilities.
    `,
    author: {
      name: "Sophia Rodriguez",
      avatar: "/abstract-geometric-shapes.png",
      role: "Entertainment Tech Writer",
    },
    company: "Netflix",
    category: "Entertainment",
    tags: ["Streaming Technology", "User Experience", "Entertainment"],
    publishedAt: "2023-07-12",
    readTime: "8 min read",
    likes: 298,
    comments: 45,
    image: "/netflix-office-technology.png",
  },
  {
    id: 6,
    title: "Spotify's Hack Week: Mixing Technology and Music Innovation",
    excerpt:
      "How Spotify's annual Hack Week leads to new features and keeps the music streaming platform on the cutting edge.",
    content: `
      Once a year, Spotify transforms its global offices into innovation labs during "Hack Week," a five-day event where employees set aside their regular work to explore new ideas. This extended hackathon format has become a crucial part of Spotify's innovation strategy, leading to new features and maintaining the company's position as a leader in music streaming technology.

      ## Why a Week Instead of a Day?

      Spotify deliberately extends its hackathon to a full week rather than the more common 24-48 hour format. This longer timeframe allows for:

      - More ambitious projects
      - Deeper collaboration between teams
      - Time for user testing and refinement
      - Greater work-life balance during the event

      ## The Spotify Hack Week Process

      Spotify's Hack Week follows a structured process:

      1. **Ideation Portal**: Employees submit ideas to an internal platform weeks before the event
      2. **Team Formation**: People join projects that interest them, creating cross-functional teams
      3. **Five-Day Sprint**: Teams work intensively on their projects
      4. **Demo Day**: Projects are presented to the entire company
      5. **Hack Awards**: Recognition in categories like "Most Likely to Ship" and "People's Choice"

      ## Music Meets Technology

      What makes Spotify's Hack Week unique is the intersection of music and technology. Projects often explore:

      - New ways to discover music
      - Enhanced audio experiences
      - Artist-focused tools and features
      - Data visualization of listening habits
      - Experimental music creation tools

      ## Notable Features Born from Hack Week

      Several of Spotify's popular features originated during Hack Week:

      - **Spotify Wrapped**: The year-end personalized listening summary began as a Hack Week project
      - **Time Capsule**: Personalized nostalgic playlists
      - **Group Session**: Collaborative listening feature
      - **Canvas**: The looping visuals that accompany songs

      ## Beyond Product Features

      Spotify's Hack Week also generates innovations beyond consumer-facing features:

      - **Internal Tools**: Improving Spotify's development and content management systems
      - **Sustainability Initiatives**: Reducing the environmental impact of streaming
      - **Accessibility Improvements**: Making Spotify more usable for people with disabilities
      - **Data Science Models**: Enhancing recommendation algorithms

      ## Global Collaboration

      With offices around the world, Spotify's Hack Week creates opportunities for global collaboration. Teams often span multiple countries and time zones, bringing diverse perspectives to projects.

      ## The "Ship It" Pipeline

      Spotify has developed a structured process for moving promising Hack Week projects toward production:

      1. **Hack Week Highlights**: Projects selected for further development
      2. **Product Integration**: Alignment with product roadmaps
      3. **Refinement**: Additional development and testing
      4. **Gradual Rollout**: Testing with limited user groups before full release

      Spotify's approach to Hack Week demonstrates how extended hackathons can generate significant innovations while also strengthening company culture and cross-team collaboration.
    `,
    author: {
      name: "Daniel Kim",
      avatar: "/abstract-geometric-shapes.png",
      role: "Music Technology Analyst",
    },
    company: "Spotify",
    category: "Entertainment",
    tags: ["Music Streaming", "Audio Technology", "User Experience"],
    publishedAt: "2023-06-28",
    readTime: "9 min read",
    likes: 324,
    comments: 51,
    image: "/placeholder.svg?height=400&width=600&query=spotify%20office%20music%20technology",
  },
  {
    id: 7,
    title: "Airbnb's Hackathons: Reimagining the Travel Experience",
    excerpt:
      "How Airbnb uses hackathons to develop new features and address unique challenges in the travel and hospitality industry.",
    content: `
      Airbnb has built a strong culture of innovation through its quarterly hackathons, which have been instrumental in developing many of the features that have transformed the travel and hospitality industry. These events reflect Airbnb's commitment to creativity and its unique position at the intersection of technology, design, and human connection.

      ## The "One Airbnb" Approach

      Airbnb's hackathons are notable for their cross-functional nature. Rather than being primarily engineering events, they bring together:

      - Engineers
      - Designers
      - Data scientists
      - Product managers
      - Customer service representatives
      - Policy experts

      This diverse participation ensures that hackathon projects address real user needs from multiple perspectives.

      ## Quarterly Cadence

      Unlike many companies that hold annual hackathons, Airbnb runs these events quarterly. This frequent cadence:

      - Maintains innovation as an ongoing priority
      - Allows for seasonal focus areas
      - Creates regular opportunities for cross-team collaboration
      - Provides multiple chances for employees to participate each year

      ## Notable Features Born from Airbnb Hackathons

      Several of Airbnb's most popular features originated in hackathons:

      - **Wish Lists**: The feature allowing users to save and share favorite listings
      - **Smart Pricing**: Tools that help hosts optimize their pricing
      - **Split Payments**: The ability for groups to split the cost of a stay
      - **Experiences**: The expansion beyond home rentals into local activities

      ## Design-Led Innovation

      Reflecting Airbnb's strong design culture, its hackathons place unusual emphasis on user experience. Projects are evaluated not just on technical implementation but on:

      - User interface design
      - Accessibility
      - Alignment with Airbnb's visual language
      - Emotional impact on users

      ## Crisis-Driven Innovation

      Some of Airbnb's most impactful hackathon projects have emerged during crises:

      - **Open Homes**: The program offering free accommodation during disasters began during a hackathon
      - **Online Experiences**: Virtual activities developed during a pandemic-focused hackathon
      - **Flexible Dates**: Search features that emerged from a hackathon focused on travel recovery

      ## The "Snow White" Method

      Airbnb hackathons often employ the company's "Snow White" method, where teams storyboard the perfect user experience before writing any code. This approach ensures that technical solutions are grounded in human needs and storytelling.

      ## From Prototype to Product

      Airbnb has developed a structured process for advancing hackathon projects:

      1. **Demo Day Voting**: The entire company votes on their favorite projects
      2. **Product Review**: Leadership evaluates top projects for strategic fit
      3. **Incubation**: Selected projects receive resources for further development
      4. **Productization**: Integration into Airbnb's roadmap and eventual release

      Airbnb's approach to hackathons demonstrates how these events can balance technical innovation with design thinking and human-centered problem solving.
    `,
    author: {
      name: "Elena Patel",
      avatar: "/abstract-geometric-shapes.png",
      role: "Travel Tech Analyst",
    },
    company: "Airbnb",
    category: "Travel & Hospitality",
    tags: ["Travel Technology", "User Experience", "Hospitality"],
    publishedAt: "2023-05-19",
    readTime: "8 min read",
    likes: 287,
    comments: 42,
    image: "/placeholder.svg?height=400&width=600&query=airbnb%20office%20travel%20innovation",
  },
  {
    id: 8,
    title: "IBM's Call for Code: Hackathons with Global Impact",
    excerpt:
      "How IBM's Call for Code hackathons are addressing climate change and disaster response through technology.",
    content: `
      IBM's Call for Code represents a different approach to hackathons—one focused on solving humanitarian challenges rather than developing commercial products. Launched in 2018 in partnership with the United Nations Human Rights Office and the Linux Foundation, this global initiative has mobilized more than 500,000 developers across 180 nations to create technology solutions for pressing global issues.

      ## Beyond Commercial Innovation

      Unlike traditional corporate hackathons that focus on product development, Call for Code directs technical talent toward humanitarian challenges:

      - Climate change mitigation and adaptation
      - Natural disaster preparedness and recovery
      - COVID-19 response
      - Racial justice
      - Clean water and sanitation

      ## The Global Challenge Format

      Call for Code operates as a global competition with significant resources behind it:

      1. **Annual Theme**: Each year focuses on specific humanitarian challenges
      2. **Learning Resources**: IBM provides educational materials on relevant technologies
      3. **Mentorship**: Participants receive guidance from experts
      4. **Substantial Prizes**: Winners receive funding and implementation support
      5. **Deployment Pathway**: Winning solutions are deployed in affected communities

      ## Technology Stack Focus

      While participants can use any technologies, IBM provides special support for solutions using:

      - Cloud computing (IBM Cloud)
      - Artificial intelligence (Watson)
      - Blockchain
      - IoT and edge computing
      - Data science tools

      ## Notable Winning Projects

      Call for Code has produced several impactful solutions:

      - **Project Owl**: A disaster communication system using LoRa wireless networks
      - **Prometeo**: IoT devices that monitor firefighter health and safety
      - **Agrolly**: Climate and crop disease forecasting for small farmers
      - **Saaf Water**: Water quality monitoring using IoT sensors
      - **Gyaan**: An educational platform that functions without internet access

      ## Implementation and Deployment

      What sets Call for Code apart from many hackathons is its focus on real-world implementation:

      - Winning solutions receive up to $200,000 in funding
      - IBM provides technical support for deployment
      - The Linux Foundation helps open-source the code
      - UN Human Rights and other partners help deploy solutions in communities
      - IBM Service Corps volunteers assist with implementation

      ## Year-Round Engagement

      Beyond the annual global challenge, Call for Code maintains engagement through:

      - Regional events focused on local issues
      - University-specific challenges
      - Corporate employee engagement programs
      - Ongoing development support for past winners

      ## Measuring Impact

      IBM tracks the real-world impact of Call for Code solutions:

      - Number of people benefiting from deployed solutions
      - Environmental metrics like carbon reduction
      - Community resilience improvements
      - Knowledge and technology transfer to affected regions

      IBM's Call for Code demonstrates how hackathons can be structured to address societal challenges while still driving technical innovation and providing valuable experiences for participants.
    `,
    author: {
      name: "Omar Hassan",
      avatar: "/abstract-geometric-shapes.png",
      role: "Social Impact Technology Specialist",
    },
    company: "IBM",
    category: "Social Impact",
    tags: ["Climate Tech", "Disaster Response", "Social Impact"],
    publishedAt: "2023-04-05",
    readTime: "10 min read",
    likes: 356,
    comments: 63,
    image: "/placeholder.svg?height=400&width=600&query=ibm%20call%20for%20code%20hackathon",
  },
  {
    id: 9,
    title: "Salesforce's Hackathons: Building the Future of CRM",
    excerpt: "How Salesforce uses hackathons to innovate in customer relationship management and cloud computing.",
    content: `
      Salesforce has integrated hackathons into its innovation strategy in ways that reflect its position as a leader in customer relationship management (CRM) and cloud computing. These events have become important venues for developing new features, exploring emerging technologies, and strengthening the company's developer ecosystem.

      ## Internal and External Innovation

      Salesforce runs two distinct types of hackathons:

      - **Internal Hackathons**: For Salesforce employees to develop new product features
      - **Community Hackathons**: For customers, partners, and independent developers to build on the Salesforce platform

      This dual approach allows Salesforce to innovate both its core products and its broader ecosystem simultaneously.

      ## Dreamforce Hackathons

      The highest-profile Salesforce hackathons take place during Dreamforce, the company's annual conference. These events feature:

      - Substantial prizes (sometimes exceeding $1 million)
      - High-visibility demos to industry leaders
      - Focused themes around emerging technologies
      - Participation from thousands of developers

      ## TrailblazerDX Developer Conference

      Salesforce also runs specialized hackathons during its TrailblazerDX developer conference, focusing on:

      - Technical deep dives
      - Platform extensibility
      - Developer experience improvements
      - Integration capabilities

      ## Notable Innovations from Salesforce Hackathons

      Several significant Salesforce capabilities originated in hackathons:

      - **Einstein Voice**: Voice interface capabilities for Salesforce
      - **Lightning Web Components**: The framework for building custom interfaces
      - **Process Builder Enhancements**: Workflow automation improvements
      - **Mobile Offline Capabilities**: Features enabling offline use of Salesforce

      ## Industry-Specific Focus

      Salesforce often structures its hackathons around industry verticals:

      - Healthcare and life sciences
      - Financial services
      - Retail and consumer goods
      - Manufacturing
      - Nonprofit and education

      This approach ensures that innovations address the specific needs of different customer segments.

      ## The AppExchange Connection

      A unique aspect of Salesforce hackathons is their connection to AppExchange, the company's app marketplace. Promising hackathon projects often become:

      - Commercial apps listed on AppExchange
      - Open-source tools for the Salesforce community
      - Features integrated into Salesforce's core products

      This creates a clear pathway from hackathon prototype to commercial opportunity.

      ## Trailhead Integration

      Salesforce integrates its hackathons with Trailhead, its learning platform:

      - Pre-hackathon training modules
      - Skill-building challenges
      - Credentials for hackathon participation
      - Post-event learning pathways

      This integration ensures that participants have the skills needed to build effective solutions.

      ## The "Demo Jam" Format

      In addition to traditional hackathons, Salesforce runs "Demo Jams"—rapid-fire demo competitions where participants have just a few minutes to showcase their innovations. This format:

      - Forces concise, impactful presentations
      - Allows for more projects to be showcased
      - Creates an engaging, high-energy environment
      - Emphasizes real-world applicability

      Salesforce's approach to hackathons demonstrates how these events can simultaneously drive product innovation, ecosystem growth, and developer engagement.
    `,
    author: {
      name: "Jasmine Taylor",
      avatar: "/abstract-geometric-shapes.png",
      role: "CRM Technology Analyst",
    },
    company: "Salesforce",
    category: "Enterprise Software",
    tags: ["CRM", "Cloud Computing", "Enterprise Software"],
    publishedAt: "2023-03-14",
    readTime: "9 min read",
    likes: 278,
    comments: 47,
    image: "/placeholder.svg?height=400&width=600&query=salesforce%20office%20cloud%20computing",
  },
  {
    id: 10,
    title: "Apple's Internal Hackathons: Secrecy and Innovation",
    excerpt:
      "A rare glimpse into Apple's secretive internal hackathons and how they contribute to product development.",
    content: `
      Apple is known for its secrecy, and its internal hackathons are no exception. Unlike companies that publicize their hackathons, Apple keeps these innovation events tightly under wraps. However, through interviews with former employees and occasional public mentions, we can piece together how Apple uses hackathons to maintain its reputation for groundbreaking products.

      ## The Secrecy Factor

      Apple's hackathons differ from those at other tech giants in several key ways:

      - They're rarely mentioned publicly
      - Participants sign additional confidentiality agreements
      - Projects are compartmentalized
      - Results aren't shared outside the company
      - Even internal documentation is limited

      This approach aligns with Apple's broader culture of secrecy and surprise.

      ## Functional vs. Cross-Functional Events

      Apple runs two main types of internal hackathons:

      - **Functional Hackathons**: Within specific teams like iOS, macOS, or Apple Services
      - **Cross-Functional Challenges**: Bringing together hardware, software, and design teams

      This dual approach allows for both deep technical exploration and holistic product innovation.

      ## The "Directly Responsible Individual"

      In line with Apple's organizational philosophy, each hackathon project has a "Directly Responsible Individual" (DRI) who owns the concept from ideation through potential implementation. This accountability ensures that promising ideas have a champion within the organization.

      ## Hardware-Software Integration

      Unlike purely software-focused hackathons at many companies, Apple's events often explore the integration of hardware and software. This might include:

      - New uses for device sensors
      - Novel interaction methods
      - Accessibility innovations
      - Power management optimizations
      - Cross-device experiences

      ## Design-Led Approach

      Reflecting Apple's design-centric culture, its hackathons place unusual emphasis on user experience. Projects are evaluated not just on technical merit but on:

      - Simplicity and intuitiveness
      - Aesthetic quality
      - Alignment with Apple's design language
      - "Surprise and delight" factor

      ## From Hackathon to Product

      While Apple doesn't publicly attribute features to hackathons, former employees have suggested that several notable capabilities originated in these events:

      - Certain Siri functionalities
      - Specific Accessibility features
      - Elements of Apple's health and fitness offerings
      - Aspects of AirDrop and Continuity

      ## The Executive Review

      The most promising hackathon projects at Apple reportedly receive review from senior executives, sometimes including the CEO. This high-level attention creates strong incentives for participation and ensures that innovative ideas can quickly receive resources for further development.

      ## Talent Identification

      Beyond product innovation, Apple's hackathons serve as talent identification opportunities. Engineers and designers who excel during these events often receive recognition that accelerates their career advancement within the company.

      ## The "20% Time" Connection

      While Apple doesn't have a formal "20% time" policy like Google, its hackathons provide a structured opportunity for employees to explore ideas outside their regular responsibilities. This creates a balance between Apple's focused execution and the need for creative exploration.

      Apple's secretive approach to hackathons demonstrates how these events can be effective even without the public recognition and external validation that characterizes hackathons at many other companies.
    `,
    author: {
      name: "Michael Zhang",
      avatar: "/abstract-geometric-shapes.png",
      role: "Consumer Technology Analyst",
    },
    company: "Apple",
    category: "Tech Giants",
    tags: ["Product Design", "Hardware Innovation", "Consumer Technology"],
    publishedAt: "2023-02-28",
    readTime: "8 min read",
    likes: 342,
    comments: 56,
    image: "/placeholder.svg?height=400&width=600&query=apple%20campus%20innovation",
  },
]

// Categories for filtering
const categories = [
  { value: "all", label: "All Categories" },
  { value: "Tech Giants", label: "Tech Giants" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Travel & Hospitality", label: "Travel & Hospitality" },
  { value: "Social Impact", label: "Social Impact" },
  { value: "Enterprise Software", label: "Enterprise Software" },
]

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentTab, setCurrentTab] = useState("latest")

  // Filter blogs based on search query and category
  const filteredBlogs = blogPosts.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Sort blogs based on current tab
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (currentTab === "latest") {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    } else if (currentTab === "popular") {
      return b.likes - a.likes
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            Tech Company Blogs
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover insights about how leading tech companies use hackathons and innovation events to drive product
            development and foster creativity.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search blogs..."
              className="pl-10 bg-gray-900 border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="latest" className="mb-8" onValueChange={setCurrentTab}>
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="latest" className="data-[state=active]:bg-purple-700">
              Latest
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-purple-700">
              Popular
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sortedBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors"
            >
              <div className="relative h-48">
                <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-purple-700 hover:bg-purple-800">{blog.company}</Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={blog.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs text-gray-400">{blog.author.name}</div>
                </div>
                <CardTitle className="text-xl line-clamp-2">{blog.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-400 text-sm line-clamp-3">{blog.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{blog.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{blog.comments}</span>
                  </div>
                </div>
                <Link href={`/blogs/${blog.id}`}>
                  <Button variant="link" className="text-purple-400 p-0">
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Featured Blog */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Featured Article</h2>
          <Card className="bg-gray-900 border-gray-800 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 relative h-64 lg:h-auto">
                <Image
                  src="/placeholder.svg?height=600&width=800&query=tech%20company%20innovation%20hackathon"
                  alt="Featured Blog"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-3 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-purple-700 hover:bg-purple-800">Featured</Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Innovation
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  The Evolution of Hackathons: From Coding Marathons to Strategic Innovation Tools
                </h3>
                <p className="text-gray-400 mb-6">
                  How tech giants transformed casual coding events into powerful engines of product development and
                  cultural transformation. Discover the methodologies and approaches that make modern hackathons
                  effective across different industries.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar>
                    <AvatarImage src="/abstract-geometric-shapes.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Dr. Jamie Donovan</div>
                    <div className="text-sm text-gray-400">Innovation Researcher, MIT</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>March 15, 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>12 min read</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="border-gray-700">
                    Hackathons
                  </Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Innovation
                  </Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Tech Culture
                  </Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Product Development
                  </Badge>
                </div>
                <div className="flex gap-4">
                  <Button className="bg-purple-700 hover:bg-purple-800">Read Full Article</Button>
                  <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                  <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                    <Bookmark className="h-4 w-4 mr-2" /> Save
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30 mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Subscribe to Our Newsletter</h3>
                <p className="text-gray-300 mb-6">
                  Get the latest articles, insights, and updates about tech innovation and hackathons delivered directly
                  to your inbox.
                </p>
                <div className="flex gap-2">
                  <Input placeholder="Enter your email" className="bg-black/50 border-purple-900/50" />
                  <Button className="bg-purple-700 hover:bg-purple-800 whitespace-nowrap">Subscribe</Button>
                </div>
              </div>
              <div className="hidden md:block relative h-48">
                <Image
                  src="/placeholder.svg?height=300&width=400&query=tech%20newsletter%20digital%20concept"
                  alt="Newsletter"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
