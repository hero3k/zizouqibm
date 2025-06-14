import React from 'react';

interface TournamentHeaderProps {
  playerCount: number;
  championCount: number;
  isFinished: boolean;
}

export default function TournamentHeader({ 
  playerCount, 
  championCount, 
  isFinished 
}: TournamentHeaderProps) {
  return (
    <div className="text-center">
      <div className="relative">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          <span className="inline-block animate-bounce-slow">🌟</span>
          <span className="mx-4 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
            桂味杯
          </span>
          <span className="inline-block animate-bounce-slow">🌟</span>
        </h1>
        
        <div className="text-xl md:text-2xl text-white/90 mb-2">
          自走棋比赛
        </div>
        
        <div className="text-lg text-white/80 mb-2">
          6.15-6.20 | 21:30-24:00
        </div>
        
        <div className="text-base text-white/70 mb-6">
          🎯 目标：获得"桂味之冠" | 🏆 奖励：桂味荔枝6斤
        </div>

        {/* 装饰性荔枝叶子 */}
        <div className="absolute -top-2 -left-4 text-2xl lychee-leaf">🍃</div>
        <div className="absolute -top-2 -right-4 text-2xl lychee-leaf">🍃</div>
      </div>

      {/* 比赛状态信息 */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
          <span className="font-semibold">参赛人数：</span>
          <span className="text-yellow-300">{playerCount}</span>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
          <span className="font-semibold">桂味之冠：</span>
          <span className="text-yellow-300">{championCount}/3</span>
        </div>
        
        {isFinished && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-6 py-2 text-white font-bold animate-pulse">
            🏆 比赛结束
          </div>
        )}
      </div>
    </div>
  );
} 