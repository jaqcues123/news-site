import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTrucks, getTruckById } from "@/lib/trucks";
import TruckGallery from "@/components/TruckGallery";
import InquiryForm from "@/components/InquiryForm";

export const revalidate = 60;

export async function generateStaticParams() {
  const trucks = await getAllTrucks();
  return trucks.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const truck = await getTruckById(params.id);
  if (!truck) return {};
  return {
    title: truck.title,
    description: truck.description.slice(0, 160),
  };
}

function formatPrice(price: number) {
  return price > 0 ? `$${price.toLocaleString()}` : "Call for Price";
}

function StatusBadge({ status }: { status: "available" | "sold" | "pending" }) {
  const styles = {
    available: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    sold: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${styles[status]}`}>
      {status}
    </span>
  );
}

export default async function TruckDetailPage({ params }: { params: { id: string } }) {
  const truck = await getTruckById(params.id);
  if (!truck) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#111111] pt-24 pb-6">
        <div className="container-site">
          <nav className="text-sm text-gray-400 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/inventory" className="hover:text-white transition-colors">Inventory</Link>
            <span>/</span>
            <span className="text-gray-200 truncate">{truck.title}</span>
          </nav>
        </div>
      </div>

      <div className="section-pad bg-page">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 xl:gap-16">

            {/* Left: Gallery + Specs */}
            <div>
              <TruckGallery images={truck.images} title={truck.title} />

              {/* Specs */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-primary mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#FFC700] rounded-full inline-block" />
                  Specifications
                </h2>
                <div className="rounded-xl overflow-hidden border border-theme">
                  {[
                    { label: "Chassis", value: truck.specs.chassis },
                    { label: "Engine", value: truck.specs.engine },
                    { label: "Boom", value: truck.specs.boom },
                    { label: "Winch", value: truck.specs.winch },
                  ].map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex px-5 py-3.5 text-sm ${i % 2 === 0 ? "bg-surface" : "bg-page"}`}
                    >
                      <span className="w-32 font-medium text-muted flex-shrink-0">{row.label}</span>
                      <span className="text-primary">{row.value}</span>
                    </div>
                  ))}

                  {truck.specs.additional_features.length > 0 && (
                    <div className="flex px-5 py-3.5 text-sm bg-surface">
                      <span className="w-32 font-medium text-muted flex-shrink-0 pt-0.5">Features</span>
                      <ul className="space-y-1">
                        {truck.specs.additional_features.map((f) => (
                          <li key={f} className="text-primary flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#FFC700] rounded-full flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#FFC700] rounded-full inline-block" />
                  Description
                </h2>
                <p className="text-secondary leading-relaxed">{truck.description}</p>
              </div>
            </div>

            {/* Right: Summary + CTA */}
            <div className="lg:sticky lg:top-24 space-y-5 h-fit">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#3A6EA5] uppercase font-semibold tracking-widest">
                    {truck.type.charAt(0).toUpperCase() + truck.type.slice(1)}
                  </span>
                  <StatusBadge status={truck.status} />
                </div>
                <h1 className="text-2xl font-black text-primary leading-snug mb-4">
                  {truck.title}
                </h1>
                <div className="text-4xl font-black text-[#FFC700]">
                  {formatPrice(truck.price)}
                </div>
                {truck.price > 0 && (
                  <p className="text-xs text-muted mt-1">
                    Estimated price. Contact us for final quote.
                  </p>
                )}

                {truck.buildsheet_url && (
                  <a
                    href={truck.buildsheet_url}
                    download
                    className="mt-4 flex items-center gap-2 text-sm text-[#3A6EA5] hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Quote (PDF)
                  </a>
                )}
              </div>

              {truck.status !== "sold" && (
                <InquiryForm truckId={truck.id} truckTitle={truck.title} />
              )}

              <div className="text-center text-sm text-muted">
                Or call us at{" "}
                <a href="tel:+16035551234" className="text-primary font-semibold hover:text-[#FFC700] transition-colors">
                  (603) 555-1234
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
