"use client";

import { Badge } from "@/components/ui/badge";
import { ProcessedEmail } from "@/db/schema";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  ListTodo,
  User,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { stripHtml } from "@/lib/agents/gmail";
import { cn } from "@/lib/utils";

const priorityBadges: Record<string, string> = {
  high: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2",
  medium:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2",
  low: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2",
};

const categoryBadges: Record<string, string> = {
  work: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2",
  personal:
    "bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2",
  newsletter:
    "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2",
  notification:
    "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2",
  spam: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2",
  other:
    "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2",
};

export function EmailDetail({ email }: { email: ProcessedEmail }) {
  const [expanded, setExpanded] = useState(false);

  const senderName =
    email.from?.split("<")[0]?.trim().replace(/"/g, "") || email.from;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "group border border-border/80 bg-card rounded-2xl p-5 hover:border-foreground/15 hover:shadow-sm transition-all duration-200 cursor-pointer select-none space-y-4",
        expanded && "border-foreground/10 bg-card/60",
      )}
    >
      {/* Collapsed view Header */}
      <div className='flex items-start justify-between gap-4'>
        <div className='space-y-2 flex-1 min-w-0'>
          <div className='flex items-center gap-2 flex-wrap'>
            <h3 className='text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors'>
              {email.subject || "(No subject)"}
            </h3>

            {/* Action Indicators & Badges */}
            {email.status === "error" && (
              <Badge
                variant='destructive'
                className='bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2'
              >
                Failed
              </Badge>
            )}
            {email.priority && (
              <Badge
                variant='secondary'
                className={priorityBadges[email.priority] || "bg-muted"}
              >
                {email.priority}
              </Badge>
            )}
            {email.category && (
              <Badge
                variant='outline'
                className={
                  categoryBadges[email.category] ||
                  "bg-muted text-muted-foreground"
                }
              >
                {email.category}
              </Badge>
            )}
            {email.draftCreated && (
              <Badge
                variant='outline'
                className='bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2 gap-1'
              >
                <FileText className='h-3 w-3' />
                Draft
              </Badge>
            )}
            {(email.tasksCreated ?? 0) > 0 && (
              <Badge
                variant='outline'
                className='bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2 gap-1'
              >
                <ListTodo className='h-3 w-3' />
                {email.tasksCreated} Task{email.tasksCreated !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {/* Sender & Date Metas */}
          <div className='flex items-center gap-4 text-xs text-muted-foreground flex-wrap'>
            <span className='flex items-center gap-1.5 font-medium'>
              <User className='h-3.5 w-3.5' />
              {senderName}
            </span>
            <span className='flex items-center gap-1.5 font-medium'>
              <Clock className='h-3.5 w-3.5' />
              {new Date(email.processedAt).toLocaleString()}
            </span>
          </div>

          {/* Short preview snippet (hide when expanded to reduce redundancy) */}
          {!expanded && (email.summary || email.snippet) && (
            <p className='text-xs text-muted-foreground line-clamp-1 leading-relaxed pt-0.5'>
              {email.summary || email.snippet}
            </p>
          )}
        </div>

        <div className='shrink-0 text-muted-foreground hover:text-foreground p-1 transition-colors'>
          {expanded ? (
            <ChevronUp className='h-5 w-5' />
          ) : (
            <ChevronDown className='h-5 w-5' />
          )}
        </div>
      </div>

      {/* Expanded Details Grid */}
      {expanded && (
        <div
          className='border-t border-border/40 pt-5 space-y-5 animate-fade-in'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Detailed Error message if run failed */}
          {email.status === "error" && (
            <div className='flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-red-500 text-xs leading-relaxed'>
              <AlertTriangle className='h-4.5 w-4.5 shrink-0 mt-0.5' />
              <div className='space-y-1'>
                <p className='font-bold'>Operational Error</p>
                <p>
                  {email.error ||
                    "An unknown error occurred during AI analysis."}
                </p>
              </div>
            </div>
          )}

          <div className='grid gap-6 md:grid-cols-2'>
            {/* Action Items Column */}
            {email.actionItems && email.actionItems.length > 0 && (
              <div className='space-y-3'>
                <h4 className='text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5'>
                  <ListTodo className='h-4 w-4 text-primary' />
                  Action Items
                </h4>
                <ul className='space-y-3'>
                  {email.actionItems.map((item, i) => (
                    <li
                      key={i}
                      className='border border-border/60 rounded-xl p-4 bg-muted/20 space-y-1.5'
                    >
                      <p className='text-sm font-bold text-foreground leading-tight'>
                        {item.title}
                      </p>
                      <p className='text-xs text-muted-foreground leading-relaxed'>
                        {item.description}
                      </p>
                      {item.dueDate && (
                        <div className='flex items-center gap-1.5 text-[11px] font-semibold text-primary/80 pt-1'>
                          <Clock className='h-3 w-3' />
                          <span>
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Draft Reply Column */}
            {email.draftReply && (
              <div className='space-y-3'>
                <h4 className='text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5'>
                  <FileText className='h-4 w-4 text-primary' />
                  Draft Reply
                </h4>
                <div className='border border-primary/20 rounded-xl p-4 bg-primary/5 space-y-1.5'>
                  <p className='text-xs text-muted-foreground font-semibold'>
                    Suggested Template
                  </p>
                  <p className='text-xs text-foreground whitespace-pre-wrap leading-relaxed font-sans break-words'>
                    {email.draftReply}
                  </p>
                </div>
              </div>
            )}

            {/* Full Email Text fallback / Bypassed Content */}
            {(!email.actionItems || email.actionItems.length === 0) &&
              !email.draftReply && (
                <div className='col-span-2 space-y-4'>
                  {(email.body || email.summary || email.snippet) && (
                    <div className='space-y-3'>
                      <h4 className='text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5'>
                        <FileText className='h-4 w-4 text-primary' />
                        Original Email Content
                      </h4>
                      <div className='border border-border/80 bg-muted/30 p-4 rounded-xl max-h-96 overflow-y-auto'>
                        <p className='text-xs text-muted-foreground whitespace-pre-wrap font-sans break-words leading-relaxed'>
                          {stripHtml(
                            email.body || email.summary || email.snippet || "",
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className='text-center pt-2'>
                    <p className='text-xs text-muted-foreground italic'>
                      No action items or draft reply were generated for this
                      email.
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
