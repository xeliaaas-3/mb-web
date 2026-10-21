import { photo } from "./images";
import { freeDeliveryThreshold, shippingOptions, site } from "./site";
import { formatGs } from "./format";

// Textos de ejemplo de la boutique. Reemplazar por los reales.

export const benefits = [
  { title: "Envíos a todo el país", body: "Delivery en Gran Asunción en 24 hs y encomiendas al interior." },
  { title: `${site.installments} cuotas sin interés`, body: "Con tarjetas de crédito habilitadas en el POS." },
  { title: `Cambios en ${site.exchangeDays} días`, body: "Con etiqueta y sin uso, en el showroom o por envío." },
  { title: "Retiro gratis en el showroom", body: `${site.address.street}, ${site.address.detail}.` },
];

export const looks = [
  {
    id: "manana-de-lino",
    title: "mañana de lino",
    description: "Blanco total, fibras naturales y accesorios de paja para un día de sol.",
    image: photo.whiteJumpsuit,
    alt: "Mujer con mono blanco y sombrero caminando por la calle",
    products: ["mono-lino-blanco", "sombrero-de-paja", "canasto-playero-tejido", "sandalias-cuero-dos-tonos"],
  },
  {
    id: "oficina-chic",
    title: "oficina chic",
    description: "Sastrería en tonos neutros que va de la reunión al after office.",
    image: photo.camelBlazer,
    alt: "Mujer con blazer camel y musculosa negra",
    products: ["blazer-camel", "musculosa-canale-negra", "mules-taco-camel", "sobre-cuero-chocolate"],
  },
  {
    id: "noche-de-saten",
    title: "noche de satén",
    description: "Brillo sutil, dorados y una cartera mínima para la fiesta.",
    image: photo.blackSatinGown,
    alt: "Mujer con vestido largo de satén negro",
    products: ["vestido-largo-saten-noir", "argollas-doradas", "collar-ovalo-dorado", "sobre-cuero-chocolate"],
  },
  {
    id: "finde-en-la-ciudad",
    title: "finde en la ciudad",
    description: "Camisa de lino, jean de tiro alto y lentes para recorrer cafés.",
    image: photo.whiteBlouseBasket,
    alt: "Mujer con blusa blanca y canasto tejido",
    products: ["camisa-lino-blanca", "jean-mom-celeste", "bolso-yute-bandolera", "lentes-cat-eye"],
  },
];

export const reviews = [
  {
    text: "El lino es de una calidad hermosa y me asesoraron con el talle por WhatsApp. Llegó al día siguiente.",
    name: "Valeria M.",
    place: "Villa Morra, Asunción",
  },
  {
    text: "Fui al showroom a probarme vestidos para un casamiento y salí con el look completo. Atención impecable.",
    name: "Camila B.",
    place: "Lambaré",
  },
  {
    text: "Pedí desde Encarnación, me mandaron fotos reales de la prenda antes de enviarla. Súper confiables.",
    name: "Lorena G.",
    place: "Encarnación",
  },
];

const delivery = shippingOptions.find((o) => o.id === "delivery")!;
const interior = shippingOptions.find((o) => o.id === "interior")!;

export const faq: { section: string; items: { q: string; a: string }[] }[] = [
  {
    section: "Pedidos",
    items: [
      {
        q: "¿Cómo hago un pedido?",
        a: "Agregá las prendas a tu bolsa, completá tus datos y tocá “Enviar pedido por WhatsApp”. Se abre un chat con tu pedido armado y una asesora te confirma stock y envío.",
      },
      {
        q: "¿Puedo reservar una prenda?",
        a: "Sí, reservamos hasta 24 horas con la seña o el pago. Escribinos por WhatsApp para coordinar.",
      },
      {
        q: "¿Las fotos son de las prendas reales?",
        a: "Sí. Si querés ver más ángulos o la prenda puesta, pedinos fotos o un video por WhatsApp.",
      },
    ],
  },
  {
    section: "Pagos",
    items: [
      {
        q: "¿Qué medios de pago aceptan?",
        a: "Transferencia bancaria, billeteras (Tigo Money y Billetera Personal), efectivo contra entrega y tarjetas de débito o crédito con POS al recibir.",
      },
      {
        q: "¿Puedo pagar en cuotas?",
        a: `Sí, hasta ${site.installments} cuotas sin interés con tarjetas de crédito habilitadas.`,
      },
    ],
  },
  {
    section: "Envíos",
    items: [
      {
        q: "¿Cuánto cuesta el envío?",
        a: `Delivery en Asunción y Gran Asunción: ${formatGs(delivery.cost)}, gratis desde ${formatGs(freeDeliveryThreshold)}. Interior del país: ${formatGs(interior.cost)} por transportadora o encomienda. Retiro en el showroom: gratis.`,
      },
      {
        q: "¿Cuánto tarda en llegar?",
        a: "En Gran Asunción entregamos en 12 a 24 horas hábiles. Al interior, de 24 a 72 horas según la ciudad.",
      },
    ],
  },
  {
    section: "Cambios y talles",
    items: [
      {
        q: "¿Puedo cambiar una prenda?",
        a: `Sí, dentro de los ${site.exchangeDays} días de recibida, sin uso y con etiqueta. Podés cambiarla por otro talle, color o prenda.`,
      },
      {
        q: "¿Cómo sé mi talle?",
        a: "Usá nuestra guía de talles o el asistente: con tu medida de busto te recomendamos el talle. También te pasamos medidas exactas de cada prenda.",
      },
      {
        q: "¿Hacen devoluciones de dinero?",
        a: "Solo si la prenda llegó con una falla. En los demás casos ofrecemos cambio o una nota de crédito.",
      },
    ],
  },
];

export const policies = [
  {
    title: "Envíos",
    paragraphs: [
      `Delivery en Asunción y Gran Asunción por ${formatGs(delivery.cost)}, en 12 a 24 horas hábiles. Gratis en compras desde ${formatGs(freeDeliveryThreshold)}.`,
      `Al interior del país enviamos por transportadora (AEX, NSA) o encomienda por ${formatGs(interior.cost)}. Te pasamos el número de seguimiento por WhatsApp.`,
      `Retiro gratis en el showroom (${site.address.street}, ${site.address.detail}, ${site.address.city}), ${site.hours.toLowerCase()}.`,
    ],
  },
  {
    title: "Cambios",
    paragraphs: [
      `Tenés ${site.exchangeDays} días desde que recibís tu pedido para cambiar una prenda por otro talle, color o modelo.`,
      "La prenda debe estar sin uso, sin lavar y con su etiqueta. Por higiene, la bijouterie y la ropa interior no tienen cambio.",
      "Si el cambio es por talle o preferencia, el envío corre por tu cuenta. Si la prenda tiene una falla, nos encargamos de todo.",
    ],
  },
  {
    title: "Devoluciones",
    paragraphs: [
      "Si una prenda llega con falla de fabricación, te devolvemos el dinero o la cambiamos, como prefieras.",
      "En los demás casos ofrecemos una nota de crédito válida por 90 días para usar en la tienda o el showroom.",
    ],
  },
  {
    title: "Privacidad",
    paragraphs: [
      "Usamos tu nombre, celular y dirección solo para coordinar y entregar tu pedido. No compartimos tus datos con terceros.",
      "El sitio usa analítica anónima para saber qué prendas interesan más y mejorar la tienda.",
    ],
  },
];

export const giftCardAmounts = [100000, 200000, 300000, 500000];
