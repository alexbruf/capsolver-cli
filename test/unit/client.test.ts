import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import { CapSolverClient } from "../../src/client.ts";
import { CapSolverError } from "../../src/types.ts";

let originalFetch: typeof globalThis.fetch;

beforeEach(() => {
  originalFetch = globalThis.fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function mockFetch(response: unknown, status = 200) {
  globalThis.fetch = (async (_url: string | URL | Request, _init?: RequestInit) => {
    return new Response(JSON.stringify(response), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
}

describe("CapSolverClient", () => {
  const client = new CapSolverClient("test-key-123");

  describe("getBalance", () => {
    test("returns balance on success", async () => {
      mockFetch({
        errorId: 0,
        errorCode: "",
        errorDescription: "",
        balance: 12.34,
        packages: [],
      });

      const res = await client.getBalance();
      expect(res.balance).toBe(12.34);
      expect(res.packages).toEqual([]);
    });

    test("throws CapSolverError on API error", async () => {
      mockFetch({
        errorId: 1,
        errorCode: "ERROR_KEY_DENIED_ACCESS",
        errorDescription: "Wrong account key",
      });

      try {
        await client.getBalance();
        expect(true).toBe(false); // Should not reach
      } catch (e) {
        expect(e).toBeInstanceOf(CapSolverError);
        const err = e as CapSolverError;
        expect(err.errorCode).toBe("ERROR_KEY_DENIED_ACCESS");
        expect(err.message).toBe("Wrong account key");
      }
    });

    test("throws on HTTP error with no JSON body", async () => {
      globalThis.fetch = (async () => {
        return new Response("Server Error", { status: 500 });
      }) as typeof fetch;

      await expect(client.getBalance()).rejects.toThrow("HTTP 500");
    });

    test("parses JSON error body on non-200 status", async () => {
      globalThis.fetch = (async () => {
        return new Response(
          JSON.stringify({
            errorId: 1,
            errorCode: "ERROR_KEY_DENIED_ACCESS",
            errorDescription: "Wrong account key",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }) as typeof fetch;

      try {
        await client.getBalance();
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(CapSolverError);
        const err = e as CapSolverError;
        expect(err.errorCode).toBe("ERROR_KEY_DENIED_ACCESS");
      }
    });
  });

  describe("createTask", () => {
    test("returns taskId for async task", async () => {
      mockFetch({
        errorId: 0,
        errorCode: "",
        errorDescription: "",
        taskId: "abc-123",
      });

      const res = await client.createTask({
        type: "ReCaptchaV2TaskProxyLess",
        websiteURL: "https://example.com",
        websiteKey: "site-key",
      });
      expect(res.taskId).toBe("abc-123");
    });

    test("returns immediate solution for sync task", async () => {
      mockFetch({
        errorId: 0,
        errorCode: "",
        errorDescription: "",
        status: "ready",
        solution: { text: "abc123" },
        taskId: "sync-123",
      });

      const res = await client.createTask({
        type: "ImageToTextTask",
        body: "base64data",
      });
      expect(res.status).toBe("ready");
      expect(res.solution).toEqual({ text: "abc123" });
    });

    test("sends clientKey in body", async () => {
      let capturedBody: Record<string, unknown> = {};
      globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
        capturedBody = JSON.parse(init?.body as string);
        return new Response(
          JSON.stringify({ errorId: 0, errorCode: "", errorDescription: "" }),
          { headers: { "Content-Type": "application/json" } },
        );
      }) as typeof fetch;

      await client.createTask({ type: "ImageToTextTask", body: "data" });
      expect(capturedBody.clientKey).toBe("test-key-123");
      expect(capturedBody.task).toEqual({ type: "ImageToTextTask", body: "data" });
    });
  });

  describe("getTaskResult", () => {
    test("returns processing status", async () => {
      mockFetch({
        errorId: 0,
        errorCode: "",
        errorDescription: "",
        taskId: "abc-123",
        status: "processing",
      });

      const res = await client.getTaskResult("abc-123");
      expect(res.status).toBe("processing");
      expect(res.solution).toBeUndefined();
    });

    test("returns ready with solution", async () => {
      mockFetch({
        errorId: 0,
        errorCode: "",
        errorDescription: "",
        taskId: "abc-123",
        status: "ready",
        solution: { gRecaptchaResponse: "token-value" },
      });

      const res = await client.getTaskResult("abc-123");
      expect(res.status).toBe("ready");
      expect(res.solution?.gRecaptchaResponse).toBe("token-value");
    });

    test("throws on invalid taskId", async () => {
      mockFetch({
        errorId: 1,
        errorCode: "ERROR_TASKID_INVALID",
        errorDescription: "Task ID does not exist or is invalid",
      });

      await expect(client.getTaskResult("bad-id")).rejects.toThrow(
        "Task ID does not exist",
      );
    });
  });
});
