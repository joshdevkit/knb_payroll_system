import { Link, usePage } from '@inertiajs/react'
import {
  CalendarDays,
  ChevronDown,
  ClipboardClock,
  LayoutDashboard,
  Settings,
  Users,
  WalletCards,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'

type NavItem = {
  title: string
  href: string
  icon: typeof LayoutDashboard
}

const mainItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Employees', href: '/employees', icon: Users },
  { title: 'Attendance', href: '/attendance', icon: ClipboardClock },
  { title: 'Payroll', href: '/payroll', icon: WalletCards },
  { title: 'Holidays', href: '/holidays', icon: CalendarDays },
]

export function AppSidebar({ children }: { children?: ReactNode }) {
  const { url } = usePage()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-svh w-full bg-background">
      <aside
        className={cn(
          'hidden border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex md:flex-col',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="flex h-14 items-center border-b px-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <WalletCards className="size-4" />
            </div>
            {!collapsed && (
              <span className="truncate text-sm font-semibold">KNB Payroll</span>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed((value) => !value)}
            aria-label="Toggle sidebar"
          >
            <ChevronDown className={cn('size-4 transition-transform', collapsed && '-rotate-90')} />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {!collapsed && (
            <p className="px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground">Main</p>
          )}
          {mainItems.map((item) => {
            const Icon = item.icon
            const active = url === item.href || url.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex h-9 items-center gap-2 rounded-lg px-2 text-sm transition-colors',
                  active
                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  collapsed && 'justify-center px-0',
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-2">
          <Link
            href="/settings"
            className={cn(
              'flex h-9 items-center gap-2 rounded-lg px-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              collapsed && 'justify-center px-0',
            )}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="size-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
