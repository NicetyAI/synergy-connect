import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function CategoryCard({ category, postCount }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card glass-card-hover p-6 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}
        >
          <Briefcase className="w-6 h-6" style={{ color: '#E5EDFF' }} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>
            {postCount}
          </p>
          <p className="text-xs" style={{ color: '#7A8BA6' }}>posts</p>
        </div>
      </div>
      
      <h3 className="font-semibold mb-2" style={{ color: '#E5EDFF' }}>
        {category.name}
      </h3>
      
      {category.description && (
        <p className="text-sm" style={{ color: '#7A8BA6' }}>
          {category.description}
        </p>
      )}
    </motion.div>
  );
}