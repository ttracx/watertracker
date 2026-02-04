'use client';

import { DayData } from '@/lib/storage';
import { motion } from 'framer-motion';

interface StatsProps {
  weekData: DayData[];
  glassSize: number;
}

export default function Stats({ weekData, glassSize }: StatsProps) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const maxGlasses = Math.max(...weekData.map(d => Math.max(d.glasses, d.goal)), 8);
  
  const totalGlasses = weekData.reduce((sum, day) => sum + day.glasses, 0);
  const totalMl = totalGlasses * glassSize;
  const avgGlasses = (totalGlasses / 7).toFixed(1);
  const goalsHit = weekData.filter(day => day.glasses >= day.goal).length;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📊 Weekly Stats
      </h2>
      
      {/* Bar chart */}
      <div className="flex items-end justify-between gap-2 h-32 mb-4">
        {weekData.map((day, index) => {
          const date = new Date(day.date);
          const dayName = dayNames[date.getDay()];
          const heightPercent = (day.glasses / maxGlasses) * 100;
          const goalHeightPercent = (day.goal / maxGlasses) * 100;
          const isToday = day.date === new Date().toISOString().split('T')[0];
          const hitGoal = day.glasses >= day.goal;
          
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div className="relative w-full h-24 flex items-end justify-center">
                {/* Goal line */}
                <div
                  className="absolute w-full border-t-2 border-dashed border-yellow-400/50"
                  style={{ bottom: `${goalHeightPercent}%` }}
                />
                {/* Bar */}
                <motion.div
                  className={`w-3/4 rounded-t-md ${hitGoal ? 'bg-gradient-to-t from-green-500 to-emerald-400' : 'bg-gradient-to-t from-cyan-500 to-cyan-300'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
              <span className={`text-xs mt-1 ${isToday ? 'text-cyan-300 font-bold' : 'text-white/60'}`}>
                {dayName}
              </span>
              <span className="text-xs text-white/40">{day.glasses}</span>
            </div>
          );
        })}
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-300">{totalGlasses}</div>
          <div className="text-xs text-white/60">Total glasses</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-300">{avgGlasses}</div>
          <div className="text-xs text-white/60">Daily avg</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{goalsHit}/7</div>
          <div className="text-xs text-white/60">Goals hit</div>
        </div>
      </div>
      
      <div className="text-center mt-3 text-white/40 text-sm">
        Total: {(totalMl / 1000).toFixed(1)}L this week
      </div>
    </div>
  );
}
