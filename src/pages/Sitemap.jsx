import React from "react";
import { motion } from "framer-motion";
import { Download, FileText, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateSitemap, downloadSitemap, getRobotsTxt } from "@/components/seo/sitemap";
import SEO from "@/components/seo/SEO";

export default function Sitemap() {
  const handleDownloadSitemap = () => {
    downloadSitemap();
  };

  const handleCopySitemap = () => {
    const sitemap = generateSitemap();
    navigator.clipboard.writeText(sitemap);
    alert("Sitemap XML copied to clipboard!");
  };

  const handleCopyRobots = () => {
    const robotsTxt = getRobotsTxt();
    navigator.clipboard.writeText(robotsTxt);
    alert("robots.txt content copied to clipboard!");
  };

  const pages = [
    { name: "Home", url: "/" },
    { name: "Partnerships", url: "/Partnerships" },
    { name: "Opportunities", url: "/Opportunities" },
    { name: "Vendors", url: "/Vendors" },
    { name: "Events", url: "/Events" },
    { name: "Forum", url: "/Forum" },
    { name: "News", url: "/News" },
    { name: "Activity Feed", url: "/ActivityFeed" },
    { name: "Recommendations", url: "/Recommendations" },
  ];

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)' }}>
      <SEO 
        title="Sitemap - SEO Tools"
        description="View and download the XML sitemap for BuyersAlike platform"
        noindex={true}
      />
      
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">SEO Sitemap Generator</h1>
          <p className="text-white/70 text-lg">
            Generate and download XML sitemap for better search engine crawling
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">XML Sitemap</h2>
              </div>
              <p className="text-white/70 mb-4">
                Download the XML sitemap file for submission to search engines like Google and Bing.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleDownloadSitemap} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button onClick={handleCopySitemap} variant="outline" className="gap-2">
                  Copy XML
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">robots.txt</h2>
              </div>
              <p className="text-white/70 mb-4">
                Copy the robots.txt content to control search engine crawler access.
              </p>
              <Button onClick={handleCopyRobots} variant="outline" className="gap-2">
                Copy robots.txt
              </Button>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <LinkIcon className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Page List</h2>
            </div>
            <div className="grid gap-3">
              {pages.map((page, index) => (
                <motion.div
                  key={page.url}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <div>
                    <p className="text-white font-semibold">{page.name}</p>
                    <p className="text-white/50 text-sm">{window.location.origin}{page.url}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}