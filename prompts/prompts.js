// prompts.js - Central location for all prompts for Tennis Addicts website

/**
 * Comprehensive prompt collection organized by features and modes
 * Each section contains specialized prompts for different user interactions
 * and system behaviors tailored to the Tennis Addicts community
 */

// Common/shared prompts that can be reused across different sections
const common = {
  buttons: {
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    back: "Back",
    continue: "Continue",
  },
  pagination: {
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    showing: "Showing",
    items: "items",
  },
  filters: {
    filterBy: "Filter by",
    sortBy: "Sort by",
    clearFilters: "Clear filters",
    applyFilters: "Apply filters",
    price: "Price",
    rating: "Rating",
    distance: "Distance",
    date: "Date",
  },
  notifications: {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
  },
  emptyStates: {
    noResults: "No results found",
    tryAgain: "Please try again with different criteria",
    loading: "Loading results...",
  },
};

// Home page prompts
const home = {
  metadata: {
    title: "Tennis Addicts",
    description: "Your community for everything tennis",
  },
  title: `Tennis Addicts`,
  description: `Your community for local matches, courts, and tennis enthusiasts`,
  newsButton: `Latest News`,
  listingsButton: `Equipment & Services`,
  communityCardTitle: `Join Our Community`,
  communityCardDescription: `Connect with local players, find courts, and participate in tennis events`,
  newsCardTitle: `Tennis News`,
  newsCardDescription: `Stay updated on local and international tennis tournaments, players, and events`,
  listingsCardTitle: `Equipment & Services`,
  listingsCardDescription: `Explore tennis equipment, coaching services, and court listings`,
};

// Authentication prompts
const auth = {
  signUp: {
    metadata: {
      title: "Sign Up",
      description: "Join Tennis Addicts - Your community for everything tennis",
    },
    title: "Sign Up",
    alreadyHaveAccount: "Already have an account?",
    signInLink: "Sign in",
    termsText: "By signing up, you agree to our",
    termsOfServiceLink: "Terms of Service",
    andText: "and",
    privacyPolicyLink: "Privacy Policy",
    form: {
      nameLabel: "Full Name",
      namePlaceholder: "Enter your full name",
      emailLabel: "Email",
      emailPlaceholder: "your.email@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      skillLevelLabel: "Tennis Skill Level",
      skillLevelOptions: {
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
        pro: "Professional",
      },
      signUpButton: "Create Account",
      processingButton: "Creating account...",
    },
  },
  signIn: {
    metadata: {
      title: "Sign In",
      description: "Sign in to your Tennis Addicts account",
    },
    title: "Sign In",
    dontHaveAccount: "Don't have an account?",
    signUpLink: "Sign up",
    form: {
      emailLabel: "Email",
      emailPlaceholder: "your.email@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      signInButton: "Sign In",
      processingButton: "Signing in...",
    },
  },
  forgotPassword: {
    title: "Forgot Password",
    description: "Enter your email to receive a password reset link",
    emailLabel: "Email",
    emailPlaceholder: "your.email@example.com",
    submitButton: "Send Reset Link",
    processingButton: "Sending...",
    backToSignIn: "Back to Sign In",
    successMessage: "Check your email for a reset link",
  },
  resetPassword: {
    title: "Reset Password",
    description: "Create a new password for your account",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Enter new password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm new password",
    submitButton: "Reset Password",
    processingButton: "Resetting...",
    successMessage: "Password has been reset successfully",
    signInPrompt: "Return to Sign In",
  },
};

