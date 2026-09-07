import { Home, Handshake, MessageCircle, User } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  onNavigate: (screen: Screen) => void;
  currentScreen: Screen;
}

export function BottomNav({ onNavigate, currentScreen }: BottomNavProps) {
  const navItems = [
    { icon: Home, label: 'Home', screen: 'dashboard' as Screen },
    { icon: Handshake, label: 'Matches', screen: 'matches' as Screen },
    { icon: MessageCircle, label: 'Chat', screen: 'chat' as Screen },
    { icon: User, label: 'Profile', screen: 'profile' as Screen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-3xl bg-white/80 backdrop-blur-xl shadow-[0_-4px_24px_rgba(45,52,53,0.04)]">
      <div className="flex justify-around items-center h-20 pb-safe px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-col items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'text-primary bg-primary-container/30 rounded-full px-4 py-1 scale-110'
                  : 'text-outline hover:scale-110'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
