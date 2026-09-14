import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck, LockKeyhole, RotateCcw } from 'lucide-react';

export default function HeroMobile({ slides = defaultSlides, onCategoryClick }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  const scrollToIndex = useCallback((index) => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.children[0];
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 14;

    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth',
    });

    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const card = container.children[0];
        if (card) {
          const cardWidth = card.offsetWidth;
          const gap = 14;
          const nextIndex = Math.round(container.scrollLeft / (cardWidth + gap));
          setActiveIndex(Math.min(Math.max(nextIndex, 0), slides.length - 1));
        }
        rafId = null;
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [slides.length]);

  useEffect(() => {
    const next = slides[activeIndex + 1];
    if (!next?.image) return;

    const img = new Image();
    img.src = next.image;
  }, [activeIndex, slides]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-teal-200/60 blur-3xl animate-blob" />
        <div className="absolute -right-20 top-32 h-56 w-56 rounded-full bg-emerald-200/70 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-8 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-200/50 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative px-5 pb-5 pt-8 text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-teal-700 shadow-sm ring-1 ring-teal-100 backdrop-blur">
          Healthcare essentials
        </span>

        <h1 className="mx-auto mt-4 max-w-sm text-4xl font-black leading-[1.05] tracking-tight text-gray-950">
          Care that{' '}
          <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
            moves with you
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600">
          Premium adult care, baby care, hygiene and wellness products delivered safely at your doorstep.
        </p>
      </motion.div>

      <div className="grid grid-cols-3 border-t border-teal-100 bg-white/70 text-center backdrop-blur">
        {[
          { icon: Truck, label: 'Fast Delivery', desc: 'Tracked orders' },
          { icon: LockKeyhole, label: 'Secure Pay', desc: 'Protected' },
          { icon: RotateCcw, label: 'Easy Return', desc: 'Simple help' },
        ].map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.label} className="px-2 py-4">
              <Icon className="mx-auto h-5 w-5 text-teal-600" />
              <p className="mt-1 text-[11px] font-black text-gray-800">{badge.label}</p>
              <p className="mt-0.5 text-[10px] text-gray-400">{badge.desc}</p>
            </div>
          );
        })}
      </div>

    

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(22px, -18px) scale(1.08); }
          66% { transform: translate(-18px, 18px) scale(0.94); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 12s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 1.35s infinite linear; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

const defaultSlides = [
  {
    id: 1,
    title: 'Adult Care',
    desc: '12-hour protection, soft comfort and confidence for daily care.',
    image: '/Products/CL-AD-L-10-P1/m-unisex-pull-up-pants-12hrs-absorption-waist-size-24-45inch-original-imahhhgsggdx3bp9.jpg',
    link: '/category/adult-care',
    cta: 'Explore',
    badge: 'Best Seller',
  },
  {
    id: 2,
    title: 'Baby Care',
    desc: 'Ultra-soft diapers and gentle essentials for your little one.',
    image: '/Products/CL-AD-M-10-P1/m-unisex-pull-up-pants-12hrs-absorption-waist-size-24-45inch-original-imahhhgsmfhs9tjg.jpg',
    link: '/category/baby-care',
    cta: 'Explore',
    badge: 'New',
  },
  {
    id: 3,
    title: 'Hygiene Essentials',
    desc: 'Wipes, sanitizers and daily hygiene products you can trust.',
    image: '/images/hand-sanitiser.jpg',
    link: '/category/hygiene-essentials',
    cta: 'Shop',
    badge: 'Clean Care',
  },
  {
    id: 4,
    title: 'Mobility Aids',
    desc: 'Support, stability and movement-friendly healthcare aids.',
    image: '/images/kids-scooter.jpg',
    link: '/category/mobility',
    cta: 'Discover',
    badge: 'Trending',
  },
  {
    id: 5,
    title: 'Eco Wipes',
    desc: 'Alcohol-free, soft and practical hygiene for everyday use.',
    image: '/images/wipes.jpg',
    link: '/category/wipes',
    cta: 'Shop',
    badge: 'Eco',
  },
];
