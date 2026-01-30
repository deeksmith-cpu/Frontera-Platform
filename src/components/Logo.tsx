interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: "light" | "dark";
}

export default function Logo({ className = "", showText = true, variant = "dark" }: LogoProps) {
  const textColor = variant === "light" ? "#ffffff" : "#0f172a";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Mark */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Background rounded square */}
        <rect width="40" height="40" rx="8" fill="#0f172a" />

        {/* Stylized F with arrow */}
        <path
          d="M12 28V14C12 12.8954 12.8954 12 14 12H24"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M12 20H22"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Teal accent - top curve */}
        <path
          d="M24 12C26.5 12 28 13.5 28 16"
          stroke="#fbbf24"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Coral accent - arrow */}
        <path
          d="M26 20L30 20M30 20L27 17M30 20L27 23"
          stroke="#f97316"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Text */}
      {showText && (
        <span
          className="text-xl font-semibold tracking-tight"
          style={{ color: textColor }}
        >
          Frontera
        </span>
      )}
    </div>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="#0f172a" />
      <path
        d="M12 28V14C12 12.8954 12.8954 12 14 12H24"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 20H22"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M24 12C26.5 12 28 13.5 28 16"
        stroke="#fbbf24"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M26 20L30 20M30 20L27 17M30 20L27 23"
        stroke="#f97316"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
