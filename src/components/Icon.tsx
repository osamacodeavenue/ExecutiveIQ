import type { CSSProperties } from 'react';

export const icons = {
  overview: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  sales: 'M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6',
  finance: 'M2 6h20v12H2z M12 9a3 3 0 1 1 0 6a3 3 0 1 1 0-6 M6 12h.01 M18 12h.01',
  operations: 'M1 3h14v13H1z M15 8h4l3 3v5h-7z M5.5 16.5a2 2 0 1 1 0 4a2 2 0 1 1 0-4 M18.5 16.5a2 2 0 1 1 0 4a2 2 0 1 1 0-4',
  customers: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 1 0 8a4 4 0 1 1 0-8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  analyst: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  decisions: 'M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20 M12 6a6 6 0 1 1 0 12a6 6 0 1 1 0-12 M12 10a2 2 0 1 1 0 4a2 2 0 1 1 0-4',
  reports: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  data: 'M12 3c4.97 0 9 1.34 9 3s-4.03 3-9 3-9-1.34-9-3 4.03-3 9-3z M21 12c0 1.66-4 3-9 3s-9-1.34-9-3 M3 6v12c0 1.66 4 3 9 3s9-1.34 9-3V6',
  settings: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
  truck: 'M1 3h14v13H1z M15 8h4l3 3v5h-7z M5.5 16.5a2 2 0 1 1 0 4a2 2 0 1 1 0-4 M18.5 16.5a2 2 0 1 1 0 4a2 2 0 1 1 0-4',
  box: 'M21 8l-9-5-9 5 9 5 9-5z M3 8v8l9 5 9-5V8 M12 13v8',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01',
  calendar: 'M3 5h18v16H3z M16 3v4 M8 3v4 M3 10h18',
  layers: 'M12 2l10 5-10 5L2 7z M2 17l10 5 10-5 M2 12l10 5 10-5',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z M12 7.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0-5',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  chevDown: 'M6 9l6 6 6-6',
  chevUp: 'M7 15l5-5 5 5',
  arrowRight: 'M5 12h14 M13 6l6 6-6 6',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z',
  send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4z',
  check: 'M20 6L9 17l-5-5',
  close: 'M18 6L6 18 M6 6l12 12',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
  fileLines: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  user: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 1 0 8a4 4 0 1 1 0-8',
  menu: 'M3 6h18 M3 12h18 M3 18h18',
  logo: 'M6 18v-5 M12 18V9 M18 18V5',
} as const;

export type IconName = keyof typeof icons;

interface Props {
  name?: IconName;
  d?: string;
  size?: number;
  stroke?: string;
  width?: number;
  style?: CSSProperties;
  className?: string;
}

export function Icon({ name, d, size = 18, stroke = 'currentColor', width = 1.8, style, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      aria-hidden="true"
      className={className}
      style={{ strokeWidth: width, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, ...style }}
    >
      <path d={d ?? (name ? icons[name] : '')} />
    </svg>
  );
}
