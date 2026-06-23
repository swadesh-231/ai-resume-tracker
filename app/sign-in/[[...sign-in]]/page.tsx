import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth/auth-shell";

export default function SignInPage() {
  return (
    <AuthShell
      heading="Welcome back"
      subheading="Sign in to continue to your dashboard."
    >
      <SignIn
        appearance={{ elements: { rootBox: "w-full", cardBox: "w-full" } }}
      />
    </AuthShell>
  );
}
