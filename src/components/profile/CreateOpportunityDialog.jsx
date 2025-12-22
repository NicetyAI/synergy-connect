import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X, Sparkles, Loader2, Lightbulb } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateOpportunityDialog({ open, onOpenChange, userEmail }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    investment_min: "",
    investment_max: "",
    image_url: "",
    source_url: "",
    related_interests: []
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [aiInput, setAiInput] = useState({
    goal: "",
    industry: "",
    budget: ""
  });

  // Fetch user's approved interests
  const { data: userInterests = [] } = useQuery({
    queryKey: ['user-interests', userEmail],
    queryFn: () => base44.entities.Interest.filter({ user_email: userEmail, status: 'approved' }),
    enabled: open,
  });

  const createOpportunityMutation = useMutation({
    mutationFn: async (data) => {
      const opportunity = await base44.entities.Opportunity.create(data);
      
      // Trigger opportunity matching notifications
      try {
        await base44.functions.invoke('checkOpportunityMatches', {
          opportunityId: opportunity.id
        });
      } catch (error) {
        console.error('Failed to check opportunity matches:', error);
      }
      
      return opportunity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      resetForm();
      onOpenChange(false);
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploading(true);
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setFormData(prev => ({ ...prev, image_url: file_url }));
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, image_url: "" }));
  };

  const toggleInterest = (interestName) => {
    setFormData(prev => ({
      ...prev,
      related_interests: prev.related_interests.includes(interestName)
        ? prev.related_interests.filter(i => i !== interestName)
        : [...prev.related_interests, interestName]
    }));
  };

  const handleAiGenerate = async () => {
    if (!aiInput.goal && !aiInput.industry) {
      return;
    }

    setAiGenerating(true);
    try {
      const response = await base44.functions.invoke('generateOpportunityDetails', {
        title: aiInput.goal,
        industry: aiInput.industry,
        budget: aiInput.budget,
        goal: aiInput.goal
      });

      if (response.data.success) {
        setAiSuggestions(response.data);
        
        // Auto-fill form with AI suggestions
        setFormData(prev => ({
          ...prev,
          title: aiInput.goal,
          description: response.data.description,
          category: response.data.category,
        }));

        // Parse investment range
        if (response.data.investment_range) {
          const rangeMatch = response.data.investment_range.match(/\$?([\d.]+)(K|M)?\s*-\s*\$?([\d.]+)(K|M)?/i);
          if (rangeMatch) {
            const parseAmount = (num, unit) => {
              const multiplier = unit === 'K' ? 1000 : unit === 'M' ? 1000000 : 1;
              return parseFloat(num) * multiplier;
            };
            setFormData(prev => ({
              ...prev,
              investment_min: parseAmount(rangeMatch[1], rangeMatch[2]).toString(),
              investment_max: parseAmount(rangeMatch[3], rangeMatch[4]).toString()
            }));
          }
        }
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setAiGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      investment_min: "",
      investment_max: "",
      image_url: "",
      source_url: "",
      related_interests: []
    });
    setUploadedFile(null);
    setShowAiHelper(false);
    setAiSuggestions(null);
    setAiInput({ goal: "", industry: "", budget: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createOpportunityMutation.mutate({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      investment_min: formData.investment_min ? parseFloat(formData.investment_min) : undefined,
      investment_max: formData.investment_max ? parseFloat(formData.investment_max) : undefined,
      image_url: formData.image_url,
      source_url: formData.source_url,
      status: "pending",
      creator_email: userEmail,
      related_interests: formData.related_interests
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#F2F1F5', border: '2px solid #000' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color: '#000' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#D8A11F' }}>
              <Plus className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            Create New Opportunity
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* AI Assistant Toggle */}
          <div className="p-4 rounded-xl" style={{ background: 'rgba(216, 161, 31, 0.1)', border: '2px solid #D8A11F' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" style={{ color: '#D8A11F' }} />
                <div>
                  <p className="font-semibold" style={{ color: '#000' }}>AI Opportunity Assistant</p>
                  <p className="text-xs" style={{ color: '#666' }}>Let AI help you create a compelling opportunity</p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => setShowAiHelper(!showAiHelper)}
                size="sm"
                style={{ background: showAiHelper ? '#D8A11F' : '#fff', color: showAiHelper ? '#fff' : '#000', border: '2px solid #000' }}
              >
                {showAiHelper ? 'Hide' : 'Use AI'}
              </Button>
            </div>

            <AnimatePresence>
              {showAiHelper && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  <div>
                    <Label style={{ color: '#000' }}>What's your goal? *</Label>
                    <Input
                      value={aiInput.goal}
                      onChange={(e) => setAiInput({ ...aiInput, goal: e.target.value })}
                      className="mt-2 rounded-xl"
                      style={{ color: '#000', background: '#fff', border: '2px solid #000' }}
                      placeholder="e.g., Expand fitness franchise to new markets"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label style={{ color: '#000' }}>Industry</Label>
                      <Input
                        value={aiInput.industry}
                        onChange={(e) => setAiInput({ ...aiInput, industry: e.target.value })}
                        className="mt-2 rounded-xl"
                        style={{ color: '#000', background: '#fff', border: '2px solid #000' }}
                        placeholder="e.g., Fitness & Wellness"
                      />
                    </div>
                    <div>
                      <Label style={{ color: '#000' }}>Rough Budget</Label>
                      <Input
                        value={aiInput.budget}
                        onChange={(e) => setAiInput({ ...aiInput, budget: e.target.value })}
                        className="mt-2 rounded-xl"
                        style={{ color: '#000', background: '#fff', border: '2px solid #000' }}
                        placeholder="e.g., $500K - $1M"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={aiGenerating || !aiInput.goal}
                    className="w-full gap-2 rounded-xl"
                    style={{ background: '#D8A11F', color: '#fff', border: '2px solid #000' }}
                  >
                    {aiGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI is working...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>

                  {aiSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-xl space-y-3"
                      style={{ background: '#fff', border: '2px solid #000' }}
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" style={{ color: '#D8A11F' }} />
                        <p className="font-semibold" style={{ color: '#000' }}>AI Insights & Suggestions</p>
                      </div>
                      
                      {aiSuggestions.market_insights && (
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#666' }}>Market Insights:</p>
                          <p className="text-sm" style={{ color: '#000' }}>{aiSuggestions.market_insights}</p>
                        </div>
                      )}

                      {aiSuggestions.strategic_alignments?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold mb-2" style={{ color: '#666' }}>Strategic Alignments:</p>
                          <div className="space-y-1">
                            {aiSuggestions.strategic_alignments.map((alignment, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="text-xs" style={{ color: '#D8A11F' }}>•</span>
                                <p className="text-xs" style={{ color: '#000' }}>{alignment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {aiSuggestions.suggested_tags?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold mb-2" style={{ color: '#666' }}>Suggested Tags:</p>
                          <div className="flex flex-wrap gap-2">
                            {aiSuggestions.suggested_tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 rounded-lg text-xs"
                                style={{ background: '#FEF3C7', color: '#000', border: '1px solid #D8A11F' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Basic Information */}
          <div>
            <Label htmlFor="title" style={{ color: '#000' }}>Opportunity Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-2 rounded-xl"
              style={{ color: '#000', background: '#fff', border: '2px solid #000' }}
              placeholder="e.g., 1-800-GOT-JUNK? Franchise Opportunity"
            />
          </div>

          <div>
            <Label htmlFor="description" style={{ color: '#000' }}>Description *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2 h-24 rounded-xl"
              style={{ color: '#000', background: '#fff', border: '2px solid #000' }}
              placeholder="Describe the opportunity in detail..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" style={{ color: '#000' }}>Category *</Label>
              <Select required value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="mt-2 rounded-xl" style={{ color: '#000', background: '#fff', border: '2px solid #000' }}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Franchises">Franchises</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="Acquisition">Acquisition</SelectItem>
                  <SelectItem value="Joint Venture">Joint Venture</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source_url" style={{ color: '#000' }}>Source URL</Label>
              <Input
                id="source_url"
                type="url"
                value={formData.source_url}
                onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                className="mt-2 rounded-xl"
                style={{ color: '#000', background: '#fff', border: '2px solid #000' }}
                placeholder="https://example.com/franchise"
              />
            </div>
          </div>

          {/* Investment Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="investment_min" style={{ color: '#000' }}>Minimum Investment ($)</Label>
              <Input
                id="investment_min"
                type="number"
                value={formData.investment_min}
                onChange={(e) => setFormData({ ...formData, investment_min: e.target.value })}
                className="mt-2 rounded-xl"
                style={{ color: '#000', background: '#fff', border: '2px solid #000' }}
                placeholder="50000"
              />
            </div>
            <div>
              <Label htmlFor="investment_max" style={{ color: '#000' }}>Maximum Investment ($)</Label>
              <Input
                id="investment_max"
                type="number"
                value={formData.investment_max}
                onChange={(e) => setFormData({ ...formData, investment_max: e.target.value })}
                className="mt-2 rounded-xl"
                style={{ color: '#000', background: '#fff', border: '2px solid #000' }}
                placeholder="250000"
              />
            </div>
          </div>

          {/* Related Interests */}
          {userInterests.length > 0 && (
            <div>
              <Label style={{ color: '#000' }}>Related Interests (Optional)</Label>
              <p className="text-xs mb-2" style={{ color: '#666' }}>
                Select interests this opportunity relates to
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {userInterests.map(interest => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.interest_name)}
                    className="px-3 py-1 rounded-lg text-sm transition-all"
                    style={{
                      background: formData.related_interests.includes(interest.interest_name)
                        ? '#FEF3C7'
                        : '#fff',
                      border: '2px solid ' + (formData.related_interests.includes(interest.interest_name)
                        ? '#D8A11F'
                        : '#000'),
                      color: '#000'
                    }}
                  >
                    {interest.interest_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <Label htmlFor="image" style={{ color: '#000' }}>Opportunity Image</Label>
            <p className="text-xs mb-2" style={{ color: '#666' }}>
              Accepted formats: JPG, PNG (Max 5MB)
            </p>
            
            {!uploadedFile ? (
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-opacity-50"
                style={{ borderColor: '#000', background: '#fff' }}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2" style={{ color: '#D8A11F' }} />
                  <p className="text-sm" style={{ color: '#000' }}>
                    Click to upload or drag and drop
                  </p>
                </div>
                <input
                  id="image"
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div 
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: '#FEF3C7', border: '2px solid #D8A11F' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#D8A11F' }}>
                    <Upload className="w-5 h-5" style={{ color: '#fff' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#000' }}>
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs" style={{ color: '#666' }}>
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleRemoveFile}
                  className="rounded-lg p-2"
                  style={{ background: '#EF4444', color: '#fff', border: '2px solid #000' }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4" style={{ borderTop: '2px solid #000' }}>
            <Button
              type="button"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="flex-1 rounded-xl"
              style={{ background: '#fff', color: '#000', border: '2px solid #000' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createOpportunityMutation.isPending || uploading}
              className="flex-1 rounded-xl"
              style={{ background: '#D8A11F', color: '#fff', border: '2px solid #000' }}
            >
              {createOpportunityMutation.isPending ? 'Creating...' : 'Create Opportunity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}