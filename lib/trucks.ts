import { Truck } from "./types";

// In development, read from local filesystem.
// In production on Vercel, reads from the deployed static JSON (build-time).
// Writes go through the GitHub API (see lib/github.ts).

export async function getAllTrucks(): Promise<Truck[]> {
  if (process.env.NODE_ENV === "development") {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "data", "trucks.json");
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Truck[];
  }

  // In production: read from the public static path baked into the build,
  // or re-fetch from GitHub if fresh data is needed.
  const { getTrucksFromGitHub } = await import("./github");
  return getTrucksFromGitHub();
}

export async function getTruckById(id: string): Promise<Truck | null> {
  const trucks = await getAllTrucks();
  return trucks.find((t) => t.id === id) ?? null;
}

export async function saveTrucks(trucks: Truck[]): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "data", "trucks.json");
    await fs.writeFile(filePath, JSON.stringify(trucks, null, 2), "utf-8");
    return;
  }

  const { saveTrucksToGitHub } = await import("./github");
  await saveTrucksToGitHub(trucks);
}
