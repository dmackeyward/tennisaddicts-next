import { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import prompts from "@/prompts/prompts";

export const metadata: Metadata = {
  title: prompts.auth.signUp.metadata.title,
  description: prompts.auth.signUp.metadata.description,
};

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) {
    // Set the alreadySignedIn flag in sessionStorage
    sessionStorage.setItem("alreadySignedIn", "true");
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-green-100">
      <div className="w-full max-w-md bg-white p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Icon name="tennisball" size={48} className="text-green-600" />
            </div>
            <h1 className="text-2xl md:text-5xl font-bold">
              {prompts.auth.signUp.title}
            </h1>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-0">
          <div className="w-full">
            <SignUp
              appearance={{
                elements: {
                  header: "hidden",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm",
                  card: "shadow-none border-0 w-full",
                  rootBox: "w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border border-input hover:bg-muted",
                  footerActionLink: "text-primary hover:text-primary/90",
                  formFieldInput: "border-input",
                  form: "w-full",
                  main: "w-full",
                  footer: "hidden",
                },
              }}
              routing="path"
              path="/sign-up"
              fallbackRedirectUrl="/"
            />
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground w-full">
            <p>
              {prompts.auth.signUp.alreadyHaveAccount}{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/90 font-medium"
              >
                {prompts.auth.signUp.signInLink}
              </Link>
            </p>

            <p className="mt-4">
              {prompts.auth.signUp.termsText}{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-foreground"
              >
                {prompts.auth.signUp.termsOfServiceLink}
              </Link>{" "}
              {prompts.auth.signUp.andText}{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-foreground"
              >
                {prompts.auth.signUp.privacyPolicyLink}
              </Link>
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
