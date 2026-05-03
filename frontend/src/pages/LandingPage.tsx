import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../../lib/client";

function LandingPage() {
  const [jwt, setJwt] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    async function getInfo() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();
      setJwt(session.data.session?.access_token || null);
      setIsAuthChecked(true);
    }
    getInfo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-8">
      {/* Background glow orbs */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[30%] -right-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Hero content */}
      <div className="text-center max-w-[720px] relative z-10">
        {/* Logo */}
        <div className="animate-float mb-6 inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-accent to-[#6d28d9] flex items-center justify-center text-[1.4rem] shadow-[0_4px_24px_rgba(124,58,237,0.4)]">
            ⚡
          </div>
        </div>

        <h1 className="gradient-text-hero text-[clamp(2.5rem,6vw,4.2rem)] font-extrabold leading-[1.1] mb-5 tracking-tight">
          Purplexity
        </h1>

        <p className="text-[clamp(1.05rem,2vw,1.3rem)] text-text-secondary leading-relaxed mb-10 max-w-[560px] mx-auto">
          AI-powered search that understands your questions and delivers
          real-time, sourced answers with precision.
        </p>

        {/* CTA */}
        <div className="flex gap-4 justify-center flex-wrap">
          {isAuthChecked && jwt ? (
            <Link to="/dashboard" className="no-underline">
              <button className="bg-gradient-to-br from-accent to-[#6d28d9] text-white border-none py-3.5 px-8 rounded-xl font-semibold text-base cursor-pointer transition-all duration-200 inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_var(--color-accent-glow)] active:translate-y-0">
                Dashboard
              </button>
            </Link>
          ) : (
            <Link to="/auth" className="no-underline">
              <button className="bg-gradient-to-br from-accent to-[#6d28d9] text-white border-none py-3.5 px-8 rounded-xl font-semibold text-base cursor-pointer transition-all duration-200 inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_var(--color-accent-glow)] active:translate-y-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Get Started
              </button>
            </Link>
          )}
        </div>

        {/* Feature pills */}
        <div className="flex gap-3 justify-center mt-14 flex-wrap">
          {[
            { icon: "🔍", label: "Web Search" },
            { icon: "⚡", label: "Real-time Streaming" },
            { icon: "📚", label: "Cited Sources" },
            { icon: "💬", label: "Follow-up Questions" },
          ].map((f) => (
            <div
              key={f.label}
              className="glass py-2.5 px-4.5 rounded-full text-sm text-text-secondary flex items-center gap-1.5"
            >
              <span>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
