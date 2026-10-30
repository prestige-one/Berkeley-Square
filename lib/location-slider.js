// One visibility observer and timer; no animation library or continuous scroll loop.
export function bsqCreateLocationSlider(section) {
  const track = section.querySelector(".bsq-location-cards");
  const cards = [...track.querySelectorAll(".bsq-destination")];
  const region = section.querySelector(".bsq-location-slider");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  let timer;
  let visible = !("IntersectionObserver" in window);
  let hovering = false;
  let dragging = false;
  let disposed = false;

  function schedule() {
    clearTimeout(timer);
    if (
      disposed ||
      motion.matches ||
      !visible ||
      hovering ||
      dragging ||
      document.visibilityState !== "visible" ||
      region.contains(document.activeElement)
    )
      return;
    timer = setTimeout(() => move(1), 3500);
  }
  function move(direction) {
    const maximum = track.scrollWidth - track.clientWidth;
    if (maximum <= 1 || cards.length < 2) return;
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    const wrap =
      direction > 0 ? track.scrollLeft >= maximum - 2 : track.scrollLeft <= 2;
    const target = wrap
      ? direction > 0
        ? 0
        : maximum
      : Math.max(
          0,
          Math.min(
            maximum,
            (Math.round(track.scrollLeft / step) + direction) * step,
          ),
        );
    track.scrollTo({
      left: target,
      behavior: motion.matches || wrap ? "instant" : "smooth",
    });
    schedule();
  }
  function on(target, event, handler, options = {}) {
    target.addEventListener(event, handler, {
      ...options,
      signal: events.signal,
    });
  }
  on(region, "mouseenter", () => {
    hovering = true;
    schedule();
  });
  on(region, "mouseleave", () => {
    hovering = false;
    schedule();
  });
  on(region, "focusin", schedule);
  on(region, "focusout", () => queueMicrotask(schedule));
  on(
    track,
    "pointerdown",
    () => {
      dragging = true;
      schedule();
    },
    { passive: true },
  );
  on(
    window,
    "pointerup",
    () => {
      dragging = false;
      schedule();
    },
    { passive: true },
  );
  on(
    window,
    "pointercancel",
    () => {
      dragging = false;
      schedule();
    },
    { passive: true },
  );
  on(document, "visibilitychange", schedule);
  on(motion, "change", schedule);
  on(track, "keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  });
  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            schedule();
          },
          { threshold: 0.15 },
        )
      : null;
  observer?.observe(track);
  schedule();
  return {
    move,
    destroy() {
      disposed = true;
      clearTimeout(timer);
      observer?.disconnect();
      events.abort();
    },
  };
}
