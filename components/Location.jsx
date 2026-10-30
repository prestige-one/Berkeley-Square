import { EnquiryButton, LeadForm, LocationControls } from "./Interactions";
export default function Location() {
  return (
    <section
      className="bsq-location bsq-section"
      id="location"
      aria-labelledby="bsq-location-title"
    >
      <div className="bsq-map-section">
        <div>
          <span className="bsq-intro-eyebrow">
            JVC · WELL-LOCATED. WELL-LIVED.
          </span>
          <h3>
            A neighbourhood
            <br />
            that connects you.
          </h3>
          <p>
            Prime connectivity, landscaped surroundings and everyday essentials,
            all within easy reach.
          </p>
          <EnquiryButton
            className="bsq-intro-brochure"
            intent="Location enquiry"
          >
            Discover your new address ↗
          </EnquiryButton>
        </div>
        <a
          href="https://maps.app.goo.gl/vxUACisPzd5CYM8Q8"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Berkeley Square location in Google Maps (opens in a new tab)"
        >
          <img
            src="/assets/source/Map-01-01-1-2048x1469.webp"
            width="2048"
            height="1469"
            alt="Berkeley Square location map in Jumeirah Village Circle"
            loading="lazy"
          />
        </a>
      </div>
      <div className="bsq-location-heading">
        <div>
          <span className="bsq-location-eyebrow">
            CONNECTED TO EVERYTHING THAT MATTERS
          </span>
          <h2 id="bsq-location-title" className="bsq-section-heading">
            Perfectly placed in
            <br />
            <span className="bsq-heading-accent">Jumeirah Village Circle.</span>
          </h2>
        </div>
        <p>
          Located in Jumeirah Village Circle, close to schools, hospitals and
          daily essentials.
        </p>
      </div>
      <div
        className="bsq-location-slider"
        role="region"
        aria-roledescription="carousel"
        aria-label="Nearby destinations"
      >
        <div className="bsq-location-stage">
          <div
            className="bsq-location-cards"
            id="bsq-location-track"
            tabIndex="0"
            aria-label="Scroll to explore six nearby destinations"
          >
            <a
              className="bsq-destination"
              href="https://www.google.com/maps/search/?api=1&amp;query=Mall%20of%20the%20Emirates%20Dubai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/locations/mall-of-emirates.webp"
                alt="Mall of the Emirates"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
              />
              <span className="bsq-destination-number">01</span>
              <div className="bsq-destination-caption">
                <span className="bsq-destination-time">
                  15<small>MIN DRIVE</small>
                </span>
                <h3>Mall of the Emirates</h3>
                <span className="bsq-destination-map">
                  Explore destination ↗
                </span>
              </div>
            </a>
            <a
              className="bsq-destination"
              href="https://www.google.com/maps/search/?api=1&amp;query=Palm%20Jumeirah%20Dubai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/locations/palm_jumeirah.webp"
                alt="Palm Jumeirah"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
              />
              <span className="bsq-destination-number">02</span>
              <div className="bsq-destination-caption">
                <span className="bsq-destination-time">
                  16<small>MIN DRIVE</small>
                </span>
                <h3>Palm Jumeirah</h3>
                <span className="bsq-destination-map">
                  Explore destination ↗
                </span>
              </div>
            </a>
            <a
              className="bsq-destination"
              href="https://www.google.com/maps/search/?api=1&amp;query=Dubai%20Marina%20Dubai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/locations/dubai_marina.webp"
                alt="Dubai Marina"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
              />
              <span className="bsq-destination-number">03</span>
              <div className="bsq-destination-caption">
                <span className="bsq-destination-time">
                  18<small>MIN DRIVE</small>
                </span>
                <h3>Dubai Marina</h3>
                <span className="bsq-destination-map">
                  Explore destination ↗
                </span>
              </div>
            </a>
            <a
              className="bsq-destination"
              href="https://www.google.com/maps/search/?api=1&amp;query=Downtown%20Dubai%20Dubai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/locations/downtown_dubai.webp"
                alt="Downtown Dubai"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
              />
              <span className="bsq-destination-number">04</span>
              <div className="bsq-destination-caption">
                <span className="bsq-destination-time">
                  18<small>MIN DRIVE</small>
                </span>
                <h3>Downtown Dubai</h3>
                <span className="bsq-destination-map">
                  Explore destination ↗
                </span>
              </div>
            </a>
            <a
              className="bsq-destination"
              href="https://www.google.com/maps/search/?api=1&amp;query=Burj%20Khalifa%20and%20Dubai%20Mall%20Dubai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/locations/burj-klf.webp"
                alt="Burj Khalifa and Dubai Mall"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
              />
              <span className="bsq-destination-number">05</span>
              <div className="bsq-destination-caption">
                <span className="bsq-destination-time">
                  25<small>MIN DRIVE</small>
                </span>
                <h3>Burj Khalifa and Dubai Mall</h3>
                <span className="bsq-destination-map">
                  Explore destination ↗
                </span>
              </div>
            </a>
            <a
              className="bsq-destination"
              href="https://www.google.com/maps/search/?api=1&amp;query=Dubai%20International%20Airport%20Dubai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/locations/dxb.webp"
                alt="Dubai International Airport"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
              />
              <span className="bsq-destination-number">06</span>
              <div className="bsq-destination-caption">
                <span className="bsq-destination-time">
                  30<small>MIN DRIVE</small>
                </span>
                <h3>Dubai International Airport</h3>
                <span className="bsq-destination-map">
                  Explore destination ↗
                </span>
              </div>
            </a>
          </div>
          <LocationControls />
        </div>
        <div className="bsq-location-controls">
          <p className="bsq-location-note">
            Approximate driving times published by Prestige One. Actual journeys
            vary with route and traffic.
          </p>
        </div>
      </div>
    </section>
  );
}

