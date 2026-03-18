/**
 * settings.js — 设置面板逻辑
 * 管理时间设置的读取、修改、保存
 */

const Settings = {
  isOpen: false,

  // ─── 初始化：从存储加载设置到表单 ───────────────────────
  init() {
    const s = Storage.getSettings();
    document.getElementById('set-pomodoro').value = s.pomodoroTime;
    document.getElementById('set-short-break').value = s.shortBreakTime;
    document.getElementById('set-long-break').value = s.longBreakTime;
  },

  // ─── 打开/关闭设置面板 ───────────────────────────────────
  toggle() {
    Sound.playClick();
    this.isOpen = !this.isOpen;
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('open', this.isOpen);
    if (this.isOpen) this.init();
  },

  close() {
    this.isOpen = false;
    document.getElementById('settings-panel').classList.remove('open');
  },

  // ─── 保存设置 ────────────────────────────────────────────
  save() {
    const pomodoroTime   = parseInt(document.getElementById('set-pomodoro').value)    || 25;
    const shortBreakTime = parseInt(document.getElementById('set-short-break').value) || 5;
    const longBreakTime  = parseInt(document.getElementById('set-long-break').value)  || 15;

    // 限制输入范围
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
    const settings = {
      pomodoroTime:   clamp(pomodoroTime, 1, 99),
      shortBreakTime: clamp(shortBreakTime, 1, 30),
      longBreakTime:  clamp(longBreakTime, 1, 60),
    };

    Storage.saveSettings(settings);
    Timer.setMode(Timer.mode, settings); // 用新设置重置计时器
    this.close();
  },
};
