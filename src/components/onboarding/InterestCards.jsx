import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_INTERESTS = [
  { name: "Real Estate Investment", emoji: "🏢", description: "Properties, development, REITs" },
  { name: "Technology & Software", emoji: "💻", description: "SaaS, apps, tech startups" },
  { name: "E-commerce", emoji: "🛒", description: "Online retail, dropshipping" },
  { name: "Manufacturing", emoji: "🏭", description: "Production, supply chain" },
  { name: "Healthcare", emoji: "⚕️", description: "Medical services, wellness" },
  { name: "Food & Beverage", emoji: "🍔", description: "Restaurants, catering, products" },
  { name: "Consulting", emoji: "💡", description: "Business advisory, strategy" },
  { name: "Finance & Investment", emoji: "💰", description: "Trading, funds, banking" },
  { name: "Marketing & Advertising", emoji: "📢", description: "Digital marketing, branding" },
  { name: "Education", emoji: "📚", description: "Training, courses, coaching" },
  { name: "Entertainment", emoji: "🎭", description: "Media, events, production" },
  { name: "Green Energy", emoji: "🌱", description: "Solar, sustainable solutions" },
];

export default function InterestCards({ onNext }) {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  const interests = categories.length > 0
    ? categories.map(cat => ({
        name: cat.name,
        emoji: cat.emoji || "🎯",
        description: cat.description || ""
      }))
    : DEFAULT_INTERESTS;

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest.name)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest.name));
    } else {
      setSelectedInterests([...selectedInterests, interest.name]);
    }
  };

  const handleNext = () => {
    if (selectedInterests.length > 0) {
      onNext({ interests: selectedInterests });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-5xl"
    >
      <div className="p-8 md:p-12 rounded-3xl" style={{ background: '#fff', border: '2px solid #000' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: '#000' }}
          >
            What interests you? 🎯
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg"
            style={{ color: '#666' }}
          >
            Pick any that catch your eye. You can always change these later!
          </motion.p>
        </div>

        {/* Interest Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {interests.map((interest, index) => {
            const isSelected = selectedInterests.includes(interest.name);
            return (
              <motion.button
                key={interest.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleInterest(interest)}
                className="relative p-6 rounded-2xl text-center transition-all hover:scale-105"
                style={{
                  background: isSelected ? '#D8A11F' : '#fff',
                  border: `2px solid ${isSelected ? '#D8A11F' : '#000'}`,
                  color: isSelected ? '#fff' : '#000'
                }}
              >
                {/* Check Mark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: '#fff', border: '2px solid #D8A11F' }}
                  >
                    <Check className="w-5 h-5" style={{ color: '#D8A11F' }} />
                  </motion.div>
                )}

                <div className="text-4xl mb-2">{interest.emoji}</div>
                <div className="font-bold text-sm mb-1">{interest.name}</div>
                <div className="text-xs opacity-75">{interest.description}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Selection Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6"
        >
          <p className="text-sm" style={{ color: selectedInterests.length > 0 ? '#D8A11F' : '#666' }}>
            {selectedInterests.length > 0
              ? `✨ ${selectedInterests.length} interest${selectedInterests.length > 1 ? 's' : ''} selected`
              : "👆 Tap cards to select your interests"}
          </p>
        </motion.div>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          disabled={selectedInterests.length === 0}
          size="lg"
          className="w-full text-lg py-6 rounded-xl gap-2 hover:scale-105 transition-transform disabled:opacity-50"
          style={{ background: '#D8A11F', color: '#fff' }}
        >
          Continue ({selectedInterests.length} selected)
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}