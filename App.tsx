
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, MessageSquare, Calendar, UserCheck, Settings, BookOpen, Bell, Menu, X, Plus, Heart, ChevronRight, Smile, LogOut, ShieldAlert } from 'lucide-react';
import { User, Notice } from './types';
import { INITIAL_NOTICES } from './constants';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import QTPage from './pages/QTPage';
import AttendancePage from './pages/AttendancePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

// 가상 서버 데이터 초기화 및 로드
const getInitialNotices = () => {
  const saved = localStorage.getItem('we_youth_notices');
  return saved ? JSON.parse(saved) : INITIAL_NOTICES;
};

const getInitialSchedule = () => {
  const saved = localStorage.getItem('we_youth_schedule');
  return saved ? JSON.parse(saved) : [
    { day: "월", title: "고등부 찬양팀 연습", time: "19:00" },
    { day: "목", title: "중등부 소그룹 모임", time: "18:30" },
    { day: "주일", title: "주일 대예배 & 분반공부", time: "10:30", isMain: true }
  ];
};

const getInitialWorshipInfo = () => {
  const saved = localStorage.getItem('we_youth_worship_info');
  return saved ? JSON.parse(saved) : { time: "AM 10:30", location: "지하 1층" };
};

const Logo: React.FC<{ className?: string, inverted?: boolean }> = ({ className, inverted }) => (
  <div className={`flex flex-col items-center leading-none ${className} ${inverted ? 'text-white' : 'text-gray-900'}`}>
    <div className="font-black text-2xl tracking-tighter flex items-end">
      <span>W</span><span className="transform -scale-x-100 -ml-0.5">E</span>
    </div>
    <div className="w-full flex justify-center -mt-1">
       <svg width="24" height="8" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M2 2C6 6 18 6 22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
       </svg>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('we_youth_user');
    return saved ? JSON.parse(saved) : null;
  });

  // 전역 상태 (가상 서버 데이터)
  const [notices, setNotices] = useState<Notice[]>(getInitialNotices);
  const [schedules, setSchedules] = useState(getInitialSchedule);
  const [worshipInfo, setWorshipInfo] = useState(getInitialWorshipInfo);

  // 데이터 변경 시 로컬 스토리지 저장 (서버 반영 시뮬레이션)
  useEffect(() => { localStorage.setItem('we_youth_notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('we_youth_schedule', JSON.stringify(schedules)); }, [schedules]);
  useEffect(() => { localStorage.setItem('we_youth_worship_info', JSON.stringify(worshipInfo)); }, [worshipInfo]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('we_youth_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('we_youth_user');
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isAdminOrTeacher = currentUser.role === 'admin' || currentUser.role === 'teacher';

  const getUserHeaderLabel = () => {
    if (currentUser.name === '이승기') return `이승기 회장님`;
    if (currentUser.name === '오환희') return `오환희 찬양 리더님`;
    if (currentUser.role === 'teacher') return `${currentUser.name} 선생님`;
    if (currentUser.role === 'admin') return `${currentUser.name} 관리자님`;
    return `${currentUser.name} 학생`;
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="scale-90" />
              <span className="font-bold text-xl tracking-tight text-gray-900 ml-1">우리는 청소년부</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center mr-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  currentUser.role === 'admin' ? 'bg-amber-500' : 
                  currentUser.role === 'teacher' ? 'bg-emerald-500' : 'bg-indigo-500'
                }`}></div>
                <span className="text-[11px] font-bold text-gray-600">
                  {getUserHeaderLabel()} 안녕하세요
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="로그아웃"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl w-full mx-auto pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={
              <HomePage 
                user={currentUser} 
                notices={notices} 
                schedules={schedules} 
                worshipInfo={worshipInfo} 
              />
            } />
            <Route path="/community" element={<CommunityPage user={currentUser} />} />
            <Route path="/qt" element={<QTPage user={currentUser} />} />
            <Route path="/attendance" element={<AttendancePage user={currentUser} />} />
            <Route path="/admin" element={
              isAdminOrTeacher ? (
                <AdminPage 
                  user={currentUser} 
                  notices={notices} 
                  setNotices={setNotices} 
                  schedules={schedules}
                  setSchedules={setSchedules}
                  worshipInfo={worshipInfo}
                  setWorshipInfo={setWorshipInfo}
                />
              ) : <Navigate to="/" />
            } />
          </Routes>
        </main>

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center md:hidden z-50">
          <NavLink to="/" icon={<Home className="w-6 h-6" />} label="홈" />
          <NavLink to="/community" icon={<MessageSquare className="w-6 h-6" />} label="소통" />
          <NavLink to="/attendance" icon={<UserCheck className="w-6 h-6" />} label="출석" />
          <NavLink to="/qt" icon={<BookOpen className="w-6 h-6" />} label="묵상" />
          {isAdminOrTeacher && (
            <NavLink to="/admin" icon={<Settings className="w-6 h-6" />} label="관리" />
          )}
        </nav>
      </div>
    </HashRouter>
  );
};

const NavLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex flex-col items-center space-y-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );
};

export default App;
