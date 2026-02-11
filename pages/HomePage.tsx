
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Notice } from '../types';
import { Calendar, ChevronRight, Bell, Sparkles, MapPin, Clock, Smile, User as UserIcon, Music, ShieldCheck, Star } from 'lucide-react';

interface HomePageProps {
  user: User;
  notices: Notice[];
  schedules: any[];
}

const HomePage: React.FC<HomePageProps> = ({ user, notices, schedules }) => {
  const getRoleLabel = (role: string) => {
    if (role === 'leader') return '찬양 리더';
    if (role === 'student') return '청소년 학생';
    if (role === 'admin') return '전도사님';
    if (role === 'president') return '우리들의 회장님';
    return '선생님';
  };

  const getRoleTheme = (role: string) => {
    switch (role) {
      case 'student': return { icon: <Smile className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50' };
      case 'teacher': return { icon: <UserIcon className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'leader': return { icon: <Music className="w-5 h-5" />, color: 'text-violet-600', bg: 'bg-violet-50' };
      case 'admin': return { icon: <ShieldCheck className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'president': return { icon: <Star className="w-5 h-5 fill-current" />, color: 'text-rose-500', bg: 'bg-rose-50' };
      default: return { icon: <UserIcon className="w-5 h-5" />, color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const theme = getRoleTheme(user.role);

  return (
    <div className="space-y-6">
      {/* Identity Focused Greeting Area */}
      <div className="px-1 animate-in fade-in slide-in-from-left duration-500">
        <div className={`inline-flex items-center space-x-2 ${theme.bg} ${theme.color} px-4 py-2 rounded-2xl mb-3 shadow-sm`}>
          {theme.icon}
          <span className="text-xs font-black tracking-tight uppercase">
            {getRoleLabel(user.role)} 신분으로 접속 중
          </span>
        </div>
        <h2 className="text-3xl font-black text-gray-900 leading-tight">
          <span className={theme.color}>{user.name} {user.role === 'student' || user.role === 'president' ? '님' : ''}</span>,
          <br />오늘도 만나서 반가워요!
        </h2>
      </div>

      {/* Role-Specific Event Banner */}
      <section className={`rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group ${
        user.role === 'leader' ? 'bg-gradient-to-br from-violet-600 to-indigo-700' : 
        user.role === 'admin' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
        user.role === 'president' ? 'bg-gradient-to-br from-rose-500 to-pink-600' :
        'bg-indigo-600'
      }`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
                NOTICE FOR {user.role.toUpperCase()}
              </span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-2xl font-black mb-1 leading-tight">8월 여름 수련회<br/>"DEEP DIVE"</h1>
          <p className="opacity-80 text-xs mt-2 font-medium">함께 더 깊이 하나님을 만나는 시간!</p>
          <button className="mt-6 bg-white text-indigo-600 px-6 py-3 rounded-2xl text-sm font-black shadow-lg active:scale-95 transition-all">
            참가 신청하기
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700 rotate-12">
          {user.role === 'leader' ? <Music className="w-48 h-48" /> : <Smile className="w-48 h-48" />}
        </div>
      </section>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-2xl text-blue-500"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">예배 시간</p>
            <p className="text-sm font-black text-gray-800">10:30 AM</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-500"><MapPin className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">예배 장소</p>
            <p className="text-sm font-black text-gray-800">지하 1층</p>
          </div>
        </div>
      </div>

      {/* Recent Notices */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black flex items-center tracking-tight">
            <Bell className="w-6 h-6 mr-2 text-indigo-600" /> 공지사항
          </h2>
          <Link to="/" className="text-xs font-bold text-gray-400 flex items-center">전체보기 <ChevronRight className="w-4 h-4 ml-0.5" /></Link>
        </div>
        <div className="space-y-3">
          {notices.slice(0, 2).map(notice => (
            <Link key={notice.id} to={`/notice/${notice.id}`} className="block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-all active:scale-[0.98]">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full ${
                  notice.category === 'event' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {notice.category.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold text-gray-300">{notice.date}</span>
              </div>
              <h3 className="font-black text-gray-900 text-base mb-1.5">{notice.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-1 font-medium">{notice.content}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-black mb-6 flex items-center tracking-tight">
          <Calendar className="w-6 h-6 mr-2 text-indigo-600" /> 주간 일정
        </h2>
        <div className="space-y-4">
          {schedules.map((item, idx) => (
            <div key={idx} className={`flex items-center p-4 rounded-2xl ${item.isMain ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50 border border-transparent'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base mr-4 shadow-sm ${item.isMain ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400'}`}>
                {item.day}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="font-black text-sm text-gray-800">{item.title}</h4>
                  {item.title.includes('찬양팀') && <Music className="w-3.5 h-3.5 ml-2 text-violet-400" />}
                </div>
                <p className="text-[11px] text-gray-400 font-bold mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
