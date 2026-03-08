import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Building2, Handshake, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ConvergenceAnimation from "./ConvergenceAnimation";
import useMouseParallax from "./useMouseParallax";
import AnimatedCounter from "./AnimatedCounter";
import { base44 } from "@/api/base44Client";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const mouse = useMouseParallax(0.015);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20 pb-10" style={{ background: '#192234' }}>
      {/* Mouse-reactive background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ x: mouse.x * 3, y: mouse.y * 3 }}
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[100px]"
        />
        <motion.div
          style={{ x: mouse.x * -2, y: mouse.y * -2 }}
          className="absolute top-40 right-20 w-[600px] h-[600px] bg-[#3B82F6]/15 rounded-full blur-[120px]"
        />
        <motion.div
          style={{ x: mouse.x * 1.5, y: mouse.y * 1.5 }}
          className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-[#D8A11F]/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content — choreographed entrance */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" style={{ color: '#FACC15' }} />
              <span className="text-sm font-medium" style={{ color: '#E5EDFF' }}>
                The #1 Platform for Business Partnerships
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6" style={{ color: '#E5EDFF' }}>
              Connect with{" "}
              <span className="bg-gradient-to-r from-[#DBA11F] via-[#F59E0B] to-[#DBA11F] bg-clip-text text-transparent">
                Like-Minded
              </span>{" "}
              Business Partners
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={fadeUp} className="text-lg md:text-xl mb-8 max-w-xl leading-relaxed" style={{ color: '#B6C4E0' }}>
              Join the exclusive platform for professionals, founders, and dealmakers. 
              Find verified partners for acquisitions, investments, JVs, and strategic partnerships.
            </motion.p>

            {/* Search / CTA bar */}
            <motion.div variants={fadeUp} className="relative mb-10">
              <div className="glass-elevated p-2 flex flex-col sm:flex-row gap-3 rounded-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10" style={{ color: '#7A8BA6' }} />
                  <Input
                    placeholder="Enter your email to get started..."
                    className="w-full pl-12 pr-4 py-6 border-0 focus-visible:ring-2 focus-visible:ring-[#DBA11F]/50 text-lg glass-input rounded-xl"
                    style={{ color: '#E5EDFF', background: 'rgba(255, 255, 255, 0.05)' }}
                    readOnly
                  />
                </div>
                {!isAuthChecking && (
                  currentUser ? (
                    <Link to={createPageUrl("Partnerships")}>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold text-lg shadow-2xl" style={{ background: '#D8A11F', color: '#fff' }}>
                          Go to Dashboard
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </motion.div>
                    </Link>
                  ) : (
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        onClick={() => base44.auth.redirectToLogin(window.location.origin + '/Onboarding')}
                        className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold text-lg shadow-2xl relative overflow-hidden" 
                        style={{ background: '#D8A11F', color: '#fff' }}
                      >
                        <span className="relative z-10 flex items-center">
                          Get Started Free
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </span>
                      </Button>
                    </motion.div>
                  )
                )}
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="#FACC15" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm font-medium ml-2" style={{ color: '#B6C4E0' }}>4.9/5 from 500+ reviews</span>
                </div>
                <span className="text-sm" style={{ color: '#7A8BA6' }}>•</span>
                <span className="text-sm" style={{ color: '#B6C4E0' }}>No credit card required</span>
              </div>
            </motion.div>

            {/* Stats — animated counters, no pulsing */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 md:gap-6">
              {[
                { icon: Users, value: "10K+", label: "Active Members", num: "10000", suffix: "+" },
                { icon: Building2, value: "5K+", label: "Partners", num: "5000", suffix: "+" },
                { icon: Handshake, value: "2K+", label: "Deals Closed", num: "2000", suffix: "+" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 glass-card glass-card-hover px-4 py-3 md:px-5 md:py-4 rounded-2xl"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#DBA11F] to-[#F59E0B] shadow-lg">
                    <stat.icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: '#fff' }} />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold" style={{ color: '#E5EDFF' }}>
                      <AnimatedCounter value={stat.num} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs md:text-sm font-medium" style={{ color: '#B6C4E0' }}>{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side — Convergence Animation, enters after left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative glass-card p-6 lg:p-8 rounded-3xl" style={{
              background: 'rgba(255, 255, 255, 0.06)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}>
              <ConvergenceAnimation />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}