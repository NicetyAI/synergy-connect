import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";

export default function OpportunitiesFilter({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  investmentRange,
  setInvestmentRange,
  selectedInterests,
  setSelectedInterests,
  availableInterests,
  clearFilters,
  activeFiltersCount
}) {
  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="p-6 mb-8 rounded-2xl" style={{ background: '#fff', border: '1px solid #000' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: '#000' }}>Filters</h2>
        {activeFiltersCount > 0 && (
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            className="text-sm gap-2"
            style={{ color: '#EF4444' }}
          >
            <X className="w-4 h-4" />
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#000' }}>
            Search Keywords
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#666' }} />
            <Input
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
              style={{ color: '#000', background: '#F9FAFB', border: '1px solid #000' }}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#000' }}>
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-xl" style={{ color: '#000', background: '#F9FAFB', border: '1px solid #000' }}>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Franchises">Franchises</SelectItem>
              <SelectItem value="Investment">Investment</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="Acquisition">Acquisition</SelectItem>
              <SelectItem value="Joint Venture">Joint Venture</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Investment Range */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#000' }}>
            Investment Range
          </label>
          <div className="space-y-3">
            <Slider
              value={investmentRange}
              onValueChange={setInvestmentRange}
              min={0}
              max={2000000}
              step={50000}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm" style={{ color: '#666' }}>
              <span>${investmentRange[0].toLocaleString()}</span>
              <span>${investmentRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Related Interests */}
        {availableInterests.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#000' }}>
              Related Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className="px-3 py-1.5 rounded-lg text-sm transition-all"
                  style={{
                    background: selectedInterests.includes(interest) ? '#D8A11F' : '#F3F4F6',
                    color: selectedInterests.includes(interest) ? '#fff' : '#000',
                    border: '1px solid ' + (selectedInterests.includes(interest) ? '#D8A11F' : '#E5E7EB')
                  }}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}