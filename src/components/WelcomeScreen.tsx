import { motion } from 'motion/react';
import { Code, Palette, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { BarterBridge } from './ui/BarterBridge';

interface WelcomeScreenProps {
  onLogin: () => void;
}

export function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  return (
    <main className="relative min-h-screen flex flex-col md:flex-row items-center justify-center p-6 md:p-12 overflow-hidden">
      {/* Background Tonal Depth */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-tertiary-container/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Column: Visual Anchor */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-6 lg:col-span-7 flex flex-col items-start space-y-8 order-2 md:order-1"
        >
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-surface-container-low group ambient-shadow">
            <img
              alt="Collaboration"
              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzi1B7K40-tI8v5-LfRv0V03_R4LZEH8cT3NU2ohawRX9ZdsVch6WMbtvhRi1oadYwmmb6HAhbR1Qm8Tq2gcAETKuVKImGHmLg0YFiUpXwR4QnvSHx6x6AGhQFrlc982qvfzWmxGpujF1YtbTUS9AQBemUuLj9YnQkkC-w3FIduZyIZRMBEkEKaCar74KL2JoTbBVNHb68OqJq0CN8oxGb2bO_abSEoEsK9f1-7viZ6PZwtVnkigK7Qlhjbn_-TdGkLptKyjA-qfE"
            />
            
            <div className="absolute bottom-8 left-8 right-8">
              <BarterBridge 
                offering={{ title: 'Fullstack Dev', icon: <Code className="w-5 h-5" /> }}
                requesting={{ title: 'UI/UX Design', icon: <Palette className="w-5 h-5" /> }}
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-outline-variant/60">
            <span className="text-xs font-bold tracking-tighter uppercase">Trusted by 5,000+ creatives</span>
            <div className="h-[1px] w-24 bg-outline-variant/20" />
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-surface object-cover"
                  src={`https://picsum.photos/seed/user${i}/100/100`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Login Interface */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:col-span-6 lg:col-span-5 flex flex-col space-y-12 order-1 md:order-2"
        >
          <header className="space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container/50 border border-primary/10">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">v2.0 Beta Now Live</span>
            </div>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface leading-none">
              Devswap
            </h1>
            <p className="text-xl text-on-surface-variant font-light max-w-sm">
              Exchange Skills. Build Together. <br className="hidden md:block" />
              <span className="text-primary font-medium">No money, just talent.</span>
            </p>
          </header>

          <div className="space-y-6">
            <div className="space-y-4">
              <Button variant="secondary" className="w-full h-14 ghost-border bg-white" onClick={onLogin}>
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5 mr-3" alt="Google" />
                Continue with Google
              </Button>

              <div className="relative flex items-center">
                <div className="flex-grow h-[1px] bg-outline-variant/20" />
                <span className="mx-4 text-[10px] font-bold text-outline uppercase tracking-widest">or email</span>
                <div className="flex-grow h-[1px] bg-outline-variant/20" />
              </div>

              <div className="space-y-4">
                <Input label="Email Address" placeholder="alex@studio.com" type="email" />
                <Button className="w-full h-14 text-lg" onClick={onLogin}>
                  Sign In to Atelier
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-outline">
              New here? <a href="#" className="text-primary font-semibold hover:underline underline-offset-4">Request an invite</a>
            </p>
          </div>

          <footer className="pt-8 flex flex-wrap gap-x-8 gap-y-2 opacity-40">
            {['Terms', 'Privacy', 'Community Guidelines'].map((link) => (
              <a key={link} href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-100 transition-opacity">
                {link}
              </a>
            ))}
          </footer>
        </motion.div>
      </div>

      {/* Floating Contextual Chip */}
      <div className="fixed top-8 right-8 hidden lg:block z-50">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="glass-effect px-5 py-3 rounded-full border border-outline-variant/10 ambient-shadow flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-on-surface-variant">142 Developers seeking Design today</span>
        </motion.div>
      </div>
    </main>
  );
}
