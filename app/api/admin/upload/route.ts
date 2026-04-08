import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { truckId, filename, base64, mimeType, folder } = body;

    if (!truckId || !filename || !base64) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Sanitize filename
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const baseFolder = folder ?? "images/trucks";
    const filePath = `public/${baseFolder}/${truckId}/${safeName}`;

    if (process.env.NODE_ENV === "development") {
      // Write directly to local filesystem in dev
      const fs = await import("fs/promises");
      const path = await import("path");
      const dir = path.join(process.cwd(), "public", ...baseFolder.split("/"), truckId);
      await fs.mkdir(dir, { recursive: true });
      const buf = Buffer.from(base64, "base64");
      await fs.writeFile(path.join(dir, safeName), buf);
      return NextResponse.json({ url: `/${baseFolder}/${truckId}/${safeName}` });
    }

    // Production: commit to GitHub
    const { commitFileToGitHub } = await import("@/lib/github");
    const commitMessage = folder
      ? `chore: upload quote PDF for truck ${truckId}`
      : `chore: upload image for truck ${truckId}`;
    const url = await commitFileToGitHub(filePath, base64, commitMessage);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("POST /api/admin/upload:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  return token === process.env.ADMIN_PASSWORD;
}

// Allow larger request bodies for image uploads
export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};
