
import React, { useState } from 'react';
import { User, Notice } from '../types';
import { 
  Users, Calendar, Trash2, Edit, Bell, Plus, Save, X, LayoutDashboard, MapPin, ShieldCheck, HelpCircle, ChevronRight, UserPlus, UserCheck, Star
} from 'lucide-react';

type AdminTab = 'dashboard' | 'notices' | 'schedule' | 'members';

interface AdminPageProps {
  user: User;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  schedules: any[];
  setSchedules: React.Dispatch<React.SetStateAction<any[]>>;
  verifiedUsers: {name: string, role: string}[];
  setVerifiedUsers: React.Dispatch<React.SetStateAction<{name: string, role: string}[]>>;
  worshipInfo: { time: string, location: string };
  setWorshipInfo: React.Dispatch<React.SetStateAction<{ time: string, location: string }>>;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
  user, notices, setNotices, schedules, setSchedules, verifiedUsers, setVerifiedUsers, worshipInfo, setWorshipInfo 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Partial<Notice>>({ category: 'info' });
  const [localWorshipInfo, setLocalWorshipInfo] = useState(worshipInfo);
  const [localSchedules, setLocalSchedules] = useState(schedules);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('student');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const isMasterAdmin = user.role === 'admin';

  const showStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveNotice = () => {
    if (!currentNotice.title || !currentNotice.content) return;
    if (currentNotice.id) {
      setNotices(notices.map(n => n.id === currentNotice.id ? (currentNotice as Notice) : n));
    } else {
      const newNotice: Notice = {
        ...(currentNotice as Notice),
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        author: user.name
      };
      setNotices([newNotice, ...notices]);
    }
    setIsEditingNotice(false);
    setCurrentNotice({ category: 'info' });
    showStatus("공지사항이 업데이트되었습니다.");
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    if (verifiedUsers.find(u => u.name === newMemberName.trim())) {
      alert("이미 등록된 이름입니다.");
      return;
    }
    setVerifiedUsers([{ name: newMemberName.trim(), role: newMemberRole }, ...verifiedUsers]);
    setNewMemberName('');
    showStatus(`${newMemberName}님이 명단에 추가되었습니다.`);
  };

  const deleteMember = (name: string) => {
    if (window.confirm(`${name}님을 명단에서 삭제할까요?`)) {
      setVerifiedUsers(verifiedUsers.filter(u => u.name !== name));
      showStatus("명단에서 삭제되었습니다.");
    }
  };

  const handleRoleChange = (name: string, role: string) => {
    setVerifiedUsers(verifiedUsers.map(u => u.name === name ? { ...u, role } : u));
    showStatus("신분이 변경되었습니다.");
  };

