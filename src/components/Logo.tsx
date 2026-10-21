import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Alba Boutique, inicio"
      className={`flex flex-col items-center leading-none ${className}`}
    >
      <span className="font-serif text-[22px] font-semibold tracking-[0.22em] uppercase md:text-[26px]">Alba</span>
      <span className="mt-1 text-[9px] tracking-[0.28em] text-stone-text uppercase">Boutique | PY</span>
    </Link>
  );
}
