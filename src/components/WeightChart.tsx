import { useRef, useEffect } from 'react';
import type { WeightRecord } from '@/types';

interface WeightChartProps {
  records: WeightRecord[];
}

export default function WeightChart({ records }: WeightChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (sorted.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = 220;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const padding = { top: 20, right: 20, bottom: 36, left: 48 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const weights = sorted.map((r) => r.weight);
    const minW = Math.floor(Math.min(...weights) - 0.5);
    const maxW = Math.ceil(Math.max(...weights) + 0.5);
    const range = maxW - minW || 1;

    const toX = (i: number) => padding.left + (i / (sorted.length - 1 || 1)) * chartW;
    const toY = (w: number) => padding.top + (1 - (w - minW) / range) * chartH;

    ctx.strokeStyle = '#FFF0DE';
    ctx.lineWidth = 1;
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = padding.top + (i / ySteps) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const val = maxW - (i / ySteps) * range;
      ctx.fillStyle = '#8B6F47';
      ctx.font = '11px Noto Sans SC, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(val.toFixed(1), padding.left - 8, y);
    }

    ctx.beginPath();
    ctx.strokeStyle = '#8B6F47';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    sorted.forEach((r, i) => {
      const x = toX(i);
      const y = toY(r.weight);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    sorted.forEach((r, i) => {
      const x = toX(i);
      const y = toY(r.weight);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD09C';
      ctx.fill();
      ctx.strokeStyle = '#8B6F47';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    ctx.fillStyle = '#8B6F47';
    ctx.font = '10px Noto Sans SC, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const maxLabels = Math.min(sorted.length, 8);
    const step = Math.max(1, Math.floor(sorted.length / maxLabels));
    sorted.forEach((r, i) => {
      if (i % step !== 0 && i !== sorted.length - 1) return;
      const x = toX(i);
      const dateStr = r.date.slice(5);
      ctx.fillText(dateStr, x, height - padding.bottom + 8);
    });
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 text-warm-400 text-sm">
        暂无体重记录
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={canvasRef} />
    </div>
  );
}
