// General platform questions and answers
export const trainingData = [
  {
    question: "What is HackNHost?",
    answer:
      "HackNHost is a comprehensive platform designed to simplify the organization and management of hackathons. It provides tools for event creation, participant registration, team formation, project submission, and judging. The platform also offers unique features like VR venue exploration and AI-powered assistance for both organizers and participants.",
  },
  {
    question: "How do I create a hackathon?",
    answer:
      "To create a hackathon on HackNHost, log in to your organizer account, click on 'Create New Hackathon' button on the dashboard or My Events page. Fill in the required details such as event title, description, location, dates, and judging criteria. You can also customize registration forms, set eligibility requirements, and upload event images. Once submitted, your hackathon will be published and open for registrations.",
  },
  {
    question: "How do I register for a hackathon?",
    answer:
      "To register for a hackathon, browse the events page and select the hackathon you're interested in. Click on the 'Register Now' button on the event details page. You'll need to fill out the registration form with your team name, team size, and project idea. Once submitted, you'll receive a confirmation and your registration will be pending approval from the organizers (unless auto-approval is enabled).",
  },
  {
    question: "What is the VR venue exploration feature?",
    answer:
      "The VR venue exploration feature allows participants to virtually explore the hackathon venue before the event. This helps participants familiarize themselves with the location, find important areas like workspaces, refreshment zones, and presentation stages. Organizers can customize the VR environment to match their actual venue or create an entirely virtual space for remote hackathons.",
  },
  {
    question: "How does the judging system work?",
    answer:
      "HackNHost's judging system allows organizers to set custom judging criteria with different weightages (e.g., technical implementation, innovation, impact, presentation). Judges can access submitted projects, review them based on the criteria, and provide scores and feedback. The platform automatically calculates final scores and rankings. Organizers can view detailed analytics and export results for announcement.",
  },
  {
    question: "Can I organize a virtual hackathon?",
    answer:
      "Yes, HackNHost fully supports virtual hackathons. When creating your event, simply check the 'This is a virtual event' option. You can provide links to video conferencing platforms, set up virtual team collaboration spaces, and use our VR feature to create an immersive virtual venue. The platform handles remote registrations, project submissions, and virtual judging seamlessly.",
  },
  {
    question: "How do teams submit their projects?",
    answer:
      "Teams can submit their projects through the project submission portal accessible from their dashboard. The submission form allows teams to provide a project title, description, GitHub repository link, demo link, presentation slides, and screenshots or videos. Teams can edit their submissions until the submission deadline set by the organizers.",
  },
  {
    question: "What analytics are available for organizers?",
    answer:
      "Organizers have access to comprehensive analytics including registration trends, participant demographics, skill distribution, team formation statistics, project submission rates, and judging progress. The analytics dashboard provides visual representations of data to help organizers track event progress, identify areas for improvement, and make data-driven decisions.",
  },
  {
    question: "How can participants find team members?",
    answer:
      "Participants can use the team formation feature to find team members. They can create a team profile specifying the skills they're looking for, browse through profiles of other participants looking for teams, and send team invitations. Alternatively, participants can join the event's community chat or forum to connect with potential teammates.",
  },
  {
    question: "What resources are available for hackathon participants?",
    answer:
      "HackNHost provides various resources for participants including starter code templates, API documentation, design assets, judging criteria guidelines, presentation templates, and links to useful tools and services. Organizers can customize and add specific resources relevant to their hackathon theme or tracks.",
  },
]

