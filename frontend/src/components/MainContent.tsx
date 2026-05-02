import React from 'react'
import { FormattedResponse } from './FormattedResponse';

interface MainContentProps {
    activeConversationId: string | null,
    conversations: any[],
    contentRef: React.RefObject<HTMLDivElement | null>,
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>,
    sidebarOpen: boolean,
    query: string,
    setQuery: (q: string) => void,
    handleSearch: (e: React.FormEvent) => void,
    messages: any[],
    hasContent: string | true,
    streamedContent: string,
    sources: any[],
    isStreaming: boolean
}

function MainContent({ activeConversationId, conversations, contentRef, setSidebarOpen, sidebarOpen, query, setQuery, handleSearch, messages, hasContent, streamedContent, sources, isStreaming }: MainContentProps) {
    return (
        <main className="flex-1 flex flex-col h-full">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-sm flex-shrink-0">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-all duration-150 cursor-pointer border-none bg-transparent block"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <h2 className="text-sm font-medium text-text-secondary">
                    {activeConversationId
                        ? conversations.find((c) => c.id === activeConversationId)?.title || "Conversation"
                        : "New Search"
                    }
                </h2>
            </div>

            {/* Scrollable content area */}
            <div ref={contentRef} className="flex-1 overflow-y-auto">
                {!hasContent ? (
                    /* ── Empty state ── */
                    <div className="h-full flex flex-col items-center justify-center p-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-[#6d28d9] flex items-center justify-center text-2xl mb-6 shadow-[0_4px_32px_rgba(124,58,237,0.3)]">
                            ⚡
                        </div>
                        <h2 className="text-2xl font-bold mb-2 tracking-tight">
                            What do you want to know?
                        </h2>
                        <p className="text-text-muted text-sm mb-8 max-w-sm text-center">
                            Ask anything and get AI-powered answers backed by real web sources.
                        </p>

                        {/* Search input (centered for empty state) */}
                        <form onSubmit={handleSearch} className="w-full max-w-2xl">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="w-full py-4 pl-5 pr-14 rounded-2xl bg-bg-secondary border border-border-subtle text-text-primary text-base outline-none transition-all duration-200 font-[Inter,system-ui,sans-serif] placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-glow)]"
                                    disabled={isStreaming}
                                />
                                <button
                                    type="submit"
                                    disabled={isStreaming || !query.trim()}
                                    className="absolute right-3 p-2.5 rounded-xl bg-gradient-to-br from-accent to-[#6d28d9] text-white border-none cursor-pointer transition-all duration-200 hover:shadow-[0_2px_12px_var(--color-accent-glow)] disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13" />
                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* ── Messages / Streamed content ── */
                    <div className="max-w-3xl mx-auto p-6 pb-4">
                        {/* Previous messages */}
                        {messages.map((msg, index) => (
                            <div key={msg.id} className="mb-6 animate-fade-in">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-[#6d28d9] flex items-center justify-center text-[0.7rem] flex-shrink-0 mt-0.5">
                                        ⚡
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <FormattedResponse
                                            content={msg.content.split("\n\nSources:\n")[0] || ""}
                                            onFollowUpClick={(q) => setQuery(q)}
                                        />
                                        {/* Message sources */}
                                        {msg.content.includes("\n\nSources:\n") && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {msg.content
                                                    .split("\n\nSources:\n")[1]
                                                    ?.split("\n")
                                                    .filter(Boolean)
                                                    .map((url: string, i: number) => (
                                                        <a
                                                            key={i}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[0.75rem] px-3 py-1.5 rounded-full bg-bg-tertiary border border-border-subtle text-accent-light hover:border-border-hover hover:bg-bg-hover transition-all duration-150 truncate max-w-[250px] no-underline"
                                                        >
                                                            {new URL(url).hostname.replace("www.", "")}
                                                        </a>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {index < messages.length - 1 && (
                                    <div className="border-b border-border-subtle/50 my-6" />
                                )}
                            </div>
                        ))}

                        {/* Currently streaming content */}
                        {streamedContent && (
                            <div className="mb-6 animate-fade-in">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-[#6d28d9] flex items-center justify-center text-[0.7rem] flex-shrink-0 mt-0.5">
                                        {isStreaming ? (
                                            <span className="animate-pulse-glow">⚡</span>
                                        ) : (
                                            "⚡"
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <FormattedResponse
                                            content={streamedContent}
                                            isStreaming={isStreaming}
                                            onFollowUpClick={(q) => setQuery(q)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sources */}
                        {sources.length > 0 && !isStreaming && (
                            <div className="mb-6 animate-fade-in">
                                <p className="text-[0.7rem] uppercase tracking-widest text-text-muted font-semibold mb-2.5">
                                    Sources
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {sources.map((source, i) => (
                                        <a
                                            key={i}
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[0.75rem] px-3 py-1.5 rounded-full bg-bg-tertiary border border-border-subtle text-accent-light hover:border-border-hover hover:bg-bg-hover transition-all duration-150 truncate max-w-[280px] no-underline inline-flex items-center gap-1.5"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                            {(() => {
                                                try { return new URL(source.url).hostname.replace("www.", ""); }
                                                catch { return source.url; }
                                            })()}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading indicator */}
                        {isStreaming && !streamedContent && (
                            <div className="flex items-center gap-3 py-8">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-[#6d28d9] flex items-center justify-center text-[0.7rem] flex-shrink-0">
                                    <span className="animate-pulse-glow">⚡</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse-glow" style={{ animationDelay: "0ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse-glow" style={{ animationDelay: "300ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse-glow" style={{ animationDelay: "600ms" }} />
                                    </div>
                                    <span className="text-sm text-text-muted">Searching the web...</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom input (shown when there's content) */}
            {hasContent && (
                <div className="flex-shrink-0 border-t border-border-subtle bg-bg-primary/80 backdrop-blur-sm p-4">
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={activeConversationId ? "Ask a follow-up..." : "Ask anything..."}
                                className="w-full py-3.5 pl-5 pr-14 rounded-2xl bg-bg-secondary border border-border-subtle text-text-primary text-sm outline-none transition-all duration-200 font-[Inter,system-ui,sans-serif] placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-glow)]"
                                disabled={isStreaming}
                            />
                            <button
                                type="submit"
                                disabled={isStreaming || !query.trim()}
                                className="absolute right-2.5 p-2 rounded-xl bg-gradient-to-br from-accent to-[#6d28d9] text-white border-none cursor-pointer transition-all duration-200 hover:shadow-[0_2px_12px_var(--color-accent-glow)] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    )
}

export default MainContent