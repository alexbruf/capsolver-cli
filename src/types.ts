export interface CreateTaskRequest {
  clientKey: string;
  appId?: string;
  task: Record<string, unknown>;
  callbackUrl?: string;
}

export interface CreateTaskResponse {
  errorId: number;
  errorCode: string;
  errorDescription: string;
  taskId?: string;
  status?: TaskStatus;
  solution?: Record<string, unknown>;
}

export interface GetTaskResultRequest {
  clientKey: string;
  taskId: string;
}

export type TaskStatus = "idle" | "processing" | "ready";

export interface GetTaskResultResponse {
  errorId: number;
  errorCode: string;
  errorDescription: string;
  taskId?: string;
  status?: TaskStatus;
  solution?: Record<string, unknown>;
}

export interface Package {
  packageId: string;
  type: number;
  title: string;
  numberOfCalls: number;
  status: number;
  token: string;
  expireTime: number;
}

export interface GetBalanceResponse {
  errorId: number;
  errorCode: string;
  errorDescription: string;
  balance?: number;
  packages?: Package[];
}

export class CapSolverError extends Error {
  errorId: number;
  errorCode: string;

  constructor(errorId: number, errorCode: string, errorDescription: string) {
    super(errorDescription || errorCode);
    this.name = "CapSolverError";
    this.errorId = errorId;
    this.errorCode = errorCode;
  }
}

export interface OutputOptions {
  json?: boolean;
  quiet?: boolean;
  timeout?: string;
}
