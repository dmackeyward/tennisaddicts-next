import { Metadata } from "next";
import ContactForm from "@/app/contact/components/ContactForm";
import Icon from "@/components/Icon";
import prompts from "@/prompts/prompts";

export const metadata: Metadata = {
  title: prompts.contactUs.metadata.title,
  description: prompts.contactUs.metadata.description,
};

export default function Contact() {
  return (
    <div className="min-h-screen">
      <div
        className="absolute inset-0 bg-gradient-to-b from-white to-green-100 w-full h-full"
        style={{ position: "fixed", zIndex: -1 }}
      ></div>

      {/* Hero Section */}
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <Icon name="tennisball" size={48} className="text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            {prompts.contactUs.title}
          </h1>
          <p className="text-xl max-w-2xl">{prompts.contactUs.description}</p>
        </div>

        <div>
          {/* Contact Form Card - Client Component */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
