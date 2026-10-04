import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUp, Bot, GraduationCap, Route as RouteIcon, Sparkles } from "lucide-react";
import { askAdvisor } from "@/lib/advisor.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/app/advisor")({ component: AdvisorPage });
type Message = { role: "user" | "assistant"; content: string };
const prompts = [
  "Show my strongest university matches",
  "What should I improve in my profile?",
  "Explain my next application step",
];
function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Tell me what you want to study, where you hope to go, or what is blocking your application. I will use your Livio profile and catalogue—never invented university facts.",
    },
  ]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  async function send(value = text) {
    const clean = value.trim();
    if (!clean || busy) return;
    const next = [...messages, { role: "user" as const, content: clean }];
    setMessages(next);
    setText("");
    setBusy(true);
    try {
      const result = await askAdvisor({ data: { messages: next } });
      setMessages([
        ...next,
        {
          role: "assistant",
          content: result.error ?? result.reply ?? "I could not answer that safely.",
        },
      ]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "The advisor is unavailable right now. Your saved profile and journey are unaffected.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            AI advisor
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Plan with context, not guesswork
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Catalogue requirements are illustrative until a counsellor verifies them.
          </p>
        </div>
        <Bot className="h-8 w-8 text-primary" />
      </div>
      <div className="mt-6 min-h-[50dvh] space-y-4 rounded-[2rem] bg-card p-4 ring-1 ring-border sm:p-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground"
                : "max-w-[90%] whitespace-pre-wrap rounded-3xl rounded-bl-md bg-secondary px-4 py-3 text-sm leading-6 text-foreground"
            }
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="w-fit rounded-3xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
            Reviewing your profile…
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="rounded-full border border-border bg-card px-3 py-2 text-xs font-medium hover:border-primary"
          >
            {p}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="sticky bottom-20 mt-4 flex gap-2 rounded-full bg-card p-2 shadow-xl ring-1 ring-border lg:bottom-4"
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about courses, universities or your application"
          className="h-11 flex-1 rounded-full border-0 bg-transparent shadow-none"
        />
        <Button
          size="icon"
          className="h-11 w-11 shrink-0 rounded-full"
          disabled={busy || !text.trim()}
          aria-label="Send"
        >
          <ArrowUp />
        </Button>
      </form>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/app/universities">
            <GraduationCap />
            Explore
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/app/journey">
            <RouteIcon />
            My journey
          </Link>
        </Button>
      </div>
    </div>
  );
}
