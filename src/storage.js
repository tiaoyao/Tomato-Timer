/**
 * storage.js — 本地数据存储模块
 * 使用 localStorage 存储今日番茄数和用户设置
 */

const Storage = {
  // ─── 用户设置默认值 ──────────────────────────────────────
  defaults: {
    pomodoroTime: 25,   // 番茄时长（分钟）
    shortBreakTime: 5,  // 短休时长（分钟）
    longBreakTime: 15,  // 长休时长（分钟）
  },

  // ─── 获取今日番茄数 ─────────────────────────────────────
  getTodayCount() {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem('tomato_today') || '{}');
    // 如果不是今天的数据，重置
    if (saved.date !== today) {
      return 0;
    }
    return saved.count || 0;
  },

  // ─── 增加今日番茄数 ─────────────────────────────────────
  incrementTodayCount() {
    const today = new Date().toDateString();
    const count = this.getTodayCount() + 1;
    localStorage.setItem('tomato_today', JSON.stringify({ date: today, count }));
    return count;
  },

  // ─── 获取用户设置 ───────────────────────────────────────
  getSettings() {
    const saved = JSON.parse(localStorage.getItem('tomato_settings') || '{}');
    return { ...this.defaults, ...saved };
  },

  // ─── 保存用户设置 ───────────────────────────────────────
  saveSettings(settings) {
    localStorage.setItem('tomato_settings', JSON.stringify(settings));
  },
};
