import React from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";

export default function CategoryCard({ category, postCount }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-5 cursor-pointer rounded-xl"
      style={{
        background: '#fff',
        border: '1px solid #000',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ 
            background: '#D8A11F',
          }}
        >
          <Briefcase className="w-6 h-6" style={{ color: '#fff' }} />
        </div>
      </div>
      
      <h3 className="text-base font-bold mb-1" style={{ color: '#000' }}>
        {category.name}
      </h3>
      
      {category.description && (
        <p className="text-xs mb-3 line-clamp-1" style={{ color: '#666' }}>
          {category.description}
        </p>
      )}

      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold" style={{ color: '#D8A11F' }}>
          {postCount}
        </span>
        <span className="text-xs" style={{ color: '#666' }}>
          {postCount === 1 ? 'post' : 'posts'}
        </span>
      </div>
    </motion.div>
  );
}