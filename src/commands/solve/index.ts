import { Command } from "commander";
import { imageCommand } from "./image.ts";
import { recaptchaV2Command } from "./recaptcha-v2.ts";
import { recaptchaV3Command } from "./recaptcha-v3.ts";
import { turnstileCommand } from "./turnstile.ts";
import { geetestCommand } from "./geetest.ts";
import { datadomeCommand } from "./datadome.ts";
import { awsWafCommand } from "./aws-waf.ts";
import { mtcaptchaCommand } from "./mtcaptcha.ts";
import { cloudflareChallCommand } from "./cloudflare-challenge.ts";

export const solveCommand = new Command("solve")
  .description("Solve a captcha (pick a type subcommand)");

solveCommand.addCommand(imageCommand);
solveCommand.addCommand(recaptchaV2Command);
solveCommand.addCommand(recaptchaV3Command);
solveCommand.addCommand(turnstileCommand);
solveCommand.addCommand(geetestCommand);
solveCommand.addCommand(datadomeCommand);
solveCommand.addCommand(awsWafCommand);
solveCommand.addCommand(mtcaptchaCommand);
solveCommand.addCommand(cloudflareChallCommand);
