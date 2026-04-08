import { NextRequest, NextResponse } from "next/server";
import { getAllTrucks, saveTrucks } from "@/lib/trucks";
import { Truck } from "@/lib/types";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const trucks = await getAllTrucks();
    return NextResponse.json(trucks);
  } catch (err) {
    console.error("GET /api/trucks:", err);
    return NextResponse.json({ error: "Failed to load trucks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const trucks = await getAllTrucks();

    const newTruck: Truck = {
      id: `nrc-${Date.now()}`,
      title: body.title ?? "Untitled",
      description: body.description ?? "",
      price: Number(body.price) || 0,
      status: body.status ?? "available",
      type: body.type ?? "wrecker",
      images: body.images ?? [],
      buildsheet_url: body.buildsheet_url ?? "",
      specs: body.specs ?? {
        chassis: "",
        engine: "",
        boom: "",
        winch: "",
        additional_features: [],
      },
      created_at: new Date().toISOString(),
    };

    // Suppress unused import warning in some environments
    void randomUUID;

    trucks.push(newTruck);
    await saveTrucks(trucks);

    return NextResponse.json(newTruck, { status: 201 });
  } catch (err) {
    console.error("POST /api/trucks:", err);
    return NextResponse.json({ error: "Failed to create truck" }, { status: 500 });
  }
}

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  return token === process.env.ADMIN_PASSWORD;
}
