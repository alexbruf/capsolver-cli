import { Command } from "commander";
import { getContext, solveTask } from "./util.ts";
import { error } from "../../format.ts";

export const imageCommand = new Command("image")
  .description("Solve an image captcha (OCR)")
  .argument("<file>", "Image file path, or - for stdin")
  .option("--module <module>", "Processing module: common or number", "common")
  .option("--url <url>", "Page source URL to improve accuracy")
  .action(async (file: string, opts, cmd) => {
    const ctx = getContext(cmd);

    let body: string;
    try {
      if (file === "-") {
        const buf = await Bun.stdin.bytes();
        body = Buffer.from(buf).toString("base64");
      } else {
        const f = Bun.file(file);
        if (!(await f.exists())) {
          error(`File not found: ${file}`);
          process.exit(1);
        }
        const buf = await f.arrayBuffer();
        body = Buffer.from(buf).toString("base64");
      }
    } catch (e: unknown) {
      error(`Failed to read file: ${e instanceof Error ? e.message : String(e)}`);
      process.exit(1);
    }

    const task: Record<string, unknown> = {
      type: "ImageToTextTask",
      body,
      module: opts.module,
    };
    if (opts.url) task.websiteURL = opts.url;

    await solveTask(task, ctx);
  });
