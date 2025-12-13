import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Building2, 
  DollarSign, 
  Users, 
  Calendar,
  Bookmark,
  Share2
} from "lucide-react";

export default function PartnershipCard({ partnership, index }) {
  const matchPercentage = partnership.matchScore || 85;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
            {partnership.title}
          </h3>
          <p className="text-sm text-white/60 line-clamp-2">{partnership.description}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {Array(5).fill(0).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
        <span className="text-xs text-white/60 ml-1">(4.9)</span>
      </div>

      {/* Match Score */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/70">Match Score</span>
          <span className="text-sm font-semibold text-white">{matchPercentage}%</span>
        </div>
        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${matchPercentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full rounded-full ${
              matchPercentage >= 90 
                ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                : matchPercentage >= 75
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : "bg-gradient-to-r from-yellow-500 to-orange-500"
            }`}
          />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-white/70">{partnership.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white/70">{partnership.industry}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-sm text-white/70">{partnership.dealSize}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-pink-400" />
          <span className="text-sm text-white/70">{partnership.companySize}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/50 text-xs">
          <Calendar className="w-3 h-3" />
          <span>Posted {partnership.postedDate}</span>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105">
          View Full Details
        </Button>
      </div>
    </motion.div>
  );
}