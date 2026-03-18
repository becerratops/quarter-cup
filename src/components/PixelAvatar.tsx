// Generate a deterministic pixel art avatar from a name
const AVATAR_COLORS = [
  '#ff3366', '#ffd700', '#39ff14', '#00d4ff',
  '#b366ff', '#ff8c00', '#ff69b4', '#00ff88',
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generatePixelPattern(name: string): boolean[][] {
  const hash = hashName(name);
  const grid: boolean[][] = [];

  // 5x5 grid, mirrored horizontally for symmetry
  for (let y = 0; y < 5; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < 3; x++) {
      const bit = (hash >> (y * 3 + x)) & 1;
      row.push(bit === 1);
    }
    // Mirror: col 3 = col 1, col 4 = col 0
    row.push(row[1]);
    row.push(row[0]);
    grid.push(row);
  }

  return grid;
}

export function PixelAvatar({ name, size = 40 }: { name: string; size?: number }) {
  const pattern = generatePixelPattern(name);
  const hash = hashName(name);
  const color = AVATAR_COLORS[hash % AVATAR_COLORS.length];
  const pixelSize = size / 7; // 5 pixels + 1px border each side

  return (
    <div style={{
      width: size,
      height: size,
      background: '#1a1a2e',
      border: '2px solid #333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg
        width={pixelSize * 5}
        height={pixelSize * 5}
        viewBox="0 0 5 5"
        style={{ imageRendering: 'pixelated' }}
      >
        {pattern.map((row, y) =>
          row.map((filled, x) =>
            filled ? (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}
