
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Post } from '../types';
import { MessageSquare, Heart, Plus, MessageCircle, Sparkles, User as UserIcon, Share2 } from 'lucide-react';

interface CommunityPageProps {
  user: User;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ user, posts, setPosts }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'prayer' | 'talk'>('all');
  const [isPosting, setIsPosting] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'talk' as 'talk' | 'prayer' });

  const filteredPosts = posts.filter(p => activeTab === 'all' || p.category === activeTab);

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      authorId: user.id,
      authorName: user.name,
      category: newPost.category,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    setPosts([post, ...posts]);
    setIsPosting(false);
    setNewPost({ title: '', content: '', category: 'talk' });
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const getAvatarBg = (name: string) => {
    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500', 'bg-sky-500'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">소통 공간</h1>
          <p className="text-[11px] text-gray-400 font-bold mt-0.5">서로의 기도제목과 일상을 나눠요!</p>
        </div>
        <button 
          onClick={() => setIsPosting(true)}
          className="bg-indigo-600 text-white p-4 rounded-[20px] shadow-lg active:scale-90 transition-all hover:bg-indigo-700"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-200/50 p-1 rounded-[18px] backdrop-blur-sm sticky top-20 z-40">
        <TabButton label="전체" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
        <TabButton label="기도제목" active={activeTab === 'prayer'} onClick={() => setActiveTab('prayer')} />
        <TabButton label="자유수다" active={activeTab === 'talk'} onClick={() => setActiveTab('talk')} />
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <Link 
            key={post.id} 
            to={`/post/${post.id}`} 
            className={`block bg-white p-6 rounded-[28px] shadow-sm border ${
              post.category === 'prayer' ? 'border-amber-100 bg-amber-50/10' : 'border-gray-50'
            } transition-all active:scale-[0.98] group hover:shadow-md`}
          >
            <div className="flex items-center mb-5">
              <div className={`w-10 h-10 ${getAvatarBg(post.authorName)} rounded-[14px] flex items-center justify-center text-white font-black text-sm mr-3 shadow-sm`}>
                {post.authorName[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-800 flex items-center">
                  {post.authorName}
                  {post.category === 'prayer' && <Sparkles className="w-3 h-3 ml-1.5 text-amber-500" />}
                </p>
                <p className="text-[10px] text-gray-400 font-bold">{new Date(post.createdAt).toLocaleDateString()} · {post.category === 'prayer' ? '기도요청' : '자유수다'}</p>
              </div>
              <div className={`text-[10px] font-black px-3 py-1.5 rounded-full ${
                post.category === 'prayer' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-500'
              }`}>
                {post.category === 'prayer' ? '🙏 PRAY' : '💬 TALK'}
              </div>
            </div>

            <h3 className="font-black text-gray-900 text-lg mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed tracking-tight">{post.content}</p>

            <div className="flex items-center justify-between border-t border-gray-50 pt-5">
              <div className="flex items-center space-x-5">
                <button 
                  onClick={(e) => toggleLike(post.id, e)}
                  className="flex items-center space-x-1.5 text-gray-400 hover:text-rose-500 transition-colors group/btn"
                >
                  <div className="p-1.5 rounded-full group-hover/btn:bg-rose-50">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black">{post.likes}</span>
                </button>
                <div className="flex items-center space-x-1.5 text-gray-400">
                  <div className="p-1.5 rounded-full">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black">{post.comments.length}</span>
                </div>
              </div>
              <button className="p-1.5 text-gray-300 hover:text-indigo-500 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Write Modal */}
      {isPosting && (
        <div className="fixed inset-0 bg-gray-900/80 z-[100] flex items-end sm:items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tight text-gray-900">글쓰기</h2>
              <button 
                onClick={() => setIsPosting(false)} 
                className="bg-gray-100 p-2.5 rounded-full text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex bg-gray-100 p-1.5 rounded-[20px]">
                <button 
                  onClick={() => setNewPost({...newPost, category: 'talk'})} 
                  className={`flex-1 py-3 rounded-[16px] text-sm font-black transition-all ${newPost.category === 'talk' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                >
                  💬 자유수다
                </button>
                <button 
                  onClick={() => setNewPost({...newPost, category: 'prayer'})} 
                  className={`flex-1 py-3 rounded-[16px] text-sm font-black transition-all ${newPost.category === 'prayer' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-400'}`}
                >
                  🙏 기도제목
                </button>
              </div>

              <div className="space-y-4">
                <input 
                  placeholder="무슨 생각을 하고 있나요?"
                  className="w-full bg-gray-50 border-none rounded-[18px] py-4 px-6 text-base font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                />
                <textarea 
                  placeholder="함께 나누고 싶은 내용을 자세히 적어주세요..."
                  className="w-full h-48 bg-gray-50 border-none rounded-[22px] py-5 px-6 text-sm resize-none placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                />
              </div>

              <button 
                onClick={handleCreatePost}
                disabled={!newPost.title || !newPost.content}
                className={`w-full py-5 rounded-[22px] font-black shadow-xl active:scale-95 transition-all flex items-center justify-center ${
                  newPost.title && newPost.content ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5 mr-2" /> 게시글 등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-2.5 text-xs font-black rounded-[15px] transition-all ${
      active ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    {label}
  </button>
);

export default CommunityPage;
