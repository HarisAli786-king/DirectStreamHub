import { useEffect, useRef } from "react";

interface AdBannerProps { slot?: string; className?: string; }

// Adsterra banner script URL
const ADSTERRA_SCRIPT = "https://pl30415689.effectivecpmnetwork.com/0b/f8/28/0bf82845afa2bfca25e31711234c2122.js";

export default function AdBanner({ slot = "home", className = "" }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any previous ad content
    container.innerHTML = "";

    // Inject the Adsterra script safely
    const script = document.createElement("script");
    script.src = ADSTERRA_SCRIPT;
    script.async = true;
    script.type = "text/javascript";

    // Fallback flag — if the script doesn't render anything, show the placeholder
    let rendered = false;
    const observer = new MutationObserver(() => {
      if (container.children.length > 0) { rendered = true; observer.disconnect(); }
    });
    observer.observe(container, { childList: true, subtree: true });

    container.appendChild(script);

    const fallbackTimer = setTimeout(() => {
      observer.disconnect();
      if (!rendered && container.children.length <= 1) {
        container.innerHTML = "";
        const placeholder = document.createElement("div");
        placeholder.className = "text-white/30 text-xs tracking-widest uppercase text-center";
        placeholder.innerHTML = `Advertisement<div class="mt-2 text-white/20 text-[10px] normal-case tracking-normal">Ad slot: ${slot}</div>`;
        container.appendChild(placeholder);
      }
    }, 3000);

    return () => { clearTimeout(fallbackTimer); observer.disconnect(); };
  }, [slot]);

  return (
    <div
      ref={containerRef}
      data-ad-slot={slot}
      className={`w-full max-w-4xl mx-auto my-6 rounded-xl border border-white/5 bg-gradient-to-r from-base-card to-base-dark min-h-[90px] flex items-center justify-center overflow-hidden ${className}`}
    />
  );
}
