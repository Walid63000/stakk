// Retours haptiques légers sur les interactions clés.
// navigator.vibrate n'existe pas partout (iOS Safari) : no-op silencieux.

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* no-op */
    }
  }
}

/** Tap léger — navigation, boutons. */
export function tapHaptic() {
  vibrate(10);
}

/** Moment fort — score révélé, record battu. */
export function impactHaptic() {
  vibrate([12, 60, 24]);
}
