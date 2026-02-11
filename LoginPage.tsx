
import React, { useState } from 'react';
import { User } from '../types';
import { Smile, ShieldCheck, User as UserIcon, Lock, Sparkles, AlertCircle, Music } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [passError, setPassError] = useState('');

  const REQUIRED_PASSWORD = '12345678';
  const MASTER_NAMES = ['강은택', '김우신', '이승기'];
  const SPECIAL_LEADER_NAMES = ['오환희'];

  const handleLogin = (selectedRole: 'student' | 'teacher') => {
    let hasError = false;
    const trimmedName = userName.trim();

    if (!trimmedName) {
      setNameError('성함을 입력해주세요!');
      hasError = true;
    } else {
      setNameError('');
    }

    if (hasError) return;

    // 전도사님 (Admin) 체크
    if (MASTER_NAMES.includes(trimmedName)) {
      onLogin({
        id: `admin_${Date.now()}`,
        name: trimmedName,
        role: 'admin'
      });
      return;
    }

    // 찬양 리더 체크
    if (SPECIAL_LEADER_NAMES.includes(trimmedName)) {
      onLogin({
        id: `leader_${Date.now()}`,
        name: trimmedName,
        role: 'leader'
      });
      return;
    }

    // 일반 비밀번호 체크
    if (password !== REQUIRED_PASSWORD) {
      setPassError('비밀번호가 틀렸습니다 (12345678)');
      return;
    } else {
      setPassError('');
    }
    
    const mockUser: User = {
      id: `${selectedRole[0]}_${Date.now()}`,
      name: trimmedName,
      role: selectedRole,
      grade: selectedRole === 'student' ? 10 : undefined
    };
    
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-600/20 blur-[100px] rounded-full"></div>
      
      <div className="mb-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="flex flex-col items-center leading-none text-white mb-6">
          <div className="font-black text-7xl tracking-tighter flex items-center">
            <span>WE</span>
          </div>
          <div className="w-full flex justify-center -mt-2">
             <svg width="70" height="20" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M2 2C6 6 18 6 22 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
             </svg>
          </div>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">우리는 청소년부</h1>
        <p className="text-gray-400 text-sm mt-2 font-medium opacity-80">함께 웃고 성장하는 우리들의 공간</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl space-y-6 relative z-10 border border-white/10">
        <div className="space-y-4">
          <div className="text-center mb-2">
            <p className="text-[11px] font-black text-gray-400 tracking-wider">MEMBER LOGIN</p>
          </div>
          
          <div className="space-y-1">
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text" 
                placeholder="성함을 입력하세요"
                className={`w-full bg-gray-50 border ${nameError ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100'} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (nameError) setNameError('');
                }}
              />
            </div>
            {nameError && (
              <p className="text-[11px] text-red-500 font-bold ml-2 animate-pulse flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" /> {nameError}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="password" 
                placeholder="비밀번호 (12345678)"
                className={`w-full bg-gray-50 border ${passError ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100'} rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passError) setPassError('');
                }}
              />
            </div>
            {passError && (
              <p className="text-[11px] text-red-500 font-bold ml-2 animate-pulse">{passError}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={() => handleLogin('student')}
            className="flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-[24px] border border-indigo-100 hover:bg-indigo-100 hover:shadow-md active:scale-95 transition-all group"
          >
            <Smile className="w-8 h-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-indigo-700">학생</span>
          </button>
          
          <button 
            onClick={() => handleLogin('teacher')}
            className="flex flex-col items-center justify-center p-6 bg-emerald-50 rounded-[24px] border border-emerald-100 hover:bg-emerald-100 hover:shadow-md active:scale-95 transition-all group"
          >
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-emerald-700">선생님</span>
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center space-y-4 text-center">
        <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
          <p className="text-[10px] text-gray-400 font-medium italic flex items-center">
            <Sparkles className="w-3 h-3 mr-2 text-amber-500" /> Authorized Access Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
