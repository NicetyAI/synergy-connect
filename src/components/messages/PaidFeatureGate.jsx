import React from "react";
import { Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PaidFeatureGate() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF3C7' }}>
          <Lock className="w-8 h-8" style={{ color: '#D8A11F' }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: '#000' }}>
          Messaging is a Paid Feature
        </h3>
        <p className="text-sm mb-6" style={{ color: '#666' }}>
          Upgrade to a Professional or Enterprise plan to send messages, connect with members, and unlock unlimited networking.
        </p>
        <Link to="/#pricing">
          <Button className="gap-2 rounded-xl px-6 py-3" style={{ background: '#D8A11F', color: '#fff' }}>
            <Crown className="w-4 h-4" />
            Upgrade Your Plan
          </Button>
        </Link>
      </div>
    </div>
  );
}