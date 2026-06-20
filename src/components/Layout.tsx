import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Syringe,
  Scale,
  Utensils,
  HeartPulse,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';

const tabItems = [
  { to: '/', label: '仪表盘', icon: LayoutDashboard },
  { to: '/profile', label: '宠物档案', icon: User },
  { to: '/vaccine', label: '疫苗记录', icon: Syringe },
  { to: '/weight', label: '体重记录', icon: Scale },
  { to: '/feeding', label: '喂食记录', icon: Utensils },
  { to: '/medical', label: '就医记录', icon: HeartPulse },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function Layout() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
        <nav className="flex items-center justify-around bg-white border-t border-warm-100 px-2 py-1">
          {tabItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg text-xs transition-colors',
                  isActive
                    ? 'text-warm-700'
                    : 'text-warm-400'
                )
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-56 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
