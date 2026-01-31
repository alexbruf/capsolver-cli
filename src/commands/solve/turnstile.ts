import { Command } from "commander";
import { getContext, solveTask } from "./util.ts";

export const turnstileCommand = new Command("turnstile")
  .description("Solve Cloudflare Turnstile")
  .requiredOption("--url <url>", "Target page URL")
  .requiredOption("--key <sitekey>", "Turnstile site key")
  .option("--action <action>", "data-action attribute value")
  .option("--cdata <cdata>", "data-cdata attribute value")
  .action(async (opts, cmd) => {
    const ctx = getContext(cmd);

    const task: Record<string, unknown> = {
      type: "AntiTurnstileTaskProxyLess",
      websiteURL: opts.url,
      websiteKey: opts.key,
    };

    if (opts.action || opts.cdata) {
      const metadata: Record<string, string> = {};
      if (opts.action) metadata.action = opts.action;
      if (opts.cdata) metadata.cdata = opts.cdata;
      task.metadata = metadata;
    }

    await solveTask(task, ctx);
  });
