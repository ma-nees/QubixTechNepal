import { useState, useRef, useEffect } from "react";
import { Bot, X, Sparkles, Send, Minimize2, Loader2, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWaOpen, setIsWaOpen] = useState(false);
  
  const { user } = useAuth();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1) {
        const greeting = user?.name 
          ? `Hi ${user.name.split(" ")[0]}! 👋 I'm the Qubix AI Assistant. How can I help you today?` 
          : `Hi there! 👋 I'm the Qubix AI Assistant. How can I help you with your software or cloud infrastructure needs today?`;
        return [{ role: "assistant", content: greeting }];
      }
      return prev;
    });
  }, [user?.name]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const contacts = [
    { label: "+977 986-6291003", phone: "9779866291003" },
    { label: "+977 986-3479066", phone: "9779863479066" },
  ];
  const waMessage = encodeURIComponent("Hello Qubix Tech Nepal! I'd like to discuss a project.");

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const newUserMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, newUserMsg];
    
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const systemMessage: Message = {
        role: "system",
        content: `You are the AI Assistant for Qubix Tech Nepal.${user?.name ? ` You are currently talking to a user named ${user.name}. Greet them personally if it makes sense.` : ''} Be concise, friendly, and helpful. You answer questions about Qubix's software development, SaaS, and cloud infrastructure services. 
        
IMPORTANT: Guide users to the correct pages on our website based on their questions:
- If they want to see our previous work, past projects, or case studies, tell them to visit our Portfolio page at /portfolio
- If they want to get a quote, hire us, or send a message, tell them to visit our Contact page at /contact
- If they want to learn more about the team or company, tell them to visit the About page at /about

When listing items, use bullet points. Otherwise, use short paragraphs. Keep your formatting clean and readable for a small chat interface.`
      };

      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [systemMessage, ...updatedMessages.map(m => ({ role: m.role, content: m.content }))]
        })
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { role: "assistant", content: botResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[360px] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl transition-all animate-in slide-in-from-bottom-4 fade-in duration-300 flex flex-col h-[450px]">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Qubix AI Assistant</h3>
                <p className="text-[10px] text-primary-foreground/80">Powered by Mistral AI</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-primary-foreground/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <Minimize2 size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-background">
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-ink text-surface' : 'bg-primary/10 text-primary'}`}>
                    {msg.role === 'user' ? <User size={12} /> : <Sparkles size={12} />}
                  </div>
                  <div className={`rounded-2xl px-4 py-2.5 text-xs shadow-sm max-w-[85%] break-words whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'rounded-tr-none bg-ink text-surface' 
                      : 'rounded-tl-none bg-surface border border-border text-ink'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles size={12} className="text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-surface border border-border px-4 py-2.5 text-xs text-ink shadow-sm flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Quick Actions (only show if no user messages yet to save space) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 bg-background shrink-0">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleSend("Tell me about your SaaS solutions")} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/10">
                  SaaS Solutions
                </button>
                <button onClick={() => handleSend("How can I get a quote?")} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/10">
                  Get a Quote
                </button>
              </div>
            </div>
          )}
          
          <div className="border-t border-border bg-surface p-3 shrink-0">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..." 
                className="w-full rounded-full border border-border bg-background py-2.5 pl-4 pr-10 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                disabled={isLoading}
              />
              <button 
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Button and Popup */}
      <div className="relative flex flex-col items-end mb-3">
        {isWaOpen && (
          <div className="mb-2 flex max-w-[calc(100vw-2rem)] flex-col gap-1.5 rounded-2xl border border-border bg-surface p-2.5 shadow-xl sm:p-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <p className="px-1 text-xs font-semibold text-ink">Chat with us</p>
            {contacts.map((c) => (
              <a
                key={c.phone}
                href={`https://wa.me/${c.phone}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink sm:text-sm"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" className="fill-[#25D366] shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>{c.label}</span>
            </a>
          ))}
        </div>
        )}
        <button 
          onClick={() => setIsWaOpen(!isWaOpen)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform duration-300 hover:scale-105 active:scale-95"
          title="Chat on WhatsApp"
        >
          {isWaOpen ? (
            <X size={24} className="transition-transform duration-300" />
          ) : (
            <svg viewBox="0 0 24 24" width="28" height="28" className="fill-white transition-transform duration-300 group-hover:scale-110">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Greeting Tooltip */}
      {!isOpen && showGreeting && (
        <div className="absolute bottom-2 right-16 mr-2 w-48 rounded-2xl rounded-br-sm bg-surface p-3 text-xs text-ink shadow-xl border border-border animate-in slide-in-from-right-4 fade-in duration-500">
          <button 
            onClick={() => setShowGreeting(false)} 
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-ink transition-colors"
          >
            <X size={10} />
          </button>
          <div className="flex items-start gap-2">
            <span className="text-xl">👋</span>
            <p className="font-medium leading-relaxed">
              {user?.name ? `Hi ${user.name.split(" ")[0]}! ` : "Hi there! "} 
              I'm the Qubix AI Assistant. Need any help?
            </p>
          </div>
        </div>
      )}

      {/* Floating Action Button (AI Assistant) */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowGreeting(false);
        }}
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
