
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Post, Comment } from '../types';
import { ChevronLeft, Heart, MessageCircle, Send, Share2, Check } from 'lucide-react';

interface PostDetailPageProps {
  user: User;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({ user, posts, setPosts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentInput, setCommentInput] = useState('');
  const [copied, setCopied] = useState(false);
  
  const post = posts.find(p => p.id === id);

  if (!post) return <div className="p-10 text-center">글을 찾을 수 없습니다.</div>;

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      authorName: user.name,
      content: commentInput,
      createdAt: new Date().toISOString()
    };
    setPosts(posts.map(p => p.id === post.id ? { ...p, comments: [...p.comments, newComment] } : p));
    setCommentInput('');
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="space-y-6 pb-48 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-1">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 font-bold text-sm">
          <ChevronLeft className="w-5 h-5 mr-1" /> 목록으로
        </button>
        <button 
          onClick={handleShare}
          className={`p-2 rounded-xl transition-all ${copied ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'}`}
        >
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        </button>
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg mr-4 shadow-sm">
            {post.authorName[0]}
          </div>
          <div className="flex-1">
            <h3 className="font-black text-gray-800 text-sm">{post.authorName}</h3>
            <p className="text-[10px] text-gray-400 font-bold tracking-tight">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${post.category === 'prayer' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-500'}`}>
            {post.category === 'prayer' ? '🙏 기도제목' : '💬 자유수다'}
          </span>
        </div>

        <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed text-[15px] whitespace-pre-wrap font-medium">{post.content}</p>

        <div className="flex items-center space-x-6 border-t border-gray-50 pt-6">
          <div className="flex items-center space-x-1.5 text-rose-500">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-sm font-black">{post.likes}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-indigo-400">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-black">{post.comments.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-gray-900 ml-2 flex items-center">
          댓글 <span className="ml-2 bg-indigo-50 text-indigo-600 px-3 py-0.5 rounded-full text-xs">{post.comments.length}</span>
        </h3>
        
        {post.comments.length === 0 ? (
          <div className="bg-white p-12 rounded-[32px] border border-gray-100 text-center space-y-3">
            <MessageCircle className="w-12 h-12 text-gray-100 mx-auto" />
            <p className="text-sm text-gray-300 font-black">아직 댓글이 없어요. 응원을 남겨주세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {post.comments.map(comment => (
              <div key={comment.id} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-gray-900 bg-gray-50 px-3 py-1 rounded-full">{comment.authorName}</span>
                  <span className="text-[10px] text-gray-300 font-bold">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium pl-1">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Comment Input Bar */}
      <div className="fixed bottom-24 left-0 right-0 px-4 z-40 animate-in slide-in-from-bottom duration-500">
        <div className="max-w-4xl mx-auto flex items-center space-x-2 bg-white/80 backdrop-blur-2xl p-3 rounded-[28px] border border-indigo-100 shadow-[0_15px_40px_rgba(79,70,229,0.15)]">
          <input 
            type="text" 
            placeholder="따뜻한 응원의 한마디..."
            className="flex-1 bg-gray-50/50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300 transition-all"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAddComment()}
          />
          <button 
            onClick={handleAddComment}
            disabled={!commentInput.trim()}
            className={`p-4 rounded-2xl active:scale-90 transition-all shadow-lg ${
              commentInput.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
