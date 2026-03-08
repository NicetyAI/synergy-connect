import React from "react";
import { motion } from "framer-motion";
import { Search, Shield, MessageSquare, BarChart3, Globe, Users } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Matching",
    description: "Our AI-powered algorithm analyzes your goals, industry, and preferences to connect you with the most compatible business partners.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Every member goes through a rigorous verification process. Connect with confidence knowing you're dealing with legitimate professionals.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  },
  {
    icon: MessageSquare,
    title: "Secure Deal Rooms",
    description: "Negotiate and collaborate in encrypted, private spaces designed specifically for sensitive business discussions and document sharing.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
  },
];

const smallFeatures = [
  { icon: BarChart3, title: "Deal Analytics", desc: "Track connections, conversations, and deal progress with detailed insights." },
  { icon: Globe, title: "Global Reach", desc: "Connect with partners across continents and expand internationally." },
  { icon: Users, title: "Community", desc: "Access an exclusive network of dealmakers, investors, and entrepreneurs." },
];

export default function LandingFeatures() {
  return (
    <section className="py-28 md:py-36 px-6 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-20"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">How it works</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Everything you need to find the <em className="not-italic" style={{ color: '#B8860B' }}>right partner.</em>
          </h2>
        </motion.div>

        {/* Alternating feature blocks */}
        <div className="space-y-24 md:space-y-32">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-16 items-center`}
            >
              {/* Text */}
              <div className="flex-1 max-w-lg">
                <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-lg text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-lg shadow-gray-200/50 transition-shadow duration-500 hover:shadow-xl hover:shadow-gray-300/40">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Small features grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-28 pt-20 border-t border-gray-100">
          {smallFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm hover:shadow-md hover:bg-white/70 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm border border-white/90 shadow-sm flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-gray-900" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h4>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}