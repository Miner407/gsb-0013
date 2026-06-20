import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import Modal from '@/components/Modal';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function Medical() {
  const currentPetId = usePetStore((s) => s.currentPetId);
  const medicalRecords = usePetStore((s) => s.medicalRecords);
  const addMedicalRecord = usePetStore((s) => s.addMedicalRecord);
  const deleteMedicalRecord = usePetStore((s) => s.deleteMedicalRecord);

  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(getTodayStr());
  const [hospital, setHospital] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [advice, setAdvice] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const records = medicalRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date));

  function handleAdd() {
    if (!date) return;
    addMedicalRecord({ petId: currentPetId!, date, hospital, symptoms, advice });
    setDate(getTodayStr());
    setHospital('');
    setSymptoms('');
    setAdvice('');
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
          onClick={() => setShowModal(true)}
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
                      <span className="text-sm font-medium text-warm-800">{rec.hospital || '未填写医院'}</span>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="添加就医记录">
        <div className="space-y-4">
          <div>
            <label className="label-text">日期</label>
            <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label-text">医院</label>
            <input
              className="input-field"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="就诊医院"
            />
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
          <button onClick={handleAdd} className="btn-primary w-full">添加</button>
        </div>
      </Modal>
    </div>
  );
}
