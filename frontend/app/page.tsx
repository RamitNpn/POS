import AboutRestaurant from "@/components/landing-page/about";
import CTASection from "@/components/landing-page/cta";
import FeatureSection from "@/components/landing-page/features";
import Footer from "@/components/landing-page/footer";
import HeroSection from "@/components/landing-page/hero";
import LocationSection from "@/components/landing-page/location";
import MenuPreview from "@/components/landing-page/menu-preview";
import Navbar from "@/components/landing-page/navbar";
import RoleShowcase from "@/components/landing-page/role-showcase";
import StatsSection from "@/components/landing-page/stats";
import Testimonials from "@/components/landing-page/testimonial";

export default function LandingPage() {
  return (
    <main className="bg-[#121212] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <MenuPreview />
      <AboutRestaurant />
      <RoleShowcase />
      <FeatureSection />
      <StatsSection />
      <Testimonials />
      <LocationSection />
      <CTASection />
      <Footer />
    </main>
  );
}
