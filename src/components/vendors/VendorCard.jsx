import React from "react";
import { motion } from "framer-motion";
import { MapPin, Store } from "lucide-react";

export default function VendorCard({ vendor, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 cursor-pointer"
      style={{
        background: '#0F2744',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: 'rgba(234, 88, 12, 0.15)', border: '1px solid rgba(234, 88, 12, 0.3)' }}>
            <Store className="w-8 h-8" style={{ color: '#EA580C' }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Name */}
          <h3 className="text-lg font-bold mb-2" style={{ color: '#E5EDFF' }}>
            {vendor.name}
          </h3>

          {/* Category */}
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#FB923C', border: '1px solid rgba(234, 88, 12, 0.3)' }}>
            {vendor.category}
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mt-3">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#7A8BA6' }} />
            <p className="text-sm" style={{ color: '#B6C4E0' }}>
              {vendor.address}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}