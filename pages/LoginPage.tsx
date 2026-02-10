
import React, { useState } from 'react';
import { User } from '../types';
import { Smile, ShieldCheck, User as UserIcon, Lock, Settings, Sparkles, AlertCircle } from 'lucide-react';

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
  const SPECIAL_TEACHER_NAMES = ['오환희'];

  const handleLogin = (selectedRole: 'student' | 'teacher') => {
    let hasError = false;
    const trimmedName = userName.trim();

    // 1. 성함 입력 확인
    if (!trimmedName) {
      setNameError('성함을 입력해주세요!');
      hasError = true;
    } else {
      setNameError('');
    }

    if (hasError) return;

    // 2. 관리자(마스터) 체크: 강은택, 김우신, 이승기
    if (MASTER_NAMES.includes(trimmedName)) {
      onLogin({
        id: `admin_${Date.now()}`,
        name: trimmedName,
        role: 'admin'
      });
      return;
    }

    // 3. 특별 선생님 체크: 오환희
    if (SPECIAL_TEACHER_NAMES.includes(trimmedName)) {
      onLogin({
        id: `teacher_${Date.now()}`,
        name: trimmedName,
        role: 'teacher'
      });
      return;
    }

    // 4. 일반 사용자(학생/선생님)인 경우 비밀번호 확인
    if (password !== REQUIRED_PASSWORD) {
      setPassError('비밀번호가 틀렸습니다 (12345678)');
      return;
    } else {
      setPassError('');
    }
    
    // 5. 일반 사용자 로그인
    const mockUser: User = {
      id: `${selectedRole[0]}_${Date.now()}`,
      name: trimmedName,
      role: selectedRole,
      grade: selectedRole === 'student' ? 10 : undefined
    };
    
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      {/* Brand Logo Section */}
      <div className="mb-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center leading-none text-white mb-6">
          <div className="font-black text-6xl tracking-tighter flex items-end">
            <span>W</span><span className="transform -scale-x-100 -ml-1">E</span>
          </div>
          <div className="w-full flex justify-center -mt-2">
             <svg width="60" height="20" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M2 2C6 6 18 6 22 2" stroke="white" strokeWidth="2" strokeLinecap="round" />
             </svg>
          </div>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">우리는 청소년부</h1>
        <p className="text-gray-400 text-sm mt-2 font-medium opacity-80">함께 웃고 성장하는 우리들의 공간</p>
      </div>

      {/* Login Form Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="space-y-4">
          <div className="text-center mb-2">
            <p className="text-xs font-bold text-gray-500 italic">"성함을 입력하신 후 직분을 선택하세요."</p>
          </div>
          
          <div className="space-y-1">
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
            className="flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-2xl border border-indigo-100 hover:bg-indigo-100 hover:shadow-md active:scale-95 transition-all group"
          >
            <Smile className="w-8 h-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-indigo-700">학생</span>
          </button>
          
          <button 
            onClick={() => handleLogin('teacher')}
            className="flex flex-col items-center justify-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100 hover:shadow-md active:scale-95 transition-all group"
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
