import chalk from "chalk";
import type {
  GetBalanceResponse,
  GetTaskResultResponse,
  CreateTaskResponse,
} from "./types.ts";

export function formatBalance(res: GetBalanceResponse): string {
  const lines: string[] = [];
  lines.push(
    `${chalk.bold("Balance:")} ${chalk.green("$" + (res.balance ?? 0).toFixed(2))}`,
  );

  if (res.packages && res.packages.length > 0) {
    lines.push("");
    lines.push(chalk.bold("Packages:"));
    for (const pkg of res.packages) {
      const expires = new Date(pkg.expireTime * 1000).toLocaleDateString();
      const status = pkg.status === 1 ? chalk.green("active") : chalk.dim("inactive");
      lines.push(
        `  ${pkg.title.padEnd(30)} ${String(pkg.numberOfCalls).padStart(10)} calls  ${status}  expires ${expires}`,
      );
    }
  }

  return lines.join("\n");
}

export function formatSolution(
  res: CreateTaskResponse | GetTaskResultResponse,
): string {
  const lines: string[] = [];

  if (res.taskId) {
    lines.push(`${chalk.bold("Task:")} ${chalk.dim(res.taskId)}`);
  }
  if (res.status) {
    lines.push(`${chalk.bold("Status:")} ${formatStatusBadge(res.status)}`);
  }

  if (res.solution) {
    lines.push(`${chalk.bold("Solution:")}`);
    for (const [key, value] of Object.entries(res.solution)) {
      const val =
        typeof value === "string" && value.length > 80
          ? value.slice(0, 77) + "..."
          : String(value);
      lines.push(`  ${chalk.cyan(key)}: ${val}`);
    }
  }

  return lines.join("\n");
}

export function formatQuietSolution(
  res: CreateTaskResponse | GetTaskResultResponse,
): string {
  if (!res.solution) return "";
  const sol = res.solution;
  // Return the most useful field: token > gRecaptchaResponse > text > first string value
  if (typeof sol.token === "string") return sol.token;
  if (typeof sol.gRecaptchaResponse === "string") return sol.gRecaptchaResponse;
  if (typeof sol.text === "string") return sol.text;
  const firstStr = Object.values(sol).find((v) => typeof v === "string");
  return typeof firstStr === "string" ? firstStr : JSON.stringify(sol);
}

export function formatTaskStatus(res: GetTaskResultResponse): string {
  const lines: string[] = [];
  if (res.taskId) {
    lines.push(`${chalk.bold("Task:")} ${chalk.dim(res.taskId)}`);
  }
  lines.push(
    `${chalk.bold("Status:")} ${formatStatusBadge(res.status ?? "unknown")}`,
  );

  if (res.status === "ready" && res.solution) {
    lines.push(`${chalk.bold("Solution:")}`);
    for (const [key, value] of Object.entries(res.solution)) {
      const val =
        typeof value === "string" && value.length > 80
          ? value.slice(0, 77) + "..."
          : String(value);
      lines.push(`  ${chalk.cyan(key)}: ${val}`);
    }
  }

  return lines.join("\n");
}

function formatStatusBadge(status: string): string {
  switch (status) {
    case "ready":
      return chalk.green("ready");
    case "processing":
      return chalk.yellow("processing");
    case "idle":
      return chalk.dim("idle");
    default:
      return chalk.dim(status);
  }
}

export function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

export function error(msg: string): void {
  console.error(chalk.red(`Error: ${msg}`));
}

export function success(msg: string): void {
  console.log(chalk.green(msg));
}
