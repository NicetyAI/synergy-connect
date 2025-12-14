// SEO metadata for different pages
export const pageMetadata = {
  Home: {
    title: "Business Networking & Partnership Platform",
    description: "Connect with like-minded business partners on BuyersAlike. Find opportunities for acquisitions, investments, joint ventures, and strategic partnerships with verified professionals.",
    keywords: ["business networking", "find business partners", "investment opportunities", "mergers and acquisitions", "strategic partnerships", "entrepreneur network"],
  },
  Partnerships: {
    title: "Find Business Partnerships",
    description: "Discover and connect with potential business partners. Explore strategic partnerships, joint ventures, and collaboration opportunities with verified professionals.",
    keywords: ["business partnerships", "strategic alliances", "joint ventures", "collaboration opportunities", "partner search"],
  },
  Opportunities: {
    title: "Investment & Business Opportunities",
    description: "Browse verified investment opportunities, franchises, acquisitions, and business ventures. Connect with entrepreneurs and investors to grow your portfolio.",
    keywords: ["investment opportunities", "business opportunities", "franchise opportunities", "acquisition targets", "business ventures"],
  },
  Vendors: {
    title: "Verified Business Vendors & Services",
    description: "Find trusted business vendors and service providers. Connect with verified companies offering professional services across various industries.",
    keywords: ["business vendors", "business services", "b2b services", "professional services", "vendor directory"],
  },
  Events: {
    title: "Business Networking Events",
    description: "Attend exclusive business networking events, conferences, and meetups. Connect with industry leaders and grow your professional network.",
    keywords: ["networking events", "business conferences", "professional meetups", "industry events", "business workshops"],
  },
  Forum: {
    title: "Business Discussion Forum",
    description: "Join discussions with business professionals. Share insights, ask questions, and learn from experienced entrepreneurs and investors.",
    keywords: ["business forum", "entrepreneur community", "business discussions", "professional network", "business advice"],
  },
  News: {
    title: "Business News & Insights",
    description: "Stay updated with the latest business news, market trends, and industry insights curated for entrepreneurs and investors.",
    keywords: ["business news", "market trends", "industry insights", "business updates", "financial news"],
  },
  ActivityFeed: {
    title: "Activity Feed - Latest Updates",
    description: "Stay connected with your network. View the latest activities, connections, and opportunities from your business community.",
    keywords: ["activity feed", "network updates", "business community", "latest activities"],
  },
  Profile: {
    title: "Your Profile",
    description: "Manage your professional profile. Showcase your expertise, interests, and business opportunities to connect with like-minded professionals.",
    keywords: ["professional profile", "business profile", "networking profile", "entrepreneur profile"],
  },
  Recommendations: {
    title: "Personalized Recommendations",
    description: "Get AI-powered recommendations for business partners, opportunities, and connections tailored to your interests and goals.",
    keywords: ["business recommendations", "ai matching", "personalized connections", "smart networking"],
  },
};

// Generate structured data for rich snippets
export const generateStructuredData = (type, data) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const structuredData = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "Organization":
      return {
        ...structuredData,
        "@type": "Organization",
        name: "BuyersAlike",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: "Business networking and partnership platform",
        sameAs: [],
      };
    
    case "Event":
      return {
        ...structuredData,
        "@type": "Event",
        name: data.title,
        description: data.description,
        startDate: data.date,
        location: data.is_virtual 
          ? { "@type": "VirtualLocation", url: data.virtual_link }
          : { "@type": "Place", name: data.location },
        organizer: {
          "@type": "Person",
          name: data.organizer_name,
          email: data.organizer_email,
        },
      };
    
    case "Article":
      return {
        ...structuredData,
        "@type": "Article",
        headline: data.title,
        description: data.description,
        author: {
          "@type": "Person",
          name: data.author_name,
        },
        datePublished: data.created_date,
      };
    
    default:
      return structuredData;
  }
};