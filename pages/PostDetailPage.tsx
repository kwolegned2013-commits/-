
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Post, Comment } from '../types';
import { ChevronLeft, Heart, MessageCircle, Send, User as UserIcon } from 'lucide-react';

interface PostDetailPageProps {
  user: User;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({ user, posts, setPosts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentInput, setCommentInput] = useState('');
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

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 font-bold text-sm">
        <ChevronLeft className="w-5 h-5 mr-1" /> 목록으로
      </button>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black mr-3">
            {post.authorName[0]}
          </div>
          <div>
            <h3 className="font-black text-gray-800">{post.authorName}</h3>
            <p className="text-[10px] text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <h1 className="text-xl font-black text-gray-900">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center space-x-4 border-t border-gray-50 pt-4">
          <div className="flex items-center space-x-1.5 text-red-500">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-xs font-black">{post.likes}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-black">{post.comments.length}</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h3 className="font-black text-gray-800 ml-1 flex items-center">
          댓글 <span className="ml-2 text-indigo-600">{post.comments.length}</span>
        </h3>
        
        {post.comments.map(comment => (
          <div key={comment.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-gray-800">{comment.authorName}</span>
              <span className="text-[9px] text-gray-300">{new Date(comment.createdAt).toLocaleTimeString()}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-24 left-0 right-0 px-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-2 bg-white/80 backdrop-blur-lg p-2 rounded-2xl border border-gray-100 shadow-lg">
          <input 
            type="text" 
            placeholder="따뜻한 댓글을 남겨주세요!"
            className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-xs focus:ring-0"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAddComment()}
          />
          <button 
            onClick={handleAddComment}
            className="bg-indigo-600 text-white p-3 rounded-xl active:scale-90 transition-transform shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
