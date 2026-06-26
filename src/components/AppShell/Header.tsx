import React, { useState, useRef, useEffect } from 'react'
import type { AppShellProps } from '../../types/menu'
import { Breadcrumb } from './Breadcrumb'
import styles from './Header.module.css'

type HeaderProps = Pick<
  AppShellProps,
  | 'menuItems'
  | 'user'
  | 'notificationCount'
  | 'onNotificationClick'
  | 'onProfileClick'
  | 'onLogout'
> & { currentPath: string }

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export const Header: React.FC<HeaderProps> = ({
  menuItems,
  user,
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,
  onLogout,
  currentPath,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={`${styles.header} pm-header`}>
      <div className={styles.left}>
        <Breadcrumb menuItems={menuItems} currentPath={currentPath} />
      </div>

      <div className={styles.right}>
        {/* Notification bell */}
        <button
          className={styles.bellButton}
          onClick={onNotificationClick}
          aria-label="notifications"
        >
          <span className={styles.bellIcon}>🔔</span>
          {notificationCount > 0 && (
            <span className={styles.badge} aria-label={`${notificationCount} notifications`}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>

        {/* User avatar + dropdown */}
        <div className={styles.avatarWrapper} ref={dropdownRef}>
          <button
            className={styles.avatarButton}
            onClick={() => setDropdownOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label={`user menu for ${user.name}`}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarInitials}>{getInitials(user.name)}</span>
            )}
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown} role="menu">
              <div className={styles.dropdownName}>{user.name}</div>
              <hr className={styles.divider} />
              <button
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => {
                  setDropdownOpen(false)
                  onProfileClick?.()
                }}
              >
                Profile
              </button>
              <button
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => {
                  setDropdownOpen(false)
                  onLogout()
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
