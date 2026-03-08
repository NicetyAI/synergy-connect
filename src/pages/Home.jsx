import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import VendorAdsSection from "@/components/landing/VendorAdsSection";
import AboutSection from "@/components/landing/AboutSection";
import JourneySection from "@/components/landing/JourneySection";
import PricingSection from "@/components/landing/PricingSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import SectionDivider from "@/components/landing/SectionDivider";
import SEO from "@/components/seo/SEO";
import { pageMetadata } from "@/components/seo/seoMetadata";

export default function Home() {
  const metadata = pageMetadata.Home;
  
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0A1628' }}>
      <SEO 
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        canonicalUrl={typeof window !== 'undefined' ? window.location.origin : ''}
      />

      <Navbar />
      
      <main>
        <HeroSection />
        <SectionDivider from="#192234" to="#EEEDF2" />
        <div id="features">
          <FeaturesSection />
        </div>
        <VendorAdsSection />
        <SectionDivider from="#EEEDF2" to="#192234" />
        <div id="about">
          <AboutSection />
        </div>
        <SectionDivider from="#192234" to="#EEEDF2" />
        <JourneySection />
        <div id="pricing">
          <PricingSection />
        </div>
        <SectionDivider from="#EEEDF2" to="#192234" />
        <div id="contact">
          <ContactSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}