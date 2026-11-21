import { cn } from "@/lib/utils";

/**
 * Splits a line into words that rise in one after another. Server-rendered,
 * CSS-only, so the headline is fully readable without JavaScript.
 */
export function AnimatedWords({
  text,
  className,
  wordClassName,
  delay = 0,
  step = 35,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  step?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={cn("[perspective:800px]", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn(
            "inline-block motion-safe:animate-[word-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both]",
            wordClassName,
          )}
          style={{ animationDelay: `${delay + i * step}ms` }}
        >
          {word}
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
