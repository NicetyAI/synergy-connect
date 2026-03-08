import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function LandingCTA() {
  return (
    <section className="py-28 md:py-36 px-6 md:px-10 bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Ready to find your next{" "}
            <em className="not-italic text-amber-400">partnership?</em>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join 10,000+ professionals who are already connecting, collaborating, 
            and closing deals on BuyersAlike.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => base44.auth.redirectToLogin(window.location.origin + '/Onboarding')}
              className="rounded-full px-10 h-14 text-base font-semibold bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <a href="#contact" className="text-base font-medium text-gray-400 hover:text-white transition-colors">
              Contact Sales →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}