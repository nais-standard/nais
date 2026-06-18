interface RevealProps {
  children: React.ReactNode;
  /** Kept for call-site compatibility; ignored (entrance is scroll-driven CSS). */
  delay?: number;
  className?: string;
}

/**
 * Wraps content with the `.reveal` class. Content is fully visible by default;
 * globals.css applies a scroll-driven CSS entrance only where supported, so this
 * can never leave a section blank. No client JS involved.
 */
export default function Reveal({ children, className = '' }: RevealProps) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
