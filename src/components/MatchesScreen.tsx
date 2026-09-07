import { motion } from 'motion/react';
import { Sparkles, Handshake, RefreshCw } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Chip } from './ui/Chip';
import { mockPartners } from '../lib/mockData';
import { User } from '../types';
import { cn, getDirectImageUrl } from '../lib/utils';

import { Screen } from '../types';

interface MatchesScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function MatchesScreen({ onNavigate }: MatchesScreenProps) {
  return (
    <main className="pt-24 px-6 max-w-3xl mx-auto pb-24">
      {/* Header Section */}
      <section className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Matches</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary-container rounded-full">
              AI Powered
            </span>
          </div>
          <p className="text-on-surface-variant max-w-md leading-relaxed">
            Discovery is curated based on your current project needs and tech stack expertise.
          </p>
        </motion.div>
      </section>

      {/* Tabs */}
      <div className="flex gap-8 mb-8 overflow-x-auto scrollbar-hide border-b border-outline-variant/10">
        <button className="pb-4 text-sm font-bold text-primary border-b-2 border-primary transition-all">
          Suggested
        </button>
        <button className="pb-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all">
          Requests
          <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 bg-surface-container-highest text-[10px] rounded-full">3</span>
        </button>
      </div>

      {/* Matches List */}
      <div className="space-y-6">
        {mockPartners.map((partner, i) => (
          <div key={partner.id}>
            <MatchCard partner={partner} index={i} onNavigate={onNavigate} />
          </div>
        ))}
      </div>

      {/* Empty State Hint */}
      <div className="mt-12 text-center py-10 opacity-50">
        <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin-slow" />
        <p className="text-sm font-medium">New matches added every 24 hours</p>
      </div>
    </main>
  );
}

function MatchCard({ partner, index, onNavigate }: { partner: User; index: number; onNavigate: (screen: Screen) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                alt={partner.name} 
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover ambient-shadow" 
                src={getDirectImageUrl(partner.avatar)} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random&size=150`;
                }}
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                {partner.matchPercentage}%
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface font-headline">{partner.name}</h3>
              <p className="text-sm text-on-surface-variant">{partner.role} • {partner.location}</p>
            </div>
          </div>
          {partner.matchPercentage && partner.matchPercentage > 90 && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter text-on-tertiary-container bg-tertiary-container px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3 fill-on-tertiary-container" />
              Perfect Match
            </span>
          )}
        </div>

        {/* Barter Bridge Concept (Simplified for Card) */}
        <div className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between mb-6 relative overflow-hidden">
          <div className="z-10">
            <p className="text-[10px] font-bold uppercase text-on-surface-variant mb-1">Offers</p>
            <p className="text-sm font-bold">Design Systems & Figma</p>
          </div>
          <div className="flex-1 px-4 flex justify-center items-center">
            <div className="h-[2px] w-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-primary/10 shadow-sm">
                <Handshake className="text-primary w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="text-right z-10">
            <p className="text-[10px] font-bold uppercase text-on-surface-variant mb-1">Needs</p>
            <p className="text-sm font-bold">React Hooks Architecture</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {partner.skills.map((skill, i) => (
              <div 
                key={skill} 
                className={cn(
                  "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm",
                  i === 0 ? "bg-secondary-container" : i === 1 ? "bg-primary-container" : "bg-tertiary-container"
                )}
              >
                {skill}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="px-4" onClick={() => onNavigate('profile')}>
              Profile
            </Button>
            <Button variant="primary" size="sm" className="px-6" onClick={() => onNavigate('chat')}>
              Chat
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
