
import React, { useState } from 'react';
import { User } from '../types';
import { UserCheck, QrCode, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AttendancePage: React.FC<{ user: User }> = ({ user }) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkTime, setCheckTime] = useState('');

  const handleCheckIn = () => {
    const now = new Date();
    setCheckTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
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
        <div className={`bg-white rounded-3xl p-10 shadow-xl border-4 transition-colors duration-500 flex flex-col items-center space-y-6 ${checkedIn ? 'border-green-500' : 'border-indigo-100'}`}>
          {!checkedIn ? (
            <>
              <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <QrCode className="w-32 h-32 text-gray-300" />
              </div>
              <p className="text-gray-400 text-xs text-center">선생님께 QR코드를 보여주거나<br/>아래 버튼을 눌러주세요.</p>
              <button 
                onClick={handleCheckIn}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
              >
                출석하기
              </button>
            </>
          ) : (
            <>
              <div className="w-48 h-48 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-32 h-32 text-green-500 animate-in zoom-in duration-300" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-1">출석 완료!</p>
                <div className="flex items-center justify-center text-gray-500 space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{checkTime} 기록됨</span>
                </div>
              </div>
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                오늘도 함께 예배하게 되어 기뻐요!
              </div>
            </>
          )}
        </div>
      </div>

      {!checkedIn && (
        <div className="flex items-start space-x-2 bg-amber-50 text-amber-800 p-4 rounded-xl max-w-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">
            10시 40분 이후 출석은 '지각'으로 기록됩니다. 일찍 와서 함께 기도로 준비해요!
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
