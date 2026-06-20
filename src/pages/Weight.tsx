import { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import Modal from '@/components/Modal';
import WeightChart from '@/components/WeightChart';
import type { WeightRecord } from '@/types';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

interface FormErrors {
  weight?: string;
  date?: string;
}

export default function Weight() {
  const currentPetId = usePetStore((s) => s.currentPetId);
  const weightRecords = usePetStore((s) => s.weightRecords);
  const addWeightRecord = usePetStore((s) => s.addWeightRecord);
  const updateWeightRecord = usePetStore((s) => s.updateWeightRecord);
  const deleteWeightRecord = usePetStore((s) => s.deleteWeightRecord);

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WeightRecord | null>(null);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(getTodayStr());
  const [unit, setUnit] = useState('kg');
  const [errors, setErrors] = useState<FormErrors>({});

  const records = weightRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date));

  function validateForm(): boolean {
    const newErrors: FormErrors = {};
    const w = parseFloat(weight);

    if (!weight.trim() || isNaN(w)) {
      newErrors.weight = '请输入有效的体重数值';
    } else if (w <= 0) {
      newErrors.weight = '体重必须大于 0';
    }

    if (!date) {
      newErrors.date = '日期不能为空';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function openAddModal() {
    setEditingRecord(null);
    setWeight('');
    setDate(getTodayStr());
    setUnit('kg');
    setErrors({});
    setShowModal(true);
  }

  function openEditModal(record: WeightRecord) {
    setEditingRecord(record);
    setWeight(String(record.weight));
    setDate(record.date);
    setUnit(record.unit);
    setErrors({});
    setShowModal(true);
  }

  function handleSubmit() {
    if (!validateForm()) return;
    const w = parseFloat(weight);

    if (editingRecord) {
      updateWeightRecord(editingRecord.id, { weight: w, date, unit });
    } else {
      addWeightRecord({ petId: currentPetId!, weight: w, date, unit });
    }

    setShowModal(false);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-warm-700">体重记录</h1>
        <button
          onClick={openAddModal}
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
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(rec)}
                  className="p-1.5 rounded-lg text-warm-400 hover:text-warm-600 hover:bg-warm-50 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteWeightRecord(rec.id)}
                  className="p-1.5 rounded-lg text-warm-300 hover:text-coral-400 hover:bg-coral-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingRecord ? '编辑体重记录' : '添加体重记录'}
      >
        <div className="space-y-4">
          <div>
            <label className="label-text">体重 <span className="text-coral-400">*</span></label>
            <input
              type="number"
              step="0.1"
              min="0"
              className={`input-field ${errors.weight ? 'border-coral-400 focus:ring-coral-400' : ''}`}
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                if (errors.weight) setErrors((prev) => ({ ...prev, weight: undefined }));
              }}
              placeholder="0.0"
            />
            {errors.weight && <p className="text-xs text-coral-400 mt-1">{errors.weight}</p>}
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
            <label className="label-text">日期 <span className="text-coral-400">*</span></label>
            <input
              type="date"
              className={`input-field ${errors.date ? 'border-coral-400 focus:ring-coral-400' : ''}`}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
              }}
            />
            {errors.date && <p className="text-xs text-coral-400 mt-1">{errors.date}</p>}
          </div>
          <button onClick={handleSubmit} className="btn-primary w-full">
            {editingRecord ? '保存修改' : '添加'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
