import { Command } from "commander";
import { getContext, solveTask } from "./util.ts";

export const recaptchaV2Command = new Command("recaptcha-v2")
  .description("Solve reCAPTCHA v2")
  .requiredOption("--url <url>", "Target page URL")
  .requiredOption("--key <sitekey>", "reCAPTCHA site key")
  .option("--enterprise", "Use enterprise variant")
  .option("--invisible", "Invisible reCAPTCHA (no checkbox)")
  .option("--proxy <proxy>", "Proxy string (ip:port:user:pass)")
  .option("--page-action <action>", "The sa parameter from /anchor")
  .option("--data-s <value>", "The s parameter from /anchor")
  .option("--api-domain <domain>", "API domain (google.com or recaptcha.net)")
  .action(async (opts, cmd) => {
    const ctx = getContext(cmd);

    let type: string;
    if (opts.enterprise) {
      type = opts.proxy
        ? "ReCaptchaV2EnterpriseTask"
        : "ReCaptchaV2EnterpriseTaskProxyLess";
    } else {
      type = opts.proxy ? "ReCaptchaV2Task" : "ReCaptchaV2TaskProxyLess";
    }

    const task: Record<string, unknown> = {
      type,
      websiteURL: opts.url,
      websiteKey: opts.key,
    };

    if (opts.proxy) task.proxy = opts.proxy;
    if (opts.invisible) task.isInvisible = true;
    if (opts.pageAction) task.pageAction = opts.pageAction;
    if (opts.dataS) task.recaptchaDataSValue = opts.dataS;
    if (opts.apiDomain) task.apiDomain = opts.apiDomain;

    await solveTask(task, ctx);
  });
