
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Notice, Participation } from '../types';
import { ChevronLeft, Calendar, User as UserIcon, CheckCircle, Sparkles, Send } from 'lucide-react';

interface NoticeDetailPageProps {
  user: User;
  notices: Notice[];
  participations: Participation[];
  setParticipations: React.Dispatch<React.SetStateAction<Participation[]>>;
}

const NoticeDetailPage: React.FC<NoticeDetailPageProps> = ({ user, notices, participations, setParticipations }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  
  const notice = notices.find(n => n.id === id);
  if (!notice) return <div className="p-10 text-center">공지를 찾을 수 없습니다.</div>;

  const alreadyApplied = participations.some(p => p.noticeId === notice.id && p.userId === user.id);

  const handleApply = () => {
    if (alreadyApplied || isApplying) return;
    
    setIsApplying(true);
    
    // 로딩 시뮬레이션
    setTimeout(() => {
      const newParticipation: Participation = {
        id: Date.now().toString(),
        noticeId: notice.id,
        noticeTitle: notice.title,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        appliedAt: new Date().toISOString(),
        isRead: false
      };
      
      setParticipations(prev => [newParticipation, ...prev]);
      setIsApplying(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 font-bold text-sm">
        <ChevronLeft className="w-5 h-5 mr-1" /> 뒤로가기
      </button>

      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="space-y-4">
          <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
            notice.category === 'event' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {notice.category}
          </span>
          <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{notice.title}</h1>
          <div className="flex items-center space-x-4 text-gray-400 text-[11px] font-bold border-b border-gray-50 pb-6">
            <div className="flex items-center"><UserIcon className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> {notice.author}</div>
            <div className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> {notice.date}</div>
          </div>
        </div>

        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] font-medium py-2">
          {notice.content}
        </div>
        
        {notice.imageUrl && (
          <img src={notice.imageUrl} alt="notice" className="w-full rounded-[24px] shadow-sm border border-gray-50" />
        )}

        {/* Participation Button Section */}
        {notice.category === 'event' && (
          <div className="pt-8 border-t border-gray-50">
            {alreadyApplied ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-[24px] p-6 flex flex-col items-center text-center space-y-2 animate-in zoom-in duration-500">
                <CheckCircle className="w-10 h-10 text-emerald-500 mb-1" />
                <h3 className="font-black text-emerald-900">신청이 완료되었습니다!</h3>
                <p className="text-[11px] text-emerald-600 font-bold">관리자 선생님이 곧 확인하실 예정이에요.</p>
              </div>
            ) : (
              <button 
                onClick={handleApply}
                disabled={isApplying}
                className={`w-full py-5 rounded-[24px] font-black shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3 overflow-hidden relative ${
                  isApplying ? 'bg-indigo-100 text-indigo-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isApplying ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>신청 정보를 보내는 중...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span>지금 바로 참가 신청하기</span>
                  </>
                )}
              </button>
            )}
            <p className="text-center text-[10px] text-gray-400 font-bold mt-4">신청 시 관리자에게 이름과 신분이 자동으로 전달됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeDetailPage;
