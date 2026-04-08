import { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with New England Wrecker Sales. Request a quote or ask about available inventory.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-[#111111] pt-28 pb-12">
        <div className="container-site">
          <span className="text-[#FFC700] text-sm font-semibold uppercase tracking-widest">
            Get In Touch
          </span>
          <h1 className="mt-2 text-white text-4xl md:text-5xl font-black">
            Contact Sales
          </h1>
          <p className="mt-3 text-gray-400 max-w-xl">
            Ready to talk trucks? Fill out the form and our team will get back to you
            within 1 business day.
          </p>
        </div>
      </div>

      <section className="section-pad bg-surface">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12">
            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-6">
                  How to Reach Us
                </h2>
                <div className="space-y-5">
                  {[
                    {
                      icon: "📞",
                      label: "Phone",
                      value: "(603) 658-7171",
                      href: "tel:+16036587171",
                    },
                    {
                      icon: "✉️",
                      label: "Email",
                      value: "sales@netruckcenter.com",
                      href: "mailto:sales@netruckcenter.com",
                    },
                    {
                      icon: "📍",
                      label: "Address",
                      value: "156 Epping Road, Exeter, NH 03833",
                      href: null,
                    },
                    {
                      icon: "🕐",
                      label: "Hours",
                      value: "Mon–Fri: 7am–5pm EST",
                      href: null,
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#111111] rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs text-muted uppercase tracking-wide font-medium mb-0.5">
                          {item.label}
                        </div>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-primary font-semibold hover:text-[#FFC700] transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-primary font-semibold">{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick blurb */}
              <div className="bg-[#111111] rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Looking for a Custom Build?</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We work directly with NRC to build trucks to your exact specification.
                  Tell us your chassis, boom, winch, and options — we&apos;ll put together
                  a detailed buildsheet and price quote.
                </p>
              </div>
            </div>

            {/* Form */}
            <div>
              <InquiryForm truckId="" truckTitle="General Inquiry" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
