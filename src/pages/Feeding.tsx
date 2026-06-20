import { useState, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import Modal from '@/components/Modal';
import { cn } from '@/lib/utils';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const foodTypeOptions = ['干粮', '湿粮', '零食', '自制', '其他'];

export default function Feeding() {
  const currentPetId = usePetStore((s) => s.currentPetId);
  const feedingRecords = usePetStore((s) => s.feedingRecords);
  const addFeedingRecord = usePetStore((s) => s.addFeedingRecord);
  const deleteFeedingRecord = usePetStore((s) => s.deleteFeedingRecord);

  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(getTodayStr());
  const [time, setTime] = useState('');
  const [foodType, setFoodType] = useState('干粮');
  const [amount, setAmount] = useState('');

  const today = getTodayStr();
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

  const records = feedingRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date));

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

  function handleAdd() {
    if (!date) return;
    addFeedingRecord({ petId: currentPetId!, date, time, foodType, amount });
    setDate(getTodayStr());
    setTime('');
    setFoodType('干粮');
    setAmount('');
    setShowModal(false);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-warm-700">喂食记录</h1>
        <button
          onClick={() => setShowModal(true)}
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
              <button
                onClick={() => deleteFeedingRecord(rec.id)}
                className="p-1.5 rounded-lg text-warm-300 hover:text-coral-400 hover:bg-coral-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="添加喂食记录">
        <div className="space-y-4">
          <div>
            <label className="label-text">日期</label>
            <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label-text">时间</label>
            <input type="time" className="input-field" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div>
            <label className="label-text">食物类型</label>
            <select className="input-field" value={foodType} onChange={(e) => setFoodType(e.target.value)}>
              {foodTypeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">份量</label>
            <input
              className="input-field"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="如：50g、一碗"
            />
          </div>
          <button onClick={handleAdd} className="btn-primary w-full">添加</button>
        </div>
      </Modal>
    </div>
  );
}
