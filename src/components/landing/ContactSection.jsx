import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.ContactSubmission.create(data),
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    submitMutation.mutate(formData);
  };

  const inputClass = "glass-card rounded-xl py-6 text-white placeholder:text-white/40 focus:border-[#D8A11F]/50 focus-visible:ring-[#D8A11F]/30";

  return (
    <section className="relative py-24 px-4" style={{ background: '#192234' }}>
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Get in{" "}
            <span className="bg-gradient-to-r from-[#D8A11F] to-[#F59E0B] bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-white/60">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass-card rounded-3xl p-7 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D8A11F] to-[#F59E0B] flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Send us a message</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl p-4 text-sm font-medium"
                    style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22C55E' }}
                  >
                    Thank you! Your message has been sent successfully.
                  </motion.div>
                )}
                <div>
                  <label className="text-sm mb-2 block text-white/60">Your Name</label>
                  <Input required placeholder="John Doe" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-sm mb-2 block text-white/60">Email Address</label>
                  <Input required type="email" placeholder="john@example.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-sm mb-2 block text-white/60">Subject</label>
                  <Input required placeholder="Partnership Opportunities" value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-sm mb-2 block text-white/60">Message</label>
                  <Textarea required placeholder="How can we help you?" value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="glass-card rounded-xl min-h-[150px] text-white placeholder:text-white/40 focus:border-[#D8A11F]/50 focus-visible:ring-[#D8A11F]/30" />
                </div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button 
                    type="submit" disabled={submitMutation.isPending}
                    className="w-full py-6 rounded-xl font-bold text-base shadow-lg text-white disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #D8A11F 0%, #F59E0B 100%)' }}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {submitMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            <div className="glass-card rounded-3xl p-7 lg:p-8">
              <h3 className="text-xl font-semibold mb-6 text-white">Contact Information</h3>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "hello@buyersalike.com" },
                  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                  { icon: MapPin, label: "Address", value: "123 Business Ave, San Francisco, CA 94102" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl glass-card flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#D8A11F]" />
                    </div>
                    <div>
                      <p className="text-sm text-white/50">{item.label}</p>
                      <p className="text-white/80">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <div className="glass-card rounded-3xl p-7 lg:p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04] bg-gradient-to-br from-[#D8A11F] via-transparent to-[#F59E0B]" />
              <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
                {[
                  { value: "24/7", label: "Support" },
                  { value: "<1hr", label: "Response" },
                  { value: "500+", label: "Reviews" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold bg-gradient-to-r from-[#D8A11F] to-[#F59E0B] bg-clip-text text-transparent">{stat.value}</p>
                    <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}