// News section prompts
const news = {
  metadata: {
    title: "News",
    description: "Latest news and updates from Tennis Addicts",
  },
  title: "News",
  description:
    "Find and book the perfect tennis court in your area. Browse our listings to discover top-rated courts, availability, and special offers.",
  categories: {
    all: "All News",
    local: "Local News",
    international: "International",
    tournaments: "Tournaments",
    players: "Players",
    community: "Community",
  },
  filters: {
    latest: "Latest",
    popular: "Most Popular",
    featured: "Featured",
  },
  newsPage: {
    metadata: {
      title: "News Article",
      description: "Read the latest tennis news and updates",
    },
    notFound: "News item not found",
    backToNews: "Back to News",
    byAuthor: "By",
    publishedOn: "Published on",
    updatedOn: "Updated on",
    relatedArticles: "Related Articles",
    shareArticle: "Share this Article",
  },
  likeThisArticle: "Like this article",
  viewFullArticle: "View Full Article",
  comments: {
    title: "Comments",
    writeComment: "Write a comment",
    commentPlaceholder: "Share your thoughts...",
    submitComment: "Post Comment",
    replyTo: "Reply to",
    editComment: "Edit",
    deleteComment: "Delete",
    reportComment: "Report",
    noComments: "No comments yet. Be the first to comment!",
  },
};

