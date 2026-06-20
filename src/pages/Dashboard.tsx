import { useNavigate } from 'react-router-dom';
import { Syringe, Scale, Utensils, HeartPulse, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import PetSwitcher from '@/components/PetSwitcher';
import WeightChart from '@/components/WeightChart';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const pets = usePetStore((s) => s.pets);
  const currentPetId = usePetStore((s) => s.currentPetId);
  const vaccineRecords = usePetStore((s) => s.vaccineRecords);
  const weightRecords = usePetStore((s) => s.weightRecords);
  const feedingRecords = usePetStore((s) => s.feedingRecords);
  const medicalRecords = usePetStore((s) => s.medicalRecords);

  if (pets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card p-8 text-center max-w-sm">
          <div className="text-5xl mb-4">🐾</div>
          <h2 className="font-display text-2xl text-warm-700 mb-2">欢迎来到宠物日记</h2>
          <p className="text-warm-500 text-sm mb-6">记录毛孩子的每一个健康瞬间</p>
          <button
            onClick={() => navigate('/profile?new=true')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            添加你的第一只宠物
          </button>
        </div>
      </div>
    );
  }

  const petVaccines = vaccineRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const petWeights = weightRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const petFeedings = feedingRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  const petMedicals = medicalRecords
    .filter((r) => r.petId === currentPetId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const today = getTodayStr();

  const todayFeedings = petFeedings.filter((r) => r.date === today);
  const fedToday = todayFeedings.length > 0;

  const latestVaccine = petVaccines[0];

  const upcomingVaccine = petVaccines
    .filter((r) => r.nextDate && r.nextDate >= today)
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate))[0];

  const vaccineDisplay = upcomingVaccine || latestVaccine;
  const isVaccineUpcoming = !!upcomingVaccine;

  const latestWeight = petWeights[0];
  const previousWeight = petWeights[1];
  let weightChange: 'up' | 'down' | 'same' | null = null;
  let weightChangeValue = 0;
  if (latestWeight && previousWeight) {
    weightChangeValue = latestWeight.weight - previousWeight.weight;
    if (weightChangeValue > 0) weightChange = 'up';
    else if (weightChangeValue < 0) weightChange = 'down';
    else weightChange = 'same';
  }

  const allRecords: { type: string; date: string; label: string }[] = [
    ...petVaccines.map((r) => ({ type: 'vaccine', date: r.date, label: `疫苗: ${r.name}` })),
    ...petWeights.map((r) => ({ type: 'weight', date: r.date, label: `体重: ${r.weight}${r.unit}` })),
    ...petFeedings.map((r) => ({ type: 'feeding', date: r.date, label: `喂食: ${r.foodType}` })),
    ...petMedicals.map((r) => ({ type: 'medical', date: r.date, label: `就医: ${r.hospital}` })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const quickActions = [
    { icon: Syringe, label: '疫苗', to: '/vaccine' },
    { icon: Scale, label: '体重', to: '/weight' },
    { icon: Utensils, label: '喂食', to: '/feeding' },
    { icon: HeartPulse, label: '就医', to: '/medical' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="md:hidden">
        <PetSwitcher />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-xs text-warm-400 mb-1">
            {isVaccineUpcoming ? '下次疫苗' : '最近疫苗'}
          </div>
          {vaccineDisplay ? (
            <div className="text-sm font-medium text-warm-800">{vaccineDisplay.name}</div>
          ) : (
            <div className="text-sm text-warm-300">暂无记录</div>
          )}
          {vaccineDisplay && (
            <div className="text-xs mt-0.5">
              {isVaccineUpcoming ? (
                <span className={vaccineDisplay.nextDate === today ? 'text-coral-400 font-medium' : 'text-sage-500'}>
                  {vaccineDisplay.nextDate === today ? '今天接种' : `${vaccineDisplay.nextDate} 待接种`}
                </span>
              ) : (
                <span className="text-warm-400">{vaccineDisplay.date}</span>
              )}
            </div>
          )}
        </div>

        <div className="card p-4">
          <div className="text-xs text-warm-400 mb-1">当前体重</div>
          {latestWeight ? (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-warm-800">
                {latestWeight.weight} {latestWeight.unit}
              </span>
              {weightChange && (
                <span className={`text-xs flex items-center gap-0.5 ${
                  weightChange === 'up' ? 'text-coral-400' :
                  weightChange === 'down' ? 'text-sage-500' : 'text-warm-400'
                }`}>
                  {weightChange === 'up' && <TrendingUp size={12} />}
                  {weightChange === 'down' && <TrendingDown size={12} />}
                  {weightChange === 'same' && <Minus size={12} />}
                  {weightChangeValue > 0 ? '+' : ''}{weightChangeValue.toFixed(1)}
                </span>
              )}
            </div>
          ) : (
            <div className="text-sm text-warm-300">暂无记录</div>
          )}
          {latestWeight && (
            <div className="text-xs text-warm-400 mt-0.5">{latestWeight.date}</div>
          )}
        </div>

        <div className="card p-4">
          <div className="text-xs text-warm-400 mb-1">今日喂食</div>
          {fedToday ? (
            <div className="flex items-center gap-2">
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-sage-100 text-sage-600">
                已喂食 ✅
              </span>
              <span className="text-xs text-warm-400">
                {todayFeedings.length} 次
              </span>
            </div>
          ) : (
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-coral-100 text-coral-500">
              未喂食
            </span>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-display text-lg text-warm-700 mb-2">体重趋势</h3>
        <WeightChart records={petWeights} />
      </div>

      <div>
        <h3 className="font-display text-lg text-warm-700 mb-3">快捷操作</h3>
        <div className="flex items-center justify-center gap-6">
          {quickActions.map(({ icon: Icon, label, to }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-full bg-warm-100 flex items-center justify-center group-hover:bg-warm-200 transition-colors">
                <Icon size={22} className="text-warm-600" />
              </div>
              <span className="text-xs text-warm-500">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-warm-700 mb-3">最近记录</h3>
        {allRecords.length === 0 ? (
          <div className="text-sm text-warm-300 text-center py-4">暂无记录</div>
        ) : (
          <div className="space-y-2">
            {allRecords.map((rec, i) => (
              <div key={i} className="card px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm text-warm-700">{rec.label}</span>
                <span className="text-xs text-warm-400">{rec.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
