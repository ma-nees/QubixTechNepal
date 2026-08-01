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

      {/* Floating Action Button */}
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
