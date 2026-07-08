import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Kora Khadi Cocoon Duster',
    price: 5800,
    category: 'Outerwear',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=90'
    ],
    description: 'An oversized, floor-grazing duster coat crafted from organic handspun Kora Khadi cotton. Features dropped shoulders, a soft self-tie belt, and subtle gold zari selvedges on the interior lapels.',
    longDescription: 'Our signature Kora Duster is hand-woven by local weaver cooperatives in Maheshwar, Madhya Pradesh. Spun with raw, unbleached un-dyed cotton to preserve the earthy slub and organic touch. The interior seam carries a whisper-thin golden Zari border, combining everyday luxury with historic Indian handloom.',
    details: [
      '100% Organic Handspun Cotton (Kora Khadi)',
      'Hand-woven in Maheshwar, India',
      'Interior seam lined with fine metallic gold Zari',
      'Zero synthetic dyes, preserving natural flax tones',
      'Relaxed architectural silhouette with self-tie belt',
      'Concealed deep side seam pockets'
    ],
    careInstructions: 'Dry clean only on first three washes. Hand wash cold separately with mild soap thereafter. Lay flat to dry.',
    color: 'Kora Alabaster',
    sizes: ['XS', 'S', 'M', 'L'],
    isNew: true,
    isTrending: true
  },
  {
    id: 'p2',
    name: 'Bandhgala Indigo Linen Blazer',
    price: 4500,
    category: 'Tailoring',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=90'
    ],
    description: 'A modern structured Bandhgala jacket featuring a clean mandarin collar, hand-carvassed shoulders, and custom hand-carved coconut husk buttons. Dyed in pure natural organic Indigo.',
    longDescription: 'Blending masculine military precision with contemporary minimalist lines, this blazer features an architectural mandarin neck silhouette. Crafted from dense 100% natural organic flax linen from Bihar and hand-dyed over 10 fermentation cycles in Indigo vats. Lined with ultra-soft organic mulmul.',
    details: [
      '100% Organic Indigo Flax Linen',
      'Lined with breathable 100% organic Cotton Mulmul',
      'Clean Mandarin collar (Bandhgala styling)',
      'Hand-carved organic coconut husk buttons',
      'Tailored with high armholes for sharp postural alignment',
      'Made in our Jaipur artisanal studio'
    ],
    careInstructions: 'Dry clean recommended. Natural indigo may transfer slightly in high humidity; wear with darker layers initially.',
    color: 'Fermented Indigo',
    sizes: ['S', 'M', 'L', 'XL'],
    isBestseller: true,
    isTrending: true
  },
  {
    id: 'p3',
    name: 'Chanderi Cotton-Silk Pleated Kurta',
    price: 3200,
    category: 'Tailoring',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1600&q=90'
    ],
    description: 'A luxurious fine-gauge shirt-kurta woven from soft long-staple Chanderi cotton-silk. Designed with refined accordian pleats along the front placket.',
    longDescription: 'The Chanderi Pleated Kurta is a versatile staple bridging editorial high fashion and everyday ease. Woven with 60% premium Mulberry Silk and 40% GOTS cotton in Pranpur, Madhya Pradesh. It exhibits a beautiful sheer, lustrous drape that breathes remarkably well in all tropical climates.',
    details: [
      '60% Mulberry Silk, 40% Organic Cotton (Chanderi Weave)',
      'Handloomed by master weavers in Madhya Pradesh',
      'Elegant, crisp hand-pressed plait pleating on the front',
      'Hidden natural mother-of-pearl button closure',
      'Classic curved side-slit hemline for untucked style',
      'Featherlight 80 grams overall weight'
    ],
    careInstructions: 'Gentle hand wash in cold water using silk-appropriate pH neutral wash. Line dry in shade. Warm iron on silk setting.',
    color: 'Warm Ochre',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isLimitedEdition: true
  },
  {
    id: 'p4',
    name: 'Kora Linen Drawstring Pants',
    price: 2400,
    category: 'Essentials',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1600&q=90'
    ],
    description: 'Relaxed straight-leg trousers woven from unbleached natural long-fiber flax linen. Features an elasticized drawstring waistband and deep side slip pockets.',
    longDescription: 'Elegance met with absolute, unbothered comfort. Woven in Bhagalpur, Bihar, these organic linen drawstring pants are pre-washed with local minerals for ultimate touchability. Sits comfortable on the natural mid-rise, falling into a wide-leg profile that is perfect for summer studio styling.',
    details: [
      '100% Organic Bhagalpur Flax Linen',
      'Unbleached raw colorway (completely organic raw flax)',
      'Comfort-first elasticated waistband with herringbone cord',
      'Deep, functional side and back welt pockets',
      'Pre-washed with zero chemical sizing agents'
    ],
    careInstructions: 'Machine wash cold on delicate cycle. Line dry. Iron slightly damp on reverse to smooth natural linen creases.',
    color: 'Ecru Sand',
    sizes: ['S', 'M', 'L'],
    isNew: true,
    isTrending: true
  },
  {
    id: 'p5',
    name: 'Anantam Raw Silk Bias Dress',
    price: 4800,
    category: 'Essentials',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1600&q=90'
    ],
    description: 'A liquid fluid-cowl bias cut dress crafted from premium sand-washed raw Bhagalpur silk. Features an elegant midi-length and thin adjustable straps.',
    longDescription: 'Cut diagonally across the weave grain (bias cut) to naturally drape and hug the curves of the body. Spun from wild Tussar/Bhagalpur raw silk, sand-washed to yield a velvety, matte peach-skin finish that feels incredibly rich, cooling, and luxurious against the skin.',
    details: [
      '100% Sand-washed Tussar Raw Silk',
      'Sourced ethically from non-violent silkworm harvesting',
      'Draped cowl neckline with elegant scoop back',
      'Premium interior French seams for next-to-skin comfort',
      'Adjustable micro shoulder straps with metal sliders'
    ],
    careInstructions: 'Dry clean or gentle cold hand wash. Wrap in towel to absorb excess moisture, do not wring. Dry flat in shade.',
    color: 'Terracotta Clay',
    sizes: ['XS', 'S', 'M', 'L'],
    isBestseller: true,
    isSale: true,
    originalPrice: 6000
  },
  {
    id: 'p6',
    name: 'Desi Oorla Wool Mockneck',
    price: 3600,
    category: 'Knitwear',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1600&q=90'
    ],
    description: 'A beautifully structured medium-weight mockneck sweater knitted from raw, hand-carded Desi sheep wool from the drylands of Kachchh, Gujarat.',
    longDescription: 'This exceptional knit is made of indigenous Patanwadi sheep wool, carded, spun, and knitted by pastoral communities in Kachchh. Highly thermal, naturally moisture-wicking, and rich in natural wool oils that repel dirt and wear. A true capsule heirloom that gets softer with every winter.',
    details: [
      '100% Indigenous Desi Sheep Wool',
      'Hand-carded and naturally processed without harsh acids',
      'Dense, protective medium-weight knit texture',
      'Reinforced rib-knit high collar, cuffs, and bottom hem',
      'Made in partnership with Kachchh artisan trusts'
    ],
    careInstructions: 'Dry clean or very gentle hand wash in cold water with wool-specific shampoo. Dry flat on dry towel. Never hang wet.',
    color: 'Charcoal Madder',
    sizes: ['S', 'M', 'L'],
    isNew: true,
    isLimitedEdition: true,
    isLowStock: true
  },
  {
    id: 'p7',
    name: 'Premium Mulmul Slouchy Tee',
    price: 1400,
    category: 'Essentials',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=90'
    ],
    description: 'A beautifully soft, relaxed, breezy tee cut from dense 100% handloom organic Cotton Mulmul. Features an elevated ribbed collar and clean blind hems.',
    longDescription: 'Reimagining the classic casual tee with the softest fabric in Indian history. Mulmul—celebrated for centuries as "woven air"—is highly breathable and beautifully light. Double-combed for high durability, it sits relaxed away from the torso to allow natural aeration in tropical climates.',
    details: [
      '100% Handloom GOTS Certified Cotton Mulmul',
      'Grown organically in southern Indian cotton estates',
      'Featherlight yet durable double-knit construction',
      'Subtly ribbed mock collar that keeps its structural form',
      'Pre-shrunk and pre-softened with local organic oils'
    ],
    careInstructions: 'Machine wash cold with mild detergent on gentle cycle. Warm iron on reverse. Hang to dry.',
    color: 'Raw Alabaster',
    sizes: ['S', 'M', 'L', 'XL'],
    isBestseller: true,
    isSale: true,
    originalPrice: 1800
  },
  {
    id: 'p8',
    name: 'Banarasi Brocade Pleated Skirt',
    price: 6200,
    category: 'Tailoring',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1600&q=90'
    ],
    description: 'An architectural pleated midi skirt showcasing a subtle, contemporary hand-woven micro-Zari brocade pattern from Varanasi weavers.',
    longDescription: 'Blending modern kinetic pleated movement with Varanasi’s deep loom history. Features crisp heat-pressed accordian pleats woven from a lightweight wool-silk blend. A custom-drafted modern geometric zari motif reflects the light subtly as you move.',
    details: [
      '80% Lightweight Merino Wool, 20% Varanasi Brocade Silk',
      'Hand-woven zari details crafted by traditional weavers in Varanasi',
      'Crisp, high-definition permanent pleating',
      'Tailored flat minimalist waistband with concealed side zip',
      'An asymmetric hem that flows with modern rhythm'
    ],
    careInstructions: 'Dry clean only. Store on a clip hanger. Do not iron directly; steam gently from a distance.',
    color: 'Obsidian Brocade',
    sizes: ['XS', 'S', 'M', 'L'],
    isLimitedEdition: true,
    isLowStock: true
  }
];
