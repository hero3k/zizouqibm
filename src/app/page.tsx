'use client';

import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { TournamentState } from '@/types/tournament';
import { 
  addPlayer, 
  addMatch, 
  deleteMatch, 
  getLeaderboard 
} from '@/utils/tournament';
import { fetchTournamentData, saveTournamentData } from '@/utils/api';
import RegistrationForm from '@/components/RegistrationForm';
import Leaderboard from '@/components/Leaderboard';
import MatchManager from '@/components/MatchManager';
import TournamentHeader from '@/components/TournamentHeader';

export default function HomePage() {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // 使用SWR进行数据同步
  const { data: tournamentState, error, isLoading } = useSWR(
    'tournament-data',
    fetchTournamentData,
    {
      refreshInterval: 3000, // 每3秒自动刷新
      revalidateOnFocus: true, // 页面获得焦点时刷新
      revalidateOnReconnect: true, // 网络重连时刷新
    }
  );

  // 显示通知
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // 更新数据并同步到云端
  const updateTournamentData = async (newState: TournamentState) => {
    try {
      // 先乐观更新本地数据
      mutate('tournament-data', newState, false);
      
      // 保存到云端
      const success = await saveTournamentData(newState);
      
      if (success) {
        // 成功后刷新数据
        mutate('tournament-data');
      } else {
        // 失败时恢复原数据
        mutate('tournament-data');
        showNotification('error', '同步失败，请检查网络连接');
      }
    } catch (error) {
      showNotification('error', '操作失败');
      mutate('tournament-data'); // 恢复数据
    }
  };

  // 处理报名
  const handleRegistration = async (name: string) => {
    if (!tournamentState) return;
    
    try {
      const newState = addPlayer(tournamentState, name);
      await updateTournamentData(newState);
      showNotification('success', `${name} 报名成功！数据已同步到云端`);
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : '报名失败');
    }
  };

  // 处理添加对局
  const handleAddMatch = async (results: { playerId: string; rank: number }[]) => {
    if (!tournamentState) return;
    
    try {
      const newState = addMatch(tournamentState, results);
      await updateTournamentData(newState);
      showNotification('success', '对局添加成功！所有设备已同步更新');
      
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
  const handleDeleteMatch = async (matchId: string) => {
    if (!tournamentState) return;
    
    try {
      const newState = deleteMatch(tournamentState, matchId);
      await updateTournamentData(newState);
      showNotification('success', '对局删除成功！所有设备已同步更新');
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : '删除对局失败');
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-lychee-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">正在同步云端数据...</div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ 网络连接失败</div>
          <button 
            onClick={() => mutate('tournament-data')}
            className="btn-primary"
          >
            重新连接
          </button>
        </div>
      </div>
    );
  }

  if (!tournamentState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">初始化中...</div>
      </div>
    );
  }

  const leaderboard = getLeaderboard(tournamentState.players);

  return (
    <div className="min-h-screen p-4">
      {/* 云同步状态指示器 */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
          云端同步
        </div>
      </div>

      {/* 通知组件 */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : notification.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
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
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center">
                <span className="lychee-leaf mr-2">🍃</span>
                "桂味杯"比赛规则
                <span className="lychee-leaf ml-2">🍃</span>
              </h2>
              <div className="text-sm text-gray-600">
                <strong>时间：</strong>6.15-6.20 每晚21:30-24:00 | <strong>奖励：</strong>前三名获得桂味荔枝6斤
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 积分规则 */}
              <div className="bg-white/50 rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2 text-center">⭐ 积分规则</h4>
                <div className="text-center text-sm text-gray-700">
                  1-8名分别获得：<br/>
                  <strong className="text-lychee-pink">8-6-5-4-3-2-1-0分</strong>
                </div>
              </div>

              {/* 斩杀阶段 */}
              <div className="bg-white/50 rounded-xl p-4 border border-orange-200">
                <h4 className="font-bold text-gray-800 mb-2 text-center">
                  <span className="fire mr-1">🔥</span> 斩杀阶段
                </h4>
                <div className="text-center text-sm text-gray-700">
                  达到<strong className="text-orange-600">25分</strong>进入斩杀<br/>
                  吃鸡即可获得桂味之冠
                </div>
              </div>

              {/* 比赛结束 */}
              <div className="bg-white/50 rounded-xl p-4 border border-yellow-200">
                <h4 className="font-bold text-gray-800 mb-2 text-center">
                  <span className="crown mr-1">👑</span> 比赛结束
                </h4>
                <div className="text-center text-sm text-gray-700">
                  <strong className="text-yellow-600">3位</strong>桂味之冠产生后<br/>
                  比赛自动结束
                </div>
              </div>
            </div>

            {/* 云同步提示 */}
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-center text-xs text-blue-600">
                <strong>☁️ 云端同步：</strong>
                所有设备实时同步，任何人都可以报名和添加对局！
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