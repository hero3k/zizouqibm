import { NextRequest, NextResponse } from 'next/server';
import { TournamentState } from '@/types/tournament';

const TOURNAMENT_KEY = 'guiwei-cup-tournament-data';

// 通用Redis客户端
const getRedisClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  
  if (!url || !token) {
    throw new Error('Redis credentials not configured');
  }
  
  return {
    async get(key: string) {
      const response = await fetch(`${url}/get/${key}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      return data.result ? JSON.parse(data.result) : null;
    },
    
    async set(key: string, value: any) {
      const response = await fetch(`${url}/set/${key}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
      });
      return response.ok;
    },
    
    async del(key: string) {
      const response = await fetch(`${url}/del/${key}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.ok;
    }
  };
};

// 获取比赛数据
export async function GET() {
  try {
    const redis = getRedisClient();
    const data = await redis.get(TOURNAMENT_KEY) as TournamentState;
    
    if (!data) {
      // 如果没有数据，返回初始状态
      const initialState: TournamentState = {
        players: [],
        matches: [],
        isFinished: false,
        championCount: 0
      };
      return NextResponse.json(initialState);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to get tournament data:', error);
    return NextResponse.json(
      { error: 'Failed to get tournament data' },
      { status: 500 }
    );
  }
}

// 更新比赛数据
export async function POST(request: NextRequest) {
  try {
    const data: TournamentState = await request.json();
    
    // 验证数据格式
    if (!data || typeof data !== 'object' || !Array.isArray(data.players) || !Array.isArray(data.matches)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }
    
    // 保存到云数据库
    const redis = getRedisClient();
    await redis.set(TOURNAMENT_KEY, data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save tournament data:', error);
    return NextResponse.json(
      { error: 'Failed to save tournament data' },
      { status: 500 }
    );
  }
}

// 重置比赛数据（调试用）
export async function DELETE() {
  try {
    const redis = getRedisClient();
    await redis.del(TOURNAMENT_KEY);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reset tournament data:', error);
    return NextResponse.json(
      { error: 'Failed to reset tournament data' },
      { status: 500 }
    );
  }
} 