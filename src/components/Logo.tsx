export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b7bff" />
          <stop offset="1" stopColor="#4f3fd6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logoGradient)" />
      <path
        d="M16 6.5L18.7 13.3L25.5 16L18.7 18.7L16 25.5L13.3 18.7L6.5 16L13.3 13.3L16 6.5Z"
        fill="white"
        fillOpacity="0.95"
      />
    </svg>
  );
}
