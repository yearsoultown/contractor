import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

export function SidebarItem({ icon: Icon, label, active = false, badge, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all group',
        active
          ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      {badge && (
        <span
          className={cn(
            'text-[10px] font-bold px-2 py-0.5 rounded-full',
            active ? 'bg-white/20 text-white' : 'bg-brand-soft-blue text-brand-blue',
          )}
        >
          {badge}
        </span>
      )}
    </div>
  );
}