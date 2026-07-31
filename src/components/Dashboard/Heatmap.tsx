import React from 'react';
import { Calendar } from 'lucide-react';
import { ActivityHeatmapDay } from '../../types';

interface HeatmapProps {
  data?: ActivityHeatmapDay[];
}

export const Heatmap: React.FC<HeatmapProps> = () => {
  // Generate sample 60 days of activity
  const days: ActivityHeatmapDay[] = React.useMemo(() => {
    const list: ActivityHeatmapDay[] = [];
    const now = new Date();
    for (let i = 59; i >= 0; i--) {
      const d = new Date(now.valueOf() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];

      // Pseudo pattern based on date for realistic streak visual
      const dayNum = d.getDate();
      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (i < 14 || dayNum % 3 === 0 || dayNum % 5 === 0) {
        count = (dayNum % 7) + 1;
        if (count >= 5) level = 4;
        else if (count >= 3) level = 3;
        else if (count >= 2) level = 2;
        else level = 1;
      }

      list.push({ date: dateStr, count, level });
    }
    return list;
  }, []);

  const totalReviews = days.reduce((sum, d) => sum + d.count, 0);

  const levelColors = {
    0: 'bg-slate-800 border-slate-700/50',
    1: 'bg-indigo-900/60 border-indigo-700/50',
    2: 'bg-indigo-700 border-indigo-500/50',
    3: 'bg-indigo-500 border-indigo-400',
    4: 'bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-400/50',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">Your Practice Activity (Last 60 Days)</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">{totalReviews} practice questions solved</span>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.count} reviews`}
            className={`w-3.5 h-3.5 rounded-[3px] border ${levelColors[day.level]} transition-transform hover:scale-125 cursor-pointer`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>60 days ago</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 mr-1">Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-800 border border-slate-700" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-900/60" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-700" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-500" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
          <span className="text-[10px] text-slate-400 ml-1">More</span>
        </div>
        <span>Today</span>
      </div>
    </div>
  );
};
