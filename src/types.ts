export type Skill = string;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  skills: Skill[];
  location?: string;
  bio?: string;
  matchPercentage?: number;
  completedSwaps?: number;
  activeOffers?: number;
}

export interface Barter {
  id: string;
  creatorId: string;
  offering: {
    title: string;
    description: string;
    icon: string;
    hours?: number;
  };
  requesting: {
    title: string;
    description: string;
    icon: string;
    phase?: string;
  };
  mode?: 'Remote' | 'In-person';
  partner?: User; // For UI convenience
  status: 'active' | 'negotiation' | 'proposal_sent' | 'completed';
  timestamp: any; // Firestore Timestamp
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: any; // Firestore Timestamp
  isRead: boolean;
  barterId?: string;
}

export type Screen = 'welcome' | 'dashboard' | 'create-barter' | 'matches' | 'chat' | 'profile';
