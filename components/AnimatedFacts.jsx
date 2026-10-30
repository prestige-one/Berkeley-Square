"use client";

import { useEffect, useRef } from "react";

export default function AnimatedFacts({ children }) {
  const section = useRef(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;

    const counters = [...section.current.querySelectorAll("strong")]
      .map((element) => {
        const match = element.textContent.match(/^(\D*)(\d+)(\D*)$/);
        if (!match) return null;
        const label = element.textContent;
        element.setAttribute("aria-label", label);
        return {
          element,
          label,
          prefix: match[1],
          target: Number(match[2]),
          suffix: match[3],
          previous: -1,
        };
      })
      .filter(Boolean);
    let frame;
    let start;

    function finish() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      for (const counter of counters)
        counter.element.textContent = counter.label;
    }

    // A single observer and animation frame drive all figures, as on Golf Residences.
    function animate(now) {
      start ??= now;
      const progress = Math.min((now - start) / 1400, 1);
      const eased = 1 - (1 - progress) ** 3;
      for (const counter of counters) {
        const value = Math.round(counter.target * eased);
        if (value !== counter.previous) {
          counter.element.textContent = `${counter.prefix}${value}${counter.suffix}`;
          counter.previous = value;
        }
      }
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        frame = requestAnimationFrame(animate);
      },
      { threshold: 0.35 },
    );
    observer.observe(section.current);

    const onMotionChange = () => {
      if (motion.matches) finish();
    };
    motion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div className="bsq-facts" id="facts" ref={section}>
      {children}
    </div>
  );
}
