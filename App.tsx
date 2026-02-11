
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, MessageSquare, Calendar, UserCheck, Settings, BookOpen, Bell, LogOut, Sparkles, Music, Users, ClipboardCheck } from 'lucide-react';
import { User, Notice, Post, Participation, AttendanceRecord, AppNotification } from './types';
import { INITIAL_NOTICES, INITIAL_POSTS } from './constants';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import QTPage from './pages/QTPage';
import AttendancePage from './pages/AttendancePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import NoticesPage from './pages/NoticesPage';
import PostDetailPage from './pages/PostDetailPage';
import NotificationsPage from './pages/NotificationsPage';

const getInitialNotices = () => {
  const saved = localStorage.getItem('we_youth_notices');
  return saved ? JSON.parse(saved) : INITIAL_NOTICES;
};

const getInitialPosts = () => {
  const saved = localStorage.getItem('we_youth_posts');
  return saved ? JSON.parse(saved) : INITIAL_POSTS;
};

const getInitialNotifications = (): AppNotification[] => {
  const saved = localStorage.getItem('we_youth_notifications');
  return saved ? JSON.parse(saved) : [];
};

const getInitialParticipations = (): Participation[] => {
  const saved = localStorage.getItem('we_youth_participations');
  return saved ? JSON.parse(saved) : [];
};

const getInitialAttendance = (): AttendanceRecord[] => {
  const saved = localStorage.getItem('we_youth_attendance');
  return saved ? JSON.parse(saved) : [];
};

const getInitialSchedule = () => {
  const saved = localStorage.getItem('we_youth_schedule');
  return saved ? JSON.parse(saved) : [
    { day: "월", title: "찬양팀 연습", time: "19:00", type: "practice" },
    { day: "목", title: "소그룹 모임", time: "18:30", type: "meeting" },
    { day: "주일", title: "주일 예배 & 분반공부", time: "10:30", isMain: true, type: "worship" }
  ];
};

const getInitialVerifiedUsers = () => {
  const saved = localStorage.getItem('we_youth_verified_users');
  return saved ? JSON.parse(saved) : [
    { name: '강은택', role: 'admin' },
    { name: '김우신', role: 'admin' },
    { name: '이승기', role: 'admin' },
    { name: '오환희', role: 'leader' }
  ];
};

export const Logo = ({ className = "", inverted = false }) => (
  <div className={`flex flex-col items-center leading-none ${className} ${inverted ? 'text-white' : 'text-gray-900'}`}>
    <div className="text-4xl font-black tracking-tighter flex items-center">
      <span>WE</span>
    </div>
    <div className="w-full flex justify-center -mt-1.5 px-0.5">
       <svg width="100%" height="10" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M2 2C6 6 18 6 22 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
       </svg>
    </div>
  </div>
);

