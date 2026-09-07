import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Edit3, 
  MapPin, 
  Mail, 
  Briefcase, 
  Plus, 
  PlusCircle,
  X, 
  Sparkles, 
  Clock, 
  Star, 
  StarHalf, 
  ChevronRight, 
  ExternalLink, 
  Share2, 
  BadgeCheck, 
  Check, 
  LogOut,
  Camera,
  Upload,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Chip } from './ui/Chip';
import { User } from '../types';
import { getDirectImageUrl, processAvatarFile } from '../lib/utils';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

interface ProfileScreenProps {
  user: User | null;
}

export function ProfileScreen({ user }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(user);
  const [newSkill, setNewSkill] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAvatarFile = async (file: File) => {
    setAvatarError(null);
    setAvatarSuccess(null);
    try {
      setIsUploadingAvatar(true);
      const dataUrl = await processAvatarFile(file);
      
      setEditedUser((prev) => (prev ? { ...prev, avatar: dataUrl } : null));
      
      // If not actively editing the full profile, persist immediately
      if (!isEditing) {
        const userRef = doc(db, 'users', user!.id);
        await updateDoc(userRef, { avatar: dataUrl });
        setAvatarSuccess('Profile picture updated!');
        setTimeout(() => setAvatarSuccess(null), 3500);
      } else {
        setAvatarSuccess('Image loaded from device. Click "Save Changes" to apply.');
        setTimeout(() => setAvatarSuccess(null), 4000);
      }
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setAvatarError(err?.message || 'Failed to process image');
      setTimeout(() => setAvatarError(null), 5000);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleResetToGooglePhoto = async () => {
    const googlePhoto = auth.currentUser?.photoURL || `https://picsum.photos/seed/${user!.id}/200/200`;
    setEditedUser((prev) => (prev ? { ...prev, avatar: googlePhoto } : null));
    if (!isEditing) {
      try {
        const userRef = doc(db, 'users', user!.id);
        await updateDoc(userRef, { avatar: googlePhoto });
        setAvatarSuccess('Reverted to Google account photo');
        setTimeout(() => setAvatarSuccess(null), 3000);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user!.id}`);
      }
    }
  };

  if (!user || !editedUser) return null;

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        name: editedUser.name || '',
        role: editedUser.role || '',
        location: editedUser.location || '',
        bio: editedUser.bio || '',
        skills: editedUser.skills || [],
        avatar: editedUser.avatar || '',
        completedSwaps: editedUser.completedSwaps || 0,
      });
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    }
  };

  const addSkill = () => {
    if (newSkill && !editedUser.skills.includes(newSkill)) {
      setEditedUser({ ...editedUser, skills: [...editedUser.skills, newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditedUser({
      ...editedUser,
      skills: editedUser.skills.filter(s => s !== skillToRemove),
    });
  };

  const mockListings = [
    {
      id: 'l1',
      title: 'React Dashboard Build',
      description: 'I will build a custom internal tool...',
      image: 'https://picsum.photos/seed/dashboard/400/300',
      duration: '5-10 Days',
      type: 'SERVICE'
    },
    {
      id: 'l2',
      title: 'Tailwind CSS Optimization',
      description: 'Auditing and refactoring your CSS for...',
      image: 'https://picsum.photos/seed/tailwind/400/300',
      duration: '2-3 Days',
      type: 'SERVICE'
    }
  ];

  const mockReviews = [
    {
      id: 'r1',
      name: 'Sarah M.',
      date: '2 days ago',
      text: '"Incredible frontend work! Dhipesh delivered the React component way ahead of schedule."',
      avatar: 'https://picsum.photos/seed/sarah_m/100/100'
    },
    {
      id: 'r2',
      name: 'James L.',
      date: '1 week ago',
      text: '"Super knowledgeable about Tailwind. Helped me optimize my entire site architecture."',
      avatar: 'https://picsum.photos/seed/james_l/100/100'
    }
  ];

  return (
    <main className="pt-24 px-6 max-w-6xl mx-auto pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <Card className="p-8 border-none shadow-sm">
          {/* Hidden Local File Input */}
          <input
            ref={avatarInputRef}
            id="profile-avatar-input"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleAvatarFile(e.target.files[0]);
              }
              e.target.value = '';
            }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar with drag-and-drop & click-to-upload */}
              <div
                id="profile-avatar-container"
                className={`relative group rounded-[40px] cursor-pointer shrink-0 transition-all ${
                  isDragging ? 'ring-4 ring-primary ring-offset-2 scale-105' : ''
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleAvatarFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => avatarInputRef.current?.click()}
                title="Click or drop an image file to change profile picture"
              >
                <img
                  key={editedUser.avatar ? editedUser.avatar.slice(0, 50) : 'profile-avatar'}
                  src={getDirectImageUrl(editedUser.avatar)}
                  alt={editedUser.name}
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 rounded-[40px] border-4 border-white object-cover shadow-2xl transition-opacity group-hover:opacity-90"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=200`;
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />

                {/* Hover/Touch Overlay */}
                <div className="absolute inset-0 rounded-[40px] bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 p-2 text-center pointer-events-none">
                  <Camera className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Change photo</span>
                </div>

                {/* Processing State */}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 rounded-[40px] bg-black/60 flex flex-col items-center justify-center text-white gap-1.5 z-10">
                    <Loader2 className="w-7 h-7 animate-spin text-white" />
                    <span className="text-[10px] font-semibold">Processing...</span>
                  </div>
                )}

                {/* Camera Action Badge */}
                <button
                  type="button"
                  id="profile-avatar-camera-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    avatarInputRef.current?.click();
                  }}
                  className="absolute -bottom-2 -right-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white p-2 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                  title="Upload image from your device"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 flex-1">
                {/* Feedback Badges */}
                {avatarSuccess && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{avatarSuccess}</span>
                  </div>
                )}
                {avatarError && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-error bg-error/10 px-3 py-1.5 rounded-xl border border-error/20 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{avatarError}</span>
                  </div>
                )}

                <h1 className="text-4xl font-black tracking-tight font-headline text-on-surface">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        className="text-3xl font-bold h-12 px-2"
                        placeholder="Your Name"
                      />

                      {/* Photo Upload Options In Edit Mode */}
                      <div className="flex flex-col gap-2 p-3 bg-surface-container rounded-2xl border border-outline-variant/20">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Profile Picture
                          </label>
                          {editedUser.avatar?.startsWith('data:image/') && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Local Image Ready
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            id="profile-avatar-upload-btn"
                            size="sm"
                            onClick={() => avatarInputRef.current?.click()}
                            className="text-xs h-8 rounded-xl bg-primary text-white hover:bg-primary/90 flex items-center gap-1.5 font-bold"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Choose from device
                          </Button>
                          <Button
                            type="button"
                            id="profile-avatar-reset-btn"
                            size="sm"
                            variant="secondary"
                            onClick={handleResetToGooglePhoto}
                            className="text-xs h-8 rounded-xl border border-outline-variant/30 flex items-center gap-1.5 text-on-surface-variant font-medium"
                            title="Revert back to Google account photo"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Use Google Photo
                          </Button>
                        </div>
                        <p className="text-[11px] text-on-surface-variant/70">
                          Accepts PNG, JPG, or WebP. Files are automatically optimized for fast loading.
                        </p>
                      </div>
                    </div>
                  ) : (
                    user.name
                  )}
                </h1>

                <p className="text-lg text-on-surface-variant font-medium">
                  {isEditing ? (
                    <Input
                      value={editedUser.role}
                      onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                      className="h-8 text-sm"
                      placeholder="Your role (e.g. Creative Professional)"
                    />
                  ) : (
                    user.role || 'Creative Professional'
                  )}
                </p>

                {!isEditing && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-[#FFD700] text-[#B8860B]" />
                      ))}
                      <StarHalf className="w-4 h-4 fill-[#FFD700] text-[#B8860B]" />
                    </div>
                    <span className="text-sm font-bold text-on-surface">4.5</span>
                    <span className="text-sm text-on-surface-variant/40 font-medium">(24 reviews)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 items-center">
              {isEditing ? (
                <>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button id="profile-save-btn" onClick={handleSave} className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold">
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    id="profile-edit-btn"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full px-8 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-lg font-bold"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    className="rounded-full px-6 border-none bg-error/10 text-error hover:bg-error/20 font-bold flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full w-12 h-12 bg-[#F3F4F6] hover:bg-[#E5E7EB] border-none">
                    <Share2 className="w-5 h-5 text-on-surface" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bio Card */}
          <Card className="lg:col-span-2 p-8 space-y-8 border-none shadow-sm">
            <div className="flex items-center gap-3 text-[#6366F1]">
              <Sparkles className="w-5 h-5 fill-current" />
              <h3 className="text-xl font-bold font-headline">Bio</h3>
            </div>
            
            {isEditing ? (
              <textarea
                value={editedUser.bio}
                onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                className="w-full bg-surface-container-low rounded-2xl p-6 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface leading-relaxed"
                placeholder="Tell us about your creative journey..."
              />
            ) : (
              <p className="text-on-surface-variant/80 text-lg leading-relaxed">
                {user.bio || "Multi-disciplinary Creative Professional with over 3 years of experience in Brand Identity, UI/UX Design, and Motion Graphics. I help brands tell their stories through compelling visual narratives. Currently exploring the intersection of AI and generative art. Looking to trade high-end branding services for UI/UX mentorship or creative direction assets."}
              </p>
            )}

            <div className="flex flex-wrap gap-16 pt-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">LOCATION</p>
                <p className="font-bold text-on-surface text-sm">
                  {isEditing ? (
                    <input
                      value={editedUser.location}
                      onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                      className="bg-transparent border-b border-outline-variant focus:outline-none"
                    />
                  ) : (user.location || "Remote / INDIA")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">AVAILABILITY</p>
                <p className="font-bold text-[#22C55E] text-sm">
                  Open for Barter
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">COMPLETED SWAPS</p>
                <p className="font-bold text-on-surface text-sm">
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedUser.completedSwaps || 0}
                      onChange={(e) => setEditedUser({ ...editedUser, completedSwaps: parseInt(e.target.value) || 0 })}
                      className="bg-transparent border-b border-outline-variant focus:outline-none w-16"
                    />
                  ) : (user.completedSwaps || 26)}
                </p>
              </div>
            </div>
          </Card>

          {/* Skills Card */}
          <Card className="lg:col-span-1 p-8 space-y-6 border-none shadow-sm h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline text-on-surface">My Skills</h3>
              <button 
                onClick={addSkill}
                className="text-on-surface-variant/30 hover:text-primary transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(isEditing ? editedUser.skills : (user.skills.length > 0 ? user.skills : ['UI/UX Design', 'Brand Identity', 'Motion Graphics', 'Figma', 'Graphic Design', 'Project Management', 'Team Leadership', 'Content Strategy'])).map((skill) => (
                <div key={skill} className="relative group">
                  <div className="bg-[#E5E7EB]/60 text-on-surface-variant/80 font-bold text-[11px] px-4 py-2 rounded-full">
                    {skill}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="absolute -top-1 -right-1 bg-error text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="w-full mt-4 flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add skill..."
                    className="h-10 text-sm rounded-xl"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Active Listings Card */}
          <Card className="lg:col-span-2 p-8 space-y-6 border-none shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline text-on-surface">Active Listings</h3>
              <button className="text-[#6366F1] font-bold text-xs hover:underline">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-all border-none bg-[#F3F4F6]/50">
                  <div className="p-3">
                    <div className="aspect-[16/10] relative overflow-hidden rounded-2xl">
                      <img 
                        src={listing.image} 
                        alt={listing.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="px-5 pb-5 space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{listing.title}</h4>
                      <p className="text-[11px] text-on-surface-variant/70 leading-relaxed line-clamp-2">{listing.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="px-3 py-1 rounded-lg bg-[#E0E7FF] text-[#6366F1] text-[10px] font-bold tracking-wider uppercase">
                        {listing.type}
                      </div>
                      <span className="text-[11px] font-bold text-on-surface-variant/60">{listing.duration}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Recent Reviews Card */}
          <Card className="lg:col-span-1 p-8 space-y-6 border-none shadow-sm">
            <h3 className="text-xl font-bold font-headline text-on-surface">Recent Reviews</h3>
            
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={review.avatar} 
                      alt={review.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-bold text-on-surface">{review.name}</p>
                      <p className="text-[10px] text-on-surface-variant/30 font-bold">{review.date}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/70 italic leading-relaxed">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full rounded-2xl font-bold text-sm bg-[#F3F4F6] hover:bg-[#E5E7EB] text-on-surface py-6">
              Read All Reviews
            </Button>
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
