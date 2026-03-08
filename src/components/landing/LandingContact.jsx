import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";

export default function LandingContact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.ContactSubmission.create(data),
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    mutation.mutate(form);
  };

  const inputStyle = "rounded-xl h-12 border-gray-200 bg-white focus:border-gray-400 focus-visible:ring-gray-300";

  return (
    <section className="py-28 md:py-36 px-6 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Contact</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Get in <em className="not-italic" style={{ color: '#B8860B' }}>touch.</em>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-12">
              Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
            </p>

            <div className="space-y-8">
              {[
                { icon: Mail, label: "Email", value: "hello@buyersalike.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Address", value: "123 Business Ave, San Francisco, CA" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                    <p className="text-gray-900 font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-gray-50 rounded-3xl p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitted && (
                  <div className="rounded-xl p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                    Thank you! Your message has been sent.
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                  <Input required placeholder="Your name" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputStyle} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                  <Input required type="email" placeholder="your@email.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputStyle} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                  <Input required placeholder="How can we help?" value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputStyle} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Message</label>
                  <Textarea required placeholder="Your message..." value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="rounded-xl border-gray-200 bg-white min-h-[140px] focus:border-gray-400 focus-visible:ring-gray-300" />
                </div>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full rounded-full h-12 font-semibold bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {mutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}