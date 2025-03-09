// prompts.js - Central location for all prompts for Tennis Addicts website

/**
 * Comprehensive prompt collection organized by features and modes
 * Each section contains specialized prompts for different user interactions
 * and system behaviors tailored to the Tennis Addicts community
 */
const prompts = {
  // Home page prompts
  home: {
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
  },

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
  },

  signIn: {
    metadata: {
      title: "Sign In",
      description: "Sign in to your Tennis Addicts account",
    },
    title: "Sign In",
    dontHaveAccount: "Don't have an account?",
    signUpLink: "Sign up",
  },

  // News section prompts
  news: {
    metadata: {
      title: "News",
      description: "Latest news and updates from Tennis Addicts",
    },
    title: "News",
    description:
      "Find and book the perfect tennis court in your area. Browse our listings to discover top-rated courts, availability, and special offers.",
    newsPage: {
      metadata: {
        title: "News Article",
        description: "Read the latest tennis news and updates",
      },
      notFound: "News item not found",
      backToNews: "Back to News",
      byAuthor: "By",
    },
    likeThisArticle: "Like this article",
    viewFullArticle: "View Full Article",
  },

  // Listings section prompts
  listings: {},

  // About Us section prompts
  aboutUs: {
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
  },

  // Contact Us section prompts
  contactUs: {
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
  },

  // Sign-in/Community section prompts
  community: {},

  // Toast notification prompts
  toast: {
    success: `Game, set, match! Your changes have been saved successfully.`,
    error: `Fault! An error occurred. Please try again or contact our Tennis Addicts support team.`,
    warning: `Let's review your information before serving. Some fields may require attention.`,
    info: `Tennis tip: Here's something you might want to know to enhance your experience.`,
    welcome: `Welcome back to Tennis Addicts! We're glad to see you on the court again.`,
    update: `Your Tennis Addicts profile has been updated successfully. Game on!`,
    reminder: `Just a friendly reminder about your upcoming tennis matches or court reservations.`,
  },

  // Form interaction prompts
  forms: {
    validationError: `Out of bounds! Please check the highlighted fields and ensure all required information is provided correctly.`,
    submissionSuccess: `Ace! Your form has been submitted successfully. Thank you for your input.`,
    inProgressSave: `Your progress has been saved. You can return to complete this form after your match.`,
    helpText: `Need assistance with this form? Here are some tips to guide you through the Tennis Addicts registration process.`,
  },

  // Search functionality prompts
  search: {
    noResults: `No matches found for your search. Try different tennis keywords or browse our suggested categories.`,
    refinementSuggestion: `Here are some ways to refine your search for more relevant tennis results.`,
    searchTips: `To improve your tennis search results, try using specific keywords like "beginner lessons," "tennis racquets," or "clay courts near me."`,
    popularSearches: `Popular searches: Tennis lessons, Used racquets, Local tournaments, Court rentals, Tennis partners`,
  },

  error: {
    errorLoadingNews: `Error loading news`,
    errorLoadingNewsDetails: `There was a problem loading this news article.`,
    errorLoadingListing: `Error loading listing`,
    errorLoadingListingDetails: `There was a problem loading this listing.`,
    newsNotFound: `News not found`,
    listingNotFound: `Listing not found`,
  },
};

// Export the prompts object for use in other files
export default prompts;
