import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

type VersionMode = "major" | "minor" | "patch";

type Options = {
  branches: string[];
  createGithubRelease: boolean;
  githubPrs: boolean;
  mode: "prepare" | "publish";
  runChecks: boolean;
  version?: string;
};

type GithubPr = {
  branch: string;
  number: number;
  url: string;
};

const root = process.cwd();
const packageJsonPath = join(root, "package.json");
const mepDir = join(root, "docs", "mep");
const ghCommand = resolveGhCommand();

main();

function main() {
  const [modeArg, ...args] = process.argv.slice(2);
  const mode = modeArg === "publish" ? "publish" : "prepare";
  const options = parseArgs(mode, args);

  if (options.mode === "prepare") {
    prepareMep(options);
    return;
  }

  publishMep(options);
}

function prepareMep(options: Options) {
  if (!options.branches.length) {
    fail("Missing branches. Use --branches feat/a feat/b or --branches=feat/a,feat/b.");
  }

  ensureCleanTrackedWorktree();

  const previousVersion = readPackageVersion();
  const nextVersion = resolveNextVersion(previousVersion, options.version);
  const tag = `v${nextVersion}`;

  ensureTagDoesNotExist(tag);
  validateBranches(options.branches);

  runGit(["fetch", "origin"]);
  runGit(["switch", "master"]);
  runGit(["pull", "--ff-only", "origin", "master"]);

  const baseCommit = gitOutput(["rev-parse", "HEAD"]);
  const githubPrs = options.githubPrs ? mergeBranchesWithGithubPrs(options.branches) : [];

  if (!options.githubPrs) {
    for (const branch of options.branches) {
      const ref = resolveBranchRef(branch);
      runGit(["merge", "--no-ff", "--no-edit", ref]);
    }
  }

  if (options.runChecks) {
    runPackageManager(["check"]);
    runPackageManager(["test"]);
    runPackageManager(["build-storybook"]);
  }

  updatePackageVersion(nextVersion);
  const mepPath = writeMepLog({
    baseCommit,
    branches: options.branches,
    githubPrs,
    previousVersion,
    tag,
    version: nextVersion,
  });

  runGit(["add", "package.json", mepPath]);
  runGit(["commit", "-m", `chore: release ${tag}`]);

  console.info("");
  console.info(`MEP prepared for ${tag}.`);
  console.info(`Review and edit: ${mepPath}`);
  console.info("");
  console.info("When the log is ready:");
  console.info(`  pnpm mep:publish -- --version ${nextVersion}`);
}

function publishMep(options: Options) {
  const version = normalizeExplicitVersion(options.version);
  if (!version) {
    fail("Missing version. Use --version 0.1.5.");
  }

  ensureCleanTrackedWorktree();

  const tag = `v${version}`;
  const mepPath = join("docs", "mep", `${tag}.md`);

  if (!existsSync(join(root, mepPath))) {
    fail(`Missing MEP log: ${mepPath}`);
  }

  ensureOnMaster();
  ensureTagDoesNotExist(tag);

  runGit(["tag", "-a", tag, "-m", `Release ${tag}`]);
  runGit(["push", "origin", "master"]);
  runGit(["push", "origin", tag]);

  if (options.createGithubRelease) {
    runCommand(ghCommand, ["release", "create", tag, "--notes-file", mepPath]);
  }

  console.info("");
  console.info(`MEP published: ${tag}`);
}

function parseArgs(mode: Options["mode"], args: string[]): Options {
  const options: Options = {
    branches: [],
    createGithubRelease: false,
    githubPrs: false,
    mode,
    runChecks: true,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--") {
      continue;
    }

    const [name, inlineValue] = arg.split("=", 2);
    const nextValue = () => inlineValue ?? args[++index];

    if (name === "--version") {
      options.version = nextValue();
    } else if (name === "--branches") {
      options.branches.push(...splitBranches(nextValue()));
    } else if (name === "--branch") {
      options.branches.push(nextValue());
    } else if (name === "--skip-checks") {
      options.runChecks = false;
    } else if (name === "--github-release") {
      options.createGithubRelease = true;
    } else if (name === "--github-prs") {
      options.githubPrs = true;
    } else if (arg.startsWith("-")) {
      fail(`Unknown option: ${arg}`);
    } else if (mode === "prepare") {
      options.branches.push(...splitBranches(arg));
    }
  }

  options.branches = [...new Set(options.branches.filter(Boolean))];
  return options;
}

function validateBranches(branches: string[]) {
  for (const branch of branches) {
    if (!/^[A-Za-z0-9._/-]+$/.test(branch)) {
      fail(`Invalid branch name: ${branch}`);
    }
  }
}

