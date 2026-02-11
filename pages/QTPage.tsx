
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { DAILY_VERSES } from '../constants';
import { generateQTReflection, getBibleHelp } from '../services/geminiService';
import { BookOpen, Sparkles, Send, Loader2, RefreshCw, MessageCircle, AlertCircle, Trash2, Smile, Compass, Heart } from 'lucide-react';

interface ChatMessage {
  type: 'user' | 'ai';
  text: string;
  time: string;
}

const SUGGESTIONS = [
  { icon: <Compass className="w-3.5 h-3.5" />, label: "성경 읽는 법 알려줘" },
  { icon: <Heart className="w-3.5 h-3.5" />, label: "친구 관계가 힘들어요" },
  { icon: <Smile className="w-3.5 h-3.5" />, label: "오늘 구절을 더 쉽게 설명해줘" },
  { icon: <BookOpen className="w-3.5 h-3.5" />, label: "하나님은 누구신가요?" }
];

const QTPage: React.FC<{ user: User }> = ({ user }) => {
  const [verse] = useState(DAILY_VERSES[Math.floor(Math.random() * DAILY_VERSES.length)]);
  const [reflection, setReflection] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReflection = async () => {
    setLoading(true);
    setError(null);
    try {
      const text = await generateQTReflection(verse.text, verse.reference);
      setReflection(text);
    } catch (err) {
      console.error(err);
      setError('AI 묵상을 가져오는 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReflection();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, chatLoading]);

  const handleSendChat = async (text: string = chatInput) => {
    const messageText = text.trim();
    if (!messageText || chatLoading) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = { type: 'user', text: messageText, time: timeStr };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const aiMsgText = await getBibleHelp(messageText);
      const aiMsg: ChatMessage = { 
        type: 'ai', 
        text: aiMsgText, 
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) 
      };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: '죄송해요, 답변을 준비하는 중에 오류가 발생했습니다. 다시 한번 물어봐줄래?',
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    setChatLoading(false);
  };

  const clearChat = () => {
    if (window.confirm('지금까지의 대화 내용을 모두 지울까요?')) {
      setChatHistory([]);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-48">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">오늘의 묵상</h1>
          <p className="text-[11px] text-gray-400 font-bold mt-0.5 uppercase tracking-wider">Daily Spiritual Journey</p>
        </div>
        <button 
          onClick={fetchReflection}
          className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 hover:rotate-180 transition-transform duration-700 shadow-sm"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Scripture Card */}
      <div className="bg-white rounded-[36px] overflow-hidden shadow-sm border border-gray-100 group relative">
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
          <Sparkles className="absolute top-[-20px] right-[-20px] w-40 h-40 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 space-y-2">
            <h2 className="text-[10px] font-black flex items-center uppercase tracking-[0.2em] opacity-80">
              <BookOpen className="w-4 h-4 mr-2" /> Holy Scripture
            </h2>
            <p className="text-2xl font-black">{verse.reference}</p>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="text-center py-4">
            <p className="text-xl font-bold text-gray-900 leading-relaxed italic">
              "{verse.text}"
            </p>
          </div>
          
          <div className="pt-8 border-t border-gray-50">
            <div className="flex items-center space-x-2 text-indigo-600 mb-6">
              <div className="bg-indigo-50 p-2 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg">AI 묵상 선생님의 조언</h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">성령의 지혜를 구하는 중...</p>
              </div>
            ) : error ? (
              <div className="bg-rose-50 p-8 rounded-[28px] border border-rose-100 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <p className="text-sm text-rose-600 font-bold">{error}</p>
                <button onClick={fetchReflection} className="bg-rose-500 text-white px-6 py-2.5 rounded-2xl text-xs font-black">다시 시도</button>
              </div>
            ) : (
              <div className="text-gray-700 space-y-6 text-[15px] leading-loose font-medium bg-gray-50/50 p-7 rounded-[28px] border border-gray-100">
                {reflection.split('\n').map((line, i) => (
                   <p key={i} className={line.match(/^\d\./) ? 'font-black text-indigo-600 text-base mt-6 first:mt-0' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bible Chat Section - Enhanced Version */}
      <div className="bg-white rounded-[36px] p-0 border border-indigo-100 shadow-xl flex flex-col overflow-hidden h-[600px]">
        {/* Header */}
        <div className="bg-indigo-600 p-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-xl mr-3">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">성경 멘토 AI</h3>
              <p className="text-[9px] text-indigo-200 font-bold">궁금한 건 무엇이든 물어봐!</p>
            </div>
          </div>
          {chatHistory.length > 0 && (
            <button 
              onClick={clearChat}
              className="p-2 text-indigo-200 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Chat Content */}
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
          >
            {chatHistory.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center space-y-6 px-6 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-[30px] flex items-center justify-center animate-bounce duration-[3000ms]">
                  <MessageCircle className="w-10 h-10 text-indigo-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-800 font-black">궁금한 점이 있나요?</p>
                  <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                    "하나님은 왜 세상을 만드셨나요?" <br/>
                    "오늘 구절의 의미가 궁금해요"
                  </p>
                </div>
              </div>
            )}
            
            {chatHistory.map((chat, i) => (
              <div key={i} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex flex-col space-y-1 ${chat.type === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  <div className={`px-5 py-3.5 rounded-[22px] text-sm font-bold shadow-sm leading-relaxed ${
                    chat.type === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    {chat.text}
                  </div>
                  <span className="text-[8px] text-gray-300 font-black px-1 uppercase">{chat.time}</span>
                </div>
              </div>
            ))}
            
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-3.5 rounded-[22px] rounded-tl-none border border-gray-100 shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-indigo-50">
            {chatHistory.length === 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTIONS.map((s, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSendChat(s.label)}
                    className="flex items-center space-x-1.5 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black hover:bg-indigo-100 transition-colors shadow-sm active:scale-95"
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="relative">
              <input 
                type="text"
                placeholder="질문을 입력하세요..."
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 pr-14 transition-all placeholder:text-gray-300"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendChat()}
              />
              <button 
                onClick={() => handleSendChat()}
                disabled={chatLoading || !chatInput.trim()}
                className="absolute right-2 top-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-300 transition-all shadow-lg active:scale-90"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QTPage;