// Listings section prompts
const listings = {
  metadata: {
    title: "Tennis Listings",
    description: "Browse tennis equipment, courts, coaches, and services",
  },
  title: "Tennis Listings",
  description:
    "Find tennis equipment, courts, coaches, and services in your area",

  // Categories for listings
  categories: {
    all: "All Listings",
    equipment: "Equipment",
    courts: "Tennis Courts",
    coaching: "Coaching & Lessons",
    services: "Services",
    events: "Events & Tournaments",
  },

  // Equipment subcategories
  equipment: {
    title: "Tennis Equipment",
    description:
      "Browse new and used tennis equipment from community members and local shops",
    subcategories: {
      racquets: "Racquets",
      shoes: "Tennis Shoes",
      apparel: "Apparel",
      balls: "Tennis Balls",
      accessories: "Accessories",
      bags: "Tennis Bags",
      stringing: "Stringing Services",
    },
    filters: {
      condition: {
        title: "Condition",
        new: "New",
        likeNew: "Like New",
        good: "Good",
        fair: "Fair",
      },
      brand: "Brand",
      priceRange: "Price Range",
      sellerType: {
        title: "Seller Type",
        individual: "Individual",
        business: "Business",
        pro: "Tennis Pro",
      },
    },
  },

  // Courts subcategories
  courts: {
    title: "Tennis Courts",
    description: "Find and book tennis courts in your area",
    subcategories: {
      public: "Public Courts",
      private: "Private Clubs",
      indoor: "Indoor Courts",
      clay: "Clay Courts",
      grass: "Grass Courts",
      hard: "Hard Courts",
    },
    filters: {
      surface: "Surface Type",
      availability: "Availability",
      amenities: {
        title: "Amenities",
        lighting: "Lighting",
        parking: "Parking",
        proShop: "Pro Shop",
        showers: "Showers/Locker Rooms",
        courtside: "Courtside Seating",
        refreshments: "Refreshments",
      },
      price: "Court Fees",
      distanceFrom: "Distance From",
    },
    bookingPrompts: {
      available: "Available",
      booked: "Booked",
      selectDate: "Select a date",
      selectTime: "Select a time",
      duration: "Duration",
      players: "Number of players",
      bookButton: "Book Court",
      confirmBooking: "Confirm Booking",
      bookingSuccess: "Court booked successfully!",
      viewBookings: "View My Bookings",
    },
  },

  // Coaching subcategories
  coaching: {
    title: "Tennis Coaching & Lessons",
    description:
      "Find tennis coaches and instructors for players of all skill levels",
    subcategories: {
      private: "Private Lessons",
      group: "Group Lessons",
      kids: "Junior Programs",
      adult: "Adult Programs",
      performance: "Performance Training",
      specialty: "Specialty Training",
    },
    filters: {
      level: {
        title: "Teaching Level",
        beginner: "Beginner-friendly",
        intermediate: "Intermediate",
        advanced: "Advanced",
        all: "All Levels",
      },
      certification: "Certification",
      experience: "Years of Experience",
      rateRange: "Rate Range",
      location: "Location Type",
      availability: "Availability",
    },
    coachProfile: {
      about: "About the Coach",
      experience: "Experience",
      teaching: "Teaching Style",
      rates: "Rates",
      reviews: "Student Reviews",
      credentials: "Credentials",
      contactButton: "Contact Coach",
      bookLessonButton: "Book a Lesson",
    },
  },

  // Services subcategories
  services: {
    title: "Tennis Services",
    description: "Find specialized tennis services to improve your game",
    subcategories: {
      stringing: "Racquet Stringing",
      repair: "Equipment Repair",
      fitting: "Racquet Fitting",
      analysis: "Swing Analysis",
      fitness: "Tennis Fitness",
      mental: "Mental Coaching",
      nutrition: "Sports Nutrition",
    },
    filters: {
      serviceType: "Service Type",
      providerType: "Provider Type",
      location: "Location",
      price: "Price Range",
      rating: "Rating",
    },
  },

  // Events & Tournaments subcategories
  events: {
    title: "Tennis Events & Tournaments",
    description:
      "Discover local tennis events, tournaments, and social gatherings",
    subcategories: {
      tournaments: "Tournaments",
      leagues: "Leagues",
      socials: "Social Events",
      clinics: "Clinics & Workshops",
      exhibitions: "Exhibition Matches",
      fundraisers: "Charity Events",
    },
    filters: {
      date: "Date",
      level: {
        title: "Skill Level",
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
        open: "Open",
        ntrp: "NTRP Rating",
      },
      format: "Tournament Format",
      entryFee: "Entry Fee",
      prizes: "Prizes Offered",
      location: "Location",
    },
    eventDetails: {
      date: "Date & Time",
      location: "Location",
      entryFee: "Entry Fee",
      deadline: "Registration Deadline",
      format: "Format",
      rules: "Rules & Regulations",
      contact: "Contact Information",
      registerButton: "Register Now",
      participants: "Participants",
      schedule: "Event Schedule",
    },
  },

  // Listing detail page
  listingDetail: {
    contactSeller: "Contact Seller",
    message: "Message",
    call: "Call",
    email: "Email",
    share: "Share Listing",
    report: "Report Listing",
    saved: "Saved to Favorites",
    save: "Save to Favorites",
    listedOn: "Listed on",
    by: "by",
    askQuestion: "Ask a Question",
    seeMoreListings: "See More Listings from this Seller",
    similarListings: "Similar Listings",
    viewTitle: "View details for",
  },

  // Create/edit listing forms
  listingForms: {
    createTitle: "Create a New Listing",
    editTitle: "Edit Your Listing",
    categoryLabel: "Category",
    categoryPlaceholder: "Select a category",
    subcategoryLabel: "Subcategory",
    subcategoryPlaceholder: "Select a subcategory",
    titleLabel: "Listing Title",
    titlePlaceholder: "Enter a clear, descriptive title",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Describe your item or service in detail",
    priceLabel: "Price",
    pricePlaceholder: "Enter price",
    negotiableLabel: "Price is negotiable",
    conditionLabel: "Condition",
    conditionPlaceholder: "Select condition",
    brandLabel: "Brand",
    brandPlaceholder: "Enter brand name",
    locationLabel: "Location",
    locationPlaceholder: "Enter location",
    contactInfoLabel: "Contact Information",
    contactMethodsLabel: "Preferred Contact Methods",
    photosLabel: "Photos",
    photoUploadButton: "Upload Photos",
    dragDropText: "Drag and drop photos here or click to upload",
    maxPhotos: "Maximum 10 photos",
    previewButton: "Preview Listing",
    publishButton: "Publish Listing",
    saveButton: "Save as Draft",
    updateButton: "Update Listing",
    deleteButton: "Delete Listing",
    successMessage: "Your listing has been published successfully!",
    viewListingButton: "View Your Listing",
  },

  // My listings section
  myListings: {
    title: "My Listings",
    active: "Active",
    pending: "Pending Review",
    sold: "Sold/Completed",
    expired: "Expired",
    draft: "Drafts",
    noListings: "You don't have any listings yet",
    createButton: "Create a New Listing",
    renewListing: "Renew Listing",
    markAsSold: "Mark as Sold",
    viewStats: "View Statistics",
    promoteButton: "Promote Listing",
  },
};

