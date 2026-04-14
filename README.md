# 图解 Claude Code · 一本会动的源码百科

> 以风趣幽默、小白友好的方式，拆解 Claude Code 源码架构。赛博朋克风格的互动科普网页——不枯燥，但能把技术讲透。

## 在线预览

```bash
git clone https://github.com/Lzhtommy/easy-claude-code.git
cd easy-claude-code
npm install
npm run dev
# → http://localhost:5173/
```

## 章节一览

| # | 章节 | 玩法 |
|---|------|------|
| 1 | 泄露事件始末 | 2026-03-31 时间轴，点击事件查看详情 |
| 2 | 架构五层拆解 | LayerCake 蛋糕图，点击展开 Drawer |
| 3 | Agent Loop 模拟器 | 输入任务，看 Claude 思考→调工具→循环 |
| 4 | 40+ 工具探索器 | 15 类别筛选 + 卡片墙 / 树视图切换 |
| 5 | 权限决策小游戏 | 6 题 allow/ask/deny，答完给评级 |
| 6 | 记忆四层系统 | 洋葱图 + 时间线（CLAUDE.md → KAIROS） |
| 7 | 多智能体协作 | 拓扑图 + Fork/Remote/In-Process 对比 |
| 8 | Buddy 扭蛋机 | 18 物种 5 稀有度，抽卡 + 图鉴收集 |
| 9 | 隐藏功能彩蛋 | Undercover / KAIROS / ULTRAPLAN / 语音模式 |

## 技术栈

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** — 自定义 cyber 色板 + neon 阴影
- **Framer Motion** — 入场动画、滑动、抖动、弹簧效果
- **Zustand** — 全局状态（章节导航、权限计分、Buddy 收集 + localStorage）
- **Recharts** — Buddy 稀有度饼图 + 属性雷达图
- **D3** — 工具分类树状图、力导向拓扑
- **Canvas** — 代码符号粒子背景（DPR 适配 + 鼠标吸附）

## 项目结构

```
src/
├── main.tsx                  # 入口
├── App.tsx                   # 路由 + lazy loading
├── data/
│   ├── types.ts              # 全局数据模型
│   ├── content.ts            # 文案 + 数据常量
│   └── whispers.ts           # 术语白话注释（27 条）
├── store/
│   └── useAppStore.ts        # Zustand store
├── sections/                 # 10 个章节页面
│   ├── Hero.tsx
│   ├── LeakTimeline.tsx
│   ├── Architecture.tsx
│   ├── AgentLoop.tsx
│   ├── ToolExplorer.tsx
│   ├── PermissionGame.tsx
│   ├── MemorySystem.tsx
│   ├── MultiAgent.tsx
│   ├── BuddyGacha.tsx
│   ├── Hidden.tsx
│   └── Footer.tsx
├── components/
│   ├── fx/                   # 视觉特效组件
│   │   ├── ParticleBackground.tsx
│   │   ├── NeonCard.tsx
│   │   ├── TerminalBlock.tsx
│   │   ├── TypewriterText.tsx
│   │   ├── GlitchText.tsx
│   │   ├── Reveal.tsx
│   │   └── Whisper.tsx
│   ├── layout/               # 布局组件
│   │   ├── Nav.tsx
│   │   └── SectionShell.tsx
│   └── viz/                  # 数据可视化组件
│       ├── LayerCake.tsx
│       ├── AgentLoopDiagram.tsx
│       ├── MultiAgentTopology.tsx
│       ├── MemoryOnion.tsx
│       ├── ToolTaxonomyTree.tsx
│       ├── BuddyStats.tsx
│       └── LeakTimelineViz.tsx
└── styles/
    └── globals.css           # CRT 扫描线 + 霓虹样式
```

## 视觉风格

赛博朋克 × 终端复古：深色背景、霓虹高亮（cyan / pink / purple）、CRT 扫描线、SVG 噪点暗角、像素字体标题、等宽代码块。

## 致谢

本项目基于 2026 年 3 月 31 日 Claude Code npm sourcemap 公开事件中暴露的源码快照进行架构分析，仅用于教育与安全研究目的。Claude Code 原始代码归 Anthropic 所有。

## License

MIT
