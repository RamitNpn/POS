import { X } from "lucide-react";

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export default function FormHeader({
  title,
  subtitle,
  onClose,
}: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div>
        <h2 className="text-lg font-semibold text-card-foreground">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X size={18} />
      </button>
    </div>
  );
}