import { Bell, LogOut } from 'lucide-react';
import { User, Screen } from '../types';
import { getDirectImageUrl } from '../lib/utils';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface NavbarProps {
  onNavigate: (screen: Screen) => void;
  currentScreen: Screen;
  user: User | null;
}

export function Navbar({ onNavigate, currentScreen, user }: NavbarProps) {
  const navItems: { label: string; screen: Screen }[] = [
    { label: 'Home', screen: 'dashboard' },
    { label: 'Matches', screen: 'matches' },
    { label: 'Chat', screen: 'chat' },
    { label: 'Profile', screen: 'profile' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white/80 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-outline-variant/10">
      <div className="flex items-center justify-between px-6 h-16 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/10">
            <img
              key={user.avatar ? user.avatar.slice(0, 50) : 'nav-avatar'}
              alt="User profile"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              src={getDirectImageUrl(user.avatar)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=100`;
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
            />
          </div>
          <span className="text-xl font-bold tracking-tighter text-on-surface font-headline">Devswap</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`text-sm font-medium transition-colors ${
                currentScreen === item.screen
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant/60 active:scale-95 duration-200">
            <Bell className="w-5 h-5" />
          </button>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 transition-colors text-error/60 active:scale-95 duration-200"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
