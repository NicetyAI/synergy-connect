import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  Bookmark, 
  MessageSquare, 
  Settings,
  TrendingUp,
  Users,
  Building2,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const menuItems = [
  { icon: LayoutGrid, label: "All Partnerships", active: true },
  { icon: Bookmark, label: "Saved", count: 12 },
  { icon: MessageSquare, label: "Messages", count: 5 },
  { icon: TrendingUp, label: "Trending" },
  { icon: Users, label: "My Network" },
];

const categories = [
  { icon: Building2, label: "Acquisitions", count: 24 },
  { icon: Users, label: "Joint Ventures", count: 18 },
  { icon: TrendingUp, label: "Investments", count: 32 },
  { icon: Settings, label: "Strategic", count: 15 },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen sticky top-0 backdrop-blur-xl bg-white/5 border-r border-white/10 p-6 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">BuyersAlike</span>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search..."
          className="w-full pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500/50 rounded-xl"
        />
      </div>

      {/* Menu Items */}
      <div className="space-y-2 mb-8">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Menu</p>
        {menuItems.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ x: 4 }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              item.active
                ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.count && (
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                {item.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Categories</p>
        {categories.map((category) => (
          <motion.button
            key={category.label}
            whileHover={{ x: 4 }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <category.icon className="w-4 h-4" />
              <span className="text-sm">{category.label}</span>
            </div>
            <span className="text-xs text-white/40">{category.count}</span>
          </motion.button>
        ))}
      </div>
    </aside>
  );
}