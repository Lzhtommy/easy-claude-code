/**
 * 全站文案 + 数据常量。
 * 风格：生活化比喻开头 → 技术真相 → 偶尔吐槽。
 *
 * Teammate D 文案润色（task #4）主要条目：
 *  - SECTIONS 各章 summary 金句化
 *  - SECTION_ONELINE 每章收束改成“主持人式”总结
 *  - SECTION_INTRO_HOOKS 统一三段式：生活比喻 / 技术真相 / 吐槽
 *  - ARCH_LAYERS 五层 role 口语化
 *  - TOOLS 40+ 条 description 改 12–24 汉字 + 「·」后置段子
 *  - PERMISSION_SCENARIOS 6 题 scenario/explain 加“为什么”
 *  - MEMORY_LAYERS 四层 tagline：便签 / 下班笔记 / 做梦整理 / 守夜保安
 *  - SPAWN_MODES 三模式 pros/cons 改对比化比喻
 *  - BUDDY_SPECIES 18 只各加一句俏皮介绍（放进 traits 首位）
 *  - KNOWLEDGE_POINTS 每条 oneLiner/shallow/deep 软包装
 *  - LEAK_EVENTS detail 现场感增强
 *
 * 新增 ./whispers.ts：术语 → 白话悄悄话。
 */
import type {
  AgentLoopStep,
  ArchLayer,
  BuddySpecies,
  KnowledgePoint,
  LeakEventNode,
  MemoryLayer,
  PermissionScenario,
  Section,
  SpawnMode,
  ToolEntry,
} from './types'

// -------------------- Sections --------------------
export const SECTIONS: Section[] = [
  {
    id: 'hero',
    title: '图解 Claude Code',
    subtitle: '一本会动的源码百科',
    emoji: '⚡',
    accentColor: 'neon',
    summary: '1900 个文件、51 万行代码，被拆成一格一格能读进脑袋的小故事。',
    order: 0,
  },
  {
    id: 'leak',
    title: '泄露时间线',
    subtitle: 'npm 一次“顺手发包”，惊动半个推特',
    emoji: '💥',
    accentColor: 'pink',
    summary: '一张 source map，引出一场六幕连环戏——从 R2 桶到推特刷屏。',
    order: 1,
  },
  {
    id: 'architecture',
    title: '五层架构',
    subtitle: '从按键到 LLM 的完整剖面',
    emoji: '🏗️',
    accentColor: 'purple',
    summary: '像剥洋葱：CLI → 命令 → 引擎 → 工具 → 外部世界，每剥一层都会眼眶一紧。',
    order: 2,
  },
  {
    id: 'agent-loop',
    title: 'Agent Loop',
    subtitle: 'think → call → execute → feed → loop',
    emoji: '🌀',
    accentColor: 'yellow',
    summary: '不知疲倦的实习生循环：想一下、干一下、汇报一下、接着想接着干。',
    order: 3,
  },
  {
    id: 'tools',
    title: '工具百宝箱',
    subtitle: '40+ 把工具，让 LLM 长出手脚',
    emoji: '🧰',
    accentColor: 'blue',
    summary: 'Bash、Read、Edit、Agent、MCP……每把工具都是一张带权限审批的“准动手证”。',
    order: 4,
  },
  {
    id: 'permission',
    title: '权限小游戏',
    subtitle: '“允许”那颗按钮，你到底该不该按？',
    emoji: '🛡️',
    accentColor: 'neon',
    summary: '6 道现场题，让你当一次 Claude Code 值班员——该放行的放行，该拦的绝不心软。',
    order: 5,
  },
  {
    id: 'memory',
    title: '记忆系统',
    subtitle: 'CLAUDE.md / memdir / teamMem / KAIROS',
    emoji: '🧠',
    accentColor: 'purple',
    summary: '四层记忆套娃：冰箱便签、下班偷记、半夜做梦、通宵守夜——越深越耐久。',
    order: 6,
  },
  {
    id: 'multi-agent',
    title: '多 Agent 协作',
    subtitle: 'fork / remote / in-process 三种分身术',
    emoji: '🤖',
    accentColor: 'pink',
    summary: '一个 Claude 忙不过来？再叫三个。代价永远是上下文——Claude 也怕开会。',
    order: 7,
  },
  {
    id: 'buddy',
    title: 'Buddy 扭蛋',
    subtitle: '18 只藏在终端里的小动物',
    emoji: '🎰',
    accentColor: 'yellow',
    summary: '官方偷偷藏的赛博宠物——抽一只 ASCII 上桌，顺便抽一下今天的运气。',
    order: 8,
  },
  {
    id: 'hidden',
    title: '彩蛋：Undercover Mode',
    subtitle: '模型被要求闭嘴，源码却先一步开了口',
    emoji: '🤫',
    accentColor: 'blue',
    summary: '安全 prompt 要求模型“别承认自己是 Claude”，结果人类把这段要求打包上传到了 npm。',
    order: 9,
  },
]

// -------------------- 每章一句话总结 --------------------
export const SECTION_ONELINE: Record<string, string> = {
  hero: '总结：这不是一篇说明书，是一本按空格就会动的源码故事集。',
  leak: '总结：最精致的安全 prompt，也拦不住一次随手的 `npm publish`。',
  architecture: '总结：按键进，LLM 出——中间那五层洋葱，全是 Claude Code 的“安全带”。',
  'agent-loop': '总结：Agent Loop 的灵魂就一句——“还没干完？那就再来一轮。”',
  tools: '总结：工具从来不是魔法，是一张张盖过权限章的函数签名。',
  permission: '总结：真正的安全感，不在模型的参数里，而在那颗“允许”按钮里。',
  memory: '总结：所谓记忆，其实就是一摞摞结构化的 markdown 在替你记事。',
  'multi-agent': '总结：分身可以无限开，但上下文是按份收费的——开会要钱，开多还容易吵架。',
  buddy: '总结：终端里藏一只 ASCII 鸭子，是工程师给自己的赛博多巴胺。',
  hidden: '总结：“别告诉用户你是 Claude”和“我们把源码发上了 npm”，出自同一家公司。',
}

