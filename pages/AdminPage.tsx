
import React, { useState } from 'react';
import { User, Notice } from '../types';
import { 
  Users, Calendar, Trash2, Edit, Bell, Plus, Save, X, LayoutDashboard, MapPin, ShieldCheck, HelpCircle, ChevronRight, PenTool
} from 'lucide-react';

type AdminTab = 'dashboard' | 'notices' | 'schedule';

interface AdminPageProps {
  user: User;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  schedules: any[];
  setSchedules: React.Dispatch<React.SetStateAction<any[]>>;
  worshipInfo: { time: string, location: string };
  setWorshipInfo: React.Dispatch<React.SetStateAction<{ time: string, location: string }>>;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
  user, notices, setNotices, schedules, setSchedules, worshipInfo, setWorshipInfo 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Partial<Notice>>({ category: 'info' });
  const [localWorshipInfo, setLocalWorshipInfo] = useState(worshipInfo);
  const [localSchedules, setLocalSchedules] = useState(schedules);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const isMasterAdmin = user.role === 'admin';

  const showStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveNotice = () => {
    if (!currentNotice.title || !currentNotice.content) {
      alert("제목과 내용을 모두 입력해주세요!");
      return;
    }
    
    if (currentNotice.id) {
      setNotices(notices.map(n => n.id === currentNotice.id ? (currentNotice as Notice) : n));
      showStatus("공지사항이 수정되었습니다!");
    } else {
      const newNotice: Notice = {
        ...(currentNotice as Notice),
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        author: user.name
      };
      setNotices([newNotice, ...notices]);
      showStatus("새 공지가 등록되었습니다!");
    }
    setIsEditingNotice(false);
    setCurrentNotice({ category: 'info' });
  };

  const deleteNotice = (id: string) => {
    if(window.confirm("공지를 삭제할까요?")) {
      setNotices(notices.filter(n => n.id !== id));
      showStatus("공지가 삭제되었습니다.");
    }
  };

  const handleGlobalSave = () => {
    setWorshipInfo(localWorshipInfo);
    setSchedules(localSchedules);
    showStatus("모든 정보가 서버에 저장되었습니다!");
  };

  const addScheduleItem = () => {
    setLocalSchedules([...localSchedules, { day: "신규", title: "새 일정 내용", time: "시간" }]);
  };