// Additional training data for specific features
export const featureTrainingData = [
  {
    question: "Tell me about the leaderboard feature",
    answer:
      "The leaderboard feature displays real-time rankings of teams or projects based on judging scores. It can be customized to show overall rankings or rankings by specific tracks or categories. Organizers can choose when to make the leaderboard visible to participants. The leaderboard updates automatically as judges submit their scores.",
  },
  {
    question: "How does the registration approval process work?",
    answer:
      "Organizers can choose between automatic approval or manual review of registrations. With manual approval, organizers receive notifications of new registrations and can review participant details before approving or rejecting them. The approval dashboard shows pending, approved, and rejected applications with filtering and search capabilities.",
  },
  {
    question: "What is the team formation feature?",
    answer:
      "The team formation feature helps participants find teammates with complementary skills. Participants can create profiles listing their skills and interests, browse through available participants, and send team invitations. The feature also includes a team chat for communication and a team dashboard for managing team members and project details.",
  },
  {
    question: "How does the project submission system work?",
    answer:
      "The project submission system allows teams to submit their projects before the deadline. Teams can provide project details, upload files (code, presentations, videos), add links to repositories or demos, and include team member information. Organizers can customize the submission form to collect specific information relevant to their hackathon.",
  },
  {
    question: "What is the mentor matching feature?",
    answer:
      "The mentor matching feature connects participants with industry experts who can provide guidance during the hackathon. Mentors can set their availability and areas of expertise, while participants can book sessions based on their needs. The system includes video conferencing integration and feedback mechanisms for both mentors and participants.",
  },
  {
    question: "How does the prize distribution work?",
    answer:
      "The prize distribution system allows organizers to set up multiple prize categories with different award values. After judging is complete, the system automatically identifies winners based on scores. Organizers can then distribute prizes through various methods including digital gift cards, direct transfers, or physical prizes. The system keeps track of prize distribution status and sends notifications to winners.",
  },
]

// Topics and technologies
export const hackathonTopicsData = [
  {
    topic: "Web Development",
    description: "Creating applications and services for the world wide web",
    resources: ["MDN Web Docs", "W3Schools", "freeCodeCamp", "Frontend Masters"],
    technologies: ["HTML", "CSS", "JavaScript", "React", "Angular", "Vue", "Node.js", "Express"],
  },
  {
    topic: "Mobile Development",
    description: "Building applications for mobile devices",
    resources: ["Android Developers", "Apple Developer", "Flutter Dev", "React Native Docs"],
    technologies: ["Swift", "Kotlin", "Flutter", "React Native", "Xamarin", "Ionic"],
  },
  {
    topic: "Artificial Intelligence",
    description: "Creating systems that can perform tasks requiring human intelligence",
    resources: ["Kaggle", "TensorFlow Tutorials", "PyTorch Docs", "Fast.ai"],
    technologies: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "NLTK", "OpenCV"],
  },
  {
    topic: "Blockchain",
    description: "Developing decentralized applications and smart contracts",
    resources: ["Ethereum Docs", "Solidity Docs", "Web3.js", "Truffle Suite"],
    technologies: ["Solidity", "Web3.js", "Truffle", "Hardhat", "Ganache", "MetaMask"],
  },
  {
    topic: "Internet of Things",
    description: "Connecting physical devices to the internet and each other",
    resources: ["Arduino Docs", "Raspberry Pi Projects", "ESP32 Tutorials", "MQTT Docs"],
    technologies: ["Arduino", "Raspberry Pi", "ESP32", "MQTT", "Zigbee", "LoRaWAN"],
  },
  {
    topic: "Augmented Reality",
    description: "Enhancing real-world environments with computer-generated information",
    resources: ["ARKit Docs", "ARCore Guides", "Unity AR Foundation", "A-Frame Docs"],
    technologies: ["ARKit", "ARCore", "Unity", "Vuforia", "A-Frame", "Three.js"],
  },
  {
    topic: "Virtual Reality",
    description: "Creating immersive, computer-generated environments",
    resources: ["Oculus Developer", "SteamVR Docs", "Unity XR", "WebXR Samples"],
    technologies: ["Unity", "Unreal Engine", "WebXR", "A-Frame", "Three.js", "GLSL"],
  },
  {
    topic: "Game Development",
    description: "Creating interactive entertainment software",
    resources: ["Unity Learn", "Unreal Documentation", "Godot Tutorials", "Game Dev.net"],
    technologies: ["Unity", "Unreal Engine", "Godot", "Phaser", "PlayCanvas", "Construct"],
  },
  {
    topic: "Data Science",
    description: "Extracting knowledge and insights from structured and unstructured data",
    resources: ["Kaggle", "DataCamp", "Towards Data Science", "Analytics Vidhya"],
    technologies: ["Python", "R", "Pandas", "NumPy", "Matplotlib", "Jupyter"],
  },
  {
    topic: "Cybersecurity",
    description: "Protecting systems, networks, and programs from digital attacks",
    resources: ["OWASP", "HackerOne", "Cybrary", "TryHackMe"],
    technologies: ["Kali Linux", "Wireshark", "Metasploit", "Burp Suite", "Nmap", "Snort"],
  },
]

