import React, { useState } from 'react'
import type { AppShellProps } from '../../types/menu'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import styles from './AppShell.module.css'

const LS_KEY = 'pm-sidebar-collapsed'

function readCollapsedFromStorage(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(LS_KEY) === 'true'
}

export const AppShell: React.FC<AppShellProps> = ({
  title,
  logo,
  menuItems,
  user,
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,
  onLogout,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  currentPath,
  children,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(readCollapsedFromStorage)
  const isControlled = controlledCollapsed !== undefined
  const collapsed = isControlled ? controlledCollapsed! : internalCollapsed

  const pathname =
    currentPath ??
    (typeof window !== 'undefined' ? window.location.pathname : '/')

  const handleCollapsedChange = (v: boolean) => {
    if (!isControlled) {
      setInternalCollapsed(v)
      if (typeof window !== 'undefined') {
        localStorage.setItem(LS_KEY, String(v))
      }
    }
    onCollapsedChange?.(v)
  }

  return (
    <div className={`${styles.shell} pm-shell`}>
      <Sidebar
        title={title}
        logo={logo}
        menuItems={menuItems}
        collapsed={collapsed}
        currentPath={pathname}
        onCollapsedChange={handleCollapsedChange}
      />
      <div className={styles.main}>
        <Header
          menuItems={menuItems}
          user={user}
          notificationCount={notificationCount}
          onNotificationClick={onNotificationClick}
          onProfileClick={onProfileClick}
          onLogout={onLogout}
          currentPath={pathname}
        />
        <div className={`${styles.content} pm-content`}>{children}</div>
      </div>
    </div>
  )
}
