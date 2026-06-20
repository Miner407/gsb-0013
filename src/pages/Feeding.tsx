import { useState, useMemo } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import Modal from '@/components/Modal';
import { cn } from '@/lib/utils';
import type { FeedingRecord } from '@/types';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const foodTypeOptions = ['干粮', '湿粮', '零食', '自制', '其他'];

interface FormErrors {
  date?: string;
  amount?: string;
}

export default function Feeding() {
  const currentPetId = usePetStore((s) => s.currentPetId);
  const feedingRecords = usePetStore((s) => s.feedingRecords);
  const addFeedingRecord = usePetStore((s) => s.addFeedingRecord);
  const updateFeedingRecord = usePetStore((s) => s.updateFeedingRecord);
  const deleteFeedingRecord = usePetStore((s) => s.deleteFeedingRecord);

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FeedingRecord | null>(null);
  const [date, setDate] = useState(getTodayStr());
  const [time, setTime] = useState('');
  const [foodType, setFoodType] = useState('干粮');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const today = getTodayStr();
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

  const records = feedingRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  const fedDates = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.date));
    return set;
  }, [records]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!date) {
      newErrors.date = '日期不能为空';
    }

    if (!amount.trim()) {
      newErrors.amount = '喂食份量不能为空';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function openAddModal() {
    setEditingRecord(null);
    setDate(getTodayStr());
    setTime('');
    setFoodType('干粮');
    setAmount('');
    setErrors({});
    setShowModal(true);
  }

  function openEditModal(record: FeedingRecord) {
    setEditingRecord(record);
    setDate(record.date);
    setTime(record.time);
    setFoodType(record.foodType);
    setAmount(record.amount);
    setErrors({});
    setShowModal(true);
  }

  function handleSubmit() {
    if (!validateForm()) return;

    if (editingRecord) {
      updateFeedingRecord(editingRecord.id, {
        date,
        time,
        foodType,
        amount: amount.trim(),
      });
    } else {
      addFeedingRecord({
        petId: currentPetId!,
        date,
        time,
        foodType,
        amount: amount.trim(),
      });
    }

    setShowModal(false);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-warm-700">喂食记录</h1>
        <button
          onClick={openAddModal}
          className="w-9 h-9 rounded-full bg-warm-500 text-white flex items-center justify-center hover:bg-warm-600 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="text-warm-400 hover:text-warm-600 px-2 py-1 text-sm">
            ◀
          </button>
          <span className="font-display text-lg text-warm-700">
            {viewYear}年{viewMonth + 1}月
          </span>
          <button onClick={nextMonth} className="text-warm-400 hover:text-warm-600 px-2 py-1 text-sm">
            ▶
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-xs text-warm-400 py-1">{d}</div>
          ))}
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`e${i}`} />;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === today;
            const isFed = fedDates.has(dateStr);
            return (
              <div
                key={dateStr}
                className={cn(
                  'relative flex items-center justify-center h-8 text-xs rounded-lg',
                  isToday ? 'bg-warm-500 text-white font-bold' : 'text-warm-600'
                )}
              >
                {day}
                {isFed && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sage-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {records.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">🍽️</div>
          <p className="text-warm-400 text-sm">暂无喂食记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <div key={rec.id} className="card px-4 py-3 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-warm-800">
                  {rec.foodType} · {rec.amount}
                </div>
                <div className="text-xs text-warm-400 mt-0.5">
                  {rec.date} {rec.time}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={() => openEditModal(rec)}
                  className="p-1.5 rounded-lg text-warm-400 hover:text-warm-600 hover:bg-warm-50 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteFeedingRecord(rec.id)}
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
        title={editingRecord ? '编辑喂食记录' : '添加喂食记录'}
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
            <label className="label-text">时间</label>
            <input
              type="time"
              className="input-field"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div>
            <label className="label-text">食物类型</label>
            <select
              className="input-field"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            >
              {foodTypeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">份量 <span className="text-coral-400">*</span></label>
            <input
              className={`input-field ${errors.amount ? 'border-coral-400 focus:ring-coral-400' : ''}`}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              placeholder="如：50g、一碗"
            />
            {errors.amount && <p className="text-xs text-coral-400 mt-1">{errors.amount}</p>}
          </div>
          <button onClick={handleSubmit} className="btn-primary w-full">
            {editingRecord ? '保存修改' : '添加'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
