import winston from "winston";
import { developmentFormat, productionFormat } from "./format";
import { transports } from "./transports";
import type { LogMeta } from "./types";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format:
    process.env.NODE_ENV === "production"
      ? productionFormat
      : developmentFormat,
  defaultMeta: {
    service: "intellicode-x",
  },
  transports,
  exceptionHandlers: transports,
  rejectionHandlers: transports,
});

export default logger;

export const log = {
  info(message: string, meta?: LogMeta) {
    logger.info(message, meta);
  },

  warn(message: string, meta?: LogMeta) {
    logger.warn(message, meta);
  },

  error(message: string, meta?: LogMeta) {
    logger.error(message, meta);
  },

  debug(message: string, meta?: LogMeta) {
    logger.debug(message, meta);
  },
};
