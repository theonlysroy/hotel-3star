import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-hotelBg bg-cover bg-center">
      <div className="bg-[rgba(0,0,0,0.7)] bg-blend-overlay w-full min-h-screen">
        {/* hero section */}
        <HeroSection />
        <Footer />
      </div>
    </div>
  );
}
