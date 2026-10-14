import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Alba Boutique, inicio"
      className={`flex flex-col items-center leading-none ${className}`}
    >
      <span className="font-serif text-[22px] tracking-[-0.01em] lowercase md:text-[26px]">alba</span>
      <span className="mt-1 label-caps-sm tracking-[0.3em]">Boutique | PY</span>
    </Link>
  );
}
