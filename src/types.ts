export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Tailoring' | 'Outerwear' | 'Knitwear' | 'Essentials';
  images: string[]; // [main, hover/detail, styled/model]
  description: string;
  longDescription?: string;
  details: string[]; // bullet features (e.g. "100% organic cotton", "Crafted in Italy")
  careInstructions: string;
  color: string;
  sizes: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isLimitedEdition?: boolean;
  isSale?: boolean;
  isLowStock?: boolean;
  originalPrice?: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  image: string;
  content: string[];
}

export interface Hotspot {
  id: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  productId: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  image: string;
  location: string;
  season: string;
  hotspots: Hotspot[];
}
