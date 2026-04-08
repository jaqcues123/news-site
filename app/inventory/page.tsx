import { Metadata } from "next";
import { getAllTrucks } from "@/lib/trucks";
import InventoryClient from "./InventoryClient";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Browse available NRC wreckers, rollbacks, and rotators. In-stock units ready to work.",
};

export const revalidate = 60;

export default async function InventoryPage() {
  const trucks = await getAllTrucks();

  return (
    <>
      <div className="bg-[#111111] pt-28 pb-12">
        <div className="container-site">
          <span className="text-[#FFC700] text-sm font-semibold uppercase tracking-widest">
            Available Now
          </span>
          <h1 className="mt-2 text-white text-4xl md:text-5xl font-black">
            Truck Inventory
          </h1>
          <p className="mt-3 text-gray-400 max-w-xl">
            Browse our current stock of NRC-built wreckers, rollbacks, and rotators.
            All units are fully prepped and ready to go to work.
          </p>
        </div>
      </div>

      <InventoryClient trucks={trucks} />
    </>
  );
}
