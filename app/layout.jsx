import "./country-flags.css";
import "./styles.css";
import "./intro.css";
import "./gallery.css";
import "./modals.css";
import "./location.css";
import "./berkeley.css";
export const metadata = {
  title: "Berkeley Square by Prestige One",
  description:
    "Victorian-inspired residences in Jumeirah Village Circle. Discover Berkeley Square’s architecture, amenities, interiors and location.",
  icons: { icon: "/assets/favicon.png" },
};
export const viewport = { themeColor: "#1b3b39" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
