import { PrivacyProvider } from "../components/PrivacyPopup";
import { EnquiryProvider, Header, Gallery } from "../components/Interactions";
import Hero from "../components/Hero";
import Overview from "../components/Overview";
import Amenities from "../components/Amenities";
import Architecture from "../components/Architecture";
import Brochure from "../components/Brochure";
import { galleryImages } from "../lib/gallery-images";
import Location from "../components/Location";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <PrivacyProvider>
      <EnquiryProvider>
        <Header />
        <main id="main">
          <Hero />
          <Overview />
          <Amenities />
          <Architecture />
          <Brochure />
          <Gallery images={galleryImages} />
          <Location />
          <Contact />
        </main>
        <Footer />
        <a
          className="bsq-whatsapp"
          href="https://wa.me/971523412936?text=Hello%2C%20I%27m%20interested%20in%20Berkeley%20Square%20by%20Prestige%20One.%20Please%20share%20more%20information."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Enquire on WhatsApp"
        >
          <img
            src="/assets/whatsapp.svg"
            width="32"
            height="32"
            alt=""
            aria-hidden="true"
          />
        </a>
      </EnquiryProvider>
    </PrivacyProvider>
  );
}
