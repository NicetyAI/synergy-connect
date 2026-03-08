import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for exploring the platform",
    icon: Zap,
    accent: "#6B7280",
    features: [
      "5 connections per month",
      "Basic profile",
      "Community access",
      "Email support",
    ],
    buttonText: "Get Started",
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For active dealmakers",
    icon: Sparkles,
    accent: "#7C3AED",
    popular: true,
    features: [
      "Unlimited connections",
      "Verified badge",
      "Advanced search filters",
      "Deal room access",
      "Priority support",
      "Analytics dashboard",
    ],
    buttonText: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For teams and organizations",
    icon: Crown,
    accent: "#F59E0B",
    features: [
      "Everything in Professional",
      "Team collaboration",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "White-glove onboarding",
    ],
    buttonText: "Contact Sales",
  },
];

export default function PricingSection() {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <section className="relative py-24 md:py-32 px-4" style={{ background: '#EEEDF2' }}>
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: 'rgba(124, 58, 237, 0.04)' }} />
      </div>

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
            className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full mb-6"
          >
            <Check className="w-4 h-4" style={{ color: '#22C55E' }} />
            <span className="text-sm font-medium" style={{ color: '#1a1a2e' }}>14-day free trial • No credit card required</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: '#1a1a2e' }}>
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-[#D8A11F] via-[#F59E0B] to-[#D8A11F] bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#4a4a6a' }}>
            Choose the plan that fits your networking needs. Cancel anytime, no questions asked.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-5 py-2 rounded-full text-white text-sm font-bold shadow-xl" style={{ background: plan.accent }}>
                    ⭐ Most Popular
                  </div>
                </div>
              )}
              
              <motion.div 
                whileHover={{ y: -8 }}
                transition={{ duration: 0.35 }}
                className={`h-full rounded-2xl lg:rounded-3xl p-7 lg:p-10 relative overflow-hidden ${
                  plan.popular ? 'glass-light-elevated' : 'glass-light glass-light-hover'
                }`}
                style={{
                  boxShadow: plan.popular 
                    ? `0 20px 60px ${plan.accent}18, 0 0 0 2px ${plan.accent}30` 
                    : undefined,
                }}
              >
                {/* Accent glow for popular */}
                {plan.popular && (
                  <div 
                    className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-10"
                    style={{ background: plan.accent }}
                  />
                )}
                
                <div className="relative z-10">
                  <div
                    className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                    style={{ backgroundColor: plan.accent }}
                  >
                    <plan.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                
                  <h3 className="text-xl lg:text-2xl font-bold mb-2" style={{ color: '#1a1a2e' }}>{plan.name}</h3>
                  <p className="text-sm mb-6 font-medium" style={{ color: '#4a4a6a' }}>{plan.description}</p>
                  
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-4xl lg:text-5xl font-bold" style={{ color: '#1a1a2e' }}>
                      {plan.price}
                    </span>
                    {plan.period && <span className="text-lg font-medium" style={{ color: '#6a6a8a' }}>{plan.period}</span>}
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="flex items-center gap-3"
                      >
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: plan.accent }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm lg:text-base font-medium" style={{ color: '#3a3a5a' }}>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full py-6 rounded-xl font-bold text-base shadow-lg text-white"
                      style={{ background: '#D8A11F' }}
                    >
                      {plan.buttonText}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}