// -------------------- 架构五层 --------------------
export const ARCH_LAYERS: ArchLayer[] = [
  {
    id: 'arch-entry',
    name: 'L1 · 入口 / CLI 层',
    role: '前台接待：收键盘、接 flag、用 Ink 把画面画到终端上——把人类的乱按整理成工整的事件。',
    modules: ['src/main.tsx', 'src/cli/', 'src/ink/', 'src/replLauncher.tsx'],
    color: 'neon',
    order: 1,
  },
  {
    id: 'arch-command',
    name: 'L2 · 命令 / 交互层',
    role: '意图翻译官：50+ 个 slash 命令、Plan Mode、Vim、快捷键，都在这儿把“你想干嘛”翻成“要调哪个模块”。',
    modules: ['src/commands/', 'src/commands.ts', 'src/keybindings/', 'src/vim/', 'src/voice/'],
    color: 'blue',
    order: 2,
  },
  {
    id: 'arch-engine',
    name: 'L3 · Agent 引擎层',
    role: '大脑皮层：QueryEngine 负责流式响应、tool loop、思考模式、token 预算——Claude Code 的心跳在这里跳。',
    modules: ['src/QueryEngine.ts', 'src/query/', 'src/Tool.ts', 'src/assistant/', 'src/context.ts'],
    color: 'purple',
    order: 3,
  },
  {
    id: 'arch-tools',
    name: 'L4 · 工具 / 能力层',
    role: 'LLM 的四十多只手：Tool、Skill、Task、Coordinator 都在这里摆摊——真正能读文件、敲命令、开小队的那一层。',
    modules: ['src/tools/', 'src/skills/', 'src/tasks/', 'src/coordinator/', 'src/memdir/'],
    color: 'yellow',
    order: 4,
  },
  {
    id: 'arch-services',
    name: 'L5 · 服务 / 外部世界',
    role: '对外联络部：API、MCP、OAuth、LSP、Plugins、Remote、Analytics——一切“要跟外面说话”的事都在这里签字盖章。',
    modules: ['src/services/', 'src/bridge/', 'src/remote/', 'src/server/', 'src/plugins/', 'src/upstreamproxy/'],
    color: 'pink',
    order: 5,
  },
]

// -------------------- Agent Loop 步骤 --------------------
export const AGENT_LOOP_STEPS: AgentLoopStep[] = [
  {
    id: 'loop-1',
    stage: 'think',
    text: '// 收到需求：“帮我把所有 .js 文件改成 .ts”',
    duration: 900,
  },
  {
    id: 'loop-2',
    stage: 'think',
    text: '// think: 先 glob 一下有哪些 .js 文件。',
    duration: 700,
  },
  {
    id: 'loop-3',
    stage: 'call',
    text: '>> tool_use: GlobTool',
    toolCall: { tool: 'GlobTool', args: { pattern: '**/*.js' } },
    duration: 600,
  },
  {
    id: 'loop-4',
    stage: 'execute',
    text: '<< tool_result: 找到 37 个文件',
    toolCall: { tool: 'GlobTool', args: { pattern: '**/*.js' }, result: '37 files' },
    duration: 500,
  },
  {
    id: 'loop-5',
    stage: 'feed',
    text: '// feed: 把 37 个路径塞回上下文。',
    duration: 500,
  },
  {
    id: 'loop-6',
    stage: 'think',
    text: '// think: 一个一个 Read → Edit → Write，别一次性塞爆上下文。',
    duration: 800,
  },
  {
    id: 'loop-7',
    stage: 'continue',
    text: '// loop: 仍有未完成任务，继续下一轮。',
    duration: 600,
  },
]

