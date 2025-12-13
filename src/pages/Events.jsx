import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Sidebar from "@/components/partnerships/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import EventCard from "@/components/events/EventCard";
import CreateEventDialog from "@/components/events/CreateEventDialog";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, Search, MapPin, Video, Users } from "lucide-react";

export default function Events() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  React.useEffect(() => {
    base44.auth.me().then(user => setCurrentUser(user)).catch(() => setCurrentUser(null));
  }, []);

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date'),
  });

  const { data: rsvps = [] } = useQuery({
    queryKey: ['event-rsvps'],
    queryFn: () => base44.entities.EventRSVP.list(),
  });

  const myRSVPs = rsvps.filter(r => r.user_email === currentUser?.email);
  const myEventIds = myRSVPs.map(r => r.event_id);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "my-events") return matchesSearch && myEventIds.includes(event.id);
    if (activeTab === "organizing") return matchesSearch && event.organizer_email === currentUser?.email;
    if (activeTab === "virtual") return matchesSearch && event.is_virtual;
    if (activeTab === "in-person") return matchesSearch && !event.is_virtual;
    return matchesSearch;
  });

  const stats = {
    total: events.length,
    myEvents: myEventIds.length,
    organizing: events.filter(e => e.organizer_email === currentUser?.email).length,
    virtual: events.filter(e => e.is_virtual).length,
  };

  return (
    <div className="flex min-h-screen bg-gradient-main">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#E5EDFF' }}>Events</h1>
              <p className="text-lg" style={{ color: '#B6C4E0' }}>
                Discover and join industry events
              </p>
            </div>
            {currentUser && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="gap-2 px-6 py-3 rounded-xl font-semibold"
                style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', color: '#fff' }}
              >
                <Plus className="w-5 h-5" />
                Create Event
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5" style={{ color: '#667EEA' }} />
                <p className="text-sm font-medium" style={{ color: '#B6C4E0' }}>Total Events</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#E5EDFF' }}>{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5" style={{ color: '#22C55E' }} />
                <p className="text-sm font-medium" style={{ color: '#B6C4E0' }}>My Events</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#E5EDFF' }}>{stats.myEvents}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Video className="w-5 h-5" style={{ color: '#3B82F6' }} />
                <p className="text-sm font-medium" style={{ color: '#B6C4E0' }}>Virtual</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#E5EDFF' }}>{stats.virtual}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5" style={{ color: '#F59E0B' }} />
                <p className="text-sm font-medium" style={{ color: '#B6C4E0' }}>Organizing</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#E5EDFF' }}>{stats.organizing}</p>
            </motion.div>
          </div>

          {/* Search */}
          <div className="glass-card p-4 mb-6 rounded-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#7A8BA6' }} />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-12 h-12"
                style={{ color: '#E5EDFF' }}
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="glass-card p-2 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <TabsTrigger 
                value="all" 
                className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#667EEA] data-[state=active]:text-white" 
                style={{ color: '#B6C4E0' }}
              >
                All Events
              </TabsTrigger>
              <TabsTrigger 
                value="my-events" 
                className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#22C55E] data-[state=active]:text-white" 
                style={{ color: '#B6C4E0' }}
              >
                My Events
              </TabsTrigger>
              <TabsTrigger 
                value="organizing" 
                className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#F59E0B] data-[state=active]:text-white" 
                style={{ color: '#B6C4E0' }}
              >
                Organizing
              </TabsTrigger>
              <TabsTrigger 
                value="virtual" 
                className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white" 
                style={{ color: '#B6C4E0' }}
              >
                Virtual
              </TabsTrigger>
              <TabsTrigger 
                value="in-person" 
                className="rounded-xl px-5 py-3 font-semibold text-sm transition-all data-[state=active]:shadow-lg data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white" 
                style={{ color: '#B6C4E0' }}
              >
                In-Person
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-16 rounded-2xl text-center"
            >
              <Calendar className="w-20 h-20 mx-auto mb-4" style={{ color: '#667EEA', opacity: 0.5 }} />
              <p className="text-lg font-medium" style={{ color: '#B6C4E0' }}>No events found</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard 
                      event={event} 
                      currentUser={currentUser}
                      userRSVP={myRSVPs.find(r => r.event_id === event.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <CreateEventDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        currentUser={currentUser}
      />
    </div>
  );
}