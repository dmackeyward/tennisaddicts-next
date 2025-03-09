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

  // News section prompts
  news: {},

  // Listings section prompts
  listings: {},

  // About Us section prompts
  aboutUs: {},

  // Contact Us section prompts
  contactUs: {},

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
};

// Export the prompts object for use in other files
export default prompts;
