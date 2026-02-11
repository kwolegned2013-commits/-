
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNotification } from '../types';
import { Bell, MessageCircle, ChevronLeft, Trash2, CheckCircle2, Clock } from 'lucide-react';

interface NotificationsPageProps {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, setNotifications }) => {
  const navigate = useNavigate();

  // 페이지 진입 시 모든 알림 읽음 처리
  useEffect(() => {
    if (notifications.some(n => !n.isRead)) {
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updated);
    }
  }, []);

  const clearAll = () => {
    if (window.confirm("모든 알림을 삭제할까요?")) {
      setNotifications([]);
    }
  };

  const handleNotiClick = (noti: AppNotification) => {
    navigate(noti.link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <div className="flex items-center justify-between px-1">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 font-bold text-sm">
          <ChevronLeft className="w-5 h-5 mr-1" /> 뒤로가기
        </button>
        {notifications.length > 0 && (
          <button onClick={clearAll} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col space-y-2 px-1">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center">
          <Bell className="w-8 h-8 mr-3 text-indigo-600" /> 알림 센터
        </h1>
        <p className="text-gray-400 text-sm font-medium">새로운 소식을 확인해보세요.</p>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white p-16 rounded-[40px] border border-gray-100 text-center space-y-4">
            <Bell className="w-16 h-16 text-gray-100 mx-auto" />
            <p className="text-gray-300 font-black text-sm">새로운 알림이 없습니다.</p>
          </div>
        ) : (
          notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(noti => (
            <button
              key={noti.id}
              onClick={() => handleNotiClick(noti)}
              className="w-full text-left bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:border-indigo-100 transition-all active:scale-[0.98] flex items-start space-x-4 relative overflow-hidden"
            >
              <div className={`p-3 rounded-2xl ${noti.type === 'notice' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                {noti.type === 'notice' ? <Bell className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${noti.type === 'notice' ? 'text-blue-500' : 'text-indigo-500'}`}>
                    {noti.type === 'notice' ? 'Notice' : 'Community'}
                  </span>
                  <span className="text-[10px] text-gray-300 font-bold flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {new Date(noti.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="font-black text-gray-900 text-base">{noti.title}</h3>
                <p className="text-sm text-gray-500 font-medium line-clamp-1">{noti.message}</p>
              </div>
              {!noti.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full"></div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
