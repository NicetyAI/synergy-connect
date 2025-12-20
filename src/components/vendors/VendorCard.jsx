import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Store, Star, ExternalLink, Award, Briefcase } from "lucide-react";
import VendorDetailDialog from "./VendorDetailDialog";

export default function VendorCard({ vendor, index, featured = false }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => setShowDetail(true)}
        className="rounded-2xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
        style={{
          background: featured ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' : '#fff',
          border: featured ? '2px solid #D8A11F' : '1px solid #000',
          boxShadow: featured ? '0 8px 24px rgba(216, 161, 31, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}
      >
        {featured && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: '#D8A11F' }}>
              <Star className="w-3 h-3" style={{ color: '#fff' }} fill="#fff" />
              <span className="text-xs font-bold" style={{ color: '#fff' }}>FEATURED</span>
            </div>
          </div>
        )}

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center" style={{ 
            background: featured ? '#D8A11F' : '#D8A11F', 
            border: featured ? '2px solid #000' : '1px solid #000',
            boxShadow: featured ? '0 4px 12px rgba(216, 161, 31, 0.4)' : 'none'
          }}>
            <Store className="w-10 h-10" style={{ color: '#fff' }} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          {/* Name */}
          <h3 className="text-xl font-bold mb-2" style={{ color: '#000' }}>
            {vendor.name}
          </h3>

          {/* Category */}
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ background: '#D8A11F', color: '#fff' }}>
            {vendor.category}
          </div>

          {/* Tagline/USP */}
          {vendor.tagline && (
            <p className="text-sm font-medium mb-3 line-clamp-2" style={{ color: '#000' }}>
              "{vendor.tagline}"
            </p>
          )}

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-4 mb-3 text-xs" style={{ color: '#666' }}>
            {vendor.years_experience && (
              <div className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                <span>{vendor.years_experience}+ years</span>
              </div>
            )}
            {vendor.certifications && vendor.certifications.length > 0 && (
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>{vendor.certifications.length} certs</span>
              </div>
            )}
          </div>

          {/* Specialties */}
          {vendor.specialties && vendor.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mb-3">
              {vendor.specialties.slice(0, 3).map((specialty, idx) => (
                <span key={idx} className="px-2 py-1 text-xs rounded-full" style={{ background: '#F3F4F6', color: '#666' }}>
                  {specialty}
                </span>
              ))}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#666' }} />
            <p className="text-sm" style={{ color: '#666' }}>
              {vendor.address}
            </p>
          </div>

          {/* Learn More Link */}
          <div className="flex items-center justify-center gap-1 text-sm font-medium" style={{ color: '#D8A11F' }}>
            <span>Learn More</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </motion.div>

      <VendorDetailDialog 
        vendor={vendor} 
        open={showDetail} 
        onOpenChange={setShowDetail} 
      />
    </>
  );
}