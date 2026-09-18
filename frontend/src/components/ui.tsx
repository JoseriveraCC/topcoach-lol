import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export function Brand() {
  return <a className="brand" href="#/" aria-label="TopCoach LoL, inicio"><span className="brand-mark" />TopCoach LoL</a>;
}

type ButtonBaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "link";
  className?: string;
};

type ButtonProps =
  | (ButtonBaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps | "href"> & { href: string })
  | (ButtonBaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps | "href"> & { href?: undefined });

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { children, variant = "primary", className = "", ...anchorProps } = props;
    const classes = `button button--${variant} ${className}`.trim();
    return <a className={classes} {...anchorProps}>{children}</a>;
  }

  const { children, variant = "primary", className = "", href: _href, ...buttonProps } = props;
  const classes = `button button--${variant} ${className}`.trim();
  return <button className={classes} {...buttonProps}>{children}</button>;
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
  const moveFocus = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    tabs?.[nextIndex]?.focus();
    onChange(items[nextIndex]);
  };

  return <div className="tabs" role="tablist" aria-label="Secciones del informe">{items.map((item, index) => <button key={item} type="button" className={item === active ? "tab tab--active" : "tab"} role="tab" aria-selected={item === active} tabIndex={item === active ? 0 : -1} onClick={() => onChange(item)} onKeyDown={(event) => moveFocus(event, index)}>{item}</button>)}</div>;
}
