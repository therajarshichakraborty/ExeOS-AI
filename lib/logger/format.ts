import { format } from "winston";
const { combine, timestamp, errors, json, colorize, printf } = format;

export const productionFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

export const developmentFormat = combine(
  colorize(),
  timestamp({
    format: "HH:mm:ss",
  }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} ${level}: ${stack ?? message}`;
  }),
);
