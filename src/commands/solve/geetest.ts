import { Command } from "commander";
import { getContext, solveTask } from "./util.ts";
import { error } from "../../format.ts";

export const geetestCommand = new Command("geetest")
  .description("Solve GeeTest v3 or v4")
  .requiredOption("--url <url>", "Target page URL")
  .option("--gt <gt>", "GeeTest v3: gt parameter")
  .option("--challenge <challenge>", "GeeTest v3: challenge parameter")
  .option("--captcha-id <id>", "GeeTest v4: captchaId")
  .option("--subdomain <subdomain>", "GeeTest API server subdomain")
  .action(async (opts, cmd) => {
    const ctx = getContext(cmd);

    const isV3 = !!(opts.gt && opts.challenge);
    const isV4 = !!opts.captchaId;

    if (!isV3 && !isV4) {
      error(
        "Provide --gt and --challenge for v3, or --captcha-id for v4",
      );
      process.exit(1);
    }

    const task: Record<string, unknown> = {
      type: "GeeTestTaskProxyLess",
      websiteURL: opts.url,
    };

    if (isV3) {
      task.gt = opts.gt;
      task.challenge = opts.challenge;
    } else {
      task.captchaId = opts.captchaId;
    }

    if (opts.subdomain) task.geetestApiServerSubdomain = opts.subdomain;

    await solveTask(task, ctx);
  });
