import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Target, TrendingUp, Lightbulb, MessageSquare } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";

export default function AICampaignHelper() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  
  const [formData, setFormData] = useState({
    goals: "",
    targetAudience: "",
    budget: "",
  });

  const handleGenerate = async () => {
    if (!formData.goals || !formData.budget) {
      alert("Please fill in campaign goals and budget");
      return;
    }

    setGenerating(true);
    try {
      const response = await base44.functions.invoke('generateAdCampaignDetails', {
        goals: formData.goals,
        target_audience: formData.targetAudience,
        budget: formData.budget,
        duration_months: 1,
        business_type: ""
      });

      if (response.data.success) {
        setAiSuggestions(response.data);
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('Failed to generate insights. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mb-8">
      <Card 
        className="p-6 rounded-2xl cursor-pointer transition-all hover:shadow-lg"
        style={{ background: 'linear-gradient(135deg, rgba(216, 161, 31, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)', border: '2px solid #D8A11F' }}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D8A11F 0%, #F59E0B 100%)' }}>
              <Sparkles className="w-6 h-6" style={{ color: '#fff' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#000' }}>
                AI Campaign Assistant
              </h3>
              <p className="text-sm" style={{ color: '#666' }}>
                Get instant campaign insights, ad copy, targeting recommendations, and ROI estimates
              </p>
            </div>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            style={{ background: isExpanded ? '#D8A11F' : '#fff', color: isExpanded ? '#fff' : '#D8A11F', border: '1px solid #D8A11F' }}
          >
            {isExpanded ? 'Hide Assistant' : 'Try AI Assistant'}
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: '#000' }}>
                    Campaign Goals *
                  </label>
                  <Textarea
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    placeholder="e.g., Increase brand awareness, generate leads..."
                    className="h-24 rounded-xl"
                    style={{ background: '#fff', border: '1px solid #000', color: '#000' }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: '#000' }}>
                    Target Audience
                  </label>
                  <Textarea
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="e.g., Small business owners, tech entrepreneurs..."
                    className="h-24 rounded-xl"
                    style={{ background: '#fff', border: '1px solid #000', color: '#000' }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: '#000' }}>
                    Monthly Budget *
                  </label>
                  <Input
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="$500"
                    className="rounded-xl"
                    style={{ background: '#fff', border: '1px solid #000', color: '#000' }}
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={generating || !formData.goals || !formData.budget}
                    className="w-full mt-3 gap-2"
                    style={{ background: 'linear-gradient(135deg, #D8A11F 0%, #F59E0B 100%)', color: '#fff' }}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Insights
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {aiSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-2 gap-4 mt-6"
                >
                  {/* Campaign Description */}
                  {aiSuggestions.campaign_description && (
                    <div className="p-4 rounded-xl" style={{ background: '#fff', border: '1px solid #D8A11F' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4" style={{ color: '#D8A11F' }} />
                        <p className="font-semibold text-sm" style={{ color: '#000' }}>Campaign Overview</p>
                      </div>
                      <p className="text-sm" style={{ color: '#000' }}>
                        {aiSuggestions.campaign_description}
                      </p>
                    </div>
                  )}

                  {/* Ad Copy Variations */}
                  {aiSuggestions.ad_copy_variations && (
                    <div className="p-4 rounded-xl" style={{ background: '#fff', border: '1px solid #D8A11F' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4" style={{ color: '#D8A11F' }} />
                        <p className="font-semibold text-sm" style={{ color: '#000' }}>AI-Generated Ad Copy</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Emotion-Focused:</p>
                          <p className="text-xs p-2 rounded-lg" style={{ color: '#000', background: '#F9FAFB' }}>
                            {aiSuggestions.ad_copy_variations.emotion_focused}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Feature-Focused:</p>
                          <p className="text-xs p-2 rounded-lg" style={{ color: '#000', background: '#F9FAFB' }}>
                            {aiSuggestions.ad_copy_variations.feature_focused}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Urgency-Focused:</p>
                          <p className="text-xs p-2 rounded-lg" style={{ color: '#000', background: '#F9FAFB' }}>
                            {aiSuggestions.ad_copy_variations.urgency_focused}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Targeting Parameters */}
                  {aiSuggestions.targeting_parameters && (
                    <div className="p-4 rounded-xl" style={{ background: '#fff', border: '1px solid #D8A11F' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4" style={{ color: '#D8A11F' }} />
                        <p className="font-semibold text-sm" style={{ color: '#000' }}>Optimal Targeting</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Age Range:</p>
                          <p style={{ color: '#000' }}>{aiSuggestions.targeting_parameters.age_range}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Geographic Focus:</p>
                          <p style={{ color: '#000' }}>{aiSuggestions.targeting_parameters.geographic_focus}</p>
                        </div>
                        {aiSuggestions.targeting_parameters.interest_categories?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Interests:</p>
                            <div className="flex flex-wrap gap-1">
                              {aiSuggestions.targeting_parameters.interest_categories.map((cat, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded-lg" style={{ background: '#F9FAFB', color: '#000' }}>
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ROI Estimate */}
                  {aiSuggestions.roi_estimate && (
                    <div className="p-4 rounded-xl" style={{ background: '#fff', border: '1px solid #22C55E' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4" style={{ color: '#22C55E' }} />
                        <p className="font-semibold text-sm" style={{ color: '#000' }}>Estimated ROI</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Est. Reach:</p>
                          <p className="font-bold" style={{ color: '#22C55E' }}>{aiSuggestions.roi_estimate.estimated_reach}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Est. Conversions:</p>
                          <p className="font-bold" style={{ color: '#22C55E' }}>{aiSuggestions.roi_estimate.estimated_conversions}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>ROI:</p>
                          <p className="font-bold" style={{ color: '#22C55E' }}>{aiSuggestions.roi_estimate.estimated_roi_percentage}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Break-even:</p>
                          <p className="font-bold" style={{ color: '#22C55E' }}>{aiSuggestions.roi_estimate.break_even_timeline}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Package Recommendation */}
                  {aiSuggestions.recommended_package && (
                    <div className="md:col-span-2 p-4 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#000' }}>
                        💡 Recommended: {aiSuggestions.recommended_package.toUpperCase()} Package
                      </p>
                      <p className="text-sm" style={{ color: '#666' }}>{aiSuggestions.package_reasoning}</p>
                    </div>
                  )}

                  {/* Optimization Tips */}
                  {aiSuggestions.optimization_tips?.length > 0 && (
                    <div className="md:col-span-2 p-4 rounded-xl" style={{ background: '#fff', border: '1px solid #D8A11F' }}>
                      <p className="font-semibold text-sm mb-2" style={{ color: '#000' }}>📊 Optimization Tips</p>
                      <ul className="space-y-1">
                        {aiSuggestions.optimization_tips.map((tip, i) => (
                          <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#666' }}>
                            <span style={{ color: '#D8A11F' }}>•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}