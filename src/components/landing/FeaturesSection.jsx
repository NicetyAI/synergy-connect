import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, Shield, Users, MessageSquare, BarChart3, Globe,
  Zap, ArrowRight, Lock, Link2
} from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const features = [
  {
    icon: Search,
    title: "Smart Matching",
    description: "AI-powered algorithm matches you with the most compatible business partners based on your criteria.",
    accent: "#3B82F6",
    hoverIcon: Link2,
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Every member is verified to ensure you're connecting with legitimate professionals and founders.",
    accent: "#22C55E",
    hoverIcon: null,
  },
  {
    icon: Users,
    title: "Professional Network",
    description: "Access an exclusive community of dealmakers, investors, and entrepreneurs worldwide.",
    accent: "#7C3AED",
    hoverIcon: null,
  },
  {
    icon: MessageSquare,
    title: "Secure Messaging",
    description: "End-to-end encrypted communication to discuss deals and opportunities privately.",
    accent: "#EC4899",
    hoverIcon: Lock,
  },
  {
    icon: BarChart3,
    title: "Deal Analytics",
    description: "Track your connections, conversations, and deal progress with detailed insights.",
    accent: "#F59E0B",
    hoverIcon: null,
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with partners across continents and expand your business horizons internationally.",
    accent: "#06B6D4",
    hoverIcon: null,
  },
];

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="relative py-24 md:py-32 px-4" style={{ background: '#EEEDF2' }}>
      {/* Subtle background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'rgba(216, 161, 31, 0.06)' }} />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: 'rgba(59, 130, 246, 0.04)' }} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full mb-6"
          >
            <Shield className="w-4 h-4" style={{ color: '#22C55E' }} />
            <span className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
              Trusted by Fortune 500 Companies
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: '#1a1a2e' }}>
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-[#D8A11F] via-[#F59E0B] to-[#D8A11F] bg-clip-text text-transparent">
              Professional Networking
            </span>
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#4a4a6a' }}>
            Everything you need to find, connect, and close deals with the right partners. 
            Built for serious dealmakers.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35 }}
                className="h-full p-7 lg:p-8 rounded-2xl glass-light glass-light-hover relative overflow-hidden cursor-default"
                style={{
                  boxShadow: hoveredIndex === index 
                    ? `0 20px 50px ${feature.accent}15, 0 0 0 1px ${feature.accent}20` 
                    : undefined,
                }}
              >
                {/* Accent glow on hover */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px]"
                  animate={{
                    opacity: hoveredIndex === index ? 0.15 : 0,
                  }}
                  style={{ background: feature.accent }}
                />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: feature.accent }}
                  >
                    <feature.icon className="w-7 h-7 lg:w-8 lg:h-8" style={{ color: '#fff' }} />
                  </motion.div>
                  
                  <h3 className="text-xl lg:text-2xl font-bold mb-3" style={{ color: '#1a1a2e' }}>
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-base" style={{ color: '#4a4a6a' }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats — animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {[
              { value: "500", prefix: "$", suffix: "M+", label: "Total Deal Volume" },
              { value: "95", suffix: "%", label: "Success Rate" },
              { value: "48", suffix: "hrs", label: "Avg. Match Time" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D8A11F] to-[#F59E0B] bg-clip-text text-transparent">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix} />
                </p>
                <p className="text-sm font-medium mt-1" style={{ color: '#6a6a8a' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}