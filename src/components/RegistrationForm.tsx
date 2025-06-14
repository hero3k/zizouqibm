'use client';

import { useState } from 'react';

interface RegistrationFormProps {
  onRegister: (name: string) => void;
  isDisabled: boolean;
}

export default function RegistrationForm({ onRegister, isDisabled }: RegistrationFormProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      onRegister(name.trim());
      setName('');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="lychee-leaf mr-2">🍃</span>
        快速报名参赛
      </h3>
      
      {/* 报名提示 */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-700">
          <div className="font-medium mb-1">📝 报名须知：</div>
          <div>• 无需注册登录，输入姓名即可参赛</div>
          <div>• 比赛采用积分制，达到25分进入斩杀阶段</div>
          <div>• 斩杀阶段吃鸡即可获得"桂味之冠"🏆</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入您的姓名..."
            className="w-full px-4 py-3 border-2 border-lychee-green/30 rounded-xl focus:border-lychee-green focus:outline-none transition-colors"
            disabled={isDisabled || isSubmitting}
            maxLength={20}
          />
        </div>
        
        <button
          type="submit"
          disabled={!name.trim() || isDisabled || isSubmitting}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              报名中...
            </span>
          ) : isDisabled ? (
            '比赛已结束'
          ) : (
            <>
              <span className="lychee-leaf mr-2">🍃</span>
              立即报名
            </>
          )}
        </button>
      </form>

      {isDisabled && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 text-sm text-center">
          🏆 比赛已结束，不再接受新的报名
        </div>
      )}
    </div>
  );
} 