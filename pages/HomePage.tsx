
import React from 'react';
import { User, Notice } from '../types';
import { DAILY_VERSES } from '../constants';
import { Calendar, ChevronRight, Bell, Clock, MapPin, Sparkles } from 'lucide-react';

interface HomePageProps {
  user: User;
  notices: Notice[];
  schedules: any[];
  worshipInfo: { time: string, location: string };
}

const HomePage: React.FC<HomePageProps> = ({ user, notices, schedules, worshipInfo }) => {
  const randomVerse = DAILY_VERSES[Math.floor(Math.random() * DAILY_VERSES.length)];

  // 역할 및 특정 이름에 따른 환영 인사말 생성
  const getGreeting = () => {
    if (user.name === '이승기') return `반갑습니다, 이승기 회장님! 👑`;
    if (user.name === '오환희') return `안녕하세요, 오환희 찬양 리더님! 🎸`;
    if (user.role === 'teacher') return `안녕하세요, ${user.name} 선생님! 👋`;
    if (user.role === 'admin') return `반갑습니다, ${user.name} 관리자님! 🛠️`;
    return `안녕, ${user.name} 친구야! 👋`;
  };

  const getSubGreeting = () => {
    if (user.name === '이승기') return "회장님의 리더십으로 우리 청소년부가 더욱 빛나고 있어요.";
    if (user.name === '오환희') return "오늘도 은혜로운 찬양으로 마음을 열어주셔서 감사합니다.";
    if (user.role === 'teacher') return "오늘도 우리 아이들을 위해 헌신해주셔서 감사합니다.";
    if (user.role === 'admin') return "커뮤니티의 원활한 운영을 위해 항상 수고하시네요!";
    return "우리는 청소년부에서 함께 웃고 성장하자!";
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <section className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">WE YOUTH</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black mb-1 leading-tight tracking-tight">
            {getGreeting()}<br />
            <span className="text-indigo-400">우리는 청소년부</span>야!
          </h1>
          <p className="opacity-70 text-xs mt-1">{getSubGreeting()}</p>
          
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10 shadow-inner">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Today's Word</p>
            </div>
            <p className="text-lg font-bold leading-snug italic tracking-tight">"{randomVerse.text}"</p>
            <p className="text-xs mt-3 font-semibold text-indigo-300">- {randomVerse.reference}</p>
          </div>
        </div>
        
        <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
           <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13.5L12 19L6 13.5"/><path d="M12 5V19"/></svg>
        </div>
      </section>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-indigo-100 transition-all">
          <div className="bg-amber-50 p-2.5 rounded-xl text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">예배 시간</p>
            <p className="text-sm font-black text-gray-800">{worshipInfo.time}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-indigo-100 transition-all">
          <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">예배 장소</p>
            <p className="text-sm font-black text-gray-800">{worshipInfo.location}</p>
          </div>
        </div>
      </div>

      {/* Notices */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-black flex items-center tracking-tight">
            <Bell className="w-5 h-5 mr-2 text-indigo-600" /> 소식 창고
          </h2>
        </div>
        <div className="space-y-3">
          {notices.length === 0 ? (
            <div className="p-10 text-center text-gray-300 font-bold italic text-sm">등록된 소식이 없습니다.</div>
          ) : (
            notices.map(notice => (
              <div key={notice.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                    notice.category === 'event' ? 'bg-purple-50 text-purple-600' : 
                    notice.category === 'worship' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {notice.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold text-gray-300">{notice.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-indigo-600 transition-colors">{notice.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notice.content}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-hidden relative">
        <h2 className="text-lg font-black mb-5 flex items-center tracking-tight">
          <Calendar className="w-5 h-5 mr-2 text-indigo-600" /> WE 주간 일정
        </h2>
        <div className="space-y-4">
          {schedules.map((item, idx) => (
            <ScheduleItem key={idx} day={item.day} title={item.title} time={item.time} isMain={item.isMain} />
          ))}
        </div>
      </section>
    </div>
  );
};

const ScheduleItem: React.FC<{ day: string, title: string, time: string, isMain?: boolean }> = ({ day, title, time, isMain }) => (
  <div className={`flex items-center p-4 rounded-2xl transition-all ${isMain ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-800'}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm mr-4 ${isMain ? 'bg-white text-indigo-600' : 'bg-white text-gray-400 shadow-sm'}`}>
      {day}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-sm leading-tight">{title}</h4>
      <p className={`text-[11px] font-medium mt-0.5 ${isMain ? 'text-indigo-100' : 'text-gray-400'}`}>{time}</p>
    </div>
  </div>
);

export default HomePage;
