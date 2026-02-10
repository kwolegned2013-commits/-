
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Notice } from '../types';
import { Calendar, ChevronRight, Bell, Sparkles, MapPin, Clock } from 'lucide-react';

interface HomePageProps {
  user: User;
  notices: Notice[];
  schedules: any[];
}

const HomePage: React.FC<HomePageProps> = ({ user, notices, schedules }) => {
  const latestNotice = notices[0];

  return (
    <div className="space-y-6">
      {/* Event Highlight Banner */}
      <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">EVENT</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <h1 className="text-2xl font-black mb-1 leading-tight">8월 여름 수련회<br/>"DEEP DIVE"</h1>
          <p className="opacity-80 text-xs mt-1">함께 더 깊이 하나님을 만나는 시간!</p>
          <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-black shadow-lg active:scale-95 transition-all">
            자세히 보기
          </button>
        </div>
        <div className="absolute -bottom-6 -right-6 opacity-20 group-hover:scale-110 transition-transform duration-700">
          <Calendar className="w-32 h-32" />
        </div>
      </section>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-xl text-blue-500"><Clock className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400">예배 시간</p>
            <p className="text-sm font-black text-gray-800">10:30 AM</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="bg-emerald-50 p-2 rounded-xl text-emerald-500"><MapPin className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400">예배 장소</p>
            <p className="text-sm font-black text-gray-800">지하 1층</p>
          </div>
        </div>
      </div>

      {/* Recent Notices */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black flex items-center">
            <Bell className="w-5 h-5 mr-2 text-indigo-600" /> 공지사항
          </h2>
          <Link to="/notices" className="text-xs font-bold text-gray-400 flex items-center">전체보기 <ChevronRight className="w-3 h-3 ml-0.5" /></Link>
        </div>
        <div className="space-y-3">
          {notices.slice(0, 2).map(notice => (
            <Link key={notice.id} to={`/notice/${notice.id}`} className="block bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-all active:scale-[0.98]">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  notice.category === 'event' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {notice.category.toUpperCase()}
                </span>
                <span className="text-[10px] text-gray-300">{notice.date}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{notice.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-1">{notice.content}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-black mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-indigo-600" /> 주간 일정
        </h2>
        <div className="space-y-3">
          {schedules.map((item, idx) => (
            <div key={idx} className={`flex items-center p-3 rounded-2xl ${item.isMain ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm mr-4 ${item.isMain ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400'}`}>
                {item.day}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-[11px] text-gray-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
