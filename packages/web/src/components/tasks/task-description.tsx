import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Render a task description as markdown with the neobrutalist typography system.
 * Task descriptions should always be markdown and should always contain
 * completion instructions.
 */
export function TaskDescription({ markdown }: { markdown: string }) {
  return (
    <div className="task-description space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-black uppercase tracking-tight">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 text-xl font-black uppercase tracking-tight">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 text-base font-black uppercase tracking-tight">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-base font-bold leading-7 text-muted-foreground">{children}</p>
          ),
          strong: ({ children }) => <strong className="font-black text-foreground">{children}</strong>,
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-6 text-base font-bold text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-6 text-base font-bold text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-black text-brutal-pink underline underline-offset-4 hover:text-foreground"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brutal-pink bg-muted px-4 py-3 text-base font-bold text-foreground">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="border-2 border-primary bg-muted px-1.5 py-0.5 text-sm">{children}</code>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Extract a short summary from a markdown description for use in rows, cards,
 * OG images, and share text. Strips markdown syntax and returns the first
 * paragraph, truncated to maxLength chars.
 */
export function getTaskDescriptionSummary(markdown: string, maxLength = 220): string {
  // Strip markdown headings, links, bold, italic, code
  const firstParagraph = markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !block.startsWith("#")) ?? markdown;

  const plain = firstParagraph
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) → text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** → bold
    .replace(/\*([^*]+)\*/g, "$1") // *italic* → italic
    .replace(/`([^`]+)`/g, "$1") // `code` → code
    .replace(/^[-*]\s+/gm, "") // bullets
    .replace(/\n/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 1).trimEnd()}...`;
}
