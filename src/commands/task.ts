import { Command } from "commander";
import { getApiKey } from "../config.ts";
import { CapSolverClient } from "../client.ts";
import { formatTaskStatus, formatJson, error } from "../format.ts";

export const taskCommand = new Command("task")
  .description("Check status or get result of an existing task")
  .argument("<taskId>", "Task ID from createTask")
  .action(async (taskId: string, _opts, cmd) => {
    try {
      const parent = cmd.parent;
      const json = parent?.opts().json;
      const client = new CapSolverClient(getApiKey());
      const res = await client.getTaskResult(taskId);
      if (json) {
        console.log(formatJson(res));
      } else {
        console.log(formatTaskStatus(res));
      }
    } catch (e: unknown) {
      error(e instanceof Error ? e.message : String(e));
      process.exit(1);
    }
  });
