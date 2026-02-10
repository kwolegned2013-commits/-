
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Notice } from '../types';
import { ChevronLeft, Calendar, User } from 'lucide-react';

const NoticeDetailPage: React.FC<{ notices: Notice[] }> = ({ notices }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notice = notices.find(n => n.id === id);

  if (!notice) return <div className="p-10 text-center">공지를 찾을 수 없습니다.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 font-bold text-sm">
        <ChevronLeft className="w-5 h-5 mr-1" /> 뒤로가기
      </button>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="space-y-3">
          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
            {notice.category}
          </span>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">{notice.title}</h1>
          <div className="flex items-center space-x-4 text-gray-400 text-xs border-b border-gray-50 pb-4">
            <div className="flex items-center"><User className="w-3 h-3 mr-1" /> {notice.author}</div>
            <div className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {notice.date}</div>
          </div>
        </div>

        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
          {notice.content}
        </div>
        
        {notice.imageUrl && (
          <img src={notice.imageUrl} alt="notice" className="w-full rounded-2xl shadow-sm" />
        )}
      </div>
    </div>
  );
};

export default NoticeDetailPage;
