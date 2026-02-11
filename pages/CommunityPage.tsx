
import React, { useState, useEffect, useRef } from 'react';
import { User, Post, AppNotification } from '../types';
import { Heart, Send, Sparkles, MessageCircle, MoreVertical, Trash2, Smile, Users } from 'lucide-react';

interface CommunityPageProps {
  user: User;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ user, posts, setPosts, setNotifications }) => {
  const [activeTab, setActiveTab] = useState<'talk' | 'prayer'>('talk');
  const [messageInput, setMessageInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const filteredPosts = posts
    .filter(p => p.category === activeTab)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredPosts, activeTab]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      title: messageInput.trim().slice(0, 20),
      content: messageInput.trim(),
      authorId: user.id,
      authorName: user.name,
      category: activeTab,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    setPosts(prev => [...prev, newPost]);

    // 알림 추가 (실시간 시뮬레이션)
    const newNoti: AppNotification = {
      id: Date.now().toString(),
      type: 'community',
      title: activeTab === 'prayer' ? '새로운 기도제목 🙏' : '새로운 수다글 💬',
      message: `${user.name}님이 메시지를 남겼습니다: "${messageInput.trim().slice(0, 15)}..."`,
      link: '/community',
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNoti, ...prev]);

    setMessageInput('');
  };

  const deletePost = (id: string) => {
    if (window.confirm("메시지를 삭제하시겠습니까?")) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const getAvatarBg = (name: string) => {
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500', 'bg-purple-500', 'bg-sky-500'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-140px)] rounded-[32px] overflow-hidden border shadow-sm transition-colors duration-500 ${
      activeTab === 'prayer' ? 'bg-[#fffae0] border-amber-100' : 'bg-[#e2e8f0] border-gray-100'
    }`}>
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-inherit z-10">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${activeTab === 'prayer' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
            {activeTab === 'prayer' ? <Sparkles className="w-5 h-5" /> : <Users className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">{activeTab === 'prayer' ? '중보기도방 🙏' : '자유수다방 💬'}</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">
              {activeTab === 'prayer' ? 'Pray Together' : 'Talk with Friends'}
            </p>
          </div>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('talk')}
            className={`px-4 py-1.5 text-[11px] font-black rounded-lg transition-all ${activeTab === 'talk' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
          >
            수다
          </button>
          <button 
            onClick={() => setActiveTab('prayer')}
            className={`px-4 py-1.5 text-[11px] font-black rounded-lg transition-all ${activeTab === 'prayer' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-400'}`}
          >
            기도
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-hide">
        {filteredPosts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale space-y-2">
            <MessageCircle className="w-16 h-16" />
            <p className="text-sm font-black">대화를 시작해보세요!</p>
          </div>
        ) : (
          filteredPosts.map((post, idx) => {
            const isMe = post.authorId === user.id;
            const prevPost = idx > 0 ? filteredPosts[idx-1] : null;
            const showIdentity = !isMe && (!prevPost || prevPost.authorId !== post.authorId);
            
            return (
              <div key={post.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {showIdentity && (
                  <div className="flex items-center space-x-2 mb-1.5 ml-1">
                    <div className={`w-7 h-7 ${getAvatarBg(post.authorName)} rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-sm`}>
                      {post.authorName[0]}
                    </div>
                    <span className="text-[12px] font-black text-gray-700">{post.authorName}</span>
                  </div>
                )}
                
                <div className={`flex items-end space-x-1.5 ${isMe ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  <div className={`max-w-[70vw] px-4 py-2.5 rounded-[18px] text-sm font-semibold shadow-sm leading-relaxed ${
                    isMe 
                      ? (activeTab === 'prayer' ? 'bg-amber-400 text-white rounded-tr-none' : 'bg-indigo-600 text-white rounded-tr-none')
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    {post.content}
                  </div>
                  
                  <div className="flex flex-col items-center justify-end h-full pb-0.5">
                    {post.likes > 0 && (
                      <span className="text-[9px] font-black text-rose-500 bg-white/50 px-1.5 py-0.5 rounded-full mb-1">❤️ {post.likes}</span>
                    )}
                    <span className="text-[8px] text-gray-400 font-bold opacity-60">
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {isMe && (
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-white p-4 border-t border-inherit">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative flex items-center bg-gray-50 rounded-[22px] px-4 py-1.5 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <button className="p-1.5 text-gray-400 hover:text-indigo-600 active:scale-90 transition-transform">
              <Smile className="w-5 h-5" />
            </button>
            <textarea 
              rows={1}
              placeholder={activeTab === 'prayer' ? "기도 제목을 나눠요..." : "메시지를 입력하세요"}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold py-2 resize-none max-h-32 scrollbar-hide"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className={`p-3.5 rounded-full transition-all shadow-lg active:scale-90 ${
              messageInput.trim() 
                ? (activeTab === 'prayer' ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white')
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[8px] text-gray-300 font-black mt-3 uppercase tracking-[0.3em] opacity-50">
          WE Youth Community Space
        </p>
      </div>
    </div>
  );
};

export default CommunityPage;
