"use client";
import { createContext, useContext, useRef, useState } from "react";
const PrivacyContext = createContext(null);
let policyRequest;
export function PrivacyLink({
  className = "bsq-privacy-link",
  children = "Privacy Policy",
}) {
  const open = useContext(PrivacyContext);
  return (
    <a
      className={className}
      href="https://prestigeone.ae/privacy-policy"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        open(e.currentTarget);
      }}
    >
      {children}
    </a>
  );
}
function Text({ parts }) {
  return parts.map((part, i) =>
    part.href ? (
      <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">
        {part.text}
      </a>
    ) : (
      part.text
    ),
  );
}
export function PrivacyProvider({ children }) {
  const dialog = useRef(null),
    opener = useRef(null),
    content = useRef(null);
  const [policy, setPolicy] = useState(null),
    [error, setError] = useState("");
  async function open(trigger) {
    opener.current = trigger;
    setError("");
    dialog.current.showModal();
    document.body.classList.add("bsq-modal-open");
    if (content.current) content.current.scrollTop = 0;
    try {
      policyRequest ||= fetch("/assets/privacy-policy.json")
        .then((r) => {
          if (!r.ok) throw Error("Policy unavailable");
          return r.json();
        })
        .catch((e) => {
          policyRequest = null;
          throw e;
        });
      setPolicy(await policyRequest);
    } catch {
      setError(
        "The policy could not be loaded. Please try again or use the official website link below.",
      );
    }
  }
  function close() {
    dialog.current.close();
  }
  return (
    <PrivacyContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        id="bsq-privacy-dialog"
        className="bsq-privacy-dialog"
        aria-labelledby="bsq-privacy-title"
        onClose={() => {
          if (!document.querySelector("dialog[open]"))
            document.body.classList.remove("bsq-modal-open");
          opener.current?.focus({ preventScroll: true });
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
        <div className="bsq-privacy-header">
          <div>
            <span>PRESTIGE ONE DEVELOPMENTS</span>
            <h2 id="bsq-privacy-title">Privacy Policy</h2>
          </div>
          <button
            type="button"
            className="bsq-privacy-close"
            aria-label="Close privacy policy"
            onClick={close}
          >
            ×
          </button>
        </div>
        <div className="bsq-privacy-content" ref={content} tabIndex={0}>
          {error ? (
            <p role="alert">{error}</p>
          ) : !policy ? (
            <p role="status">Loading privacy policy…</p>
          ) : (
            policy.blocks.map((block, i) => {
              const Tag = block.tag;
              if (Tag === "ul" || Tag === "ol")
                return (
                  <Tag key={i}>
                    {block.items.map((parts, j) => (
                      <li key={j}>
                        <Text parts={parts} />
                      </li>
                    ))}
                  </Tag>
                );
              return (
                <Tag key={i}>
                  <Text parts={block.parts} />
                </Tag>
              );
            })
          )}
        </div>
        <div className="bsq-privacy-footer">
          <a
            href="https://prestigeone.ae/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            View policy on Prestige One ↗
          </a>
          <button type="button" className="bsq-privacy-done" onClick={close}>
            Close
          </button>
        </div>
      </dialog>
    </PrivacyContext.Provider>
  );
}