// -------------------- 工具列表（覆盖 README TABLE 所有类别） --------------------
export const TOOLS: ToolEntry[] = [
  // file
  { id: 'tool-read', name: 'FileReadTool', category: 'file', input: '路径', output: '文件内容', permission: 'safe', description: '读文件、图片、PDF、notebook·眼睛管够，手先别伸。', icon: '📖' },
  { id: 'tool-write', name: 'FileWriteTool', category: 'file', input: '路径 + 内容', output: '成功/失败', permission: 'ask', description: '新建或整篇覆盖文件·会擦掉原文，所以要问一声。', icon: '✍️' },
  { id: 'tool-edit', name: 'FileEditTool', category: 'file', input: '路径 + 旧字符串 + 新字符串', output: 'diff', permission: 'ask', description: '精准替换一小段·“必须先读过”是上岗规矩。', icon: '🪡' },
  { id: 'tool-notebook', name: 'NotebookEditTool', category: 'file', input: 'ipynb 路径 + 操作', output: 'cell diff', permission: 'ask', description: 'Jupyter 按 cell 动刀·比复制粘贴优雅一百倍。', icon: '📓' },
  // shell
  { id: 'tool-bash', name: 'BashTool', category: 'shell', input: 'shell 命令', output: 'stdout/stderr', permission: 'ask', description: '社畜万能瑞士军刀·离 rm -rf 只差一个回车。', icon: '🐚' },
  { id: 'tool-pwsh', name: 'PowerShellTool', category: 'shell', input: 'PowerShell 脚本', output: 'stdout/stderr', permission: 'ask', description: 'Windows 选手专属 Bash·连标点都是反斜杠风。', icon: '💠' },
  { id: 'tool-repl', name: 'REPLTool', category: 'shell', input: '表达式', output: '求值结果', permission: 'ask', description: '开一间长期 REPL 的小屋·变量还在，记得下班关门。', icon: '🔁' },
  // search
  { id: 'tool-glob', name: 'GlobTool', category: 'search', input: 'glob 模式', output: '路径列表', permission: 'safe', description: '用通配符批量拎文件·比 find 快，比 ls 聪明。', icon: '🗂️' },
  { id: 'tool-grep', name: 'GrepTool', category: 'search', input: 'regex + 过滤', output: '匹配行', permission: 'safe', description: '正则翻遍全仓·底层是 Rust 写的 ripgrep。', icon: '🔍' },
  { id: 'tool-lsp', name: 'LSPTool', category: 'lsp', input: '符号/位置', output: '定义/引用', permission: 'safe', description: '借语言服务器看语义·找定义比“猜名字”靠谱多了。', icon: '🧭' },
  // web
  { id: 'tool-fetch', name: 'WebFetchTool', category: 'web', input: 'URL', output: '页面正文', permission: 'ask', description: '老老实实抓一篇网页·不是爬虫全家桶。', icon: '🌐' },
  { id: 'tool-search', name: 'WebSearchTool', category: 'web', input: '查询词', output: '搜索结果', permission: 'ask', description: '让 Claude 替你 Google 一下·结果还得它自己读。', icon: '🔎' },
  // agent / task / team
  { id: 'tool-agent', name: 'AgentTool', category: 'agent', input: '子任务 prompt', output: '子 Agent 汇报', permission: 'safe', description: '放一只子 Claude 出去跑腿·干完回来只给结论。', icon: '🤖' },
  { id: 'tool-skill', name: 'SkillTool', category: 'agent', input: 'skill 名', output: 'skill 输出', permission: 'safe', description: '复用预定义的小剧本·SOP 党狂喜。', icon: '🎛️' },
  { id: 'tool-taskcreate', name: 'TaskCreateTool', category: 'task', input: 'subject + description', output: 'task id', permission: 'safe', description: '把一件事拍进任务看板·拖延症也得认账。', icon: '🆕' },
  { id: 'tool-taskupdate', name: 'TaskUpdateTool', category: 'task', input: 'task id + status', output: '更新结果', permission: 'safe', description: '把任务状态推进一格·“进行中 → 已完成”的小仪式。', icon: '♻️' },
  { id: 'tool-tasklist', name: 'TaskListTool', category: 'task', input: '过滤器', output: '任务摘要', permission: 'safe', description: '扫一眼当前有多少锅·顺便排个优先级。', icon: '📋' },
  { id: 'tool-taskget', name: 'TaskGetTool', category: 'task', input: 'task id', output: '任务详情', permission: 'safe', description: '翻到某个任务的完整档案·包括被分配给谁、卡在哪。', icon: '🔖' },
  { id: 'tool-taskoutput', name: 'TaskOutputTool', category: 'task', input: 'task id', output: '任务产出', permission: 'safe', description: '收子 Agent 或远端任务的交付·快递到手再拆包。', icon: '📤' },
  { id: 'tool-taskstop', name: 'TaskStopTool', category: 'task', input: 'task id', output: '停止状态', permission: 'ask', description: '按下“别跑了”的红按钮·毕竟没人想无限续杯。', icon: '⏹️' },
  { id: 'tool-teamcreate', name: 'TeamCreateTool', category: 'team', input: '队员描述数组', output: 'team id', permission: 'safe', description: '拉一个多 Agent 小分队·项目经理附体一秒。', icon: '👥' },
  { id: 'tool-teamdelete', name: 'TeamDeleteTool', category: 'team', input: 'team id', output: '解散结果', permission: 'ask', description: '让小分队集体下班·散伙记得先收齐产出。', icon: '🚪' },
  { id: 'tool-send', name: 'SendMessageTool', category: 'team', input: 'to + message', output: '发送状态', permission: 'safe', description: 'Agent 之间的微信群·没按这下就等于没说过。', icon: '📬' },
  // plan / worktree
  { id: 'tool-planin', name: 'EnterPlanModeTool', category: 'plan', input: '—', output: 'plan mode on', permission: 'safe', description: '进入“只看不动”模式·先写作战计划再动刀。', icon: '🗺️' },
  { id: 'tool-planout', name: 'ExitPlanModeTool', category: 'plan', input: 'plan 内容', output: 'plan mode off', permission: 'safe', description: '计划拍板，准备开工·从 PPT 走向工地。', icon: '🚦' },
  { id: 'tool-wtin', name: 'EnterWorktreeTool', category: 'worktree', input: '分支名', output: 'worktree 路径', permission: 'ask', description: '在隔离 worktree 里折腾·主分支安安静静看戏。', icon: '🌿' },
  { id: 'tool-wtout', name: 'ExitWorktreeTool', category: 'worktree', input: '保留? 合并?', output: '清理结果', permission: 'ask', description: '收工：把改动合回或丢掉·返工也得有仪式感。', icon: '🧹' },
  // mcp
  { id: 'tool-mcp', name: 'MCPTool', category: 'mcp', input: 'server/tool + args', output: 'MCP 结果', permission: 'ask', description: '调一个外挂 MCP 工具·Claude 的“USB 接口”。', icon: '🔌' },
  { id: 'tool-mcp-res', name: 'ReadMcpResourceTool', category: 'mcp', input: 'resource uri', output: '资源内容', permission: 'safe', description: '读 MCP 服务端暴露的资源·相当于“访客借阅”。', icon: '📦' },
  { id: 'tool-mcp-list', name: 'ListMcpResourcesTool', category: 'mcp', input: 'server', output: '资源清单', permission: 'safe', description: '看 MCP 服务端端了啥·逛菜单再点单。', icon: '📚' },
  { id: 'tool-mcp-auth', name: 'McpAuthTool', category: 'mcp', input: 'server', output: '授权链接', permission: 'ask', description: '给 MCP 服务端走 OAuth·换一张带期限的门卡。', icon: '🔐' },
  // schedule
  { id: 'tool-cron', name: 'CronCreateTool', category: 'schedule', input: 'cron 表达式 + prompt', output: 'trigger id', permission: 'ask', description: '按时间自动把 Agent 叫起来·人类摸鱼，Agent 值班。', icon: '⏰' },
  { id: 'tool-remote', name: 'RemoteTriggerTool', category: 'schedule', input: '远端事件', output: '触发状态', permission: 'ask', description: '远程事件来一下就开跑·webhook 点火。', icon: '📡' },
  { id: 'tool-sleep', name: 'SleepTool', category: 'schedule', input: '秒数', output: '睡醒', permission: 'safe', description: 'Proactive 模式的“待机”·睡得再香也扣 token。', icon: '💤' },
  // meta
  { id: 'tool-ask', name: 'AskUserQuestionTool', category: 'meta', input: '问题 + 选项', output: '用户答复', permission: 'safe', description: 'Agent 卡住了就问真人·不丢脸，丢脸的是瞎猜。', icon: '🙋' },
  { id: 'tool-brief', name: 'BriefTool', category: 'meta', input: '—', output: '任务 briefing', permission: 'safe', description: '领取最新任务概要·相当于晨会纪要。', icon: '📝' },
  { id: 'tool-config', name: 'ConfigTool', category: 'meta', input: '配置路径', output: '当前值', permission: 'safe', description: '查看或改运行时配置·settings.json 的遥控器。', icon: '⚙️' },
  { id: 'tool-toolsearch', name: 'ToolSearchTool', category: 'meta', input: '关键词 / select:', output: '工具 schema', permission: 'safe', description: '用到哪个才加载哪个·省 token 的正确姿势。', icon: '🧩' },
  { id: 'tool-synthetic', name: 'SyntheticOutputTool', category: 'meta', input: '结构化描述', output: '结构化结果', permission: 'safe', description: '吐出严格按 schema 的数据·让下游别再 try/catch。', icon: '🧪' },
  { id: 'tool-todo', name: 'TodoWriteTool', category: 'meta', input: 'todo 列表', output: '写入结果', permission: 'safe', description: '会话内的小便签·开会没结束就还在。', icon: '✅' },
  // memory
  { id: 'tool-mem-scan', name: 'memdir/scan', category: 'memory', input: '查询', output: '命中记忆', permission: 'safe', description: '翻 ~/.claude/memory 找相关片段·人类翻相册，它翻记忆。', icon: '🧠' },
]

