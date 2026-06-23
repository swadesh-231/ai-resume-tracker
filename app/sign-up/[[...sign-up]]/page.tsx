import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell
      heading="Create your account"
      subheading="Start tracking your job applications in minutes."
    >
      <SignUp
        appearance={{ elements: { rootBox: "w-full", cardBox: "w-full" } }}
      />
    </AuthShell>
  );
}
