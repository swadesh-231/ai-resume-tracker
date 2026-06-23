import Link from "next/link";
import { FileQuestionIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ApplicationNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileQuestionIcon className="size-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Application not found</h2>
        <p className="text-sm text-muted-foreground">
          It may have been deleted, or it doesn&apos;t belong to your account.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/applications">Back to applications</Link>
      </Button>
    </div>
  );
}
