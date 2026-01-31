import type { CapSolverClient } from "./client.ts";
import type { GetTaskResultResponse } from "./types.ts";
import chalk from "chalk";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 120;

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export interface PollOptions {
  timeoutMs?: number;
  quiet?: boolean;
}

export async function pollForResult(
  client: CapSolverClient,
  taskId: string,
  opts: PollOptions = {},
): Promise<GetTaskResultResponse> {
  const timeoutMs = opts.timeoutMs ?? 120000;
  const startTime = Date.now();
  let polls = 0;
  let frame = 0;

  while (polls < MAX_POLLS) {
    if (Date.now() - startTime > timeoutMs) {
      if (!opts.quiet) clearSpinner();
      throw new Error(`Polling timed out after ${timeoutMs / 1000}s`);
    }

    const result = await client.getTaskResult(taskId);
    polls++;

    if (result.status === "ready") {
      if (!opts.quiet) clearSpinner();
      return result;
    }

    if (!opts.quiet) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const spinner = SPINNER_FRAMES[frame % SPINNER_FRAMES.length];
      process.stderr.write(
        `\r${chalk.cyan(spinner)} Solving... ${chalk.dim(`(${elapsed}s, ${result.status ?? "waiting"})`)}`,
      );
      frame++;
    }

    await sleep(POLL_INTERVAL_MS);
  }

  if (!opts.quiet) clearSpinner();
  throw new Error(`Exceeded max poll attempts (${MAX_POLLS})`);
}

function clearSpinner(): void {
  process.stderr.write("\r" + " ".repeat(60) + "\r");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