// General non-hackathon-specific questions
export const generalKnowledgeData = [
  {
    question: "What is a hackathon?",
    answer:
      "A hackathon is a time-bound event where individuals or teams come together to build innovative projects, usually around a specific theme or challenge. It's a great way to collaborate, learn new skills, and bring ideas to life quickly.",
  },
  {
    question: "Why should I participate in a hackathon?",
    answer:
      "Hackathons are great for learning, networking, team collaboration, and building portfolio-worthy projects. You also get exposure to real-world problem-solving and can win prizes or recognition.",
  },
  {
    question: "What should I bring to a hackathon?",
    answer:
      "Bring your laptop, charger, headphones, snacks, water bottle, any hardware you plan to use (for IoT, AR, etc.), and an open mind ready to build something amazing!",
  },
  {
    question: "Do I need to know coding to join a hackathon?",
    answer:
      "Not necessarily. Hackathons often welcome designers, idea contributors, project managers, and marketers. Team collaboration makes space for everyone to contribute in unique ways.",
  },
  {
    question: "What happens after a hackathon ends?",
    answer:
      "After a hackathon ends, teams may present their projects, receive feedback from judges, and attend the awards ceremony. Some participants continue developing their projects post-event or receive mentorship/funding offers.",
  },
  {
    question: "How long do hackathons usually last?",
    answer:
      "Hackathons typically last anywhere from 24 to 48 hours, though some can be shorter (like 12-hour events) or longer (like week-long hackathons). The most common format is a weekend hackathon that runs from Friday evening to Sunday afternoon.",
  },
  {
    question: "What types of hackathons exist?",
    answer:
      "There are many types of hackathons including general technology hackathons, industry-specific ones (healthcare, fintech, education), social impact hackathons, corporate hackathons, student hackathons, and virtual/remote hackathons. Each has its own focus and target audience.",
  },
  {
    question: "How do I prepare for a hackathon?",
    answer:
      "To prepare for a hackathon: 1) Research the theme and challenges, 2) Form or join a team with complementary skills, 3) Brainstorm project ideas beforehand, 4) Familiarize yourself with relevant tools and technologies, 5) Get enough rest before the event, and 6) Pack essentials like your laptop, charger, and comfortable clothes.",
  },
  {
    question: "What makes a winning hackathon project?",
    answer:
      "Winning hackathon projects typically combine innovation, technical execution, problem-solving, and presentation skills. Focus on addressing a real problem, creating a working prototype (even with limited features), and preparing a compelling presentation that clearly demonstrates your solution's value and impact.",
  },
]

