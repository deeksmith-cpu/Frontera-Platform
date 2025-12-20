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

export default function Home() {
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
