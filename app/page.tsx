import Link from "next/link";
import Image from "next/image";
import { getAllTrucks } from "@/lib/trucks";
import TruckCard from "@/components/TruckCard";

export const revalidate = 60;

export default async function HomePage() {
  const allTrucks = await getAllTrucks();
  const featured = allTrucks.filter((t) => t.status === "available").slice(0, 3);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-[#111111] overflow-hidden">
        {/* Hero photo */}
        <Image
          src="/images/NEWS_Hero.avif"
          alt="New England Wrecker Sales fleet"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Dark gradient overlay — keeps text readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/90 via-[#111111]/70 to-[#111111]/30" />
        {/* Yellow accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FFC700] z-10" />

        <div className="container-site relative z-10 pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="max-w-2xl">
            {/* Logo in hero — always show dark-bg version since hero is always dark */}
            <div className="mb-8">
              <Image
                src="/images/newsfleetblack.png"
                alt="New England Wrecker Sales"
                width={276}
                height={240}
                className="h-20 md:h-24 w-auto object-contain"
                priority
              />
            </div>

            <span className="inline-block text-[#FFC700] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              Custom NRC Builds
            </span>
            <h1 className="text-white text-5xl md:text-6xl font-black leading-[1.05] mb-6">
              Built for the
              <br />
              <span className="text-[#FFC700]">Toughest Jobs</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-xl">
              New England Wrecker Sales specializes in custom-built NRC wreckers,
              rollbacks, and rotators — engineered for performance, built to last.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/inventory" className="btn-primary">
                View Inventory
              </Link>
              <Link href="/contact" className="btn-outline">
                Request a Quote
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { value: "25+", label: "Years Experience" },
                { value: "500+", label: "Builds Delivered" },
                { value: "3", label: "Truck Types" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <span className="text-gray-500 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* ── About / Capabilities ──────────────────────────────── */}
      <section className="section-pad bg-page">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="text-[#FFC700] text-sm font-semibold uppercase tracking-widest">
              Who We Are
            </span>
            <h2 className="mt-2 text-primary">
              New England&apos;s Premier Wrecker Dealer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔧",
                title: "Custom Builds",
                desc: "Every truck is spec'd and built to your exact operational requirements — from chassis to lighting package.",
              },
              {
                icon: "🏆",
                title: "NRC Certified",
                desc: "Authorized NRC dealer with factory-trained technicians. We know these units inside and out.",
              },
              {
                icon: "🚛",
                title: "Ready-to-Work Inventory",
                desc: "Browse in-stock units that are prepped, inspected, and ready to go to work on day one.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-xl bg-surface hover:shadow-card transition-all duration-200"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Build Process ─────────────────────────────────────── */}
      <section className="section-pad bg-[#111111]">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="text-[#FFC700] text-sm font-semibold uppercase tracking-widest">
              How It Works
            </span>
            <h2 className="mt-2 text-white">The NRC Build Process</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consult", desc: "Tell us your operational needs, budget, and chassis preference." },
              { step: "02", title: "Spec", desc: "We work with you to create a detailed buildsheet tailored to your fleet." },
              { step: "03", title: "Build", desc: "NRC craftsmanship. Every weld, every component built to spec." },
              { step: "04", title: "Deliver", desc: "Fully inspected and ready to work — delivered on time." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-black text-white/5 leading-none mb-2">
                  {item.step}
                </div>
                <div className="absolute top-3 left-0">
                  <div className="text-[#FFC700] text-xs font-bold uppercase tracking-widest">
                    Step {item.step}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mt-1 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Truck Types ───────────────────────────────────────── */}
      <section className="section-pad relative overflow-hidden">
        {/* About photo background */}
        <Image
          src="/images/NEWS_about.avif"
          alt=""
          fill
          className="object-cover object-center"
          quality={85}
        />
        {/* Dark overlay — enough to keep cards readable while letting the photo show through */}
        <div className="absolute inset-0 bg-[#111111]/75" />

        <div className="container-site relative z-10">
          <div className="text-center mb-12">
            <span className="text-[#FFC700] text-sm font-semibold uppercase tracking-widest">
              Our Lineup
            </span>
            <h2 className="mt-2 text-white">What We Build &amp; Sell</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                type: "Wreckers",
                tagline: "Medium to Heavy Recovery",
                desc: "Integrated and conventional wreckers built for roadside and heavy recovery. Boom ratings from 25 to 50+ tons.",
                href: "/inventory?type=wrecker",
              },
              {
                type: "Rollbacks",
                tagline: "Transport & Flatbed",
                desc: "Steel and aluminum deck rollbacks for passenger, light-duty, and equipment transport. Custom deck lengths available.",
                href: "/inventory?type=rollback",
              },
              {
                type: "Rotators",
                tagline: "360° Heavy Recovery",
                desc: "Full-rotation heavy rotators for the most demanding recovery operations. The gold standard in heavy recovery.",
                href: "/inventory?type=rotator",
              },
            ].map((item) => (
              <Link
                key={item.type}
                href={item.href}
                className="group block rounded-xl overflow-hidden transition-all duration-200 bg-[#111111]/60 backdrop-blur-sm border border-white/10 hover:border-[#FFC700]/50 hover:bg-[#111111]/80"
              >
                <div className="h-1 bg-[#FFC700]" />
                <div className="p-6">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">
                    {item.tagline}
                  </span>
                  <h3 className="text-white font-bold text-xl mt-1 mb-2 group-hover:text-[#FFC700] transition-colors">
                    {item.type}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                  <div className="mt-4 text-[#FFC700] text-sm font-medium group-hover:underline">
                    Browse {item.type} →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Inventory ────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section-pad bg-page">
          <div className="container-site">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[#FFC700] text-sm font-semibold uppercase tracking-widest">
                  In Stock
                </span>
                <h2 className="mt-1 text-primary">Featured Inventory</h2>
              </div>
              <Link href="/inventory" className="text-[#3A6EA5] text-sm font-medium hover:underline hidden sm:block">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((truck) => (
                <TruckCard key={truck.id} truck={truck} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/inventory" className="btn-secondary">
                View All Inventory
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#FFC700" }}>
        <div className="container-site text-center">
          <h2 className="text-[#111111] text-3xl md:text-4xl font-black mb-4">
            Ready to Put a New Unit to Work?
          </h2>
          <p className="text-[#2B2B2B] mb-8 max-w-xl mx-auto">
            Whether you need a unit from stock or a fully custom build, our team is ready
            to help you find the right truck for your operation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 border-2 border-[#111111] text-[#111111] font-semibold px-6 py-3 rounded-lg hover:bg-[#111111] hover:text-white transition-all duration-200"
            >
              Browse Inventory
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#111111] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#2B2B2B] transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
