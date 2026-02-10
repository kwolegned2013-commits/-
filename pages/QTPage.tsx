
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { DAILY_VERSES } from '../constants';
import { generateQTReflection, getBibleHelp } from '../services/geminiService';
import { BookOpen, Sparkles, Send, Loader2, RefreshCw } from 'lucide-react';

const QTPage: React.FC<{ user: User }> = ({ user }) => {
  const [verse] = useState(DAILY_VERSES[0]);
  const [reflection, setReflection] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'ai', text: string }[]>([]);

  const fetchReflection = async () => {
    setLoading(true);
    const text = await generateQTReflection(verse.text, verse.reference);
    setReflection(text || '');
    setLoading(false);
  };

  useEffect(() => {
    fetchReflection();
  }, []);

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);
    const aiMsg = await getBibleHelp(userMsg);
    setChatHistory(prev => [...prev, { type: 'ai', text: aiMsg || '' }]);
    setChatLoading(false);
  };

  return (
    <div className="p-4 space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">오늘의 묵상</h1>
        <button 
          onClick={fetchReflection}
          className="text-indigo-600 hover:rotate-180 transition-transform duration-500"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Daily Verse Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="bg-indigo-600 p-4 text-white">
          <h2 className="text-sm font-bold flex items-center">
            <BookOpen className="w-4 h-4 mr-2" /> {verse.reference}
          </h2>
        </div>
        <div className="p-6">
          <p className="text-xl font-bold text-gray-900 leading-relaxed mb-4 italic text-center">
            "{verse.text}"
          </p>
          
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">AI 묵상 가이드</h3>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-sm text-gray-500">성령의 지혜를 구하는 중...</p>
              </div>
            ) : (
              <div className="text-gray-700 space-y-4 text-sm leading-loose">
                {reflection.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') ? 'font-bold mt-4' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bible Chat Section */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <h3 className="font-bold text-indigo-900 mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" /> 성경 질문하기
        </h3>
        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
          {chatHistory.length === 0 && (
            <p className="text-sm text-indigo-400 italic">"성경을 읽다가 궁금한 점이 있나요? 편하게 물어보세요!"</p>
          )}
          {chatHistory.map((chat, i) => (
            <div key={i} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                chat.type === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-indigo-100 rounded-tl-none'
              }`}>
                {chat.text}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-indigo-100">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <input 
            type="text"
            placeholder="예: 하나님은 왜 선악과를 만드셨나요?"
            className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendChat()}
          />
          <button 
            onClick={handleSendChat}
            disabled={chatLoading}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
);

export default QTPage;
