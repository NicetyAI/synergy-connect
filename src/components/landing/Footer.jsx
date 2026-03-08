import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "API"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "Help Center", "Community", "Contact"],
  Legal: ["Privacy", "Terms", "Cookie Policy", "Licenses"],
};

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-8 px-4" style={{ background: '#192234', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-5">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693d02907efe4593497f9496/10dad5458_ChatGPTImageJan11202606_15_53PM.png" 
                  alt="BuyersAlike"
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-white/50 mb-5 max-w-sm text-sm leading-relaxed">
                Connecting like-minded professionals for business partnerships, acquisitions, and ventures. 
                Join 10,000+ dealmakers closing deals every day.
              </p>
              <div className="flex items-center gap-2 text-white/40 text-sm mb-5">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                <span>for dealmakers worldwide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["ISO Certified", "GDPR Compliant", "SOC 2 Type II"].map((badge) => (
                  <div key={badge} className="px-3 py-1 rounded-lg text-xs font-medium glass-bg" style={{ color: '#7A8BA6' }}>
                    {badge}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.08 }}
            >
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/45 hover:text-white/80 transition-colors duration-300 text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
          <p className="text-white/40 text-sm">
            © 2025 BuyersAlike. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <a key={link} href="#" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}