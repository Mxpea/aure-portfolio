# Aurelith Portfolio

个人作品集网站，展示创意开发与设计作品。

## 技术栈

- **Next.js 16** - React 全栈框架
- **Tailwind CSS 4** - 实用优先的 CSS 框架
- **Framer Motion** - 动画库
- **Three.js** - 3D 渲染（`@react-three/fiber`）

## 特性

- 分页式滚动，带模糊过渡动画
- 首页视差效果，跟随鼠标平滑移动
- GitHub 数据实时集成（仓库、贡献图、语言统计）
- 无限滚动作品展示卡片
- 暗黑/明亮主题切换
- 自定义光标
- 友情链接页面（读取 `links.csv`）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
nvs use node
npm run dev

# 构建生产版本
npm run build
```

## 环境变量

创建 `.env.local` 文件：

```env
# GitHub Token（可选，提升 API 速率限制到 5000 次/小时）
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

## 项目结构

```
src/
├── app/
│   ├── api/github/      # GitHub API 代理路由
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 主页面
├── components/
│   ├── HeroSection.tsx   # 首页
│   ├── WorksSection.tsx  # 作品展示
│   ├── AboutSection.tsx  # GitHub 活动
│   ├── ContactSection.tsx# 联系方式
│   ├── FriendLinksSection.tsx # 友情链接
│   ├── Navigation.tsx    # 顶部导航
│   ├── CustomCursor.tsx  # 自定义光标
│   ├── LoadingScreen.tsx # 加载动画
│   └── PaginationHandler.tsx # 分页滚动控制
└── lib/
    ├── github.ts         # GitHub API 工具
    └── cache.ts          # 文件缓存
```

## 部署

推荐使用 Vercel 部署：

```bash
npm run build
```

或连接 GitHub 仓库自动部署。
