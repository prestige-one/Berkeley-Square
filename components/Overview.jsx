import AnimatedFacts from "./AnimatedFacts";
import { EnquiryButton, LeadForm, LocationControls } from "./Interactions";
export default function Overview() {
  return (
    <section className="bsq-about bsq-section" id="about">
      <div className="bsq-intro-content">
        <span className="bsq-intro-eyebrow">
          BERKELEY SQUARE · BY PRESTIGE ONE
        </span>
        <h2 className="bsq-section-heading">
          Made for <span className="bsq-heading-accent">Everyday Life.</span>
        </h2>
        <p className="bsq-introduction">
          Berkeley Square draws its name from one of London’s most distinguished
          neighbourhoods, where Georgian townhouses line the streets and grace
          lingers in every corner. Inspired by the refinement of the Victorian
          era, the project honours an age when detail was cherished, symmetry
          revered, and permanence considered the truest luxury.
        </p>
        <p className="bsq-intro-detail">
          Located in Jumeirah Village Circle, Berkeley Square offers 241
          thoughtfully planned residences, comprising studios, one, two and
          three-bedroom apartments. A carved façade, balanced proportions and
          landscaped courtyards combine timeless architectural character with
          contemporary functionality.
        </p>
        <ul className="bsq-highlights">
          <li>
            ✓ <span>Victorian-Inspired Architecture</span>
          </li>
          <li>
            ✓ <span>Wellness & Fitness Facilities</span>
          </li>
          <li>
            ✓ <span>Landscaped Courtyards</span>
          </li>
          <li>
            ✓ <span>Family-Friendly Amenities</span>
          </li>
          <li>
            ✓ <span>Smart & Modern Living</span>
          </li>
          <li>
            ✓ <span>Indoor & Outdoor Recreation</span>
          </li>
        </ul>
        <EnquiryButton className="bsq-intro-brochure" intent="Brochure request">
          Request Brochure <span>↓</span>
        </EnquiryButton>
      </div>
      <AnimatedFacts>
        <div>
          <strong>241</strong>
          <span>Thoughtfully Planned Homes</span>
        </div>
        <div>
          <strong>40+</strong>
          <span>Lifestyle Amenities</span>
        </div>
        <div>
          <strong>2028</strong>
          <span>March Handover</span>
        </div>
        <EnquiryButton className="bsq-button">Enquire Now →</EnquiryButton>
      </AnimatedFacts>
      <div className="bsq-project-facts">
        <div>
          <small>LOCATION</small>
          <span>Jumeirah Village Circle</span>
        </div>
        <div>
          <small>PROJECT TYPE</small>
          <span>Residential Apartments</span>
        </div>
        <div>
          <small>LAUNCH YEAR</small>
          <span>2025</span>
        </div>
        <div>
          <small>CONFIGURATION</small>
          <span>2B + G + 5 + R</span>
        </div>
        <div>
          <small>UNIT TYPES</small>
          <span>Studio, 1, 2 & 3 Bedrooms</span>
        </div>
      </div>
    </section>
  );
}
