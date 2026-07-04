export type ErrorCode =
  /* General */
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "CONFLICT"
  | "UNPROCESSABLE_ENTITY"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR"

  /* Authentication */
  | "INVALID_CREDENTIALS"
  | "SESSION_EXPIRED"
  | "EMAIL_NOT_VERIFIED"
  | "TOKEN_EXPIRED"
  | "INVALID_TOKEN"

  /* Validation */
  | "VALIDATION_ERROR"
  | "INVALID_INPUT"
  | "INVALID_QUERY"
  | "INVALID_BODY"

  /* Database */
  | "DATABASE_ERROR"
  | "DATABASE_CONNECTION_ERROR"
  | "RECORD_NOT_FOUND"
  | "DUPLICATE_RECORD"
  | "TRANSACTION_FAILED"

  /* External Services */
  | "OPENAI_ERROR"
  | "ANTHROPIC_ERROR"
  | "GOOGLE_API_ERROR"
  | "GITHUB_API_ERROR"
  | "REDIS_ERROR"
  | "PAYMENT_ERROR"

  /* Upload */
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_TYPE"

  /* Rate Limit */
  | "RATE_LIMIT_EXCEEDED"

  /* AI */
  | "PROMPT_TOO_LONG"
  | "MODEL_UNAVAILABLE"

  /* Feature */
  | "FEATURE_DISABLED";

const statusMap: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,

  INVALID_CREDENTIALS: 401,
  SESSION_EXPIRED: 401,
  EMAIL_NOT_VERIFIED: 403,
  TOKEN_EXPIRED: 401,
  INVALID_TOKEN: 401,

  VALIDATION_ERROR: 400,
  INVALID_INPUT: 400,
  INVALID_QUERY: 400,
  INVALID_BODY: 400,

  DATABASE_ERROR: 500,
  DATABASE_CONNECTION_ERROR: 500,
  RECORD_NOT_FOUND: 404,
  DUPLICATE_RECORD: 409,
  TRANSACTION_FAILED: 500,

  OPENAI_ERROR: 502,
  ANTHROPIC_ERROR: 502,
  GOOGLE_API_ERROR: 502,
  GITHUB_API_ERROR: 502,
  REDIS_ERROR: 500,
  PAYMENT_ERROR: 502,

  FILE_TOO_LARGE: 413,
  INVALID_FILE_TYPE: 400,

  RATE_LIMIT_EXCEEDED: 429,

  PROMPT_TOO_LONG: 400,
  MODEL_UNAVAILABLE: 503,

  FEATURE_DISABLED: 403,
};

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly isOperational: boolean;
  readonly cause?: unknown;

  constructor(
    code: ErrorCode,
    message?: string,
    options?: {
      statusCode?: number;
      cause?: unknown;
      isOperational?: boolean;
    },
  ) {
    super(message ?? code);

    this.name = "AppError";
    this.code = code;
    this.statusCode = options?.statusCode ?? statusMap[code];
    this.cause = options?.cause;
    this.isOperational = options?.isOperational ?? true;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
      },
    };
  }

  static from(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError("INTERNAL_SERVER_ERROR", error.message, {
        cause: error,
      });
    }

    return new AppError("INTERNAL_SERVER_ERROR", "Unknown Error");
  }
}
