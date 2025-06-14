'use client';

import React, { useState, useEffect } from 'react';
import { TournamentState } from '@/types/tournament';
import { 
  loadTournamentData, 
  saveTournamentData, 
  addPlayer, 
  addMatch, 
  deleteMatch, 
  getLeaderboard,
  getStatusText,
  getStatusClass 
} from '@/utils/tournament';
import RegistrationForm from '@/components/RegistrationForm';
import Leaderboard from '@/components/Leaderboard';
import MatchManager from '@/components/MatchManager';
import TournamentHeader from '@/components/TournamentHeader';

export default function HomePage() {
  const [tournamentState, setTournamentState] = useState<TournamentState>({
    players: [],
    matches: [],
    isFinished: false,
    championCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // 加载数据
  useEffect(() => {
    const data = loadTournamentData();
    setTournamentState(data);
    setLoading(false);
  }, []);

  // 保存数据
  useEffect(() => {
    if (!loading) {
      saveTournamentData(tournamentState);
    }
  }, [tournamentState, loading]);

  // 显示通知
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // 处理报名
  const handleRegistration = (name: string) => {
    try {
      const newState = addPlayer(tournamentState, name);
      setTournamentState(newState);
      showNotification('success', `${name} 报名成功！`);
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : '报名失败');
    }
  };

  // 处理添加对局
  const handleAddMatch = (results: { playerId: string; rank: number }[]) => {
    try {
      const newState = addMatch(tournamentState, results);
      setTournamentState(newState);
      showNotification('success', '对局添加成功！');
      
      // 检查是否有新冠军
      if (newState.championCount > tournamentState.championCount) {
        const newChampions = newState.championCount - tournamentState.championCount;
        showNotification('success', `🎉 恭喜！新增 ${newChampions} 位桂味之冠！`);
      }
      
      // 检查比赛是否结束
      if (newState.isFinished && !tournamentState.isFinished) {
        showNotification('success', '🏆 比赛结束！三位桂味之冠已产生！');
      }
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : '添加对局失败');
    }
  };

  // 处理删除对局
  const handleDeleteMatch = (matchId: string) => {
    try {
      const newState = deleteMatch(tournamentState, matchId);
      setTournamentState(newState);
      showNotification('success', '对局删除成功！');
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : '删除对局失败');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  const leaderboard = getLeaderboard(tournamentState.players);

  return (
    <div className="min-h-screen p-4">
      {/* 通知组件 */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* 比赛结束横幅 */}
      {tournamentState.isFinished && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-yellow-400 to-orange-400 text-center py-4">
          <div className="text-2xl font-bold text-white animate-pulse">
            🏆 比赛结束！恭喜三位桂味之冠获得者！🏆
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto ${tournamentState.isFinished ? 'mt-20' : ''}`}>
        {/* 页面标题 */}
        <TournamentHeader 
          playerCount={tournamentState.players.length}
          championCount={tournamentState.championCount}
          isFinished={tournamentState.isFinished}
        />

        {/* 比赛信息横幅 */}
        <div className="mt-8 mb-6">
          <div className="card bg-gradient-to-r from-lychee-pink/10 to-lychee-green/10 border-lychee-pink/30">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
                <span className="lychee-leaf mr-2">🍃</span>
                "桂味杯"自走棋比赛规则
                <span className="lychee-leaf ml-2">🍃</span>
              </h2>
              <div className="text-gray-600">
                <strong>比赛时间：</strong>6月15日-6月20日 | 每晚21:30-24:00
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 积分规则 */}
              <div className="bg-white/50 rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                  ⭐ 积分规则
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <div>🥇 第1名：8分</div>
                  <div>🥈 第2名：6分</div>
                  <div>🥉 第3名：5分</div>
                  <div>📍 第4名：4分</div>
                  <div>📍 第5名：3分</div>
                  <div>📍 第6名：2分</div>
                  <div>📍 第7名：1分</div>
                  <div>📍 第8名：0分</div>
                </div>
              </div>

              {/* 斩杀阶段 */}
              <div className="bg-white/50 rounded-xl p-4 border border-orange-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                  <span className="fire mr-1">🔥</span> 斩杀阶段
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• <strong>触发条件：</strong>总积分≥25分</div>
                  <div>• <strong>特殊标识：</strong>火焰图标显示</div>
                  <div>• <strong>不再积分：</strong>只能争夺冠军</div>
                  <div>• <strong>获胜条件：</strong>对局第一名</div>
                </div>
              </div>

              {/* 桂味之冠 */}
              <div className="bg-white/50 rounded-xl p-4 border border-yellow-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                  <span className="crown mr-1">👑</span> 桂味之冠
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• <strong>获得方式：</strong>斩杀阶段吃鸡</div>
                  <div>• <strong>特殊效果：</strong>金色光晕显示</div>
                  <div>• <strong>荣誉称号：</strong>"桂味之冠"</div>
                  <div>• <strong>比赛地位：</strong>永久冠军</div>
                </div>
              </div>

              {/* 奖励说明 */}
              <div className="bg-white/50 rounded-xl p-4 border border-green-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                  🎁 奖励说明
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• <strong>前三名：</strong>桂味荔枝6斤</div>
                  <div>• <strong>参赛规模：</strong>约10人</div>
                  <div>• <strong>对局总数：</strong>约10场</div>
                  <div>• <strong>结束条件：</strong>3位桂味之冠</div>
                </div>
              </div>
            </div>

            {/* 重要提示 */}
            <div className="mt-4 p-3 bg-lychee-pink/10 border border-lychee-pink/30 rounded-lg">
              <div className="text-center text-sm text-gray-700">
                <strong className="text-lychee-pink">⚡ 重要：</strong>
                当三位选手获得"桂味之冠"后，比赛将自动结束！快来报名参加这场激烈的荔枝主题自走棋大战吧！
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：报名表单 */}
          <div className="space-y-6">
            <RegistrationForm 
              onRegister={handleRegistration}
              isDisabled={tournamentState.isFinished}
            />
          </div>

          {/* 中间：积分排行榜 */}
          <div>
            <Leaderboard players={leaderboard} />
          </div>

          {/* 右侧：对局管理 */}
          <div>
            <MatchManager 
              players={tournamentState.players}
              matches={tournamentState.matches}
              onAddMatch={handleAddMatch}
              onDeleteMatch={handleDeleteMatch}
              isDisabled={tournamentState.isFinished}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 