// General greeting questions
export const generalGreetingData = [
  {
    question: "Hi",
    answer: "Hello! Welcome to HackNHost. How can I assist you today?",
  },
  {
    question: "Hello",
    answer: "Hi there! How can I help you with HackNHost today?",
  },
  {
    question: "Hey",
    answer: "Hey! What can I help you with on HackNHost?",
  },
  {
    question: "Good morning",
    answer: "Good morning! Let me know how I can assist you with HackNHost.",
  },
  {
    question: "Good evening",
    answer: "Good evening! Feel free to ask any questions about HackNHost.",
  },
  {
    question: "Good afternoon",
    answer: "Good afternoon! How can I help you with HackNHost today?",
  },
  {
    question: "Howdy",
    answer: "Howdy! Welcome to HackNHost. What can I help you with?",
  },
  {
    question: "Greetings",
    answer: "Greetings! I'm here to help with any questions about HackNHost.",
  },
  {
    question: "Hi there",
    answer: "Hi there! How can I assist you with HackNHost today?",
  },
  {
    question: "Hello there",
    answer: "Hello there! What would you like to know about HackNHost?",
  },
  {
    question: "Yo",
    answer: "Hey there! How can I help you with HackNHost today?",
  },
  {
    question: "Hiya",
    answer: "Hiya! Welcome to HackNHost. What can I help you with?",
  },
  {
    question: "Morning",
    answer: "Good morning! How can I assist you with HackNHost today?",
  },
  {
    question: "Evening",
    answer: "Good evening! What would you like to know about HackNHost?",
  },
  {
    question: "Afternoon",
    answer: "Good afternoon! How can I help you with HackNHost today?",
  },
]

// Expanded farewell responses
export const farewellData = [
  {
    question: "Bye",
    answer: "Goodbye! Feel free to come back if you have more questions about HackNHost.",
  },
  {
    question: "Goodbye",
    answer: "Goodbye! Thanks for chatting with HackNHost assistant. Have a great day!",
  },
  {
    question: "See you",
    answer: "See you later! Don't hesitate to return if you need more help with HackNHost.",
  },
  {
    question: "Thanks",
    answer: "You're welcome! If you have more questions about HackNHost in the future, I'll be here to help.",
  },
  {
    question: "Thank you",
    answer: "You're very welcome! Feel free to reach out again if you need assistance with HackNHost.",
  },
  {
    question: "Cheers",
    answer: "Cheers! Thanks for using HackNHost. Have a wonderful day!",
  },
  {
    question: "Later",
    answer: "Talk to you later! Come back anytime you need help with HackNHost.",
  },
  {
    question: "Good night",
    answer: "Good night! Feel free to return tomorrow if you have more questions about HackNHost.",
  },
  {
    question: "Exit",
    answer: "Goodbye! Thanks for using HackNHost assistant. Feel free to return anytime.",
  },
  {
    question: "End",
    answer: "Chat ended. Thanks for using HackNHost assistant. Have a great day!",
  },
]

// Help and support questions
export const helpSupportData = [
  {
    question: "How do I contact support?",
    answer:
      "You can contact HackNHost support by clicking on the 'Contact' link in the footer, sending an email to support@hacknhost.com, or using the live chat feature available on the bottom right of every page. Our support team is available Monday to Friday, 9 AM to 6 PM EST.",
  },
  {
    question: "Is there a help center?",
    answer:
      "Yes, HackNHost has a comprehensive help center accessible from the 'Help' link in the navigation menu. It contains tutorials, FAQs, troubleshooting guides, and best practices for both organizers and participants.",
  },
  {
    question: "How do I report a bug?",
    answer:
      "To report a bug, please go to the 'Contact' page and select 'Report a Bug' from the dropdown menu. Provide details about the issue including steps to reproduce, expected behavior, and screenshots if possible. Our team will investigate and get back to you.",
  },
  {
    question: "Can I request a feature?",
    answer:
      "Yes, we welcome feature requests! Please submit your ideas through the 'Feedback' form accessible from the user menu. Our product team reviews all suggestions and prioritizes them based on user demand and strategic alignment.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "To reset your password, click on the 'Login' button, then select 'Forgot Password'. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
  },
  {
    question: "My payment failed, what should I do?",
    answer:
      "If your payment failed, please first check that your payment details are correct. If the issue persists, please contact your bank to ensure there are no restrictions on your card. If you still encounter problems, contact our support team at payments@hacknhost.com with your order reference number.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "To delete your account, go to 'Account Settings' from your profile dropdown, scroll to the bottom, and click on 'Delete Account'. Please note that this action is irreversible and will remove all your data from our platform.",
  },
  {
    question: "I can't log in, what should I do?",
    answer:
      "If you're having trouble logging in, first try resetting your password. If that doesn't work, check if you're using the correct email address. If you still can't log in, contact our support team at support@hacknhost.com with details of the issue.",
  },
]

