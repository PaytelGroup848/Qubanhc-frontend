import React from "react";
import {
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Leaf,
  Target,
  Eye,
  Baby,
  Droplets,
  HandHeart,
  CheckCircle2,
} from "lucide-react";

const PRODUCTS = [
  {
    icon: Baby,
    title: "Baby Care Solutions (Diapers)",
    description:
      "Advanced ultra-absorbent diapers designed to provide long-lasting dryness, comfort, and protection while supporting unrestricted movement for babies.",
  },
  {
    icon: HandHeart,
    title: "Feminine Hygiene Products (Sanitary Pads)",
    description:
      "Premium sanitary napkins engineered for superior absorbency, leak protection, breathability, and all-day confidence.",
  },
  {
    icon: Droplets,
    title: "Wet Wipes",
    description:
      "Gentle, dermatologically safe wet wipes formulated for effective cleansing, freshness, and convenient on-the-go hygiene for babies and adults.",
  },
];

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "Quality Excellence",
    description:
      "Maintaining strict quality standards and comprehensive quality assurance processes.",
  },
  {
    icon: Sparkles,
    title: "Customer-Centric Innovation",
    description:
      "Continuously improving products based on consumer insights and evolving market needs.",
  },
  {
    icon: HeartHandshake,
    title: "Integrity & Trust",
    description:
      "Building long-term relationships through transparency, reliability, and ethical business practices.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "Promoting responsible manufacturing and environmentally conscious business operations.",
  },
  {
    icon: HandHeart,
    title: "Commitment to Wellness",
    description:
      "Supporting healthier lifestyles through safe and effective hygiene solutions.",
  },
];

const WHY_CHOOSE_US = [
  "Advanced product development backed by rigorous quality control",
  "Customer-focused innovation across every product line",
  "Safe, comfortable and affordable hygiene solutions",
  "Growing presence across retail and e-commerce channels",
];

function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
            About Us
          </span>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Quban Hygiene Care
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Quban Hygiene Care is a forward-thinking manufacturer and
            distributor of personal hygiene and healthcare essentials. Built on
            a foundation of quality, innovation, and customer trust, the company
            delivers reliable products that support the daily wellness needs of
            modern families. With a growing presence across retail and
            e-commerce channels, Quban Hygiene Care is committed to providing
            safe, comfortable, and affordable hygiene solutions that enhance
            quality of life.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-md border border-gray-200 bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50">
              <Target className="h-5 w-5 text-teal-600" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Our Mission
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              To make high-quality, dependable personal hygiene products
              accessible to every family while promoting comfort, dignity,
              health, and wellness at every stage of life.
            </p>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50">
              <Eye className="h-5 w-5 text-teal-600" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Our Vision
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              To become a trusted leader in the personal hygiene industry by
              delivering innovative, safe, and sustainable products that improve
              everyday living.
            </p>
          </div>
        </div>
      </section>

      {/* Product Portfolio */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Our Product Portfolio
            </h2>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Everyday essentials designed for comfort, safety and reliability.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {PRODUCTS.map((product) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.title}
                  className="rounded-md border border-gray-200 bg-white p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50">
                    <Icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-gray-900">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {product.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Core Values
          </h2>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            The principles that guide everything we do.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="rounded-md border border-gray-200 bg-white p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50">
                  <Icon className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Why Choose Quban Hygiene Care
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                Quban Hygiene Care combines advanced product development,
                rigorous quality control, and customer-focused innovation to
                deliver hygiene solutions that consumers can trust. Our
                commitment to comfort, safety, and affordability enables us to
                create products that meet the expectations of modern families
                while maintaining the highest standards of excellence.
              </p>
            </div>

            <ul className="space-y-3">
              {WHY_CHOOSE_US.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-md border border-gray-200 bg-white p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" />
                  <span className="text-sm text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
