
import React, { useState } from 'react';
import { User, Post } from '../types';
import { INITIAL_POSTS } from '../constants';
import { MessageSquare, Heart, Share2, Plus, Filter, MessageCircle, Send } from 'lucide-react';

const CommunityPage: React.FC<{ user: User }> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
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
      likes: 0
    };
    setPosts([post, ...posts]);
    setIsPosting(false);
    setNewPost({ title: '', content: '', category: 'talk' });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">커뮤니티</h1>
        <button 
          onClick={() => setIsPosting(true)}
          className="bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
        <TabButton label="전체" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
        <TabButton label="기도제목" active={activeTab === 'prayer'} onClick={() => setActiveTab('prayer')} />
        <TabButton label="자유게시판" active={activeTab === 'talk'} onClick={() => setActiveTab('talk')} />
      </div>

      {/* Post Modal */}
      {isPosting && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">새 글 작성</h2>
              <button onClick={() => setIsPosting(false)} className="text-gray-400"><Plus className="w-6 h-6 rotate-45" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">카테고리</label>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setNewPost({...newPost, category: 'talk'})}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium ${newPost.category === 'talk' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                  >자유수다</button>
                  <button 
                    onClick={() => setNewPost({...newPost, category: 'prayer'})}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium ${newPost.category === 'prayer' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                  >기도제목</button>
                </div>
              </div>
              <input 
                placeholder="제목을 입력하세요"
                className="w-full border-b border-gray-200 py-3 text-lg font-bold focus:outline-none focus:border-indigo-500"
                value={newPost.title}
                onChange={e => setNewPost({...newPost, title: e.target.value})}
              />
              <textarea 
                placeholder="내용을 입력하세요..."
                className="w-full h-40 resize-none py-2 text-gray-700 focus:outline-none"
                value={newPost.content}
                onChange={e => setNewPost({...newPost, content: e.target.value})}
              />
              <button 
                onClick={handleCreatePost}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg"
              >
                게시하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs mr-3">
                {post.authorName[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{post.authorName}</p>
                <p className="text-[10px] text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="ml-auto">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  post.category === 'prayer' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {post.category === 'prayer' ? '🙏 기도' : '💬 수다'}
                </span>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>
            <div className="flex items-center space-x-6 border-t border-gray-50 pt-4">
              <button className="flex items-center space-x-1.5 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-xs font-semibold">{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1.5 text-gray-400 hover:text-indigo-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs font-semibold">댓글</span>
              </button>
              <button className="flex items-center space-x-1.5 text-gray-400 ml-auto">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
      active ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

export default CommunityPage;
