import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Store, Edit2, Plus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EditVendorProfileDialog from "./EditVendorProfileDialog";

export default function VendorProfileSection({ userEmail }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: vendorProfile, isLoading } = useQuery({
    queryKey: ['vendorProfile', userEmail],
    queryFn: async () => {
      const vendors = await base44.entities.VendorApplication.filter({ 
        user_email: userEmail,
        status: 'approved'
      });
      return vendors[0] || null;
    },
    enabled: !!userEmail,
  });

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <p style={{ color: '#B6C4E0' }}>Loading vendor profile...</p>
      </div>
    );
  }

  if (!vendorProfile) {
    return null;
  }

  return (
    <>
      <div className="p-6 rounded-2xl mb-6" style={{ background: '#fff', border: '2px solid #000' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#D8A11F' }}>
              <Store className="w-6 h-6" style={{ color: '#fff' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#000' }}>Vendor Profile</h3>
              <p className="text-sm" style={{ color: '#666' }}>{vendorProfile.business_name}</p>
            </div>
          </div>
          <Button
            onClick={() => setShowEditDialog(true)}
            className="gap-2"
            style={{ background: '#D8A11F', color: '#fff' }}
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        <div className="space-y-4">
          {/* Category & Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#666' }}>Category</label>
              <p style={{ color: '#000' }}>{vendorProfile.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#666' }}>Location</label>
              <p style={{ color: '#000' }}>{vendorProfile.province}, Canada</p>
            </div>
          </div>

          {/* Tagline */}
          {vendorProfile.tagline && (
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#666' }}>Tagline</label>
              <p style={{ color: '#000' }}>"{vendorProfile.tagline}"</p>
            </div>
          )}

          {/* Description */}
          {vendorProfile.description && (
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#666' }}>About</label>
              <p className="text-sm" style={{ color: '#000' }}>{vendorProfile.description}</p>
            </div>
          )}

          {/* Unique Value */}
          {vendorProfile.unique_value && (
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#666' }}>Why Choose Us</label>
              <p className="text-sm" style={{ color: '#000' }}>{vendorProfile.unique_value}</p>
            </div>
          )}

          {/* Years Experience */}
          {vendorProfile.years_experience && (
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#666' }}>Years in Business</label>
              <p style={{ color: '#000' }}>{vendorProfile.years_experience} years</p>
            </div>
          )}

          {/* Specialties */}
          {vendorProfile.specialties && vendorProfile.specialties.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#666' }}>Specialties</label>
              <div className="flex flex-wrap gap-2">
                {vendorProfile.specialties.map((specialty, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: '#FFF4E0', color: '#D8A11F', border: '1px solid #D8A11F' }}>
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Client Types */}
          {vendorProfile.client_types && vendorProfile.client_types.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#666' }}>Client Types</label>
              <div className="flex flex-wrap gap-2">
                {vendorProfile.client_types.map((type, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {vendorProfile.certifications && vendorProfile.certifications.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#666' }}>Certifications & Awards</label>
              <div className="space-y-1">
                {vendorProfile.certifications.map((cert, idx) => (
                  <div key={idx} className="text-sm" style={{ color: '#000' }}>• {cert}</div>
                ))}
              </div>
            </div>
          )}

          {/* Website */}
          {vendorProfile.website && (
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#666' }}>Website</label>
              <a href={vendorProfile.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: '#3B82F6' }}>
                {vendorProfile.website}
              </a>
            </div>
          )}
        </div>
      </div>

      <EditVendorProfileDialog
        vendor={vendorProfile}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  );
}