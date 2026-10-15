import Link from "next/link";
import { button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl page-x py-section-lg text-center">
      <p className="label-caps-sm text-stone-text">Error 404</p>
      <h1 className="mt-3 font-serif text-headline-lg-mobile lowercase italic md:text-headline-lg">
        esta página no existe
      </h1>
      <p className="mt-4 text-body-lg text-stone-text">Puede que la prenda ya no esté disponible.</p>
      <Link href="/catalogo" className={`${button.primary} mt-8`}>
        Ver colección
      </Link>
    </div>
  );
}
