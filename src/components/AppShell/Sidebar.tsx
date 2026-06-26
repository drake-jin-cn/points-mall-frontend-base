import React from 'react'
import type { MenuItem } from '../../types/menu'
import styles from './Sidebar.module.css'

interface SidebarProps {
  title: string
  logo?: React.ReactNode
  menuItems: MenuItem[]
  collapsed: boolean
  currentPath: string
  onCollapsedChange: (v: boolean) => void
}

interface MenuItemProps {
  item: MenuItem
  collapsed: boolean
  currentPath: string
  depth?: number
}

const SidebarMenuItem: React.FC<MenuItemProps> = ({ item, collapsed, currentPath, depth = 0 }) => {
  const [open, setOpen] = React.useState(false)
  const hasChildren = !!item.children?.length
  const isActive = item.path === currentPath

  const content = (
    <>
      {item.icon && <span className={styles.icon}>{item.icon}</span>}
      {!collapsed && <span className={styles.label}>{item.label}</span>}
      {!collapsed && hasChildren && (
        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}>▸</span>
      )}
    </>
  )

  const itemClass = [
    styles.menuItem,
    isActive ? styles.active : '',
    depth > 0 ? styles.nested : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (collapsed) {
    return (
      <li title={item.label}>
        <div className={itemClass}>{content}</div>
      </li>
    )
  }

  return (
    <li>
      <div
        className={itemClass}
        onClick={() => hasChildren && setOpen((v) => !v)}
        style={{ cursor: hasChildren ? 'pointer' : 'default' }}
      >
        {content}
      </div>
      {hasChildren && open && (
        <ul className={styles.subMenu}>
          {item.children!.map((child) => (
            <SidebarMenuItem
              key={child.key}
              item={child}
              collapsed={collapsed}
              currentPath={currentPath}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({
  title,
  logo,
  menuItems,
  collapsed,
  currentPath,
  onCollapsedChange,
}) => {
  return (
    <aside
      className={`${styles.sidebar} pm-sidebar ${collapsed ? styles.collapsed : ''}`}
      style={{ width: collapsed ? 64 : 240 }}
    >
      <div className={styles.sidebarHeader}>
        {logo && <span className={styles.logoIcon}>{logo}</span>}
        {!collapsed && <span className={styles.title}>{title}</span>}
      </div>

      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.key}
              item={item}
              collapsed={collapsed}
              currentPath={currentPath}
            />
          ))}
        </ul>
      </nav>

      <button
        className={styles.collapseToggle}
        onClick={() => onCollapsedChange(!collapsed)}
        aria-label={collapsed ? 'expand sidebar' : 'collapse sidebar'}
      >
        {collapsed ? '▶' : '◀'}
      </button>
    </aside>
  )
}
