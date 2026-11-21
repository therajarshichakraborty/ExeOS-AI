import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { authAppearance } from "@/components/auth/appearance";
import { AuthFormSkeleton } from "@/components/skeletons";

export const metadata: Metadata = { title: "Create your account" };

export default function Page() {
  return <SignUp appearance={authAppearance} fallback={<AuthFormSkeleton />} />;
}
