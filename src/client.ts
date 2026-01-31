import type {
  CreateTaskResponse,
  GetTaskResultResponse,
  GetBalanceResponse,
} from "./types.ts";
import { CapSolverError } from "./types.ts";

const BASE_URL = "https://api.capsolver.com";

export class CapSolverClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientKey: this.apiKey, ...body }),
    });

    // Try parsing JSON even on non-200 — the API returns error details in the body
    let data: T & {
      errorId: number;
      errorCode: string;
      errorDescription: string;
    };

    try {
      data = (await res.json()) as typeof data;
    } catch {
      // No JSON body — fall back to HTTP status
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    if (data.errorId !== 0) {
      throw new CapSolverError(
        data.errorId,
        data.errorCode,
        data.errorDescription,
      );
    }

    if (!res.ok && !data.errorId) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return data;
  }

  getBalance(): Promise<GetBalanceResponse> {
    return this.post("/getBalance", {});
  }

  createTask(
    task: Record<string, unknown>,
    callbackUrl?: string,
  ): Promise<CreateTaskResponse> {
    const body: Record<string, unknown> = { task };
    if (callbackUrl) body.callbackUrl = callbackUrl;
    return this.post("/createTask", body);
  }

  getTaskResult(taskId: string): Promise<GetTaskResultResponse> {
    return this.post("/getTaskResult", { taskId });
  }
}
