"use server";

import { z } from "zod";
// Import a mail sending library - example with Nodemailer
import nodemailer from "nodemailer";

// Define a schema for form validation
const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

// Define the sendEmail function
async function sendEmail({
  to,
  from,
  subject,
  text,
}: {
  to: string;
  from: string;
  subject: string;
  text: string;
}) {
  // Create a transporter - configure with your SMTP settings
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Send the email
  return await transporter.sendMail({
    from: `"Tennis Addicts Contact" <${process.env.SMTP_USER}>`,
    to,
    replyTo: from,
    subject,
    text,
  });
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate the form data
    const validatedData = ContactFormSchema.parse(formData);

    // Here you would typically:
    // 1. Send an email notification
    // 2. Store the message in your database
    // 3. Handle additional processing

    // Using the defined email service
    await sendEmail({
      to: "nztennisaddicts@gmail.com",
      from: validatedData.email,
      subject: `Contact Form: ${validatedData.subject}`,
      text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nSubject: ${validatedData.subject}\n\nMessage: ${validatedData.message}`,
    });

    // Log for demonstration purposes

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true, message: "Your message has been sent" };
  } catch (error) {
    console.error("Error processing contact form:", error);

    if (error instanceof z.ZodError) {
      // Return validation errors
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return {
        success: false,
        message: "Validation failed: " + errorMessages,
        errors: error.errors,
      };
    }

    return {
      success: false,
      message: "Failed to process your request",
    };
  }
}
