/** @type {AudioContext | undefined} */
let _ctx;

function audioContext() {
  if (!_ctx) {
    const Ctor =
      typeof window !== 'undefined' &&
      (window.AudioContext ?? window.webkitAudioContext);
    if (!Ctor) return undefined;
    _ctx = new Ctor();
  }
  return _ctx;
}

/**
 * When we call `resume()` the context is still `suspended` for the rest of this
 * turn. Scheduling at `currentTime` can end up strictly in the past the moment
 * Chrome starts the clock, so those nodes never run. Nudge into the near future
 * only in that case (imperceptible delay when already running: nudge is off).
 *
 * @param {AudioContext} ac
 * @param {boolean} resumeRequested
 */
function anchorTime(ac, resumeRequested) {
  return ac.currentTime + (resumeRequested ? 0.02 : 0);
}

/**
 * @param {(resumeRequested: boolean) => void} fn
 */
function whenRunning(fn) {
  const ac = audioContext();
  if (!ac) return;

  // iOS Safari only unlocks output from a user gesture’s *synchronous* stack.
  // If we schedule nodes inside `resume().then(...)`, that runs after the tap
  // finishes and the context stays effectively muted.
  const resumeRequested = ac.state !== 'running';
  if (resumeRequested) void ac.resume();
  fn(resumeRequested);
}

/**
 * Short percussive “pop” for order +/- taps.
 */
export function playOrderPop() {
  whenRunning((resumeRequested) => {
    const ac = audioContext();
    if (!ac) return;
    const t0 = anchorTime(ac, resumeRequested);
    const dur = 0.015;

    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t0);
    osc.frequency.exponentialRampToValueAtTime(5, t0 + dur);

    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.1, t0 + 0.004);
    g.gain.exponentialRampToValueAtTime(0.000008, t0 + dur);

    osc.connect(g);
    g.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  });
}

/**
 * Stylized “ka-ching” when the payment QR screen appears.
 */
export function playCashRegister() {
  whenRunning((resumeRequested) => {
    const ac = audioContext();
    if (!ac) return;
    const t0 = anchorTime(ac, resumeRequested);

    // Drawer / thunk: quick low sine
    {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, t0);
      osc.frequency.exponentialRampToValueAtTime(55, t0 + 0.05);
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.22, t0 + 0.003);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.09);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + 0.1);
    }

    const ding = (start, freq, vol) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(vol, start + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0008, start + 0.14);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(start);
      osc.stop(start + 0.16);
    };

    ding(t0 + 0.045, 1318, 0.09);
    ding(t0 + 0.095, 1760, 0.08);
    ding(t0 + 0.155, 2093, 0.07);
  });
}

/**
 * Upward two-note chime when starting a new order from the payment screen.
 */
export function playNewOrder() {
  whenRunning((resumeRequested) => {
    const ac = audioContext();
    if (!ac) return;
    const t0 = anchorTime(ac, resumeRequested);

    const blip = (t, freq, vol) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.11);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    };

    blip(t0, 523, 0.06);
    blip(t0 + 0.07, 784, 0.05);
  });
}
