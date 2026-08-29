import type { ApiErrorEnvelope } from "./types";

export class BackendApiError extends Error {
  readonly status: number;
  readonly code?: number;
  readonly errors?: Record<string, string[]>;
  readonly envelope: ApiErrorEnvelope;

  constructor(status: number, envelope: ApiErrorEnvelope) {
    super(envelope.message);
    this.name = "BackendApiError";
    this.status = status;
    this.envelope = envelope;
    this.code = "code" in envelope ? envelope.code : undefined;
    this.errors = "errors" in envelope ? envelope.errors : undefined;
  }
}