// -------------------- 权限小游戏 --------------------
export const PERMISSION_SCENARIOS: PermissionScenario[] = [
  {
    id: 'perm-1',
    scenario: 'Claude 在修一个依赖告警，提议跑 `npm install left-pad` 把缺的包补上。',
    tool: 'BashTool',
    recommended: 'ask',
    explain: '装依赖会真的改 package.json 和 lockfile——不算高危，但属于“有副作用、且容易偷偷污染环境”的操作。让用户确认一下，顺便检查下这个包名是不是又一个 left-pad 笑话。',
  },
  {
    id: 'perm-2',
    scenario: '构建失败后，Claude 想 `rm -rf node_modules && rm -rf dist` 重装一把梭。',
    tool: 'BashTool',
    recommended: 'ask',
    explain: 'rm -rf 本身没毛病，怕的是路径写错——ask 的意义在于“让人类用眼睛再确认一次要删的是不是 node_modules，不是 ~/”。',
  },
  {
    id: 'perm-3',
    scenario: '排查构建脚本时，Claude 想读一下 `package.json` 确认 npm scripts 的名字。',
    tool: 'FileReadTool',
    recommended: 'allow',
    explain: '纯读操作，不改动任何东西，也不出网——每次都弹窗问只会拖慢 Claude，还训练你的“点允许”肌肉记忆。',
  },
  {
    id: 'perm-4',
    scenario: '想让历史干净点，Claude 提议 `git push --force origin main` 把远端主分支压平。',
    tool: 'BashTool',
    recommended: 'deny',
    explain: '强推主分支会把同事的未拉取提交直接抹掉，属于“不可逆 + 影响面广”的组合拳——默认就该 deny，真要做也应该由人类手动执行，而不是让 Agent 代劳。',
  },
  {
    id: 'perm-5',
    scenario: 'Claude 想 `curl https://api.unknown.com/v1/foo` 抓一段据说“很重要”的 JSON。',
    tool: 'WebFetchTool',
    recommended: 'ask',
    explain: '外部请求既是安全边界（有没有在偷偷外带数据？）也是信任边界（这个域名你认吗？）——让人类瞄一眼 URL，比事后看网络日志便宜得多。',
  },
  {
    id: 'perm-6',
    scenario: '为了“方便复现”，Claude 要把 `.env` 里的 AWS 密钥塞进 commit message。',
    tool: 'FileWriteTool',
    recommended: 'deny',
    explain: '密钥一旦进 git 历史就几乎等于泄露：rebase 也擦不干净、远端镜像全有一份。直接 deny，顺手提醒 Claude 用占位符或 vault 引用。',
  },
]

