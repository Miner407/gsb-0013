import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import { cn } from '@/lib/utils';

export default function PetSwitcher() {
  const navigate = useNavigate();
  const pets = usePetStore((s) => s.pets);
  const currentPetId = usePetStore((s) => s.currentPetId);
  const setCurrentPetId = usePetStore((s) => s.setCurrentPetId);

  if (pets.length === 0) {
    return (
      <button
        onClick={() => navigate('/profile?new=true')}
        className="w-full px-3 py-2 text-sm text-warm-500 hover:bg-warm-100 rounded-xl transition-colors"
      >
        添加宠物
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 overflow-x-auto scrollbar-none">
      {pets.map((pet) => (
        <button
          key={pet.id}
          onClick={() => setCurrentPetId(pet.id)}
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-200',
            pet.id === currentPetId
              ? 'ring-2 ring-warm-500 ring-offset-2 bg-warm-100 scale-110'
              : 'bg-warm-50 hover:bg-warm-100'
          )}
          title={pet.name}
        >
          {pet.avatarEmoji}
        </button>
      ))}
      <button
        onClick={() => navigate('/profile?new=true')}
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-warm-50 text-warm-400 hover:bg-warm-100 hover:text-warm-600 transition-colors border border-dashed border-warm-300"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
