"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ title: string; url: string }>;
};

export default function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = question.trim();
    if (!value || pending) return;

    setQuestion("");
    setMessages((current) => [...current, { role: "user", content: value }]);
    setPending(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ question: value }),
      });
      const payload = (await response.json()) as {
        answer?: string;
        sources?: Array<{ title: string; url: string }>;
        error?: string;
      };

      if (!response.ok || !payload.answer) {
        throw new Error(payload.error || "The assistant could not respond");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: payload.answer as string, sources: payload.sources ?? [] },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "The assistant is temporarily unavailable.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] font-sans">
      {open ? (
        <section
          aria-label="Portfolio AI assistant"
          className="mb-3 flex h-[min(70vh,34rem)] w-[min(92vw,24rem)] flex-col overflow-hidden border border-system-green/25 bg-[#070b0a] shadow-2xl shadow-black/70"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-system-green">Portfolio assistant</p>
              <p className="mt-1 text-xs text-white/50">Ask about projects, skills and experience</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-2 text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="Close assistant"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.length === 0 ? (
              <div className="border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-white/65">
                Hello. I can help you explore Rahul&apos;s published work, technical skills, and public contributions.
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.role === "user"
                      ? "ml-7 border border-system-green/20 bg-system-green/[0.07] p-3 text-sm leading-relaxed text-white"
                      : "mr-5 border border-white/10 bg-white/[0.04] p-3 text-sm leading-relaxed text-white/75"
                  }
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.sources && message.sources.length > 0 ? (
                    <div className="mt-3 border-t border-white/10 pt-2">
                      <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-system-green/70">Sources</p>
                      {message.sources.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-xs text-system-green underline decoration-system-green/30 underline-offset-2"
                        >
                          {source.title}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))
            )}
            {pending ? (
              <p className="font-mono text-[10px] uppercase tracking-wider text-system-green/70">Searching portfolio knowledge…</p>
            ) : null}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={1200}
              placeholder="Ask a question…"
              aria-label="Ask the portfolio assistant"
              className="min-w-0 flex-1 border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-system-green/50"
              disabled={pending}
            />
            <button
              type="submit"
              disabled={pending || !question.trim()}
              aria-label="Send question"
              className="inline-flex w-11 items-center justify-center border border-system-green/30 bg-system-green/[0.08] text-system-green transition-colors hover:bg-system-green/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-12 items-center gap-2 border border-system-green/40 bg-[#07110d] px-4 font-mono text-[10px] uppercase tracking-[0.15em] text-system-green shadow-lg shadow-black/50 transition-colors hover:bg-system-green/10"
        aria-expanded={open}
        aria-label={open ? "Close portfolio assistant" : "Open portfolio assistant"}
      >
        <MessageCircle size={16} />
        Ask about this portfolio
      </button>
    </div>
  );
}
