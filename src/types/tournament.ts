// 选手状态枚举
export enum PlayerStatus {
  NORMAL = 'normal',
  ELIMINATION = 'elimination', 
  CHAMPION = 'champion'
}

// 选手接口
export interface Player {
  id: string;
  name: string;
  totalScore: number;
  status: PlayerStatus;
  registeredAt: Date;
}

// 对局结果接口
export interface MatchResult {
  playerId: string;
  playerName: string;
  rank: number; // 1-8名
  score: number; // 对应积分
}

// 对局接口
export interface Match {
  id: string;
  date: Date;
  results: MatchResult[];
  createdAt: Date;
}

// 比赛状态接口
export interface TournamentState {
  players: Player[];
  matches: Match[];
  isFinished: boolean; // 当有3个冠军时为true
  championCount: number;
}

// 积分规则常量
export const SCORE_MAP: Record<number, number> = {
  1: 8, // 第1名得8分
  2: 6, // 第2名得6分
  3: 5, // 第3名得5分
  4: 4, // 第4名得4分
  5: 3, // 第5名得3分
  6: 2, // 第6名得2分
  7: 1, // 第7名得1分
  8: 0  // 第8名得0分
};

// 斩杀阶段积分线
export const ELIMINATION_THRESHOLD = 25;

// 最大冠军数量
export const MAX_CHAMPIONS = 3; 