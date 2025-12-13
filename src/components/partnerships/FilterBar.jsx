import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  SlidersHorizontal, 
  Grid3x3, 
  List,
  ArrowUpDown,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterBar({ viewMode, setViewMode, totalResults }) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left - Results count */}
        <div className="flex items-center gap-4">
          <p className="text-white/70">
            Showing <span className="text-white font-semibold">{totalResults}</span> partnerships
          </p>
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Right - View controls */}
        <div className="flex items-center gap-3">
          {/* Sort */}
          <Select defaultValue="match">
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white rounded-xl">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10 text-white">
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="dealsize">Deal Size</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}