// About Us section prompts
const aboutUs = {
  metadata: {
    title: "About Tennis Addicts",
    description: "Learn about our tennis community",
  },
  title: "About Us",
  description:
    "We're passionate about building a community of tennis enthusiasts who share a love for the game.",
  sections: {
    ourStory: {
      title: "Our Story",
      paragraphs: [
        "Tennis Addicts began in 2024 when a group of passionate players wanted to create a better way to connect with fellow tennis enthusiasts in their local area. What started as a simple meetup group has evolved into a thriving community platform.",
        "Our mission is to make tennis more accessible and enjoyable for players of all skill levels by providing a central hub for court listings, local news, equipment exchanges, and community events.",
        "Whether you're a beginner looking for lessons, a competitive player searching for worthy opponents, or simply a fan of the sport, Tennis Addicts is your home for everything tennis.",
      ],
    },
    whatWeOffer: {
      title: "What We Offer",
      features: [
        {
          title: "Community",
          description:
            "Connect with local players, join groups, and participate in community events and tournaments.",
        },
        {
          title: "Listings",
          description:
            "Find and review local tennis courts, check availability, and book court time directly through our platform.",
        },
        {
          title: "Tennis News",
          description:
            "Stay updated with local and international tennis news, tournament results, and player profiles.",
        },
        {
          title: "Marketplace",
          description:
            "Buy, sell, or trade tennis equipment, find coaches, and discover other tennis-related services.",
        },
      ],
    },
    joinCommunity: {
      title: "Join Our Community",
      paragraphs: [
        "Ready to take your tennis experience to the next level? Join Tennis Addicts today and become part of our growing community of tennis lovers.",
        "Have questions? Get in touch with us to learn more.",
      ],
      signUpButton: "Sign Up Now",
      contactButton: "Contact Us",
    },
  },
};

// Contact Us section prompts
const contactUs = {
  metadata: {
    title: "Contact Us",
    description: "Get in touch with Tennis Addicts",
  },
  title: "Contact Us",
  description: "Get in touch with us for any questions or feedback",
  form: {
    title: "Send us a message",
    description:
      "Fill out the form below and we'll get back to you as soon as possible.",
    namePlaceholder: "Your name",
    emailPlaceholder: "your.email@example.com",
    subjectPlaceholder: "Select a subject",
    messagePlaceholder: "Your message here...",
    sendButton: "Send Message",
    sendingButton: "Sending...",
    nameLabel: "Name",
    emailLabel: "Email",
    subjectLabel: "Subject",
    messageLabel: "Message",
    subjects: {
      general: "General Inquiry",
      feedback: "Feedback",
      issue: "Issue",
      other: "Other",
    },
    success: {
      title: "Message Sent!",
      message:
        "Thank you for contacting us. We'll respond to your inquiry shortly.",
      button: "Send another message",
    },
    error: {
      generic: "Something went wrong. Please try again.",
      unexpected: "An unexpected error occurred. Please try again.",
    },
  },
};