function splitBranches(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((branch) => branch.trim())
    .filter(Boolean);
}

function ensureCleanTrackedWorktree() {
  const status = gitOutput(["status", "--porcelain", "--untracked-files=no"]);
  if (status) {
    fail(`Tracked worktree changes detected:\n${status}`);
  }
}

function ensureOnMaster() {
  const branch = gitOutput(["branch", "--show-current"]);
  if (branch !== "master") {
    fail(`Publish must run from master. Current branch: ${branch}`);
  }
}

function ensureTagDoesNotExist(tag: string) {
  const local = spawnSync("git", ["rev-parse", "--verify", `refs/tags/${tag}`], {
    cwd: root,
    encoding: "utf8",
    stdio: "ignore",
  });
  if (local.status === 0) {
    fail(`Tag already exists locally: ${tag}`);
  }

  const remote = gitOutput(["ls-remote", "--tags", "origin", tag]);
  if (remote) {
    fail(`Tag already exists on origin: ${tag}`);
  }
}

function resolveBranchRef(branch: string) {
  const local = spawnSync("git", ["rev-parse", "--verify", branch], {
    cwd: root,
    encoding: "utf8",
    stdio: "ignore",
  });
  if (local.status === 0) return branch;

  const remoteRef = `origin/${branch}`;
  const remote = spawnSync("git", ["rev-parse", "--verify", remoteRef], {
    cwd: root,
    encoding: "utf8",
    stdio: "ignore",
  });
  if (remote.status === 0) return remoteRef;

  fail(`Branch not found locally or on origin: ${branch}`);
}

function mergeBranchesWithGithubPrs(branches: string[]) {
  ensureGhAvailable();
  ensureGhAuthenticated();

  const mergedPrs: GithubPr[] = [];

  for (const branch of branches) {
    ensureRemoteBranch(branch);
    const pr = ensurePullRequest(branch);
    runCommand(ghCommand, ["pr", "merge", String(pr.number), "--merge"]);
    runGit(["fetch", "origin"]);
    runGit(["pull", "--ff-only", "origin", "master"]);
    mergedPrs.push(pr);
  }

  return mergedPrs;
}

function ensureGhAvailable() {
  const result = spawnSync(ghCommand, ["--version"], {
    cwd: root,
    encoding: "utf8",
    stdio: "ignore",
  });

  if (result.status !== 0) {
    fail("GitHub PR mode requires the GitHub CLI. Install gh and authenticate before retrying.");
  }
}

function ensureGhAuthenticated() {
  const result = spawnSync(ghCommand, ["auth", "status"], {
    cwd: root,
    encoding: "utf8",
    stdio: "ignore",
  });

  if (result.status !== 0) {
    fail("GitHub CLI is not authenticated. Run gh auth login before using --github-prs.");
  }
}

function ensureRemoteBranch(branch: string) {
  const remote = spawnSync("git", gitArgs(["rev-parse", "--verify", `origin/${branch}`]), {
    cwd: root,
    encoding: "utf8",
    stdio: "ignore",
  });

  if (remote.status === 0) return;

  const local = spawnSync("git", gitArgs(["rev-parse", "--verify", branch]), {
    cwd: root,
    encoding: "utf8",
    stdio: "ignore",
  });

  if (local.status !== 0) {
    fail(`Branch not found locally or on origin: ${branch}`);
  }

  runGit(["push", "-u", "origin", branch]);
}

function ensurePullRequest(branch: string) {
  const existing = ghJson<GithubPr[]>([
    "pr",
    "list",
    "--head",
    branch,
    "--base",
    "master",
    "--state",
    "open",
    "--json",
    "number,url",
  ]);

  if (existing[0]) {
    return {
      branch,
      number: existing[0].number,
      url: existing[0].url,
    };
  }

  const title = `MEP: merge ${branch}`;
  const body = `Automated MEP pull request for branch \`${branch}\`.`;

  runCommand(ghCommand, [
    "pr",
    "create",
    "--base",
    "master",
    "--head",
    branch,
    "--title",
    title,
    "--body",
    body,
  ]);

  const created = ghJson<GithubPr[]>([
    "pr",
    "list",
    "--head",
    branch,
    "--base",
    "master",
    "--state",
    "open",
    "--json",
    "number,url",
  ]);

  if (!created[0]) {
    fail(`Unable to find created pull request for ${branch}.`);
  }

  return {
    branch,
    number: created[0].number,
    url: created[0].url,
  };
}