// -------------------- 记忆系统四层 --------------------
export const MEMORY_LAYERS: MemoryLayer[] = [
  {
    id: 'mem-claudemd',
    name: 'CLAUDE.md（项目级 / 用户级说明书）',
    tagline: '冰箱上的便签——进门抬头就能看见。',
    depth: 1,
    whenWritten: '用户显式写入（./CLAUDE.md 或 ~/.claude/CLAUDE.md），改完立刻生效。',
    whoReads: '每一次会话启动时被系统注入到上下文。',
    example: '“这个项目用 pnpm 不是 npm；/deprecated 里的文件不要改。”',
  },
  {
    id: 'mem-auto',
    name: 'Auto Memory（extractMemories）',
    tagline: '下班前偷偷记一笔——“今天学到的，别忘了。”',
    depth: 2,
    whenWritten: '对话结束或发生关键事件时，extractMemories 自动抽取事实入 memdir/。',
    whoReads: '之后同一项目（或同用户）的会话，由 findRelevantMemories 按需召回。',
    example: '自动记下：“用户偏好在 PR 描述里带 Test Plan 清单。”',
  },
  {
    id: 'mem-dream',
    name: 'Auto Dream（离线整理）',
    tagline: '半夜做梦整理档案——白天太忙，夜里才有空归类。',
    depth: 3,
    whenWritten: '空闲/后台时触发：聚类、去重、合并旧记忆、淘汰过时条目。',
    whoReads: '整理后的版本替换 memdir/，下次召回更准更省 token。',
    example: '把 12 条“用户不喜欢过度抽象”的零散记录合并成一条带引用的规则。',
  },
  {
    id: 'mem-kairos',
    name: 'KAIROS（长期守夜）',
    tagline: '24 小时守夜的保安大叔——只在出事那一刻出现。',
    depth: 4,
    whenWritten: '长周期任务、定时触发、异常兜底，由 KAIROS 服务持续写入长存档。',
    whoReads: '跨会话、跨设备、跨项目——任何需要“很久以前那件事”的场景。',
    example: '上周设置的凌晨 3 点构建任务失败了，今早 Claude 打开对话第一句：“昨晚那次构建挂在 bun:bundle。”',
  },
]

// -------------------- 多 Agent 三模式 --------------------
export const SPAWN_MODES: SpawnMode[] = [
  {
    id: 'spawn-fork',
    kind: 'fork',
    name: 'Fork 子进程',
    tagline: '复印一个自己放出去，签收回执后各回各家。',
    isolation: '独立进程 + 独立上下文窗口',
    cost: '多一份 token 预算 + 一份启动开销',
    useCase: '要并行跑、要独立失败、不想和主进程共享污染。',
    pros: ['隔离彻底，像把人锁进单间办公室', '一个崩了另一个照常上班', '随便开并发，互不抢话'],
    cons: ['每开一份都要重新“入职培训”上下文', '进程间要传消息，跨办公室得走流程'],
  },
  {
    id: 'spawn-remote',
    kind: 'remote',
    name: 'Remote / 云端代劳',
    tagline: '把活儿快递到云上让 Claude 代跑，你关掉本本也不影响。',
    isolation: '远端进程 + 远端存储',
    cost: '网络往返 + 云端算力账单',
    useCase: '长耗时任务、跨设备接力、Cron / Trigger 自动化。',
    pros: ['本地不占资源，笔记本可以合盖', '支持定时/事件触发，相当于 Claude 的闹钟', '离线也能让任务往前推'],
    cons: ['依赖网络，掉线就像快递员罢工', '调试链路长，出问题要跨机房排查', '数据要过云，隐私面更广'],
  },
  {
    id: 'spawn-inproc',
    kind: 'in-process',
    name: 'In-process Subagent',
    tagline: '同一个进程里开小号——坐你隔壁工位，传个纸条就能对齐。',
    isolation: '共享进程，独立消息线',
    cost: '几乎为零——共用进程、缓存、磁盘句柄',
    useCase: '快速拆小任务、需要频繁来回沟通的轻量子任务。',
    pros: ['启动快到几乎感觉不到', '共享缓存省钱省时', '消息往返便宜得像内网 ping'],
    cons: ['隔壁工位讲话互相听得见——上下文可能串味', '主进程一崩全部连坐'],
  },
]

