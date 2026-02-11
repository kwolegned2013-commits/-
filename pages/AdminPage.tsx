
import React, { useState, useEffect } from 'react';
import { User, Notice, Participation, AttendanceRecord, AppNotification } from '../types';
import { 
  Users, Calendar, Trash2, Edit, Bell, Plus, X, LayoutDashboard, ShieldCheck, HelpCircle, UserPlus, UserCheck, Star, ClipboardCheck, Clock, UserCheck as UserIcon, RefreshCcw
} from 'lucide-react';

type AdminTab = 'dashboard' | 'members' | 'notices' | 'applications' | 'attendance' | 'schedule';

interface AdminPageProps {
  user: User;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  schedules: any[];
  setSchedules: React.Dispatch<React.SetStateAction<any[]>>;
  verifiedUsers: {name: string, role: string}[];
  setVerifiedUsers: React.Dispatch<React.SetStateAction<{name: string, role: string}[]>>;
  participations: Participation[];
  setParticipations: React.Dispatch<React.SetStateAction<Participation[]>>;
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
  user, notices, setNotices, schedules, setSchedules, verifiedUsers, setVerifiedUsers, participations, setParticipations, attendanceRecords, setAttendanceRecords, setNotifications
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Partial<Notice>>({ category: 'info' });
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('student');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // 일정 수정을 위한 상태
  const [editingScheduleIdx, setEditingScheduleIdx] = useState<number | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ day: '', title: '', time: '', type: 'worship', isMain: false });

  const isMasterAdmin = user.role === 'admin' || user.name === '김우신';

  useEffect(() => {
    if (activeTab === 'applications') {
      const updated = participations.map(p => ({ ...p, isRead: true }));
      setParticipations(updated);
    }
  }, [activeTab]);

  const showStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleSaveNotice = () => {
    if (!currentNotice.title || !currentNotice.content) return;
    
    let noticeId = currentNotice.id;
    if (currentNotice.id) {
      setNotices(notices.map(n => n.id === currentNotice.id ? (currentNotice as Notice) : n));
    } else {
      noticeId = Date.now().toString();
      const newNotice: Notice = {
        ...(currentNotice as Notice),
        id: noticeId,
        date: new Date().toISOString().split('T')[0],
        author: user.name
      };
      setNotices([newNotice, ...notices]);

      // 알림 생성
      const newNoti: AppNotification = {
        id: Date.now().toString(),
        type: 'notice',
        title: '새로운 공지사항 📢',
        message: currentNotice.title,
        link: `/notice/${noticeId}`,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      setNotifications(prev => [newNoti, ...prev]);
    }
    setIsEditingNotice(false);
    setCurrentNotice({ category: 'info' });
    showStatus("공지사항이 업데이트되었습니다.");
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    setVerifiedUsers([{ name: newMemberName.trim(), role: newMemberRole }, ...verifiedUsers]);
    setNewMemberName('');
    showStatus(`${newMemberName}님이 명단에 추가되었습니다.`);
  };

  const handleRoleChange = (name: string, role: string) => {
    setVerifiedUsers(prev => prev.map(u => u.name === name ? { ...u, role } : u));
    showStatus(`${name}님의 직위가 즉시 변경되었습니다.`);
  };

  const handleSaveSchedule = () => {
    if (!scheduleForm.day || !scheduleForm.title) return;
    const updated = [...schedules];
    if (editingScheduleIdx !== null) {
      updated[editingScheduleIdx] = scheduleForm;
    } else {
      updated.push(scheduleForm);
    }
    setSchedules(updated);
    setEditingScheduleIdx(null);
    setScheduleForm({ day: '', title: '', time: '', type: 'worship', isMain: false });
    showStatus("주간 일정이 저장되었습니다.");
  };

  const unreadCount = participations.filter(p => !p.isRead).length;
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(r => r.date === today);

  return (
    <div className="p-4 space-y-6 pb-24 relative">
      {saveStatus && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 shadow-2xl text-white px-6 py-4 rounded-2xl z-[200] font-black text-xs flex items-center border border-white/10 animate-in fade-in slide-in-from-top-4">
          <RefreshCcw className="w-3.5 h-3.5 mr-2.5 text-indigo-400 animate-spin" />
          {saveStatus}
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center">
          관리자 센터 {isMasterAdmin && <ShieldCheck className="w-5 h-5 ml-2 text-amber-500" />}
        </h1>
        <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider opacity-60">
          {user.name === '김우신' ? '김우신 전용 특수 권한 활성화됨' : 'Youth Admin System'}
        </p>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-[22px] overflow-x-auto whitespace-nowrap scrollbar-hide">
        <AdminTabBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard className="w-4 h-4" />} label="보드" />
        <AdminTabBtn active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users className="w-4 h-4" />} label="회원" />
        <AdminTabBtn active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} icon={<UserIcon className="w-4 h-4" />} label="출석" />
        <AdminTabBtn active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={<Calendar className="w-4 h-4" />} label="일정" />
        <AdminTabBtn active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} icon={<ClipboardCheck className="w-4 h-4" />} label="신청" badge={unreadCount > 0 ? unreadCount : undefined} />
        <AdminTabBtn active={activeTab === 'notices'} onClick={() => setActiveTab('notices')} icon={<Bell className="w-4 h-4" />} label="공지" />
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4">
            <StatsCard icon={<Users className="text-indigo-600" />} bg="bg-indigo-50" label="전체 회원" value={`${verifiedUsers.length}명`} />
            <StatsCard icon={<UserIcon className="text-emerald-600" />} bg="bg-emerald-50" label="오늘 출석" value={`${todayAttendance.length}명`} />
          </div>
          <section className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-sm flex items-center text-indigo-600"><HelpCircle className="w-4 h-4 mr-2" /> 운영 관리 팁</h3>
            <div className="space-y-3">
              <HelpItem step="1" title="실시간 데이터 동기화" desc="여기서 변경하는 모든 내용은 모든 사용자의 기기에 즉시 반영됩니다." />
              <HelpItem step="2" title="데이터 보존" desc="새로고침을 해도 로컬 저장소에 안전하게 보관되니 안심하고 관리하세요." />
            </div>
          </section>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-gray-900 text-lg">실시간 출석 현황</h3>
            <button 
              onClick={() => { if(window.confirm("모든 출석 데이터를 삭제할까요?")) setAttendanceRecords([]); }}
              className="text-[10px] font-black text-gray-300 hover:text-red-500"
            >
              기록 초기화
            </button>
          </div>
          <div className="space-y-3">
            {attendanceRecords.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm font-bold">출석 기록이 없습니다.</p>
            ) : (
              attendanceRecords.map(record => (
                <div key={record.id} className="bg-white p-5 rounded-[24px] border border-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black">{record.userName[0]}</div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">{record.userName}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{record.date}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${record.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{record.status === 'present' ? '출석' : '지각'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-sm flex items-center text-gray-900"><Plus className="w-4 h-4 mr-2 text-indigo-600" /> 일정 추가/수정</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="요일 (예: 주일)" className="bg-gray-50 p-3 rounded-xl text-xs font-bold" value={scheduleForm.day} onChange={e => setScheduleForm({...scheduleForm, day: e.target.value})} />
              <input placeholder="시간 (예: 10:30)" className="bg-gray-50 p-3 rounded-xl text-xs font-bold" value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} />
              <input placeholder="일정 이름" className="col-span-2 bg-gray-50 p-3 rounded-xl text-xs font-bold" value={scheduleForm.title} onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} />
            </div>
            <button onClick={handleSaveSchedule} className="w-full bg-indigo-600 text-white py-3 rounded-xl text-xs font-black shadow-lg">일정 저장하기</button>
          </div>
          <div className="space-y-3">
            {schedules.map((s, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[24px] border border-gray-50 flex items-center justify-between">
                <div>
                  <p className="font-black text-gray-900 text-sm">{s.day} - {s.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{s.time}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => { setEditingScheduleIdx(idx); setScheduleForm(s); }} className="p-2 text-indigo-400"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setSchedules(schedules.filter((_, i) => i !== idx))} className="p-2 text-red-300"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-sm flex items-center text-gray-900"><UserPlus className="w-4 h-4 mr-2 text-indigo-600" /> 신규 회원 등록</h3>
            <div className="flex space-x-2">
              <input placeholder="성함" className="flex-1 bg-gray-50 p-3 rounded-xl text-xs font-bold" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} />
              <select className="bg-gray-50 p-3 rounded-xl text-xs font-bold" value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)}>
                <option value="student">학생</option>
                <option value="teacher">선생님</option>
                <option value="leader">리더</option>
                <option value="admin">전도사</option>
                <option value="president">회장</option>
              </select>
              <button onClick={handleAddMember} className="bg-indigo-600 text-white px-5 rounded-xl text-xs font-black">등록</button>
            </div>
          </div>
          <div className="bg-white rounded-[32px] overflow-hidden border border-gray-50 divide-y divide-gray-50">
            {verifiedUsers.map((u, i) => (
              <div key={i} className="p-5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-black text-xs">{u.name[0]}</div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{u.name}</p>
                    <span className="text-[10px] text-gray-400 font-bold">{u.role}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <select 
                    value={u.role}
                    onChange={e => handleRoleChange(u.name, e.target.value)}
                    className="text-[10px] font-black bg-gray-50 border-none rounded-lg p-2"
                  >
                    <option value="student">학생</option>
                    <option value="teacher">선생님</option>
                    <option value="leader">리더</option>
                    <option value="admin">전도사</option>
                    <option value="president">회장</option>
                  </select>
                  <button onClick={() => setVerifiedUsers(verifiedUsers.filter(v => v.name !== u.name))} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-gray-900 text-lg">참가 신청 관리</h3>
          </div>
          {participations.length === 0 ? (
             <p className="text-center py-10 text-gray-300 text-sm font-bold">접수된 신청 내역이 없습니다.</p>
          ) : (
            participations.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">{app.userName} ({app.userRole})</span>
                    <span className="text-[9px] text-gray-400">{new Date(app.appliedAt).toLocaleString()}</span>
                  </div>
                  <button onClick={() => setParticipations(participations.filter(p => p.id !== app.id))} className="text-red-300"><Trash2 className="w-4 h-4" /></button>
                </div>
                <h4 className="font-black text-gray-800 text-sm">{app.noticeTitle}</h4>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'notices' && (
        <div className="space-y-4 animate-in fade-in duration-300">
           <div className="flex items-center justify-between px-1">
            <h2 className="font-black text-gray-800 text-lg">공지사항 관리</h2>
            <button onClick={() => { setCurrentNotice({ category: 'info' }); setIsEditingNotice(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center shadow-lg"><Plus className="w-4 h-4 mr-1.5" /> 새 공지</button>
          </div>
          <div className="space-y-3">
            {notices.map(notice => (
              <div key={notice.id} className="bg-white p-6 rounded-[28px] border border-gray-100 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{notice.category}</p>
                  <h3 className="font-black text-gray-900 text-base">{notice.title}</h3>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => { setCurrentNotice(notice); setIsEditingNotice(true); }} className="p-2 text-indigo-300"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setNotices(notices.filter(n => n.id !== notice.id))} className="p-2 text-red-200"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isEditingNotice && (
        <div className="fixed inset-0 bg-black/70 z-[300] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900">공지사항 편집</h2>
              <button onClick={() => setIsEditingNotice(false)} className="text-gray-300 hover:text-gray-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <input placeholder="제목" className="w-full bg-gray-50 p-4 rounded-2xl text-sm font-bold outline-none border-none" value={currentNotice.title || ''} onChange={e => setCurrentNotice({...currentNotice, title: e.target.value})} />
              <textarea placeholder="내용" className="w-full h-32 bg-gray-50 p-4 rounded-2xl text-sm font-medium outline-none border-none resize-none" value={currentNotice.content || ''} onChange={e => setCurrentNotice({...currentNotice, content: e.target.value})} />
              <button onClick={handleSaveNotice} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg">저장 완료</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminTabBtn: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number }> = ({ active, onClick, icon, label, badge }) => (
  <button onClick={onClick} className={`relative flex items-center space-x-2 px-6 py-3.5 text-[11px] font-black rounded-[16px] transition-all ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
    {icon}
    <span>{label}</span>
    {badge !== undefined && <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white animate-pulse">{badge}</span>}
  </button>
);

const StatsCard: React.FC<{ icon: React.ReactNode, bg: string, label: string, value: string }> = ({ icon, bg, label, value }) => (
  <div className="bg-white p-7 rounded-[32px] border border-gray-50 shadow-sm flex flex-col items-center"><div className={`${bg} w-14 h-14 rounded-[20px] flex items-center justify-center mb-4`}>{React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' } as any)}</div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{label}</p><p className="text-2xl font-black text-gray-900">{value}</p></div>
);

const HelpItem: React.FC<{ step: string, title: string, desc: string }> = ({ step, title, desc }) => (
  <div className="flex items-start space-x-4 p-4 bg-indigo-50/50 rounded-[24px]"><div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 shadow-md">{step}</div><div><h4 className="text-xs font-black text-gray-800">{title}</h4><p className="text-[10px] text-gray-500 mt-1 font-bold leading-relaxed">{desc}</p></div></div>
);

export default AdminPage;
