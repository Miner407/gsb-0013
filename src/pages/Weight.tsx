import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import Modal from '@/components/Modal';
import WeightChart from '@/components/WeightChart';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function Weight() {
  const currentPetId = usePetStore((s) => s.currentPetId);
  const weightRecords = usePetStore((s) => s.weightRecords);
  const addWeightRecord = usePetStore((s) => s.addWeightRecord);
  const deleteWeightRecord = usePetStore((s) => s.deleteWeightRecord);

  const [showModal, setShowModal] = useState(false);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(getTodayStr());
  const [unit, setUnit] = useState('kg');

  const records = weightRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date));

  function handleAdd() {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0 || !date) return;
    addWeightRecord({ petId: currentPetId!, weight: w, date, unit });
    setWeight('');
    setDate(getTodayStr());
    setUnit('kg');
    setShowModal(false);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-warm-700">体重记录</h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-9 h-9 rounded-full bg-warm-500 text-white flex items-center justify-center hover:bg-warm-600 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-display text-lg text-warm-700 mb-2">体重趋势</h3>
        <WeightChart records={records} />
      </div>

      {records.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">⚖️</div>
          <p className="text-warm-400 text-sm">暂无体重记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <div key={rec.id} className="card px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-warm-800">
                  {rec.weight} {rec.unit}
                </span>
                <span className="text-xs text-warm-400 ml-3">{rec.date}</span>
              </div>
              <button
                onClick={() => deleteWeightRecord(rec.id)}
                className="p-1.5 rounded-lg text-warm-300 hover:text-coral-400 hover:bg-coral-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="添加体重记录">
        <div className="space-y-4">
          <div>
            <label className="label-text">体重</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="input-field"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.0"
            />
          </div>
          <div>
            <label className="label-text">单位</label>
            <select
              className="input-field"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="lb">lb</option>
            </select>
          </div>
          <div>
            <label className="label-text">日期</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
