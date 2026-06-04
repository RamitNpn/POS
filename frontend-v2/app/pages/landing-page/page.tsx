import Navbar from "@/components/landing/Navbar";
import Testimonials from "@/components/landing/Testimonials";
import LocationSection from "@/components/landing/LocationSection";
import Footer from "@/components/landing/Footer";
import HeroRestaurant from "@/components/landing/Hero";
import AboutRestaurant from "@/components/landing/About";
import CTAReservation from "@/components/landing/CTA";
import MenuPreview from "@/components/landing/MenuPreview";
import AnalyticsSection from "@/components/landing/Analytic";
import DashboardPreview from "@/components/landing/DashboardPreview";

export default function LandingPage() {
  return (
    <main className="bg-[#121212] text-white">
      <Navbar />
      <HeroRestaurant />
      <AboutRestaurant />
      <MenuPreview />
      <AnalyticsSection />
      <DashboardPreview />
      <Testimonials />
      <LocationSection />
      <CTAReservation />
      <Footer />
    </main>
  );
}