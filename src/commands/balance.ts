import { Command } from "commander";
import { getApiKey } from "../config.ts";
import { CapSolverClient } from "../client.ts";
import { formatBalance, formatJson, error } from "../format.ts";

export const balanceCommand = new Command("balance")
  .description("Show account balance and packages")
  .action(async (_opts, cmd) => {
    try {
      const parent = cmd.parent;
      const json = parent?.opts().json;
      const client = new CapSolverClient(getApiKey());
      const res = await client.getBalance();
      if (json) {
        console.log(formatJson(res));
      } else {
        console.log(formatBalance(res));
      }
    } catch (e: unknown) {
      error(e instanceof Error ? e.message : String(e));
      process.exit(1);
    }
  });
