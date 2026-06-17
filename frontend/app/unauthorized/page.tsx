"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="max-w-md rounded-lg border bg-card p-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold">Unauthorized</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          You do not have permission to view this page.
        </p>
        <div className="flex justify-center gap-3">
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm text-white"
            onClick={() => router.push('/')}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
