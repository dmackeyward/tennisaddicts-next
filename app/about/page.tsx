// app/about/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import prompts from "@/prompts/prompts";

export const metadata: Metadata = {
  title: prompts.aboutUs.metadata.title,
  description: prompts.aboutUs.metadata.description,
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white to-green-100 gradient-extender">
      {/* Hero Section */}
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <Icon name="tennisball" size={48} className="text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            {prompts.aboutUs.title}
          </h1>
          <p className="text-xl max-w-3xl">{prompts.aboutUs.description}</p>
        </div>

        {/* Our Story */}
        <Card className="shadow-md mb-12">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">
              {prompts.aboutUs.sections.ourStory.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prompts.aboutUs.sections.ourStory.paragraphs.map(
                (paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <Card className="shadow-md mb-12">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">
              {prompts.aboutUs.sections.whatWeOffer.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {prompts.aboutUs.sections.whatWeOffer.features.map(
                (feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="bg-green-100 rounded-full p-3 mb-4">
                      <Icon
                        name="tennisball"
                        size={28}
                        className="text-green-600"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p>{feature.description}</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact and Join Us */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">
              {prompts.aboutUs.sections.joinCommunity.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                {prompts.aboutUs.sections.joinCommunity.paragraphs.map(
                  (paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  )
                )}
              </div>
              <div className="flex flex-col gap-4">
                <Link href="/sign-up">
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 h-auto w-full">
                    {prompts.aboutUs.sections.joinCommunity.signUpButton}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-white hover:bg-gray-100 text-green-600 border border-green-600 font-medium px-6 py-3 h-auto w-full">
                    {prompts.aboutUs.sections.joinCommunity.contactButton}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
