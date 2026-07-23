export interface CategoryConfig {
  icon: string
  label?: string
  order?: number
  thumbnail?: string
}

export const guidesCategories: Record<string, CategoryConfig> = {
  admin: {
    icon: 'memory:terminal',
    label: '系统管理',
    order: 1,
  },
  dev: {
    icon: 'memory:cube',
    label: '扩展开发',
    order: 2,
  },
  community: {
    icon: 'memory:comment-user',
    label: '社区指南',
    order: 3,
  },
  extra: {
    icon: 'memory:dagger',
    label: '实用教程',
    order: 4,
  },
}

export const defaultCategory: CategoryConfig = {
  icon: 'memory:folder-open',
  label: '未分类',
}
