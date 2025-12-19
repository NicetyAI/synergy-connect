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
        background: '#fff',
        border: '1px solid #000',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: '#D8A11F', border: '1px solid #000' }}>
            <Store className="w-8 h-8" style={{ color: '#fff' }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Name */}
          <h3 className="text-lg font-bold mb-2" style={{ color: '#000' }}>
            {vendor.name}
          </h3>

          {/* Category */}
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ background: '#D8A11F', color: '#fff' }}>
            {vendor.category}
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mt-3">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#666' }} />
            <p className="text-sm" style={{ color: '#666' }}>
              {vendor.address}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}