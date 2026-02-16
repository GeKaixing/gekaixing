'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AIChatPage() {
    const [input, setInput] = useState('');
    const {
        messages,
        sendMessage,
        status,
        error
    } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
    })

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || status !== 'ready') return;
        
        const userInput = input;
        setInput('');
        
        await sendMessage({ text: userInput });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
            <header className="p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-center gap-2 shadow-sm">
                <Sparkles className="text-blue-500 w-5 h-5" />
                <h1 className="font-bold text-lg text-gray-800">Next.js 16 AI Explorer</h1>
            </header>

            <main
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6"
            >
                {messages.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                        <div className="p-4 bg-white rounded-full shadow-inner">
                            <Bot className="w-12 h-12 opacity-20" />
                        </div>
                        <p className="text-sm">你好！我是 AI 助手，有什么可以帮你的吗？</p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
                        出现错误：{error.message}，请检查 API Key 或网络连接。
                    </div>
                )}

                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}
                    >
                        <div className={`flex-shrink-0 p-2 rounded-xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm text-gray-600'
                            }`}>
                            {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>

                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed ${m.role === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white border border-gray-100 rounded-tl-none text-gray-800'
                            }`}>
                            {(m as any).text || ''}
                        </div>
                    </div>
                ))}

                {status === 'streaming' && (
                    <div className="flex gap-3 items-center text-gray-400 animate-pulse pl-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                )}
            </main>

            <footer className="p-4 bg-white border-t border-gray-100">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-4xl mx-auto flex gap-2 items-center"
                >
                    <div className="relative flex-1">
                        <input
                            className="w-full p-4 pr-12 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={input}
                            placeholder="输入消息..."
                            onChange={(e) => setInput(e.target.value)}
                            disabled={status !== 'ready'}
                        />
                        <button
                            type="submit"
                            disabled={status !== 'ready' || !input?.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all shadow-md active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
}