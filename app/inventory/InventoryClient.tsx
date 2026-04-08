"use client";

import { useState } from "react";
import { Truck, TruckStatus, TruckType } from "@/lib/types";
import TruckCard from "@/components/TruckCard";

const TYPE_OPTIONS: { value: TruckType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "wrecker", label: "Wreckers" },
  { value: "rollback", label: "Rollbacks" },
  { value: "rotator", label: "Rotators" },
];

const STATUS_OPTIONS: { value: TruckStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "available", label: "Available" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Sold" },
];

export default function InventoryClient({ trucks }: { trucks: Truck[] }) {
  const [typeFilter, setTypeFilter] = useState<TruckType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TruckStatus | "all">("available");

  const filtered = trucks.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <section className="section-pad bg-surface">
      <div className="container-site">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <span className="text-sm font-medium text-secondary mr-1">Filter:</span>

          <div className="flex gap-2 flex-wrap">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTypeFilter(opt.value as TruckType | "all")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border ${
                  typeFilter === opt.value
                    ? "bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-[#111111] dark:border-white"
                    : "bg-page text-secondary border-theme hover:border-[#111111] dark:hover:border-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-theme hidden sm:block" />

          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value as TruckStatus | "all")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border ${
                  statusFilter === opt.value
                    ? "text-[#111111] border-[#FFC700]"
                    : "bg-page text-secondary border-theme hover:border-[#FFC700]"
                }`}
                style={statusFilter === opt.value ? { backgroundColor: "#FFC700" } : {}}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <span className="ml-auto text-sm text-muted">
            {filtered.length} unit{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((truck) => (
              <TruckCard key={truck.id} truck={truck} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-primary font-bold text-xl mb-2">No units found</h3>
            <p className="text-muted text-sm mb-6">
              Try adjusting your filters, or check back soon for new inventory.
            </p>
            <button
              onClick={() => { setTypeFilter("all"); setStatusFilter("all"); }}
              className="btn-secondary text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
