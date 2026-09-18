import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Brand() {
  return <a className="brand" href="#/" aria-label="TopCoach LoL, inicio"><span className="brand-mark" />TopCoach LoL</a>;
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "link";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, href, variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `button button--${variant} ${className}`.trim();
  if (href) return <a className={classes} href={href}>{children}</a>;
  return <button className={classes} {...props}>{children}</button>;
}

export function Panel({ children, className = "", accent = true }: { children: ReactNode; className?: string; accent?: boolean }) {
  return <section className={`panel ${accent ? "panel--accent" : ""} ${className}`.trim()}>{children}</section>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <header className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}

export function StatusBadge({ tone, children }: { tone: "success" | "warning" | "danger" | "neutral"; children: ReactNode }) {
  return <span className={`status status--${tone}`}>{children}</span>;
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return <div className="progress-wrap"><div className="progress-meta"><span>{label}</span><strong>{value}/{max}</strong></div><div className="progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}><span style={{ width: `${percentage}%` }} /></div></div>;
}

export function Tabs({ items, active, onChange }: { items: readonly string[]; active: string; onChange: (item: string) => void }) {
  return <div className="tabs" role="tablist" aria-label="Secciones del informe">{items.map((item) => <button key={item} className={item === active ? "tab tab--active" : "tab"} role="tab" aria-selected={item === active} onClick={() => onChange(item)}>{item}</button>)}</div>;
}
