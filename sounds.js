/** @type {AudioContext | undefined} */
let _ctx;

function audioContext() {
  if (!_ctx) {
    _ctx = new AudioContext();
  }
  return _ctx;
}

/**
 * @param {() => void} fn
 */
function whenRunning(fn) {
  const ac = audioContext();
  if (ac.state === 'running') {
    fn();
    return;
  }
  void ac.resume().then(fn);
}

/**
 * Short percussive “pop” for order +/- taps.
 */
export function playOrderPop() {
  whenRunning(() => {
    const ac = audioContext();
    const t0 = ac.currentTime;
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
  whenRunning(() => {
    const ac = audioContext();
    const t0 = ac.currentTime;

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
  whenRunning(() => {
    const ac = audioContext();
    const t0 = ac.currentTime;

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
