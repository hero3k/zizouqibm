import { 
  Player, 
  Match, 
  TournamentState, 
  PlayerStatus, 
  SCORE_MAP, 
  ELIMINATION_THRESHOLD, 
  MAX_CHAMPIONS 
} from '@/types/tournament';

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 从localStorage加载数据
export function loadTournamentData(): TournamentState {
  if (typeof window === 'undefined') {
    return {
      players: [],
      matches: [],
      isFinished: false,
      championCount: 0
    };
  }

  try {
    const data = localStorage.getItem('tournament-data');
    if (data) {
      const parsed = JSON.parse(data);
      // 转换日期字符串为Date对象
      parsed.players = parsed.players.map((p: any) => ({
        ...p,
        registeredAt: new Date(p.registeredAt)
      }));
      parsed.matches = parsed.matches.map((m: any) => ({
        ...m,
        date: new Date(m.date),
        createdAt: new Date(m.createdAt)
      }));
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load tournament data:', error);
  }

  return {
    players: [],
    matches: [],
    isFinished: false,
    championCount: 0
  };
}

// 保存数据到localStorage
export function saveTournamentData(data: TournamentState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('tournament-data', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save tournament data:', error);
  }
}

// 添加新选手
export function addPlayer(state: TournamentState, name: string): TournamentState {
  if (state.players.some(p => p.name === name)) {
    throw new Error('选手已存在');
  }

  const newPlayer: Player = {
    id: generateId(),
    name,
    totalScore: 0,
    status: PlayerStatus.NORMAL,
    registeredAt: new Date()
  };

  return {
    ...state,
    players: [...state.players, newPlayer]
  };
}

// 计算选手状态
function calculatePlayerStatus(score: number, currentStatus: PlayerStatus): PlayerStatus {
  if (currentStatus === PlayerStatus.CHAMPION) {
    return PlayerStatus.CHAMPION;
  }
  
  if (score >= ELIMINATION_THRESHOLD) {
    return PlayerStatus.ELIMINATION;
  }
  
  return PlayerStatus.NORMAL;
}

// 更新选手积分和状态
function updatePlayersScores(players: Player[], matches: Match[]): Player[] {
  return players.map(player => {
    // 计算总积分
    const totalScore = matches.reduce((total, match) => {
      const result = match.results.find(r => r.playerId === player.id);
      return total + (result ? result.score : 0);
    }, 0);

    // 计算状态
    const newStatus = calculatePlayerStatus(totalScore, player.status);

    return {
      ...player,
      totalScore,
      status: newStatus
    };
  });
}

// 添加对局
export function addMatch(state: TournamentState, results: { playerId: string; rank: number }[]): TournamentState {
  if (state.isFinished) {
    throw new Error('比赛已结束');
  }

  // 验证结果
  const ranks = results.map(r => r.rank).sort();
  const expectedRanks = Array.from({length: results.length}, (_, i) => i + 1);
  if (JSON.stringify(ranks) !== JSON.stringify(expectedRanks)) {
    throw new Error('排名必须是连续的且不重复');
  }

  // 创建对局结果
  const matchResults = results.map(result => {
    const player = state.players.find(p => p.id === result.playerId);
    if (!player) {
      throw new Error('选手不存在');
    }

    return {
      playerId: result.playerId,
      playerName: player.name,
      rank: result.rank,
      score: SCORE_MAP[result.rank]
    };
  });

  const newMatch: Match = {
    id: generateId(),
    date: new Date(),
    results: matchResults,
    createdAt: new Date()
  };

  const newMatches = [...state.matches, newMatch];
  let updatedPlayers = updatePlayersScores(state.players, newMatches);

  // 检查是否有新的冠军
  const eliminationPlayers = updatedPlayers.filter(p => p.status === PlayerStatus.ELIMINATION);
  
  // 在斩杀阶段中，第一名获得冠军
  const newChampions = matchResults
    .filter(result => result.rank === 1) // 只有第一名
    .map(result => result.playerId)
    .filter(playerId => {
      const player = updatedPlayers.find(p => p.id === playerId);
      return player && player.status === PlayerStatus.ELIMINATION;
    });

  // 更新冠军状态
  updatedPlayers = updatedPlayers.map(player => {
    if (newChampions.includes(player.id)) {
      return { ...player, status: PlayerStatus.CHAMPION };
    }
    return player;
  });

  const championCount = updatedPlayers.filter(p => p.status === PlayerStatus.CHAMPION).length;
  const isFinished = championCount >= MAX_CHAMPIONS;

  return {
    ...state,
    players: updatedPlayers,
    matches: newMatches,
    championCount,
    isFinished
  };
}

// 删除对局
export function deleteMatch(state: TournamentState, matchId: string): TournamentState {
  const newMatches = state.matches.filter(m => m.id !== matchId);
  const updatedPlayers = updatePlayersScores(state.players, newMatches);
  
  const championCount = updatedPlayers.filter(p => p.status === PlayerStatus.CHAMPION).length;
  const isFinished = championCount >= MAX_CHAMPIONS;

  return {
    ...state,
    players: updatedPlayers,
    matches: newMatches,
    championCount,
    isFinished
  };
}

// 获取排行榜（按积分排序）
export function getLeaderboard(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    // 冠军排在最前面
    if (a.status === PlayerStatus.CHAMPION && b.status !== PlayerStatus.CHAMPION) return -1;
    if (b.status === PlayerStatus.CHAMPION && a.status !== PlayerStatus.CHAMPION) return 1;
    
    // 按积分排序
    if (a.totalScore !== b.totalScore) return b.totalScore - a.totalScore;
    
    // 积分相同按注册时间排序
    return a.registeredAt.getTime() - b.registeredAt.getTime();
  });
}

// 获取状态显示文本
export function getStatusText(status: PlayerStatus): string {
  switch (status) {
    case PlayerStatus.NORMAL:
      return '🍃 普通';
    case PlayerStatus.ELIMINATION:
      return '🔥 斩杀';
    case PlayerStatus.CHAMPION:
      return '👑 桂味之冠';
    default:
      return '🍃 普通';
  }
}

// 获取状态样式类
export function getStatusClass(status: PlayerStatus): string {
  switch (status) {
    case PlayerStatus.NORMAL:
      return 'status-normal';
    case PlayerStatus.ELIMINATION:
      return 'status-elimination';
    case PlayerStatus.CHAMPION:
      return 'status-champion';
    default:
      return 'status-normal';
  }
} 