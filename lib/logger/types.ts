export interface LogMeta {
  requestId?: string;
  userId?: string;
  route?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}
