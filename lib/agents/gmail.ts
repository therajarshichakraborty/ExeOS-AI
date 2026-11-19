import type { gmail_v1 } from "googleapis";

export interface ParsedEmail {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  snippet: string;
}

export async function fetchUnreadEmails(
  gmail: gmail_v1.Gmail,
  maxResults = 10,
): Promise<ParsedEmail[]> {
  const response = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread newer_than:7d",
    maxResults,
  });

  console.log(
    `Gmail: found ${response.data.messages?.length ?? 0} unread emails`,
  );

  const messageIds = response.data.messages ?? [];
  if (messageIds.length === 0) return [];

  const emails = await Promise.all(
    messageIds.map(async (msg) => {
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "full",
      });
      return parseGmailMessage(detail.data);
    }),
  );

  return emails;
}

export function stripHtml(html: string): string {
  if (!html) return "";

  let text = html;

  // 1. Remove style, script and head tags with their content
  text = text.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  // 2. Convert escaped brackets to real brackets first so escaped tags are caught
  text = text.replace(/&lt;/gi, "<");
  text = text.replace(/&gt;/gi, ">");

  // 3. Replace block elements with spacing newlines
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<\/tr>/gi, "\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/h[1-6]>/gi, "\n\n");
  text = text.replace(/<\/div>/gi, "\n");

  // 4. Strip all HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Remove all HTTP/HTTPS hyperlinks and optional surrounding parentheses
  text = text.replace(/\(?\s*https?:\/\/[^\s)]+\s*\)?/gi, "");

  // 5. Decode remaining common HTML entities
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&raquo;": "»",
    "&laquo;": "«",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
  };
  text = text.replace(
    /&[a-z0-9#]+;/gi,
    (match) => entities[match.toLowerCase()] ?? match,
  );
  text = text.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCharCode(parseInt(dec, 10)),
  );

  // 6. Clean up redundant line spacing
  text = text
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line, index, arr) => line !== "" || (index > 0 && arr[index - 1] !== ""),
    )
    .join("\n")
    .trim();

  return text;
}

export function parseGmailMessage(
  message: gmail_v1.Schema$Message,
): ParsedEmail {
  const headers = message.payload?.headers ?? [];
  const getHeader = (name: string) =>
    headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ??
    "";

  // Gmail nests bodies arbitrarily deep (multipart/mixed > multipart/alternative > text/*),
  // so walk the tree and prefer text/plain over text/html.
  const findPart = (
    part: gmail_v1.Schema$MessagePart | undefined,
    mime: string,
  ): gmail_v1.Schema$MessagePart | undefined => {
    if (!part) return undefined;
    if (part.mimeType === mime && part.body?.data) return part;
    for (const child of part.parts ?? []) {
      const found = findPart(child, mime);
      if (found) return found;
    }
    return undefined;
  };

  const payload = message.payload;
  const part =
    findPart(payload, "text/plain") ??
    findPart(payload, "text/html") ??
    (payload?.body?.data ? payload : undefined);
  let body = part?.body?.data
    ? Buffer.from(part.body.data, "base64url").toString("utf-8")
    : "";
  const isHtmlBody = part?.mimeType === "text/html";

  // Strip HTML if it is a text/html part or if it contains HTML markup tags
  if (isHtmlBody || /<[a-z][\s\S]*>/i.test(body)) {
    body = stripHtml(body);
  }

  // Truncate long emails to stay within token limits
  if (body.length > 5000) {
    body = body.substring(0, 5000) + "\n\n[Email truncated for processing]";
  }

  return {
    id: message.id ?? "",
    threadId: message.threadId ?? "",
    from: getHeader("From"),
    to: getHeader("To"),
    subject: getHeader("Subject"),
    body,
    date: getHeader("Date"),
    snippet: message.snippet ?? "",
  };
}

export async function markAsRead(
  gmail: gmail_v1.Gmail,
  messageId: string,
): Promise<void> {
  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: {
      removeLabelIds: ["UNREAD"],
    },
  });
}

export async function createDraft(
  gmail: gmail_v1.Gmail,
  to: string,
  subject: string,
  body: string,
  threadId: string,
): Promise<string> {
  const rawEmail = [
    `To: ${to}`,
    `Subject: ${/^re:/i.test(subject) ? subject : `Re: ${subject}`}`,
    `Content-Type: text/plain; charset=utf-8`,
    "",
    body,
  ].join("\r\n");

  const encodedMessage = Buffer.from(rawEmail).toString("base64url");

  const response = await gmail.users.drafts.create({
    userId: "me",
    requestBody: {
      message: {
        raw: encodedMessage,
        threadId,
      },
    },
  });

  return response.data.id ?? "";
}
