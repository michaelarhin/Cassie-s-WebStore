import blazer from "@/assets/product-blazer.jpg";
import dressSheath from "@/assets/product-dress-sheath.jpg";
import trousers from "@/assets/product-trousers.jpg";
import blouse from "@/assets/product-blouse.jpg";
import trench from "@/assets/product-trench.jpg";
import skirt from "@/assets/product-skirt.jpg";
import knit from "@/assets/product-knit.jpg";
import midi from "@/assets/product-midi.jpg";
import tote from "@/assets/product-tote.jpg";
import editorial from "@/assets/editorial.jpg";
import giftBox from "@/assets/gift-box.jpg";
import giftCandle from "@/assets/gift-candle.jpg";
import giftBouquet from "@/assets/gift-bouquet.jpg";
import giftJournal from "@/assets/gift-journal.jpg";

export { editorial };

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  color: string;
  description: string;
  details: string[];
  sizes: string[];
  featured?: boolean;
  store?: "aura" | "confetti";
}

export const CATEGORIES = [
  "All",
  "Tailoring",
  "Dresses",
  "Blouses & Knits",
  "Skirts",
  "Outerwear",
  "Accessories",
];

export const products: Product[] = [
  {
    id: "1",
    slug: "sculpted-blazer",
    name: "The Sculpted Blazer",
    category: "Tailoring",
    price: 289,
    image: blazer,
    color: "Ivory Cream",
    description:
      "A double-breasted blazer with a sculpted waist and peak lapels — the cornerstone of a commanding presence. Cut from structured crepe that holds its line from the first meeting to the last flight home.",
    details: [
      "Structured double-breasted crepe",
      "Peak lapels, sculpted waist seam",
      "Fully lined with satin finish",
      "Dry clean only",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: "2",
    slug: "meridian-sheath-dress",
    name: "The Meridian Sheath",
    category: "Dresses",
    price: 215,
    image: dressSheath,
    color: "Onyx",
    description:
      "A sleeveless sheath in Ponte de Roma that skims without clinging. The boat neckline and seamed waist create a silhouette that is boardroom-sharp and dinner-ready.",
    details: [
      "Stable Ponte knit, matte finish",
      "Boat neckline, invisible back zip",
      "Seamed waist, midi length",
      "Machine wash cold",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: "3",
    slug: "atlas-wide-leg-trouser",
    name: "The Atlas Trouser",
    category: "Tailoring",
    price: 185,
    image: trousers,
    color: "Graphite",
    description:
      "High-waisted, wide-legged, precisely pressed. Double pleats fall into a column of wool-blend suiting that moves like it was made for you — because it was.",
    details: [
      "Wool-blend suiting, double pleats",
      "High-rise waist with hook closure",
      "Side pockets, full-length leg",
      "Dry clean only",
    ],
    sizes: ["0", "2", "4", "6", "8", "10", "12"],
    featured: true,
  },
  {
    id: "4",
    slug: "aura-silk-blouse",
    name: "The Aura Silk Blouse",
    category: "Blouses & Knits",
    price: 145,
    image: blouse,
    color: "Champagne",
    description:
      "Pure sandwashed silk with a self-tie bow and blouson sleeves. Softness with authority — wear it knotted, draped, or open over a camisole.",
    details: [
      "100% sandwashed silk",
      "Self-tie neck bow, covered buttons",
      "Blouson sleeve with buttoned cuff",
      "Dry clean recommended",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: "5",
    slug: "highland-trench",
    name: "The Highland Trench",
    category: "Outerwear",
    price: 395,
    image: trench,
    color: "Camel",
    description:
      "The definitive trench: double-faced cotton gabardine, storm flap, and a tie belt that cinches the silhouette. An heirloom for the commute.",
    details: [
      "Double-faced cotton gabardine",
      "Storm flap and gun patch",
      "Self tie belt, D-ring cuffs",
      "Dry clean only",
    ],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
  },
  {
    id: "6",
    slug: "precision-pencil-skirt",
    name: "The Precision Skirt",
    category: "Skirts",
    price: 125,
    image: skirt,
    color: "Graphite",
    description:
      "A pencil skirt engineered for movement — a back vent, a comfort waistband, and a weave that resists wrinkles at 30,000 feet.",
    details: [
      "Stretch suiting weave",
      "Back vent for easy stride",
      "Concealed side zip",
      "Machine wash cold",
    ],
    sizes: ["0", "2", "4", "6", "8", "10", "12"],
  },
  {
    id: "7",
    slug: "fine-gauge-knit-top",
    name: "The Fine-Gauge Knit",
    category: "Blouses & Knits",
    price: 110,
    image: knit,
    color: "Ivory",
    description:
      "A whisper-weight ribbed knit in silk-cotton. The crewneck layers invisibly under tailoring and stands alone when the blazer comes off.",
    details: [
      "Silk-cotton ribbed knit",
      "Slim crewneck silhouette",
      "Fully-fashioned seams",
      "Hand wash cold",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "8",
    slug: "column-knit-midi-dress",
    name: "The Column Midi",
    category: "Dresses",
    price: 230,
    image: midi,
    color: "Stone",
    description:
      "A long-sleeve ribbed knit midi that traces the body in one unbroken line. Zero hardware, zero fuss — pure, quiet elegance.",
    details: [
      "Ribbed viscose-elastane knit",
      "Long sleeve, crewneck",
      "Ankle-grazing midi length",
      "Machine wash cold, lay flat",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "9",
    slug: "structured-leather-tote",
    name: "The Structured Tote",
    category: "Accessories",
    price: 320,
    image: tote,
    color: "Espresso",
    description:
      "Full-grain leather with a structured base that stands on its own — like you. Fits a 14\" laptop, a folder of ambition, and everything between.",
    details: [
      "Full-grain smooth leather",
      "Structured base with feet",
      "Interior zip pocket, laptop sleeve",
      "Gold-tone hardware",
    ],
    sizes: ["One Size"],
  },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
  }).format(n);

const one = ["One size"];
export const giftProducts: Product[] = [
  { id: "g1", slug: "celebration-gift-box", name: "The Celebration Box", category: "Gift Boxes", price: 95, image: giftBox, color: "Cream & Champagne", description: "A curated keepsake box wrapped in cream paper and satin ribbon — ready to hand over the moment it arrives.", details: ["Hand-wrapped with satin ribbon", "Personal note card included", "Curated seasonal contents"], sizes: one, store: "confetti" },
  { id: "g2", slug: "ceramic-candle", name: "The Ceramic Candle", category: "Home", price: 48, image: giftCandle, color: "Ivory", description: "A softly scented soy candle poured into a reusable matte ceramic vessel.", details: ["Soy wax, 50-hour burn", "Reusable ceramic vessel", "Notes of fig and cashmere"], sizes: one, store: "confetti" },
  { id: "g3", slug: "blush-rose-bouquet", name: "The Blush Bouquet", category: "Flowers", price: 75, image: giftBouquet, color: "Blush & Cream", description: "A generous hand-tied bouquet of cream and blush roses wrapped in kraft paper.", details: ["12 premium roses", "Hand-tied, kraft wrapped", "Same-day delivery where available"], sizes: one, store: "confetti" },
  { id: "g4", slug: "leather-journal-set", name: "The Journal Set", category: "Stationery", price: 68, image: giftJournal, color: "Cognac", description: "A wrap-tie leather journal with a brass pen and a 'Just for you' card.", details: ["Full-grain leather cover", "Brass ballpoint pen", "Greeting card included"], sizes: one, store: "confetti" },
];

export const storeProducts = (p: Product) => (p.store === "confetti" ? giftProducts : products);

export const findProduct = (slug: string) =>
  giftProducts.find((p) => p.slug === slug) ??
  products.find((p) => p.slug === slug);
