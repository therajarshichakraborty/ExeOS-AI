import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { authAppearance } from "@/components/auth/appearance";
import { AuthFormSkeleton } from "@/components/skeletons";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return <SignIn appearance={authAppearance} fallback={<AuthFormSkeleton />} />;
}
