import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function LandingVendors() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const all = await base44.entities.AdvertiseApplication.filter({ status: "approved" });
        const now = new Date();
        setAds(all.filter(ad => !ad.expiry_date || new Date(ad.expiry_date) > now).slice(0, 6));
      } catch {
        setAds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  if (loading) return null;
  if (ads.length === 0) return null;

  return (
    <section className="py-28 md:py-36 px-6 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Our Partners</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Trusted <em className="not-italic" style={{ color: '#B8860B' }}>vendors.</em>
            </h2>
          </div>
          <Link to={createPageUrl("Vendors")} className="text-gray-500 hover:text-gray-900 transition-colors font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad, i) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] cursor-pointer"
            >
              {ad.flyer_url && (
                <img src={ad.flyer_url} alt={ad.business_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-lg font-bold text-white mb-2">{ad.business_name}</h3>
                {ad.source_url && (
                  <a href={ad.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white">
                    Learn more <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}