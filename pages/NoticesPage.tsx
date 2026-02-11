
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Notice } from '../types';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';

interface NoticesPageProps {
  notices: Notice[];
}

const NoticesPage: React.FC<NoticesPageProps> = ({ notices }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-1">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 font-bold text-sm">
          <ChevronLeft className="w-5 h-5 mr-1" /> 뒤로가기
        </button>
      </div>

      <div className="flex flex-col space-y-2 px-1">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center">
          <Bell className="w-8 h-8 mr-3 text-indigo-600" /> 공지사항 전체보기
        </h1>
        <p className="text-gray-400 text-sm font-medium">우리 공동체의 새로운 소식들을 확인하세요.</p>
      </div>

      <div className="space-y-3">
        {notices.map(notice => (
          <Link 
            key={notice.id} 
            to={`/notice/${notice.id}`} 
            className="block bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:border-indigo-100 transition-all active:scale-[0.98] group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[9px] font-black px-3 py-1 rounded-full ${
                notice.category === 'event' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {notice.category.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-gray-300">{notice.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{notice.title}</h3>
              <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-300 transition-colors" />
            </div>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2 font-medium leading-relaxed">{notice.content}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NoticesPage;
