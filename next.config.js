/** @type {import('next').NextConfig} */
const nextConfig = {
  // 支持静态导出和服务端渲染
  output: process.env.NETLIFY ? 'export' : undefined,
  
  // 关闭严格模式以避免开发时的双重渲染
  reactStrictMode: false,
  
  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 支持Netlify Functions
  trailingSlash: true,
  
  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig 