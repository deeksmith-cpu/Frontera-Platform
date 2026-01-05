import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Pricing from "@/components/Pricing";
import Testimonial from "@/components/Testimonial";
import FAQ from "@/components/FAQ";
import TrustBadges from "@/components/TrustBadges";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

// This is the original landing page preserved for comparison
// The live landing page now uses Landing V2 design
export default function OriginalLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Pricing />
      <Testimonial />
      <FAQ />
      <TrustBadges />
      <CTA />
      <Footer />
    </main>
  );
}
