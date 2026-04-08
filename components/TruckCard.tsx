import Link from "next/link";
import Image from "next/image";
import { Truck } from "@/lib/types";

function formatPrice(price: number) {
  return price > 0 ? `$${price.toLocaleString()}` : "Call for Price";
}

function StatusBadge({ status }: { status: Truck["status"] }) {
  const cls = {
    available: "status-available",
    pending: "status-pending",
    sold: "status-sold",
  }[status];
  return <span className={cls}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

function TypeLabel({ type }: { type: Truck["type"] }) {
  const labels: Record<Truck["type"], string> = {
    wrecker: "Wrecker",
    rollback: "Rollback",
    rotator: "Rotator",
  };
  return (
    <span className="text-xs font-medium text-[#3A6EA5] uppercase tracking-widest">
      {labels[type]}
    </span>
  );
}

export default function TruckCard({ truck }: { truck: Truck }) {
  const img = truck.images[0] ?? "/images/placeholder-truck.jpg";

  return (
    <Link href={`/inventory/${truck.id}`} className="group block">
      <article className="card overflow-hidden">
        {/* Image */}
        <div className="relative aspect-video bg-surface overflow-hidden">
          <Image
            src={img}
            alt={truck.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized={img.startsWith("/")}
          />
          {truck.status !== "available" && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <StatusBadge status={truck.status} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <TypeLabel type={truck.type} />
          <h3 className="mt-1 text-base font-bold text-primary leading-snug group-hover:text-[#FFC700] transition-colors duration-150 line-clamp-2">
            {truck.title}
          </h3>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {formatPrice(truck.price)}
            </span>
            {truck.status === "available" && <StatusBadge status={truck.status} />}
          </div>

          <div className="mt-3 pt-3 border-t border-theme text-xs text-muted">
            {truck.specs.chassis}
          </div>
        </div>
      </article>
    </Link>
  );
}
