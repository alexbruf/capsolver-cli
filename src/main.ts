#!/usr/bin/env bun
import { Command } from "commander";
import { getApiKey } from "./config.ts";
import { CapSolverClient } from "./client.ts";
import { formatBalance, error } from "./format.ts";
import { balanceCommand } from "./commands/balance.ts";
import { taskCommand } from "./commands/task.ts";
import { configCommand } from "./commands/config.ts";
import { solveCommand } from "./commands/solve/index.ts";

const program = new Command()
  .name("capsolver")
  .description("CapSolver captcha solving CLI")
  .version("1.0.0")
  .option("--json", "Output raw JSON")
  .option("--quiet", "Output only the solution value")
  .option("--timeout <seconds>", "Polling timeout in seconds", "120")
  .action(async () => {
    // Default action: show balance
    try {
      const client = new CapSolverClient(getApiKey());
      const res = await client.getBalance();
      console.log(formatBalance(res));
    } catch (e: unknown) {
      error(e instanceof Error ? e.message : String(e));
      process.exit(1);
    }
  });

program.addCommand(balanceCommand);
program.addCommand(solveCommand);
program.addCommand(taskCommand);
program.addCommand(configCommand);

program.parse();
