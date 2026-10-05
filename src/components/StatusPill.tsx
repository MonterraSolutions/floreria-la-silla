import { useStoreStatus } from '@/hooks/use-store-status'
import { cn } from '@/lib/utils'

export function StatusPill({ className, withDelivery = false }: { className?: string; withDelivery?: boolean }) {
  const s = useStoreStatus()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-paper/90 px-3.5 py-1.5 text-[0.78rem] font-normal text-ink-soft ring-1 ring-ink/10',
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className={cn('relative inline-flex size-2 rounded-full', s.open ? 'bg-emerald-600' : 'bg-stone/60')} />
      </span>
      {s.label}
      {withDelivery && (
        <>
          <span className="text-ink/25 max-sm:hidden" aria-hidden="true">|</span>
          <span className="text-rose max-sm:basis-full max-sm:pl-4">{s.delivery}</span>
        </>
      )}
    </span>
  )
}
