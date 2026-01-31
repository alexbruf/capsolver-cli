import { test, expect, describe } from "bun:test";
import {
  formatBalance,
  formatSolution,
  formatQuietSolution,
  formatTaskStatus,
  formatJson,
} from "../../src/format.ts";
import type {
  GetBalanceResponse,
  CreateTaskResponse,
  GetTaskResultResponse,
} from "../../src/types.ts";

describe("formatBalance", () => {
  test("shows balance amount", () => {
    const res: GetBalanceResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      balance: 25.5,
      packages: [],
    };
    const output = formatBalance(res);
    expect(output).toContain("$25.50");
    expect(output).toContain("Balance:");
  });

  test("shows packages when present", () => {
    const res: GetBalanceResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      balance: 10,
      packages: [
        {
          packageId: "pkg1",
          type: 2,
          title: "reCAPTCHA v2 500K",
          numberOfCalls: 500000,
          status: 1,
          token: "CAP-123",
          expireTime: 1702896511,
        },
      ],
    };
    const output = formatBalance(res);
    expect(output).toContain("reCAPTCHA v2 500K");
    expect(output).toContain("500000");
    expect(output).toContain("Packages:");
  });

  test("handles zero balance", () => {
    const res: GetBalanceResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      balance: 0,
    };
    const output = formatBalance(res);
    expect(output).toContain("$0.00");
  });
});

describe("formatSolution", () => {
  test("shows task ID and solution keys", () => {
    const res: CreateTaskResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      taskId: "task-abc-123",
      status: "ready",
      solution: { text: "hello123" },
    };
    const output = formatSolution(res);
    expect(output).toContain("task-abc-123");
    expect(output).toContain("ready");
    expect(output).toContain("text");
    expect(output).toContain("hello123");
  });

  test("truncates long values", () => {
    const longStr = "a".repeat(200);
    const res: CreateTaskResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      status: "ready",
      solution: { token: longStr },
    };
    const output = formatSolution(res);
    expect(output).toContain("...");
    expect(output).not.toContain(longStr);
  });
});

describe("formatQuietSolution", () => {
  test("returns token field first", () => {
    const res: GetTaskResultResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      status: "ready",
      solution: { token: "tk-123", userAgent: "Mozilla" },
    };
    expect(formatQuietSolution(res)).toBe("tk-123");
  });

  test("returns gRecaptchaResponse if no token", () => {
    const res: GetTaskResultResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      status: "ready",
      solution: { gRecaptchaResponse: "recap-token" },
    };
    expect(formatQuietSolution(res)).toBe("recap-token");
  });

  test("returns text for image tasks", () => {
    const res: CreateTaskResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      status: "ready",
      solution: { text: "abc123" },
    };
    expect(formatQuietSolution(res)).toBe("abc123");
  });

  test("returns empty string if no solution", () => {
    const res: GetTaskResultResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      status: "processing",
    };
    expect(formatQuietSolution(res)).toBe("");
  });

  test("falls back to first string value", () => {
    const res: CreateTaskResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      status: "ready",
      solution: { challenge: "ch-value", validate: "val" },
    };
    expect(formatQuietSolution(res)).toBe("ch-value");
  });
});

describe("formatTaskStatus", () => {
  test("shows processing status", () => {
    const res: GetTaskResultResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      taskId: "task-xyz",
      status: "processing",
    };
    const output = formatTaskStatus(res);
    expect(output).toContain("task-xyz");
    expect(output).toContain("processing");
  });

  test("shows solution for ready tasks", () => {
    const res: GetTaskResultResponse = {
      errorId: 0,
      errorCode: "",
      errorDescription: "",
      taskId: "task-xyz",
      status: "ready",
      solution: { gRecaptchaResponse: "token" },
    };
    const output = formatTaskStatus(res);
    expect(output).toContain("ready");
    expect(output).toContain("gRecaptchaResponse");
  });
});

describe("formatJson", () => {
  test("returns indented JSON", () => {
    const output = formatJson({ key: "value", nested: { a: 1 } });
    expect(JSON.parse(output)).toEqual({ key: "value", nested: { a: 1 } });
    expect(output).toContain("\n"); // Pretty-printed
  });
});
