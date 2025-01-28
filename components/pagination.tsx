import { useLanguage } from "@/contexts/LanguageContext";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const { t } = useLanguage();

  const renderPageNumbers = () => {
    const pages: number[] = [];

    // Add first page
    if (currentPage > 4) {
      pages.push(1);
    }

    // Add ellipsis for skipped pages at the start
    if (currentPage > 5) {
      pages.push(-1); // -1 will represent an ellipsis
    }

    // Add previous 3 pages, current page, and next 3 pages
    for (let i = Math.max(1, currentPage - 3); i <= Math.min(totalPages, currentPage + 3); i++) {
      pages.push(i);
    }

    // Add ellipsis for skipped pages at the end
    if (currentPage < totalPages - 4) {
      pages.push(-2); // -2 will represent an ellipsis
    }

    // Add last page
    if (currentPage < totalPages - 3) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Page Size Selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="pageSize" className="text-sm text-muted-foreground">
         {t("pagination.pageSize")}
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-primary"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded text-sm text-muted-foreground transition-colors duration-150 ${
            currentPage === 1
              ? "cursor-not-allowed bg-muted"
              : "hover:bg-primary hover:text-primary-foreground"
          }`}
        >
{       t("pagination.prev")}
        </button>

        {/* Page Numbers */}
        {renderPageNumbers().map((page, index) =>
          page === -1 || page === -2 ? (
            <span key={index} className="px-3 py-1 text-muted-foreground">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border rounded text-sm transition-colors duration-150 ${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded text-sm text-muted-foreground transition-colors duration-150 ${
            currentPage === totalPages
              ? "cursor-not-allowed bg-muted"
              : "hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {t("pagination.next")}
        </button>
      </div>
    </div>
  );
};
