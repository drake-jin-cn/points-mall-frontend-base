export interface MenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  path?: string
  children?: MenuItem[]
}

export interface AppShellProps {
  title: string
  logo?: React.ReactNode
  menuItems: MenuItem[]
  user: { name: string; avatar?: string }
  notificationCount?: number
  onNotificationClick?: () => void
  onProfileClick?: () => void
  onLogout: () => void
  collapsed?: boolean
  onCollapsedChange?: (v: boolean) => void
  currentPath?: string
  children: React.ReactNode
}
