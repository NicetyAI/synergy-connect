import React from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";

export default function CategoryCard({ category, postCount }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-6 cursor-pointer group relative overflow-hidden rounded-xl"
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ 
            background: '#D8A11F',
          }}
        >
          <Briefcase className="w-7 h-7" style={{ color: '#fff' }} />
        </div>
        <motion.div
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          <ArrowRight className="w-5 h-5" style={{ color: '#D8A11F' }} />
        </motion.div>
      </div>
      
      <h3 className="text-lg font-bold mb-2 relative z-10" style={{ color: '#000' }}>
        {category.name}
      </h3>
      
      {category.description && (
        <p className="text-sm mb-4 line-clamp-2 relative z-10" style={{ color: '#666' }}>
          {category.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 relative z-10" style={{ borderTop: '1px solid #E5E7EB' }}>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold" style={{ color: '#D8A11F' }}>
            {postCount}
          </span>
          <span className="text-sm" style={{ color: '#666' }}>
            {postCount === 1 ? 'post' : 'posts'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}