// Account and profile questions
export const accountProfileData = [
  {
    question: "How do I create an account?",
    answer:
      "To create an account on HackNHost, click the 'Sign Up' button in the top right corner of the homepage. Fill in your details including name, email, and password. You can also sign up using your Google, GitHub, or LinkedIn account for faster registration.",
  },
  {
    question: "How do I edit my profile?",
    answer:
      "To edit your profile, log in to your account and click on your profile picture in the top right corner. Select 'Profile Settings' from the dropdown menu. Here you can update your personal information, skills, bio, social links, and profile picture.",
  },
  {
    question: "Can I have multiple accounts?",
    answer:
      "We recommend having only one account per person on HackNHost. This helps maintain a clear identity and track your participation history. If you need different roles (e.g., as both a participant and an organizer), you can switch roles within the same account.",
  },
  {
    question: "How do I change my email address?",
    answer:
      "To change your email address, go to 'Account Settings' from your profile dropdown, select the 'Email' tab, and click 'Change Email'. Enter your new email address and confirm it. You'll receive a verification link at your new email to complete the change.",
  },
  {
    question: "How do I change my password?",
    answer:
      "To change your password, go to 'Account Settings' from your profile dropdown, select the 'Security' tab, and click 'Change Password'. Enter your current password and your new password twice to confirm. Make sure to use a strong, unique password.",
  },
  {
    question: "What are badges on my profile?",
    answer:
      "Badges on your profile represent achievements and participation milestones on HackNHost. You can earn badges by participating in hackathons, winning prizes, mentoring others, organizing events, and contributing to the community. Badges help showcase your experience and expertise.",
  },
  {
    question: "How do I set my notification preferences?",
    answer:
      "To set your notification preferences, go to 'Account Settings' from your profile dropdown and select the 'Notifications' tab. Here you can choose which types of notifications you want to receive (email, in-app, or both) and for which events (hackathon updates, team invitations, etc.).",
  },
  {
    question: "Can I make my profile private?",
    answer:
      "Yes, you can adjust your privacy settings by going to 'Account Settings' from your profile dropdown and selecting the 'Privacy' tab. Here you can control who can see your profile, contact you, or send you team invitations. You can also choose to hide specific information like your skills or participation history.",
  },
]

// Pricing and billing questions
export const pricingBillingData = [
  {
    question: "Is HackNHost free to use?",
    answer:
      "HackNHost offers a free tier for small hackathons and student events. For larger events or organizations needing advanced features, we offer premium plans starting at $99/month. You can view our full pricing details on the Pricing page.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "HackNHost accepts credit/debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. For enterprise customers, we also offer invoice-based payments with net-30 terms.",
  },
  {
    question: "Do you offer discounts for nonprofits or educational institutions?",
    answer:
      "Yes, we offer special pricing for nonprofits, educational institutions, and student organizations. Eligible organizations can receive up to 50% off our standard pricing. Please contact our sales team at sales@hacknhost.com with proof of your organization's status to apply.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time from your account's Billing section. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle. Prorated credits are applied for upgrades within a billing cycle.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 14-day money-back guarantee for new subscriptions. If you're not satisfied with our service, contact support within 14 days of your initial purchase for a full refund. After this period, refunds are handled on a case-by-case basis.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "To cancel your subscription, go to 'Account Settings' from your profile dropdown, select the 'Billing' tab, and click 'Cancel Subscription'. Your account will remain active until the end of your current billing period. You can reactivate your subscription at any time.",
  },
  {
    question: "Do you charge per hackathon or per month?",
    answer:
      "Our pricing is subscription-based with monthly or annual billing options. Each plan allows you to host a certain number of hackathons per year. If you need to host additional events, you can purchase event add-ons or upgrade to a higher tier plan.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "If you cancel your subscription, your account will be downgraded to the free tier at the end of your billing period. Your data will be retained, but you'll lose access to premium features. If you delete your account, all your data will be permanently removed after a 30-day grace period.",
  },
]

