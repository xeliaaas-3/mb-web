import { capitalize } from "./order";
import { inStock, type Product } from "./products";
import { shippingOptions, site } from "./site";

// Datos estructurados schema.org (JSON-LD) para que Google muestre precio, stock y datos del local.

export function storeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: site.name,
    url: site.url,
    image: `${site.url}/opengraph-image.jpg`,
    telephone: site.whatsappDisplay.replace(/\s/g, ""),
    priceRange: "₲₲",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.detail,
      addressCountry: "PY",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    sameAs: [`https://instagram.com/${site.instagram}`],
  };
}

export function productJsonLd(product: Product) {
  const url = `${site.url}/prenda/${product.slug}`;
  const delivery = shippingOptions.find((o) => o.id === "delivery")!;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: capitalize(product.name),
    sku: product.slug,
    url,
    image: product.images.map((i) => i.src),
    description: product.description.join(" "),
    material: product.material,
    color: product.colors.map((c) => c.name).join(", "),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: "PYG",
      availability: inStock(product) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.name },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: delivery.cost, currency: "PYG" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "PY" },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "PY",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: site.exchangeDays,
        returnMethod: "https://schema.org/ReturnInStore",
      },
    },
  };
}
