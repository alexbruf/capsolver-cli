import { homedir } from "os";
import { join } from "path";

export const CONFIG_DIR = join(homedir(), ".config", "capsolver");
export const CONFIG_KEY_PATH = join(CONFIG_DIR, "key");

export function getApiKey(): string {
  const key = process.env.CAPSOLVER_API_KEY || readKeyFile();
  if (!key) {
    throw new Error(
      "CAPSOLVER_API_KEY is not set. Run: capsolver config set-key <key>",
    );
  }
  return key;
}

function readKeyFile(): string | null {
  try {
    const file = Bun.file(CONFIG_KEY_PATH);
    // Bun.file().text() is async, use Node fs for sync read
    const fs = require("fs");
    return fs.readFileSync(CONFIG_KEY_PATH, "utf-8").trim() || null;
  } catch {
    return null;
  }
}
