import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For exploring the platform",
    features: ["5 connections/month", "Basic profile", "Community access", "Email support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/mo",
    description: "For active dealmakers",
    features: ["Unlimited connections", "Verified badge", "Advanced search", "Deal room access", "Priority support", "Analytics"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/mo",
    description: "For teams & organizations",
    features: ["Everything in Pro", "Team collaboration", "Custom branding", "API access", "Dedicated manager", "White-glove onboarding"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function LandingPricing() {
  return (
    <section className="py-28 md:py-36 px-6 md:px-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent <em className="not-italic" style={{ color: '#B8860B' }}>pricing.</em>
          </h2>
          <p className="text-lg text-gray-500">14-day free trial. No credit card required.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-3xl p-8 lg:p-10 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gray-900 text-white ring-2 ring-gray-900 shadow-2xl shadow-gray-900/10 md:-mt-4 md:mb-4 hover:shadow-3xl hover:shadow-gray-900/20'
                  : 'bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm hover:shadow-lg hover:bg-white/80 hover:-translate-y-1'
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white mb-4">
                  Most Popular
                </span>
              )}
              <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                {plan.period && <span className={`text-lg ${plan.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>{plan.period}</span>}
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-green-400' : 'text-green-500'}`} />
                    <span className={`text-sm ${plan.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>{f}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full rounded-full h-12 font-semibold ${
                  plan.highlighted
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}