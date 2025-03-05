import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
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
            Sign In
          </CardTitle> */}
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Icon name="tennisball" size={48} className="text-green-600" />
            </div>
            <h1 className="text-2xl md:text-5xl font-bold">Sign In</h1>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-0">
          <div className="w-full">
            <SignIn
              appearance={{
                elements: {
                  // Hide header elements
                  header: "hidden",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",

                  // Remove borders from all possible container elements
                  card: {
                    border: "none",
                    boxShadow: "none",
                    borderRadius: "0px",
                  },
                  rootBox: {
                    border: "none",
                    boxShadow: "none",
                  },
                  cardWrapper: {
                    border: "none",
                    boxShadow: "none",
                  },
                  // The main container might be causing the issue
                  main: {
                    border: "none",
                    boxShadow: "none",
                    width: "100%",
                  },

                  // Style other elements
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm",
                  socialButtonsBlockButton:
                    "border border-input hover:bg-muted",
                  footerActionLink: "text-primary hover:text-primary/90",
                  formFieldInput: "border-input",
                  form: "w-full",
                  footer: "hidden",
                },
                variables: {
                  borderRadius: "0px",
                },
              }}
              routing="hash"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/"
            />
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground w-full">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
