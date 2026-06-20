import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-200"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg mx-4 bg-white rounded-2xl border border-warm-200',
          'shadow-xl p-6',
          'animate-[modalIn_200ms_ease-out]'
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-warm-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-warm-400 hover:text-warm-600 hover:bg-warm-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
