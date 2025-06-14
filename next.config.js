/** @type {import('next').NextConfig} */
const nextConfig = {
  // 支持静态导出
  output: 'export',
  
  // 关闭严格模式以避免开发时的双重渲染
  reactStrictMode: false,
  
  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 支持Netlify Functions
  trailingSlash: true,
  
  // 禁用 API 路由（使用 Netlify Functions 代替）
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig 