import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const timeline = [
  {
    step: "01",
    title: "Create your profile",
    description: "Tell us about your business goals, industry, and what you're looking for in a partner.",
  },
  {
    step: "02",
    title: "Get matched",
    description: "Our AI analyzes thousands of profiles to find your most compatible potential partners.",
  },
  {
    step: "03",
    title: "Connect & collaborate",
    description: "Start conversations, share documents, and negotiate in secure deal rooms.",
  },
  {
    step: "04",
    title: "Close the deal",
    description: "Formalize your partnership with confidence, backed by our verified network.",
  },
];

export default function LandingStory() {
  return (
    <section className="py-28 md:py-36 px-6 md:px-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — About text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">About BuyersAlike</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
              We partner with purpose-driven professionals to bring bold{" "}
              <em className="not-italic" style={{ color: '#B8860B' }}>ideas to life.</em>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              BuyersAlike was founded with a simple vision: make it easier for professionals 
              to find like-minded partners for business ventures. Whether you're looking for 
              acquisitions, joint ventures, or strategic partnerships, we provide the tools 
              and network to make it happen.
            </p>

            <div className="space-y-4">
              {[
                "Verified professional network",
                "AI-powered matching algorithm",
                "Secure deal rooms for negotiations",
                "Dedicated support team",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative pl-16"
                >
                  {/* Step number */}
                  <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}