// Sign-in/Community section prompts
const community = {
  metadata: {
    title: "Tennis Community",
    description: "Connect with local tennis players and enthusiasts",
  },
  title: "Tennis Community",
  description:
    "Connect with tennis players in your area and build your tennis network",

  // Dashboard section
  dashboard: {
    title: "My Dashboard",
    welcome: "Welcome back, ",
    stats: {
      connectionsLabel: "Connections",
      eventsLabel: "Upcoming Events",
      messagesLabel: "New Messages",
      matchesLabel: "Recent Matches",
    },
    quickLinks: {
      title: "Quick Links",
      findPlayers: "Find Players",
      bookCourt: "Book a Court",
      joinEvent: "Join an Event",
      myProfile: "Edit Profile",
    },
    recentActivity: {
      title: "Recent Activity",
      noActivity: "No recent activity to display",
      viewAll: "View All Activity",
    },
    recommendedPlayers: {
      title: "Players You Might Like",
      viewMore: "View More",
      connectButton: "Connect",
      messageButton: "Message",
    },
    upcomingEvents: {
      title: "Upcoming Events",
      viewAll: "View All Events",
      noEvents: "No upcoming events",
      registerButton: "Register",
    },
  },

  // Profile section
  profile: {
    title: "Player Profile",
    editButton: "Edit Profile",
    tabs: {
      about: "About",
      activity: "Activity",
      connections: "Connections",
      matches: "Matches",
      reviews: "Reviews",
    },
    about: {
      skillLevel: "Skill Level",
      playingSince: "Playing Since",
      preferredSurface: "Preferred Surface",
      availability: "Availability",
      location: "Location",
      bio: "Bio",
    },
    editProfile: {
      title: "Edit Profile",
      personalInfo: "Personal Information",
      tennisInfo: "Tennis Information",
      privacy: "Privacy Settings",
      notifications: "Notification Preferences",
      saveButton: "Save Changes",
      cancelButton: "Cancel",
    },
    matches: {
      won: "Won",
      lost: "Lost",
      upcoming: "Upcoming",
      addResult: "Add Match Result",
      recordMatch: {
        title: "Record Match Result",
        opponent: "Opponent",
        date: "Date",
        location: "Location",
        score: "Score",
        result: "Result",
        notes: "Match Notes",
        submitButton: "Submit Result",
      },
    },
    connections: {
      title: "My Connections",
      pending: "Pending Requests",
      suggested: "Suggested Players",
      search: "Search Connections",
      filter: "Filter by",
      noConnections: "No connections yet",
      connect: "Connect",
      message: "Message",
      remove: "Remove Connection",
    },
  },

  // Messaging system
  messages: {
    title: "Messages",
    inbox: "Inbox",
    sent: "Sent",
    archived: "Archived",
    compose: "New Message",
    search: "Search Messages",
    noMessages: "No messages",
    newMessageButton: "New Message",
    composeMessage: {
      to: "To",
      subject: "Subject",
      message: "Message",
      send: "Send",
      cancel: "Cancel",
      sendingMessage: "Sending...",
    },
    conversation: {
      reply: "Reply",
      delete: "Delete",
      archive: "Archive",
      markUnread: "Mark as Unread",
      backToInbox: "Back to Inbox",
    },
  },

  // Event system
  events: {
    title: "Tennis Events",
    upcoming: "Upcoming Events",
    past: "Past Events",
    myEvents: "My Events",
    createEvent: "Create Event",
    viewAll: "View All Events",
    filters: {
      date: "Date",
      type: "Event Type",
      level: "Skill Level",
      distance: "Distance",
    },
    eventDetails: {
      date: "Date",
      time: "Time",
      location: "Location",
      organizer: "Organizer",
      participants: "Participants",
      skillLevel: "Skill Level",
      description: "Description",
      registerButton: "Register",
      cancelRegistration: "Cancel Registration",
      contactOrganizer: "Contact Organizer",
      shareEvent: "Share Event",
    },
    createEventForm: {
      title: "Create a Tennis Event",
      eventName: "Event Name",
      eventType: "Event Type",
      date: "Date",
      startTime: "Start Time",
      endTime: "End Time",
      location: "Location",
      skillLevel: "Skill Level",
      maxParticipants: "Maximum Participants",
      description: "Description",
      createButton: "Create Event",
      cancelButton: "Cancel",
    },
  },

  // Match finder
  matchFinder: {
    title: "Find a Match",
    description:
      "Find tennis players for singles, doubles, or practice sessions",
    tabs: {
      findPlayers: "Find Players",
      openChallenges: "Open Challenges",
      myMatches: "My Matches",
    },
    filters: {
      skillLevel: "Skill Level",
      matchType: {
        title: "Match Type",
        singles: "Singles",
        doubles: "Doubles",
        practice: "Practice",
        hitting: "Hitting Session",
      },
      availability: "Availability",
      location: "Location",
      distance: "Distance",
      age: "Age Group",
      gender: "Gender",
    },
    playerCard: {
      challengeButton: "Challenge",
      messageButton: "Message",
      viewProfile: "View Profile",
    },
    createChallenge: {
      title: "Create a Challenge",
      type: "Match Type",
      date: "Preferred Date",
      time: "Preferred Time",
      location: "Preferred Location",
      notes: "Additional Notes",
      createButton: "Send Challenge",
      cancelButton: "Cancel",
    },
    challenges: {
      incoming: "Incoming Challenges",
      outgoing: "Outgoing Challenges",
      accept: "Accept",
      decline: "Decline",
      cancel: "Cancel Challenge",
      noChallenges: "No active challenges",
    },
  },
};

