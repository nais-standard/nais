import Link from 'next/link';

/* ---------------- Button ---------------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  /** Adjusts secondary/ghost styling for placement on a dark background. */
  onDark?: boolean;
  /** Show a trailing arrow icon. */
  arrow?: boolean;
  external?: boolean;
  className?: string;
}

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M3 7h8M7 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function buttonClasses(variant: ButtonVariant, onDark: boolean) {
  const base =
    'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus-visible:outline-2';
  if (variant === 'primary') {
    return `${base} bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm shadow-violet-600/25 hover:shadow-md hover:shadow-violet-600/40 hover:brightness-110`;
  }
  if (variant === 'secondary') {
    return onDark
      ? `${base} bg-white text-slate-900 hover:bg-slate-100`
      : `${base} bg-slate-900 text-white hover:bg-slate-800`;
  }
  // ghost
  return onDark
    ? `${base} border border-white/15 text-slate-200 hover:bg-white/5 hover:border-white/25`
    : `${base} border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300`;
}

export function Button({
  href,
  children,
  variant = 'primary',
  onDark = false,
  arrow = false,
  external = false,
  className = '',
}: ButtonProps) {
  const cls = `${buttonClasses(variant, onDark)} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowIcon />}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/* ---------------- Eyebrow (pill badge) ---------------- */

export function Eyebrow({
  children,
  onDark = false,
  dot = true,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  dot?: boolean;
}) {
  if (onDark) {
    return (
      <span className="eyebrow-dark">
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />}
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-xs font-medium text-blue-700">
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />}
      {children}
    </span>
  );
}

/* ---------------- Section ---------------- */

interface SectionProps {
  children: React.ReactNode;
  tone?: 'light' | 'surface' | 'dark';
  className?: string;
  containerClassName?: string;
  id?: string;
}

const TONE_CLASS: Record<NonNullable<SectionProps['tone']>, string> = {
  light: '',
  surface: 'bg-slate-50 border-y border-slate-200',
  dark: 'band-dark',
};

export function Section({
  children,
  tone = 'light',
  className = '',
  containerClassName = '',
  id,
}: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${TONE_CLASS[tone]} ${className}`}>
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}

/* ---------------- SectionHeading ---------------- */

export function SectionHeading({
  eyebrow,
  title,
  children,
  onDark = false,
  center = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  onDark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl mb-12 ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${onDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {eyebrow}
        </div>
      )}
      <h2 className={`text-3xl sm:text-[2.25rem] font-semibold tracking-tight leading-tight mb-4 ${onDark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      {children && (
        <p className={`text-lg leading-relaxed ${onDark ? 'text-slate-400' : 'text-slate-500'}`}>{children}</p>
      )}
    </div>
  );
}