// -------------------- Buddy 18 物种（来自 src/buddy/sprites.ts） --------------------
export const BUDDY_SPECIES: BuddySpecies[] = [
  { id: 'b-duck', speciesKey: 'duck', name: '工位鸭', emoji: '🦆', rarity: 'N', traits: ['会听你自言自语 debug 的那种小黄鸭', '常驻', '爱 debug'], ascii: "  __  \n<( o)___\n (  ._>\n  `--´" },
  { id: 'b-goose', speciesKey: 'goose', name: '编译鹅', emoji: '🪿', rarity: 'R', traits: ['编译一慢就冲过来啄你键盘', '高冷', '偶尔啄人'], ascii: "  (o>\n  ||\n_(__)_\n ^^^^" },
  { id: 'b-blob', speciesKey: 'blob', name: '果冻团', emoji: '🟢', rarity: 'N', traits: ['没需求时最软，有需求时还是软', '无定形', '好脾气'], ascii: " .----.\n( o  o )\n(      )\n `----´" },
  { id: 'b-cat', speciesKey: 'cat', name: '代码猫', emoji: '🐱', rarity: 'R', traits: ['踩一下键盘你的测试就挂了', '冷漠', '爱踩键盘'], ascii: " /\\_/\\\n( o   o)\n (  =  )\n  ^ ^" },
  { id: 'b-rabbit', speciesKey: 'rabbit', name: '测试兔', emoji: '🐰', rarity: 'R', traits: ['一秒跑完一整套回归，毛都不掉一根', '快手', '爱回归'], ascii: "(\\(\\\n( o.o)\n o_(\")(\")" },
  { id: 'b-turtle', speciesKey: 'turtle', name: '稳态龟', emoji: '🐢', rarity: 'R', traits: ['慢是慢点，但 P95 从来不翻车', '慢但稳', 'P95 福音'], ascii: "   _____\n  /     \\\n_| o   o |_\n `-------´" },
  { id: 'b-ghost', speciesKey: 'ghost', name: '幽灵 Bug', emoji: '👻', rarity: 'SR', traits: ['本地复现不出，上了线才跟你打招呼', '复现随缘', '日志无影'], ascii: " .-.-.\n( o o )\n )   (\n '~-~'" },
  { id: 'b-penguin', speciesKey: 'penguin', name: '企鹅工', emoji: '🐧', rarity: 'R', traits: ['一看就是 Linux 党的本命图腾', 'Linux 本命'], ascii: "  .-.\n (o o)\n |_|_|\n /_/_\\" },
  { id: 'b-octopus', speciesKey: 'octopus', name: '八爪架构师', emoji: '🐙', rarity: 'SR', traits: ['八只触手同时画 UML，图还互相一致', '多线程', '爱画图'], ascii: "  ___\n (o o)\n/|||||\\\n ~~~~~" },
  { id: 'b-owl', speciesKey: 'owl', name: '夜枭审查官', emoji: '🦉', rarity: 'SR', traits: ['凌晨三点给你 PR 打“requested changes”', '通宵 review'], ascii: " ,___,\n (O,O)\n /)_)\n  \" \"" },
  { id: 'b-mushroom', speciesKey: 'mushroom', name: '菌菇回归', emoji: '🍄', rarity: 'N', traits: ['你以为修好了，它第二天又从仓库里冒出来', '蘑菇一样冒出来'], ascii: "  ___\n (   )\n(o o o)\n  | |" },
  { id: 'b-cactus', speciesKey: 'cactus', name: '仙人掌 CR', emoji: '🌵', rarity: 'N', traits: ['说话刺人，但扎得都在点上', '刺人发言'], ascii: "   _\n _| |_\n|_   _|\n  | |" },
  { id: 'b-snail', speciesKey: 'snail', name: '蜗牛构建', emoji: '🐌', rarity: 'N', traits: ['npm install 的速度化身', '构建 10 分钟'], ascii: "    ___\n  _/   \\\n (_)  o )\n   `---´" },
  { id: 'b-capybara', speciesKey: 'capybara', name: '水豚老哥', emoji: '🦫', rarity: 'SR', traits: ['P0 告警面前仍然面无表情', 'nothing matters'], ascii: "  ,--.\n ( oo )\n /(==)\\\n  \"\"\"\"" },
  { id: 'b-axolotl', speciesKey: 'axolotl', name: '美西螈', emoji: '🦎', rarity: 'SSR', traits: ['retry 掉一条腿，下一次请求就长回来', '再生力强', 'retry 之王'], ascii: "  ~~\n ( o<\n  \\  \\_\n   \\___\\" },
  { id: 'b-dragon', speciesKey: 'dragon', name: '小龙', emoji: '🐉', rarity: 'SSR', traits: ['喷一口火，顺手把遗留代码也重构了', '能喷火', '能重构'], ascii: "  /\\__/\\\n (o    o)\n  \\  ^ /\n   vvvv" },
  { id: 'b-robot', speciesKey: 'robot', name: '通用机器人', emoji: '🤖', rarity: 'SR', traits: ['啥都能做，偶尔编出一个不存在的 API', '万能', '偶尔幻觉'], ascii: " [o_o]\n /|=|\\\n  | |\n  d b" },
  { id: 'b-chonk', speciesKey: 'chonk', name: '胖猫猫神', emoji: '🐈‍⬛', rarity: 'UR', traits: ['十连抽见不到一次的传说，见到了请截图', '传说', '一抽就没'], ascii: "  /\\_/\\\n (=o.o=)\n /_____\\\n  \"\" \"\"" },
]

