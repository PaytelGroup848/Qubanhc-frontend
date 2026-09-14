import React from "react";
import {
  ShieldCheck,
  FileText,
  Mail,
  Globe,
  Calendar,
  XCircle,
} from "lucide-react";

const SECTIONS = [
  {
    title: "1. Overview",
    body: [
      `"We", "Us", "Our" refer to Quban Hygiene Care. "You", "User", "Customer" refer to any individual or entity accessing our website or purchasing our products. "Services" refer to the website, all products, and all support offered by Quban Hygiene Care. This Agreement does not create any third-party rights.`,
    ],
  },
  {
    title: "2. Modifications to Terms",
    body: [
      "Quban Hygiene Care reserves the right to modify these Terms at any time. Updated terms become effective immediately once posted on the website. Continued use of the website or Services after such updates indicates your acceptance of the revised Terms.",
    ],
  },
  {
    title: "3. Eligibility & Authority",
    body: ["By using our Services, you confirm that:"],
    bullets: [
      "You are at least 18 years of age, or are using the Site under the supervision of a parent or guardian.",
      "You are legally capable of entering into binding contracts.",
      "You are not restricted from using our Services under applicable Indian law.",
      "If acting on behalf of a business, retailer, or distributor, you have the legal authority to bind that organisation to these Terms.",
    ],
  },
  {
    title: "4. Account Registration & Security",
    body: [
      "To place orders or access certain features, you may need to create an account. You agree to provide accurate and complete information, maintain the confidentiality of your login credentials, and notify us immediately of any unauthorised access.",
      "You are solely responsible for all activities that occur under your account.",
    ],
  },
  {
    title: "5. International Data Transfer",
    body: [
      "By accessing our website or Services, you consent to the transfer, storage, and processing of your data across borders where necessary, including on servers located outside your country, in compliance with applicable data protection laws.",
    ],
  },
  {
    title: "6. Site & Service Availability",
    body: [
      "We aim to keep our website and Services available at all times. However, availability may be affected by scheduled maintenance, technical failures, or events beyond our reasonable control.",
      "We do not guarantee uninterrupted availability and are not liable for downtime arising from such circumstances.",
    ],
  },
  {
    title: "7. Acceptable Use Policy",
    body: ["You agree not to use Quban Hygiene Care's Services for:"],
    bullets: [
      "Any unlawful purpose or activity prohibited under Indian law",
      "Submitting false, fraudulent, or misleading order or payment information",
      "Reselling Products in violation of any agreed distributor or vendor terms",
      "Attempting to interfere with, disrupt, or gain unauthorised access to the Site or its systems",
      "Uploading spam, malware, or harmful content through the Site",
    ],
    after: [
      "Violations of this policy may result in immediate suspension or termination of your account and cancellation of pending orders.",
    ],
  },
  {
    title: "8. Intellectual Property Rights",
    body: [
      "All content on our website — including our logo, product photography, packaging design, descriptions, and text — is owned by or licensed to Quban Hygiene Care and is protected under applicable intellectual property laws.",
      "You may not copy, reproduce, modify, or distribute any of this content without our prior written permission.",
    ],
  },
  {
    title: "9. User Reviews & Content",
    body: [
      "If you submit a product review, rating, or other content on our Site, you grant Quban Hygiene Care a non-exclusive, royalty-free licence to display, reproduce, and use that content in connection with our Services and marketing.",
      "You are responsible for ensuring your reviews and content are accurate, lawful, and do not infringe the rights of any third party. We reserve the right to remove any content that violates these Terms.",
    ],
  },
  {
    title: "10. Monitoring & Account Actions",
    body: [
      "Quban Hygiene Care reserves the right to monitor account activity, remove prohibited content, and suspend or terminate accounts without prior notice where these Terms are violated. Repeated violations may result in permanent restriction of Services.",
    ],
  },
  {
    title: "11. No Spam Policy",
    body: [
      "Sending spam, bulk unsolicited messages, or misusing our contact channels (including WhatsApp and email) is strictly prohibited and may result in your requests being blocked.",
    ],
  },
  {
    title: "12. Third-Party Links",
    body: [
      "Our website may contain links to third-party websites, including payment gateways, courier tracking pages, or social media. Quban Hygiene Care is not responsible for the content, policies, or practices of these third-party sites. Access them at your own risk.",
    ],
  },
  {
    title: "13. Orders, Pricing & Payments",
    body: [
      "All prices displayed on the Site are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Prices, offers, and product availability are subject to change without prior notice.",
      "For bulk or wholesale orders, pricing and minimum order quantities are confirmed separately with our sales team and are not bound by the prices displayed for retail purchases on the Site.",
      "We reserve the right to refuse or cancel any order at our discretion, including in cases of suspected fraud, pricing errors, or stock unavailability, in which case any amount paid will be refunded.",
    ],
  },
  {
    title: "14. Discontinued Products",
    body: [
      "Quban Hygiene Care may discontinue any product or variant at any time. Where an order for a discontinued item cannot be fulfilled, we will notify you and provide a refund or a suitable alternative, at your choice.",
    ],
  },
  {
    title: "15. Disclaimer of Warranties",
    body: [
      `Our Services and Site are provided "as is" and "as available", without warranties of any kind, whether express or implied. We do not guarantee that the Site will be error-free or that product descriptions are entirely free of inadvertent inaccuracies.`,
    ],
  },
  {
    title: "16. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, Quban Hygiene Care will not be liable for indirect, incidental, or consequential damages arising from your use of the Site or Products. Our total liability for any claim relating to an order shall not exceed the amount paid by you for that order.",
    ],
  },
  {
    title: "17. Indemnification",
    body: [
      "You agree to indemnify and hold Quban Hygiene Care harmless against any claims, losses, or damages arising from your misuse of our Services, violation of this Agreement, or infringement of any third-party rights.",
    ],
  },
  {
    title: "18. Governing Law & Jurisdiction",
    body: [
      "These Terms are governed by the laws of India. All disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts located in Delhi, India.",
    ],
  },
];

function Terms() {
  return (
    <div className="min-h-screen bg-[#fffaf0] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="rounded-md border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-600">
            <FileText className="h-4 w-4" />
            Legal Agreement
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Terms of Service
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

                {section.bullets && (
                  <ul className="space-y-2 pl-1">
                    {section.bullets.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        {section.title.startsWith("7.") ? (
                          <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" />
                        ) : (
                          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                        )}
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
          <h2 className="text-base font-semibold text-gray-900">Questions?</h2>
          <p className="mt-1 text-sm text-gray-500">
            If you have any questions regarding these Terms of Service, please
            contact us.
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

export default Terms;
