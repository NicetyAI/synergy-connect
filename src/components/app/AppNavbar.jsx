import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Menu, X, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Opportunities", href: "Opportunities" },
  { name: "Partnerships", href: "Partnerships" },
];

export default function AppNavbar({ currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav 
        className="sticky top-0 z-50"
        style={{ 
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px) saturate(180%)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={createPageUrl("Opportunities")} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)' }}>
                <Building2 className="w-5 h-5" style={{ color: '#E5EDFF' }} />
              </div>
              <span className="text-xl font-bold" style={{ color: '#E5EDFF' }}>BuyersAlike</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={createPageUrl(link.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    currentPage === link.href ? 'shadow-md' : ''
                  }`}
                  style={
                    currentPage === link.href
                      ? { background: 'linear-gradient(135deg, #3B82F6 0%, #1F3A8A 100%)', color: '#E5EDFF' }
                      : { color: '#B6C4E0' }
                  }
                  onMouseEnter={(e) => {
                    if (currentPage !== link.href) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== link.href) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" className="gap-2" style={{ color: '#B6C4E0' }}>
                <User className="w-4 h-4" />
                Profile
              </Button>
              <Button variant="ghost" className="gap-2" style={{ color: '#EF4444' }}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              style={{ color: '#E5EDFF' }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 backdrop-blur-xl" style={{ background: 'rgba(10, 22, 40, 0.95)' }} onClick={() => setMobileMenuOpen(false)} />
            <div className="relative pt-24 px-6">
              <div className="space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={createPageUrl(link.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-lg font-medium py-3 ${
                      currentPage === link.href ? 'font-bold' : ''
                    }`}
                    style={{ 
                      color: currentPage === link.href ? '#3B82F6' : '#E5EDFF', 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.18)' 
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <Button variant="outline" className="w-full gap-2" style={{ borderColor: 'rgba(255, 255, 255, 0.18)', color: '#E5EDFF' }}>
                    <User className="w-4 h-4" />
                    Profile
                  </Button>
                  <Button variant="outline" className="w-full gap-2" style={{ borderColor: 'rgba(239, 68, 68, 0.5)', color: '#EF4444' }}>
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}