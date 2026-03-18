/**
 * timer.js — 计时器核心逻辑
 * 管理计时状态、模式切换、SVG 圆环动画、番茄计数
 */

const Timer = {
  // ─── 状态 ────────────────────────────────────────────────
  mode: 'pomodoro',       // 当前模式：pomodoro / short-break / long-break
  isRunning: false,       // 是否正在计时
  isPaused: false,        // 是否暂停
  timeLeft: 0,            // 剩余秒数
  totalTime: 0,           // 本轮总秒数（用于计算进度）
  intervalId: null,       // setInterval 的 ID
  pomodoroStreak: 0,      // 连续番茄数（达到4个触发长休）

  // ─── SVG 圆环参数（与 HTML 中保持一致）──────────────────
  CIRCLE_RADIUS: 110,
  get CIRCLE_CIRCUMFERENCE() {
    return 2 * Math.PI * this.CIRCLE_RADIUS;
  },

  // ─── 初始化 ──────────────────────────────────────────────
  init() {
    const settings = Storage.getSettings();
    this.setMode('pomodoro', settings);
    this.updateDisplay();
    this.updateTodayCount();
  },

  // ─── 设置模式 ────────────────────────────────────────────
  setMode(mode, settings) {
    if (this.intervalId) this.stop();
    this.mode = mode;

    const s = settings || Storage.getSettings();
    const minutes = {
      'pomodoro': s.pomodoroTime,
      'short-break': s.shortBreakTime,
      'long-break': s.longBreakTime,
    }[mode];

    this.timeLeft = minutes * 60;
    this.totalTime = this.timeLeft;
    this.isRunning = false;
    this.isPaused = false;

    this.updateDisplay();
    this.updateModeButtons();
    this.updateCircle(1); // 重置圆环为满
    this.updateStartButton();
    this.updateTheme(mode);
  },

  // ─── 开始 / 暂停 ─────────────────────────────────────────
  toggle() {
    Sound.playClick();
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  },

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.updateStartButton();

    this.intervalId = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      this.updateCircle(this.timeLeft / this.totalTime);

      if (this.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
  },

  pause() {
    this.isRunning = false;
    this.isPaused = true;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.updateStartButton();
  },

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
  },

  // ─── 重置 ────────────────────────────────────────────────
  reset() {
    Sound.playClick();
    this.setMode(this.mode);
  },

  // ─── 完成计时 ────────────────────────────────────────────
  complete() {
    this.stop();
    this.updateCircle(0);

    if (this.mode === 'pomodoro') {
      // 番茄完成
      this.pomodoroStreak++;
      const count = Storage.incrementTodayCount();
      this.updateTodayCount();
      Sound.playPomodoroEnd();
      AppNotification.pomodoroComplete(count);

      // 4个番茄后触发长休，否则短休
      const isLong = this.pomodoroStreak >= 4;
      if (isLong) this.pomodoroStreak = 0;
      AppNotification.breakStart(isLong);

      // 自动切换到休息模式
      setTimeout(() => {
        this.setMode(isLong ? 'long-break' : 'short-break');
      }, 1500);

    } else {
      // 休息完成
      Sound.playBreakEnd();
      AppNotification.breakEnd();

      setTimeout(() => {
        this.setMode('pomodoro');
      }, 1500);
    }
  },

  // ─── UI 更新：时间显示 ───────────────────────────────────
  updateDisplay() {
    const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
    const s = (this.timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('time-display').textContent = `${m}:${s}`;

    // 更新网页标题
    const modeLabel = { pomodoro: '🍅', 'short-break': '☕', 'long-break': '🌴' }[this.mode];
    document.title = `${m}:${s} ${modeLabel} 番茄时钟`;
  },

  // ─── UI 更新：SVG 圆环进度 ───────────────────────────────
  updateCircle(progress) {
    const circle = document.getElementById('progress-ring');
    if (!circle) return;
    const offset = this.CIRCLE_CIRCUMFERENCE * (1 - Math.max(0, progress));
    circle.style.strokeDashoffset = offset;
  },

  // ─── UI 更新：开始/暂停按钮 ──────────────────────────────
  updateStartButton() {
    const btn = document.getElementById('btn-start');
    if (!btn) return;
    btn.textContent = this.isRunning ? '暂停' : (this.isPaused ? '继续' : '开始');
    btn.classList.toggle('running', this.isRunning);
  },

  // ─── UI 更新：模式按钮高亮 ───────────────────────────────
  updateModeButtons() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === this.mode);
    });
  },

  // ─── UI 更新：主题色 ─────────────────────────────────────
  updateTheme(mode) {
    const root = document.documentElement;
    const colors = {
      'pomodoro':     '#FF6B6B',
      'short-break':  '#4ECDC4',
      'long-break':   '#45B7D1',
    };
    root.style.setProperty('--accent', colors[mode]);
  },

  // ─── UI 更新：今日番茄数 ─────────────────────────────────
  updateTodayCount() {
    const el = document.getElementById('today-count');
    if (el) el.textContent = Storage.getTodayCount();
  },
};
