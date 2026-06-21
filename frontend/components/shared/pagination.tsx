import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  page,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: number[] = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card p-4">
      <div className="text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">
          {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="h-9 px-3"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {getPages().map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === page ? "default" : "secondary"}
            onClick={() => onPageChange(pageNumber)}
            className="h-9 min-w-9 px-3"
          >
            {pageNumber}
          </Button>
        ))}

        <Button
          variant="secondary"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-9 px-3"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}