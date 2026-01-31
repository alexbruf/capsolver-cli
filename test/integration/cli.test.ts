import { test, expect, describe } from "bun:test";
import { join } from "path";

const CLI_PATH = join(import.meta.dir, "../../src/main.ts");

async function runCli(
  args: string[],
  env?: Record<string, string>,
): Promise<{ stdout: string; stderr: string; code: number }> {
  const proc = Bun.spawn(["bun", "run", CLI_PATH, ...args], {
    env: { ...process.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  const code = await proc.exited;
  return { stdout, stderr, code };
}

describe("capsolver CLI", () => {
  test("--help shows all commands", async () => {
    const { stdout, code } = await runCli(["--help"]);
    expect(code).toBe(0);
    expect(stdout).toContain("balance");
    expect(stdout).toContain("solve");
    expect(stdout).toContain("task");
    expect(stdout).toContain("config");
    expect(stdout).toContain("--json");
    expect(stdout).toContain("--quiet");
    expect(stdout).toContain("--timeout");
  });

  test("--version shows version", async () => {
    const { stdout, code } = await runCli(["--version"]);
    expect(code).toBe(0);
    expect(stdout.trim()).toBe("0.1.1");
  });

  test("solve --help shows all captcha types", async () => {
    const { stdout, code } = await runCli(["solve", "--help"]);
    expect(code).toBe(0);
    expect(stdout).toContain("image");
    expect(stdout).toContain("recaptcha-v2");
    expect(stdout).toContain("recaptcha-v3");
    expect(stdout).toContain("turnstile");
    expect(stdout).toContain("geetest");
    expect(stdout).toContain("datadome");
    expect(stdout).toContain("aws-waf");
    expect(stdout).toContain("mtcaptcha");
    expect(stdout).toContain("cloudflare-challenge");
  });

  test("solve recaptcha-v2 --help shows required options", async () => {
    const { stdout, code } = await runCli([
      "solve",
      "recaptcha-v2",
      "--help",
    ]);
    expect(code).toBe(0);
    expect(stdout).toContain("--url");
    expect(stdout).toContain("--key");
    expect(stdout).toContain("--enterprise");
    expect(stdout).toContain("--invisible");
    expect(stdout).toContain("--proxy");
  });

  test("solve turnstile --help shows required options", async () => {
    const { stdout, code } = await runCli(["solve", "turnstile", "--help"]);
    expect(code).toBe(0);
    expect(stdout).toContain("--url");
    expect(stdout).toContain("--key");
    expect(stdout).toContain("--action");
    expect(stdout).toContain("--cdata");
  });

  test("solve geetest --help shows v3 and v4 options", async () => {
    const { stdout, code } = await runCli(["solve", "geetest", "--help"]);
    expect(code).toBe(0);
    expect(stdout).toContain("--gt");
    expect(stdout).toContain("--challenge");
    expect(stdout).toContain("--captcha-id");
  });

  test("config shows no key when unset", async () => {
    const { stdout, code } = await runCli(["config"], {
      CAPSOLVER_API_KEY: "",
    });
    expect(code).toBe(0);
    expect(stdout).toContain("No API key configured");
  });

  test("config shows masked key when set", async () => {
    const { stdout, code } = await runCli(["config"], {
      CAPSOLVER_API_KEY: "CAP-1234567890ABCDEF",
    });
    expect(code).toBe(0);
    expect(stdout).toContain("CAP-1234...");
    expect(stdout).toContain("(from env)");
    expect(stdout).not.toContain("CAP-1234567890ABCDEF");
  });

  test("fails gracefully without API key", async () => {
    const { stderr, code } = await runCli(["balance"], {
      CAPSOLVER_API_KEY: "",
    });
    expect(code).toBe(1);
    expect(stderr).toContain("CAPSOLVER_API_KEY");
  });

  test("solve recaptcha-v2 fails without required flags", async () => {
    const { stderr, code } = await runCli(
      ["solve", "recaptcha-v2"],
      { CAPSOLVER_API_KEY: "fake" },
    );
    expect(code).toBe(1);
    expect(stderr).toContain("--url");
  });
});
