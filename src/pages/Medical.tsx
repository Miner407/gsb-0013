import { useState } from 'react';
import { Plus, Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import Modal from '@/components/Modal';
import type { MedicalRecord } from '@/types';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

interface FormErrors {
  date?: string;
  hospital?: string;
}

export default function Medical() {
  const currentPetId = usePetStore((s) => s.currentPetId);
  const medicalRecords = usePetStore((s) => s.medicalRecords);
  const addMedicalRecord = usePetStore((s) => s.addMedicalRecord);
  const updateMedicalRecord = usePetStore((s) => s.updateMedicalRecord);
  const deleteMedicalRecord = usePetStore((s) => s.deleteMedicalRecord);

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [date, setDate] = useState(getTodayStr());
  const [hospital, setHospital] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [advice, setAdvice] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const records = medicalRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date));

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!date) {
      newErrors.date = '日期不能为空';
    }

    if (!hospital.trim()) {
      newErrors.hospital = '医院名称不能为空';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function openAddModal() {
    setEditingRecord(null);
    setDate(getTodayStr());
    setHospital('');
    setSymptoms('');
    setAdvice('');
    setErrors({});
    setShowModal(true);
  }

  function openEditModal(record: MedicalRecord) {
    setEditingRecord(record);
    setDate(record.date);
    setHospital(record.hospital);
    setSymptoms(record.symptoms);
    setAdvice(record.advice);
    setErrors({});
    setShowModal(true);
  }

  function handleSubmit() {
    if (!validateForm()) return;

    if (editingRecord) {
      updateMedicalRecord(editingRecord.id, {
        date,
        hospital: hospital.trim(),
        symptoms,
        advice,
      });
    } else {
      addMedicalRecord({
        petId: currentPetId!,
        date,
        hospital: hospital.trim(),
        symptoms,
        advice,
      });
    }

    setShowModal(false);
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-warm-700">就医记录</h1>
        <button
          onClick={openAddModal}
          className="w-9 h-9 rounded-full bg-warm-500 text-white flex items-center justify-center hover:bg-warm-600 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {records.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">🏥</div>
          <p className="text-warm-400 text-sm">暂无就医记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => {
            const isExpanded = expandedId === rec.id;
            return (
              <div key={rec.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-warm-800">{rec.hospital}</span>
                      <span className="text-xs text-warm-400">{rec.date}</span>
                    </div>
                    <div className="text-xs text-warm-500 mt-1">
                      {isExpanded ? rec.symptoms : rec.symptoms.length > 30 ? rec.symptoms.slice(0, 30) + '...' : rec.symptoms}
                    </div>
                    {isExpanded && rec.advice && (
                      <div className="text-xs text-warm-500 mt-2 border-t border-warm-100 pt-2">
                        <span className="text-warm-700 font-medium">医嘱: </span>{rec.advice}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <button
                      onClick={() => toggleExpand(rec.id)}
                      className="p-1.5 rounded-lg text-warm-400 hover:text-warm-600 hover:bg-warm-50 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button
                      onClick={() => openEditModal(rec)}
                      className="p-1.5 rounded-lg text-warm-400 hover:text-warm-600 hover:bg-warm-50 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteMedicalRecord(rec.id)}
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
        title={editingRecord ? '编辑就医记录' : '添加就医记录'}
      >
        <div className="space-y-4">
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
          <div>
            <label className="label-text">医院 <span className="text-coral-400">*</span></label>
            <input
              className={`input-field ${errors.hospital ? 'border-coral-400 focus:ring-coral-400' : ''}`}
              value={hospital}
              onChange={(e) => {
                setHospital(e.target.value);
                if (errors.hospital) setErrors((prev) => ({ ...prev, hospital: undefined }));
              }}
              placeholder="就诊医院"
            />
            {errors.hospital && <p className="text-xs text-coral-400 mt-1">{errors.hospital}</p>}
          </div>
          <div>
            <label className="label-text">症状</label>
            <textarea
              className="input-field min-h-[72px] resize-none"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="描述症状..."
            />
          </div>
          <div>
            <label className="label-text">医嘱</label>
            <textarea
              className="input-field min-h-[72px] resize-none"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="医生建议..."
            />
          </div>
          <button onClick={handleSubmit} className="btn-primary w-full">
            {editingRecord ? '保存修改' : '添加'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