// Technical questions
export const technicalData = [
  {
    question: "What browsers does HackNHost support?",
    answer:
      "HackNHost supports all modern browsers including Chrome, Firefox, Safari, and Edge (latest versions). For the best experience, we recommend using Chrome or Firefox. Internet Explorer is not supported.",
  },
  {
    question: "Is HackNHost mobile-friendly?",
    answer:
      "Yes, HackNHost is fully responsive and works on mobile devices and tablets. However, for complex tasks like event creation or project submission, we recommend using a desktop or laptop for the best experience.",
  },
  {
    question: "What technologies does HackNHost use?",
    answer:
      "HackNHost is built using modern web technologies including React, Next.js, Node.js, and Firebase. We use WebRTC for video conferencing, Three.js for VR experiences, and various APIs for integrations with GitHub, Slack, Discord, and other tools.",
  },
  {
    question: "Do you have an API?",
    answer:
      "Yes, HackNHost offers a RESTful API for premium and enterprise customers. The API allows you to integrate HackNHost with your existing systems, automate workflows, and access data programmatically. API documentation is available in our Developer Hub.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, security is our top priority. We use industry-standard encryption for data in transit (HTTPS) and at rest. We regularly perform security audits and penetration testing. User passwords are hashed, and we implement strict access controls for all data.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes, organizers can export event data including participant information, submissions, judging results, and analytics in CSV or JSON format. Participants can export their profile, project submissions, and certificates of participation.",
  },
  {
    question: "Do you have a mobile app?",
    answer:
      "Currently, HackNHost is primarily a web platform optimized for mobile browsers. We're developing native mobile apps for iOS and Android with features specifically designed for on-the-go use during hackathons. Join our beta program to get early access.",
  },
  {
    question: "What are the system requirements?",
    answer:
      "HackNHost works on any device with a modern web browser and internet connection. For VR features, we recommend a computer with at least 8GB RAM and a dedicated graphics card. For video conferencing, a webcam and microphone are needed.",
  },
]

// Response templates
export const responseTemplates = {
  greeting: "Hello! Welcome to HackNHost. How can I assist you today?",
  notUnderstood: "I'm sorry, I didn't quite understand that. Could you rephrase your question?",
  needMoreInfo: "To better assist you, could you provide more details about your question?",
  suggestHelp: "If you're having trouble, you can also reach out to our support team through the Contact page.",
  eventCreationSuccess:
    "Congratulations! Your hackathon has been created successfully. You can now manage it from your dashboard.",
  registrationSuccess:
    "You've successfully registered for this hackathon! You can now form or join a team and start preparing for the event.",
  submissionSuccess:
    "Your project has been submitted successfully! Judges will review it after the submission deadline.",
  farewell: "Thank you for using HackNHost. Have a great day and happy hacking!",
  contactOrganizer:
    "For specific details about this hackathon, I recommend contacting the event organizer directly through the contact information provided on the event page.",
  contactSupport:
    "For further assistance, please contact the HackNHost support team at support@hacknhost.com or through the Contact page.",
  noMatch:
    "I don't have specific information about that. Please contact the event organizer directly or reach out to the HackNHost support team for assistance.",
}

// All combined exports
export const allTrainingData = {
  generalQuestions: trainingData,
  featureQuestions: featureTrainingData,
  hackathonTopics: hackathonTopicsData,
  generalKnowledge: generalKnowledgeData,
  generalGreetings: generalGreetingData,
  farewells: farewellData,
  helpSupport: helpSupportData,
  accountProfile: accountProfileData,
  pricingBilling: pricingBillingData,
  technical: technicalData,
  responseTemplates: responseTemplates,
}
