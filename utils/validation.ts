export function sanitizeInput(input: string | undefined | null): string {
  if (!input) return "";

  // Remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, "");

  // Remove or encode special characters
  const sanitized = withoutTags
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim(); // Remove leading/trailing whitespace

  return sanitized;
}

// Image validation
export function validateImage(file: File): boolean {
  // Check file type
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return false;
  }

  // Check file size (e.g., 4MB limit)
  const maxSize = 4 * 1024 * 1024; // 4MB in bytes
  if (file.size > maxSize) {
    return false;
  }

  return true;
}

// Price validation
export function validatePrice(price: string | undefined | null): string {
  if (!price) return "";

  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return "";
  }

  // Return as string
  return price;
}