function ghJson<T>(args: string[]) {
  const output = execFileSync(ghCommand, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

  return JSON.parse(output || "[]") as T;
}

function resolveGhCommand() {
  const userProfile = process.env.USERPROFILE;
  const localAppData = process.env.LOCALAPPDATA;
  const userBinInstall = userProfile
    ? join(userProfile, "bin", "gh.exe")
    : undefined;
  const userInstall = localAppData
    ? join(localAppData, "Programs", "GitHub CLI", "bin", "gh.exe")
    : undefined;

  if (userBinInstall && existsSync(userBinInstall)) {
    return userBinInstall;
  }

  if (userInstall && existsSync(userInstall)) {
    return userInstall;
  }

  return "gh";
}

function readPackageVersion() {
  return JSON.parse(readFileSync(packageJsonPath, "utf8")).version as string;
}

function resolveNextVersion(current: string, requested: string | undefined) {
  const explicit = normalizeExplicitVersion(requested);
  if (explicit) return explicit;

  const mode = requested as VersionMode | undefined;
  const [major, minor, patch] = current.split(".").map(Number);

  if (!Number.isInteger(major) || !Number.isInteger(minor) || !Number.isInteger(patch)) {
    fail(`Unsupported package version: ${current}`);
  }

  if (!mode || mode === "patch") return `${major}.${minor}.${patch + 1}`;
  if (mode === "minor") return `${major}.${minor + 1}.0`;
  if (mode === "major") return `${major + 1}.0.0`;

  fail("Version must be patch, minor, major, or an explicit x.y.z version.");
}

function normalizeExplicitVersion(value: string | undefined) {
  if (!value) return undefined;
  const normalized = value.trim().replace(/^v/, "");
  return /^\d+\.\d+\.\d+$/.test(normalized) ? normalized : undefined;
}

function updatePackageVersion(version: string) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  packageJson.version = version;
  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

function writeMepLog({
  baseCommit,
  branches,
  githubPrs,
  previousVersion,
  tag,
  version,
}: {
  baseCommit: string;
  branches: string[];
  githubPrs: GithubPr[];
  previousVersion: string;
  tag: string;
  version: string;
}) {
  mkdirSync(mepDir, { recursive: true });

  const mepPath = join("docs", "mep", `${tag}.md`);
  const commits = gitOutput(["log", "--oneline", `${baseCommit}..HEAD`]);
  const diffStat = gitOutput(["diff", "--stat", baseCommit, "HEAD"]);
  const date = new Date().toISOString().slice(0, 10);

  writeFileSync(
    join(root, mepPath),
    `# MEP ${tag}

Date: ${date}
Base: master
Version: ${previousVersion} -> ${version}
Tag: ${tag}

## Resume

TODO: decrire en 3 a 5 lignes ce qui part en production.

## Changements inclus

TODO: regrouper les changements par domaine fonctionnel.

## Branches incluses

${branches.map((branch) => `- \`${branch}\``).join("\n")}

## Pull requests GitHub

${
  githubPrs.length
    ? githubPrs.map((pr) => `- #${pr.number} \`${pr.branch}\` - ${pr.url}`).join("\n")
    : "- Non utilise: preparation locale sans GitHub PRs."
}

## Commits inclus

\`\`\`text
${commits || "No commits found."}
\`\`\`

## Impact technique

TODO: migrations, variables d'environnement, jobs, risques connus.

## Validation

- [ ] pnpm check
- [ ] pnpm test
- [ ] pnpm build-storybook
- [ ] Verification fonctionnelle manuelle

## Diff stat

\`\`\`text
${diffStat || "No diff found."}
\`\`\`

## Notes de deploiement

- Le push du tag \`${tag}\` declenche le workflow GitHub Actions \`Deploy VPS\`.
- Si une GitHub Release est souhaitee, lancer \`pnpm mep:publish -- --version ${version} --github-release\`.
- Mode GitHub PRs: \`${githubPrs.length ? "oui" : "non"}\`.
`,
  );

  return mepPath;
}

function runGit(args: string[]) {
  runCommand("git", gitArgs(args));
}

function runPackageManager(args: string[]) {
  const npmExecPath = process.env.npm_execpath;
  if (npmExecPath && /pnpm\.(cjs|mjs|js)$/i.test(npmExecPath)) {
    runCommand(process.execPath, [npmExecPath, ...args]);
    return;
  }

  runCommand(process.platform === "win32" ? "pnpm.cmd" : "pnpm", args);
}

function gitOutput(args: string[]) {
  return execFileSync("git", gitArgs(args), {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function gitArgs(args: string[]) {
  return ["-c", "http.sslVerify=false", ...args];
}

function runCommand(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: root,
    shell: shouldUseShell(command),
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`Failed to run ${command}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function shouldUseShell(command: string) {
  return process.platform === "win32" && /\.(cmd|bat)$/i.test(command);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
