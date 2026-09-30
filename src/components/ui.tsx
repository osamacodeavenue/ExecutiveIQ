import type { CSSProperties, ReactNode } from 'react';

export function Track({ w, c, h = 6, width, radius = 999 }: { w: string; c: string; h?: number; width?: number | string; radius?: number }) {
  return (
    <div className="track" style={{ height: h, width, flexShrink: width ? 0 : undefined, borderRadius: radius }}>
      <div className="bar" style={{ width: w, background: c, borderRadius: radius }} />
    </div>
  );
}

export function Skeleton({ h, w }: { h: number; w: string }) {
  return <div className="skel" style={{ height: h, width: w }} />;
}

export function SectionHead({ title, sub, right, style }: { title: ReactNode; sub?: ReactNode; right?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', ...style }}>
      <div>
        <h2 className="h2">{title}</h2>
        {sub && <p className="sub">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function PageHead({ title, sub }: { title: string; sub: ReactNode }) {
  return (
    <div>
      <h1 className="h1">{title}</h1>
      <p className="sub" style={{ fontSize: 14 }}>{sub}</p>
    </div>
  );
}

/** Label · bar · value row used across breakdown cards. */
export function BarRow({ label, w, c, value, cols, h = 10, valueColor, extra }: {
  label: ReactNode; w: string; c: string; value: ReactNode; cols: string; h?: number; valueColor?: string; extra?: ReactNode;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, alignItems: 'center' }}>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
      <Track w={w} c={c} h={h} />
      <span className="num" style={{ fontSize: 13, fontWeight: 600, textAlign: 'right', color: valueColor }}>{value}</span>
      {extra}
    </div>
  );
}
