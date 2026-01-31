import { Command } from "commander";
import { mkdirSync } from "fs";
import chalk from "chalk";
import { error, success } from "../format.ts";
import { CONFIG_DIR, CONFIG_KEY_PATH } from "../config.ts";

export const configCommand = new Command("config")
  .description("Show or update configuration")
  .argument("[action]", "Action: set-key")
  .argument("[value]", "Value for action")
  .action(async (action?: string, value?: string) => {
    try {
      if (action === "set-key") {
        if (!value) {
          error("Usage: capsolver config set-key <api-key>");
          process.exit(1);
        }
        mkdirSync(CONFIG_DIR, { recursive: true });
        await Bun.write(CONFIG_KEY_PATH, value + "\n");
        success(`API key saved to ${CONFIG_KEY_PATH}`);
      } else {
        const envKey = process.env.CAPSOLVER_API_KEY;
        if (envKey) {
          const masked = envKey.slice(0, 8) + "...";
          console.log(`${chalk.bold("API Key:")} ${masked} ${chalk.dim("(from env)")}`);
        } else {
          let fileKey: string | null = null;
          try {
            const fs = require("fs");
            fileKey = fs.readFileSync(CONFIG_KEY_PATH, "utf-8").trim() || null;
          } catch {}

          if (fileKey) {
            const masked = fileKey.slice(0, 8) + "...";
            console.log(`${chalk.bold("API Key:")} ${masked} ${chalk.dim(`(from ${CONFIG_KEY_PATH})`)}`);
          } else {
            console.log(chalk.dim("No API key configured."));
            console.log(
              chalk.dim(
                "Set one with: capsolver config set-key <key>  or  export CAPSOLVER_API_KEY=<key>",
              ),
            );
          }
        }
      }
    } catch (e: unknown) {
      error(e instanceof Error ? e.message : String(e));
      process.exit(1);
    }
  });
