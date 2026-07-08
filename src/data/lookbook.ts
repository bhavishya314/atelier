import { LookbookItem } from '../types';

export const lookbookItems: LookbookItem[] = [
  {
    id: 'l1',
    title: 'Look 01: Handspun Drapes',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
    location: 'Jawahar Kala Kendra, Jaipur',
    season: 'Autumn / Winter Collection',
    hotspots: [
      {
        id: 'h1_1',
        x: 48,
        y: 35,
        productId: 'p1' // Kora Khadi Cocoon Duster
      },
      {
        id: 'h1_2',
        x: 52,
        y: 52,
        productId: 'p3' // Chanderi Cotton-Silk Pleated Kurta
      }
    ]
  },
  {
    id: 'l2',
    title: 'Look 02: Architectural Indigo',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80',
    location: 'Salk Pavilion, Ahmedabad',
    season: 'Autumn / Winter Collection',
    hotspots: [
      {
        id: 'h2_1',
        x: 48,
        y: 45,
        productId: 'p2' // Bandhgala Indigo Linen Blazer
      },
      {
        id: 'h2_2',
        x: 54,
        y: 72,
        productId: 'p4' // Kora Linen Drawstring Pants
      }
    ]
  },
  {
    id: 'l3',
    title: 'Look 03: Liquid Raw Silk',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    location: 'Minimalist Retreat, Alibaug',
    season: 'Festive Restraint',
    hotspots: [
      {
        id: 'h3_1',
        x: 50,
        y: 68,
        productId: 'p8' // Banarasi Brocade Pleated Skirt
      },
      {
        id: 'h3_2',
        x: 54,
        y: 32,
        productId: 'p5' // Anantam Raw Silk Bias Dress
      }
    ]
  }
];
