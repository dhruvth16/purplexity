interface ParsedResponse {
  Title?: string;
  Summary?: string[];
  Answer?: string[];
  Followups?: string[];
  answer?: string[];
  followUpQuestions?: string[];
}

interface FormattedResponseProps {
  content: string;
  isStreaming?: boolean;
  onFollowUpClick?: (question: string) => void;
}

export function FormattedResponse({
  content,
  isStreaming = false,
  onFollowUpClick,
}: FormattedResponseProps) {
  let parsed: ParsedResponse | null = null;
  try {
    parsed = JSON.parse(content);
  } catch {
}

  if (!parsed) {
    return (
      <div className="text-sm leading-relaxed text-text-primary/90 whitespace-pre-wrap break-words">
        {content}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-accent-light ml-0.5 animate-pulse-glow rounded-sm" />
        )}
      </div>
    );
  }

  const title = parsed.Title || "";
  const summary = parsed.Summary || [];
  const answer = parsed.Answer || parsed.answer || [];
  const followUps = parsed.Followups || parsed.followUpQuestions || [];

  return (
    <div className="space-y-5">
      {title && (
        <h3 className="text-lg font-bold text-text-primary tracking-tight">
          {title}
        </h3>
      )}

      {summary.length > 0 && (
        <div className="space-y-1">
          <p className="text-[0.7rem] uppercase tracking-widest text-text-muted font-semibold mb-2">
            Summary
          </p>
          <div className="space-y-2">
            {summary.map((point, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-light flex-shrink-0" />
                <p className="text-sm leading-relaxed text-text-secondary">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {answer.length > 0 && (
        <div className="space-y-1">
          <p className="text-[0.7rem] uppercase tracking-widest text-text-muted font-semibold mb-2">
            Answer
          </p>
          <div className="space-y-3">
            {answer.map((point, i) => (
              <div
                key={i}
                className="pl-4 border-l-2 border-accent/30 py-0.5"
              >
                <p className="text-sm leading-relaxed text-text-primary/90">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {followUps.length > 0 && !isStreaming && (
        <div className="space-y-1">
          <p className="text-[0.7rem] uppercase tracking-widest text-text-muted font-semibold mb-2">
            Related questions
          </p>
          <div className="flex flex-col gap-2">
            {followUps.map((q, i) => (
              <button
                key={i}
                onClick={() => onFollowUpClick?.(q)}
                className="text-left text-sm px-3.5 py-2.5 rounded-xl bg-bg-tertiary/60 border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-tertiary hover:border-border-hover transition-all duration-150 cursor-pointer"
              >
                <span className="mr-2 text-accent-light">→</span>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
