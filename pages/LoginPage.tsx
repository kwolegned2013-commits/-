
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Smile, ShieldCheck, User as UserIcon, Lock, AlertCircle, UserCheck, KeyRound } from 'lucide-react';
import { Logo } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
  verifiedUsers: {name: string, role: string}[];
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, verifiedUsers }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [passError, setPassError] = useState('');
  const navigate = useNavigate();

  const REQUIRED_PASSWORD = '12345678';

  const handleLogin = (intendedRole: 'student' | 'teacher') => {
    let hasError = false;
    const trimmedName = userName.trim();

    if (!trimmedName) {
      setNameError('성함을 입력해주세요!');
      hasError = true;
    } else {
      setNameError('');
    }

    if (password !== REQUIRED_PASSWORD) {
      setPassError('비밀번호를 확인해주세요.');
      hasError = true;
    } else {
      setPassError('');
    }

    if (hasError) return;

    const verifiedUser = verifiedUsers.find(u => u.name === trimmedName);
    
    if (verifiedUser) {
      onLogin({
        id: `${verifiedUser.role[0]}_${Date.now()}`,
        name: trimmedName,
        role: verifiedUser.role as any
      });
      navigate('/'); // 로그인 후 즉시 홈으로 이동
      return;
    }

    onLogin({
      id: `${intendedRole[0]}_${Date.now()}`,
      name: trimmedName,
      role: intendedRole,
      grade: intendedRole === 'student' ? 10 : undefined
    });
    navigate('/'); // 로그인 후 즉시 홈으로 이동
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-600/20 blur-[100px] rounded-full"></div>
      
      <div className="mb-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 relative z-10 text-center">
        <Logo inverted className="mb-8 scale-110" />
        <h1 className="text-3xl font-black text-white tracking-tighter">우리는 청소년부</h1>
        <p className="text-gray-400 text-sm mt-3 font-medium opacity-80 leading-relaxed">
          관리자가 등록한 성함으로 로그인하면<br/>자동으로 신분이 확인됩니다.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4 relative z-10">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-1 border border-white/10 shadow-xl">
          <div className="bg-white rounded-[22px] p-5 space-y-4">
            <div className="flex items-center space-x-2 ml-1">
              <UserIcon className="w-4 h-4 text-indigo-600" />
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name (성함)</label>
            </div>
            <input 
              type="text" 
              placeholder="성함을 입력하세요"
              className={`w-full bg-gray-50 border ${nameError ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-100'} rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {nameError && <p className="text-[11px] text-red-500 font-bold ml-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {nameError}</p>}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-1 border border-white/10 shadow-xl">
          <div className="bg-white rounded-[22px] p-5 space-y-4">
            <div className="flex items-center space-x-2 ml-1">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password (비밀번호)</label>
            </div>
            <input 
              type="password" 
              placeholder="비밀번호 8자리"
              className={`w-full bg-gray-50 border ${passError ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-100'} rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin('student')}
            />
            {passError && <p className="text-[11px] text-red-500 font-bold ml-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {passError}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button 
            onClick={() => handleLogin('student')}
            className="flex flex-col items-center justify-center p-6 bg-indigo-600 text-white rounded-[28px] hover:bg-indigo-700 active:scale-95 transition-all shadow-xl group"
          >
            <Smile className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black">학생 로그인</span>
          </button>
          
          <button 
            onClick={() => handleLogin('teacher')}
            className="flex flex-col items-center justify-center p-6 bg-emerald-600 text-white rounded-[28px] hover:bg-emerald-700 active:scale-95 transition-all shadow-xl group"
          >
            <ShieldCheck className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black">선생님 로그인</span>
          </button>
        </div>
      </div>

      <div className="mt-10 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
        <p className="text-[10px] text-gray-400 font-bold flex items-center">
          <UserCheck className="w-3 h-3 mr-2 text-indigo-400" /> 명단에 없어도 버튼을 선택해 시작할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
