import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Syringe,
  Scale,
  Utensils,
  HeartPulse,
} from 'lucide-react';
import PetSwitcher from '@/components/PetSwitcher';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: '仪表盘', icon: LayoutDashboard },
  { to: '/profile', label: '宠物档案', icon: User },
  { to: '/vaccine', label: '疫苗记录', icon: Syringe },
  { to: '/weight', label: '体重记录', icon: Scale },
  { to: '/feeding', label: '喂食记录', icon: Utensils },
  { to: '/medical', label: '就医记录', icon: HeartPulse },
];

export default function Sidebar() {
  return (
    <aside className="flex flex-col h-full bg-white border-r border-warm-50">
      <div className="px-6 py-5">
        <h1 className="font-display text-2xl text-warm-700">宠物日记</h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-warm-100 text-warm-700'
                  : 'text-warm-400 hover:text-warm-600 hover:bg-warm-50'
              )
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-warm-100">
        <PetSwitcher />
      </div>
    </aside>
  );
}
