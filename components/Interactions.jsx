"use client";
import CountrySelect from "./CountrySelect";
import { PrivacyLink } from "./PrivacyPopup";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useId,
} from "react";
import { bsqCountries } from "../lib/countries.js";
import { bsqValidateLead } from "../lib/validation.js";
import { bsqLoadPhoneUtils } from "../lib/load-phone-utils.js";
import { bsqCreateLocationSlider } from "../lib/location-slider.js";

const EnquiryContext = createContext(null);
export function EnquiryButton({
  intent = "General enquiry",
  children,
  ...props
}) {
  const open = useContext(EnquiryContext);
  return (
    <button type="button" {...props} onClick={() => open(intent)}>
      {children}
    </button>
  );
}

export function LeadForm({
  source = "modal",
  intent = "General enquiry",
  submitLabel = "Enquire Now",
}) {
  const id = useId().replaceAll(":", ""),
    [country, setCountry] = useState("ae"),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [success, setSuccess] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const error = bsqValidateLead(data);
    if (error) {
      setStatus(error);
      return;
    }
    setBusy(true);
    setStatus("Sending your enquiry…");
    try {
      const utils = await bsqLoadPhoneUtils();
      const selected = bsqCountries.find((c) => c.iso === country);
      if (!utils.isValidNumber(data.phone, country))
        throw Error(
          "Please enter a valid phone number for your selected country.",
        );
      const tokenResponse = await fetch("/api/form-token", {
        signal: AbortSignal.timeout(10000),
      });
      const token = await tokenResponse.json();
      if (!tokenResponse.ok)
        throw Error(token.error || "Please try again shortly.");
      const params = new URLSearchParams(location.search);
      const attribution = Object.fromEntries(
        ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
          .filter((k) => params.has(k))
          .map((k) => [k, params.get(k).slice(0, 200)]),
      );
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          phone: utils.formatNumber(
            data.phone,
            country,
            utils.numberFormat.E164,
          ),
          country,
          callingCode: "+" + selected.dial,
          consent: form.elements.consent.checked,
          source,
          intent,
          referrer: location.href,
          attribution,
          formToken: token.token,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok)
        throw Error(result.error || "Your enquiry could not be delivered.");
      setSuccess(true);
      setStatus("");
    } catch (e) {
      setStatus(
        e.name === "TimeoutError"
          ? "The connection took too long. Please try again."
          : e.message,
      );
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="bsq-form-success" role="status">
        <h3>Thank you for your interest.</h3>
        <p>
          Your Berkeley Square enquiry has been received. Our team will be in
          touch shortly.
        </p>
        <a className="bsq-link" href="tel:80077378443">
          Speak to our team ↗
        </a>
      </div>
    );
  return (
    <form className="bsq-lead-form" onSubmit={submit}>
      <label htmlFor={"bsq-" + id + "-name"}>
        Name <span>*</span>
        <input
          id={"bsq-" + id + "-name"}
          name="name"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
        />
      </label>
      <label htmlFor={"bsq-" + id + "-email"}>
        Email <span>*</span>
        <input
          id={"bsq-" + id + "-email"}
          type="email"
          name="email"
          autoComplete="email"
          maxLength={254}
          required
        />
      </label>
      <div className="bsq-phone-group">
        <label className="bsq-phone-label" htmlFor={"bsq-" + id + "-phone"}>
          Phone Number <span>*</span>
        </label>
        <div className="bsq-react-phone">
          <CountrySelect value={country} onChange={setCountry} />
          <input
            id={"bsq-" + id + "-phone"}
            type="tel"
            name="phone"
            autoComplete="tel-national"
            maxLength={30}
            required
          />
        </div>
      </div>
      <label className="bsq-message-label" htmlFor={"bsq-" + id + "-message"}>
        Additional Notes (Optional)
        <textarea
          id={"bsq-" + id + "-message"}
          name="message"
          maxLength={1000}
          rows={3}
          placeholder="Add any questions or preferences for our team."
        />
      </label>
      <label className="bsq-honeypot" aria-hidden="true">
        Leave this empty
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="bsq-consent">
        <input type="checkbox" name="consent" required />
        <span>
          I agree to Prestige One collecting and using my details to respond to
          this enquiry or document request, as described in the <PrivacyLink />.
        </span>
      </label>
      <button
        className="bsq-button"
        disabled={busy}
        aria-busy={busy}
        type="submit"
      >
        {busy ? "Sending…" : submitLabel}
      </button>
      <p className="bsq-form-status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

export function EnquiryProvider({ children }) {
  const dialog = useRef(null),
    [intent, setIntent] = useState("General enquiry");
  function open(value) {
    setIntent(value);
    dialog.current.showModal();
    document.body.classList.add("bsq-modal-open");
  }
  function close() {
    dialog.current.close();
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !document.cookie
          .split(";")
          .some((c) => c.trim() === "bsq-interest-dismissed=1") &&
        !document.querySelector("dialog[open]") &&
        !document.activeElement?.closest("form")
      )
        open("General enquiry");
    }, 6000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <EnquiryContext.Provider value={open}>
      {children}
      <dialog
        className="bsq-dialog"
        ref={dialog}
        aria-labelledby="bsq-dialog-title"
        onClose={() => {
          if (!document.querySelector("dialog[open]"))
            document.body.classList.remove("bsq-modal-open");
          document.cookie = `bsq-interest-dismissed=1; Max-Age=259200; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
        }}
        onClick={(e) => {
          if (e.target === dialog.current) {
            const r = dialog.current.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              close();
          }
        }}
      >
        <button
          className="bsq-dialog-close"
          aria-label="Close enquiry form"
          onClick={close}
        >
          ×
        </button>
        <div className="bsq-dialog-image">
          <img
            src="/images/BS_DR_07.webp"
            alt="Berkeley Square residences"
            loading="lazy"
            width="1500"
            height="1000"
          />
        </div>
        <div className="bsq-dialog-content">
          <h2 id="bsq-dialog-title">
            {intent === "Brochure request"
              ? "Request the Berkeley Square Brochure"
              : "Discover Where Grace Resides"}
          </h2>
          <p>Berkeley Square by Prestige One</p>
          <LeadForm
            key={intent}
            intent={intent}
            submitLabel={
              intent === "Brochure request" ? "Request Brochure" : "Enquire Now"
            }
          />
        </div>
      </dialog>
    </EnquiryContext.Provider>
  );
}

const links = [
  ["About", "about"],
  ["Amenities", "amenities"],
  ["Interiors", "interiors"],
  ["Gallery", "gallery"],
  ["Location", "location"],
];
export function Header() {
  const openEnquiry = useContext(EnquiryContext);
  const dialog = useRef(null),
    [scrolled, setScrolled] = useState(false),
    [menu, setMenu] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => setScrolled(!e.isIntersecting),
      { rootMargin: "-65px 0px 0px 0px" },
    );
    const cover = document.querySelector("#home");
    if (cover) observer.observe(cover);
    return () => observer.disconnect();
  }, []);
  function close() {
    dialog.current.close();
  }
  return (
    <>
      <a className="bsq-skip" href="#main">
        Skip to content
      </a>
      <header
        className={"bsq-header" + (scrolled ? " bsq-header-scrolled" : "")}
      >
        <a
          className="bsq-developer-logo"
          href="#home"
          aria-label="Berkeley Square home"
        >
          <img
            src="/assets/prestige.svg"
            width="210"
            height="55"
            alt="Prestige One Developments"
          />
        </a>
        <nav className="bsq-header-links" aria-label="Quick navigation">
          {links.map(([label, id]) => (
            <a href={"#" + id} key={id}>
              {label}
            </a>
          ))}
        </nav>
        <div className="bsq-cover-header-actions">
          <EnquiryButton className="bsq-cover-enquire">
            Enquire now ↗
          </EnquiryButton>
          <button
            className="bsq-menu-toggle"
            aria-label="Open menu"
            aria-controls="bsq-menu-dialog"
            aria-expanded={menu}
            onClick={() => {
              dialog.current.showModal();
              setMenu(true);
              document.body.classList.add("bsq-modal-open");
            }}
          >
            ☰
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        className="bsq-menu-dialog"
        id="bsq-menu-dialog"
        aria-label="Navigation menu"
        onClose={() => {
          setMenu(false);
          if (!document.querySelector("dialog[open]"))
            document.body.classList.remove("bsq-modal-open");
        }}
      >
        <button
          className="bsq-menu-close"
          aria-label="Close menu"
          onClick={close}
        >
          ×
        </button>
        <a className="bsq-menu-logo" href="#home" onClick={close}>
          <img
            src="/assets/source/Berkeley-Square-logo-sswhite-13-3-1.png"
            alt="Berkeley Square"
            width="700"
            height="318"
          />
        </a>
        <nav className="bsq-nav">
          {links.map(([label, id]) => (
            <a key={id} href={"#" + id} onClick={close}>
              {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="bsq-button bsq-menu-enquire"
          onClick={() => {
            dialog.current.addEventListener(
              "close",
              () => openEnquiry("General enquiry"),
              { once: true },
            );
            close();
          }}
        >
          Enquire Now <span aria-hidden="true">→</span>
        </button>
        <div
          className="bsq-menu-contact"
          role="group"
          aria-label="Contact Prestige One"
        >
          <a href="tel:80077378443">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
            </svg>
            <span>800 773 78443</span>
          </a>
          <a href="mailto:enquiries@prestigeone.ae">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <span>enquiries@prestigeone.ae</span>
          </a>
        </div>
      </dialog>
    </>
  );
}

export function Gallery({ images }) {
  const [expanded, setExpanded] = useState(false);
  const [columns, setColumns] = useState(4);
  useEffect(() => {
    const tablet = window.matchMedia("(max-width: 1000px)");
    const narrow = window.matchMedia("(max-width: 360px)");
    const update = () =>
      setColumns(narrow.matches ? 1 : tablet.matches ? 2 : 4);
    update();
    tablet.addEventListener("change", update);
    narrow.addEventListener("change", update);
    return () => {
      tablet.removeEventListener("change", update);
      narrow.removeEventListener("change", update);
    };
  }, []);
  const [filter, setFilter] = useState("all"),
    [index, setIndex] = useState(0),
    dialog = useRef(null);
  const filtered = images.filter(
    (i) =>
      filter === "all" ||
      i.category === filter ||
      i.categories?.includes(filter),
  );
  const current = filtered[index] || filtered[0];
  const previewCount = columns * 2;
  const canExpand = !expanded && filtered.length > previewCount;
  const visibleImages = expanded ? filtered : filtered.slice(0, previewCount);
  return (
    <section
      className="bsq-gallery bsq-section"
      id="gallery"
      aria-labelledby="bsq-gallery-title"
    >
      <div className="bsq-gallery-heading">
        <div>
          <span className="bsq-gallery-eyebrow">
            A CLOSER LOOK AT LIFE HERE
          </span>
          <h2 id="bsq-gallery-title" className="bsq-section-heading">
            <span className="bsq-heading-accent">The Gallery</span>
          </h2>
        </div>
        <p>
          Explore the architecture, interiors and spaces that make every day
          exceptional.
        </p>
      </div>
      <div className="bsq-gallery-toolbar">
        <div
          className="bsq-gallery-filters"
          role="group"
          aria-label="Filter gallery"
        >
          {["all", "interiors", "exteriors", "amenities"].map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f);
                setIndex(0);
                setExpanded(false);
              }}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div
        className={
          "bsq-gallery-preview" +
          (canExpand ? " bsq-gallery-preview-collapsed" : "")
        }
      >
        <div className="bsq-gallery-grid" id="bsq-gallery-grid">
          {visibleImages.map((image, i) => (
            <figure className="bsq-gallery-item" key={image.src}>
              <button
                className="bsq-gallery-open"
                aria-label={"View " + image.alt}
                onClick={() => {
                  setIndex(i);
                  dialog.current.showModal();
                  document.body.classList.add("bsq-modal-open");
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width="1500"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </figure>
          ))}
        </div>
        {canExpand && (
          <button
            type="button"
            className="bsq-gallery-more"
            aria-expanded={expanded}
            aria-controls="bsq-gallery-grid"
            onClick={() => {
              setExpanded(true);
              requestAnimationFrame(() =>
                document
                  .querySelectorAll("#bsq-gallery-grid .bsq-gallery-open")
                  [previewCount]?.focus({ preventScroll: true }),
              );
            }}
          >
            View More <span aria-hidden="true">+</span>
          </button>
        )}
      </div>
      <dialog
        className="bsq-gallery-dialog"
        ref={dialog}
        aria-label="Gallery image viewer"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setIndex((index + 1) % filtered.length);
          if (e.key === "ArrowLeft")
            setIndex((index - 1 + filtered.length) % filtered.length);
        }}
        onClose={() => document.body.classList.remove("bsq-modal-open")}
      >
        <button
          className="bsq-gallery-close"
          aria-label="Close gallery image"
          onClick={() => dialog.current.close()}
        >
          ×
        </button>
        <div className="bsq-gallery-full-image">
          <img src={current.src} alt={current.alt} />
        </div>
        <div className="bsq-gallery-viewer-bottom">
          <div className="bsq-gallery-viewer-controls">
            <button
              aria-label="Previous gallery image"
              onClick={() =>
                setIndex((index - 1 + filtered.length) % filtered.length)
              }
            >
              ←
            </button>
            <button
              aria-label="Next gallery image"
              onClick={() => setIndex((index + 1) % filtered.length)}
            >
              →
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

export function LocationControls() {
  const slider = useRef(null);
  useEffect(() => {
    slider.current = bsqCreateLocationSlider(
      document.querySelector("#location"),
    );
    return () => {
      slider.current.destroy();
      slider.current = null;
    };
  }, []);
  return (
    <div className="bsq-location-navigation">
      <button
        type="button"
        className="bsq-location-arrow"
        aria-label="Previous locations"
        onClick={() => slider.current?.move(-1)}
      >
        ←
      </button>
      <button
        type="button"
        className="bsq-location-arrow"
        aria-label="Next locations"
        onClick={() => slider.current?.move(1)}
      >
        →
      </button>
    </div>
  );
}
