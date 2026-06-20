import { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import Modal from '@/components/Modal';
import type { VaccineRecord } from '@/types';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

interface FormErrors {
  name?: string;
  date?: string;
  nextDate?: string;
}

export default function Vaccine() {
  const currentPetId = usePetStore((s) => s.currentPetId);
  const vaccineRecords = usePetStore((s) => s.vaccineRecords);
  const addVaccineRecord = usePetStore((s) => s.addVaccineRecord);
  const updateVaccineRecord = usePetStore((s) => s.updateVaccineRecord);
  const deleteVaccineRecord = usePetStore((s) => s.deleteVaccineRecord);

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VaccineRecord | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState(getTodayStr());
  const [nextDate, setNextDate] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const records = vaccineRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const today = getTodayStr();

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = '疫苗名称不能为空';
    }

    if (!date) {
      newErrors.date = '接种日期不能为空';
    }

    if (nextDate && date && nextDate < date) {
      newErrors.nextDate = '下次接种日期不能早于接种日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function openAddModal() {
    setEditingRecord(null);
    setName('');
    setDate(getTodayStr());
    setNextDate('');
    setErrors({});
    setShowModal(true);
  }

  function openEditModal(record: VaccineRecord) {
    setEditingRecord(record);
    setName(record.name);
    setDate(record.date);
    setNextDate(record.nextDate);
    setErrors({});
    setShowModal(true);
  }

  function handleSubmit() {
    if (!validateForm()) return;

    if (editingRecord) {
      updateVaccineRecord(editingRecord.id, {
        name: name.trim(),
        date,
        nextDate,
      });
    } else {
      addVaccineRecord({
        petId: currentPetId!,
        name: name.trim(),
        date,
        nextDate,
      });
    }

    setShowModal(false);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-warm-700">疫苗记录</h1>
        <button
          onClick={openAddModal}
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
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(rec)}
                      className="p-1.5 rounded-lg text-warm-400 hover:text-warm-600 hover:bg-warm-50 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteVaccineRecord(rec.id)}
                      className="p-1.5 rounded-lg text-warm-300 hover:text-coral-400 hover:bg-coral-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingRecord ? '编辑疫苗记录' : '添加疫苗记录'}
      >
        <div className="space-y-4">
          <div>
            <label className="label-text">疫苗名称 <span className="text-coral-400">*</span></label>
            <input
              className={`input-field ${errors.name ? 'border-coral-400 focus:ring-coral-400' : ''}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="如：狂犬疫苗"
            />
            {errors.name && <p className="text-xs text-coral-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label-text">接种日期 <span className="text-coral-400">*</span></label>
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
          <div>
            <label className="label-text">下次接种日期</label>
            <input
              type="date"
              className={`input-field ${errors.nextDate ? 'border-coral-400 focus:ring-coral-400' : ''}`}
              value={nextDate}
              onChange={(e) => {
                setNextDate(e.target.value);
                if (errors.nextDate) setErrors((prev) => ({ ...prev, nextDate: undefined }));
              }}
            />
            {errors.nextDate && <p className="text-xs text-coral-400 mt-1">{errors.nextDate}</p>}
          </div>
          <button onClick={handleSubmit} className="btn-primary w-full">
            {editingRecord ? '保存修改' : '添加'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
