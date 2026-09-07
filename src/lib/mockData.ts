import { User, Barter, Message } from '../types';

export const currentUser: User = {
  id: 'me',
  name: 'Dhipesh',
  email: 'kdhipeshsaini@gmail.com',
  avatar: 'https://picsum.photos/seed/dhipesh/200/200',
  role: 'Fullstack Dev',
  skills: ['UI/UX Design', 'Frontend Dev', 'React.js', 'Tailwind CSS', 'Figma', 'User Research'],
};

export const mockPartners: User[] = [
  {
    id: 'sarah',
    name: 'Sarah Chen',
    email: 'sarah@design.com',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    role: 'Senior UI Designer',
    location: 'SF',
    skills: ['JS', 'TS', 'UX'],
    matchPercentage: 98,
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    email: 'marcus@tech.com',
    avatar: 'https://picsum.photos/seed/marcus/200/200',
    role: 'Backend Architect',
    location: 'Berlin',
    skills: ['Python', 'AWS'],
    matchPercentage: 85,
  },
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    email: 'elena@growth.com',
    avatar: 'https://picsum.photos/seed/elena/200/200',
    role: 'Product Growth',
    location: 'Madrid',
    skills: ['Analytics'],
    matchPercentage: 72,
  },
];

export const mockBarters: Barter[] = [
  {
    id: 'b1',
    creatorId: 'me',
    offering: {
      title: 'Custom UI Design',
      description: 'Mobile app high-fidelity wireframes and prototyping.',
      icon: 'brush',
    },
    requesting: {
      title: 'React Integration',
      description: 'Implementation of API endpoints and state management.',
      icon: 'code',
    },
    partner: mockPartners[0],
    status: 'negotiation',
    timestamp: new Date(),
  },
  {
    id: 'b2',
    creatorId: 'me',
    offering: {
      title: 'Copywriting',
      description: 'Technical blog posts and landing page optimization.',
      icon: 'edit_note',
    },
    requesting: {
      title: 'PostgreSQL Setup',
      description: 'Database architecture and query performance tuning.',
      icon: 'database',
    },
    partner: mockPartners[1],
    status: 'proposal_sent',
    timestamp: new Date(),
  },
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'marcus',
    receiverId: 'me',
    text: 'Hey there! I saw your recent work on the fintech dashboard. Your data visualization skills are exactly what I need for my current project.',
    timestamp: new Date(new Date().setHours(9, 42)),
    isRead: true,
  },
  {
    id: 'm2',
    senderId: 'me',
    receiverId: 'marcus',
    text: "Thanks Marcus! I've been looking to collaborate with a designer of your caliber. I'm definitely interested. What did you have in mind for the swap?",
    timestamp: new Date(new Date().setHours(9, 45)),
    isRead: true,
  },
  {
    id: 'm3',
    senderId: 'marcus',
    receiverId: 'me',
    text: "That sounds perfect. I'm building a specialized atelier platform and I've got the Figma files ready for a 4-page scope. I need those turned into performant React components.",
    timestamp: new Date(new Date().setHours(10, 2)),
    isRead: true,
  },
  {
    id: 'm4',
    senderId: 'marcus',
    receiverId: 'me',
    text: 'In exchange, I can handle your full branding suite and the design system we discussed. Does that sound fair?',
    timestamp: new Date(new Date().setHours(10, 2)),
    isRead: false,
  },
];
