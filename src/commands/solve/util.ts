import { getApiKey } from "../../config.ts";
import { CapSolverClient } from "../../client.ts";
import { pollForResult } from "../../poller.ts";
import {
  formatSolution,
  formatQuietSolution,
  formatJson,
  error,
} from "../../format.ts";
import type { CreateTaskResponse, GetTaskResultResponse } from "../../types.ts";
import type { Command } from "commander";

export interface SolveContext {
  json: boolean;
  quiet: boolean;
  timeout: number;
}

export function getContext(cmd: Command): SolveContext {
  const root = cmd.parent?.parent ?? cmd.parent;
  const opts = root?.opts() ?? {};
  return {
    json: !!opts.json,
    quiet: !!opts.quiet,
    timeout: opts.timeout ? parseInt(opts.timeout, 10) * 1000 : 120000,
  };
}

export async function solveTask(
  task: Record<string, unknown>,
  ctx: SolveContext,
): Promise<void> {
  try {
    const client = new CapSolverClient(getApiKey());
    const res = await client.createTask(task);

    // Synchronous result (recognition tasks)
    if (res.status === "ready" && res.solution) {
      outputResult(res, ctx);
      return;
    }

    // Async — need to poll
    if (!res.taskId) {
      throw new Error("No taskId returned and no immediate solution");
    }

    const result = await pollForResult(client, res.taskId, {
      timeoutMs: ctx.timeout,
      quiet: ctx.quiet || ctx.json,
    });

    outputResult(result, ctx);
  } catch (e: unknown) {
    if (ctx.json) {
      console.log(
        formatJson({
          error: e instanceof Error ? e.message : String(e),
        }),
      );
    } else {
      error(e instanceof Error ? e.message : String(e));
    }
    process.exit(1);
  }
}

function outputResult(
  res: CreateTaskResponse | GetTaskResultResponse,
  ctx: SolveContext,
): void {
  if (ctx.json) {
    console.log(formatJson(res));
  } else if (ctx.quiet) {
    console.log(formatQuietSolution(res));
  } else {
    console.log(formatSolution(res));
  }
}
