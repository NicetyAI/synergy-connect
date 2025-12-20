import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { FolderKanban, Sparkles, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateProjectDialog({ open, onOpenChange, userEmail }) {
  const [step, setStep] = useState("template"); // "template" or "details"
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    related_type: "general",
    status: "active"
  });
  const queryClient = useQueryClient();

  const { data: templates = [] } = useQuery({
    queryKey: ['projectTemplates'],
    queryFn: async () => {
      const predefined = await base44.entities.ProjectTemplate.filter({ is_predefined: true });
      const custom = await base44.entities.ProjectTemplate.filter({ creator_email: userEmail });
      return [...predefined, ...custom];
    },
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const project = await base44.entities.ProjectSpace.create(data);
      
      // If using a template, create default tasks
      if (selectedTemplate?.default_tasks?.length > 0) {
        for (const task of selectedTemplate.default_tasks) {
          await base44.entities.ProjectTask.create({
            project_id: project.id,
            title: task.title,
            description: task.description || "",
            priority: task.priority || "medium",
            status: "todo",
            created_by: userEmail
          });
        }
      }
      
      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setFormData({ name: "", description: "", related_type: "general", status: "active" });
      setSelectedTemplate(null);
      setStep("template");
      onOpenChange(false);
    },
  });

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData({
      name: "",
      description: template.description || "",
      related_type: "general",
      status: template.default_status || "active"
    });
    setStep("details");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      owner_email: userEmail,
      collaborators: [],
      cover_image: selectedTemplate?.cover_image
    });
  };

  const predefinedTemplates = [
    {
      name: "Marketing Campaign",
      description: "Launch and manage marketing campaigns",
      category: "marketing",
      cover_image: null,
      default_tasks: [
        { title: "Define campaign goals", priority: "high" },
        { title: "Create content calendar", priority: "high" },
        { title: "Design marketing materials", priority: "medium" },
        { title: "Set up tracking and analytics", priority: "medium" },
        { title: "Launch campaign", priority: "high" }
      ]
    },
    {
      name: "Software Development",
      description: "Build and ship software products",
      category: "software",
      cover_image: null,
      default_tasks: [
        { title: "Requirements gathering", priority: "high" },
        { title: "System design", priority: "high" },
        { title: "Development sprint", priority: "high" },
        { title: "Testing and QA", priority: "medium" },
        { title: "Deployment", priority: "high" },
        { title: "Documentation", priority: "low" }
      ]
    },
    {
      name: "Business Planning",
      description: "Strategic business planning and execution",
      category: "business",
      cover_image: null,
      default_tasks: [
        { title: "Market research", priority: "high" },
        { title: "Financial projections", priority: "high" },
        { title: "Competitive analysis", priority: "medium" },
        { title: "Create business plan", priority: "high" },
        { title: "Present to stakeholders", priority: "medium" }
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" style={{ background: '#F2F1F5', border: '2px solid #000' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color: '#000' }}>
            <FolderKanban className="w-6 h-6" />
            Create Project Space
          </DialogTitle>
        </DialogHeader>

        {step === "template" ? (
          <div className="mt-4">
            <p className="mb-4" style={{ color: '#666' }}>
              Choose a template to get started quickly, or start from scratch
            </p>

            {/* Start from Scratch */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setStep("details")}
              className="p-6 rounded-xl mb-6 cursor-pointer"
              style={{ background: '#fff', border: '2px solid #D8A11F' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#D8A11F' }}>
                  <FolderKanban className="w-6 h-6" style={{ color: '#fff' }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: '#000' }}>Start from Scratch</h3>
                  <p className="text-sm" style={{ color: '#666' }}>Create a blank project</p>
                </div>
              </div>
            </motion.div>

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {predefinedTemplates.map((template, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-5 rounded-xl cursor-pointer"
                  style={{ background: '#fff', border: '1px solid #000' }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#D8A11F' }}>
                      <Sparkles className="w-5 h-5" style={{ color: '#fff' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1" style={{ color: '#000' }}>{template.name}</h3>
                      <p className="text-sm" style={{ color: '#666' }}>{template.description}</p>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: '#666' }}>
                    {template.default_tasks.length} default tasks
                  </div>
                </motion.div>
              ))}

              {templates.filter(t => !t.is_predefined).map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-5 rounded-xl cursor-pointer"
                  style={{ background: '#fff', border: '1px solid #000' }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#666' }}>
                      <Save className="w-5 h-5" style={{ color: '#fff' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1" style={{ color: '#000' }}>{template.name}</h3>
                      <p className="text-sm" style={{ color: '#666' }}>{template.description}</p>
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded inline-block" style={{ background: '#F2F1F5', color: '#666' }}>
                    Custom Template
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => onOpenChange(false)}
                className="rounded-lg"
                style={{ background: '#fff', color: '#000', border: '1px solid #000' }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {selectedTemplate && (
              <div className="p-4 rounded-lg mb-4" style={{ background: '#fff', border: '1px solid #D8A11F' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: '#D8A11F' }} />
                    <span className="font-medium" style={{ color: '#000' }}>
                      Using template: {selectedTemplate.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(null);
                      setStep("template");
                    }}
                    variant="ghost"
                    className="text-sm"
                    style={{ color: '#666' }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#000' }}>
                Project Name *
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ background: '#fff', border: '1px solid #000', color: '#000' }}
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#000' }}>
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-24"
                style={{ background: '#fff', border: '1px solid #000', color: '#000' }}
                placeholder="What is this project about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#000' }}>
                Project Type
              </label>
              <Select 
                value={formData.related_type} 
                onValueChange={(value) => setFormData({ ...formData, related_type: value })}
              >
                <SelectTrigger style={{ background: '#fff', border: '1px solid #000', color: '#000' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Project</SelectItem>
                  <SelectItem value="opportunity">Opportunity Related</SelectItem>
                  <SelectItem value="partnership">Partnership Related</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={() => setStep("template")}
                className="flex-1 rounded-lg"
                style={{ background: '#fff', color: '#000', border: '1px solid #000' }}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 rounded-lg"
                style={{ background: '#D8A11F', color: '#fff' }}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}