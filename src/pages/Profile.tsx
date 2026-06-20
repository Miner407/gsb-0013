import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import Modal from '@/components/Modal';

const speciesOptions = ['猫', '狗', '兔子', '仓鼠', '鸟', '其他'];
const emojiOptions = ['🐱', '🐶', '🐰', '🐹', '🐦', '🐠', '🐢', '🦎'];

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('new') === 'true';

  const pets = usePetStore((s) => s.pets);
  const currentPetId = usePetStore((s) => s.currentPetId);
  const addPet = usePetStore((s) => s.addPet);
  const updatePet = usePetStore((s) => s.updatePet);
  const deletePet = usePetStore((s) => s.deletePet);

  const currentPet = pets.find((p) => p.id === currentPetId);

  const [name, setName] = useState(isNew ? '' : currentPet?.name ?? '');
  const [species, setSpecies] = useState(isNew ? '' : currentPet?.species ?? '');
  const [breed, setBreed] = useState(isNew ? '' : currentPet?.breed ?? '');
  const [birthday, setBirthday] = useState(isNew ? '' : currentPet?.birthday ?? '');
  const [avatarEmoji, setAvatarEmoji] = useState(isNew ? '🐱' : currentPet?.avatarEmoji ?? '🐱');
  const [notes, setNotes] = useState(isNew ? '' : currentPet?.notes ?? '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isNew && !currentPet) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card p-8 text-center max-w-sm">
          <div className="text-4xl mb-3">🐾</div>
          <p className="text-warm-500 text-sm mb-4">还没有宠物档案</p>
          <button
            onClick={() => navigate('/profile?new=true')}
            className="btn-primary"
          >
            添加宠物
          </button>
        </div>
      </div>
    );
  }

  function handleSave() {
    if (!name.trim()) return;
    if (isNew) {
      addPet({ name: name.trim(), species, breed, birthday, avatarEmoji, notes });
      navigate('/');
    } else if (currentPetId) {
      updatePet(currentPetId, { name: name.trim(), species, breed, birthday, avatarEmoji, notes });
    }
  }

  function handleDelete() {
    if (currentPetId) {
      deletePet(currentPetId);
      navigate('/');
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <h1 className="font-display text-2xl text-warm-700">
        {isNew ? '添加新宠物' : '编辑宠物档案'}
      </h1>

      <div className="card p-5 space-y-4">
        <div>
          <span className="label-text">头像</span>
          <div className="flex gap-2 flex-wrap">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatarEmoji(emoji)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                  avatarEmoji === emoji
                    ? 'bg-warm-200 ring-2 ring-warm-500 scale-110'
                    : 'bg-warm-50 hover:bg-warm-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text">名字</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="宠物的名字"
          />
        </div>

        <div>
          <label className="label-text">种类</label>
          <select
            className="input-field"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          >
            <option value="">请选择</option>
            {speciesOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text">品种</label>
          <input
            className="input-field"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="如：英短、柯基"
          />
        </div>

        <div>
          <label className="label-text">生日</label>
          <input
            type="date"
            className="input-field"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>

        <div>
          <label className="label-text">备注</label>
          <textarea
            className="input-field min-h-[80px] resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="关于宠物的备注..."
          />
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary w-full">
        {isNew ? '添加宠物' : '保存修改'}
      </button>

      {!isNew && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-coral-400 hover:text-coral-500 hover:bg-coral-50 rounded-full transition-colors text-sm"
        >
          <Trash2 size={16} />
          删除宠物档案
        </button>
      )}

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="确认删除"
      >
        <p className="text-sm text-warm-600 mb-4">
          确定要删除「{currentPet?.name}」的档案吗？所有相关记录也会被删除，此操作不可撤销。
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">
            取消
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 rounded-full font-medium bg-coral-300 text-white hover:bg-coral-400 transition-colors text-sm"
          >
            确认删除
          </button>
        </div>
      </Modal>
    </div>
  );
}
