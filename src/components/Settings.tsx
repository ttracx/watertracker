'use client';

import { useState } from 'react';
import { UserSettings } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
}

export default function Settings({ settings, onSave, onClose }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            ⚙️ Settings
          </h2>

          <div className="space-y-5">
            {/* Daily Goal */}
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Daily Goal (glasses)
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLocalSettings(s => ({ ...s, dailyGoal: Math.max(1, s.dailyGoal - 1) }))}
                  className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 text-xl font-bold hover:bg-cyan-500/30 transition"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-white w-12 text-center">
                  {localSettings.dailyGoal}
                </span>
                <button
                  onClick={() => setLocalSettings(s => ({ ...s, dailyGoal: Math.min(20, s.dailyGoal + 1) }))}
                  className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 text-xl font-bold hover:bg-cyan-500/30 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Glass Size */}
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Glass Size (ml)
              </label>
              <div className="flex gap-2 flex-wrap">
                {[150, 200, 250, 300, 350, 500].map((size) => (
                  <button
                    key={size}
                    onClick={() => setLocalSettings(s => ({ ...s, glassSize: size }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      localSettings.glassSize === size
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {size}ml
                  </button>
                ))}
              </div>
            </div>

            {/* Reminders */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.reminderEnabled}
                  onChange={(e) => setLocalSettings(s => ({ ...s, reminderEnabled: e.target.checked }))}
                  className="w-5 h-5 rounded accent-cyan-500"
                />
                <span className="text-white/80">Enable reminders</span>
              </label>
              
              {localSettings.reminderEnabled && (
                <div className="mt-3 pl-8">
                  <label className="block text-white/60 text-sm mb-2">
                    Remind every
                  </label>
                  <select
                    value={localSettings.reminderInterval}
                    onChange={(e) => setLocalSettings(s => ({ ...s, reminderInterval: Number(e.target.value) }))}
                    className="w-full bg-white/10 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
