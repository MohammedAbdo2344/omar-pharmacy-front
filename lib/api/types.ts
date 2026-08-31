/**
 * Response envelope shapes returned by the backend, per API_INTEGRATION_REFERENCE.md §4.
 * The backend is inconsistent, so every shape must be modeled explicitly.
 */

// Shape A — ResponsesHelper::returnData
export interface ApiDataEnvelope<T> {
  header: unknown[];
  data: T;
  code: number;
  message: string;
  success: true;
  status: number;
}

// Shape B — ResponsesHelper::returnSuccessMessage / returnError (no data/header keys)
export interface ApiMessageEnvelope {
  code: number;
  message: string;
  success: boolean;
  status: number;
}

// Shape B2 — ResponsesHelper::returnValidationError
export interface ApiValidationErrorEnvelope {
  errors: Record<string, string[]>;
  code: number;
  message: string;
  success: false;
  status: number;
}

// Shape C — raw Laravel / non-ResponsesHelper JSON.
// GuestSessionAuth failures: { message: string }
// Uncaught ValidationException: { message: string, errors: Record<string, string[]> }
export interface ApiRawErrorEnvelope {
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiErrorEnvelope =
  | ApiMessageEnvelope
  | ApiValidationErrorEnvelope
  | ApiRawErrorEnvelope;
