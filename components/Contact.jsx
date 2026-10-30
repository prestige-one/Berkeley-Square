import { EnquiryButton, LeadForm, LocationControls } from "./Interactions";
export default function Contact() {
  return (
    <section
      className="bsq-contact bsq-section"
      id="contact"
      aria-labelledby="bsq-contact-title"
    >
      <div className="bsq-contact-card">
        <div className="bsq-contact-story">
          <img
            src="/images/BS_DR_10.webp"
            width="1300"
            height="732"
            loading="lazy"
            decoding="async"
            alt="Berkeley Square residences and landscaped surroundings in daylight"
          />
          <div className="bsq-contact-story-top">
            <span className="bsq-contact-eyebrow">
              BERKELEY SQUARE · JUMEIRAH VILLAGE CIRCLE
            </span>
            <h2 id="bsq-contact-title" className="bsq-section-heading">
              Your next chapter.
              <br />
              <span className="bsq-heading-accent">Your new home.</span>
            </h2>
            <p>
              Discover your new home at Berkeley Square by Prestige One.
              Victorian-inspired living in Jumeirah Village Circle.
            </p>
          </div>
          <a className="bsq-contact-call" href="tel:80077378443">
            <span>
              <small>SPEAK TO OUR TEAM</small>
              <strong>800 773 78443</strong>
            </span>
            <span className="bsq-contact-call-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
        <div className="bsq-contact-form">
          <span className="bsq-contact-form-eyebrow">LET’S MAKE IT YOURS</span>
          <h3>Register your interest</h3>
          <p>
            Leave your details. Our team will help you find the right residence.
          </p>
          <LeadForm
            source="footer"
            intent="General enquiry"
            submitLabel="Enquire Now"
          />
        </div>
      </div>
    </section>
  );
}
