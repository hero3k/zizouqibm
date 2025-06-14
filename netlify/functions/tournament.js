// Netlify函数处理tournament API
const TOURNAMENT_KEY = 'guiwei-cup-tournament-data';

// 通用Redis客户端
const getRedisClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  
  if (!url || !token) {
    throw new Error('Redis credentials not configured');
  }
  
  return {
    async get(key) {
      const response = await fetch(`${url}/get/${key}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Redis GET response:', data);
      return data.result ? JSON.parse(data.result) : null;
    },
    
    async set(key, value) {
      const jsonValue = JSON.stringify(value);
      console.log('Redis SET data:', jsonValue);
      const response = await fetch(`${url}/set/${key}/${encodeURIComponent(jsonValue)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      console.log('Redis SET response:', result);
      return response.ok;
    },
    
    async del(key) {
      const response = await fetch(`${url}/del/${key}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.ok;
    }
  };
};

exports.handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // 处理OPTIONS请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const redis = getRedisClient();

    if (event.httpMethod === 'GET') {
      // 获取比赛数据
      const data = await redis.get(TOURNAMENT_KEY);
      
      if (!data) {
        // 如果没有数据，返回初始状态
        const initialState = {
          players: [],
          matches: [],
          isFinished: false,
          championCount: 0
        };
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(initialState)
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === 'POST') {
      // 更新比赛数据
      const data = JSON.parse(event.body);
      
      // 验证数据格式
      if (!data || typeof data !== 'object' || !Array.isArray(data.players) || !Array.isArray(data.matches)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid data format' })
        };
      }
      
      // 保存到云数据库
      await redis.set(TOURNAMENT_KEY, data);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    if (event.httpMethod === 'DELETE') {
      // 重置比赛数据
      await redis.del(TOURNAMENT_KEY);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Tournament API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 