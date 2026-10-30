import { EnquiryButton, LeadForm, LocationControls } from "./Interactions";
export default function Hero() {
  return (
    <section
      className="bsq-cover"
      id="home"
      aria-labelledby="bsq-hero-title"
    >
      <picture className="bsq-cover-visual">
        <img
          src="/images/Berkeley%20Square%20Bird's%20Eye%20Night%20View.webp"
          width="1672"
          height="941"
          alt="Berkeley Square illuminated and its landscaped courtyard at dusk"
          fetchPriority="high"
        />
      </picture>
      <div className="bsq-cover-shade"></div>
      <div className="bsq-cover-content">
        <span className="bsq-cover-eyebrow">
          CLASSIC ENGLISH ELEGANCE. MODERN DUBAI LIVING.
        </span>
        <img
          className="bsq-cover-project-logo"
          src="/assets/source/Berkeley-Square-logo-sswhite-13-3-1.png"
          width="700"
          height="373"
          alt="Berkeley Square by Prestige One"
        />
        <span className="bsq-cover-divider" aria-hidden="true"></span>
        <h1 id="bsq-hero-title">Classic Elegance. Modern Living.</h1>
      </div>
      <div className="bsq-cover-caption">
        <span>STUDIO — 3 BEDROOM RESIDENCES</span>
        <span>JUMEIRAH VILLAGE CIRCLE, DUBAI</span>
      </div>
      <EnquiryButton className="bsq-cover-contact">
        Register Your Interest <span aria-hidden="true">↗</span>
      </EnquiryButton>
    </section>
  );
}
