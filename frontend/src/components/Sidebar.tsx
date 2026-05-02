import type { User } from '@supabase/supabase-js';

interface SidebarProps {
    user: User | null;
    sidebarOpen: boolean;
    handleNewChat: () => void;
    conversations: any[];
    loadConversation: (conversationId: string) => void;
    activeConversationId: string | null;
    handleSignOut: () => void;
    setSidebarOpen: (open: boolean) => void;
}

function Sidebar({ user, sidebarOpen, handleNewChat, conversations, loadConversation, activeConversationId, handleSignOut, setSidebarOpen }: SidebarProps) {
    return (

        <aside
            className={`${sidebarOpen ? "w-full md:w-72" : "w-0"
                } flex-shrink-0 transition-all duration-300 overflow-hidden`}
        >
            <div className="w-72 h-full flex flex-col bg-bg-secondary border-r border-border-subtle">
                {/* Sidebar header */}
                <div className="p-4 flex items-center justify-between border-b border-border-subtle">
                    <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#6d28d9] flex items-center justify-center text-sm shadow-[0_2px_12px_rgba(124,58,237,0.3)]">
                            ⚡
                        </div>
                        <span className="font-semibold text-sm tracking-tight">Purplexity</span>
                    </div>
                    <div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 block md:hidden rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-all duration-150 cursor-pointer border-none bg-transparent"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* New chat button */}
                <div className="p-3">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl border border-border-subtle bg-transparent text-text-secondary text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary hover:border-border-hover"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        New Chat
                    </button>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto px-3 pb-3">
                    <p className="text-[0.7rem] uppercase tracking-widest text-text-muted font-semibold px-1 mb-2">
                        History
                    </p>
                    <div className="flex flex-col gap-0.5">
                        {conversations.length === 0 && (
                            <p className="text-xs text-text-muted px-2 py-4 text-center">
                                No conversations yet
                            </p>
                        )}
                        {conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => loadConversation(conv.id)}
                                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm cursor-pointer transition-all duration-150 truncate border-none ${activeConversationId === conv.id
                                    ? "bg-bg-tertiary text-text-primary font-medium"
                                    : "bg-transparent text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary"
                                    }`}
                            >
                                {conv.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* User info */}
                {user && (
                    <div className="p-3 border-t border-border-subtle">
                        <div className="flex items-center gap-3 p-2">
                            <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-xs font-semibold text-accent-light flex-shrink-0">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-text-primary truncate font-medium">
                                    {user.user_metadata?.name || user.email}
                                </p>
                                <p className="text-[0.65rem] text-text-muted truncate">
                                    {user.email}
                                </p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-bg-tertiary transition-all duration-150 cursor-pointer border-none bg-transparent"
                                title="Sign out"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}

export default Sidebar