  const deleteScheduleItem = (index: number) => {
    setLocalSchedules(localSchedules.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-6 pb-24 relative">
      {/* Save Status Toast */}
      {saveStatus && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl z-[200] font-bold text-sm flex items-center border border-white/20 animate-in fade-in slide-in-from-top-4">
          <ShieldCheck className="w-4 h-4 mr-3 text-green-400" />
          {saveStatus}
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">관리자 센터</h1>
          {isMasterAdmin && (
            <span className="bg-amber-500 text-white text-[10px] px-3 py-1 rounded-full font-black flex items-center shadow-sm">
              <ShieldCheck className="w-3 h-3 mr-1" /> 전도사님
            </span>
          )}
        </div>
        <p className="text-gray-500 text-xs font-medium">청소년부의 모든 정보를 직접 수정하고 관리하세요.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-hide">
        <AdminTabBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard className="w-4 h-4" />} label="대시보드" />
        <AdminTabBtn active={activeTab === 'notices'} onClick={() => setActiveTab('notices')} icon={<Bell className="w-4 h-4" />} label="공지 관리" />
        <AdminTabBtn active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={<Calendar className="w-4 h-4" />} label="정보/일정 관리" />
      </div>

      {/* Dashboard & Help */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4">
            <StatsCard icon={<Users className="text-indigo-600" />} bg="bg-indigo-50" label="총 학생수" value="43명" />
            <StatsCard icon={<Bell className="text-emerald-600" />} bg="bg-emerald-50" label="게시된 공지" value={`${notices.length}개`} />
          </div>
          
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center text-indigo-600 font-bold text-sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              수정 방법 안내 (필독!)
            </div>
            <div className="space-y-3">
              <HelpItem step="1" title="공지사항 게시" desc="'공지 관리' 탭에서 [새 공지 작성] 버튼을 클릭하세요." />
              <HelpItem step="2" title="정보 직접 수정" desc="'정보/일정 관리' 탭의 흰색 입력창을 클릭해 직접 타이핑하세요." />
              <HelpItem step="3" title="최종 저장 버튼" desc="수정 후 반드시 하단의 [변경사항 마스터 저장] 버튼을 눌러야 앱에 반영됩니다." />
            </div>
          </section>
        </div>
      )}

      {/* Notice Management */}
      {activeTab === 'notices' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-gray-800 tracking-tight">공지사항 리스트</h2>
            <button 
              onClick={() => { setCurrentNotice({ category: 'info' }); setIsEditingNotice(true); }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center shadow-lg"
            >
              <Plus className="w-4 h-4 mr-1.5" /> 새 공지 작성
            </button>
          </div>

          <div className="space-y-3">
            {notices.map(notice => (
              <div key={notice.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                      notice.category === 'event' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">{notice.date}</span>
                  </div>
                  <h3 className="font-black text-gray-800 text-sm">{notice.title}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => { setCurrentNotice(notice); setIsEditingNotice(true); }} className="p-2 text-gray-300 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteNotice(notice.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Management */}
      {activeTab === 'schedule' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-8 shadow-sm">
            <div className="space-y-5">
              <h3 className="text-sm font-black flex items-center text-gray-900 border-b border-gray-50 pb-3">
                <MapPin className="w-4 h-4 mr-2 text-indigo-500" /> 홈 화면 예배 정보 (클릭하여 수정 가능)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">예배 시간</label>
                  <input 
                    type="text" 
                    value={localWorshipInfo.time} 
                    onChange={e => setLocalWorshipInfo({...localWorshipInfo, time: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-xl p-4 text-sm font-bold transition-all outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">예배 장소</label>
                  <input 
                    type="text" 
                    value={localWorshipInfo.location} 
                    onChange={e => setLocalWorshipInfo({...localWorshipInfo, location: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-xl p-4 text-sm font-bold transition-all outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-sm font-black flex items-center text-gray-900 border-b border-gray-50 pb-3">
                <Calendar className="w-4 h-4 mr-2 text-indigo-500" /> 주간 일정 세부 관리 (클릭하여 수정 가능)
              </h3>
              <div className="space-y-3">
                {localSchedules.map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <input 
                      type="text" 
                      value={item.day} 
                      onChange={e => {
                        const newSched = [...localSchedules];
                        newSched[i].day = e.target.value;
                        setLocalSchedules(newSched);
                      }}
                      className="w-14 h-10 bg-white rounded-xl font-black text-sm text-indigo-600 border border-gray-200 text-center outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                    <div className="flex-1 space-y-1">
                      <input 
                        type="text" 
                        value={item.title} 
                        onChange={e => {
                          const newSched = [...localSchedules];
                          newSched[i].title = e.target.value;
                          setLocalSchedules(newSched);
                        }}
                        className="bg-transparent border-none p-0 text-sm font-bold focus:ring-0 w-full" 
                      />
                      <input 
                        type="text" 
                        value={item.time} 
                        onChange={e => {
                          const newSched = [...localSchedules];
                          newSched[i].time = e.target.value;
                          setLocalSchedules(newSched);
                        }}
                        className="bg-transparent border-none p-0 text-[11px] text-gray-400 font-medium focus:ring-0 w-full" 
                      />
                    </div>
                    <button onClick={() => deleteScheduleItem(i)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <button 
                onClick={addScheduleItem}
                className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-xs font-black text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 flex items-center justify-center transition-all"
              >
                <Plus className="w-4 h-4 mr-2" /> 일정 한 줄 추가
              </button>
            </div>
            
            <button 
              onClick={handleGlobalSave}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black flex items-center justify-center shadow-xl active:scale-95 transition-all"
            >
              <Save className="w-5 h-5 mr-2 text-amber-400" /> 변경사항 마스터 저장 (학생들에게 반영)
            </button>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {isEditingNotice && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-white w-full max-md rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-gray-900">공지 작성/수정</h2>
              <button onClick={() => setIsEditingNotice(false)} className="text-gray-300 hover:text-gray-600"><X className="w-7 h-7" /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">제목</label>
                <input 
                  placeholder="제목을 입력하세요"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={currentNotice.title || ''}
                  onChange={e => setCurrentNotice({...currentNotice, title: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">내용</label>
                <textarea 
                  placeholder="아이들에게 전할 말을 적어주세요..."
                  className="w-full h-44 resize-none bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={currentNotice.content || ''}
                  onChange={e => setCurrentNotice({...currentNotice, content: e.target.value})}
                />
              </div>
              <button 
                onClick={handleSaveNotice}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl"
              >
                {currentNotice.id ? '수정 완료' : '공지 올리기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminTabBtn: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-5 py-3 text-xs font-black rounded-xl transition-all ${
      active ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatsCard: React.FC<{ icon: React.ReactNode, bg: string, label: string, value: string }> = ({ icon, bg, label, value }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex flex-col items-center">
    <div className={`${bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-3`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' } as any)}
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-black text-gray-900">{value}</p>
  </div>
);

const HelpItem: React.FC<{ step: string, title: string, desc: string }> = ({ step, title, desc }) => (
  <div className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-2xl">
    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0">
      {step}
    </div>
    <div>
      <h4 className="text-xs font-black text-gray-800">{title}</h4>
      <p className="text-[10px] text-gray-500 mt-0.5">{desc}</p>
    </div>
  </div>
);

export default AdminPage;
