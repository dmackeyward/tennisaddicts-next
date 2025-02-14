// lib/format.ts

export const formatPrice = (price: number): string => {
  if (typeof price !== "number" || isNaN(price)) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatDate = (date: string): string => {
  if (!date) {
    return "Date unavailable";
  }

  try {
    const parsedDate = new Date(date);

    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Helper function to validate ISO date string
export const isValidISODate = (dateString: string): boolean => {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return date.toISOString() === dateString;
  } catch {
    return false;
  }
};
