import React from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LogoStrip from "@/components/landing/LogoStrip";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingStory from "@/components/landing/LandingStory";
import LandingVendors from "@/components/landing/LandingVendors";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingContact from "@/components/landing/LandingContact";
import LandingFooter from "@/components/landing/LandingFooter";
import SEO from "@/components/seo/SEO";
import { pageMetadata } from "@/components/seo/seoMetadata";

export default function Home() {
  const metadata = pageMetadata.Home;

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        canonicalUrl={typeof window !== 'undefined' ? window.location.origin : ''}
      />
      <LandingNavbar />
      <main>
        <LandingHero />
        <LogoStrip />
        <div id="features"><LandingFeatures /></div>
        <div id="about"><LandingStory /></div>
        <LandingVendors />
        <div id="pricing"><LandingPricing /></div>
        <LandingCTA />
        <div id="contact"><LandingContact /></div>
      </main>
      <LandingFooter />
    </div>
  );
}