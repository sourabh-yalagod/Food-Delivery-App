import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Minimize2, Maximize2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef: any = useRef(null);
    const { userId } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput("");

        const userMessage = {
            id: Date.now(),
            text: userText,
            sender: "user",
        };

        const botId = Date.now() + 1;

        const botMessage = {
            id: botId,
            text: "",
            sender: "bot",
        };

        // Add BOTH messages immediately
        setMessages(prev => [...prev, userMessage, botMessage]);
        setIsLoading(true);

        try {
            console.log({ userId })
            const response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, query: userText }),
            });

            if (!response.body) {
                throw new Error("No response body");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let done = false;
            let accumulatedText = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;

                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedText += chunk;

                    setIsLoading(false);

                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === botId
                                ? { ...msg, text: accumulatedText } // NEW object
                                : msg
                        )
                    );
                }
            }
        } catch (err) {
            console.error(err);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === botId
                        ? { ...msg, text: "Error occurred. Please try again." }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };


    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Widget */}
            <div
                className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ease-out flex flex-col ${isOpen
                    ? 'w-full sm:w-96 h-96 sm:h-[500px]'
                    : 'w-16 h-16'
                    } ${isMinimized && isOpen ? 'h-16' : ''}`}
                style={{
                    maxWidth: 'calc(100vw - 24px)',
                }}
            >
                {/* Header */}
                <div className={`bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-4 text-white flex items-center justify-between cursor-pointer ${!isOpen && "hidden"}`}
                    onClick={() => isOpen && !isMinimized && setIsMinimized(!isMinimized)}
                >
                    {isOpen && (
                        <>
                            <div className="flex items-center gap-3 flex-1">
                                <MessageSquare size={20} />
                                <span className="font-semibold">Chat Assistant</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMinimized(!isMinimized);
                                    }}
                                    className="hover:bg-blue-600 p-1.5 rounded-lg transition"
                                >
                                    {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsOpen(false);
                                        setMessages([]);
                                    }}
                                    className="hover:bg-blue-600 p-1.5 rounded-lg transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Chat Area */}
                {isOpen && !isMinimized && (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <MessageSquare size={32} className="mb-2" />
                                    <p className="text-sm text-center">Start a conversation</p>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2.5 rounded-lg text-sm break-words ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 px-4 py-2.5 rounded-lg rounded-bl-none">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-2xl">
                            <div className="flex gap-2">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-24"
                                    rows={1}
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !input.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2.5 rounded-lg transition flex-shrink-0"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Floating Button */}
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-full h-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg transition flex items-center justify-center text-white"
                    >
                        <MessageSquare size={28} />
                    </button>
                )}
            </div>
        </div>
    );
}