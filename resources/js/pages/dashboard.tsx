import { Head, usePage } from '@inertiajs/react'
import { CalendarClock, ClipboardList, Users } from 'lucide-react'
import { AppSidebar } from '@/components/layouts/app-sidebar'
import { PayrollLedgerCard } from '@/components/dashboard/payroll-ledger-card'
import { StatCard } from '@/components/dashboard/stat-card'

type PageProps = { auth?: { user?: { name?: string; email?: string } } }

export default function Dashboard() {
  const { auth } = usePage<PageProps>().props
  const userName = auth?.user?.name?.split(' ')[0] || auth?.user?.email?.split('@')[0] || 'Admin'

  return (
    <>
      <Head title="Dashboard" />
      <AppSidebar>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">Good day, {userName}!</h1>
          </div>

          <div className="mt-8">
            <PayrollLedgerCard summary={{ cutoffLabel: 'No payroll run yet', payDate: '—', employeeCount: 0, grossPay: 0, bonuses: 0, deductions: 0, netPay: 0 }} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={Users} label="Employees" value="0" hint="Employee records" />
            <StatCard icon={ClipboardList} label="Pending leave requests" value="—" hint="Leave workflow not connected" />
            <StatCard icon={CalendarClock} label="Next holiday" value="—" hint="No holiday data available" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="overflow-hidden rounded-lg border bg-card text-card-foreground lg:col-span-2">
              <div className="p-6"><h2 className="font-display text-base font-semibold">Recent payroll registered</h2><p className="mt-1 text-xs text-muted-foreground">Live data from payroll registered and payroll items.</p></div>
              <div className="border-t px-6 py-8 text-center text-sm text-muted-foreground">No payroll registered have been created yet.</div>
            </section>
            <div className="flex flex-col gap-6">
              <section className="rounded-lg border bg-card text-card-foreground"><div className="p-6 pb-3"><h2 className="font-display text-base font-semibold">Pending leave</h2></div><div className="px-6 pb-6 text-sm text-muted-foreground">Leave data is intentionally not connected yet.</div></section>
              <section className="rounded-lg border bg-card text-card-foreground"><div className="p-6 pb-3"><h2 className="font-display text-base font-semibold">Upcoming holidays</h2><p className="mt-1 text-xs text-muted-foreground">Philippine holidays from the public holiday API.</p></div><div className="px-6 pb-6 text-sm text-muted-foreground">Holiday data is temporarily unavailable.</div></section>
            </div>
          </div>
        </main>
      </AppSidebar>
    </>
  )
}
