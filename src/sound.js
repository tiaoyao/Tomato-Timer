/**
 * sound.js — 声音提醒模块
 * 使用 Web Audio API 合成提示音，无需外部音频文件
 */

const Sound = {
  ctx: null,

  // ─── 初始化 AudioContext ─────────────────────────────────
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  // ─── 播放单个音符 ────────────────────────────────────────
  playTone(frequency, startTime, duration, volume = 0.3) {
    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // 音量淡入淡出，让声音更柔和
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  },

  // ─── 番茄完成音：温柔三连音 ──────────────────────────────
  playPomodoroEnd() {
    this.init();
    const now = this.ctx.currentTime;
    // 三个上升音符，像小铃铛
    this.playTone(523.25, now + 0.0, 0.4, 0.25);   // C5
    this.playTone(659.25, now + 0.3, 0.4, 0.25);   // E5
    this.playTone(783.99, now + 0.6, 0.6, 0.25);   // G5
  },

  // ─── 休息完成音：单声提示 ───────────────────────────────
  playBreakEnd() {
    this.init();
    const now = this.ctx.currentTime;
    // 两个下降音符，温柔提醒
    this.playTone(659.25, now + 0.0, 0.4, 0.2);   // E5
    this.playTone(523.25, now + 0.3, 0.5, 0.2);   // C5
  },

  // ─── 按钮点击音（轻微反馈）──────────────────────────────
  playClick() {
    this.init();
    const now = this.ctx.currentTime;
    this.playTone(880, now, 0.08, 0.08);
  },
};
