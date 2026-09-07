import { useState, useEffect } from 'react';
import { Screen, User, Barter, Message } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { CreateBarterScreen } from './components/CreateBarterScreen';
import { MatchesScreen } from './components/MatchesScreen';
import { ChatScreen } from './components/ChatScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AnimatePresence, motion } from 'motion/react';
import { auth, db, signInWithGoogle, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, collection, query, orderBy, getDocFromServer } from 'firebase/firestore';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [barters, setBarters] = useState<Barter[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Test connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (user && currentScreen === 'welcome') {
      setCurrentScreen('dashboard');
    }
  }, [user, currentScreen]);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    let unsubBarters: (() => void) | null = null;

    const cleanupListeners = () => {
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }
      if (unsubBarters) {
        unsubBarters();
        unsubBarters = null;
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid);
      cleanupListeners();

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen for user profile changes
        unsubProfile = onSnapshot(userRef, (docSnap) => {
          console.log('User profile snapshot:', docSnap.exists());
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            
            // Migration: If user has 'React.js' and is 'Creative Professional', update to new skills and bio
            if (userData.role === 'Creative Professional' && userData.skills.includes('React.js')) {
              const updatedSkills = ['UI/UX Design', 'Brand Identity', 'Motion Graphics', 'Figma', 'Graphic Design', 'Project Management', 'Team Leadership', 'Content Strategy'];
              const updatedBio = userData.bio.includes('8 years') 
                ? userData.bio.replace('8 years', '3 years') 
                : 'Multi-disciplinary Creative Professional with over 3 years of experience in Brand Identity, UI/UX Design, and Motion Graphics. I help brands tell their stories through compelling visual narratives.';
              
              updateDoc(userRef, { 
                skills: updatedSkills, 
                bio: updatedBio,
                location: userData.location === 'Remote / London' ? 'Remote / INDIA' : userData.location
              }).catch(err => console.error('Migration error:', err));
            }
            
            setUser(userData);
          } else {
            console.log('Creating new user profile for:', firebaseUser.uid);
            // Initialize new user profile
            const newUser: User = {
              id: firebaseUser.uid,
              name: 'Dhipesh',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200/200`,
              role: 'Creative Professional',
              skills: ['UI/UX Design', 'Brand Identity', 'Motion Graphics', 'Figma', 'Graphic Design', 'Project Management', 'Team Leadership', 'Content Strategy'],
              bio: 'Multi-disciplinary Creative Professional with over 3 years of experience in Brand Identity, UI/UX Design, and Motion Graphics. I help brands tell their stories through compelling visual narratives.',
              completedSwaps: 26,
              activeOffers: 7,
              location: 'Remote / INDIA',
            };
            setDoc(userRef, newUser)
              .then(() => console.log('User profile created successfully'))
              .catch(err => {
                console.error('Error creating user profile:', err);
                handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
              });
          }
          setLoading(false);
        }, (err) => {
          if (!auth.currentUser) return;
          console.error('Error listening to user profile:', err);
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        });

        // Listen for barters
        const bartersRef = collection(db, 'barters');
        unsubBarters = onSnapshot(bartersRef, (snap) => {
          const barterList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barter));
          setBarters(barterList);
        }, (err) => {
          if (!auth.currentUser) return;
          console.error('Error listening to barters:', err);
          handleFirestoreError(err, OperationType.LIST, 'barters');
        });
      } else {
        setUser(null);
        setBarters([]);
        setLoading(false);
        setCurrentScreen('welcome');
      }
    });

    return () => {
      cleanupListeners();
      unsubscribe();
    };
  }, []);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderScreen = () => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onLogin={signInWithGoogle} />;
      case 'dashboard':
        return <DashboardScreen onNavigate={handleNavigate} user={user} barters={barters} />;
      case 'create-barter':
        return <CreateBarterScreen onNavigate={handleNavigate} user={user} />;
      case 'matches':
        return <MatchesScreen onNavigate={handleNavigate} />;
      case 'chat':
        return <ChatScreen onNavigate={handleNavigate} user={user} />;
      case 'profile':
        return <ProfileScreen user={user} />;
      default:
        return <WelcomeScreen onLogin={signInWithGoogle} />;
    }
  };

  const showNav = user && currentScreen !== 'welcome' && currentScreen !== 'chat';

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-primary">
        {showNav && (
          <Navbar onNavigate={handleNavigate} currentScreen={currentScreen} user={user} />
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {showNav && (
          <BottomNav onNavigate={handleNavigate} currentScreen={currentScreen} />
        )}
      </div>
    </ErrorBoundary>
  );
}
