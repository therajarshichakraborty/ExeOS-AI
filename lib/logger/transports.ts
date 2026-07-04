import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "node:path";

const logDir = path.join(process.cwd(), "logs");

export const transports: winston.transport[] = [
  new DailyRotateFile({
    dirname: path.join(logDir, "combined"),
    filename: "%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d",
    maxSize: "20m",
    zippedArchive: true,
    level: "info",
  }),

  new DailyRotateFile({
    dirname: path.join(logDir, "error"),
    filename: "%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "60d",
    maxSize: "20m",
    zippedArchive: true,
    level: "error",
  }),
];

if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      level: "debug",
    }),
  );
}
