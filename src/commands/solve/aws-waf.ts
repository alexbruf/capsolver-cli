import { Command } from "commander";
import { getContext, solveTask } from "./util.ts";

export const awsWafCommand = new Command("aws-waf")
  .description("Solve AWS WAF captcha")
  .requiredOption("--url <url>", "Target page URL")
  .option("--proxy <proxy>", "Proxy string (ip:port:user:pass)")
  .action(async (opts, cmd) => {
    const ctx = getContext(cmd);

    const type = opts.proxy ? "AntiAwsWafTask" : "AntiAwsWafTaskProxyLess";

    const task: Record<string, unknown> = {
      type,
      websiteURL: opts.url,
    };

    if (opts.proxy) task.proxy = opts.proxy;

    await solveTask(task, ctx);
  });
