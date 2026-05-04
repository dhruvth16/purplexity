import type { User } from "@supabase/supabase-js";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/client";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { ENV } from "@/config/env";

interface Conversation {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  _count?: { messages: number };
}

interface Source {
  url: string;
}

interface Message {
  id: string;
  content: string;
  conversationId: string;
  createdAt: string;
}

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [streamedContent, setStreamedContent] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);
  const userScrolledRef = useRef(false);

  // ── Auth ──
  useEffect(() => {
    async function getInfo() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();
      setUser(user);
      setJwt(session.data.session?.access_token || null);
      setIsAuthChecked(true);
    }
    getInfo();
  }, []);

  // ── Fetch conversations ──
  const fetchConversations = useCallback(async () => {
    if (!jwt) return;
    try {
      const res = await axios.get(`${ENV.BACKEND_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const payload = res.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.conversations)
          ? payload.conversations
          : [];
      setConversations(list);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    }
  }, [jwt]);

  useEffect(() => {
    if (user && jwt) fetchConversations();
  }, [user, jwt, fetchConversations]);

  // ── Load conversation messages ──
  async function loadConversation(conversationId: string) {
    if (!jwt) return;
    setActiveConversationId(conversationId);
    setStreamedContent("");
    setSources([]);
    try {
      const res = await axios.get(
        `${ENV.BACKEND_URL}/api/conversations/${conversationId}`,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  }

  useEffect(() => {
    if (!isAuthChecked) return;
    if (!user || !jwt) {
      navigate("/auth");
    }
  }, [isAuthChecked, user, jwt, navigate]);

  // ── Auto-scroll logic ──
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      if (!atBottom && isStreaming) {
        userScrolledRef.current = true;
        autoScrollRef.current = false;
      }
      if (atBottom) {
        userScrolledRef.current = false;
        autoScrollRef.current = true;
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isStreaming]);

  useEffect(() => {
    if (autoScrollRef.current && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamedContent, messages]);

  // ── Stream a new query ──
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || !jwt || isStreaming) return;

    const currentQuery = query;
    setQuery("");
    setStreamedContent("");
    setSources([]);
    setIsStreaming(true);
    autoScrollRef.current = true;
    userScrolledRef.current = false;

    const isFollowUp = activeConversationId !== null;
    const endpoint = isFollowUp
      ? `${ENV.BACKEND_URL}/api/stream/follow_up`
      : `${ENV.BACKEND_URL}/api/stream`;

    const body: any = { query: currentQuery };
    if (isFollowUp) body.conversationId = activeConversationId;

    try {
      let fullText = "";

      await axios.post(endpoint, body, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        responseType: "text",
        onDownloadProgress: (progressEvent) => {
          const responseText = progressEvent.event?.target?.responseText || "";
          fullText = responseText;

          // Check if we've received the SOURCES block
          const sourcesMatch = fullText.match(
            /<SOURCES>\n([\s\S]*?)\n<\/SOURCES>/,
          );
          if (sourcesMatch) {
            try {
              const parsed = JSON.parse(sourcesMatch[1]!);
              setSources(parsed);
            } catch {}
            const contentBeforeSources = fullText.split("\n<SOURCES>")[0];
            setStreamedContent(contentBeforeSources!);
          } else {
            setStreamedContent(fullText);
          }
        },
      });
    } catch (error) {
      console.error("Stream error:", error);
      setStreamedContent("An error occurred while processing your request.");
    } finally {
      setIsStreaming(false);
      // Refresh conversations list
      await fetchConversations();
    }
  }

  // ── New chat ──
  function handleNewChat() {
    setActiveConversationId(null);
    setMessages([]);
    setStreamedContent("");
    setSources([]);
    setQuery("");
  }

  // ── Sign out ──
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate("/auth");
  }

  const hasContent = messages.length > 0 || streamedContent;

  return (
    <div className="h-screen flex overflow-hidden bg-bg-primary">
      {/* ─── Sidebar ─── */}

      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        handleNewChat={handleNewChat}
        conversations={conversations}
        loadConversation={loadConversation}
        activeConversationId={activeConversationId}
        handleSignOut={handleSignOut}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ─── Main content ─── */}
      <MainContent
        activeConversationId={activeConversationId}
        conversations={conversations}
        contentRef={contentRef}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        messages={messages}
        hasContent={hasContent}
        streamedContent={streamedContent}
        sources={sources}
        isStreaming={isStreaming}
      />
    </div>
  );
}

export default Dashboard;
