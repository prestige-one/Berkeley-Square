import { EnquiryButton, LeadForm, LocationControls } from "./Interactions";
export default function Architecture() {
  return (
    <section className="bsq-luxury bsq-section" id="interiors">
      <h2 className="bsq-section-heading">
        A Glimpse of Structure.
        <br />
        <span className="bsq-heading-accent">Interiors that Reflect You.</span>
      </h2>
      <div className="bsq-luxury-grid">
        <div className="bsq-luxury-column">
          <article className="bsq-feature-card">
            <span className="bsq-feature-icon">✧</span>
            <h3>Architecture with legacy</h3>
            <p>
              Berkeley Square takes its cues from London’s stately apartments—an
              architectural language of poise and proportion. The U-shaped
              structure embraces a central courtyard, allowing space to breathe.
            </p>
          </article>
          <article className="bsq-feature-card">
            <h3>Quiet confidence</h3>
            <p>
              Vertical lines lend rhythm, while pale-toned façades and accents
              of dark metal create a quiet confidence.
            </p>
          </article>
        </div>
        <img
          src="/images/BS_DR_07.webp"
          width="1500"
          height="1000"
          alt="Victorian-inspired Berkeley Square courtyard architecture"
          loading="lazy"
          decoding="async"
        />
        <div className="bsq-luxury-column">
          <article className="bsq-feature-card">
            <span className="bsq-feature-icon">◇</span>
            <h3>Tailored to your life</h3>
            <p>
              Studio, 1, 2 & 3-bedroom apartments, with tailored finishes and
              elegant palettes, crafted for ultimate luxury and comfort.
            </p>
          </article>
          <article className="bsq-feature-card">
            <h3>Considered details</h3>
            <p>
              Thoughtful layouts. Open-plan kitchens. Floor-to-ceiling windows.
              Private balconies. High ceilings. Walk-in wardrobe units.
            </p>
            <EnquiryButton
              className="bsq-intro-brochure"
              intent="Factsheet request"
            >
              Request Factsheet ↓
            </EnquiryButton>
          </article>
        </div>
      </div>
    </section>
  );
}
