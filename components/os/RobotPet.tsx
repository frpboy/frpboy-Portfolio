// Original inline-SVG robot pet for the portfolio assistant launcher.
// Theme-matched (near-black body, neon-green accents), no external assets or
// dependencies. All motion is CSS keyframes and freezes under
// prefers-reduced-motion. The pet bobs and runs in place inside a fixed tap
// target: it never wanders away from the launcher or over page content.
export default function RobotPet({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="robot-pet shrink-0"
    >
      {/* antenna */}
      <line className="pet-antenna" x1="24" y1="4" x2="24" y2="9" stroke="#00ff9c" strokeWidth="2" strokeLinecap="round" />
      <circle className="pet-antenna" cx="24" cy="4" r="2" fill="#00ff9c" />
      {/* head */}
      <rect className="pet-body" x="12" y="9" width="24" height="16" rx="5" fill="#07110d" stroke="#00ff9c" strokeWidth="1.6" />
      {/* eyes */}
      <circle className="pet-eye" cx="19" cy="17" r="2.1" fill="#00ff9c" />
      <circle className="pet-eye" cx="29" cy="17" r="2.1" fill="#00ff9c" />
      {/* mouth */}
      <rect x="21" y="21" width="6" height="1.6" rx="0.8" fill="#00ff9c" opacity="0.8" />
      {/* body */}
      <rect className="pet-body" x="15" y="26" width="18" height="11" rx="4" fill="#07110d" stroke="#00ff9c" strokeWidth="1.6" />
      <circle cx="24" cy="31.5" r="2" fill="#00ff9c" opacity="0.9" />
      {/* arms */}
      <line className="pet-arm pet-arm-l" x1="13" y1="28" x2="9" y2="34" stroke="#00ff9c" strokeWidth="2" strokeLinecap="round" />
      <line className="pet-arm pet-arm-r" x1="35" y1="28" x2="39" y2="34" stroke="#00ff9c" strokeWidth="2" strokeLinecap="round" />
      {/* legs */}
      <line className="pet-leg pet-leg-l" x1="20" y1="37" x2="18" y2="44" stroke="#00ff9c" strokeWidth="2.2" strokeLinecap="round" />
      <line className="pet-leg pet-leg-r" x1="28" y1="37" x2="30" y2="44" stroke="#00ff9c" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
