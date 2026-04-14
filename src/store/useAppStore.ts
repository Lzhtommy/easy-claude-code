import { create } from 'zustand'
import { BUDDY_SPECIES } from '../data/content'
import type {
  BuddyRarity,
  BuddySpecies,
  PermissionChoice,
  SectionId,
} from '../data/types'

// 稀有度抽取权重：越 UR 越难抽
const RARITY_WEIGHT: Record<BuddyRarity, number> = {
  N: 50,
  R: 30,
  SR: 14,
  SSR: 5,
  UR: 1,
}

function rollRarity(): BuddyRarity {
  const total = Object.values(RARITY_WEIGHT).reduce((a, b) => a + b, 0)
  let n = Math.random() * total
  for (const [k, w] of Object.entries(RARITY_WEIGHT) as [BuddyRarity, number][]) {
    n -= w
    if (n <= 0) return k
  }
  return 'N'
}

function pickBuddyByRarity(rarity: BuddyRarity): BuddySpecies {
  const pool = BUDDY_SPECIES.filter((b) => b.rarity === rarity)
  if (pool.length > 0) {
    return pool[Math.floor(Math.random() * pool.length)]
  }
  // 保底：随机一只
  return BUDDY_SPECIES[Math.floor(Math.random() * BUDDY_SPECIES.length)]
}

export interface AppState {
  // 当前聚焦章节
  activeSection: SectionId
  setSection: (id: SectionId) => void

  // 知识点卡片展开状态
  expandedKpIds: Set<string>
  toggleKp: (id: string) => void

  // 权限小游戏
  permissionScore: number
  permissionAnswered: Record<string, PermissionChoice>
  answerPermission: (id: string, choice: PermissionChoice) => void
  setPermissionScore: (n: number) => void
  resetPermission: () => void

  // Buddy 扭蛋
  currentBuddy?: BuddySpecies
  rollHistory: BuddySpecies[]
  collectedIds: string[]
  rollBuddy: () => BuddySpecies
}

const COLLECTED_KEY = 'ecc_buddy_collected_v1'
function loadCollected(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(COLLECTED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}
function saveCollected(ids: string[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(COLLECTED_KEY, JSON.stringify(ids))
  } catch {
    /* ignore */
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  activeSection: 'hero',
  setSection: (id) => set({ activeSection: id }),

  expandedKpIds: new Set<string>(),
  toggleKp: (id) =>
    set((s) => {
      const next = new Set(s.expandedKpIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { expandedKpIds: next }
    }),

  permissionScore: 0,
  permissionAnswered: {},
  answerPermission: (id, choice) => {
    const { permissionAnswered, permissionScore } = get()
    if (permissionAnswered[id]) return // 已答过不重复计分
    // 简单计分：answerPermission 仅记录，真正判分交给组件对比 recommended
    set({
      permissionAnswered: { ...permissionAnswered, [id]: choice },
      permissionScore: permissionScore, // 调用方根据对错再 set
    })
  },
  setPermissionScore: (n) => set({ permissionScore: n }),
  resetPermission: () => set({ permissionAnswered: {}, permissionScore: 0 }),

  currentBuddy: undefined,
  rollHistory: [],
  collectedIds: loadCollected(),
  rollBuddy: () => {
    const rarity = rollRarity()
    const buddy = pickBuddyByRarity(rarity)
    set((s) => {
      const nextCollected = s.collectedIds.includes(buddy.id)
        ? s.collectedIds
        : [...s.collectedIds, buddy.id]
      if (nextCollected !== s.collectedIds) saveCollected(nextCollected)
      return {
        currentBuddy: buddy,
        rollHistory: [buddy, ...s.rollHistory].slice(0, 20),
        collectedIds: nextCollected,
      }
    })
    return buddy
  },
}))
