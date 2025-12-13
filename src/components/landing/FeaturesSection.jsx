import React from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Shield, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Zap,
  Globe,
  Lock
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Matching",
    description: "AI-powered algorithm matches you with the most compatible business partners based on your criteria.",
    gradient: "from-[#3B82F6] to-[#1F3A8A]",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Every member is verified to ensure you're connecting with legitimate professionals and founders.",
    gradient: "from-[#7C3AED] to-[#3B82F6]",
  },
  {
    icon: Users,
    title: "Professional Network",
    description: "Access an exclusive community of dealmakers, investors, and entrepreneurs worldwide.",
    gradient: "from-[#1F3A8A] to-[#0B1F3B]",
  },
  {
    icon: MessageSquare,
    title: "Secure Messaging",
    description: "End-to-end encrypted communication to discuss deals and opportunities privately.",
    gradient: "from-[#3B82F6] to-[#7C3AED]",
  },
  {
    icon: BarChart3,
    title: "Deal Analytics",
    description: "Track your connections, conversations, and deal progress with detailed insights.",
    gradient: "from-[#FACC15] to-[#22C55E]",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with partners across continents and expand your business horizons internationally.",
    gradient: "from-[#7C3AED] to-[#1F3A8A]",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1F3A8A]/10 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#E5EDFF' }}>
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] bg-clip-text text-transparent">
              Professional Networking
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#B6C4E0' }}>
            Everything you need to find, connect, and close deals with the right partners
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="h-full glass-card glass-card-hover p-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" style={{ color: '#E5EDFF' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#E5EDFF' }}>{feature.title}</h3>
                <p className="leading-relaxed" style={{ color: '#B6C4E0' }}>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}