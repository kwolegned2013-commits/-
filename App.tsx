
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, MessageSquare, Calendar, UserCheck, Settings, BookOpen, Bell, LogOut, Sparkles } from 'lucide-react';
import { User, Notice, Post } from './types';
import { INITIAL_NOTICES, INITIAL_POSTS } from './constants';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import QTPage from './pages/QTPage';
import AttendancePage from './pages/AttendancePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import PostDetailPage from './pages/PostDetailPage';

const getInitialNotices = () => {
  const saved = localStorage.getItem('we_youth_notices');
  return saved ? JSON.parse(saved) : INITIAL_NOTICES;
};

const getInitialPosts = () => {
  const saved = localStorage.getItem('we_youth_posts');
  return saved ? JSON.parse(saved) : INITIAL_POSTS;
};

const getInitialSchedule = () => {
  const saved = localStorage.getItem('we_youth_schedule');
  return saved ? JSON.parse(saved) : [
    { day: "월", title: "고등부 찬양팀 연습", time: "19:00", type: "practice" },
    { day: "목", title: "중등부 소그룹 모임", time: "18:30", type: "meeting" },
    { day: "주일", title: "주일 대예배 & 분반공부", time: "10:30", isMain: true, type: "worship" }
  ];
};

const Logo = ({ className = "", inverted = false }) => (
  <div className={`flex flex-col items-center leading-none ${className} ${inverted ? 'text-white' : 'text-gray-900'}`}>
    <div className="text-3xl font-black tracking-tighter flex items-center">
      <span>WE</span>
    </div>
    <div className="w-full flex justify-center -mt-1">
       <svg width="28" height="8" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M2 2C6 6 18 6 22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
       </svg>
    </div>
  </div>
);

const SplashScreen = ({ isExiting }: { isExiting: boolean }) => (
  <div className={`fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-[999] transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
    <Logo inverted className="mb-6 scale-125" />
    <div className="flex items-center space-x-2 text-indigo-400 font-bold tracking-widest text-sm animate-pulse">
      <Sparkles className="w-4 h-4" />
      <span>WE YOUTH</span>
    </div>
    <p className="absolute bottom-12 text-gray-600 text-[10px] font-black tracking-[0.2em]">LOADING SPIRITUAL SPACE</p>
  </div>
);

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('we_youth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [notices, setNotices] = useState<Notice[]>(getInitialNotices);
  const [posts, setPosts] = useState<Post[]>(getInitialPosts);
  const [schedules, setSchedules] = useState(getInitialSchedule);

  useEffect(() => {
    // 초기 HTML 로더 제거
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        if (loader.parentNode) loader.remove();
      }, 500);
    }

    const exitTimer = setTimeout(() => setIsSplashExiting(true), 1500);
    const removeTimer = setTimeout(() => setShowSplash(false), 2200);
    
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => { localStorage.setItem('we_youth_notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('we_youth_posts', JSON.stringify(posts)); }, [posts]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('we_youth_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('we_youth_user');
  };

  const getRoleLabel = (role: string) => {
    if (role === 'student') return '학생';
    if (role === 'admin') return '전도사님';
    return '선생님';
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
        {showSplash && <SplashScreen isExiting={isSplashExiting} />}
        
        {!showSplash && !currentUser && <LoginPage onLogin={handleLogin} />}

        {!showSplash && currentUser && (
          <>
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-4 pt-safe shadow-sm">
              <div className="max-w-4xl mx-auto h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 active:scale-95 transition-transform">
                  <Logo className="scale-75" />
                  <span className="font-black text-xl tracking-tighter text-gray-900 ml-1">우리는 청소년부</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-black text-gray-900">
                      안녕하세요, <span className="text-indigo-600">{currentUser.name} {getRoleLabel(currentUser.role)}</span>
                    </p>
                  </div>
                  <div className="sm:hidden text-xs font-black bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100">
                    {currentUser.name} {getRoleLabel(currentUser.role)}
                  </div>
                  <button onClick={handleLogout} className="p-2.5 text-gray-300 hover:text-red-500 active:bg-red-50 rounded-2xl transition-all">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto p-4">
              <div className="page-enter">
                <Routes>
                  <Route path="/" element={<HomePage user={currentUser} notices={notices} schedules={schedules} />} />
                  <Route path="/notice/:id" element={<NoticeDetailPage notices={notices} />} />
                  <Route path="/community" element={<CommunityPage user={currentUser} posts={posts} setPosts={setPosts} />} />
                  <Route path="/post/:id" element={<PostDetailPage user={currentUser} posts={posts} setPosts={setPosts} />} />
                  <Route path="/attendance" element={<AttendancePage user={currentUser} />} />
                  <Route path="/qt" element={<QTPage user={currentUser} />} />
                  <Route path="/admin" element={currentUser.role !== 'student' ? <AdminPage user={currentUser} notices={notices} setNotices={setNotices} schedules={schedules} setSchedules={setSchedules} worshipInfo={{time: "10:30", location: "지하 1층"}} setWorshipInfo={() => {}} /> : <Navigate to="/" />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-6 pt-3 pb-8 flex justify-between items-center md:hidden z-50 shadow-[0_-1px_15px_rgba(0,0,0,0.03)]">
              <NavLink to="/" icon={<Home />} label="홈" />
              <NavLink to="/community" icon={<MessageSquare />} label="소통" />
              <NavLink to="/attendance" icon={<UserCheck />} label="출석" />
              <NavLink to="/qt" icon={<BookOpen />} label="묵상" />
              {currentUser.role !== 'student' && <NavLink to="/admin" icon={<Settings />} label="관리" />}
            </nav>
          </>
        )}
      </div>
    </HashRouter>
  );
};

const NavLink = ({ to, icon, label }: { to: string, icon: React.ReactElement, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link to={to} className={`flex flex-col items-center space-y-1 transition-all active:scale-90 ${isActive ? 'text-indigo-600' : 'text-gray-300'}`}>
      <div className={`p-1.5 rounded-xl ${isActive ? 'bg-indigo-50' : ''}`}>
        {React.cloneElement(icon, { className: "w-6 h-6" } as any)}
      </div>
      <span className={`text-[10px] font-black ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>{label}</span>
    </Link>
  );
};

export default App;
