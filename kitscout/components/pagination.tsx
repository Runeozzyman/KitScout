"use client";

type Props = {
  page: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalItems,
  itemsPerPage,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-center items-center gap-3 mt-6">
      <button
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-blue-200"
      >
        Prev
      </button>

      <span className="text-sm">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() =>
          onPageChange(Math.min(page + 1, totalPages))
        }
        disabled={page === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-blue-200"
      >
        Next
      </button>
    </div>
  );
}