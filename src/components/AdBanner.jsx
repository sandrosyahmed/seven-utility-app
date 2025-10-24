import { useEffect } from "react";
import "./AdBanner.css"; // 👈
export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      console.warn("AdSense not loaded yet.");
    }
  }, []);

  return (
    <div className="ad-container">
      <p className="ad-label">Sponsored</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8958009088689166"   // 🔁 replace with your AdSense ID
        data-ad-slot="8293008310"      // 🔁 replace with your ad slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
