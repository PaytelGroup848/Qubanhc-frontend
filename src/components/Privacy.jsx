import React from "react";
import { ShieldCheck, FileText, Mail, Globe, Calendar } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Overview",
    body: [
      `This Terms of Service & Privacy Policy ("Agreement") is entered into between Quban Hygiene Care ("Quban", "we", "us", or "our") and you ("User", "you"), and becomes effective the moment you access our website or place an order with us.`,
      `Unless stated otherwise, the contracting entity is:`,
    ],
    highlight: {
      name: "Quban Hygiene Care",
      lines: [
        "Registered Address: A-47, GT Karnal Road, Azadpur, Delhi – 110033, India",
      ],
    },
    after: [
      `This Agreement governs your use of the Quban Hygiene Care website ("Site") and all products and services provided by us, including our range of hygiene and personal care essentials ("Products").`,
      `By using the Site or placing an order, you confirm that you have read and understood this Agreement and agree to comply with all applicable policies. We reserve the right to update or modify these terms at any time; continued use of the Site constitutes acceptance of the revised terms.`,
    ],
  },
  {
    title: "2. Eligibility",
    body: ["To use our Services or place an order, you confirm that:"],
    bullets: [
      "You are at least 18 years of age, or are using the Site under the supervision of a parent or guardian.",
      "You are legally capable of entering into binding agreements.",
      "You are not prohibited from using our Services under applicable laws of India.",
    ],
    after: [
      "If you place an order on behalf of a business, retail outlet, or distributor, you confirm that you have full authority to bind that entity to these terms and remain responsible for all activities conducted through that account.",
    ],
  },
  {
    title: "3. Account Registration & Security",
    body: [
      "To access certain features such as order tracking, wishlists, or saved addresses, you may need to create an account. You agree to provide accurate and complete information, keep your login credentials secure, and update your details promptly whenever they change.",
      "Security recommendation: change your account password periodically and never share your OTP or login credentials with anyone.",
      "Quban Hygiene Care is not responsible for losses resulting from unauthorised access caused by your failure to secure your account credentials.",
    ],
  },
  {
    title: "4. Orders, Bulk Orders & Payments",
    body: [
      "All orders placed through the Site are subject to product availability and confirmation of payment. Prices displayed on the Site are inclusive of applicable taxes unless stated otherwise, and are subject to change without prior notice.",
      "For bulk or wholesale orders, pricing, minimum order quantities, and delivery timelines may vary and will be confirmed separately with our team via phone, email, or WhatsApp before the order is processed.",
      "We accept payment through the methods listed at checkout, including UPI, cards, net banking, and Cash on Delivery (where available). Online payments are processed through secure, PCI-compliant payment gateways; we do not store your full card details on our servers.",
    ],
  },
  {
    title: "5. Shipping & Delivery",
    body: [
      "We aim to dispatch and deliver orders within the estimated timelines shown at checkout. Delivery timelines are estimates only and may be affected by courier delays, weather, regional restrictions, or other circumstances beyond our reasonable control.",
      "Risk of loss and title for Products pass to you upon delivery to the shipping address provided at the time of order.",
    ],
  },
  {
    title: "6. Returns, Refunds & Exchanges",
    body: [
      "Given the personal hygiene nature of our Products, returns are accepted only for items that are damaged, defective, or incorrectly shipped, and must be reported within the return window stated on our Returns & Refunds policy page.",
      "Approved refunds are processed to the original payment method within the timeline specified on that page. Cash on Delivery orders are refunded via bank transfer or store credit, as applicable.",
    ],
  },
  {
    title: "7. Product Information & Quality",
    body: [
      "We take reasonable care to ensure that product descriptions, images, and specifications on the Site are accurate. Minor variations in packaging, colour, or design may occur due to manufacturing updates and do not constitute a defect.",
      "All Products are manufactured and quality-checked in accordance with applicable safety and hygiene standards.",
    ],
  },
  {
    title: "8. Privacy & Data Protection",
    body: [
      "We collect personal information such as your name, contact details, shipping address, and order history to process orders, provide customer support, and improve our Services.",
      "We do not sell your personal information to third parties. Information may be shared with trusted logistics, payment, and service partners strictly for the purpose of fulfilling your order.",
      "If you access our Services from outside India, your data may be transferred across international borders in compliance with applicable data protection laws. You may request access to, correction of, or deletion of your personal data by contacting us using the details below.",
    ],
  },
  {
    title: "9. Intellectual Property",
    body: [
      "All content on the Site, including logos, product images, packaging design, and text, is the property of Quban Hygiene Care or its licensors and is protected under applicable intellectual property laws. You may not reproduce, distribute, or use this content without our prior written consent.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    body: [
      `Quban Hygiene Care provides the Site and Services on an "as-is" and "as-available" basis. To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Site or Products, except where such liability cannot be excluded under applicable law.`,
    ],
  },
  {
    title: "11. Governing Law",
    body: [
      "This Agreement is governed by the laws of India. Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts located in Delhi, India.",
    ],
  },
  {
    title: "12. Changes to This Agreement",
    body: [
      "We may update this Agreement from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. The updated version will be posted on this page with a revised effective date, and your continued use of the Site after such changes constitutes acceptance of the updated terms.",
    ],
  },
];

function Privacy() {
  return (
    <div className="min-h-screen bg-[#fffaf0] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="rounded-md border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-600">
            <FileText className="h-4 w-4" />
            Legal Document
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Privacy Policy & Terms of Service
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Please read this agreement carefully, as it contains important
            information regarding your legal rights and use of Quban Hygiene
            Care's website and services.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
            <a
              href="mailto:qubanhygienecare@gmail.com"
              className="flex items-center gap-1.5 hover:text-teal-600"
            >
              <Mail className="h-3.5 w-3.5" />
              qubanhygienecare@gmail.com
            </a>
            <a
              href="https://www.qubanhygienecare.com"
              className="flex items-center gap-1.5 hover:text-teal-600"
            >
              <Globe className="h-3.5 w-3.5" />
              www.qubanhygienecare.com
            </a>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Effective: August 25, 2026
            </span>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-6 space-y-4">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-md border border-gray-200 bg-white p-6 sm:p-7"
            >
              <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                {section.title}
              </h2>

              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                {section.body?.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}

                {section.highlight && (
                  <div className="rounded-md border border-teal-100 bg-teal-50 p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {section.highlight.name}
                    </p>
                    {section.highlight.lines.map((line, index) => (
                      <p key={index} className="mt-1 text-sm text-gray-600">
                        {line}
                      </p>
                    ))}
                  </div>
                )}

                {section.bullets && (
                  <ul className="space-y-2 pl-1">
                    {section.bullets.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.after?.map((paragraph, index) => (
                  <p key={`after-${index}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact footer */}
        <div className="mt-6 rounded-md border border-gray-200 bg-white p-6 text-center sm:p-8">
          <h2 className="text-base font-semibold text-gray-900">
            Contact Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            For questions regarding this Agreement, please contact us:
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href="mailto:qubanhygienecare@gmail.com"
              className="text-teal-600 hover:text-teal-700"
            >
              qubanhygienecare@gmail.com
            </a>
            <a
              href="https://www.qubanhygienecare.com"
              className="text-teal-600 hover:text-teal-700"
            >
              www.qubanhygienecare.com
            </a>
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Last updated: August 25, 2026
          </p>
          <p className="mt-1 text-xs text-gray-400">
            © 2026 Quban Hygiene Care. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
