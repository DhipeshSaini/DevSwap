import { motion } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  FileText, 
  Share2, 
  Info,
  ChevronDown
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import React, { useState, FormEvent } from 'react';
import { User, Screen } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CreateBarterScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User | null;
}

export function CreateBarterScreen({ onNavigate, user }: CreateBarterScreenProps) {
  const [phase, setPhase] = useState('Ideation');
  const [mode, setMode] = useState<'Remote' | 'In-person'>('Remote');
  const [expertise, setExpertise] = useState('UI/UX Design');
  const [skillRequired, setSkillRequired] = useState('Backend Development');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const barterData = {
        creatorId: user.id,
        offering: {
          title: expertise,
          description: `Expertise in ${expertise}`,
          icon: expertise.includes('Design') ? 'brush' : 'code',
          hours: Number(hours) || 0,
        },
        requesting: {
          title: skillRequired,
          description: description || `Seeking ${skillRequired} for ${phase} phase`,
          icon: skillRequired.includes('Backend') ? 'database' : 'code',
          phase: phase,
        },
        mode: mode,
        status: 'active',
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'barters'), barterData);
      onNavigate('dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'barters');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 px-6 max-w-4xl mx-auto pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <span className="text-primary font-bold text-[11px] font-headline uppercase tracking-[0.2em] mb-3 block">New Collaboration</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-4 font-headline">Create Barter</h1>
        <p className="text-on-surface-variant max-w-xl leading-relaxed">
          Exchange your expertise for the skills you need. Define your terms and start building together.
        </p>
      </motion.div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* I Offer Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight font-headline">I Offer</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Expertise</label>
                  <div className="relative">
                    <select 
                      value={expertise}
                      onChange={(e) => setExpertise(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none transition-all font-medium"
                    >
                      <option>UI/UX Design</option>
                      <option>Frontend Development</option>
                      <option>Graphic Design</option>
                      <option>Technical Writing</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Commitment (Hours)</label>
                  <Input 
                    placeholder="e.g. 10" 
                    type="number" 
                    className="bg-surface-container-low border-none" 
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* I Need Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <Search className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight font-headline">I Need</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Skill Required</label>
                  <div className="relative">
                    <select 
                      value={skillRequired}
                      onChange={(e) => setSkillRequired(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none transition-all font-medium"
                    >
                      <option>Backend Development</option>
                      <option>Mobile App (Flutter/RN)</option>
                      <option>Database Architect</option>
                      <option>DevOps / AWS</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Project Phase</label>
                  <div className="flex gap-2">
                    {['Ideation', 'MVP', 'Scaling'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPhase(p)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          phase === p 
                            ? 'bg-secondary-container text-on-secondary-container shadow-sm' 
                            : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Project Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight font-headline">Project Context</h2>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Tell us about the project</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant resize-none font-medium" 
                  placeholder="Briefly describe what you're building and how the barter will help..." 
                  rows={4}
                />
              </div>
            </Card>
          </motion.div>

          {/* Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2"
          >
            <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 ghost-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold font-headline">Collaboration Mode</h3>
                  <p className="text-sm text-on-surface-variant">Choose how you prefer to work</p>
                </div>
              </div>
              <div className="bg-surface-container-highest p-1 rounded-full flex gap-1 w-full md:w-auto">
                {['Remote', 'In-person'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m as any)}
                    className={`flex-1 md:flex-none px-8 py-2 rounded-full text-sm font-bold transition-all ${
                      mode === m 
                        ? 'bg-white text-primary shadow-sm' 
                        : 'text-on-surface-variant hover:bg-white/50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <Info className="w-4 h-4" />
            <span>Your barter will be visible to matched specialists instantly.</span>
          </div>
          <Button size="lg" className="w-full md:w-auto px-12" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Barter'}
          </Button>
        </div>
      </form>
    </main>
  );
}
