import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Headphones, LockKeyhole, Medal, PackageCheck, RotateCcw, Truck } from 'lucide-react';

const defaultFeaturesList = [
  {
    id: 1,
    title: 'Free Shipping',
    description: 'Orders above ₹999 shipped free with clear tracking and no hidden charges.',
    icon: Truck,
  },
  {
    id: 2,
    title: 'Easy Returns',
    description: 'Simple return support for eligible products with a smooth help process.',
    icon: RotateCcw,
  },
  {
    id: 3,
    title: 'Secure Payments',
    description: 'Protected checkout with trusted payment gateway and safe transactions.',
    icon: LockKeyhole,
  },
  {
    id: 4,
    title: '24/7 Support',
    description: 'Raise support tickets anytime and get help from our care team.',
    icon: Headphones,
  },
  {
    id: 5,
    title: 'Medical-Grade Quality',
    description: 'Products selected for comfort, hygiene and everyday healthcare needs.',
    icon: Medal,
  },
  {
    id: 6,
    title: 'Express Dispatch',
    description: 'Fast dispatch for priority products with reliable delivery partners.',
    icon: PackageCheck,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function Features({
  features = defaultFeaturesList,
  title = 'Why QubanHC',
  subtitle = "We're not just a store — we're a commitment to your family's health, comfort and care.",
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 });

  const renderTitle = () =>
    title.split(' ').map((word, index) =>
      word === 'QubanHC' ? (
        <span key={`${word}-${index}`} className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
          {word}{' '}
        </span>
      ) : (
        <span key={`${word}-${index}`}>{word} </span>
      )
    );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-teal-50/30 to-white py-14 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-16 h-56 w-56 rounded-full bg-teal-100 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-emerald-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
        >
          <span className="inline-flex rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-teal-700 ring-1 ring-teal-100">
            Built for trust
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
            {renderTitle()}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base lg:text-lg">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-lg shadow-teal-100/30 transition-all duration-300 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/60"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 shadow-sm transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-teal-600 group-hover:to-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-teal-200/60">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-black text-gray-950 transition-colors group-hover:text-teal-700">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
