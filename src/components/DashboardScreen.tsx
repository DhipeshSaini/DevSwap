import { motion } from 'motion/react';
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  Handshake, 
  Search, 
  ClipboardList,
  Brush,
  Code,
  Edit3,
  Database
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Chip } from './ui/Chip';
import { Barter, Screen, User } from '../types';
import { cn, getDirectImageUrl } from '../lib/utils';
import { mockBarters } from '../lib/mockData';

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User | null;
  barters: Barter[];
}

export function DashboardScreen({ onNavigate, user, barters: firestoreBarters }: DashboardScreenProps) {
  if (!user) return null;

  // Use mock data if firestore is empty for demo purposes
  const barters = firestoreBarters.length > 0 ? firestoreBarters : mockBarters.map(b => ({ ...b, creatorId: user.id }));

  const stats = [
    { label: 'Active Offers', value: '07', icon: ClipboardList, badge: '+2 this week' },
    { label: 'Active Needs', value: '03', icon: Search, badge: 'Updated 2h ago' },
    { label: 'Completed Swaps', value: '26', icon: Handshake, badge: 'Lifetime value' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
      {/* Welcome Section */}
      <section className="mb-12 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Workspace Overview</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface font-headline">
            Welcome back, {user.name}
          </h1>
          <p className="text-on-surface-variant mt-3 max-w-2xl leading-relaxed">
            Your creative exchange is flourishing. You have 3 new match requests waiting for your review today.
          </p>
        </motion.div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 flex flex-col justify-between h-full group hover:translate-y-[-4px] transition-all duration-300">
              <div>
                <stat.icon className="text-primary w-8 h-8 mb-4" />
                <h3 className="text-on-surface-variant font-medium">{stat.label}</h3>
              </div>
              <div className="mt-8 flex items-end justify-between">
                <span className="text-5xl font-bold tracking-tighter">{stat.value}</span>
                <span className={cn(
                  "text-xs font-semibold px-3 py-1 rounded-full",
                  stat.badge.includes('+') ? "bg-primary-container/30 text-primary" : "text-on-surface-variant"
                )}>
                  {stat.badge}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Barters Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight font-headline">Recent Barters</h2>
            <Button variant="tertiary" size="sm">View All Activity</Button>
          </div>

          <div className="space-y-6">
            {barters.length > 0 ? barters.map((barter, i) => (
              <div key={barter.id}>
                <BarterCard barter={barter} index={i} />
              </div>
            )) : (
              <p className="text-on-surface-variant text-center py-8">No recent barters found. Start by posting one!</p>
            )}
          </div>
        </div>

        {/* Side Column: My Skills */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8 bg-surface-container-low ghost-border">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold tracking-tight font-headline">My Skills</h2>
                <Button variant="ghost" size="icon" onClick={() => onNavigate('profile')}>
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(user.skills.length > 0 ? user.skills : ['UI/UX Design', 'Brand Identity', 'Motion Graphics', 'Figma', 'Graphic Design', 'Project Management', 'Team Leadership', 'Content Strategy']).map((skill) => (
                  <Chip key={skill}>{skill}</Chip>
                ))}
                <button 
                  onClick={() => onNavigate('profile')}
                  className="px-4 py-2 border border-dashed border-outline-variant rounded-full text-sm font-medium text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                >
                  + Add Skill
                </button>
              </div>

              <div className="mt-12">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Profile Strength</h3>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] rounded-full" />
                </div>
                <p className="text-xs text-on-surface-variant mt-2">85% — Add a portfolio link to reach 100%</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-8 bg-primary text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-primary-container/80 text-sm mb-6 leading-relaxed">
                  Get unlimited barter listings and priority matching in the ecosystem.
                </p>
                <Button className="bg-white text-primary hover:bg-white/90">
                  Learn More
                </Button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary-dim rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-50" />
            </Card>
          </motion.div>
        </div>
      </div>

      {/* FAB: Post a Barter */}
      <Button 
        size="lg" 
        className="fixed right-6 bottom-24 md:bottom-10 z-40 px-8 py-6 rounded-3xl shadow-2xl"
        onClick={() => onNavigate('create-barter')}
      >
        <Plus className="w-6 h-6 mr-3" />
        Post a Barter
      </Button>
    </main>
  );
}

function BarterCard({ barter, index }: { barter: Barter; index: number }) {
  const IconOffer = barter.offering.icon === 'brush' ? Brush : Edit3;
  const IconNeed = barter.requesting.icon === 'code' ? Code : Database;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-4">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-container p-2 rounded-xl">
                  <IconOffer className="text-primary w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Offering</span>
              </div>
              <h4 className="text-xl font-bold mb-2 font-headline">{barter.offering.title}</h4>
              <p className="text-on-surface-variant text-sm">{barter.offering.description}</p>
            </div>

            <div className="flex flex-row md:flex-col items-center justify-center gap-2">
              <div className="h-[1px] w-12 md:w-[1px] md:h-12 bg-outline-variant/30" />
              <div className="bg-surface-bright border border-outline-variant/20 p-3 rounded-full shadow-sm">
                <TrendingUp className="text-primary w-5 h-5 animate-pulse" />
              </div>
              <div className="h-[1px] w-12 md:w-[1px] md:h-12 bg-outline-variant/30" />
            </div>

            <div className="flex-1 w-full md:text-right">
              <div className="flex items-center md:justify-end gap-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Requesting</span>
                <div className="bg-tertiary-container p-2 rounded-xl">
                  <IconNeed className="text-tertiary w-5 h-5" />
                </div>
              </div>
              <h4 className="text-xl font-bold mb-2 font-headline">{barter.requesting.title}</h4>
              <p className="text-on-surface-variant text-sm">{barter.requesting.description}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {barter.partner && (
              <>
                <img 
                  alt={barter.partner.name} 
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover" 
                  src={getDirectImageUrl(barter.partner.avatar)} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(barter.partner?.name || 'User')}&background=random&size=50`;
                  }}
                />
                <span className="text-sm font-medium">Trading with {barter.partner.name}</span>
              </>
            )}
          </div>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
            barter.status === 'negotiation' ? "text-primary" : "text-on-surface-variant"
          )}>
            {barter.status.replace('_', ' ')}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
