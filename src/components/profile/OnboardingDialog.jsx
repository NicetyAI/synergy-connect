import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles, User, MapPin, DollarSign, Target, FileText, Camera } from "lucide-react";

const STEPS = [
  {
    id: "occupation",
    title: "What do you do?",
    subtitle: "This helps us connect you with the right people",
    icon: User,
    field: "occupation",
    type: "input",
    placeholder: "e.g., Real Estate Investor, Entrepreneur",
    emoji: "💼",
  },
  {
    id: "phone",
    title: "What's your phone number?",
    subtitle: "So potential partners can reach you",
    icon: User,
    field: "phone_number",
    type: "input",
    placeholder: "e.g., +1 (416) 555-1234",
    emoji: "📱",
  },
  {
    id: "location",
    title: "Where are you based?",
    subtitle: "We'll show you local opportunities",
    icon: MapPin,
    field: "location",
    type: "input",
    placeholder: "e.g., Toronto, Canada",
    emoji: "📍",
  },
  {
    id: "overview",
    title: "Tell us about yourself",
    subtitle: "A compelling overview helps you stand out",
    icon: FileText,
    field: "overview",
    type: "textarea",
    placeholder: "e.g., Serial entrepreneur with 10+ years in real estate...",
    emoji: "✍️",
  },
  {
    id: "business_name",
    title: "What's your business name?",
    subtitle: "The company or brand you represent",
    icon: Target,
    field: "business_name",
    type: "input",
    placeholder: "e.g., Apex Investments Inc.",
    emoji: "🏢",
  },
  {
    id: "avatar",
    title: "Upload a profile photo",
    subtitle: "Profiles with photos get 3x more connections",
    icon: Camera,
    field: "avatar_url",
    type: "photo",
    emoji: "📸",
  },
];

export default function OnboardingDialog({ open, onOpenChange, user }) {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Filter to only incomplete steps
  const incompleteSteps = STEPS.filter(step => !user?.[step.field]);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setValues({});
    }
  }, [open]);

  if (incompleteSteps.length === 0) return null;

  const step = incompleteSteps[currentStep];
  const totalSteps = incompleteSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentValue = values[step?.field] || "";
  const isLast = currentStep === totalSteps - 1;

  const handleNext = async () => {
    if (isLast) {
      await handleSave();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    if (isLast) {
      handleSave();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const dataToSave = {};
    for (const [key, val] of Object.entries(values)) {
      if (val && val.trim && val.trim()) {
        dataToSave[key] = val.trim();
      } else if (val) {
        dataToSave[key] = val;
      }
    }
    if (Object.keys(dataToSave).length > 0) {
      await base44.auth.updateMe(dataToSave);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['userInterests'] });
    }
    setSaving(false);
    onOpenChange(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setValues(prev => ({ ...prev, avatar_url: file_url }));
    setUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-3xl border-2 border-black" style={{ background: '#fff' }}>
        {/* Progress */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: '#D8A11F' }} />
              <span className="text-sm font-bold" style={{ color: '#000' }}>
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: '#D8A11F' }}>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" style={{ background: 'rgba(0,0,0,0.1)' }} />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-6 py-6"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{step?.emoji}</div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: '#000' }}>{step?.title}</h3>
              <p className="text-sm" style={{ color: '#666' }}>{step?.subtitle}</p>
            </div>

            {step?.type === "input" && (
              <Input
                value={currentValue}
                onChange={(e) => setValues(prev => ({ ...prev, [step.field]: e.target.value }))}
                placeholder={step.placeholder}
                className="text-base py-6 rounded-xl"
                style={{ background: '#F9FAFB', border: '2px solid #E5E7EB', color: '#000' }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentValue.trim()) handleNext();
                }}
              />
            )}

            {step?.type === "textarea" && (
              <Textarea
                value={currentValue}
                onChange={(e) => setValues(prev => ({ ...prev, [step.field]: e.target.value }))}
                placeholder={step.placeholder}
                className="text-base rounded-xl resize-none"
                style={{ background: '#F9FAFB', border: '2px solid #E5E7EB', color: '#000' }}
                rows={4}
                autoFocus
              />
            )}

            {step?.type === "photo" && (
              <div className="flex flex-col items-center gap-4">
                {(values.avatar_url || user?.avatar_url) ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4" style={{ borderColor: '#D8A11F' }}>
                    <img src={values.avatar_url || user?.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ background: '#F3F4F6', border: '2px dashed #D1D5DB' }}>
                    <Camera className="w-10 h-10" style={{ color: '#9CA3AF' }} />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  <div
                    className="px-6 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-90"
                    style={{ background: values.avatar_url ? '#22C55E' : '#D8A11F', color: '#fff' }}
                  >
                    {uploading ? "Uploading..." : values.avatar_url ? "✓ Photo Uploaded — Change" : "Choose Photo"}
                  </div>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex items-center gap-3">
          {currentStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="rounded-xl py-5 gap-1"
              style={{ borderColor: '#E5E7EB', color: '#666' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}

          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-medium px-4 py-2"
            style={{ color: '#9CA3AF' }}
          >
            Skip
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={saving || uploading}
            className="flex-1 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#fff' }}
          >
            {saving ? "Saving..." : isLast ? "Finish Setup" : "Next"}
            {!saving && (isLast ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />)}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}