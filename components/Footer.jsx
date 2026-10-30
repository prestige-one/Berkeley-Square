import { PrivacyLink } from "./PrivacyPopup";
import { EnquiryButton } from "./Interactions";
export default function Footer() {
  return (
    <footer className="bsq-footer">
      <div className="bsq-footer-inner">
        <div className="bsq-footer-main">
          <div className="bsq-footer-brand">
            <a
              className="bsq-footer-logo"
              href="#home"
              aria-label="Prestige One home"
            >
              <img
                src="/assets/prestige.svg"
                width="316"
                height="102"
                alt="Prestige One Developments"
                loading="lazy"
              />
            </a>
            <p className="bsq-footer-project">Berkeley Square</p>
            <p className="bsq-footer-description">
              Victorian-inspired living.
              <br />
              One extraordinary address in Jumeirah Village Circle.
            </p>
          </div>
          <div className="bsq-footer-explore">
            <h2 className="bsq-footer-label">Explore the residences</h2>
            <nav aria-label="Footer">
              <a href="#about">About</a>
              <a href="#amenities">Amenities</a>
              <a href="#gallery">Gallery</a>
              <a href="#brochure">Brochure</a>
              <a href="#location">Location</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
          <div className="bsq-footer-connect">
            <h2 className="bsq-footer-label">Let’s find your new home</h2>
            <a className="bsq-footer-phone" href="tel:80077378443">
              800 773 78443
            </a>
            <p>Speak with the Prestige One team.</p>
            <EnquiryButton className="bsq-footer-enquire">
              Register your interest <span aria-hidden="true">↗</span>
            </EnquiryButton>
          </div>
        </div>
        <div className="bsq-footer-bottom">
          <span>
            © <span id="bsq-year">2026</span> Prestige One Developments. All
            rights reserved.
          </span>
          <div
            className="bsq-footer-socials"
            role="group"
            aria-label="Follow Prestige One"
          >
            <a
              href="https://instagram.com/byprestigeone/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Prestige One on Instagram"
              title="Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <circle cx="17.5" cy="6.5" r="1.1" />
              </svg>
            </a>
            <a
              href="https://facebook.com/ByPrestigeOne/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Prestige One on Facebook"
              title="Facebook"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M13.8 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5H17V3.2c-.3 0-1.3-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.6v3.2h2.8V21z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/byprestigeone/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Prestige One on LinkedIn"
              title="LinkedIn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5.3 7.4a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3.6 9h3.4v12H3.6V9Zm5.7 0h3.3v1.6h.1c.5-.9 1.6-1.9 3.3-1.9 3.5 0 4.1 2.2 4.1 5.2V21h-3.4v-6.3c0-1.5 0-3.3-2-3.3s-2.2 1.6-2.2 3.2V21H9.3V9Z" />
              </svg>
            </a>
            <a
              href="https://x.com/ByPrestigeOne"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Prestige One on X"
              title="X"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-7.4L5.6 22H2.4l7.9-9L2.6 2H9l4.5 6.8L18.9 2ZM17.9 20h1.7L8 3.9H6.2L17.9 20Z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@byprestigeone"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Prestige One on YouTube"
              title="YouTube"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9.1 2 12 2 12s0 2.9.4 4.8a3 3 0 0 0 2.1 2.1c1.9.5 7.5.5 7.5.5s5.6 0 7.5-.5a3 3 0 0 0 2.1-2.1c.4-1.9.4-4.8.4-4.8s0-2.9-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" />
              </svg>
            </a>
          </div>
          <div className="bsq-footer-legal">
            <PrivacyLink className="bsq-footer-privacy" />
            <a
              className="bsq-footer-top"
              href="#home"
              aria-label="Back to top"
            >
              ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
