import { EnquiryButton, LeadForm, LocationControls } from "./Interactions";
export default function Brochure() {
  return (
    <section className="bsq-brochure bsq-section" id="brochure">
      <div className="bsq-brochure-visual">
        <img
          src="/images/Berkeley%20Square%20Courtyard%20Pool%20Night.webp"
          width="1024"
          height="576"
          alt="Berkeley Square at dusk"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="bsq-brochure-form">
        <h2 className="bsq-section-heading">
          <span className="bsq-heading-accent">
            Request the Berkeley Square Brochure
          </span>
        </h2>
        <LeadForm
          source="brochure"
          intent="Brochure request"
          submitLabel="Request Brochure"
        />
      </div>
    </section>
  );
}
