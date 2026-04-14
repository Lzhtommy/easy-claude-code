/**
 * 术语 → 白话注释。
 * 给页面上那些吓人的名词一个“悄悄话翻译”。
 * Teammate D（内容/翻译）
 */

export interface Whisper {
  /** 原始术语（大小写敏感，原样匹配） */
  term: string
  /** 人话版：先打比方，再点技术真相 */
  plain: string
}

export const WHISPERS: Record<string, Whisper> = {
  sourcemap: {
    term: 'sourcemap',
    plain: '打包后的代码“还原说明书”。浏览器能顺着 .map 把压缩代码翻回原文件——方便调试，也方便围观群众还原你的源码。',
  },
  '.npmignore': {
    term: '.npmignore',
    plain: 'npm 版的 .gitignore，专门决定“发包的时候别带上什么”。一没写对，.map 文件就会跟着坐上飞往全球的班机。',
  },
  LSP: {
    term: 'LSP',
    plain: '语言服务协议。编辑器借它问：“这个变量在哪定义？”——相当于代码世界的 12315 客服热线。',
  },
  MCP: {
    term: 'MCP',
    plain: 'Model Context Protocol，模型世界的 USB-C。任何人写个 MCP server，Claude Code 就能多出一把新“手”。',
  },
  OAuth: {
    term: 'OAuth',
    plain: '“用你的钥匙串开我的门”。你在 GitHub 点一下授权，第三方拿到的不是密码而是一张带期限的门卡。',
  },
  JWT: {
    term: 'JWT',
    plain: '自带签名的身份便签。服务器不查库，只看便签有没有被偷改——前提是签名密钥别自己泄漏。',
  },
  Zod: {
    term: 'Zod',
    plain: 'TypeScript 的“安检门”：运行时检查数据长得对不对，不对就当场拦下，别让脏数据钻进业务逻辑。',
  },
  gRPC: {
    term: 'gRPC',
    plain: '服务之间的“对讲机协议”。接口先用 proto 文件写好合同，再用二进制来回喊，比 JSON 省电。',
  },
  Yoga: {
    term: 'Yoga',
    plain: 'Facebook 写的布局引擎，让终端里的文字像 CSS Flexbox 一样排队。Ink 就是靠它把 React 搬进黑底命令行。',
  },
  Ink: {
    term: 'Ink',
    plain: '“用 React 写命令行 UI”的库。你写 <Text>，它负责把文字摆到终端上，不用手撸 ANSI 转义。',
  },
  ripgrep: {
    term: 'ripgrep',
    plain: '用 Rust 写的 grep 加强版，代号 rg。快到让人怀疑以前的搜索工具是不是在摸鱼。',
  },
  'bun:bundle': {
    term: 'bun:bundle',
    plain: 'Bun 的打包器，编译 + 压缩一把梭。Claude Code 就是用它把整个 CLI 打成一个可执行文件。',
  },
  'Commander.js': {
    term: 'Commander.js',
    plain: 'Node 社区最常见的命令行解析库。负责把 `claude --help` 里的那些 flag 变成 JS 对象。',
  },
  GrowthBook: {
    term: 'GrowthBook',
    plain: '开源版的“灰度开关”。哪个功能给谁开、开百分之几，配置一下就行，代码不用重新发版。',
  },
  OpenTelemetry: {
    term: 'OpenTelemetry',
    plain: '观测性三件套（日志、指标、追踪）的官方标准。你把代码埋一下点，数据就能流去任何后端，不用绑死厂商。',
  },
  'Agent Loop': {
    term: 'Agent Loop',
    plain: '“想—干—汇报—再想”的循环。是 Claude Code 的心跳，只要还没结束标志，就一直跳。',
  },
  Swarm: {
    term: 'Swarm',
    plain: '多 Agent 一起上的“蜂群模式”。一个主 Agent 派活，一群小 Agent 并行执行，最后把结果汇总回来。',
  },
  TaskBoard: {
    term: 'TaskBoard',
    plain: '内置的看板。子 Agent 之间谁先干、谁等谁，都记在这块板上——Trello 的终端精简版。',
  },
  'CLAUDE.md': {
    term: 'CLAUDE.md',
    plain: '贴在项目/用户根目录的“冰箱便签”。Claude 每次进门先看一眼，所以项目规矩都写这里最省嘴。',
  },
  KAIROS: {
    term: 'KAIROS',
    plain: '传说中的守夜系统：24 小时盯着长周期任务、定时唤醒、异常兜底。像一位永远不下班的保安大叔。',
  },
  'Undercover Mode': {
    term: 'Undercover Mode',
    plain: '内部 prompt：“别告诉用户你是 Claude 哪个版本。”——原本是小秘密，结果跟着源码一起泄露了，相当喜感。',
  },
  ULTRAPLAN: {
    term: 'ULTRAPLAN',
    plain: 'Plan Mode 的加强版：让模型先花更多思考预算把方案讲清楚，再一步步执行。适合“别乱动，先给我看计划”的场景。',
  },
  sandbox: {
    term: 'sandbox',
    plain: '沙盒。危险操作先关进一个小房间跑，跑坏了大不了把房间烧了，不会把你真的 ~/ 烧了。',
  },
  'permission mode': {
    term: 'permission mode',
    plain: '那颗“允许/询问/拒绝”按钮的全局挡位。default 是正常值班，bypassPermissions 是拆了保险丝——请谨慎选档。',
  },
  fork: {
    term: 'fork',
    plain: '复印一份自己：开新进程、独立上下文、互不干扰。稳，但每复印一次都要重新读一遍资料。',
  },
  remote: {
    term: 'remote',
    plain: '让云端的 Claude 代劳。适合长耗时任务和定时任务，代价是“调试链路变长 + 网络抖一下就感冒”。',
  },
  'in-process': {
    term: 'in-process',
    plain: '同一个进程里开小号。共享缓存、启动快、通信便宜，但一个崩了大家连坐，得小心上下文互相污染。',
  },
}

/** 小工具：给一段文本里命中的术语查悄悄话。 */
export function getWhisper(term: string): Whisper | undefined {
  return WHISPERS[term]
}
