/**
 * notification.js — Windows 系统通知模块
 * 通过 Electron IPC 调用主进程发送系统通知
 */

const { ipcRenderer } = require('electron');

const AppNotification = {
  /**
   * 发送系统通知
   * @param {string} title - 通知标题
   * @param {string} body - 通知内容
   */
  send(title, body) {
    ipcRenderer.send('send-notification', { title, body });
  },

  // ─── 番茄完成通知 ────────────────────────────────────────
  pomodoroComplete(count) {
    this.send(
      '🍅 番茄完成！',
      `太棒了！今天已完成第 ${count} 个番茄，休息一下吧 ☕`
    );
  },

  // ─── 休息开始通知 ────────────────────────────────────────
  breakStart(isLong) {
    if (isLong) {
      this.send('☕ 开始长休息', '你很棒！完成了4个番茄，好好休息15分钟');
    } else {
      this.send('😌 开始短休息', '休息5分钟，放松一下眼睛');
    }
  },

  // ─── 休息结束通知 ────────────────────────────────────────
  breakEnd() {
    this.send('⏰ 休息结束', '准备好了吗？开始新的番茄时间！');
  },
};
