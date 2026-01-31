import { Command } from "commander";
import { getContext, solveTask } from "./util.ts";

export const mtcaptchaCommand = new Command("mtcaptcha")
  .description("Solve MTCaptcha")
  .requiredOption("--url <url>", "Target page URL")
  .requiredOption("--key <sitekey>", "MTCaptcha site key")
  .action(async (opts, cmd) => {
    const ctx = getContext(cmd);

    const task: Record<string, unknown> = {
      type: "MTCaptchaTaskProxyLess",
      websiteURL: opts.url,
      websiteKey: opts.key,
    };

    await solveTask(task, ctx);
  });
