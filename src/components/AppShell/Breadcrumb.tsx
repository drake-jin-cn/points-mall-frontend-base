import React from 'react'
import type { MenuItem } from '../../types/menu'
import styles from './Breadcrumb.module.css'

function findCrumbs(
  items: MenuItem[],
  pathname: string,
  parents: MenuItem[] = [],
): MenuItem[] | null {
  for (const item of items) {
    if (item.path === pathname) return [...parents, item]
    if (item.children?.length) {
      const found = findCrumbs(item.children, pathname, [...parents, item])
      if (found) return found
    }
  }
  return null
}

interface BreadcrumbProps {
  menuItems: MenuItem[]
  currentPath: string
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ menuItems, currentPath }) => {
  const crumbs = findCrumbs(menuItems, currentPath) ?? []

  return (
    <nav className={`${styles.breadcrumb} pm-breadcrumb`} aria-label="breadcrumb">
      <span className={styles.item}>Home</span>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.key}>
          <span className={styles.separator}>/</span>
          <span
            className={`${styles.item} ${i === crumbs.length - 1 ? styles.current : ''}`}
          >
            {crumb.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  )
}
