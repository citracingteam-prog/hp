const GITHUB_API = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token) throw new Error("GITHUB_TOKEN env var is required");
  if (!repo) throw new Error("GITHUB_REPO env var is required (e.g. 'owner/repo')");
  return { token, repo };
}

type GetFileResult = { sha: string; content: string } | null;

async function getFile(path: string): Promise<GetFileResult> {
  const { token, repo } = getConfig();
  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(path)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "cit-racing-admin",
    },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFile ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { sha: string; content: string };
  return { sha: json.sha, content: json.content };
}

export async function commitTextFile(args: {
  path: string;
  content: string;
  message: string;
}): Promise<void> {
  const { token, repo } = getConfig();
  const existing = await getFile(args.path);
  const body: Record<string, unknown> = {
    message: args.message,
    content: Buffer.from(args.content).toString("base64"),
    branch: "main",
  };
  if (existing) body.sha = existing.sha;

  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(args.path)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "cit-racing-admin",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${args.path} ${res.status}: ${await res.text()}`);
}

export async function getTextFileContent(path: string): Promise<string | null> {
  const result = await getFile(path);
  if (!result) return null;
  // GitHub API returns base64 with line-breaks every 60 chars
  return Buffer.from(result.content.replace(/\n/g, ""), "base64").toString("utf-8");
}

export async function commitBinaryFile(args: {
  path: string;
  bytes: Buffer;
  message: string;
}): Promise<void> {
  const { token, repo } = getConfig();
  const existing = await getFile(args.path);
  const body: Record<string, unknown> = {
    message: args.message,
    content: args.bytes.toString("base64"),
    branch: "main",
  };
  if (existing) body.sha = existing.sha;

  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(args.path)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "cit-racing-admin",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${args.path} ${res.status}: ${await res.text()}`);
}
