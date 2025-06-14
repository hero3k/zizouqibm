'use client';

import { useState } from 'react';
import { Player, Match } from '@/types/tournament';
import { SCORE_MAP } from '@/types/tournament';

interface MatchManagerProps {
  players: Player[];
  matches: Match[];
  onAddMatch: (results: { playerId: string; rank: number }[]) => void;
  onDeleteMatch: (matchId: string) => void;
  isDisabled: boolean;
}

export default function MatchManager({ 
  players, 
  matches, 
  onAddMatch, 
  onDeleteMatch, 
  isDisabled 
}: MatchManagerProps) {
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [playerRanks, setPlayerRanks] = useState<Record<string, number>>({});

  const handleAddMatchClick = () => {
    setIsAddingMatch(true);
    setSelectedPlayers([]);
    setPlayerRanks({});
  };

  const handleCancelAdd = () => {
    setIsAddingMatch(false);
    setSelectedPlayers([]);
    setPlayerRanks({});
  };

  const handlePlayerToggle = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
      const newRanks = { ...playerRanks };
      delete newRanks[playerId];
      setPlayerRanks(newRanks);
    } else if (selectedPlayers.length < 8) {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const handleRankChange = (playerId: string, rank: number) => {
    setPlayerRanks({
      ...playerRanks,
      [playerId]: rank
    });
  };

  const handleSubmitMatch = () => {
    const results = selectedPlayers.map(playerId => ({
      playerId,
      rank: playerRanks[playerId] || 1
    }));

    try {
      onAddMatch(results);
      handleCancelAdd();
    } catch (error) {
      console.error('Failed to add match:', error);
    }
  };

  const canSubmitMatch = () => {
    if (selectedPlayers.length === 0) return false;
    
    const ranks = Object.values(playerRanks);
    const expectedRanks = Array.from({length: selectedPlayers.length}, (_, i) => i + 1);
    
    return ranks.length === selectedPlayers.length && 
           ranks.sort().join(',') === expectedRanks.join(',');
  };

  const handleDeleteMatch = (matchId: string) => {
    if (window.confirm('确定要删除这场对局吗？')) {
      onDeleteMatch(matchId);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          ⚔️ 对局管理
        </h3>
        <span className="text-sm text-gray-500">
          ({matches.length}场对局)
        </span>
      </div>

      {/* 添加对局按钮 */}
      {!isAddingMatch && (
        <button
          onClick={handleAddMatchClick}
          disabled={isDisabled || players.length === 0}
          className="btn-secondary w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + 添加新对局
        </button>
      )}

      {/* 添加对局表单 */}
      {isAddingMatch && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-3">新增对局</h4>
          
          {players.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              请先添加参赛选手
            </div>
          ) : (
            <>
              {/* 选手选择 */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  选择参赛选手 (已选择 {selectedPlayers.length}/8):
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {players.map(player => (
                    <button
                      key={player.id}
                      onClick={() => handlePlayerToggle(player.id)}
                      className={`
                        p-2 rounded-lg border-2 text-sm transition-colors
                        ${selectedPlayers.includes(player.id)
                          ? 'bg-lychee-green text-white border-lychee-green'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-lychee-green'
                        }
                      `}
                    >
                      {player.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 排名设置 */}
              {selectedPlayers.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    设置排名:
                  </div>
                  <div className="space-y-2">
                    {selectedPlayers.map(playerId => {
                      const player = players.find(p => p.id === playerId);
                      return (
                        <div key={playerId} className="flex items-center justify-between bg-white p-2 rounded-lg">
                          <span className="font-medium">{player?.name}</span>
                          <div className="flex items-center space-x-2">
                            <select
                              value={playerRanks[playerId] || ''}
                              onChange={(e) => handleRankChange(playerId, parseInt(e.target.value))}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value="">选择排名</option>
                              {Array.from({length: selectedPlayers.length}, (_, i) => i + 1).map(rank => (
                                <option key={rank} value={rank}>
                                  第{rank}名 ({SCORE_MAP[rank]}分)
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmitMatch}
                  disabled={!canSubmitMatch()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  保存对局
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  取消
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 历史对局列表 */}
      <div className="space-y-3">
        {matches.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <div className="text-3xl mb-2">⚔️</div>
            <div>暂无对局记录</div>
          </div>
        ) : (
          matches.slice().reverse().map((match, index) => (
            <div key={match.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-800">
                  对局 #{matches.length - index}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {match.date.toLocaleString('zh-CN')}
                  </span>
                  <button
                    onClick={() => handleDeleteMatch(match.id)}
                    disabled={isDisabled}
                    className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                  >
                    删除
                  </button>
                </div>
              </div>
              
              <div className="grid gap-2">
                {match.results
                  .slice()
                  .sort((a, b) => a.rank - b.rank)
                  .map(result => (
                    <div key={result.playerId} className="flex items-center justify-between bg-white p-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${result.rank === 1 ? 'bg-yellow-400 text-white' :
                            result.rank === 2 ? 'bg-gray-400 text-white' :
                            result.rank === 3 ? 'bg-orange-400 text-white' :
                            'bg-gray-300 text-gray-700'}
                        `}>
                          {result.rank}
                        </div>
                        <span className="font-medium">{result.playerName}</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-600">
                        +{result.score}分
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 