/**
 * GitHub Contents API helpers for reading/writing data/trucks.json.
 * Used in production on Vercel where the filesystem is read-only.
 *
 * Required env vars:
 *   GITHUB_TOKEN  - Fine-grained PAT with "Contents: Read & Write"
 *   GITHUB_OWNER  - Repo owner (e.g. jaqcues123)
 *   GITHUB_REPO   - Repo name (e.g. news-site)
 *   GITHUB_BRANCH - Branch to write to (default: main)
 */

import { Truck } from "./types";

const GITHUB_API = "https://api.github.com";
const DATA_PATH = "data/trucks.json";

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

function repoBase() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  return `${GITHUB_API}/repos/${owner}/${repo}`;
}

interface GitHubFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

async function getFileMeta(): Promise<GitHubFileResponse> {
  const branch = process.env.GITHUB_BRANCH ?? "main";
  const res = await fetch(
    `${repoBase()}/contents/${DATA_PATH}?ref=${branch}`,
    { headers: headers(), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  return res.json() as Promise<GitHubFileResponse>;
}

export async function getTrucksFromGitHub(): Promise<Truck[]> {
  const file = await getFileMeta();
  const decoded = Buffer.from(file.content, "base64").toString("utf-8");
  return JSON.parse(decoded) as Truck[];
}

export async function saveTrucksToGitHub(trucks: Truck[]): Promise<void> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      "GITHUB_TOKEN is not set. Cannot write trucks in production without it."
    );
  }

  const branch = process.env.GITHUB_BRANCH ?? "main";
  const file = await getFileMeta();
  const newContent = Buffer.from(
    JSON.stringify(trucks, null, 2)
  ).toString("base64");

  const res = await fetch(`${repoBase()}/contents/${DATA_PATH}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({
      message: "chore: update truck inventory via admin",
      content: newContent,
      sha: file.sha,
      branch,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} — ${err}`);
  }
}

/**
 * Commit a binary file (image, PDF) to the repo under /public/.
 * @param filePath  Path relative to repo root, e.g. "public/images/trucks/nrc-001/photo.jpg"
 * @param base64    Base64-encoded file content
 * @param message   Commit message
 */
export async function commitFileToGitHub(
  filePath: string,
  base64: string,
  message: string
): Promise<string> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not set. Cannot upload files in production.");
  }

  const branch = process.env.GITHUB_BRANCH ?? "main";

  // Check if the file already exists to get its SHA (needed for update)
  let sha: string | undefined;
  try {
    const existing = await getFileMetaByPath(filePath, branch);
    sha = existing.sha;
  } catch {
    // File doesn't exist yet — that's fine
  }

  const body: Record<string, string> = {
    message,
    content: base64,
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${repoBase()}/contents/${filePath}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub file commit failed: ${res.status} — ${err}`);
  }

  // Return the public URL path (relative to the site root)
  return `/${filePath.replace(/^public\//, "")}`;
}

async function getFileMetaByPath(
  filePath: string,
  branch: string
): Promise<GitHubFileResponse> {
  const res = await fetch(
    `${repoBase()}/contents/${filePath}?ref=${branch}`,
    { headers: headers(), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  return res.json() as Promise<GitHubFileResponse>;
}
