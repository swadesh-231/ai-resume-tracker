import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-16">
      <SignUp />
    </main>
  );
}
