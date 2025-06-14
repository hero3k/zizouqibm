import { TournamentState } from '@/types/tournament';

const API_BASE = '/api/tournament';

// 从云端获取比赛数据
export async function fetchTournamentData(): Promise<TournamentState> {
  try {
    const response = await fetch(API_BASE, {
      method: 'GET',
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 转换日期字符串为Date对象
    if (data.players) {
      data.players = data.players.map((p: any) => ({
        ...p,
        registeredAt: new Date(p.registeredAt)
      }));
    }
    
    if (data.matches) {
      data.matches = data.matches.map((m: any) => ({
        ...m,
        date: new Date(m.date),
        createdAt: new Date(m.createdAt)
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch tournament data:', error);
    // 如果网络失败，返回空状态
    return {
      players: [],
      matches: [],
      isFinished: false,
      championCount: 0
    };
  }
}

// 保存比赛数据到云端
export async function saveTournamentData(data: TournamentState): Promise<boolean> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save tournament data:', error);
    return false;
  }
}

// 重置比赛数据（管理员功能）
export async function resetTournamentData(): Promise<boolean> {
  try {
    const response = await fetch(API_BASE, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to reset tournament data:', error);
    return false;
  }
} 