"use client";

import { Button } from "../ui/button";


interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  onConfirm,
  onCancel,
  isPending,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-2xl">
        <h2 className="mb-2 text-lg font-semibold text-card-foreground">
          {title}
        </h2>

        <p className="mb-6 text-sm text-muted-foreground">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="default"
            onClick={onCancel}
            disabled={isPending}
            className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:opacity-90"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="default"
            onClick={onConfirm}
            disabled={isPending}
            className="cursor-pointer bg-success text-success-foreground hover:bg-success/90 hover:opacity-90"
          >
            {isPending ? "Processing..." : "Proceed"}
          </Button>
        </div>
      </div>
    </div>
  );
}