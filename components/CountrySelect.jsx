"use client";
import { useEffect, useId, useRef, useState } from "react";
import { bsqCountries } from "../lib/countries.js";

export default function CountrySelect({ value, onChange }) {
  const id = "bsq-country-" + useId().replaceAll(":", "");
  const trigger = useRef(null),
    panel = useRef(null),
    search = useRef(null);
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [active, setActive] = useState(0);
  const country = bsqCountries.find((c) => c.iso === value);
  const normalized = query.trim().toLocaleLowerCase().replace(/^\+/, "");
  const matches = bsqCountries.filter((c) =>
    `${c.name} ${c.iso} ${c.dial}`.toLocaleLowerCase().includes(normalized),
  );
  useEffect(() => {
    if (!open) return;
    search.current?.focus({ preventScroll: true });
    const events = new AbortController();
    window.addEventListener("resize", position, { signal: events.signal });
    document.addEventListener(
      "scroll",
      (event) => {
        if (!panel.current?.contains(event.target)) position();
      },
      { capture: true, signal: events.signal },
    );
    return () => events.abort();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const list = panel.current.querySelector('[role="listbox"]');
    const option = document.getElementById(id + "-option-" + active);
    if (!list || !option) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight)
      list.scrollTop = bottom - list.clientHeight;
  }, [active, open, id, query]);
  function toggle() {
    if (panel.current.matches(":popover-open")) {
      panel.current.hidePopover();
      return;
    }
    setQuery("");
    setActive(0);
    position();
    panel.current.showPopover();
  }
  function position() {
    const rect = trigger.current.getBoundingClientRect();
    const width = Math.min(360, document.documentElement.clientWidth - 28);
    const below = innerHeight - rect.bottom - 14;
    const above = rect.top - 14;
    const down = below >= 220 || below >= above;
    const height = Math.min(340, down ? below : above);
    Object.assign(panel.current.style, {
      width: width + "px",
      maxHeight: Math.max(160, height) + "px",
      left: Math.max(14, Math.min(rect.left, innerWidth - width - 14)) + "px",
      top:
        (down ? rect.bottom + 7 : Math.max(14, rect.top - height - 7)) + "px",
    });
  }
  function choose(iso) {
    onChange(iso);
    panel.current.hidePopover();
    trigger.current.focus({ preventScroll: true });
  }
  function onKey(event) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      setActive((i) =>
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? matches.length - 1
            : (i + (event.key === "ArrowDown" ? 1 : -1) + matches.length) %
              Math.max(1, matches.length),
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (matches[active]) choose(matches[active].iso);
    } else if (event.key === "Escape") {
      event.preventDefault();
      panel.current.hidePopover();
      trigger.current.focus({ preventScroll: true });
    }
  }
  return (
    <>
      <button
        type="button"
        className="bsq-country-picker bsq-country-trigger"
        ref={trigger}
        aria-label={`Country calling code: ${country.name} +${country.dial}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
      >
        <span
          className={`bsq-country-flag bsq-country-flag-${value}`}
          aria-hidden="true"
        />
        <span className="bsq-country-selected">+{country.dial}</span>
        <span className="bsq-country-chevron" aria-hidden="true" />
      </button>
      <div
        ref={panel}
        id={id}
        popover="auto"
        role="dialog"
        aria-label="Choose country calling code"
        className="bsq-country-dropdown"
        onToggle={() => setOpen(panel.current.matches(":popover-open"))}
      >
        {open && (
          <>
            <label
              className="bsq-country-search-label"
              htmlFor={id + "-search"}
            >
              Search country or calling code
            </label>
            <input
              ref={search}
              id={id + "-search"}
              className="bsq-country-search-input"
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={id + "-list"}
              aria-activedescendant={
                matches[active] ? `${id}-option-${active}` : undefined
              }
              placeholder="Type a country or + code"
              autoComplete="off"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKey}
            />
            <div
              id={id + "-list"}
              role="listbox"
              aria-label="Countries"
              className="bsq-country-results"
            >
              {matches.map((c, i) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={c.iso === value}
                  id={`${id}-option-${i}`}
                  key={c.iso}
                  tabIndex={-1}
                  className={
                    "bsq-country-option" +
                    (i === active ? " bsq-country-active" : "")
                  }
                  onClick={() => choose(c.iso)}
                >
                  <span
                    className={`bsq-country-flag bsq-country-flag-${c.iso}`}
                    aria-hidden="true"
                  />
                  <span className="bsq-country-name">{c.name}</span>
                  <span className="bsq-country-option-code">+{c.dial}</span>
                </button>
              ))}
            </div>
            {!matches.length && (
              <p className="bsq-country-empty" role="status">
                No countries found. Try a name or calling code.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
