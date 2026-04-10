'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { getChatMessages, sendChatMessage, subscribeToChat } from '@/services/chat';
import type { UserProfile, RetaChatMessage } from '@/types';

interface ChatWindowProps {
  retaId: string;
  user: UserProfile | null;
}

export function ChatWindow({ retaId, user }: ChatWindowProps) {
  const [messages, setMessages] = useState<RetaChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHistory() {
      const { data } = await getChatMessages(retaId);
      if (data) setMessages(data);
      setLoading(false);
    }

    loadHistory();

    const subscription = subscribeToChat(retaId, (message) => {
      setMessages((prev) => {
        // Evitar duplicados si el mensaje ya fue agregado por el envío local (optimista parcial)
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [retaId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user) return;

    const content = newMessage.trim();
    setNewMessage('');

    const result = await sendChatMessage(retaId, user.id, content);
    if (!result.data) {
      // Opcional: Manejar error (ej. mostrar alerta o revertir)
      console.error('Error al enviar mensaje');
    }
  };

  return (
    <section className="bg-surface-container flex flex-col h-[400px] border border-outline-variant shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high shrink-0">
        <h3 className="font-headline font-black uppercase tracking-tight text-sm">
          CHAT DE LA RETA
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-primary uppercase animate-pulse">En vivo</span>
          <span className="w-2 h-2 bg-primary rounded-full" />
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-container-lowest"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs font-bold uppercase animate-pulse">Cargando Chat...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 select-none">
            <p className="text-sm font-black uppercase">¡Silencio en la cancha!</p>
            <p className="text-[10px] uppercase font-bold text-center">Sé el primero en decir algo</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!isMe && (
                    <span className="text-[10px] font-black text-primary uppercase">
                      @{msg.users?.username ?? 'usuario'}
                    </span>
                  )}
                  <span className="text-[8px] font-bold text-on-surface-variant/50">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] px-3 py-2 text-xs font-bold ${
                    isMe
                      ? 'bg-primary text-on-primary rounded-l-lg rounded-tr-lg border-b-2 border-r-2 border-primary-container'
                      : 'bg-surface-container-highest text-on-surface rounded-r-lg rounded-tl-lg border-b-2 border-l-2 border-outline'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSendMessage}
        className="p-3 bg-surface-container-high flex gap-2 border-t border-outline-variant"
      >
        <input
          className="flex-1 bg-surface-container-lowest border-2 border-outline-variant focus:border-primary text-xs font-bold px-4 py-2 focus:outline-none transition-colors"
          placeholder="ESCRIBE UN MENSAJE..."
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button 
          type="submit"
          className="bg-primary text-on-primary px-4 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-neo-sm active:scale-95 disabled:opacity-50"
          disabled={!newMessage.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
}
