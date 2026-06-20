import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import Modal from '@/components/Modal';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function Vaccine() {
  const currentPetId = usePetStore((s) => s.currentPetId);
  const vaccineRecords = usePetStore((s) => s.vaccineRecords);
  const addVaccineRecord = usePetStore((s) => s.addVaccineRecord);
  const deleteVaccineRecord = usePetStore((s) => s.deleteVaccineRecord);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState(getTodayStr());
  const [nextDate, setNextDate] = useState('');

  const records = vaccineRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const today = getTodayStr();

  function handleAdd() {
    if (!name.trim() || !date) return;
    addVaccineRecord({ petId: currentPetId!, name: name.trim(), date, nextDate });
    setName('');
    setDate(getTodayStr());
    setNextDate('');
    setShowModal(false);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-warm-700">疫苗记录</h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-9 h-9 rounded-full bg-warm-500 text-white flex items-center justify-center hover:bg-warm-600 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {records.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">💉</div>
          <p className="text-warm-400 text-sm">还没有疫苗记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => {
            const isOverdue = rec.nextDate && rec.nextDate < today;
            return (
              <div key={rec.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-warm-800 text-sm">{rec.name}</div>
                    <div className="text-xs text-warm-400 mt-1">接种日期: {rec.date}</div>
                    {rec.nextDate && (
                      <div className={`text-xs mt-0.5 ${isOverdue ? 'text-coral-300 font-medium' : 'text-warm-400'}`}>
                        下次接种: {rec.nextDate} {isOverdue ? '⚠️ 已过期' : ''}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteVaccineRecord(rec.id)}
                    className="p-1.5 rounded-lg text-warm-300 hover:text-coral-400 hover:bg-coral-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="添加疫苗记录">
        <div className="space-y-4">
          <div>
            <label className="label-text">疫苗名称</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：狂犬疫苗"
            />
          </div>
          <div>
            <label className="label-text">接种日期</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label-text">下次接种日期</label>
            <input
              type="date"
              className="input-field"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
            />
          </div>
          <button onClick={handleAdd} className="btn-primary w-full">
            添加
          </button>
        </div>
      </Modal>
    </div>
  );
}
