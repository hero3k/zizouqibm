# 桂味杯比赛网站 - GitHub上传指南

## 📋 需要上传的文件清单

### 根目录文件
- [ ] package.json
- [ ] next.config.js  
- [ ] tailwind.config.js
- [ ] postcss.config.js
- [ ] tsconfig.json
- [ ] vercel.json
- [ ] next-env.d.ts
- [ ] .gitignore
- [ ] README.md

### src目录结构
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── TournamentHeader.tsx
│   ├── RegistrationForm.tsx
│   ├── Leaderboard.tsx
│   └── MatchManager.tsx
├── types/
│   └── tournament.ts
└── utils/
    └── tournament.ts
```

## 🚀 上传步骤

### 方法一：网页上传
1. 在 [github.com](https://github.com) 创建新仓库
2. 名称：`guiwei-cup-tournament`
3. 描述：`桂味杯自走棋比赛报名网站`
4. 选择 Public
5. 点击 "uploading an existing file"
6. 拖拽所有文件到页面中
7. 提交信息：`🎉 初始化桂味杯自走棋比赛网站`
8. 点击 "Commit changes"

### 方法二：GitHub Desktop
1. 下载安装 GitHub Desktop
2. 登录GitHub账号
3. 创建新仓库
4. 将文件复制到仓库文件夹
5. 提交并推送

## 🌐 部署到Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 登录账号
3. 点击 "New Project"
4. 导入GitHub仓库
5. 点击 "Deploy"
6. 等待部署完成

## 📱 项目特色
- 🍃 荔枝主题设计
- 📊 实时积分排行榜
- 🔥 斩杀阶段特效
- 👑 桂味之冠系统
- 📱 完全响应式
- 🚀 一键部署

## 🎯 比赛规则
- 积分制：1-8名获得8-6-5-4-3-2-1-0分
- 斩杀线：25分进入斩杀阶段
- 冠军：斩杀阶段吃鸡获得"桂味之冠"
- 结束：三位桂味之冠产生

---
📧 如需帮助，请联系开发者 