import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Sidebar from "@/components/partnerships/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Video, Users, CheckCircle, ExternalLink, User } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EventDetail() {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const eventId = urlParams.get('id');
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(user => setCurrentUser(user)).catch(() => setCurrentUser(null));
  }, []);

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list(),
  });

  const { data: rsvps = [] } = useQuery({
    queryKey: ['event-rsvps'],
    queryFn: () => base44.entities.EventRSVP.list(),
  });

  const event = events.find(e => e.id === eventId);
  const eventRSVPs = rsvps.filter(r => r.event_id === eventId && r.status === 'going');
  const userRSVP = rsvps.find(r => r.event_id === eventId && r.user_email === currentUser?.email);

  const rsvpMutation = useMutation({
    mutationFn: async () => {
      if (userRSVP) {
        await base44.entities.EventRSVP.delete(userRSVP.id);
      } else {
        await base44.entities.EventRSVP.create({
          event_id: eventId,
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

  if (!event) {
    return (
      <div className="flex min-h-screen bg-gradient-main">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: '#B6C4E0' }}>Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-main">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {event.image_url && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl overflow-hidden mb-8 h-96"
            >
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-8 rounded-2xl mb-8"
              >
                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge className="px-3 py-1 text-sm font-semibold" style={{ background: 'rgba(102, 126, 234, 0.15)', color: '#667EEA', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
                    {event.category}
                  </Badge>
                  {event.is_virtual && (
                    <Badge className="px-3 py-1 text-sm font-semibold flex items-center gap-1" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                      <Video className="w-4 h-4" />
                      Virtual Event
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-4" style={{ color: '#E5EDFF' }}>{event.title}</h1>
                
                <p className="text-lg leading-relaxed mb-6" style={{ color: '#B6C4E0' }}>{event.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                    <Calendar className="w-6 h-6" style={{ color: '#667EEA' }} />
                    <div>
                      <p className="text-xs font-bold uppercase" style={{ color: '#7A8BA6' }}>Date</p>
                      <p className="text-lg font-semibold" style={{ color: '#E5EDFF' }}>{moment(event.date).format('MMMM D, YYYY')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <Clock className="w-6 h-6" style={{ color: '#F59E0B' }} />
                    <div>
                      <p className="text-xs font-bold uppercase" style={{ color: '#7A8BA6' }}>Time</p>
                      <p className="text-lg font-semibold" style={{ color: '#E5EDFF' }}>
                        {event.time} {event.end_time && `- ${event.end_time}`}
                      </p>
                    </div>
                  </div>

                  {event.is_virtual ? (
                    event.virtual_link && (
                      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <Video className="w-6 h-6" style={{ color: '#3B82F6' }} />
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase mb-1" style={{ color: '#7A8BA6' }}>Virtual Link</p>
                          <a href={event.virtual_link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold flex items-center gap-2 hover:underline" style={{ color: '#3B82F6' }}>
                            Join Event <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )
                  ) : (
                    event.location && (
                      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                        <MapPin className="w-6 h-6" style={{ color: '#22C55E' }} />
                        <div>
                          <p className="text-xs font-bold uppercase" style={{ color: '#7A8BA6' }}>Location</p>
                          <p className="text-lg font-semibold" style={{ color: '#E5EDFF' }}>{event.location}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8 rounded-2xl"
              >
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#E5EDFF' }}>Attendees ({eventRSVPs.length})</h2>
                {eventRSVPs.length === 0 ? (
                  <p style={{ color: '#B6C4E0' }}>No attendees yet. Be the first to RSVP!</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {eventRSVPs.map((rsvp) => (
                      <div key={rsvp.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
                          <User className="w-5 h-5" style={{ color: '#E5EDFF' }} />
                        </div>
                        <p className="text-sm font-semibold truncate" style={{ color: '#E5EDFF' }}>{rsvp.user_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            <div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card p-6 rounded-2xl sticky top-8"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6" style={{ color: '#7C3AED' }} />
                    <div>
                      <p className="text-sm" style={{ color: '#B6C4E0' }}>Attendees</p>
                      <p className="text-2xl font-bold" style={{ color: '#E5EDFF' }}>
                        {eventRSVPs.length}
                        {event.max_attendees && ` / ${event.max_attendees}`}
                      </p>
                    </div>
                  </div>

                  {currentUser && event.organizer_email !== currentUser.email && (
                    <Button
                      onClick={() => rsvpMutation.mutate()}
                      disabled={rsvpMutation.isPending || (event.max_attendees && eventRSVPs.length >= event.max_attendees && !userRSVP)}
                      className="w-full rounded-xl font-semibold py-6 text-lg"
                      style={userRSVP ? 
                        { background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#fff' } :
                        { background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', color: '#fff' }
                      }
                    >
                      {userRSVP ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          You're Going!
                        </>
                      ) : (
                        'RSVP to Event'
                      )}
                    </Button>
                  )}
                </div>

                <div className="pt-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <p className="text-sm font-bold mb-3" style={{ color: '#B6C4E0' }}>Organized by</p>
                  <p className="text-lg font-semibold" style={{ color: '#E5EDFF' }}>{event.organizer_name}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}