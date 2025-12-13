import React, { useState } from "react";
import Sidebar from "@/components/partnerships/Sidebar";
import FilterBar from "@/components/partnerships/FilterBar";
import PartnershipCard from "@/components/partnerships/PartnershipCard";

// Sample data
const partnershipsData = [
  {
    id: 1,
    title: "SaaS Company Seeking Growth Partner",
    description: "Established B2B SaaS platform with 500+ enterprise clients looking for strategic investment partner to scale operations globally.",
    matchScore: 95,
    location: "San Francisco, CA",
    industry: "SaaS",
    dealSize: "$2M - $5M",
    companySize: "50-100",
    postedDate: "2 days ago",
  },
  {
    id: 2,
    title: "E-commerce Brand Acquisition Opportunity",
    description: "Profitable DTC e-commerce brand in health & wellness space. $3M annual revenue with strong margins and loyal customer base.",
    matchScore: 92,
    location: "Austin, TX",
    industry: "E-commerce",
    dealSize: "$1M - $3M",
    companySize: "10-25",
    postedDate: "3 days ago",
  },
  {
    id: 3,
    title: "Tech Startup Joint Venture",
    description: "AI-powered analytics platform seeking JV partner for expansion into European markets. Proven product-market fit.",
    matchScore: 88,
    location: "New York, NY",
    industry: "AI/Tech",
    dealSize: "$500K - $1M",
    companySize: "25-50",
    postedDate: "5 days ago",
  },
  {
    id: 4,
    title: "Manufacturing Business Merger",
    description: "Family-owned manufacturing business with 30-year history. Looking to merge with complementary company for market expansion.",
    matchScore: 85,
    location: "Chicago, IL",
    industry: "Manufacturing",
    dealSize: "$5M - $10M",
    companySize: "100-250",
    postedDate: "1 week ago",
  },
  {
    id: 5,
    title: "FinTech Strategic Partnership",
    description: "Digital payment platform with 100K+ users seeking strategic partner for product development and market expansion.",
    matchScore: 90,
    location: "Boston, MA",
    industry: "FinTech",
    dealSize: "$3M - $7M",
    companySize: "50-100",
    postedDate: "4 days ago",
  },
  {
    id: 6,
    title: "Real Estate Investment Opportunity",
    description: "Commercial real estate portfolio with stable cash flow. Seeking investment partner for portfolio expansion.",
    matchScore: 87,
    location: "Miami, FL",
    industry: "Real Estate",
    dealSize: "$10M+",
    companySize: "25-50",
    postedDate: "6 days ago",
  },
  {
    id: 7,
    title: "Healthcare Tech Acquisition",
    description: "Telemedicine platform with regulatory approvals. Strong growth trajectory and established provider network.",
    matchScore: 93,
    location: "Seattle, WA",
    industry: "HealthTech",
    dealSize: "$2M - $4M",
    companySize: "25-50",
    postedDate: "3 days ago",
  },
  {
    id: 8,
    title: "Marketing Agency Partnership",
    description: "Full-service digital marketing agency with Fortune 500 clients. Looking for merger to expand service offerings.",
    matchScore: 84,
    location: "Los Angeles, CA",
    industry: "Marketing",
    dealSize: "$1M - $2M",
    companySize: "50-75",
    postedDate: "1 week ago",
  },
  {
    id: 9,
    title: "Clean Energy Joint Venture",
    description: "Solar energy solutions provider seeking JV partner for residential market expansion. Proven technology and installations.",
    matchScore: 89,
    location: "Denver, CO",
    industry: "Clean Energy",
    dealSize: "$3M - $5M",
    companySize: "50-100",
    postedDate: "5 days ago",
  },
  {
    id: 10,
    title: "EdTech Platform Investment",
    description: "Online learning platform with 50K+ active students. Looking for investment to scale content and technology.",
    matchScore: 91,
    location: "San Diego, CA",
    industry: "EdTech",
    dealSize: "$1M - $3M",
    companySize: "25-50",
    postedDate: "4 days ago",
  },
  {
    id: 11,
    title: "Food & Beverage Brand Acquisition",
    description: "Organic beverage brand with national distribution. Strong brand recognition and growth potential.",
    matchScore: 86,
    location: "Portland, OR",
    industry: "F&B",
    dealSize: "$2M - $4M",
    companySize: "10-25",
    postedDate: "1 week ago",
  },
  {
    id: 12,
    title: "Logistics Company Partnership",
    description: "Last-mile delivery service with proprietary technology. Seeking strategic partner for geographic expansion.",
    matchScore: 88,
    location: "Dallas, TX",
    industry: "Logistics",
    dealSize: "$3M - $6M",
    companySize: "100-250",
    postedDate: "6 days ago",
  },
];

export default function Partnerships() {
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)' }}>
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0A1628] via-[#1F3A8A]/20 to-[#1E3A5F] -z-10" />
      <div 
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-[#7C3AED]/10 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#E5EDFF' }}>
              Partnership Opportunities
            </h1>
            <p style={{ color: '#B6C4E0' }}>
              Discover and connect with verified business partners for your next venture
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            totalResults={partnershipsData.length}
          />

          {/* Partnerships Grid */}
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-6"}>
            {partnershipsData.map((partnership, index) => (
              <PartnershipCard 
                key={partnership.id} 
                partnership={partnership} 
                index={index}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}