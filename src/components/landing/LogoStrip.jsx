import React from "react";

const logos = [
  "Deloitte", "McKinsey", "Goldman Sachs", "KPMG", "Bain & Co",
  "BCG", "JP Morgan", "Morgan Stanley", "Accenture", "PwC",
];

export default function LogoStrip() {
  return (
    <section className="py-12 border-y border-gray-100 overflow-hidden bg-gray-50/50">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">
        Trusted by professionals at
      </p>
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...logos, ...logos].map((name, i) => (
            <div
              key={i}
              className="mx-10 text-xl font-bold text-gray-300 select-none flex-shrink-0"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}