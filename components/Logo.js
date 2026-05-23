"use client";

// Mochabear M monogram — Variation B (enhanced).
// Angular M with structural crossbars that extend past the diagonal intersections
// into each half's open pocket, making the "44" (Hamilton homage) clearly legible
// while remaining part of the letterform structure.
//
// Geometry (40x40 viewBox, M path: M7,32 L7,8 L20,21 L33,8 L33,32):
//   Left diagonal hits y=15 at x≈14 → crossbar extends to x=19 (into the 4-pocket)
//   Right diagonal hits y=15 at x≈26 → crossbar extends from x=21 (into the 4-pocket)
//   2px gap between x=19 and x=21 separates the two 4s visually.

export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mochabear's F1 Hub"
    >
      <defs>
        <filter id="m-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bar-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.0" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Badge background */}
      <rect width="40" height="40" rx="8" fill="#0A0608" />

      {/* M letterform */}
      <path
        d="M7,32 L7,8 L20,21 L33,8 L33,32"
        stroke="#E10600"
        strokeWidth="3.5"
        strokeLinejoin="miter"
        strokeLinecap="square"
        filter="url(#m-glow)"
      />

      {/* Hidden 44 crossbars — brighter red, extend past diagonals into each "4" pocket */}
      {/* Left "4" crossbar: runs from left upright through diagonal, extending into open space */}
      <line x1="7" y1="15" x2="19" y2="15" stroke="#FF2D20" strokeWidth="2.2" strokeLinecap="square" filter="url(#bar-glow)" />
      {/* Right "4" crossbar: mirrors left — runs from open space through diagonal to right upright */}
      <line x1="21" y1="15" x2="33" y2="15" stroke="#FF2D20" strokeWidth="2.2" strokeLinecap="square" filter="url(#bar-glow)" />
    </svg>
  );
}
