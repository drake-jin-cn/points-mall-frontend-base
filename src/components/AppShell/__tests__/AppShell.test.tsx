import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppShell } from '../AppShell'
import type { MenuItem } from '../../../types/menu'

const menuItems: MenuItem[] = [
  { key: 'home', label: 'Home', path: '/' },
  {
    key: 'attendance',
    label: 'Attendance',
    icon: '📅',
    children: [{ key: 'records', label: 'Records', path: '/attendance/records' }],
  },
]

const defaultProps = {
  title: 'Points Mall',
  menuItems,
  user: { name: 'Alice Wang' },
  onLogout: vi.fn(),
  currentPath: '/',
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

// AC-01: AppShell renders sidebar + header + breadcrumb + children without errors
describe('AC-01: renders without errors', () => {
  it('renders title, breadcrumb and children', () => {
    render(
      <AppShell {...defaultProps}>
        <div data-testid="content">Hello</div>
      </AppShell>,
    )
    expect(screen.getByText('Points Mall')).toBeInTheDocument()
    expect(screen.getByTestId('content')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
  })
})

// AC-02: Sidebar toggles between 240px and 64px
describe('AC-02: sidebar width toggling', () => {
  it('starts expanded at 240px and collapses to 64px on toggle', () => {
    const { container } = render(<AppShell {...defaultProps}><div /></AppShell>)
    const sidebar = container.querySelector('.pm-sidebar') as HTMLElement
    expect(sidebar.style.width).toBe('240px')

    const toggleBtn = screen.getByRole('button', { name: /collapse sidebar/i })
    fireEvent.click(toggleBtn)
    expect(sidebar.style.width).toBe('64px')
  })
})

// AC-03: Collapsed state persists via localStorage
describe('AC-03: localStorage persistence', () => {
  it('saves collapsed state to localStorage on toggle', () => {
    render(<AppShell {...defaultProps}><div /></AppShell>)
    expect(localStorage.getItem('pm-sidebar-collapsed')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /collapse sidebar/i }))
    expect(localStorage.getItem('pm-sidebar-collapsed')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: /expand sidebar/i }))
    expect(localStorage.getItem('pm-sidebar-collapsed')).toBe('false')
  })

  it('reads initial collapsed state from localStorage', () => {
    localStorage.setItem('pm-sidebar-collapsed', 'true')
    const { container } = render(<AppShell {...defaultProps}><div /></AppShell>)
    const sidebar = container.querySelector('.pm-sidebar') as HTMLElement
    expect(sidebar.style.width).toBe('64px')
  })
})

// AC-04: Collapsed sidebar shows icon-only menu items (label hidden)
describe('AC-04: collapsed shows icon-only with tooltip', () => {
  it('menu item has title attribute for tooltip when collapsed', () => {
    render(<AppShell {...defaultProps} collapsed={true} onCollapsedChange={vi.fn()}><div /></AppShell>)
    const homeItem = screen.getByTitle('Home')
    expect(homeItem).toBeInTheDocument()
  })
})

// AC-05: Breadcrumb auto-computes from menuItems + current pathname
describe('AC-05: breadcrumb computation', () => {
  it('shows Home when no menu path matches', () => {
    render(<AppShell {...defaultProps} currentPath="/unknown"><div /></AppShell>)
    const breadcrumb = screen.getByRole('navigation', { name: 'breadcrumb' })
    expect(within(breadcrumb).getByText('Home')).toBeInTheDocument()
  })

  it('shows matched menu item label after Home', () => {
    render(
      <AppShell {...defaultProps} currentPath="/attendance/records"><div /></AppShell>,
    )
    const breadcrumb = screen.getByRole('navigation', { name: 'breadcrumb' })
    expect(within(breadcrumb).getByText('Home')).toBeInTheDocument()
    expect(within(breadcrumb).getByText('Attendance')).toBeInTheDocument()
    expect(within(breadcrumb).getByText('Records')).toBeInTheDocument()
  })
})

// AC-06: Header shows avatar initials and notification bell with badge
describe('AC-06: header user area', () => {
  it('shows initials when no avatar URL provided', () => {
    render(<AppShell {...defaultProps}><div /></AppShell>)
    expect(screen.getByText('AW')).toBeInTheDocument()
  })

  it('shows notification badge when count > 0', () => {
    render(<AppShell {...defaultProps} notificationCount={5}><div /></AppShell>)
    expect(screen.getByLabelText('5 notifications')).toBeInTheDocument()
  })

  it('hides badge when notificationCount is 0', () => {
    render(<AppShell {...defaultProps} notificationCount={0}><div /></AppShell>)
    expect(screen.queryByLabelText(/\d+ notifications/)).toBeNull()
  })

  it('shows 99+ badge when count exceeds 99', () => {
    render(<AppShell {...defaultProps} notificationCount={100}><div /></AppShell>)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })
})

// AC-07: Avatar dropdown shows Profile and Logout; clicking Logout fires onLogout
describe('AC-07: avatar dropdown and logout', () => {
  it('opens dropdown on avatar click and shows menu items', () => {
    render(<AppShell {...defaultProps}><div /></AppShell>)
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }))
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Logout' })).toBeInTheDocument()
  })

  it('calls onLogout when Logout is clicked', () => {
    const onLogout = vi.fn()
    render(<AppShell {...defaultProps} onLogout={onLogout}><div /></AppShell>)
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})

// AC-08: onNotificationClick fires when bell is clicked
describe('AC-08: notification bell callback', () => {
  it('calls onNotificationClick when bell is clicked', () => {
    const onNotificationClick = vi.fn()
    render(<AppShell {...defaultProps} onNotificationClick={onNotificationClick}><div /></AppShell>)
    fireEvent.click(screen.getByRole('button', { name: /notifications/i }))
    expect(onNotificationClick).toHaveBeenCalledTimes(1)
  })
})
