import type { ReactNode } from "react";
import { eyebrow } from "./ui";

/** Encabezado de las páginas institucionales. */
export function PageHeader({
  eyebrowText,
  title,
  children,
}: {
  eyebrowText: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-width page-x pt-10 pb-8 md:pt-16">
      <p className={eyebrow}>{eyebrowText}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-display-mobile lowercase italic md:text-display">{title}</h1>
      {children && <div className="mt-4 max-w-2xl text-body-lg text-stone-text">{children}</div>}
    </header>
  );
}