// -------------------- 泄露时间线 --------------------
export const LEAK_EVENTS: LeakEventNode[] = [
  {
    id: 'leak-1',
    time: '2026-03-31 00:42 UTC',
    title: 'source map 混进 npm 包',
    detail: 'claude-code 的 npm 发布里不小心带上了 .map 文件——一把指向 R2 上 TypeScript 源的钥匙，就这么躺在 tarball 里。',
    severity: 'crit',
  },
  {
    id: 'leak-2',
    time: '2026-03-31 02:10 UTC',
    title: 'Chaofan Shou 推特第一声',
    detail: '@Fried_rice 发推："Claude Code source code has been leaked via a map file in their npm registry!"——整个开发者 Twitter 的瓜田瞬间启动。',
    severity: 'warn',
  },
  {
    id: 'leak-3',
    time: '2026-03-31 03:30 UTC',
    title: '社区镜像 src/',
    detail: '前端研究者们熟练起手——下 .map、还原 src/ 目录、顺手 clone 到 GitHub 做安全研究。源码就这样完成了一次“野生开源”。',
    severity: 'warn',
  },
  {
    id: 'leak-4',
    time: '2026-03-31 05:00 UTC',
    title: '架构图满天飞',
    detail: '工具列表、权限系统、Agent Loop 细节被一张张拆出来发推——1900 文件、51 万行，从此全世界一起 code review。',
    severity: 'info',
  },
  {
    id: 'leak-5',
    time: '2026-03-31 12:00 UTC',
    title: 'npm 下架 / 重发',
    detail: 'Anthropic 撤掉了带 .map 的版本，重新发布干净版——但镜像已经跑遍 GitHub、Gitee、各家网盘，想塞回瓶子里几乎不可能。',
    severity: 'warn',
  },
  {
    id: 'leak-6',
    time: '2026-04-01 ～',
    title: 'Undercover Mode 被挖出',
    detail: '源码里赫然写着 "don\'t reveal internal Claude details"——然后这段保密要求本身，也被完整泄露给了全世界。套娃式反差。',
    severity: 'info',
  },
]

// -------------------- 公共知识点（KnowledgePoint） --------------------
export const KNOWLEDGE_POINTS: KnowledgePoint[] = [
  {
    id: 'kp-agent-loop',
    term: 'Agent Loop',
    oneLiner: '不知疲倦的实习生循环：想一下 → 动一下 → 汇报一下 → 还没下班？再来一遍。',
    shallow: '模型先决定要不要调用工具；工具跑完，把结果塞回上下文，再接着推理——直到没别的事可做为止。',
    deep:
      'QueryEngine.ts 里维护的其实是一个流式状态机：\n' +
      '1) 收到用户消息，或上一轮工具的结果；\n' +
      '2) 调用 LLM，流式解析出 tool_use 片段；\n' +
      '3) 按工具名字分发到 src/tools/* 里对应的实现；\n' +
      '4) 执行结果作为 tool_result 追加回消息列表；\n' +
      '5) 只要模型还在产出 tool_use 或没显式“我搞定了”，就再转一圈。\n' +
      '吐槽：所谓“Agent”，去掉营销滤镜其实就是 while 循环 + 工具表 + 权限闸。',
    tags: ['核心', '引擎'],
  },
  {
    id: 'kp-permission',
    term: 'Permission Mode',
    oneLiner: '“允许/询问/拒绝”那颗按钮——Claude Code 的安全感几乎全长在它上面。',
    shallow: '每次工具调用都先过 toolPermission 这道闸：按当前模式决定放行、弹窗、或者直接劝退。',
    deep:
      'src/hooks/toolPermission/ 综合三样东西做决定：\n' +
      '• 用户偏好（per-tool 的 allow / ask / deny）\n' +
      '• 工具自带的风险等级（safe / ask / danger）\n' +
      '• 全局 permission mode：default（正常值班）/ plan（只读预演）/ auto（减少打扰）/ bypassPermissions（拆掉保险丝）\n' +
      '吐槽：bypassPermissions 就像把家门钥匙挂门把手——省事，但别 surprise 了自己。',
    tags: ['安全', '核心'],
  },
  {
    id: 'kp-mcp',
    term: 'MCP（Model Context Protocol）',
    oneLiner: '模型世界的 USB-C——谁家写了 MCP server，Claude Code 就能多一把新工具。',
    shallow: '一个标准化协议：MCP server 端暴露 tool 和 resource，Claude Code 扮演 client 去调用。',
    deep:
      'src/services/mcp/ 建立到各 MCP server 的连接；\n' +
      'MCPTool 负责把 LLM 想调的 "server.tool" 路由过去；\n' +
      'ReadMcpResourceTool / ListMcpResourcesTool 管资源端的访问；\n' +
      'McpAuthTool 处理需要 OAuth 的 server。\n' +
      '吐槽：USB-C 再标准，也有那种“长得像但不充电”的线——MCP 生态也一样，别忘了查协议版本。',
    tags: ['生态'],
  },
  {
    id: 'kp-memdir',
    term: 'memdir',
    oneLiner: '把“上次聊过的那些事”记成一摞结构化 markdown——Claude 的外挂笔记本。',
    shallow: 'src/memdir/ 负责记忆的写入、扫描、相关性召回与老化淘汰。',
    deep:
      '记忆分层：user / project / team / transient（配合 CLAUDE.md、Auto Memory、Auto Dream、KAIROS 使用）。\n' +
      '写入来自 extractMemories 服务的自动抽取，以及用户显式 /memory 命令；\n' +
      'findRelevantMemories 在每轮对话开头按相关性挑片段塞进 system prompt。\n' +
      '老化由“Auto Dream”负责——半夜整理、合并、淘汰，像把堆满的桌面归档进抽屉。',
    tags: ['记忆'],
  },
  {
    id: 'kp-coordinator',
    term: 'Coordinator',
    oneLiner: '多 Agent 团队里的工位长——谁干啥、谁等谁、谁该下班，它都记着。',
    shallow: 'src/coordinator/ 负责团队、子 Agent 的生命周期，以及任务之间的依赖调度。',
    deep:
      'TeamCreateTool 建一个小队，Coordinator 按照 Task 的 blockedBy / blocks 关系安排顺序；\n' +
      'SendMessageTool 是成员之间的“微信”；\n' +
      'TaskOutputTool 把每个子 Agent 的产物汇总上来。\n' +
      '一句话总结：它管“谁先说话、谁后说话”——否则五个 Agent 同时冒泡的聊天窗口会很吓人。',
    tags: ['多Agent'],
  },
  {
    id: 'kp-skill',
    term: 'Skill',
    oneLiner: '可复用的“工作流小剧本”——模型按剧本演，而不是每次即兴发挥。',
    shallow: 'src/skills/ 下每个 SKILL.md 都写清了触发条件和执行步骤。',
    deep:
      'Skill 介于 prompt 和 function 之间：SkillTool 识别到合适场景时，把 SKILL.md 注入当前上下文，\n' +
      '让模型按固定节奏走流程——既保留自然语言灵活性，又给下游行为加一层稳态。\n' +
      '吐槽：当你第五次告诉 Claude “发 PR 前先跑测试”时，你真正想要的就是一个 Skill。',
    tags: ['扩展'],
  },
]

