import React from "react";

const links = {
  Product: ["Features", "Pricing", "Integrations", "API"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "Help Center", "Community", "Contact"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

export default function LandingFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693d02907efe4593497f9496/10dad5458_ChatGPTImageJan11202606_15_53PM.png"
              alt="BuyersAlike"
              className="h-9 w-auto mb-5"
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting like-minded professionals for business partnerships, acquisitions, and ventures.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2025 BuyersAlike. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map(l => (
              <a key={l} href="#" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}