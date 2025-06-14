import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { TournamentState } from '@/types/tournament';

const TOURNAMENT_KEY = 'guiwei-cup-tournament-data';

// 获取比赛数据
export async function GET() {
  try {
    const data = await kv.get<TournamentState>(TOURNAMENT_KEY);
    
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
    await kv.set(TOURNAMENT_KEY, data);
    
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
    await kv.del(TOURNAMENT_KEY);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reset tournament data:', error);
    return NextResponse.json(
      { error: 'Failed to reset tournament data' },
      { status: 500 }
    );
  }
} 