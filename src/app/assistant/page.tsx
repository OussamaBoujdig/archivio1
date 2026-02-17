"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, FileText, Tag, FolderOpen, Trash2, Info } from "lucide-react";
import { PlatformLayout } from "@/components/platform-layout";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { icon: FileText, label: "Résumer un document", prompt: "Peux-tu me résumer le dernier rapport annuel ?" },
  { icon: FolderOpen, label: "Organiser mes fichiers", prompt: "Comment organiser mes documents par catégorie efficacement ?" },
  { icon: Tag, label: "Extraire des tags", prompt: "Quels tags suggères-tu pour un contrat de prestation de services ?" },
  { icon: Sparkles, label: "Conseils d'archivage", prompt: "Quelles sont les bonnes pratiques pour l'archivage documentaire ?" },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (data.configured !== undefined) setConfigured(data.configured);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message || data.error || "Désolé, une erreur est survenue.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Erreur de connexion. Veuillez réessayer.",
          timestamp: new Date(),
        },
      ]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <PlatformLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-1 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
              <Bot className="h-4 w-4 text-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Assistant IA</h1>
              <p className="text-[10px] text-muted-foreground">
                Propulsé par GPT-4o-mini {configured === false && "· Mode démo"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={clearChat}
                className="flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-1 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                  <Sparkles className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Comment puis-je vous aider ?</h2>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                  Je peux résumer vos documents, suggérer des catégories, extraire des mots-clés et bien plus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.prompt)}
                    className="flex items-start gap-3 rounded border border-border p-3 text-left hover:bg-accent hover:border-foreground/20 transition-colors"
                  >
                    <s.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-medium text-foreground">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{s.prompt}</p>
                    </div>
                  </button>
                ))}
              </div>

              {configured === false && (
                <div className="flex items-start gap-2 rounded bg-accent px-4 py-3 max-w-lg">
                  <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Mode démo actif.</strong> Les réponses sont simulées.
                    Configurez la variable <code className="text-foreground bg-background px-1 rounded">OPENAI_API_KEY</code> pour activer l&apos;IA réelle.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent flex-shrink-0">
                      <Bot className="h-3.5 w-3.5 text-foreground" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className={`rounded-lg px-4 py-2.5 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-foreground text-primary-foreground"
                      : "bg-accent text-foreground"
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: msg.role === "assistant" ? formatMarkdown(msg.content) : escapeHtml(msg.content),
                      }}
                    />
                    <p className={`text-[9px] mt-1.5 ${msg.role === "user" ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                      {msg.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground flex-shrink-0">
                      <User className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent flex-shrink-0">
                    <Bot className="h-3.5 w-3.5 text-foreground" strokeWidth={1.5} />
                  </div>
                  <div className="bg-accent rounded-lg px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border px-1 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question..."
                  rows={1}
                  className="w-full resize-none rounded border border-border bg-background px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors"
                  style={{ minHeight: "42px", maxHeight: "120px" }}
                />
              </div>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="flex h-[42px] w-[42px] items-center justify-center rounded bg-foreground text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-30"
              >
                <Send className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              GPT-4o-mini · Les réponses peuvent contenir des erreurs
            </p>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatMarkdown(text: string): string {
  let html = escapeHtml(text);
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="text-xs bg-background px-1 py-0.5 rounded">$1</code>');
  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm, '<span class="block border-l-2 border-border pl-3 text-muted-foreground italic">$1</span>');
  // Headers
  html = html.replace(/^### (.+)$/gm, '<span class="block text-xs font-semibold mt-2 mb-1">$1</span>');
  html = html.replace(/^## (.+)$/gm, '<span class="block text-sm font-semibold mt-2 mb-1">$1</span>');
  // Lists
  html = html.replace(/^- (.+)$/gm, '<span class="block pl-3">• $1</span>');
  html = html.replace(/^\d+\. (.+)$/gm, (match, p1, offset, str) => {
    const linesBefore = str.substring(0, offset).split('\n');
    const num = linesBefore.filter((l: string) => /^\d+\. /.test(l)).length + 1;
    return `<span class="block pl-3">${num}. ${p1}</span>`;
  });
  return html;
}
