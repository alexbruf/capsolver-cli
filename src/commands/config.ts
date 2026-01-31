import { Command } from "commander";
import chalk from "chalk";
import { error, success } from "../format.ts";

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
        await writeEnvKey(value);
        success("API key saved to .env");
      } else {
        const key = process.env.CAPSOLVER_API_KEY;
        if (key) {
          const masked = key.slice(0, 8) + "..." + key.slice(-4);
          console.log(`${chalk.bold("API Key:")} ${masked}`);
        } else {
          console.log(chalk.dim("No API key configured."));
          console.log(
            chalk.dim(
              'Set one with: capsolver config set-key <key>  or  export CAPSOLVER_API_KEY=<key>',
            ),
          );
        }
      }
    } catch (e: unknown) {
      error(e instanceof Error ? e.message : String(e));
      process.exit(1);
    }
  });

async function writeEnvKey(key: string): Promise<void> {
  const envPath = ".env";
  const file = Bun.file(envPath);
  let content = "";
  if (await file.exists()) {
    content = await file.text();
    if (content.match(/^CAPSOLVER_API_KEY=.*/m)) {
      content = content.replace(
        /^CAPSOLVER_API_KEY=.*/m,
        `CAPSOLVER_API_KEY=${key}`,
      );
    } else {
      content += `\nCAPSOLVER_API_KEY=${key}\n`;
    }
  } else {
    content = `CAPSOLVER_API_KEY=${key}\n`;
  }
  await Bun.write(envPath, content);
}
