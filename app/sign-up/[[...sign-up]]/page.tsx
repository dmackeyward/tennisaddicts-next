import { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "X",
};

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) {
    // Add the alreadySignedIn query parameter when redirecting
    redirect("/?alreadySignedIn=true");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-green-100">
      <div className="w-full max-w-md bg-white p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          {/* <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle> */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Icon name="tennisball" size={48} className="text-green-600" />
            </div>
            <h1 className="text-2xl md:text-5xl font-bold">Sign Up</h1>
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
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-4">
              By signing up, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
