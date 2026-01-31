import { Command } from "commander";
import { getContext, solveTask } from "./util.ts";

export const recaptchaV3Command = new Command("recaptcha-v3")
  .description("Solve reCAPTCHA v3")
  .requiredOption("--url <url>", "Target page URL")
  .requiredOption("--key <sitekey>", "reCAPTCHA site key")
  .option("--action <action>", "Page action value")
  .option("--min-score <score>", "Minimum score (0.1-0.9)")
  .option("--enterprise", "Use enterprise variant")
  .option("--proxy <proxy>", "Proxy string (ip:port:user:pass)")
  .option("--api-domain <domain>", "API domain (google.com or recaptcha.net)")
  .action(async (opts, cmd) => {
    const ctx = getContext(cmd);

    let type: string;
    if (opts.enterprise) {
      type = opts.proxy
        ? "ReCaptchaV3EnterpriseTask"
        : "ReCaptchaV3EnterpriseTaskProxyLess";
    } else {
      type = opts.proxy ? "ReCaptchaV3Task" : "ReCaptchaV3TaskProxyLess";
    }

    const task: Record<string, unknown> = {
      type,
      websiteURL: opts.url,
      websiteKey: opts.key,
    };

    if (opts.proxy) task.proxy = opts.proxy;
    if (opts.action) task.pageAction = opts.action;
    if (opts.minScore) task.minScore = parseFloat(opts.minScore);
    if (opts.apiDomain) task.apiDomain = opts.apiDomain;

    await solveTask(task, ctx);
  });
