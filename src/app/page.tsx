'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaterGlass from '@/components/WaterGlass';
import Stats from '@/components/Stats';
import Settings from '@/components/Settings';
import {
  getSettings,
  saveSettings,
  getDayData,
  saveDayData,
  getTodayKey,
  getWeekData,
  UserSettings,
  DayData,
} from '@/lib/storage';
import {
  requestNotificationPermission,
  sendNotification,
  scheduleReminder,
  cancelReminder,
} from '@/lib/notifications';

export default function Home() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [todayData, setTodayData] = useState<DayData | null>(null);
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [reminderId, setReminderId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load data on mount
  useEffect(() => {
    setMounted(true);
    const loadedSettings = getSettings();
    const today = getTodayKey();
    const loadedToday = getDayData(today);
    
    setSettings(loadedSettings);
    setTodayData({ ...loadedToday, goal: loadedSettings.dailyGoal });
    setWeekData(getWeekData());
  }, []);

  // Setup reminders
  useEffect(() => {
    if (!settings?.reminderEnabled || !mounted) return;

    const setupReminders = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        const id = scheduleReminder(settings.reminderInterval, () => {
          sendNotification(
            '💧 Time to hydrate!',
            "Don't forget to drink water and stay healthy!"
          );
        });
        setReminderId(id);
      }
    };

    setupReminders();

    return () => {
      cancelReminder(reminderId);
    };
  }, [settings?.reminderEnabled, settings?.reminderInterval, mounted]);

  const addGlass = useCallback(() => {
    if (!todayData || !settings) return;

    const newData: DayData = {
      ...todayData,
      glasses: todayData.glasses + 1,
      timestamps: [...todayData.timestamps, new Date().toISOString()],
    };

    setTodayData(newData);
    saveDayData(newData);
    setWeekData(getWeekData());

    // Celebration when goal is hit
    if (newData.glasses === settings.dailyGoal) {
      sendNotification('🎉 Goal achieved!', `You've hit your daily goal of ${settings.dailyGoal} glasses!`);
    }
  }, [todayData, settings]);

  const removeGlass = useCallback(() => {
    if (!todayData || todayData.glasses <= 0) return;

    const newData: DayData = {
      ...todayData,
      glasses: todayData.glasses - 1,
      timestamps: todayData.timestamps.slice(0, -1),
    };

    setTodayData(newData);
    saveDayData(newData);
    setWeekData(getWeekData());
  }, [todayData]);

  const handleSaveSettings = (newSettings: UserSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
    
    if (todayData) {
      const newTodayData = { ...todayData, goal: newSettings.dailyGoal };
      setTodayData(newTodayData);
      saveDayData(newTodayData);
    }
  };

  if (!mounted || !settings || !todayData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="animate-pulse text-cyan-300 text-xl">Loading...</div>
      </div>
    );
  }

  const progress = (todayData.glasses / settings.dailyGoal) * 100;
  const totalMl = todayData.glasses * settings.glassSize;
  const goalMl = settings.dailyGoal * settings.glassSize;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex flex-col items-center px-4 py-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-8 relative z-10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          💧 WaterTracker
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStats(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Statistics"
          >
            📊
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 relative z-10 w-full max-w-md">
        {/* Progress ring */}
        <div className="relative">
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 283' }}
              animate={{
                strokeDasharray: `${Math.min(progress, 100) * 2.83} 283`,
              }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <WaterGlass fillPercent={Math.min(progress, 100)} size="md" />
          </div>
        </div>

        {/* Stats display */}
        <div className="text-center">
          <motion.div
            key={todayData.glasses}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold text-white"
          >
            {todayData.glasses}
            <span className="text-2xl text-white/60">/{settings.dailyGoal}</span>
          </motion.div>
          <div className="text-white/60 mt-1">
            {totalMl}ml / {goalMl}ml
          </div>
          {progress >= 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-400 font-semibold mt-2"
            >
              🎉 Daily goal achieved!
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={removeGlass}
            disabled={todayData.glasses <= 0}
            className="w-14 h-14 rounded-full bg-white/10 text-white text-2xl font-bold hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            −
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addGlass}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-white text-3xl font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition"
          >
            +
          </motion.button>
          
          <div className="w-14 h-14 flex items-center justify-center">
            <span className="text-white/60 text-sm text-center">
              {settings.glassSize}ml
            </span>
          </div>
        </div>

        {/* Quick add buttons */}
        <div className="flex gap-2 flex-wrap justify-center">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => {
                for (let i = 0; i < num; i++) {
                  setTimeout(() => addGlass(), i * 100);
                }
              }}
              className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm hover:bg-white/20 transition"
            >
              +{num} glass{num > 1 ? 'es' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Last drink time */}
      {todayData.timestamps.length > 0 && (
        <div className="text-white/40 text-sm mt-4 relative z-10">
          Last drink: {new Date(todayData.timestamps[todayData.timestamps.length - 1]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showSettings && (
          <Settings
            settings={settings}
            onSave={handleSaveSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStats && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Stats weekData={weekData} glassSize={settings.glassSize} />
              <button
                onClick={() => setShowStats(false)}
                className="w-full mt-4 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-8 text-white/30 text-xs relative z-10">
        Stay hydrated! 💙
      </footer>
    </main>
  );
}
