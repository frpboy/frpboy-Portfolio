// Original inline-SVG robot pet for the portfolio assistant launcher.
// Theme-matched (near-black body, neon-green accents), no external assets or
// dependencies. Character v2: jointed legs with bending knees, pumping arms,
// blinking visor eyes, swaying antenna, ground shadow and dust puffs sell a
// proper run cycle. All motion is CSS keyframes and freezes under
// prefers-reduced-motion. The pet runs in place inside a fixed tap target:
// it never wanders away from the launcher or over page content.
export default function RobotPet({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="robot-pet shrink-0"
    >
      {/* ground shadow, pulses with the stride */}
      <ellipse className="pet-shadow" cx="33" cy="58" rx="12" ry="2.4" fill="#00ff9c" />
      {/* dust puffs kicked up behind the feet */}
      <circle className="pet-puff pet-puff-1" cx="17" cy="55" r="1.7" fill="#00ff9c" />
      <circle className="pet-puff pet-puff-2" cx="20" cy="57" r="1.3" fill="#00ff9c" />
      <circle className="pet-puff pet-puff-3" cx="14" cy="57" r="1" fill="#00ff9c" />

      <g className="pet-runner">
        {/* back arm (right) */}
        <g className="pet-arm pet-arm-r">
          <line x1="40" y1="27" x2="44" y2="35" stroke="#00ff9c" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        {/* back leg (right) */}
        <g className="pet-leg pet-leg-r">
          <line x1="37" y1="38" x2="39" y2="47" stroke="#00ff9c" strokeWidth="2.4" strokeLinecap="round" />
          <g className="pet-shin pet-shin-r">
            <line x1="39" y1="47" x2="38" y2="55" stroke="#00ff9c" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="38" y1="55" x2="42" y2="55" stroke="#00ff9c" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </g>

        {/* body */}
        <rect x="24" y="23" width="16" height="17" rx="6" fill="#07110d" stroke="#00ff9c" strokeWidth="1.6" />
        <circle className="pet-glow" cx="32" cy="30" r="2" fill="#00ff9c" />

        {/* head */}
        <g className="pet-head">
          <line className="pet-antenna" x1="32" y1="5" x2="32" y2="11" stroke="#00ff9c" strokeWidth="2" strokeLinecap="round" />
          <circle className="pet-antenna pet-glow" cx="32" cy="4.5" r="2.2" fill="#00ff9c" />
          <rect x="20" y="11" width="24" height="14" rx="6" fill="#07110d" stroke="#00ff9c" strokeWidth="1.6" />
          {/* visor */}
          <rect x="23" y="14.5" width="18" height="7.5" rx="3.75" fill="#031c12" />
          <circle className="pet-eye" cx="28.5" cy="18.25" r="1.8" fill="#00ff9c" />
          <circle className="pet-eye" cx="35.5" cy="18.25" r="1.8" fill="#00ff9c" />
          {/* smile */}
          <rect x="30" y="23" width="4" height="1.1" rx="0.55" fill="#00ff9c" opacity="0.8" />
        </g>

        {/* front arm (left) */}
        <g className="pet-arm pet-arm-l">
          <line x1="24" y1="27" x2="20" y2="35" stroke="#00ff9c" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        {/* front leg (left) */}
        <g className="pet-leg pet-leg-l">
          <line x1="27" y1="38" x2="25" y2="47" stroke="#00ff9c" strokeWidth="2.4" strokeLinecap="round" />
          <g className="pet-shin pet-shin-l">
            <line x1="25" y1="47" x2="26" y2="55" stroke="#00ff9c" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="26" y1="55" x2="30" y2="55" stroke="#00ff9c" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}
