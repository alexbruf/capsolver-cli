import { Command } from "commander";
import { getContext, solveTask } from "./util.ts";

export const cloudflareChallCommand = new Command("cloudflare-challenge")
  .description("Solve Cloudflare Challenge (5s shield)")
  .requiredOption("--url <url>", "Target page URL")
  .option("--proxy <proxy>", "Proxy string (ip:port:user:pass)")
  .action(async (opts, cmd) => {
    const ctx = getContext(cmd);

    const task: Record<string, unknown> = {
      type: "AntiCloudflareTask",
      websiteURL: opts.url,
    };

    if (opts.proxy) task.proxy = opts.proxy;

    await solveTask(task, ctx);
  });
