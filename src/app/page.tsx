import Navbar from "@/components/sections/navbar";
import HeroSection from "@/components/sections/hero-section";
import FeaturesSection from "@/components/sections/features-section";
import TechnologySection from "@/components/sections/technology-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import DashboardPreviewSection from "@/components/sections/dashboard-preview-section";
import CTASection from "@/components/sections/cta-section";
import MapSection from "@/components/sections/map-section";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      {/* 0. Navigation */}
      <Navbar />

      {/* 1. Hero - core value proposition */}
      <HeroSection />

      {/* 2. Features - what users get */}
      <FeaturesSection />

      {/* 3. How It Works - process explanation */}
      <HowItWorksSection />

      {/* 4. Technology - implementation credibility */}
      <TechnologySection />

      {/* 5. Dashboard Preview - product proof */}
      <DashboardPreviewSection />

      {/* 6. MAP - campus location */}
      <MapSection />

      {/* 7. Call to Action - conversion */}
      <CTASection />

      {/* 8. Footer */}
      <Footer />
    </main>
  );
}
