export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Memuat halaman"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16 text-center"
    >
      <div className="relative flex h-10 w-10 items-center justify-center">
        <svg
          className="h-8 w-8 animate-spin text-utama"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold text-teks">Memuat halaman...</p>
      <span className="sr-only">Sedang memuat data, mohon tunggu...</span>
    </div>
  );
}

