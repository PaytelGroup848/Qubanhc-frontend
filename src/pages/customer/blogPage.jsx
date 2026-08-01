import { useEffect } from 'react';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Baby,
  Users,
  Droplets,
  CheckCircle2,
  ArrowRight,
  Feather,
  Clock,
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

/* Load the same premium type pairing used across QubanHC surfaces */
const FONT_LINK_ID = 'QubanHC.svg';

function useBlogFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(link);
  }, []);
}

const PRODUCTS = [
  {
    id: 'adult-diapers',
    icon: Users,
    tag: 'For Adults',
    title: 'Adult Diapers',
    sizes: 'S · M · L · XL · XXL',
    description:
      'Engineered for all-day dryness and dignity. Extra-absorbent core, breathable outer layer, and a snug leak-guard fit — built for every body, every size.',
    points: ['12-hour absorption', 'Odour-lock technology', 'Soft, rash-free lining'],
    accent: '#0f9d70',
    accentSoft: '#e6f7f0',
  },
  {
    id: 'sanitary-pads',
    icon: Droplets,
    tag: 'For Her',
    title: 'Sanitary Pads',
    sizes: 'Regular · Large · XL · Overnight',
    description:
      'Ultra-thin yet ultra-absorbent. Designed with a cottony-soft top layer so comfort never competes with protection, day or night.',
    points: ['Instant absorption channels', 'No-leak side wings', 'Breathable, rash-free wear'],
    accent: '#059669',
    accentSoft: '#e3f7ee',
  },
  {
    id: 'baby-diapers',
    icon: Baby,
    tag: 'For Little Ones',
    title: 'Baby Diapers',
    sizes: 'New Born · S · M · L · XL',
    description:
      "Gentle on the softest skin, tough on leaks. Every size is fitted with a breathable weave so your little one stays dry, happy, and rash-free.",
    points: ['Hypoallergenic lining', 'Wetness indicator', '360° stretchable waistband'],
    accent: '#10b981',
    accentSoft: '#e6faf1',
  },
  {
    id: 'baby-wipes',
    icon: Sparkles,
    tag: 'Everyday Care',
    title: 'Baby Wipes',
    sizes: '20 · 40 · 80 sheets',
    description:
      'Alcohol-free, fragrance-friendly, and dermatologically tested — made to clean gently without ever compromising on comfort.',
    points: ['99% pure water base', 'pH-balanced formula', 'Thick, tear-resistant sheets'],
    accent: '#34d399',
    accentSoft: '#ecfdf5',
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Care-first formulation',
    text: 'Every product is dermatologically tested before it reaches you — because comfort should never be a compromise.',
  },
  {
    icon: Heart,
    title: 'Every size, every body',
    text: 'From new-borns to seniors, QubanHC is built around the belief that comfort should fit everyone, not the other way around.',
  },
  {
    icon: CheckCircle2,
    title: 'Trusted quality',
    text: 'Rigorously tested materials and consistent quality checks, so every pack feels as good as the last.',
  },
];

const STATS = [
  { icon: Users, value: '4', label: 'Products in the range' },
  { icon: Feather, value: '0%', label: 'Compromise on comfort' },
  { icon: Clock, value: '12 hrs', label: 'Long-lasting protection' },
];

