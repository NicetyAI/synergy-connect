import React from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Award, TrendingUp, Users, Handshake, Trophy } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const values = [
  { icon: Users, title: "Community First", description: "Building genuine relationships that last", accent: "#3B82F6" },
  { icon: Target, title: "Goal Oriented", description: "Focused on achieving real results", accent: "#22C55E" },
  { icon: Handshake, title: "Trust & Integrity", description: "Verified profiles and secure connections", accent: "#F59E0B" },
  { icon: Trophy, title: "Success Driven", description: "Measuring impact through partnerships", accent: "#7C3AED" },
];

const stats = [
  { value: "500", prefix: "$", suffix: "M+", label: "Deal Volume" },
  { value: "95", suffix: "%", label: "Match Rate" },
  { value: "48", suffix: "hrs", label: "Avg. Response" },
];

export default function AboutSection() {
  return (
    <section className="relative py-24 px-4" style={{ background: '#192234' }}>
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white">Award-Winning Platform</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-[#D8A11F] via-[#F59E0B] to-[#D8A11F] bg-clip-text text-transparent">
              BuyersAlike
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to revolutionize how professionals find and connect with business partners. 
            Trusted by Fortune 500 companies and emerging startups alike.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left - Mission card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="h-full"
          >
            <div className="glass-card rounded-3xl p-7 lg:p-10 relative overflow-hidden h-full flex flex-col">
              {/* Subtle gradient background */}
              <div className="absolute inset-0 opacity-[0.06] bg-gradient-to-br from-[#D8A11F] via-transparent to-[#F59E0B]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D8A11F] to-[#F59E0B] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">Our Mission</h3>
                </div>
                <p className="text-white/75 leading-relaxed text-base lg:text-lg mb-6">
                  BuyersAlike was founded with a simple vision: make it easier for professionals 
                  to find like-minded partners for business ventures. Whether you're looking for 
                  acquisitions, joint ventures, or strategic partnerships, we provide the platform 
                  and tools to make meaningful connections that drive real results.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  "Verified professional network",
                  "AI-powered matching algorithm",
                  "Secure deal rooms for negotiations",
                  "Dedicated support team",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#D8A11F] flex-shrink-0" />
                    <span className="text-white/75">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 lg:gap-6 mt-8 pt-8 border-t border-white/10">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#D8A11F] to-[#F59E0B] bg-clip-text text-transparent">
                      <AnimatedCounter value={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs lg:text-sm font-medium text-white/50 mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Core Values Grid */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 h-full">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-center glass-card glass-card-hover h-full"
                >
                  <div
                    className="w-14 h-14 lg:w-16 lg:h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                    style={{ background: `${value.accent}20` }}
                  >
                    <value.icon className="w-7 h-7 lg:w-8 lg:h-8" style={{ color: value.accent }} />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-2 text-white">
                    {value.title}
                  </h3>
                  <p className="text-sm lg:text-base leading-relaxed text-white/60">
                    {value.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}