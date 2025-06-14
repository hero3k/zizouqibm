import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '桂味杯自走棋比赛',
  description: '桂味杯自走棋比赛报名网站',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
} 