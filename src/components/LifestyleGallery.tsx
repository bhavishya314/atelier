import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Instagram, 
  Heart, 
  MessageCircle, 
  Check, 
  Copy, 
  ShoppingBag, 
  ChevronRight, 
  X, 
  MapPin, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Send,
  Sparkles,
  Info
} from 'lucide-react';
import { Product } from '../types';

interface LifestyleGalleryProps {
  allProducts: Product[];
  onAddToCart: (product: Product, size: string, quantity?: number) => void;
  onQuickShop: (product: Product) => void;
  setIsCartOpen: (open: boolean) => void;
}

interface LifestylePost {
  id: string;
  image: string;
  productId: string; // Real product id to link to
  caption: string;
  location: string;
  likes: number;
  commentsCount: number;
  tags: string[];
  initialComments: Array<{ user: string; text: string; time: string }>;
  hotspot: { x: number; y: number; label: string };
}

export default function LifestyleGallery({ 
  allProducts, 
  onAddToCart, 
  onQuickShop,
  setIsCartOpen
}: LifestyleGalleryProps) {
  
  // Real Kora handle
  const handleName = '@kora.atelier';

  // 1. Follow State
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(28412);
  const [copied, setCopied] = useState(false);

  // 2. State for liked posts (local state tracker)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [postsLikeCounts, setPostsLikeCounts] = useState<Record<string, number>>({});

  // 3. State for custom comments added per post
  const [postComments, setPostComments] = useState<Record<string, Array<{ user: string; text: string; time: string }>>>({});

  // 4. Saved posts bookmark state
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  // 5. Active Modal Post
  const [activePost, setActivePost] = useState<LifestylePost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  // 6. Lifestyle Posts List (6 highly aesthetic, low-contrast heritage photos)
  const lifestylePosts: LifestylePost[] = [
    {
      id: 'l_g1',
      image: allProducts.find(p => p.id === 'p1')?.images[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=90',
      productId: 'p1', // Kora Khadi Cocoon Duster
      caption: 'Slow mornings in unbleached Ambar Charkha Khadi. Finding shelter in raw, unhurried threads that drape like a calm sanctuary.',
      location: 'Jaipur, Rajasthan',
      likes: 412,
      commentsCount: 18,
      tags: ['#slowfashion', '#organicindia', '#minimalism', '#korakhadi'],
      initialComments: [
        { user: 'avantika_sen', text: 'This duster looks incredibly serene! Is it light enough for Chennai humidity?', time: '2h' },
        { user: 'dev_singh', text: 'Stunning textures. The gold zari on the interior is such a subtle touch.', time: '4h' },
        { user: 'conscious_curator', text: 'The raw texture of this cotton is simply unparalleled.', time: '1d' }
      ],
      hotspot: { x: 45, y: 35, label: 'Kora Khadi Cocoon Duster' }
    },
    {
      id: 'l_g2',
      image: allProducts.find(p => p.id === 'p2')?.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      productId: 'p2', // Bandhgala Indigo Linen Blazer
      caption: 'Born of the earth and dyed in clay-baked vats. Ten cycles of slow fermentation create a living blue that settles with the wearer.',
      location: 'Sanganer, India',
      likes: 589,
      commentsCount: 24,
      tags: ['#naturalindigo', '#heritagecraft', '#flaxlinen', '#organicindigo'],
      initialComments: [
        { user: 'karan_kapur', text: 'That deep blue color is insane. Truly organic indigo!', time: '1h' },
        { user: 'priya_v', text: 'Does natural indigo rub off slightly on light-colored shirts?', time: '5h' },
        { user: 'atelier_kora', text: '@priya_v Yes, as it is completely organic without synthetic fixers, we advise washing separately and pairing with darker layers initially.', time: '3h' }
      ],
      hotspot: { x: 55, y: 40, label: 'Bandhgala Indigo Linen Blazer' }
    },
    {
      id: 'l_g3',
      image: allProducts.find(p => p.id === 'p3')?.images[0] || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
      productId: 'p3', // Chanderi Cotton-Silk Pleated Kurta
      caption: 'Lustrous mulberry silk meets organic long-staple cotton. Captured in soft dawn light to highlight the crisp hand-pressed front pleats.',
      location: 'Maheshwar, India',
      likes: 324,
      commentsCount: 12,
      tags: ['#chanderisilk', '#handloom', '#traditionaltextile', '#artisankraft'],
      initialComments: [
        { user: 'meera.joshi', text: 'The sheer shine of this silk is gorgeous. Ideal for summer evenings.', time: '30m' },
        { user: 'subhash_99', text: 'Is the fit true to size or slightly oversized?', time: '8h' }
      ],
      hotspot: { x: 38, y: 30, label: 'Chanderi Cotton-Silk Pleated Kurta' }
    },
    {
      id: 'l_g4',
      image: allProducts.find(p => p.id === 'p4')?.images[0] || 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      productId: 'p4', // Kora Linen Drawstring Pants
      caption: 'Absolute, unbothered comfort. straight-leg trousers woven from organic Bhagalpur flax linen and pre-washed with desert minerals.',
      location: 'Bhagalpur Studio',
      likes: 276,
      commentsCount: 9,
      tags: ['#rawlinen', '#relaxedfit', '#capsulewardrobe', '#summeressential'],
      initialComments: [
        { user: 'aravind_n', text: 'These look like the ultimate casual trousers.', time: '3h' },
        { user: 'zara.design', text: 'Perfect sand color, love how they stack on sandals.', time: '1d' }
      ],
      hotspot: { x: 50, y: 70, label: 'Kora Linen Drawstring Pants' }
    },
    {
      id: 'l_g5',
      image: allProducts.find(p => p.id === 'p5')?.images[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      productId: 'p5', // Anantam Raw Silk Bias Dress
      caption: 'Woven to fall like liquid raw silk. Bias cut on wild Tussar silk to naturally drape and hug the body with a sand-washed matte finish.',
      location: 'Devalaya Ruins',
      likes: 641,
      commentsCount: 31,
      tags: ['#rawsilk', '#biasdress', '#tussarsilk', '#minimalistlux'],
      initialComments: [
        { user: 'natasha.roy', text: 'The drape on this is flawless. The terracotta hue is sublime.', time: '10m' },
        { user: 'rachel_green', text: 'Need this for an upcoming autumn wedding in Goa!', time: '1h' },
        { user: 'sustainable_lux', text: 'Beautifully styled against the clay ruins.', time: '3h' }
      ],
      hotspot: { x: 48, y: 50, label: 'Anantam Raw Silk Bias Dress' }
    },
    {
      id: 'l_g6',
      image: allProducts.find(p => p.id === 'p6')?.images[0] || 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      productId: 'p6', // Desi Oorla Wool Mockneck
      caption: 'Hand-carded sheep wool from pastoral guilds in Kachchh, Gujarat. Naturally moisture-wicking and rich in soft lanolin oils.',
      location: 'Kachchh, Gujarat',
      likes: 495,
      commentsCount: 22,
      tags: ['#desiwool', '#handmadeindia', '#wintercapsule', '#regionalcraft'],
      initialComments: [
        { user: 'kabir_sharma', text: 'A wool mockneck in the middle of summer? Or is it for cold desert nights?', time: '4h' },
        { user: 'atelier_kora', text: '@kabir_sharma Excellent catch! Desi sheep wool is highly adaptive; it protects against sharp temperature drops in dry arid landscapes.', time: '2h' },
        { user: 'pallavi_22', text: 'Is the mockneck scratchy on the skin?', time: '5h' }
      ],
      hotspot: { x: 52, y: 45, label: 'Desi Oorla Wool Mockneck' }
    }
  ];

  // Initialize likes and comments states
  useEffect(() => {
    const likesInit: Record<string, number> = {};
    lifestylePosts.forEach(p => {
      likesInit[p.id] = p.likes;
    });
    setPostsLikeCounts(likesInit);
  }, []);

  const getProduct = (productId: string): Product | undefined => {
    return allProducts.find(p => p.id === productId);
  };

  // Toggle Follow
  const handleFollowToggle = () => {
    setIsFollowing(prev => {
      const nextState = !prev;
      setFollowersCount(count => nextState ? count + 1 : count - 1);
      return nextState;
    });
  };

  // Copy Handle
  const handleCopyHandle = () => {
    navigator.clipboard.writeText(handleName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle Like on Grid Post
  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts(prev => {
      const isCurrentlyLiked = prev[postId];
      const nextLiked = !isCurrentlyLiked;
      
      setPostsLikeCounts(likes => ({
        ...likes,
        [postId]: nextLiked ? (likes[postId] || 0) + 1 : (likes[postId] || 0) - 1
      }));

      return { ...prev, [postId]: nextLiked };
    });
  };

  // Bookmark / Save Post
  const handleToggleSave = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Post new comment in modal
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !newCommentText.trim()) return;

    const userComment = {
      user: 'patron_of_kora',
      text: newCommentText.trim(),
      time: 'Just now'
    };

    setPostComments(prev => {
      const currentPostComments = prev[activePost.id] || activePost.initialComments;
      return {
        ...prev,
        [activePost.id]: [userComment, ...currentPostComments]
      };
    });

    setNewCommentText('');
  };

  // Handle shopping from modal
  const handleModalAddToCart = (product: Product) => {
    const size = selectedSize || product.sizes[0] || 'S';
    onAddToCart(product, size, 1);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      setActivePost(null); // optionally close modal
      setIsCartOpen(true); // open cart drawer
    }, 1500);
  };

  return (
    <section id="lifestyle-social-section" className="py-24 bg-brand-cream border-t border-brand-sand/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* ======================================= */}
        {/* INSTAGRAM PROFILE HEADER CARD */}
        {/* ======================================= */}
        <div className="bg-brand-sand/15 border border-brand-sand/55 p-6 md:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Column: Avatar & Handle & Stats */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            
            {/* Avatar representation with elegant circular gold/charcoal border */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-charcoal via-brand-muted to-brand-sand rounded-full p-[2.5px] animate-spin-slow">
                <div className="w-full h-full bg-brand-cream rounded-full" />
              </div>
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-cream p-1 relative z-10 bg-brand-charcoal flex items-center justify-center">
                <span className="font-serif text-brand-cream text-2xl font-light tracking-widest select-none">K</span>
              </div>
              <span className="absolute bottom-1 right-1 bg-brand-charcoal border border-brand-cream text-white rounded-full p-1 z-20">
                <Instagram className="w-3 h-3" />
              </span>
            </div>

            {/* Account Details */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h3 className="font-serif text-xl font-bold tracking-wider text-brand-charcoal">{handleName}</h3>
                <span className="bg-brand-sand/50 text-brand-charcoal/80 text-[8.5px] font-mono tracking-widest uppercase px-2 py-0.5 border border-brand-sand/65 inline-block">
                  ARTISANAL ATELIER
                </span>
              </div>

              {/* Real Stats counter */}
              <div className="flex items-center justify-center sm:justify-start gap-5 text-xs font-mono text-brand-charcoal/80">
                <div>
                  <span className="font-bold">342</span> <span className="text-brand-muted">posts</span>
                </div>
                <div>
                  <span className="font-bold">{followersCount.toLocaleString('en-IN')}</span> <span className="text-brand-muted">followers</span>
                </div>
                <div>
                  <span className="font-bold">184</span> <span className="text-brand-muted">following</span>
                </div>
              </div>

              {/* Bio description */}
              <p className="text-xs text-brand-muted font-light leading-relaxed max-w-md">
                Quiet luxury. Unhurried Indian heritage garments woven on slow wooden pitlooms. Tag <span className="text-brand-charcoal font-semibold">#KoraSlowLiving</span> to be featured in our seasonal lookbook.
              </p>
            </div>

          </div>

          {/* Right Column: Dynamic Follow & Share actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            
            {/* Toggle follow with dynamic stats */}
            <motion.button
              id="social-follow-toggle-btn"
              onClick={handleFollowToggle}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className={`px-8 py-3.5 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-sm ${
                isFollowing 
                  ? 'bg-brand-sand text-brand-charcoal border border-brand-sand' 
                  : 'bg-brand-charcoal hover:bg-brand-charcoal/90 text-white border border-brand-charcoal'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check className="w-3.5 h-3.5 animate-bounce" />
                  <span>Following Atelier</span>
                </>
              ) : (
                <>
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Follow @kora.atelier</span>
                </>
              )}
            </motion.button>

            {/* Copy handle */}
            <motion.button
              id="social-copy-handle-btn"
              onClick={handleCopyHandle}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="border border-brand-charcoal/20 hover:border-brand-charcoal text-brand-charcoal hover:bg-brand-sand/35 px-6 py-3.5 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer relative"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-800" />
                  <span className="text-emerald-800">Handle Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Handle</span>
                </>
              )}
            </motion.button>

          </div>

        </div>

        {/* Decorative Section Info Header */}
        <div className="mb-10 text-center md:text-left space-y-2">
          <p className="text-[10px] font-mono tracking-[0.3em] text-brand-muted uppercase">CURATED LIFESTYLE JOURNAL</p>
          <h2 className="font-serif text-3xl font-light text-brand-charcoal tracking-tight">Slow Living on Grid</h2>
          <p className="text-xs text-brand-muted max-w-xl font-light leading-relaxed">
            Snapshots of our garments wandering through high-contrast desert architecture, mud-plastered weaving studios, and ancient stepwells. Tap any image to explore the thread coordinates and shop the featured garments directly.
          </p>
        </div>

        {/* ======================================= */}
        {/* RESPONSIVE LIFESTYLE PHOTO GRID */}
        {/* ======================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifestylePosts.map((post) => {
            const isLiked = likedPosts[post.id] || false;
            const currentLikes = postsLikeCounts[post.id] || post.likes;
            const commentsList = postComments[post.id] || post.initialComments;
            const taggedProd = getProduct(post.productId);

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="group relative aspect-square bg-brand-sand/15 overflow-hidden border border-brand-sand/35 shadow-xs cursor-pointer"
                onClick={() => {
                  setSelectedSize(taggedProd ? taggedProd.sizes[0] : '');
                  setActivePost(post);
                }}
              >
                {/* Visual Image */}
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover grayscale-[4%] transition-transform duration-1000 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Editorial Tint Accent */}
                <div className="absolute inset-0 bg-brand-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply" />

                {/* ======================================= */}
                {/* HOVER INTERACTIVE SOCIAL CAPTURE OVERLAY */}
                {/* ======================================= */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white z-15">
                  
                  {/* Top: Location tag */}
                  <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-brand-sand uppercase">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-brand-sand" />
                      <span>{post.location}</span>
                    </span>
                    <button
                      id={`grid-post-save-btn-${post.id}`}
                      onClick={(e) => handleToggleSave(post.id, e)}
                      className="p-1 hover:text-white transition-colors"
                      aria-label="Save Post"
                    >
                      {savedPosts[post.id] ? (
                        <BookmarkCheck className="w-4 h-4 text-brand-sand fill-brand-sand" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-brand-sand" />
                      )}
                    </button>
                  </div>

                  {/* Middle: Pulse Interaction trigger */}
                  <div className="text-center self-center py-2 space-y-1">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/25 scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[9px] font-mono tracking-[0.25em] uppercase text-brand-sand/90">INSPECT POST</p>
                  </div>

                  {/* Bottom: Caption snapshot & Shop tag details */}
                  <div className="space-y-3.5">
                    
                    {/* Caption preview */}
                    <p className="text-[11px] font-serif text-brand-sand/90 italic line-clamp-2 leading-relaxed">
                      "{post.caption}"
                    </p>

                    {/* Likes & Comments inline display */}
                    <div className="flex items-center justify-between border-t border-white/20 pt-3">
                      <div className="flex items-center space-x-4 text-[10.5px] font-mono">
                        
                        {/* Like button inside hover state */}
                        <button
                          id={`grid-like-btn-${post.id}`}
                          onClick={(e) => handleLikePost(post.id, e)}
                          className="flex items-center space-x-1 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500 stroke-red-500' : 'text-white'}`} />
                          <span>{currentLikes}</span>
                        </button>

                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{commentsList.length}</span>
                        </span>
                      </div>

                      {/* Featured tagged product label */}
                      {taggedProd && (
                        <span className="text-[9.5px] font-mono tracking-wider font-bold bg-brand-cream text-brand-charcoal px-2.5 py-1 flex items-center space-x-1 shadow-sm uppercase">
                          <ShoppingBag className="w-3 h-3 text-brand-charcoal" />
                          <span>SHOP LOOK</span>
                        </span>
                      )}
                    </div>

                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>

        {/* ======================================= */}
        {/* INTERACTIVE 2-PANEL DIALOG (POST MODAL) */}
        {/* ======================================= */}
        <AnimatePresence>
          {activePost && (() => {
            const isLiked = likedPosts[activePost.id] || false;
            const currentLikes = postsLikeCounts[activePost.id] || activePost.likes;
            const commentsList = postComments[activePost.id] || activePost.initialComments;
            const taggedProd = getProduct(activePost.productId);

            return (
              <div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-charcoal/85 backdrop-blur-md"
                onClick={() => setActivePost(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-brand-cream border border-brand-sand max-w-5xl w-full max-h-[90vh] md:max-h-[80vh] flex flex-col md:grid md:grid-cols-12 overflow-hidden shadow-2xl rounded-none text-brand-charcoal"
                  onClick={(e) => e.stopPropagation()}
                >
                  
                  {/* Close floating button */}
                  <button
                    id="modal-close-button"
                    onClick={() => setActivePost(null)}
                    className="absolute top-4 right-4 z-50 p-2.5 bg-brand-charcoal text-white rounded-none hover:bg-brand-muted transition-colors flex items-center justify-center cursor-pointer shadow-lg"
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* LEFT PANEL: PHOTO FIELD (COL-SPAN 7) */}
                  <div className="md:col-span-7 bg-black/5 flex items-center justify-center relative aspect-square md:aspect-auto md:h-full overflow-hidden border-r border-brand-sand/50">
                    <img
                      src={activePost.image}
                      alt={activePost.caption}
                      className="w-full h-full object-cover grayscale-[2%]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Interactive Hotspot Dot floating directly on the image */}
                    {taggedProd && (
                      <div 
                        className="absolute z-30" 
                        style={{ left: `${activePost.hotspot.x}%`, top: `${activePost.hotspot.y}%` }}
                      >
                        <div className="relative group">
                          {/* Pulsing ring */}
                          <span className="absolute inset-0 w-8 h-8 -left-2.5 -top-2.5 bg-brand-charcoal/30 rounded-full animate-ping scale-110 pointer-events-none" />
                          <button
                            id="hotspot-reveal-btn"
                            className="w-5.5 h-5.5 bg-brand-cream hover:bg-brand-charcoal text-brand-charcoal hover:text-brand-cream border border-brand-charcoal rounded-full flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer"
                          >
                            <ShoppingBag className="w-2.5 h-2.5" />
                          </button>

                          {/* Float visual tooltip above dot */}
                          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-brand-charcoal text-brand-cream text-[9px] font-mono tracking-widest uppercase px-2.5 py-1.5 whitespace-nowrap border border-brand-cream/10 shadow-xl opacity-90 group-hover:opacity-100 pointer-events-none transition-all">
                            <span>{activePost.hotspot.label}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location Badge (Bottom-Left overlay) */}
                    <div className="absolute bottom-4 left-4 bg-brand-charcoal/90 text-brand-cream px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase border border-brand-cream/10 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-brand-sand shrink-0" />
                      <span>{activePost.location}</span>
                    </div>
                  </div>

                  {/* RIGHT PANEL: SOCIAL STATS & SHOPPING PANEL (COL-SPAN 5) */}
                  <div className="md:col-span-5 flex flex-col justify-between h-[50vh] md:h-full max-h-[50vh] md:max-h-none overflow-hidden bg-brand-cream">
                    
                    {/* Header: Profile info */}
                    <div className="p-4 border-b border-brand-sand/55 flex items-center justify-between shrink-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-cream font-serif text-xs font-light tracking-wider">
                          K
                        </div>
                        <div>
                          <h4 className="text-xs font-bold font-mono text-brand-charcoal leading-none">kora.atelier</h4>
                          <span className="text-[9px] text-brand-muted font-mono tracking-wider uppercase block mt-1">{activePost.location}</span>
                        </div>
                      </div>

                      {/* Interactive follow status */}
                      <button
                        id="modal-follow-toggle-btn"
                        onClick={handleFollowToggle}
                        className="text-[9px] font-mono font-bold tracking-wider text-brand-charcoal hover:text-brand-muted uppercase border-b border-brand-charcoal/20 pb-0.5"
                      >
                        {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
                      </button>
                    </div>

                    {/* Scrollable middle core content (Caption & Comments list) */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
                      
                      {/* Original Post Caption */}
                      <div className="space-y-2 border-b border-brand-sand/20 pb-3">
                        <p className="text-xs text-brand-charcoal font-light leading-relaxed">
                          <span className="font-mono font-bold mr-1.5 text-brand-charcoal">kora.atelier</span>
                          <span className="font-serif italic text-[13px] text-brand-charcoal/90 block mt-1">"{activePost.caption}"</span>
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {activePost.tags.map(t => (
                            <span key={t} className="text-[10px] font-mono text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer mr-1">
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="text-[8.5px] font-mono text-brand-muted block uppercase mt-1">1 DAY AGO</span>
                      </div>

                      {/* Live Comments Feed list */}
                      <div className="space-y-3.5">
                        <h5 className="text-[9px] font-mono tracking-wider text-brand-muted uppercase block border-b border-brand-sand/15 pb-1">
                          PATRON DIALOGUE ({commentsList.length})
                        </h5>
                        
                        <div className="space-y-3">
                          {commentsList.map((c, i) => (
                            <div key={i} className="text-xs leading-relaxed flex items-start space-x-2.5">
                              <div className="w-6 h-6 rounded-full bg-brand-sand/40 border border-brand-sand/80 text-[10px] font-mono flex items-center justify-center shrink-0 uppercase text-brand-charcoal/80">
                                {c.user.slice(0, 2)}
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-brand-charcoal font-light">
                                  <span className="font-mono font-bold mr-1.5 text-brand-charcoal">{c.user}</span>
                                  {c.text}
                                </p>
                                <div className="flex items-center space-x-3 text-[9px] font-mono text-brand-muted">
                                  <span>{c.time}</span>
                                  <button className="hover:text-brand-charcoal">Reply</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* ======================================= */}
                    {/* DYNAMIC SHOP THE FEATURED LOOK CARD */}
                    {/* ======================================= */}
                    {taggedProd && (
                      <div className="p-4 bg-brand-sand/20 border-t border-brand-sand/55 shrink-0 space-y-3">
                        <div className="flex items-center justify-between text-[9px] font-mono text-brand-muted">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-brand-charcoal animate-pulse" />
                            <span>FEATURED SILHOUETTE</span>
                          </span>
                          <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100">IN STOCK</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 bg-brand-cream border border-brand-sand/45 p-2.5">
                          {/* Left: thumb & info */}
                          <div className="flex items-center space-x-3">
                            <img 
                              src={taggedProd.images[0]} 
                              alt={taggedProd.name} 
                              className="w-10 h-13 object-cover border border-brand-sand/20" 
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                            <div className="space-y-0.5">
                              <h5 
                                onClick={() => onQuickShop(taggedProd)}
                                className="text-[11px] font-semibold text-brand-charcoal hover:text-brand-muted transition-colors uppercase line-clamp-1 cursor-pointer"
                              >
                                {taggedProd.name}
                              </h5>
                              <p className="text-[9px] text-brand-muted font-mono">{taggedProd.color}</p>
                              <span className="text-xs font-mono font-bold text-brand-charcoal">₹{taggedProd.price.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          {/* Right: size selector dropdown & CTA */}
                          <div className="flex flex-col items-stretch space-y-1.5 shrink-0 w-28">
                            <select
                              id="modal-shop-size-select"
                              value={selectedSize}
                              onChange={(e) => setSelectedSize(e.target.value)}
                              className="bg-transparent border border-brand-sand/80 text-[10px] font-mono tracking-widest py-1 px-1 focus:outline-none focus:border-brand-charcoal cursor-pointer w-full"
                            >
                              {taggedProd.sizes.map(sz => (
                                <option key={sz} value={sz}>SIZE {sz}</option>
                              ))}
                            </select>

                            <button
                              id="modal-quick-add-bag-btn"
                              onClick={() => handleModalAddToCart(taggedProd)}
                              disabled={addedFeedback}
                              className={`py-1.5 text-[9px] font-mono tracking-widest uppercase transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                                addedFeedback 
                                  ? 'bg-emerald-800 text-white border border-emerald-800 font-bold' 
                                  : 'bg-brand-charcoal hover:bg-brand-charcoal/90 text-white border border-brand-charcoal'
                              }`}
                            >
                              {addedFeedback ? (
                                <>
                                  <Check className="w-3 h-3 animate-bounce" />
                                  <span>ADDED</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3 h-3" />
                                  <span>ADD PIECE</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom row: Interactive Actions & Input comments form */}
                    <div className="p-4 border-t border-brand-sand/55 bg-brand-cream shrink-0 space-y-3.5">
                      
                      {/* Social Action row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          
                          {/* Heart like click toggle */}
                          <button
                            id="modal-post-heart-toggle"
                            onClick={(e) => handleLikePost(activePost.id, e)}
                            className="flex items-center space-x-1.5 hover:text-red-400 transition-colors cursor-pointer"
                            aria-label="Like Post"
                          >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500 stroke-red-500' : 'text-brand-charcoal'}`} />
                            <span className="text-xs font-mono font-bold text-brand-charcoal">{currentLikes} likes</span>
                          </button>

                          <span className="flex items-center space-x-1 text-xs text-brand-muted font-mono">
                            <MessageCircle className="w-5 h-5 text-brand-charcoal" />
                            <span>{commentsList.length}</span>
                          </span>
                        </div>

                        {/* Toggle save */}
                        <button
                          id="modal-post-bookmark-toggle"
                          onClick={(e) => handleToggleSave(activePost.id, e)}
                          className="hover:text-brand-charcoal transition-colors p-1"
                          aria-label="Bookmark Post"
                        >
                          {savedPosts[activePost.id] ? (
                            <BookmarkCheck className="w-5 h-5 text-brand-charcoal fill-brand-charcoal" />
                          ) : (
                            <Bookmark className="w-5 h-5 text-brand-charcoal" />
                          )}
                        </button>
                      </div>

                      {/* Comment Input Form */}
                      <form onSubmit={handleAddComment} className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Add a comment to the dialogue..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="flex-grow bg-brand-sand/15 border border-brand-sand/65 focus:border-brand-charcoal/50 text-xs px-3 py-2 focus:outline-none transition-colors rounded-none font-sans"
                        />
                        <button
                          type="submit"
                          id="submit-comment-btn"
                          className="bg-brand-charcoal text-white hover:bg-brand-muted px-3.5 flex items-center justify-center cursor-pointer rounded-none"
                          aria-label="Submit Comment"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>

                    </div>

                  </div>

                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

      </div>
    </section>
  );
}
