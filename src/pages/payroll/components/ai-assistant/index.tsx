import React from 'react';
import { Bot, Send, Loader2, X, MessageSquare } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import type { AIAssistantProps } from './types';

/**
 * Componente flotante del Asistente Auditor AI para consultas interactivas con tipado estricto y control de visibilidad.
 */
export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  messages, input, setInput, onSend, isLoading, isOpen, onToggle 
}) => {
  if (!isOpen) {
    return (
      <button 
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 group"
      >
        <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 animate-in slide-in-from-bottom-4 duration-300">
      <Card className="shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <Bot size={18} className="text-indigo-500" />
            </div>
            <span className="dark:text-white">Asistente Auditor AI</span>
          </div>
          <button 
            onClick={onToggle}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="h-64 overflow-y-auto p-4 space-y-3 dark:bg-slate-900/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-2xl">
                <Loader2 size={14} className="animate-spin text-slate-400" />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 bg-white dark:bg-slate-900">
          <input
            className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all dark:text-white"
            placeholder="Pregunta sobre la nómina..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isLoading && onSend()}
          />
          <Button size="sm" onClick={onSend} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
