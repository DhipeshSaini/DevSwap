import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical, 
  ChevronLeft,
  Info,
  Video,
  PlusCircle,
  CheckCircle2,
  Palette,
  Terminal,
  Trash2
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { BarterBridge } from './ui/BarterBridge';
import { Message, User, Screen } from '../types';
import { getDirectImageUrl } from '../lib/utils';
import { mockMessages } from '../lib/mockData';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  limit,
  or,
  deleteDoc,
  doc,
  getDocs
} from 'firebase/firestore';
import { getChatbotResponse } from '../services/geminiService';

interface ChatScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User | null;
}

export function ChatScreen({ onNavigate, user }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // For demo purposes, we'll chat with Marcus Chen
  const partner: User = {
    id: 'marcus',
    name: 'Marcus Chen',
    avatar: 'https://picsum.photos/seed/marcus/200/200',
    role: 'PRODUCT DESIGNER • UI/UX SPECIALIST',
    email: 'marcus@tech.com',
    skills: ['Python', 'AWS'],
  };

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, 'messages');
    // Filter messages where current user is either sender or receiver
    // Remove orderBy from query to ensure pending messages (with null timestamps) are included
    const q = query(
      messagesRef,
      or(
        where('senderId', '==', user.id),
        where('receiverId', '==', user.id)
      ),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const firestoreMsgs = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Message))
        .filter(m => 
          (m.senderId === user.id && m.receiverId === partner.id) || 
          (m.senderId === partner.id && m.receiverId === user.id)
        );
      
      const mappedMockMessages = mockMessages.map(m => ({
        ...m,
        receiverId: m.receiverId === 'me' ? user.id : m.receiverId,
        senderId: m.senderId === 'me' ? user.id : m.senderId
      }));

      // Combine and filter out deleted ones
      const combined = [...mappedMockMessages, ...firestoreMsgs]
        .filter(m => !deletedIds.has(m.id));
      
      // Remove duplicates by ID
      const uniqueMap = new Map<string, Message>();
      combined.forEach(m => uniqueMap.set(m.id, m));
      const unique = Array.from(uniqueMap.values());

      unique.sort((a, b) => {
        const getTime = (m: any) => {
          if (m.timestamp?.toDate) return m.timestamp.toDate().getTime();
          if (m.timestamp instanceof Date) return m.timestamp.getTime();
          // For pending messages, use current time + small offset to keep them at the bottom
          return Date.now() + 500; 
        };
        return getTime(a) - getTime(b);
      });
      
      setMessages(unique);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'messages'));

    return () => unsubscribe();
  }, [user, deletedIds]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      // 1. Send user message
      await addDoc(collection(db, 'messages'), {
        senderId: user.id,
        receiverId: partner.id,
        text: messageText,
        timestamp: serverTimestamp(),
        isRead: false,
      });

      // 2. Trigger chatbot response with a natural delay
      setIsTyping(true);
      
      // Get history for context
      const history = messages.slice(-10).map(m => ({
        role: m.senderId === user.id ? 'user' as const : 'model' as const,
        text: m.text
      }));
      
      try {
        const botResponse = await getChatbotResponse(messageText, history);
        
        // Simulate thinking time
        setTimeout(async () => {
          try {
            await addDoc(collection(db, 'messages'), {
              senderId: partner.id,
              receiverId: user.id,
              text: botResponse || "Hey! Just saw your message. Let's discuss this further.",
              timestamp: serverTimestamp(),
              isRead: false,
            });
          } catch (err) {
            console.error('Error sending bot response to Firestore:', err);
            // Fallback to local state if firestore fails
            const fallback: Message = {
              id: 'local-' + Date.now(),
              senderId: partner.id,
              receiverId: user.id,
              text: botResponse || "Hey! I'm having some trouble with my connection, but I'll get back to you!",
              timestamp: new Date(),
              isRead: false
            };
            setMessages(prev => [...prev, fallback]);
          } finally {
            setIsTyping(false);
          }
        }, 1500);
      } catch (botErr) {
        console.error('Error getting chatbot response:', botErr);
        setIsTyping(false);
        // Add a local fallback message
        const fallbackMsg: Message = {
          id: 'fallback-' + Date.now(),
          senderId: partner.id,
          receiverId: user.id,
          text: "Hey! I'm a bit busy with a design sprint right now, but I'll get back to you soon!",
          timestamp: new Date(),
          isRead: false
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }

    } catch (error) {
      setIsTyping(false);
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }
  };

  const deleteLastMessages = async () => {
    if (!user || messages.length === 0) return;
    try {
      const targets = messages.filter(m => {
        // Target messages from user that are "hi" or "hey"
        const text = m.text.toLowerCase().trim();
        const isTargetText = text === 'hi' || text === 'hey' || text === 'hello';
        return m.senderId === user.id && isTargetText;
      });

      if (targets.length === 0) return;

      // Update local deleted tracking first for immediate UI feedback
      const newDeletedIds = new Set(deletedIds);
      targets.forEach(t => newDeletedIds.add(t.id));
      setDeletedIds(newDeletedIds);

      // Delete real messages from Firestore
      const realTargets = targets.filter(m => m.id && !m.id.startsWith('m'));
      const deletePromises = realTargets.map(m => deleteDoc(doc(db, 'messages', m.id!)));
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };

  const deleteSingleMessage = async (messageId: string) => {
    try {
      // Update local deleted tracking first
      const newDeletedIds = new Set(deletedIds);
      newDeletedIds.add(messageId);
      setDeletedIds(newDeletedIds);

      // Delete from Firestore if it's a real message
      if (!messageId.startsWith('m')) {
        await deleteDoc(doc(db, 'messages', messageId));
      }
    } catch (error) {
      console.error('Error deleting single message:', error);
    }
  };

  if (!user) return null;

  return (
    <main className="h-screen flex flex-col bg-[#FDFDFD] overflow-hidden">
      {/* Header */}
      <header className="bg-white px-6 h-20 flex items-center justify-between border-b border-outline-variant/5 z-10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onNavigate('dashboard')} 
            className="text-on-surface border border-outline-variant/20 rounded-full w-10 h-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={getDirectImageUrl(partner.avatar)}
                alt={partner.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random&size=100`;
                }}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full" />
            </div>
            <div>
              <h2 className="font-bold text-on-surface text-[15px]">{partner.name}</h2>
              <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider">{partner.role}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={deleteLastMessages} title="Delete 'hi/hey' messages" className="text-error/60 hover:text-error">
            <Info className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-on-surface-variant/80">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-on-surface-variant/80">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        <div className="flex justify-center py-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 bg-[#F1F3F4] px-4 py-1.5 rounded-full">Today</span>
        </div>

        {messages.map((message, i) => {
          const isMe = message.senderId === user.id;
          const showBridge = i === 1; 
          const prevMessage = i > 0 ? messages[i-1] : null;
          const showAvatar = !isMe && (!prevMessage || prevMessage.senderId !== message.senderId);

          return (
            <React.Fragment key={message.id || i}>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-start gap-3`}
              >
                {!isMe && (
                  <div className="w-8 flex-shrink-0">
                    {showAvatar ? (
                      <img 
                        src={getDirectImageUrl(partner.avatar)} 
                        className="w-8 h-8 rounded-full object-cover mt-6" 
                        alt="" 
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                  </div>
                )}
                <div className={`max-w-[70%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'} group relative`}>
                  <div className={`px-5 py-3.5 rounded-[18px] text-[14px] leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-[#6366F1] text-white' 
                      : 'bg-white text-on-surface border border-outline-variant/10'
                  }`}>
                    {message.text}
                    
                    {/* Individual Delete Button */}
                    <button 
                      onClick={() => deleteSingleMessage(message.id!)}
                      className={`absolute ${isMe ? '-left-8' : '-right-8'} top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white shadow-md border border-outline-variant/10 opacity-0 group-hover:opacity-100 transition-opacity text-error/60 hover:text-error hover:scale-110`}
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className={`flex items-center gap-1.5 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-on-surface-variant/40 font-bold uppercase">
                      {message.timestamp?.toDate ? message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now')}
                    </span>
                    {isMe && <CheckCircle2 className="w-3 h-3 text-[#6366F1]" />}
                  </div>
                </div>
              </motion.div>

              {showBridge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-4"
                >
                  <Card className="p-6 bg-[#F8F9FA] border-outline-variant/5 rounded-[24px]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/40">You Offer</p>
                          <h4 className="font-bold text-on-surface text-sm">React Dashboard Implementation</h4>
                        </div>
                      </div>

                      <div className="flex-1 flex items-center gap-2 px-4">
                        <div className="h-[1px] flex-1 bg-outline-variant/20" />
                        <div className="w-2 h-2 rounded-full border border-outline-variant/30" />
                        <div className="h-[1px] flex-1 bg-outline-variant/20" />
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/40">Marcus Offers</p>
                          <h4 className="font-bold text-on-surface text-sm">Design System & Branding</h4>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                          <Palette className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 pt-2"
          >
            <div className="flex gap-1 px-1">
              <div className="w-1.5 h-1.5 bg-on-surface-variant/20 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-on-surface-variant/20 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-on-surface-variant/20 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[11px] font-medium text-on-surface-variant/40">Marcus is typing...</span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <footer className="p-6 bg-white">
        <form 
          onSubmit={handleSendMessage}
          className="flex items-center gap-4"
        >
          <Button variant="ghost" size="icon" type="button" className="text-on-surface-variant/60 hover:text-[#6366F1]">
            <PlusCircle className="w-6 h-6" />
          </Button>
          <div className="flex-1 flex items-center gap-3 bg-[#F1F3F4] rounded-[32px] px-6 py-1.5">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] font-medium py-2.5 text-on-surface placeholder:text-on-surface-variant/40"
            />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" type="button" className="text-on-surface-variant/40 hover:text-[#6366F1]">
                <Smile className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-[#6366F1] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4 rotate-[-45deg] translate-x-0.5 -translate-y-0.5" />
              </Button>
            </div>
          </div>
        </form>
      </footer>
    </main>
  );
}
