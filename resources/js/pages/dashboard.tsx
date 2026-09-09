import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowUpRight, ClipboardClock, Users, WalletCards } from 'lucide-react'
import type { ReactNode } from 'react'
import { AppSidebar } from '@/components/layouts/app-sidebar'
import { buttonVariants } from '@/components/ui/button'

export default function Dashboard() {
  const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props
  const userName = auth?.user?.name ?? 'Administrator'

  return (
    <>
      <Head title="Dashboard" />
      <AppSidebar>
        <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
          <h1 className="text-sm font-semibold">Dashboard</h1>
          <div className="text-sm text-muted-foreground">{userName}</div>
        </header>

        <main className="flex-1 space-y-6 p-4 md:p-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Good morning, {userName}</h2>
            <p className="text-sm text-muted-foreground">
              Here's an overview of your payroll system.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardCard title="Employees" value="0" description="Active employees" icon={<Users className="size-4" />} href="/employees" />
            <DashboardCard title="Attendance" value="0" description="Records this period" icon={<ClipboardClock className="size-4" />} href="/attendance" />
            <DashboardCard title="Payroll Runs" value="0" description="Current payroll runs" icon={<WalletCards className="size-4" />} href="/payroll" />
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-xs">
            <h3 className="font-semibold">Payroll overview</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Payroll activity will appear here once employees and attendance records are added.
            </p>
            <Link href="/employees" className={`${buttonVariants()} mt-4`}>
              Add employees
              <ArrowUpRight />
            </Link>
          </div>
        </main>
      </AppSidebar>
    </>
  )
}

function DashboardCard({
  title,
  value,
  description,
  icon,
  href,
}: {
  title: string
  value: string
  description: string
  icon: ReactNode
  href: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-card p-5 shadow-xs transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </Link>
  )
}
