
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord } from '../types';
import { UserCheck, QrCode, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AttendancePageProps {
  user: User;
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ user, attendanceRecords, setAttendanceRecords }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceRecords.find(r => r.userId === user.id && r.date === today);
  
  const [checkedIn, setCheckedIn] = useState(!!todayRecord);
  const [checkTime, setCheckTime] = useState(todayRecord ? new Date(todayRecord.id).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '');

  const handleCheckIn = () => {
    if (checkedIn) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    
    const newRecord: AttendanceRecord = {
      id: now.getTime().toString(),
      userId: user.id,
      userName: user.name,
      date: today,
      status: now.getHours() >= 10 && now.getMinutes() >= 40 ? 'late' : 'present'
    };

    setAttendanceRecords(prev => [...prev, newRecord]);
    setCheckTime(timeStr);
    setCheckedIn(true);
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">주일 출석 체크</h1>
        <p className="text-gray-500 text-sm">예배 10분 전까지 도착해주세요!</p>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Mock QR Area */}
        <div className={`bg-white rounded-3xl p-10 shadow-xl border-4 transition-all duration-500 flex flex-col items-center space-y-6 ${checkedIn ? 'border-green-500 scale-[1.02]' : 'border-indigo-100 hover:border-indigo-200'}`}>
          {!checkedIn ? (
            <>
              <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <QrCode className="w-32 h-32 text-gray-300" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest">Attendance Status</p>
                <p className="text-gray-800 text-sm font-bold">미출석 상태</p>
              </div>
              <button 
                onClick={handleCheckIn}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all hover:bg-indigo-700"
              >
                지금 출석하기
              </button>
            </>
          ) : (
            <>
              <div className="w-48 h-48 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-32 h-32 text-green-500 animate-in zoom-in duration-500" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-black text-gray-900">출석 완료!</p>
                <div className="flex items-center justify-center text-gray-500 space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[11px] font-black">{checkTime} 기록됨</span>
                </div>
              </div>
              <div className="bg-green-50 text-green-700 px-6 py-4 rounded-[20px] text-xs font-black text-center leading-relaxed">
                오늘도 함께 예배하게 되어 기뻐요!<br/>은혜로운 시간 되길 기도합니다.
              </div>
            </>
          )}
        </div>
      </div>

      {!checkedIn && (
        <div className="flex items-start space-x-3 bg-amber-50 text-amber-800 p-5 rounded-[24px] max-w-sm border border-amber-100/50">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-500" />
          <p className="text-[11px] leading-relaxed font-bold">
            10시 40분 이후 출석은 '지각'으로 기록됩니다. <br/>일찍 와서 함께 기도로 준비하는 멋진 청소년이 됩시다!
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
