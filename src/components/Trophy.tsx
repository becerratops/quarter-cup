// Pixel art trophy rendered with CSS box-shadows
export function Trophy({ size = 64 }: { size?: number }) {
  const scale = size / 64;

  return (
    <div
      style={{
        display: 'inline-block',
        animation: 'trophy-shine 3s ease-in-out infinite',
      }}
      aria-label="Quarter Cup Trophy"
    >
      <svg
        width={64 * scale}
        height={64 * scale}
        viewBox="0 0 64 64"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Trophy cup body */}
        <rect x="16" y="8" width="32" height="4" fill="#FFD700" />
        <rect x="12" y="12" width="40" height="4" fill="#FFD700" />
        <rect x="12" y="16" width="40" height="4" fill="#FFC107" />
        <rect x="14" y="20" width="36" height="4" fill="#FFC107" />
        <rect x="16" y="24" width="32" height="4" fill="#FFB300" />
        <rect x="18" y="28" width="28" height="4" fill="#FFB300" />
        <rect x="22" y="32" width="20" height="4" fill="#FFA000" />

        {/* Handles */}
        <rect x="4" y="12" width="8" height="4" fill="#FFD700" />
        <rect x="4" y="16" width="4" height="8" fill="#FFD700" />
        <rect x="4" y="24" width="8" height="4" fill="#FFD700" />
        <rect x="8" y="20" width="4" height="4" fill="#FFD700" />

        <rect x="52" y="12" width="8" height="4" fill="#FFD700" />
        <rect x="56" y="16" width="4" height="8" fill="#FFD700" />
        <rect x="52" y="24" width="8" height="4" fill="#FFD700" />
        <rect x="52" y="20" width="4" height="4" fill="#FFD700" />

        {/* Star on trophy */}
        <rect x="30" y="16" width="4" height="4" fill="#FFF8E1" />
        <rect x="26" y="20" width="12" height="4" fill="#FFF8E1" />
        <rect x="28" y="24" width="8" height="4" fill="#FFF8E1" />
        <rect x="26" y="28" width="4" height="4" fill="#FFF8E1" />
        <rect x="34" y="28" width="4" height="4" fill="#FFF8E1" />

        {/* Stem */}
        <rect x="28" y="36" width="8" height="8" fill="#B8860B" />

        {/* Base */}
        <rect x="20" y="44" width="24" height="4" fill="#DAA520" />
        <rect x="16" y="48" width="32" height="4" fill="#B8860B" />
        <rect x="16" y="52" width="32" height="4" fill="#996515" />

        {/* "Q1" text on base */}
        <rect x="24" y="49" width="2" height="6" fill="#FFD700" opacity="0.7" />
        <rect x="26" y="49" width="4" height="2" fill="#FFD700" opacity="0.7" />
        <rect x="26" y="53" width="4" height="2" fill="#FFD700" opacity="0.7" />
        <rect x="28" y="51" width="2" height="2" fill="#FFD700" opacity="0.7" />

        <rect x="34" y="49" width="2" height="6" fill="#FFD700" opacity="0.7" />
        <rect x="36" y="49" width="2" height="2" fill="#FFD700" opacity="0.7" />
      </svg>
    </div>
  );
}
