
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = 'gemini-3-pro-preview';
      
      const config: any = {
        systemInstruction: 'You are Yuki, a helpful anime assistant. Use occasional Japanese suffixes. If search results are provided, cite them.',
        tools: [{ googleSearch: {} }]
      };

      if (useThinkingMode) {
        config.thinkingConfig = { thinkingBudget: 32768 };
      }

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: input,
        config: config
      });

      const modelText = response.text || "I'm sorry, I couldn't process that.";
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri || '#'
      })) || [];

      setMessages((prev) => [...prev, { 
        role: 'model', 
        text: modelText, 
        isThinking: useThinkingMode,
        groundingUrls: grounding.length > 0 ? grounding : undefined
      }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'model', text: "Gomenasai! Something went wrong with my circuits." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Chat with Yuki</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={useThinkingMode} 
            onChange={(e) => setUseThinkingMode(e.target.checked)}
            className="w-4 h-4 accent-pink-500"
          />
          <span className="text-sm text-gray-600 font-medium">Extra Thinking Mode 🧠</span>
        </label>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-pink-500 text-white rounded-tr-none' 
                : 'bg-white border border-pink-100 text-gray-800 rounded-tl-none'
            }`}>
              {msg.isThinking && <div className="text-[10px] uppercase tracking-widest text-pink-400 font-bold mb-1">Thoughtful Response</div>}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.groundingUrls && (
                <div className="mt-3 pt-3 border-t border-pink-50 text-xs text-gray-500">
                  <p className="font-bold mb-1">Sources:</p>
                  <ul className="space-y-1">
                    {msg.groundingUrls.map((link, idx) => (
                      <li key={idx}>
                        <a href={link.uri} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">
                          🔗 {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-pink-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="pt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Yuki anything..."
          className="flex-1 p-4 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/50 backdrop-blur-sm"
        />
        <button 
          onClick={handleSend}
          className="bg-pink-500 text-white px-6 py-4 rounded-2xl shadow-lg hover:bg-pink-600 active:scale-95 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
