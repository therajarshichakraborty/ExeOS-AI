import { randomUUID } from "node:crypto";

export function createRequestLogger(meta?: Record<string, unknown>) {
  const requestId = randomUUID();

  return {
    requestId,
    info(message: string, extra?: Record<string, unknown>) {
      return import("./index").then(({ log }) =>
        log.info(message, {
          requestId,
          ...meta,
          ...extra,
        }),
      );
    },

    warn(message: string, extra?: Record<string, unknown>) {
      return import("./index").then(({ log }) =>
        log.warn(message, {
          requestId,
          ...meta,
          ...extra,
        }),
      );
    },

    error(message: string, extra?: Record<string, unknown>) {
      return import("./index").then(({ log }) =>
        log.error(message, {
          requestId,
          ...meta,
          ...extra,
        }),
      );
    },

    debug(message: string, extra?: Record<string, unknown>) {
      return import("./index").then(({ log }) =>
        log.debug(message, {
          requestId,
          ...meta,
          ...extra,
        }),
      );
    },
  };
}
