import { NextRequest, NextResponse } from "next/server";
import { getAllTrucks, saveTrucks } from "@/lib/trucks";
import { Truck } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trucks = await getAllTrucks();
    const truck = trucks.find((t) => t.id === params.id);
    if (!truck) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(truck);
  } catch (err) {
    console.error(`GET /api/trucks/${params.id}:`, err);
    return NextResponse.json({ error: "Failed to load truck" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const trucks = await getAllTrucks();
    const idx = trucks.findIndex((t) => t.id === params.id);

    if (idx === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated: Truck = {
      ...trucks[idx],
      ...body,
      id: params.id, // Prevent id override
    };
    trucks[idx] = updated;
    await saveTrucks(trucks);

    return NextResponse.json(updated);
  } catch (err) {
    console.error(`PUT /api/trucks/${params.id}:`, err);
    return NextResponse.json({ error: "Failed to update truck" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trucks = await getAllTrucks();
    const filtered = trucks.filter((t) => t.id !== params.id);

    if (filtered.length === trucks.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await saveTrucks(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/trucks/${params.id}:`, err);
    return NextResponse.json({ error: "Failed to delete truck" }, { status: 500 });
  }
}

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  return token === process.env.ADMIN_PASSWORD;
}