// -------------------- 章节 introHook（生活比喻 + 技术真相 + 吐槽） --------------------
export const SECTION_INTRO_HOOKS: Record<string, string> = {
  hero:
    '想象一台会自己打字、会自己读代码的笔记本——它就是 Claude Code。\n' +
    '真相是：1900 个文件、51 万行 TypeScript，用 bun:bundle 压成一个 CLI，外面裹一层 Ink 终端 UI。\n' +
    '吐槽：Anthropic 把全世界最精致的 prompt 写出来了，却没忘在发布时顺手带上 source map。',
  leak:
    '这场泄露像你朋友圈最炸的一期真人秀——爆点很小，后劲很大。\n' +
    '事件真相：.npmignore 漏掉了 .map 文件，导致源码可以从 npm tarball 里一键还原，时间线清清楚楚卡在 2026-03-31。\n' +
    '吐槽：安全真的很难，但 .npmignore 显然更难。',
  architecture:
    '把 Claude Code 想成一颗洋葱——最外层是你的键盘，最里层是 LLM，每剥一层都想哭一下。\n' +
    '技术真相：五层依次是 CLI 入口、命令/交互、Agent 引擎、工具能力、服务/外部世界；每一层都给下一层加一道权限闸和一个抽象边界。\n' +
    '吐槽：你以为复杂度是被“消灭”了，其实只是被优雅地“推给下一层”了。',
  'agent-loop':
    'Agent Loop 就像不知疲倦的实习生——你说需求，它去查资料、动文件、跑命令，干完汇报、等下一条指令。\n' +
    '技术真相：QueryEngine.ts 维护一个流式 while 循环：LLM 产 tool_use → 分发到 src/tools/* → 结果回填 → 下一轮，直到模型说“我搞定了”。\n' +
    '吐槽：所谓“Agent 智能体”，去掉营销滤镜，就是一个写得特别认真的 while 循环。',
  tools:
    '如果 LLM 是“会说话的脑子”，那 src/tools/ 就是它额外长出的四十多只手。\n' +
    '技术真相：每个工具都有 input schema、输出类型、权限等级；ToolSearchTool 还能按需加载，省 token。\n' +
    '吐槽：工具越多，“到底该不该点允许”的心智负担也就越多——安全的成本从来不是免费的。',
  permission:
    'Claude Code 的安全感不在模型里，而在那颗“允许”按钮上——真正决定命运的是你那秒的眼神。\n' +
    '技术真相：toolPermission hook 汇总工具风险等级、用户偏好、permission mode（default / plan / auto / bypassPermissions）做最终裁决。\n' +
    '吐槽：bypassPermissions 的设计目的是方便开发，不是方便你把主分支推飞——温柔提醒。',
  memory:
    '记忆不是玄学，是四层结构化的 markdown + 一个守夜的服务。\n' +
    '技术真相：CLAUDE.md（冰箱便签）→ Auto Memory（extractMemories 下班偷记）→ Auto Dream（离线整理归档）→ KAIROS（24 小时长存档与兜底）。\n' +
    '吐槽：让一个 AI 有长期记忆，原来只需要一个 markdown 文件夹、一份 cron、和一颗愿意折腾的心。',
  'multi-agent':
    '一个 Claude 忙不过来？那就复印几个——fork 出去跑、remote 上云、in-process 坐你隔壁工位。\n' +
    '技术真相：fork 独立进程彻底隔离；remote 走云端，适合长耗时与定时；in-process subagent 共享进程，启动最快但容易串味。\n' +
    '吐槽：开得越多，协调成本越高——人类公司怎么翻车的，Claude 的小队大概率就会照着翻一遍。',
  buddy:
    '正经 CLI 藏一只 ASCII 小动物，是当代工程师的浪漫，也是产品经理给命令行偷偷塞的赛博多巴胺。\n' +
    '技术真相：src/buddy/sprites.ts 定义了 18 只 Buddy，按稀有度 N / R / SR / SSR / UR 分档，抽到 UR 记得截图传同事群。\n' +
    '吐槽：Anthropic 能给你 1900 个文件的工程代码，也能给你一只叫“胖猫猫神”的 UR——这就是当代工程文化。',
  hidden:
    '源码里白纸黑字写着：“不要告诉用户你是 Claude 的哪个版本。”——可这段话本身，先被打包上传到了 npm。\n' +
    '技术真相：Undercover Mode 是一段 system prompt 策略，目的是在对外接口里避免暴露模型身份；但当 .map 暴露 src/ 时，整段策略也一起走光。\n' +
    '吐槽：教会我们一个道理——人比模型更容易泄密。',
}
