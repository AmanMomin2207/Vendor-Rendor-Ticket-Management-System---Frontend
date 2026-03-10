import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ElementType
  color?: string
  delay?: number
}

export default function StatCard({ label, value, icon: Icon, color = 'text-indigo-400', delay = 0 }: StatCardProps) {
  return (
    <div
      className="glass rounded-xl p-5 card-hover border border-white/5"
      style={{ animationDelay: `${delay}ms`, animation: 'slideUp 0.4s ease both' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center bg-white/5', color)}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-display font-700 text-white">{value}</p>
      <p className="text-white/40 text-xs mt-1">{label}</p>
    </div>
  )
}
