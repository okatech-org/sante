import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { FileText, User, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const IAstedTranscript = () => {
  const { messages, state } = useVoiceInteraction();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-100 rounded-lg">
            <FileText className="w-5 h-5 text-zinc-700" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900">Transcription</h3>
            <p className="text-xs text-zinc-500">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Transcript Content */}
      <ScrollArea className="flex-1 bg-white">
        <div className="p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="p-4 bg-zinc-50 rounded-full mb-4">
                <FileText className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-900 mb-1">
                Aucune conversation
              </p>
              <p className="text-xs text-zinc-500 max-w-xs">
                Commencez une conversation vocale ou écrivez un message pour voir la transcription
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div key={index} className="space-y-2">
                  {/* Speaker Header */}
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-100' 
                        : 'bg-purple-100'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-3.5 h-3.5 text-blue-700" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-purple-700" />
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${
                      message.role === 'user' 
                        ? 'text-blue-700' 
                        : 'text-purple-700'
                    }`}>
                      {message.role === 'user' ? 'Ministre' : 'iAsted'}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {format(new Date(), 'HH:mm', { locale: fr })}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="pl-8">
                    <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>

                  {/* Divider */}
                  {index < messages.length - 1 && (
                    <div className="h-px bg-zinc-100 my-4" />
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {state === 'thinking' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-100">
                      <Bot className="w-3.5 h-3.5 text-purple-700" />
                    </div>
                    <span className="text-xs font-semibold text-purple-700">
                      iAsted
                    </span>
                    <span className="text-xs text-zinc-400">En cours...</span>
                  </div>
                  <div className="pl-8">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                           style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                           style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                           style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      {messages.length > 0 && (
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>
              Session en cours
            </span>
            <span>
              {messages.filter(m => m.role === 'user').length} questions · {messages.filter(m => m.role === 'assistant').length} réponses
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