// Toast notification prompts - Updated with more tennis-themed messages
const toast = {
  // Core toast types
  success: `Game, set, match! Your changes have been saved successfully.`,
  error: `Fault! An error occurred. Please try again or contact our Tennis Addicts support team.`,
  warning: `Let's review your information before serving. Some fields may require attention.`,
  info: `Tennis tip: Here's something you might want to know to enhance your experience.`,

  // User account related
  welcome: `Welcome back to Tennis Addicts! We're glad to see you on the court again.`,
  update: `Your Tennis Addicts profile has been updated successfully. Game on!`,
  reminder: `Just a friendly reminder about your upcoming tennis matches or court reservations.`,
  signInRequired: `You need to sign in to access this feature. Let's get you back on the court!`,
  signOut: `You've been signed out. Come back soon for more tennis action!`,
  accountCreated: `Ace! Your Tennis Addicts account has been created successfully. Time to find your match!`,
  passwordChanged: `Your password has been successfully changed. Your account is now secure and ready for action.`,
  emailVerified: `Your email has been verified! You now have full access to all Tennis Addicts features.`,

  // Listings related
  listingCreated: `Your listing has been created successfully. It's now live and ready for the Tennis Addicts community!`,
  listingUpdated: `Your listing has been rallied to perfection! Updates are now live.`,
  listingDeleted: `Your listing has been removed from the marketplace. Game, set, done!`,
  listingSaved: `This listing has been saved to your favorites. Check your profile to view all saved items.`,

  // File uploads
  incorrectFileType: `Out of bounds! Please upload an image file (JPG, PNG, GIF) only.`,
  uploadSuccess: `Your photos have been uploaded successfully. They look ace!`,
  uploadError: `Fault on the upload! Please try again or contact support for assistance.`,

  // Interactions
  rateLimited: `Time violation! You're making too many requests. Please wait a moment before trying again.`,
  reportSuccess: `Thank you for your line call. Our team will review this listing shortly.`,
  reportError: `Your report couldn't be submitted. Please try again or contact our umpires for assistance.`,
  saveSuccess: `Your progress has been saved. You can return to complete this form after your match.`,
  saveError: `Deuce! We couldn't save your progress. Please try again before changing courts.`,
  linkCopied: `Match point! Link copied to clipboard. Share it with your tennis buddies!`,

  // Booking related
  bookingSuccess: `Court reserved! Your tennis session has been successfully booked.`,
  bookingCancelled: `Your court reservation has been cancelled. No penalty points this time!`,
  bookingReminder: `Your tennis court is reserved for tomorrow. Don't forget your racquet!`,

  // Community interaction
  messageReceived: `New message in your inbox! Someone from the Tennis Addicts community wants to connect.`,
  connectionRequest: `A player wants to connect with you! Check your profile for pending requests.`,
  eventJoined: `You've successfully registered for this tennis event. We'll see you on the court!`,
  challengeReceived: `Game on! You've received a new match challenge. Check your notifications to respond.`,

  // Payments and transactions
  paymentSuccess: `Perfect serve! Your payment has been processed successfully.`,
  paymentFailed: `Let fault! There was an issue processing your payment. Please try again with a different method.`,
  refundIssued: `A refund has been issued to your original payment method. It may take 3-5 business days to appear.`,

  // Errors and fallbacks
  genericError: `We hit the net on that one. Please try again or contact support if the issue persists.`,
  networkError: `Looks like your connection faulted. Please check your internet and try again.`,
  timeoutError: `The request timed out. The server might be experiencing high traffic - like center court during Wimbledon!`,
};