export default function QubanHCBlogPage() {
  useBlogFonts();

  return (
    <div
      className="min-h-screen bg-[#fbfcfd] text-[#0b1220]"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
               <Navbar/>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-emerald-100 opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-52 h-80 w-80 rounded-full bg-slate-100 opacity-70 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black, transparent 70%)',
          }}
        />

        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              <Heart size={13} />
              Comfort, for every stage of life
            </div>

            <h1
              className="mt-6 text-[38px] font-extrabold leading-[1.15] tracking-tight text-[#0b1220] md:text-[50px]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Full comfort, in every size —{' '}
              <span className="bg-gradient-to-r from-[#0f9d70] via-[#10b981] to-[#34d399] bg-clip-text text-transparent">
                that's the QubanHC promise.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-[15px] leading-7 text-slate-500">
              From a newborn's first diaper to everyday care for the ones we love
              most — QubanHygiene builds every product around one idea: comfort
              that fits every body, every age, every size.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b1220] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#182444]"
              >
                See our products
                <ArrowRight size={16} />
              </a>
              <a
                href="#story"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#0b1220] transition hover:border-slate-300"
              >
                Our story
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-100 pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <s.icon size={15} />
                  </div>
                  <p
                    className="mt-2 text-[22px] font-extrabold tracking-tight text-[#0b1220]"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-4 text-slate-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual collage — swap the icon tiles for real product photos anytime */}
          <div className="relative mx-auto grid w-full max-w-sm grid-cols-2 gap-4">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                className={`flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl border border-slate-100 shadow-sm ${
                  i % 2 === 1 ? 'translate-y-6' : ''
                }`}
                style={{ backgroundColor: p.accentSoft }}
              >
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-md"
                  style={{ backgroundColor: p.accent }}
                >
                  <p.icon size={22} />
                </div>
                <span className="text-[12px] font-bold text-[#0b1220]">{p.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Intro / Blog article ---------------- */}
      <section id="story" className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          From the QubanHC Journal
        </p>
        <h2
          className="mt-3 text-[26px] font-bold leading-snug tracking-tight text-[#0b1220] md:text-[30px]"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Why "comfort" is the only feature that matters
        </h2>

        <div className="mt-6 space-y-4 text-[15px] leading-8 text-slate-600">
          <p>
            Hygiene products touch skin for hours at a time — a newborn's first
            few weeks, a long work shift, an overnight sleep. At QubanHygiene, we
            believe that kind of closeness deserves real care, not just a label
            that says "soft."
          </p>
          <p>
            That's why every product in our range, from adult diapers to baby
            wipes, is built around three things: the right size for every body,
            a breathable fit that lasts through the day, and materials gentle
            enough for the most sensitive skin. Comfort isn't an add-on for us —
            it's the entire brief.
          </p>
        </div>
      </section>

      {/* ---------------- Values ---------------- */}
      <section id="values" className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                  <v.icon size={20} />
                </div>
                <h3
                  className="mt-4 text-[16px] font-bold text-[#0b1220]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {v.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-6 text-slate-500">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Products ---------------- */}
      <section id="products" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Our Range
          </p>
          <h2
            className="mt-3 text-[28px] font-extrabold tracking-tight text-[#0b1220] md:text-[34px]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Four products. One standard of comfort.
          </h2>
          <p className="mt-3 text-[14.5px] leading-7 text-slate-500">
            Every size, every stage — made with the same care.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              {/* Visual header block */}
              <div
                className="relative flex h-36 items-center justify-center overflow-hidden"
                style={{ backgroundColor: p.accentSoft }}
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-40 transition group-hover:opacity-60"
                  style={{ backgroundColor: p.accent }}
                />
                <div
                  className="relative grid h-16 w-16 place-items-center rounded-2xl text-white shadow-lg transition group-hover:scale-105"
                  style={{ backgroundColor: p.accent }}
                >
                  <p.icon size={28} />
                </div>

                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-500 shadow-sm">
                  {p.tag}
                </span>
              </div>

              <div className="p-7">
                <h3
                  className="text-[19px] font-bold tracking-tight text-[#0b1220]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {p.title}
                </h3>

                <p className="mt-1 text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                  {p.sizes}
                </p>

                <p className="mt-4 text-[13.5px] leading-6 text-slate-500">
                  {p.description}
                </p>

                <ul className="mt-5 space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-[13px] text-slate-600">
                      <CheckCircle2 size={15} style={{ color: p.accent }} />
                      {pt}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0b1220] transition group-hover:gap-2.5"
                >
                  Learn more
                  <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1220] to-[#123024] px-8 py-14 text-center md:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

          <h2
            className="relative text-[26px] font-extrabold tracking-tight text-white md:text-[32px]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Comfort that grows with your family.
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-[14px] leading-6 text-slate-300">
            From your baby's first diaper to everyday essentials for the whole
            family — QubanHC is with you at every size.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER SLOT — plug your own footer component here             */}
      {/* e.g. <YourFooter />                                           */}
      {/* ============================================================ */}
    </div>
  );
}