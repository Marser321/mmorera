export interface FilmSeekRequest {
  id: number;
  targetTime: number;
}

type WatchdogHandle = unknown;

export interface FilmSeekCoordinatorOptions {
  duration: number;
  threshold: number;
  watchdogMs: number;
  issueSeek: (request: FilmSeekRequest) => void;
  scheduleWatchdog?: (callback: () => void, delay: number) => WatchdogHandle;
  cancelWatchdog?: (handle: WatchdogHandle) => void;
}

export interface FilmSeekSnapshot {
  activeRequestId: number | null;
  enabled: boolean;
  latestTargetTime: number;
  ready: boolean;
  renderedTime: number;
}

function clampTime(time: number, duration: number) {
  if (!Number.isFinite(time)) return 0;
  return Math.min(duration, Math.max(0, time));
}

export class FilmSeekCoordinator {
  private activeRequestId: number | null = null;
  private destroyed = false;
  private enabled = true;
  private latestTargetTime = 0;
  private ready = false;
  private renderedTime = 0;
  private requestId = 0;
  private watchdog: WatchdogHandle | null = null;

  constructor(private readonly options: FilmSeekCoordinatorOptions) {}

  setTarget(time: number) {
    this.latestTargetTime = clampTime(time, this.options.duration);
    this.drain();
  }

  setReady(renderedTime = 0) {
    if (this.destroyed) return;
    this.ready = true;
    this.renderedTime = clampTime(renderedTime, this.options.duration);
    this.drain();
  }

  setEnabled(enabled: boolean) {
    if (this.destroyed || this.enabled === enabled) return;
    this.enabled = enabled;
    if (!enabled) {
      this.clearWatchdog();
      this.activeRequestId = null;
      return;
    }
    this.drain();
  }

  settle(requestId: number, renderedTime: number) {
    if (this.destroyed || requestId !== this.activeRequestId) return false;
    this.clearWatchdog();
    this.activeRequestId = null;
    this.renderedTime = clampTime(renderedTime, this.options.duration);
    this.drain();
    return true;
  }

  destroy() {
    this.destroyed = true;
    this.clearWatchdog();
    this.activeRequestId = null;
  }

  snapshot(): FilmSeekSnapshot {
    return {
      activeRequestId: this.activeRequestId,
      enabled: this.enabled,
      latestTargetTime: this.latestTargetTime,
      ready: this.ready,
      renderedTime: this.renderedTime,
    };
  }

  private drain(force = false) {
    if (this.destroyed || !this.enabled || !this.ready || this.activeRequestId !== null) return;
    if (!force && Math.abs(this.latestTargetTime - this.renderedTime) < this.options.threshold) return;

    const request: FilmSeekRequest = {
      id: ++this.requestId,
      targetTime: this.latestTargetTime,
    };
    this.activeRequestId = request.id;
    this.options.issueSeek(request);
    this.watchdog = this.scheduleWatchdog(() => {
      if (this.destroyed || this.activeRequestId !== request.id) return;
      this.activeRequestId = null;
      this.watchdog = null;
      this.drain(true);
    }, this.options.watchdogMs);
  }

  private scheduleWatchdog(callback: () => void, delay: number) {
    if (this.options.scheduleWatchdog) return this.options.scheduleWatchdog(callback, delay);
    return window.setTimeout(callback, delay);
  }

  private clearWatchdog() {
    if (this.watchdog === null) return;
    if (this.options.cancelWatchdog) this.options.cancelWatchdog(this.watchdog);
    else window.clearTimeout(this.watchdog as number);
    this.watchdog = null;
  }
}
