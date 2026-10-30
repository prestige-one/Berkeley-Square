import { EnquiryButton, LeadForm, LocationControls } from "./Interactions";
export default function Amenities() {
  return (
    <section className="bsq-amenities-shell" id="amenities">
      <div className="bsq-amenities-inner">
        <div className="bsq-amenities-heading">
          <span className="bsq-intro-eyebrow">
            40+ AMENITIES · ONE EXTRAORDINARY ADDRESS
          </span>
          <h2 className="bsq-section-heading">
            Everything at{" "}
            <span className="bsq-heading-accent">your doorstep.</span>
          </h2>
          <p>
            Thoughtfully curated amenities designed around comfort, wellbeing
            and everyday convenience.
          </p>
        </div>
        <div className="bsq-amenity-grid">
          <article className="bsq-amenity-card">
            <img
              src="/images/Berkeley%20Square-%20Podcast%20Room.webp"
              width="1500"
              height="1000"
              alt="Podcast Room"
              loading="lazy"
              decoding="async"
            />
            <h3>Podcast Room</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Berkeley%20Square%20Outdoor%20Cinema%20Night%20View.webp"
              width="1500"
              height="1000"
              alt="Outdoor Cinema"
              loading="lazy"
              decoding="async"
            />
            <h3>Outdoor Cinema</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Berkeley%20Square-%20Clubhouse%201.webp"
              width="1500"
              height="1000"
              alt="Prestige One Clubhouse"
              loading="lazy"
              decoding="async"
            />
            <h3>Prestige One Clubhouse</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Berkeley%20Square-%20Lobby%201.webp"
              width="1500"
              height="1000"
              alt="Grand Atrium"
              loading="lazy"
              decoding="async"
            />
            <h3>Grand Atrium</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Berkeley%20Square%20Courtyard%20Pool%20Night.webp"
              width="1500"
              height="1000"
              alt="Courtyard Pool"
              loading="lazy"
              decoding="async"
            />
            <h3>Courtyard Pool</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Berkeley%20Square%20Poolside%20Seating%20Night.webp"
              width="1500"
              height="1000"
              alt="Poolside seating"
              loading="lazy"
              decoding="async"
            />
            <h3>Poolside Seating</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Gym%204.webp"
              width="1500"
              height="1000"
              alt="Prestige Fitness Centre"
              loading="lazy"
              decoding="async"
            />
            <h3>Prestige Fitness Centre</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Berkeley%20Square%20Pool%20Retreat%20Night.webp"
              width="1500"
              height="1000"
              alt="Pool Retreat"
              loading="lazy"
              decoding="async"
            />
            <h3>Pool Retreat</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Zen%20Garden.webp"
              width="1500"
              height="1000"
              alt="Zen Garden"
              loading="lazy"
              decoding="async"
            />
            <h3>Zen Garden</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Covered%20Football%20Court.webp"
              width="1500"
              height="1000"
              alt="Covered Football Court"
              loading="lazy"
              decoding="async"
            />
            <h3>Covered Football Court</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Berkeley%20Square%20Padel%20Court%20Night%20View.webp"
              width="1500"
              height="1000"
              alt="Padel Court"
              loading="lazy"
              decoding="async"
            />
            <h3>Padel Court</h3>
          </article>
          <article className="bsq-amenity-card">
            <img
              src="/images/Kids%20play%20area%201.webp"
              width="1500"
              height="1000"
              alt="Khaled’s Playhouse"
              loading="lazy"
              decoding="async"
            />
            <h3>Khaled’s Playhouse</h3>
          </article>
        </div>
        <p className="bsq-additional-amenities">
          Also discover mini golf, floating cabanas, a multi-purpose court,
          kids’ splash area, koi pond, covered lounge, outdoor dining, BBQ
          garden pavilion and semi amphitheatre.
        </p>
        <EnquiryButton
          className="bsq-intro-brochure"
          intent="Amenities enquiry"
        >
          Explore every amenity with our team ↗
        </EnquiryButton>
      </div>
    </section>
  );
}