// Form interaction prompts
const forms = {
  validationError: `Out of bounds! Please check the highlighted fields and ensure all required information is provided correctly.`,
  submissionSuccess: `Ace! Your form has been submitted successfully. Thank you for your input.`,
  inProgressSave: `Your progress has been saved. You can return to complete this form after your match.`,
  helpText: `Need assistance with this form? Here are some tips to guide you through the Tennis Addicts registration process.`,
};

// Search functionality prompts
const search = {
  noResults: `No matches found for your search. Try different tennis keywords or browse our suggested categories.`,
  refinementSuggestion: `Here are some ways to refine your search for more relevant tennis results.`,
  searchTips: `To improve your tennis search results, try using specific keywords like "beginner lessons," "tennis racquets," or "clay courts near me."`,
  popularSearches: `Popular searches: Tennis lessons, Used racquets, Local tournaments, Court rentals, Tennis partners`,
};

// Error messages
const error = {
  errorLoadingNews: `Error loading news`,
  errorLoadingNewsDetails: `There was a problem loading this news article.`,
  errorLoadingListing: `Error loading listing`,
  errorLoadingListingDetails: `There was a problem loading this listing.`,
  newsNotFound: `News not found`,
  listingNotFound: `Listing not found`,
  pageNotFound: {
    title: "Page Not Found",
    message:
      "Looks like that page is out of bounds! The page you're looking for doesn't exist.",
    buttonText: "Return to Home Court",
  },
  serverError: {
    title: "Server Error",
    message:
      "We encountered a fault on our end. Our team has been notified and is working to resolve the issue.",
    buttonText: "Return to Home Court",
  },
  accessDenied: {
    title: "Access Denied",
    message:
      "You don't have permission to access this page. Please sign in or request access.",
    buttonText: "Sign In",
  },
};

// Define signIn object directly to match the way it's accessed in the code
const signIn = {
  metadata: {
    title: "Sign In",
    description: "Sign in to your Tennis Addicts account",
  },
  title: "Sign In",
  dontHaveAccount: "Don't have an account?",
  signUpLink: "Sign up",
  form: {
    emailLabel: "Email",
    emailPlaceholder: "your.email@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    signInButton: "Sign In",
    processingButton: "Signing in...",
  },
};

// Combine all modules into the main prompts object
const prompts = {
  common,
  home,
  signIn, // Add it directly here to match the way it's accessed in the component
  auth: {
    signUp: auth.signUp,
    signIn: auth.signIn, // Keep this too for backward compatibility
    forgotPassword: auth.forgotPassword,
    resetPassword: auth.resetPassword,
  },
  news,
  listings,
  aboutUs,
  contactUs,
  community,
  toast,
  forms,
  search,
  error,
};

// At the end of your prompts.js file, after all other exports
export default prompts;
