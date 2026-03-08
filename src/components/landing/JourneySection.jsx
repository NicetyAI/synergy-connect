import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Users, Handshake, ArrowRight, Sparkles } from "lucide-react";
import useScrollProgress from "./useScrollProgress";

const steps = [
  {
    icon: Search,
    title: "Find Opportunities",
    description: "Search through verified profiles and discover partners that match your business goals and criteria.",
    accent: "#7C3AED",
  },
  {
    icon: Users,
    title: "Connect",
    description: "Reach out and start conversations with potential partners through our secure messaging system.",
    accent: "#3B82F6",
  },
  {
    icon: Handshake,
    title: "Close Deals",
    description: "Negotiate, collaborate, and finalize partnerships with confidence using our deal room features.",
    accent: "#22C55E",
  },
];

export default function JourneySection() {
  const { ref, progress } = useScrollProgress();

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-4" style={{ background: '#EEEDF2' }}>
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
            Your Partnership{" "}
            <span className="bg-gradient-to-r from-[#D8A11F] to-[#F59E0B] bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#4a4a6a' }}>
            Three simple steps to finding your ideal business partner
          </p>
        </motion.div>

        {/* Steps with scroll-driven connector */}
        <div className="relative">
          {/* Connector line that draws with scroll */}
          <div className="hidden md:block absolute top-20 left-[16.66%] right-[16.66%] h-[2px]" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #7C3AED, #3B82F6, #22C55E)',
                width: `${Math.min(100, Math.max(0, (progress - 0.2) * 200))}%`,
                transition: 'width 0.1s ease-out',
              }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, index) => {
              const stepProgress = Math.max(0, Math.min(1, (progress - 0.15 - index * 0.15) * 5));
              
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="relative glass-light glass-light-hover rounded-2xl p-7 text-center h-full"
                  >
                    {/* Step number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                        style={{ backgroundColor: step.accent }}
                      >
                        {index + 1}
                      </div>
                    </div>
                    
                    <div 
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-4 shadow-lg"
                      style={{ backgroundColor: step.accent }}
                    >
                      <step.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#1a1a2e' }}>{step.title}</h3>
                    <p className="text-base leading-relaxed" style={{ color: '#4a4a6a' }}>{step.description}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16"
        >
          <div className="glass-light-elevated rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Subtle gradient accent */}
            <div className="absolute inset-0 opacity-[0.04] bg-gradient-to-br from-[#7C3AED] via-[#3B82F6] to-[#22C55E]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-[#D8A11F] to-[#F59E0B] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold" style={{ color: '#1a1a2e' }}>Start Networking Today</h3>
                  <p style={{ color: '#4a4a6a' }}>Join thousands of professionals making deals happen</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button className="px-8 py-6 rounded-xl font-bold text-base shadow-lg text-white" style={{ background: '#D8A11F' }}>
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}