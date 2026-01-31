import { Command } from "commander";
import { getContext, solveTask } from "./util.ts";

export const datadomeCommand = new Command("datadome")
  .description("Solve DataDome slider captcha")
  .requiredOption("--url <url>", "Target page URL")
  .requiredOption("--captcha-url <captchaUrl>", "DataDome captcha URL")
  .option("--proxy <proxy>", "Proxy string (ip:port:user:pass)")
  .action(async (opts, cmd) => {
    const ctx = getContext(cmd);

    const task: Record<string, unknown> = {
      type: "DataDomeSliderTask",
      websiteURL: opts.url,
      captchaUrl: opts.captchaUrl,
    };

    if (opts.proxy) task.proxy = opts.proxy;

    await solveTask(task, ctx);
  });