  return (
    <div className="p-4 space-y-6 pb-24 relative">
      {saveStatus && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl z-[200] font-bold text-sm flex items-center border border-white/20 animate-in fade-in slide-in-from-top-4">
          <ShieldCheck className="w-4 h-4 mr-3 text-green-400" />
          {saveStatus}
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center">
          관리자 센터 {isMasterAdmin && <ShieldCheck className="w-5 h-5 ml-2 text-amber-500" />}
        </h1>
        <p className="text-gray-500 text-xs font-medium">청소년부 회원들의 신분과 일정을 통합 관리합니다.</p>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-hide">
        <AdminTabBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard className="w-4 h-4" />} label="대시보드" />
        <AdminTabBtn active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users className="w-4 h-4" />} label="회원 관리" />
        <AdminTabBtn active={activeTab === 'notices'} onClick={() => setActiveTab('notices'} icon={<Bell className="w-4 h-4" />} label="공지 관리" />
        <AdminTabBtn active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule'} icon={<Calendar className="w-4 h-4" />} label="정보 관리" />
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4">
            <StatsCard icon={<Users className="text-indigo-600" />} bg="bg-indigo-50" label="등록된 명단" value={`${verifiedUsers.length}명`} />
            <StatsCard icon={<Bell className="text-emerald-600" />} bg="bg-emerald-50" label="게시된 공지" value={`${notices.length}개`} />
          </div>
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-sm flex items-center text-indigo-600"><HelpCircle className="w-4 h-4 mr-2" /> 관리 가이드</h3>
            <div className="space-y-3">
              <HelpItem step="1" title="신분 부여" desc="'회원 관리' 탭에서 학생들의 이름을 등록하고 역할을 지정하세요." />
              <HelpItem step="2" title="로그인 대조" desc="이름을 등록하면 해당 학생은 로그인 시 자동으로 지정된 신분이 부여됩니다." />
            </div>
          </section>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-black text-sm flex items-center text-gray-900 border-b pb-3"><UserPlus className="w-4 h-4 mr-2 text-indigo-600" /> 신규 회원 등록</h3>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input 
                placeholder="등록할 성함 입력"
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
              />
              <select 
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newMemberRole}
                onChange={e => setNewMemberRole(e.target.value)}
              >
                <option value="student">학생</option>
                <option value="president">회장</option>
                <option value="teacher">선생님</option>
                <option value="leader">리더</option>
                <option value="admin">전도사님</option>
              </select>
              <button 
                onClick={handleAddMember}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-black active:scale-95 transition-transform"
              >
                등록하기
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-black text-sm ml-1 flex items-center"><UserCheck className="w-4 h-4 mr-2 text-indigo-600" /> 관리 중인 명단 ({verifiedUsers.length})</h3>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {verifiedUsers.map((u, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <p className="font-black text-gray-900 text-sm">{u.name}</p>
                      {u.role === 'president' && <Star className="w-3 h-3 text-rose-500 fill-current" />}
                    </div>
                    <div className="flex items-center space-x-3">
                      <select 
                        value={u.role}
                        onChange={e => handleRoleChange(u.name, e.target.value)}
                        className={`text-[10px] font-black px-2 py-1 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none ${
                          u.role === 'student' ? 'bg-indigo-50 text-indigo-600' :
                          u.role === 'teacher' ? 'bg-emerald-50 text-emerald-600' :
                          u.role === 'leader' ? 'bg-violet-50 text-violet-600' : 
                          u.role === 'president' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        <option value="student">학생</option>
                        <option value="president">회장</option>
                        <option value="teacher">선생님</option>
                        <option value="leader">리더</option>
                        <option value="admin">전도사</option>
                      </select>
                      <button 
                        onClick={() => deleteMember(u.name)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notices' && (
        <div className="space-y-4 animate-in fade-in duration-300">
           <div className="flex items-center justify-between">
            <h2 className="font-black text-gray-800 tracking-tight">공지사항 리스트</h2>
            <button onClick={() => { setCurrentNotice({ category: 'info' }); setIsEditingNotice(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center shadow-lg"><Plus className="w-4 h-4 mr-1.5" /> 새 공지 작성</button>
          </div>
          <div className="space-y-3">
            {notices.map(notice => (
              <div key={notice.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${notice.category === 'event' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>{notice.category}</span>
                    <span className="text-[10px] text-gray-400 font-bold">{notice.date}</span>
                  </div>
                  <h3 className="font-black text-gray-800 text-sm">{notice.title}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => { setCurrentNotice(notice); setIsEditingNotice(true); }} className="p-2 text-gray-300 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => { if(window.confirm("삭제할까요?")) setNotices(notices.filter(n => n.id !== notice.id)); }} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isEditingNotice && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-white w-full max-md rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-gray-900">공지 작성/수정</h2>
              <button onClick={() => setIsEditingNotice(false)} className="text-gray-300 hover:text-gray-600"><X className="w-7 h-7" /></button>
            </div>
            <div className="space-y-6">
              <input placeholder="제목을 입력하세요" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" value={currentNotice.title || ''} onChange={e => setCurrentNotice({...currentNotice, title: e.target.value})} />
              <textarea placeholder="아이들에게 전할 말을 적어주세요..." className="w-full h-44 resize-none bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none" value={currentNotice.content || ''} onChange={e => setCurrentNotice({...currentNotice, content: e.target.value})} />
              <button onClick={handleSaveNotice} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl">저장하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminTabBtn: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center space-x-2 px-5 py-3 text-xs font-black rounded-xl transition-all ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>{icon}<span>{label}</span></button>
);
const StatsCard: React.FC<{ icon: React.ReactNode, bg: string, label: string, value: string }> = ({ icon, bg, label, value }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex flex-col items-center"><div className={`${bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-3`}>{React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' } as any)}</div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p><p className="text-2xl font-black text-gray-900">{value}</p></div>
);
const HelpItem: React.FC<{ step: string, title: string, desc: string }> = ({ step, title, desc }) => (
  <div className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-2xl"><div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0">{step}</div><div><h4 className="text-xs font-black text-gray-800">{title}</h4><p className="text-[10px] text-gray-500 mt-0.5">{desc}</p></div></div>
);

export default AdminPage;
