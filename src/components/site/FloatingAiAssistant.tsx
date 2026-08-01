import { useState } from "react";
import { Bot, X, Sparkles, Send, Minimize2 } from "lucide-react";

export function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[360px] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl transition-all animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Qubix AI Assistant</h3>
                <p className="text-[10px] text-primary-foreground/80">Typically replies instantly</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-primary-foreground/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <Minimize2 size={16} />
            </button>
          </div>
          
          <div className="h-[300px] overflow-y-auto p-4 bg-background">
            <div className="flex flex-col gap-4">
              {/* AI Message */}
              <div className="flex items-start gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles size={12} className="text-primary" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-surface border border-border px-4 py-2.5 text-xs text-ink shadow-sm">
                  Hi there! 👋 I'm the Qubix AI Assistant. How can I help you with your software or cloud infrastructure needs today?
                </div>
              </div>
              
              {/* Suggested Questions */}
              <div className="ml-8 flex flex-wrap gap-2 mt-2">
                <button className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10 hover:border-primary/50">
                  Explore Services
                </button>
                <button className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10 hover:border-primary/50">
                  Get a Quote
                </button>
                <button className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10 hover:border-primary/50">
                  Contact Team
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border bg-surface p-3">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="w-full rounded-full border border-border bg-background py-2.5 pl-4 pr-10 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <button className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/9779866291003"
        target="_blank"
        rel="noreferrer"
        className="group relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform duration-300 hover:scale-105 active:scale-95"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" className="fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Floating Action Button (AI Assistant) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lift transition-transform duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'rotate-90 scale-90' : 'rotate-0'}`}
      >
        {isOpen ? (
          <X size={24} className="transition-transform duration-300" />
        ) : (
          <Bot size={28} className="transition-transform duration-300 group-hover:scale-110" />
        )}
        
        {/* Sparkle effect on hover */}
        {!isOpen && isHovered && (
          <Sparkles size={14} className="absolute -top-1 -right-1 animate-pulse text-amber-300" />
        )}
      </button>
    </div>
  );
}
