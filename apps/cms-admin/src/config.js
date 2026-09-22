import { createGithubClient } from "@invendis/github-client";

// The one place the repo owner/name is configured. Set these in
// apps/cms-admin/.env (see .env.example) — never hardcode a fork's
// owner/repo directly in component code.
export const OWNER = import.meta.env.VITE_GH_OWNER || "your-github-username";
export const REPO = import.meta.env.VITE_GH_REPO || "invendis-website";

export const github = createGithubClient({ owner: OWNER, repo: REPO, defaultBranch: "main" });

// Every content save writes to BOTH branches: "main" (source of truth,
// commit tagged [skip ci] so it doesn't trigger a rebuild) and
// "gh-pages" (the live site, so the edit is visible within seconds).
export const LIVE_BRANCH = "gh-pages";