const SplashScreen = ({ isExiting }: { isExiting: boolean }) => (
  <div className={`fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-[999] transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
    <div className="flex flex-col items-center">
      <Logo inverted className="mb-8 scale-150" />
      <div className="flex items-center space-x-2 text-indigo-400 font-bold tracking-widest text-sm animate-pulse">
        <Sparkles className="w-4 h-4" />
        <span>WE YOUTH</span>
      </div>
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
  const [notifications, setNotifications] = useState<AppNotification[]>(getInitialNotifications);
  const [participations, setParticipations] = useState<Participation[]>(getInitialParticipations);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(getInitialAttendance);
  const [schedules, setSchedules] = useState(getInitialSchedule);
  const [verifiedUsers, setVerifiedUsers] = useState<{name: string, role: string}[]>(getInitialVerifiedUsers);

  useEffect(() => {
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.style.opacity = '0';
      setTimeout(() => { if (initialLoader.parentNode) initialLoader.remove(); }, 400);
    }
    const exitTimer = setTimeout(() => setIsSplashExiting(true), 1200);
    const removeTimer = setTimeout(() => setShowSplash(false), 1900);
    return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
  }, []);

  // 모든 상태 변화를 로컬 스토리지에 즉시 동기화
  useEffect(() => { localStorage.setItem('we_youth_notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('we_youth_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('we_youth_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('we_youth_participations', JSON.stringify(participations)); }, [participations]);
  useEffect(() => { localStorage.setItem('we_youth_attendance', JSON.stringify(attendanceRecords)); }, [attendanceRecords]);
  useEffect(() => { localStorage.setItem('we_youth_verified_users', JSON.stringify(verifiedUsers)); }, [verifiedUsers]);
  useEffect(() => { localStorage.setItem('we_youth_schedule', JSON.stringify(schedules)); }, [schedules]);

  // 실시간 직위 변경 반영 로직
  useEffect(() => {
    if (currentUser) {
      const matchedUser = verifiedUsers.find(u => u.name === currentUser.name);
      if (matchedUser && matchedUser.role !== currentUser.role) {
        const updatedUser = { ...currentUser, role: matchedUser.role as any };
        setCurrentUser(updatedUser);
        localStorage.setItem('we_youth_user', JSON.stringify(updatedUser));
      }
    }
  }, [verifiedUsers, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('we_youth_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('we_youth_user');
  };

  const getRoleLabel = (role: string) => {
    if (role === 'leader') return '찬양 리더';
    if (role === 'student') return '학생';
    if (role === 'admin') return '전도사님';
    if (role === 'president') return '회장님';
    return '선생님';
  };

  const getRoleColorStyles = (role: string) => {
    if (role === 'leader') return 'bg-violet-600 text-white ring-4 ring-violet-100';
    if (role === 'admin') return 'bg-amber-500 text-white ring-4 ring-amber-100';
    if (role === 'student') return 'bg-indigo-600 text-white ring-4 ring-indigo-100';
    if (role === 'president') return 'bg-rose-500 text-white ring-4 ring-rose-100';
    return 'bg-emerald-600 text-white ring-4 ring-emerald-100';
  };

  const unreadNotiCount = notifications.filter(n => !n.isRead).length;
  // 김우신 님은 학생 신분이어도 관리자 페이지에 접근 가능
  const canAccessAdmin = currentUser && (currentUser.role !== 'student' || currentUser.name === '김우신');

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
        {showSplash && <SplashScreen isExiting={isSplashExiting} />}
        
        {!showSplash && !currentUser && <LoginPage onLogin={handleLogin} verifiedUsers={verifiedUsers} />}

        {!showSplash && currentUser && (
          <>
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-4 pt-safe shadow-sm">
              <div className="max-w-4xl mx-auto h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 active:scale-95 transition-transform">
                  <Logo className="scale-[0.6] origin-left" />
                  <span className="font-black text-lg tracking-tighter text-gray-900 ml-[-5px]">우리는 청소년부</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadNotiCount > 0 && (
                      <span className="absolute top-1 right-1 bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                        {unreadNotiCount > 9 ? 'N' : unreadNotiCount}
                      </span>
                    )}
                  </Link>
                  <div className={`px-4 py-1.5 rounded-full text-[11px] font-black shadow-sm animate-in zoom-in duration-300 ${getRoleColorStyles(currentUser.role)}`}>
                    {currentUser.name} {getRoleLabel(currentUser.role)}
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto p-4">
              <div className="page-enter">
                <Routes>
                  <Route path="/" element={<HomePage user={currentUser} notices={notices} schedules={schedules} />} />
                  <Route path="/notices" element={<NoticesPage notices={notices} />} />
                  <Route path="/notifications" element={<NotificationsPage notifications={notifications} setNotifications={setNotifications} />} />
                  <Route path="/notice/:id" element={<NoticeDetailPage user={currentUser} notices={notices} participations={participations} setParticipations={setParticipations} />} />
                  <Route path="/community" element={<CommunityPage user={currentUser} posts={posts} setPosts={setPosts} setNotifications={setNotifications} />} />
                  <Route path="/post/:id" element={<PostDetailPage user={currentUser} posts={posts} setPosts={setPosts} />} />
                  <Route path="/attendance" element={<AttendancePage user={currentUser} attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} />} />
                  <Route path="/qt" element={<QTPage user={currentUser} />} />
                  <Route path="/admin" element={canAccessAdmin ? <AdminPage user={currentUser} notices={notices} setNotices={setNotices} schedules={schedules} setSchedules={setSchedules} verifiedUsers={verifiedUsers} setVerifiedUsers={setVerifiedUsers} participations={participations} setParticipations={setParticipations} attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} setNotifications={setNotifications} /> : <Navigate to="/" />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-6 pt-3 pb-8 flex justify-between items-center md:hidden z-50 shadow-[0_-1px_15px_rgba(0,0,0,0.03)]">
              <NavLink to="/" icon={<Home />} label="홈" />
              <NavLink to="/community" icon={<MessageSquare />} label="소통" />
              <NavLink to="/attendance" icon={<UserCheck />} label="출석" />
              <NavLink to="/qt" icon={<BookOpen />} label="묵상" />
              {canAccessAdmin && (
                <NavLink 
                  to="/admin" 
                  icon={<Settings />} 
                  label="관리" 
                  badge={participations.filter(p => !p.isRead).length > 0 ? participations.filter(p => !p.isRead).length : undefined} 
                />
              )}
            </nav>
          </>
        )}
      </div>
    </HashRouter>
  );
};

const NavLink = ({ to, icon, label, badge }: { to: string, icon: React.ReactElement, label: string, badge?: number }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link to={to} className={`relative flex flex-col items-center space-y-1 transition-all active:scale-90 ${isActive ? 'text-indigo-600' : 'text-gray-300'}`}>
      <div className={`p-1.5 rounded-xl ${isActive ? 'bg-indigo-50' : ''}`}>
        {React.cloneElement(icon, { className: "w-6 h-6" } as any)}
      </div>
      <span className={`text-[10px] font-black ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>{label}</span>
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
          {badge > 9 ? 'N' : badge}
        </span>
      )}
    </Link>
  );
};

export default App;
