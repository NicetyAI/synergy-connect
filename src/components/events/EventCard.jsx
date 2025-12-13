import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video, Users, CheckCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import moment from "moment";

const categoryColors = {
  Networking: { bg: 'rgba(102, 126, 234, 0.15)', color: '#667EEA', border: 'rgba(102, 126, 234, 0.3)' },
  Conference: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' },
  Workshop: { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
  Webinar: { bg: 'rgba(124, 58, 237, 0.15)', color: '#7C3AED', border: 'rgba(124, 58, 237, 0.3)' },
  Meetup: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', border: 'rgba(34, 197, 94, 0.3)' },
  Training: { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
  Social: { bg: 'rgba(236, 72, 153, 0.15)', color: '#EC4899', border: 'rgba(236, 72, 153, 0.3)' },
};

export default function EventCard({ event, currentUser, userRSVP }) {
  const queryClient = useQueryClient();

  const { data: allRSVPs = [] } = useQuery({
    queryKey: ['event-rsvps'],
    queryFn: () => base44.entities.EventRSVP.list(),
  });

  const attendeeCount = allRSVPs.filter(r => r.event_id === event.id && r.status === 'going').length;

  const rsvpMutation = useMutation({
    mutationFn: async () => {
      if (userRSVP) {
        await base44.entities.EventRSVP.delete(userRSVP.id);
      } else {
        await base44.entities.EventRSVP.create({
          event_id: event.id,
          user_email: currentUser.email,
          user_name: currentUser.full_name,
          status: 'going'
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-rsvps'] });
    },
  });

  const colorScheme = categoryColors[event.category] || categoryColors.Networking;

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all">
      {event.image_url && (
        <div className="h-48 overflow-hidden">
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge 
            className="px-3 py-1 text-xs font-semibold"
            style={{ background: colorScheme.bg, color: colorScheme.color, border: `1px solid ${colorScheme.border}` }}
          >
            {event.category}
          </Badge>
          {event.is_virtual && (
            <Badge 
              className="px-3 py-1 text-xs font-semibold flex items-center gap-1"
              style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.3)' }}
            >
              <Video className="w-3 h-3" />
              Virtual
            </Badge>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 line-clamp-2" style={{ color: '#E5EDFF' }}>
          {event.title}
        </h3>

        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#B6C4E0' }}>
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#B6C4E0' }}>
            <Calendar className="w-4 h-4" style={{ color: '#667EEA' }} />
            <span>{moment(event.date).format('MMM D, YYYY')}</span>
          </div>

          <div className="flex items-center gap-2 text-sm" style={{ color: '#B6C4E0' }}>
            <Clock className="w-4 h-4" style={{ color: '#F59E0B' }} />
            <span>{event.time} {event.end_time && `- ${event.end_time}`}</span>
          </div>

          {!event.is_virtual && event.location && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#B6C4E0' }}>
              <MapPin className="w-4 h-4" style={{ color: '#22C55E' }} />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm" style={{ color: '#B6C4E0' }}>
            <Users className="w-4 h-4" style={{ color: '#7C3AED' }} />
            <span>{attendeeCount} attending</span>
            {event.max_attendees && <span>/ {event.max_attendees} max</span>}
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={createPageUrl('EventDetail') + `?id=${event.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-xl font-semibold"
              style={{ borderColor: '#667EEA', color: '#667EEA' }}
            >
              View Details
            </Button>
          </Link>
          
          {currentUser && event.organizer_email !== currentUser.email && (
            <Button
              onClick={() => rsvpMutation.mutate()}
              disabled={rsvpMutation.isPending || (event.max_attendees && attendeeCount >= event.max_attendees && !userRSVP)}
              className="flex-1 rounded-xl font-semibold"
              style={userRSVP ? 
                { background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#fff' } :
                { background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', color: '#fff' }
              }
            >
              {userRSVP ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Going
                </>
              ) : (
                'RSVP'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}