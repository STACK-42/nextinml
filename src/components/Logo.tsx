interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

export function Logo({ size = 44, showWordmark = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="NextInML"
      >
        {/* Outer arc */}
        <path
          d="M6 28 A16 16 0 0 1 38 28"
          stroke="#534AB7"
          strokeOpacity="0.28"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          className="signal-pulse"
        />
        {/* Middle arc */}
        <path
          d="M12 30 A10 10 0 0 1 32 30"
          stroke="#534AB7"
          strokeOpacity="0.55"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Center dot */}
        <circle cx="22" cy="30" r="3" fill="#534AB7" />
        {/* Teal arrow */}
        <path
          d="M22 28 L22 14 M17 19 L22 14 L27 19"
          stroke="#1D9E75"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-light tracking-[0.25em]" style={{ color: "#534AB7" }}>
            NEXT
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            <span style={{ color: "#1D9E75" }}>In</span>
            <span style={{ color: "#1A1A1A" }}>ML</span>
          </span>
        </div>
      )}
    </div>
  );
}
