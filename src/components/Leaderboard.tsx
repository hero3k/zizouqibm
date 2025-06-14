'use client';

import { Player } from '@/types/tournament';
import { getStatusText, getStatusClass } from '@/utils/tournament';

interface LeaderboardProps {
  players: Player[];
}

export default function Leaderboard({ players }: LeaderboardProps) {
  if (players.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          📊 积分排行榜
        </h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🍃</div>
          <div>暂无参赛选手</div>
          <div className="text-sm mt-1">快来报名参加比赛吧！</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        📊 积分排行榜
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({players.length}人)
        </span>
      </h3>
      
      <div className="space-y-3">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`
              flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200
              ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 
                index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200' :
                index === 2 ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' :
                'bg-gray-50 border-gray-200'}
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${index === 0 ? 'bg-yellow-400 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-400 text-white' :
                  'bg-gray-300 text-gray-700'}
              `}>
                {index + 1}
              </div>
              
              <div className="font-semibold text-gray-800">
                {player.name}
              </div>
              
              <span className={getStatusClass(player.status)}>
                {getStatusText(player.status)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-gray-800">
                {player.totalScore}
              </div>
              <div className="text-sm text-gray-500">分</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="text-sm text-orange-700 flex items-center">
          <span className="fire mr-1">🔥</span>
          <span className="font-medium">斩杀线：25分</span>
          <span className="ml-2">达到25分进入斩杀阶段，吃鸡即可获得桂味之冠！</span>
        </div>
      </div>
    </div>
  );
} 