
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// import {
//   Home,
//   Camera,
//   Users,
//   Calendar,
//   MapPin,
//   Clock,
//   Heart,
//   MessageCircle,
//   Share2,
//   Bookmark,
//   CheckCircle,
//   X,
//   User,
//   UserPlus,
//   Send,
//   Verified,
//   Filter as FilterIcon,
//   Flag,
//   AlertTriangle,
//   Shield,
//   Image as ImageIcon,
//   Flame,
//   Star,
//   Globe,
//   Bell,
//   Search,
//   UserCheck,
//   Eye,
//   Download,
//   Copy,
//   ExternalLink,
//   Play,
//   Volume2,
//   VolumeX,
//   Loader,
//   Trash2,
//   Edit,
//   MoreVertical,
//   RefreshCw,
//   Zap,
//   TrendingUp,
//   Sparkles,
//   Target,
//   Activity,
//   ChevronRight,
//   ChevronLeft
// } from 'lucide-react';

// // Cloudinary configuration
// const CLOUDINARY_CONFIG = {
//   cloudName: 'your-cloud-name',
//   uploadPreset: 'touchgrass_verifications',
//   apiUrl: 'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload'
// };

// const VerificationWall = () => {
//   const navigate = useNavigate();
  
//   // State Management
//   const [posts, setPosts] = useState([]);
//   const [myPosts, setMyPosts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [activeTab, setActiveTab] = useState('all');
//   const [following, setFollowing] = useState([]);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [reportPost, setReportPost] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [commentInputs, setCommentInputs] = useState({});
//   const [likeAnimation, setLikeAnimation] = useState(null);
//   const [selectedReportReason, setSelectedReportReason] = useState('');
//   const [showFullImage, setShowFullImage] = useState(null);
//   const [showShareMenu, setShowShareMenu] = useState({});
//   const [showActivityFilters, setShowActivityFilters] = useState(true);
  
//   // Auto-refresh states
//   const [newPostsCount, setNewPostsCount] = useState(0);
//   const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
//   const [showNewPostsToast, setShowNewPostsToast] = useState(false);

//   // Refs
//   const fileInputRef = useRef(null);
//   const videoRefs = useRef({});
//   const postsContainerRef = useRef(null);
//   const refreshIntervalRef = useRef(null);
//   const newPostsTimeoutRef = useRef(null);

//   // Upload Data
//   const [uploadData, setUploadData] = useState({
//     media: null,
//     mediaType: 'photo',
//     caption: '',
//     location: '',
//     activity: 'walk',
//     duration: 30,
//     tags: []
//   });

//   // ==================== DEMO DATA ====================

//   // Cloudinary demo images (20 realistic outdoor photos)
//   const CLOUDINARY_PHOTOS = [
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature1.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature2.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature3.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature4.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature5.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature6.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature7.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature8.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature9.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature10.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature11.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature12.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature13.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature14.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature15.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature16.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature17.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature18.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature19.jpg',
//     'https://res.cloudinary.com/demo/image/upload/v1690452538/nature20.jpg'
//   ];

//   const ACTIVITIES = [
//     { id: 'walk', name: 'Walking', emoji: '🚶‍♂️', color: '#00E5FF', bg: 'rgba(0, 229, 255, 0.2)' },
//     { id: 'run', name: 'Running', emoji: '🏃‍♂️', color: '#FF3366', bg: 'rgba(255, 51, 102, 0.2)' },
//     { id: 'hike', name: 'Hiking', emoji: '🥾', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.2)' },
//     { id: 'cycle', name: 'Cycling', emoji: '🚴‍♂️', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)' },
//     { id: 'swim', name: 'Swimming', emoji: '🏊‍♂️', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)' },
//     { id: 'yoga', name: 'Yoga', emoji: '🧘‍♂️', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.2)' },
//     { id: 'meditate', name: 'Meditation', emoji: '🪷', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)' },
//     { id: 'garden', name: 'Gardening', emoji: '🌱', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' },
//     { id: 'sports', name: 'Sports', emoji: '⚽', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' },
//     { id: 'explore', name: 'Exploring', emoji: '🧭', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)' }
//   ];

//   const REPORT_CATEGORIES = [
//     { id: 'fake', name: 'Fake/Staged Photo', icon: '🎭', description: 'Not genuine outdoor activity' },
//     { id: 'indoor', name: 'Indoor/Not Outdoor', icon: '🏠', description: 'Photo taken indoors' },
//     { id: 'meme', name: 'Meme/Non-Serious', icon: '😂', description: 'Meme or joke content' },
//     { id: 'inappropriate', name: 'Inappropriate Content', icon: '⚠️', description: 'Offensive or unsafe' },
//     { id: 'spam', name: 'Spam or Irrelevant', icon: '📧', description: 'Not related to outdoor' },
//     { id: 'copyright', name: 'Copyright Violation', icon: '©️', description: 'Stolen content' },
//     { id: 'other', name: 'Other Issue', icon: '❓', description: 'Other problem' }
//   ];

//   // 20 Community members with realistic profiles
//   const COMMUNITY_MEMBERS = [
//     { username: 'nature_lover', name: 'Alex Green 🌿', bio: 'Daily nature walks', location: 'Portland, OR', streak: 42, followers: 1247, verified: true },
//     { username: 'mountain_mike', name: 'Mike Summit 🏔️', bio: 'Peak chaser | Trail runner', location: 'Denver, CO', streak: 89, followers: 2156, verified: true },
//     { username: 'yoga_outdoors', name: 'Priya Zen 🧘‍♀️', bio: 'Sunrise yoga coach', location: 'San Diego, CA', streak: 67, followers: 1789, verified: true },
//     { username: 'trail_blazer', name: 'Jamie Trail 🥾', bio: 'Ultra runner', location: 'Seattle, WA', streak: 156, followers: 3254, verified: true },
//     { username: 'forest_soul', name: 'Sam Woods 🌲', bio: 'Forest therapy guide', location: 'Asheville, NC', streak: 103, followers: 1890, verified: false },
//     { username: 'coastal_vibes', name: 'Emma Wave 🌊', bio: 'Beach walks expert', location: 'Miami, FL', streak: 78, followers: 1423, verified: true },
//     { username: 'peak_performer', name: 'Ryan Peak ⛰️', bio: 'Mountain climber', location: 'Salt Lake City, UT', streak: 121, followers: 2678, verified: true },
//     { username: 'zen_wanderer', name: 'Lily Path 🪷', bio: 'Mindful walking guide', location: 'Boulder, CO', streak: 95, followers: 1987, verified: false },
//     { username: 'urban_hiker', name: 'Carlos Street 🏙️', bio: 'City explorer', location: 'New York, NY', streak: 56, followers: 987, verified: true },
//     { username: 'wilderness_will', name: 'Will Forest 🌳', bio: 'Wilderness survival', location: 'Anchorage, AK', streak: 203, followers: 4321, verified: true },
//     { username: 'sunrise_seeker', name: 'Maya Dawn 🌅', bio: 'Morning routine advocate', location: 'Austin, TX', streak: 134, followers: 2876, verified: true },
//     { username: 'trail_mixer', name: 'Taylor Path 🛤️', bio: 'Trail running coach', location: 'Phoenix, AZ', streak: 87, followers: 1543, verified: false },
//     { username: 'ocean_odyssey', name: 'Kai Ocean 🌊', bio: 'Ocean conservationist', location: 'Honolulu, HI', streak: 112, followers: 2345, verified: true },
//     { username: 'mountain_medic', name: 'Dr. Peak ⚕️', bio: 'Mountain medicine', location: 'Colorado Springs, CO', streak: 65, followers: 1897, verified: true },
//     { username: 'urban_yogi', name: 'Nina Om 🧘‍♀️', bio: 'Urban yoga teacher', location: 'Los Angeles, CA', streak: 98, followers: 2109, verified: false },
//     { username: 'desert_dweller', name: 'Sandy Dunes 🏜️', bio: 'Desert explorer', location: 'Las Vegas, NV', streak: 76, followers: 1654, verified: true },
//     { username: 'river_runner', name: 'Rio Rapids 🚣‍♂️', bio: 'White water rafter', location: 'Jackson Hole, WY', streak: 143, followers: 2987, verified: true },
//     { username: 'forest_fairy', name: 'Faye Woods 🧚‍♀️', bio: 'Nature photographer', location: 'Burlington, VT', streak: 109, followers: 2456, verified: false },
//     { username: 'cliff_caller', name: 'Rocky Edge 🧗‍♂️', bio: 'Rock climbing guide', location: 'Moab, UT', streak: 187, followers: 3678, verified: true },
//     { username: 'meadow_muse', name: 'Flora Field 🌼', bio: 'Wildflower enthusiast', location: 'Portland, ME', streak: 92, followers: 1789, verified: true }
//   ];

//   const REAL_CAPTIONS = [
//     "Day {streak} of my outdoor journey! The sunrise this morning was absolutely breathtaking. Nature never fails to reset my mind. 🍃 #TouchGrass",
//     "Just completed a {activity} session. Fresh air therapy is the best medicine! Consistency is key to building habits. 🔥 #OutdoorLife",
//     "Found my peace in the mountains today. The view from up here makes every step worth it. Day {streak} strong! ⛰️ #NatureTherapy",
//     "Morning {activity} complete! Starting the day grounded and centered. Outdoor time = mental clarity. ✨ #WellnessJourney",
//     "The sound of birds and the smell of pine - pure bliss. Another day verified in nature's classroom. 🌲 #OutdoorLiving",
//     "Pushed my limits on the trail today. Growth happens outside the comfort zone! Day {streak} of showing up. 💪 #PersonalGrowth",
//     "Forest bathing session complete. Letting nature's calm wash over me. So grateful for this community! 🙏 #Mindfulness",
//     "Coastal walk with ocean breeze therapy. The waves have a way of washing away stress. 🌊 #CoastalLiving",
//     "Mountain air and clear thoughts. Every outdoor moment is an investment in mental health. 🏔️ #MentalHealthMatters",
//     "Sunset meditation by the lake. Reflection time is growth time. Day {streak} of intentional living. 🌅 #DailyPractice"
//   ];

//   const REAL_LOCATIONS = [
//     'Central Park, NYC',
//     'Mount Rainier National Park',
//     'Pacific Coast Highway, CA',
//     'Yosemite Valley, CA',
//     'Lake District, UK',
//     'Swiss Alps, Switzerland',
//     'Japanese Garden, Portland',
//     'Rocky Mountains, CO',
//     'Appalachian Trail',
//     'Norwegian Fjords',
//     'Banff National Park, Canada',
//     'Great Smoky Mountains',
//     'Big Sur, California',
//     'Yellowstone National Park',
//     'Blue Ridge Parkway'
//   ];

//   // ==================== AUTO-REFRESH FUNCTIONS ====================

//   // Generate new random post (like Instagram's new content)
//   const generateNewPost = () => {
//     const randomMember = COMMUNITY_MEMBERS[Math.floor(Math.random() * COMMUNITY_MEMBERS.length)];
//     const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
//     const now = new Date();
    
//     // Make post seem recent (1-30 minutes ago)
//     const minutesAgo = Math.floor(Math.random() * 30) + 1;
//     const postDate = new Date(now - minutesAgo * 60000);
    
//     const newPost = {
//       id: `new_post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       userId: randomMember.username,
//       userName: randomMember.name,
//       userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomMember.username}`,
//       userBio: randomMember.bio,
//       userLocation: randomMember.location,
//       userStreak: randomMember.streak,
//       userFollowers: randomMember.followers,
//       userVerified: randomMember.verified,
//       mediaUrl: CLOUDINARY_PHOTOS[Math.floor(Math.random() * CLOUDINARY_PHOTOS.length)],
//       mediaType: 'photo',
//       caption: REAL_CAPTIONS[Math.floor(Math.random() * REAL_CAPTIONS.length)]
//         .replace('{streak}', randomMember.streak)
//         .replace('{activity}', activity.name.toLowerCase()),
//       location: REAL_LOCATIONS[Math.floor(Math.random() * REAL_LOCATIONS.length)],
//       activity: activity.id,
//       activityName: activity.name,
//       activityEmoji: activity.emoji,
//       activityColor: activity.color,
//       activityBg: activity.bg,
//       duration: [15, 30, 45, 60, 90][Math.floor(Math.random() * 5)],
//       likes: Math.floor(Math.random() * 50) + 10, // New posts start with fewer likes
//       comments: [],
//       isLiked: false,
//       isBookmarked: false,
//       isReported: false,
//       reportCount: 0,
//       reports: [],
//       verificationScore: Math.floor(Math.random() * 20) + 80,
//       verified: Math.random() > 0.3,
//       trending: false,
//       featured: false,
//       isBlocked: false,
//       timestamp: postDate.toISOString(),
//       tags: ['touchgrass', activity.id, 'outdoor', 'nature', 'new'],
//       shareCount: 0,
//       views: Math.floor(Math.random() * 50),
//       isNew: true // Flag to identify newly added posts
//     };
    
//     return newPost;
//   };

//   // Simulate checking for new posts (like Instagram)
//   const checkForNewPosts = useCallback(() => {
//     if (!autoRefreshEnabled || isRefreshing) return;
    
//     const now = Date.now();
//     const timeSinceLastRefresh = now - lastRefreshTime;
    
//     // Only check every 30-90 seconds (like Instagram)
//     if (timeSinceLastRefresh > 30000 && Math.random() > 0.7) {
//       const newPostCount = Math.floor(Math.random() * 3) + 1; // 1-3 new posts
//       setNewPostsCount(prev => prev + newPostCount);
//       setShowNewPostsToast(true);
      
//       // Auto-hide toast after 5 seconds
//       if (newPostsTimeoutRef.current) {
//         clearTimeout(newPostsTimeoutRef.current);
//       }
//       newPostsTimeoutRef.current = setTimeout(() => {
//         setShowNewPostsToast(false);
//       }, 5000);
//     }
//   }, [autoRefreshEnabled, isRefreshing, lastRefreshTime]);

//   // Manual refresh function (pull to refresh)
//   const handleManualRefresh = useCallback(() => {
//     if (isRefreshing) return;
    
//     setIsRefreshing(true);
//     setLastRefreshTime(Date.now());
    
//     // Simulate network delay
//     setTimeout(() => {
//       // Add some new posts
//       const newPostsToAdd = Math.floor(Math.random() * 4) + 2; // 2-5 new posts
//       const newPosts = [];
      
//       for (let i = 0; i < newPostsToAdd; i++) {
//         newPosts.push(generateNewPost());
//       }
      
//       setPosts(prev => [...newPosts, ...prev]);
//       setNewPostsCount(0);
//       setShowNewPostsToast(false);
      
//       // Update localStorage
//       const storedPosts = JSON.parse(localStorage.getItem('touchgrass_verification_posts') || '[]');
//       localStorage.setItem('touchgrass_verification_posts', JSON.stringify([...newPosts, ...storedPosts]));
      
//       setIsRefreshing(false);
//       toast.success(`Loaded ${newPostsToAdd} new posts! ✨`);
//     }, 1500);
//   }, [isRefreshing]);

//   // Load new posts when user clicks notification
//   const loadNewPosts = useCallback(() => {
//     if (newPostsCount === 0 || isRefreshing) return;
    
//     setIsRefreshing(true);
    
//     setTimeout(() => {
//       const newPosts = [];
//       for (let i = 0; i < newPostsCount; i++) {
//         newPosts.push(generateNewPost());
//       }
      
//       setPosts(prev => [...newPosts, ...prev]);
//       setNewPostsCount(0);
//       setShowNewPostsToast(false);
//       setLastRefreshTime(Date.now());
      
//       // Update localStorage
//       const storedPosts = JSON.parse(localStorage.getItem('touchgrass_verification_posts') || '[]');
//       localStorage.setItem('touchgrass_verification_posts', JSON.stringify([...newPosts, ...storedPosts]));
      
//       setIsRefreshing(false);
      
//       // Scroll to top to see new posts
//       if (postsContainerRef.current) {
//         postsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
//       }
//     }, 1000);
//   }, [newPostsCount, isRefreshing]);

//   // Initialize auto-refresh interval
//   useEffect(() => {
//     // Check for new posts every 10-30 seconds (randomized to feel more natural)
//     refreshIntervalRef.current = setInterval(() => {
//       checkForNewPosts();
//     }, 10000 + Math.random() * 20000); // 10-30 seconds

//     return () => {
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//       }
//       if (newPostsTimeoutRef.current) {
//         clearTimeout(newPostsTimeoutRef.current);
//       }
//     };
//   }, [checkForNewPosts]);

//   // ==================== CLOUDINARY FUNCTIONS ====================

//   const uploadToCloudinary = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
//     formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
    
//     try {
//       const response = await fetch(CLOUDINARY_CONFIG.apiUrl, {
//         method: 'POST',
//         body: formData
//       });
      
//       const data = await response.json();
//       if (data.secure_url) {
//         return {
//           url: data.secure_url,
//           publicId: data.public_id,
//           type: data.resource_type
//         };
//       }
//       throw new Error('Upload failed');
//     } catch (error) {
//       throw error;
//     }
//   };

//   // ==================== HELPER FUNCTIONS ====================

//   const timeAgo = useCallback((timestamp) => {
//     if (!timestamp) return 'Recently';
//     const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
//     if (seconds < 60) return 'Just now';
//     if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
//     if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
//     if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d`;
//     if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo`;
//     return `${Math.floor(seconds / 31536000)}y`;
//   }, []);

//   // ==================== CORE FUNCTIONS ====================

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('touchgrass_user') || 'null');
//     if (user) {
//       setUserData(user);
//       loadFollowing(user.username);
//       loadVerificationData();
//     } else {
//       navigate('/auth');
//     }
//   }, [navigate]);

//   const loadVerificationData = useCallback(() => {
//     setIsLoading(true);
//     try {
//       const storedPosts = JSON.parse(localStorage.getItem('touchgrass_verification_posts') || '[]');
      
//       if (storedPosts.length > 0) {
//         setPosts(storedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
//         if (userData) {
//           const myFiltered = storedPosts.filter(post => post.userId === userData.username);
//           setMyPosts(myFiltered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
//         }
//       } else {
//         const demoPosts = generateDemoPosts();
//         setPosts(demoPosts);
//         localStorage.setItem('touchgrass_verification_posts', JSON.stringify(demoPosts));
//       }
//     } catch (error) {
//       toast.error('Failed to load posts');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [userData]);

//   // Generate initial demo posts
//   const generateDemoPosts = () => {
//     const posts = [];
//     const now = new Date();
    
//     COMMUNITY_MEMBERS.forEach((member, index) => {
//       const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
//       const hoursAgo = index * 2;
//       const postDate = new Date(now - hoursAgo * 3600000);
      
//       const post = {
//         id: `post_${member.username}_${Date.now()}_${index}`,
//         userId: member.username,
//         userName: member.name,
//         userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`,
//         userBio: member.bio,
//         userLocation: member.location,
//         userStreak: member.streak,
//         userFollowers: member.followers,
//         userVerified: member.verified,
//         mediaUrl: CLOUDINARY_PHOTOS[index % CLOUDINARY_PHOTOS.length],
//         mediaType: 'photo',
//         caption: REAL_CAPTIONS[Math.floor(Math.random() * REAL_CAPTIONS.length)]
//           .replace('{streak}', member.streak)
//           .replace('{activity}', activity.name.toLowerCase()),
//         location: REAL_LOCATIONS[Math.floor(Math.random() * REAL_LOCATIONS.length)],
//         activity: activity.id,
//         activityName: activity.name,
//         activityEmoji: activity.emoji,
//         activityColor: activity.color,
//         activityBg: activity.bg,
//         duration: [15, 30, 45, 60, 90][Math.floor(Math.random() * 5)],
//         likes: Math.floor(Math.random() * 300) + 50,
//         comments: generateDemoComments(member.username),
//         isLiked: false,
//         isBookmarked: false,
//         isReported: false,
//         reportCount: 0,
//         reports: [],
//         verificationScore: Math.floor(Math.random() * 30) + 70,
//         verified: Math.random() > 0.3,
//         trending: false,
//         featured: false,
//         isBlocked: false,
//         timestamp: postDate.toISOString(),
//         tags: ['touchgrass', activity.id, 'outdoor', 'nature'],
//         shareCount: Math.floor(Math.random() * 20),
//         views: Math.floor(Math.random() * 500) + 100,
//         isNew: false
//       };
      
//       posts.push(post);
//     });
    
//     return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//   };

//   const generateDemoComments = (postOwner) => {
//     const commenters = COMMUNITY_MEMBERS
//       .filter(member => member.username !== postOwner)
//       .slice(0, Math.floor(Math.random() * 3) + 1);
    
//     const comments = [
//       "Amazing dedication! 💪 Your consistency inspires me!",
//       "Beautiful view! Keep up the great work! 🌅",
//       "Day {streak} strong here too! 🙏",
//       "Nature therapy at its finest! 🌿",
//       "The consistency is unreal! 🔥",
//       "Outdoor time = mental clarity. So true! ✨",
//       "Adding this location to my bucket list! 🏔️",
//       "Fresh air is the best medicine indeed! 🌞",
//       "The discipline is inspiring! 💫",
//       "Love seeing real progress. Keep shining! 🌟"
//     ];
    
//     return commenters.map((commenter, index) => ({
//       id: `comment_${Date.now()}_${index}`,
//       userId: commenter.username,
//       userName: commenter.name,
//       userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${commenter.username}`,
//       userStreak: commenter.streak,
//       text: comments[Math.floor(Math.random() * comments.length)].replace('{streak}', commenter.streak),
//       time: 'Just now',
//       likes: Math.floor(Math.random() * 5),
//       isLiked: false,
//       verified: commenter.verified,
//       timestamp: new Date().toISOString()
//     }));
//   };

//   const loadFollowing = (username) => {
//     const stored = JSON.parse(localStorage.getItem(`touchgrass_following_${username}`) || '[]');
//     setFollowing(stored);
//   };

//   // ==================== INTERACTION FUNCTIONS ====================

//   const handleLike = useCallback((postId) => {
//     if (!userData) {
//       toast.error('Please login to like posts');
//       return;
//     }

//     setLikeAnimation(postId);
//     setTimeout(() => setLikeAnimation(null), 800);

//     setPosts(prevPosts => {
//       const updatedPosts = prevPosts.map(post => {
//         if (post.id === postId) {
//           const wasLiked = post.isLiked;
//           const newLikes = wasLiked ? post.likes - 1 : post.likes + 1;
          
//           return {
//             ...post,
//             likes: newLikes,
//             isLiked: !wasLiked
//           };
//         }
//         return post;
//       });

//       localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
//       return updatedPosts;
//     });

//     toast.success(posts.find(p => p.id === postId)?.isLiked ? 'Unliked' : 'Liked! ❤️');
//   }, [userData, posts]);

//   const handleComment = useCallback((postId) => {
//     const text = commentInputs[postId] || '';
//     if (!text.trim() || !userData) {
//       toast.error('Please write a comment');
//       return;
//     }

//     const newComment = {
//       id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       userId: userData.username,
//       userName: userData.displayName || userData.username,
//       userAvatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
//       userStreak: userData.streak || 0,
//       text: text,
//       time: 'Just now',
//       likes: 0,
//       isLiked: false,
//       verified: true,
//       timestamp: new Date().toISOString()
//     };

//     setPosts(prevPosts => {
//       const updatedPosts = prevPosts.map(post => {
//         if (post.id === postId) {
//           return {
//             ...post,
//             comments: [newComment, ...(post.comments || [])]
//           };
//         }
//         return post;
//       });

//       localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
//       return updatedPosts;
//     });

//     setCommentInputs(prev => ({ ...prev, [postId]: '' }));
//     toast.success('Comment added! 💬');
//   }, [userData, commentInputs]);

//   const handleReport = useCallback((postId, reason) => {
//     if (!userData) {
//       toast.error('Please login to report');
//       return;
//     }

//     setPosts(prevPosts => {
//       const updatedPosts = prevPosts.map(post => {
//         if (post.id === postId) {
//           const newReport = {
//             userId: userData.username,
//             reason,
//             timestamp: new Date().toISOString()
//           };
          
//           const updatedReports = [...(post.reports || []), newReport];
//           const newReportCount = updatedReports.length;
          
//           const shouldBlock = newReportCount >= 3;
          
//           const updatedPost = {
//             ...post,
//             reportCount: newReportCount,
//             reports: updatedReports,
//             isBlocked: shouldBlock,
//             isReported: true
//           };
          
//           if (shouldBlock) {
//             toast.error(`⚠️ Post blocked due to ${newReportCount} reports.`, {
//               duration: 5000,
//             });
//           } else {
//             toast.success('Report submitted. Thank you! 🛡️');
//           }
          
//           return updatedPost;
//         }
//         return post;
//       });

//       localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
//       return updatedPosts;
//     });

//     setShowReportModal(false);
//     setReportPost(null);
//     setSelectedReportReason('');
//   }, [userData]);

//   const handleFollow = useCallback((userId) => {
//     if (!userData) {
//       toast.error('Please login to follow');
//       return;
//     }

//     const key = `touchgrass_following_${userData.username}`;
//     const currentFollowing = JSON.parse(localStorage.getItem(key) || '[]');
    
//     let newFollowing;
//     if (currentFollowing.includes(userId)) {
//       newFollowing = currentFollowing.filter(id => id !== userId);
//       toast.success(`Unfollowed`);
//     } else {
//       newFollowing = [...currentFollowing, userId];
//       toast.success(`Following`, { icon: '👥' });
//     }
    
//     localStorage.setItem(key, JSON.stringify(newFollowing));
//     setFollowing(newFollowing);
//   }, [userData]);

//   const handleBookmark = useCallback((postId) => {
//     setPosts(prevPosts => {
//       const updatedPosts = prevPosts.map(post => {
//         if (post.id === postId) {
//           return {
//             ...post,
//             isBookmarked: !post.isBookmarked
//           };
//         }
//         return post;
//       });

//       localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
//       return updatedPosts;
//     });

//     const isBookmarked = posts.find(p => p.id === postId)?.isBookmarked;
//     toast.success(isBookmarked ? 'Post removed from saved' : 'Post saved! 📌');
//   }, [posts]);

//   const handleShare = useCallback((post) => {
//     if (navigator.share) {
//       navigator.share({
//         title: `${post.userName}'s outdoor activity`,
//         text: post.caption,
//         url: window.location.href
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       toast.success('Link copied to clipboard! 📋');
//     }
    
//     setPosts(prevPosts => {
//       const updatedPosts = prevPosts.map(p => {
//         if (p.id === post.id) {
//           return {
//             ...p,
//             shareCount: p.shareCount + 1
//           };
//         }
//         return p;
//       });

//       localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
//       return updatedPosts;
//     });
    
//     setShowShareMenu({});
//   }, []);

//   // ==================== UPLOAD TO CLOUDINARY ====================

//   const handleMediaUpload = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
//     if (!validTypes.includes(file.type)) {
//       toast.error('Please upload an image or video file');
//       return;
//     }

//     const isVideo = file.type.startsWith('video/');
//     const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    
//     if (file.size > maxSize) {
//       toast.error(`File too large. Max ${isVideo ? '100MB' : '10MB'}`);
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setUploadData(prev => ({
//         ...prev,
//         media: reader.result,
//         mediaType: isVideo ? 'video' : 'photo'
//       }));
//     };
//     reader.readAsDataURL(file);
//   }, []);

//   const submitVerification = useCallback(async () => {
//     if (!uploadData.media || !userData) {
//       toast.error('Please upload proof of your outdoor activity');
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);

//     try {
//       const progressInterval = setInterval(() => {
//         setUploadProgress(prev => {
//           if (prev >= 90) {
//             clearInterval(progressInterval);
//             return 90;
//           }
//           return prev + 10;
//         });
//       }, 200);

//       const activity = ACTIVITIES.find(a => a.id === uploadData.activity) || ACTIVITIES[0];
      
//       const newPost = {
//         id: `post_${userData.username}_${Date.now()}`,
//         userId: userData.username,
//         userName: userData.displayName || userData.username,
//         userAvatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
//         userBio: userData.bio || 'Outdoor enthusiast',
//         userLocation: userData.location || 'Exploring',
//         userStreak: 1,
//         userFollowers: 0,
//         userVerified: true,
//         mediaUrl: uploadData.media,
//         mediaType: uploadData.mediaType,
//         caption: uploadData.caption || `My outdoor activity! ${activity.emoji}`,
//         location: uploadData.location || 'Outdoors',
//         activity: uploadData.activity,
//         activityName: activity.name,
//         activityEmoji: activity.emoji,
//         activityColor: activity.color,
//         activityBg: activity.bg,
//         duration: uploadData.duration,
//         likes: 0,
//         comments: [],
//         isLiked: false,
//         isBookmarked: false,
//         isReported: false,
//         reportCount: 0,
//         reports: [],
//         verificationScore: 100,
//         verified: true,
//         trending: true,
//         featured: false,
//         isBlocked: false,
//         timestamp: new Date().toISOString(),
//         tags: ['touchgrass', uploadData.activity, 'myverification'],
//         shareCount: 0,
//         views: 0,
//         isNew: true
//       };

//       clearInterval(progressInterval);
//       setUploadProgress(100);
//       await new Promise(resolve => setTimeout(resolve, 500));

//       const updatedPosts = [newPost, ...posts];
//       setPosts(updatedPosts);
//       setMyPosts([newPost, ...myPosts]);
      
//       localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
//       setUploadData({
//         media: null,
//         mediaType: 'photo',
//         caption: '',
//         location: '',
//         activity: 'walk',
//         duration: 30,
//         tags: []
//       });
//       setShowUploadModal(false);
      
//       toast.success('✅ Verification posted successfully!');
      
//     } catch (error) {
//       toast.error('Failed to upload. Please try again.');
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   }, [uploadData, userData, posts, myPosts]);

//   // ==================== FILTERING ====================

//   const getFilteredPosts = useCallback(() => {
//     let filtered = posts.filter(post => !post.isBlocked);
    
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(post => 
//         post.caption?.toLowerCase().includes(query) ||
//         post.userName?.toLowerCase().includes(query) ||
//         post.location?.toLowerCase().includes(query)
//       );
//     }
    
//     switch (activeTab) {
//       case 'my-posts':
//         filtered = filtered.filter(post => post.userId === userData?.username);
//         break;
//       case 'following':
//         filtered = filtered.filter(post => following.includes(post.userId));
//         break;
//       case 'trending':
//         filtered = filtered.filter(post => post.likes >= 50);
//         break;
//       case 'verified':
//         filtered = filtered.filter(post => post.verified);
//         break;
//     }
    
//     if (activeFilter !== 'all') {
//       filtered = filtered.filter(post => post.activity === activeFilter);
//     }
    
//     return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//   }, [posts, activeTab, activeFilter, following, userData, searchQuery]);

//   const filteredPosts = getFilteredPosts();
//   const stats = {
//     totalPosts: posts.length,
//     totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
//     activeUsers: new Set(posts.map(p => p.userId)).size
//   };

//   // ==================== RENDER ====================

//   return (
//     <div className="verification-wall" ref={postsContainerRef}>
//       <style>{`
//         /* Base Styles */
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }
        
//         .verification-wall {
//           min-height: 100vh;
//           background: #0f172a;
//           color: white;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           overflow-y: auto;
//           scroll-behavior: smooth;
//         }

//         /* New Posts Notification (Instagram-like) */
//         .new-posts-notification {
//           position: fixed;
//           top: 70px;
//           left: 0;
//           right: 0;
//           z-index: 90;
//           background: linear-gradient(135deg, #00E5FF, #7F00FF);
//           color: white;
//           padding: 1rem;
//           text-align: center;
//           cursor: pointer;
//           animation: slideDown 0.3s ease-out;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.75rem;
//         }

//         .new-posts-notification:hover {
//           background: linear-gradient(135deg, #00d4e6, #7200e6);
//         }

//         @keyframes slideDown {
//           from {
//             transform: translateY(-100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }

//         /* Refresh Indicator */
//         .refresh-indicator {
//           text-align: center;
//           padding: 1rem;
//           color: #94a3b8;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           animation: pulse 2s infinite;
//         }

//         .refresh-indicator .spinner {
//           animation: spin 1s linear infinite;
//         }

//         @keyframes pulse {
//           0%, 100% { opacity: 0.7; }
//           50% { opacity: 1; }
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         /* New Post Indicator */
//         .new-post-indicator {
//           position: absolute;
//           top: 10px;
//           left: 10px;
//           background: linear-gradient(135deg, #00E5FF, #7F00FF);
//           color: white;
//           padding: 0.25rem 0.75rem;
//           border-radius: 1rem;
//           font-size: 0.75rem;
//           font-weight: 600;
//           z-index: 5;
//           animation: pulse 2s infinite;
//         }

//         /* Navigation */
//         .nav {
//           position: sticky;
//           top: 0;
//           z-index: 100;
//           padding: 1rem;
//           background: rgba(15, 23, 42, 0.95);
//           backdrop-filter: blur(10px);
//           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .nav-container {
//           max-width: 1200px;
//           margin: 0 auto;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 1rem;
//         }

//         .nav-logo {
//           font-size: 1.5rem;
//           font-weight: bold;
//           background: linear-gradient(135deg, #00E5FF, #7F00FF);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           cursor: pointer;
//         }

//         .nav-search {
//           flex: 1;
//           max-width: 400px;
//           position: relative;
//         }

//         .search-input {
//           width: 100%;
//           padding: 0.75rem 1rem 0.75rem 2.5rem;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 0.75rem;
//           color: white;
//           font-size: 0.875rem;
//         }

//         .search-icon {
//           position: absolute;
//           left: 0.75rem;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #94a3b8;
//         }

//         .nav-actions {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .nav-button {
//           padding: 0.75rem 1.25rem;
//           background: linear-gradient(135deg, #00E5FF, #7F00FF);
//           border: none;
//           border-radius: 0.75rem;
//           color: white;
//           font-weight: 600;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .refresh-button {
//           background: rgba(255, 255, 255, 0.1);
//           padding: 0.5rem;
//           border-radius: 0.75rem;
//           border: none;
//           color: white;
//           cursor: pointer;
//           transition: all 0.3s;
//         }

//         .refresh-button:hover {
//           background: rgba(255, 255, 255, 0.2);
//           transform: rotate(180deg);
//         }

//         .refresh-button.refreshing {
//           animation: spin 1s linear infinite;
//         }

//         /* Header */
//         .header {
//           padding: 3rem 1rem;
//           max-width: 1200px;
//           margin: 0 auto;
//         }

//         .header-title {
//           font-size: 3rem;
//           font-weight: 900;
//           background: linear-gradient(135deg, #00E5FF, #7F00FF);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           margin-bottom: 1rem;
//         }

//         .stats {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 1rem;
//           margin-top: 2rem;
//         }

//         .stat-card {
//           background: rgba(255, 255, 255, 0.05);
//           padding: 1.5rem;
//           border-radius: 1rem;
//           text-align: center;
//           transition: transform 0.3s;
//         }

//         .stat-card:hover {
//           transform: translateY(-4px);
//           background: rgba(255, 255, 255, 0.08);
//         }

//         .stat-value {
//           font-size: 2rem;
//           font-weight: bold;
//           margin-bottom: 0.5rem;
//           background: linear-gradient(135deg, #00E5FF, #7F00FF);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         /* Tabs */
//         .tabs {
//           max-width: 1200px;
//           margin: 0 auto 1rem;
//           padding: 0 1rem;
//           display: flex;
//           gap: 0.5rem;
//           overflow-x: auto;
//         }

//         .tab {
//           padding: 0.75rem 1.5rem;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 0.75rem;
//           color: #cbd5e1;
//           cursor: pointer;
//           white-space: nowrap;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           transition: all 0.3s;
//         }

//         .tab:hover {
//           background: rgba(255, 255, 255, 0.1);
//           transform: translateY(-2px);
//         }

//         .tab.active {
//           background: linear-gradient(135deg, #00E5FF, #7F00FF);
//           color: white;
//           box-shadow: 0 4px 15px rgba(0, 229, 255, 0.2);
//         }

//         /* Filters */
//         .filters {
//           max-width: 1200px;
//           margin: 0 auto 2rem;
//           padding: 0 1rem;
//         }

//         .filter-buttons {
//           display: flex;
//           gap: 0.5rem;
//           overflow-x: auto;
//           padding: 0.5rem;
//         }

//         .filter-btn {
//           padding: 0.5rem 1rem;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 0.75rem;
//           color: #cbd5e1;
//           cursor: pointer;
//           white-space: nowrap;
//           transition: all 0.3s;
//         }

//         .filter-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }

//         .filter-btn.active {
//           background: rgba(0, 229, 255, 0.2);
//           border-color: #00E5FF;
//           color: #00E5FF;
//           transform: translateY(-2px);
//         }

//         /* Posts Grid */
//         .posts-grid {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 1rem 4rem;
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 1.5rem;
//         }

//         @media (min-width: 768px) {
//           .posts-grid {
//             grid-template-columns: repeat(2, 1fr);
//           }
//         }

//         @media (min-width: 1024px) {
//           .posts-grid {
//             grid-template-columns: repeat(3, 1fr);
//           }
//         }

//         /* Post Card */
//         .post-card {
//           background: rgba(30, 41, 59, 0.5);
//           border-radius: 1rem;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           transition: all 0.3s;
//           position: relative;
//         }

//         .post-card:hover {
//           transform: translateY(-4px);
//           border-color: rgba(0, 229, 255, 0.3);
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
//         }

//         .post-card.new {
//           border-color: #00E5FF;
//           animation: glow 2s infinite;
//         }

//         @keyframes glow {
//           0%, 100% { box-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
//           50% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.5); }
//         }

//         .post-header {
//           padding: 1rem;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }

//         .post-user {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .user-avatar {
//           width: 3rem;
//           height: 3rem;
//           border-radius: 50%;
//           border: 2px solid #00E5FF;
//           object-fit: cover;
//         }

//         .user-info {
//           display: flex;
//           flex-direction: column;
//         }

//         .user-name {
//           font-weight: 600;
//           display: flex;
//           align-items: center;
//           gap: 0.25rem;
//         }

//         .user-streak {
//           font-size: 0.875rem;
//           color: #f59e0b;
//           display: flex;
//           align-items: center;
//           gap: 0.25rem;
//         }

//         .follow-btn {
//           padding: 0.5rem 1rem;
//           background: rgba(0, 229, 255, 0.1);
//           border: 1px solid rgba(0, 229, 255, 0.2);
//           border-radius: 0.75rem;
//           color: #00E5FF;
//           cursor: pointer;
//           font-size: 0.875rem;
//           transition: all 0.3s;
//         }

//         .follow-btn:hover {
//           background: rgba(0, 229, 255, 0.2);
//           transform: scale(1.05);
//         }

//         /* Post Media */
//         .post-media {
//           position: relative;
//           width: 100%;
//           aspect-ratio: 1;
//           overflow: hidden;
//           cursor: pointer;
//         }

//         .post-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           transition: transform 0.3s;
//         }

//         .post-card:hover .post-image {
//           transform: scale(1.05);
//         }

//         /* Like Animation */
//         .like-animation {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%) scale(0);
//           font-size: 3rem;
//           z-index: 10;
//           pointer-events: none;
//         }

//         .like-animation.active {
//           animation: likePop 0.8s ease-out;
//         }

//         @keyframes likePop {
//           0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
//           70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
//           100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
//         }

//         /* Badges */
//         .verification-badge {
//           position: absolute;
//           top: 0.5rem;
//           right: 0.5rem;
//           background: rgba(34, 197, 94, 0.9);
//           color: white;
//           padding: 0.25rem 0.5rem;
//           border-radius: 1rem;
//           font-size: 0.75rem;
//           display: flex;
//           align-items: center;
//           gap: 0.25rem;
//           z-index: 2;
//         }

//         .activity-badge {
//           position: absolute;
//           bottom: 0.5rem;
//           left: 0.5rem;
//           background: rgba(0, 0, 0, 0.8);
//           color: white;
//           padding: 0.25rem 0.75rem;
//           border-radius: 1rem;
//           font-size: 0.875rem;
//           z-index: 2;
//         }

//         /* Post Content */
//         .post-content {
//           padding: 1rem;
//         }

//         .post-caption {
//           margin-bottom: 1rem;
//           line-height: 1.5;
//         }

//         .post-meta {
//           display: flex;
//           gap: 1rem;
//           margin-bottom: 1rem;
//           color: #94a3b8;
//           font-size: 0.875rem;
//         }

//         .post-actions {
//           display: flex;
//           justify-content: space-between;
//           padding-top: 1rem;
//           border-top: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .action-btn {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.5rem;
//           background: none;
//           border: none;
//           color: #cbd5e1;
//           cursor: pointer;
//           border-radius: 0.5rem;
//           transition: all 0.3s;
//         }

//         .action-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }

//         .action-btn.liked {
//           color: #ef4444;
//         }

//         .action-btn.bookmarked {
//           color: #f59e0b;
//         }

//         /* Comments */
//         .comments-section {
//           max-height: 200px;
//           overflow-y: auto;
//           margin-bottom: 1rem;
//         }

//         .comment {
//           display: flex;
//           gap: 0.75rem;
//           padding: 0.75rem;
//           background: rgba(255, 255, 255, 0.03);
//           border-radius: 0.75rem;
//           margin-bottom: 0.5rem;
//         }

//         .comment-avatar {
//           width: 2rem;
//           height: 2rem;
//           border-radius: 50%;
//           object-fit: cover;
//         }

//         .comment-input {
//           display: flex;
//           gap: 0.5rem;
//           margin-bottom: 1rem;
//         }

//         .comment-input input {
//           flex: 1;
//           padding: 0.75rem;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 0.75rem;
//           color: white;
//         }

//         .send-btn {
//           padding: 0.75rem 1rem;
//           background: linear-gradient(135deg, #00E5FF, #7F00FF);
//           border: none;
//           border-radius: 0.75rem;
//           color: white;
//           cursor: pointer;
//           transition: all 0.3s;
//         }

//         .send-btn:hover {
//           transform: scale(1.05);
//         }

//         /* Modal */
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.8);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//           padding: 1rem;
//         }

//         .modal-content {
//           background: #1e293b;
//           border-radius: 1rem;
//           max-width: 500px;
//           width: 100%;
//           max-height: 90vh;
//           overflow-y: auto;
//           animation: modalSlideIn 0.3s ease-out;
//         }

//         @keyframes modalSlideIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .modal-header {
//           padding: 1.5rem;
//           text-align: center;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .modal-body {
//           padding: 1.5rem;
//         }

//         .upload-area {
//           border: 2px dashed rgba(255, 255, 255, 0.2);
//           border-radius: 1rem;
//           padding: 3rem;
//           text-align: center;
//           cursor: pointer;
//           margin-bottom: 1.5rem;
//           transition: all 0.3s;
//         }

//         .upload-area:hover {
//           border-color: #00E5FF;
//           background: rgba(0, 229, 255, 0.05);
//         }

//         .upload-preview {
//           width: 100%;
//           max-height: 300px;
//           border-radius: 0.75rem;
//           overflow: hidden;
//           margin-bottom: 1.5rem;
//         }

//         .form-input {
//           width: 100%;
//           padding: 0.75rem;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 0.75rem;
//           color: white;
//           margin-bottom: 1rem;
//           transition: all 0.3s;
//         }

//         .form-input:focus {
//           outline: none;
//           border-color: #00E5FF;
//           box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.1);
//         }

//         .modal-footer {
//           padding: 1.5rem;
//           display: flex;
//           gap: 1rem;
//         }

//         .btn-primary {
//           flex: 1;
//           padding: 1rem;
//           background: linear-gradient(135deg, #00E5FF, #7F00FF);
//           border: none;
//           border-radius: 0.75rem;
//           color: white;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s;
//         }

//         .btn-primary:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 5px 15px rgba(0, 229, 255, 0.3);
//         }

//         .btn-secondary {
//           flex: 1;
//           padding: 1rem;
//           background: rgba(255, 255, 255, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 0.75rem;
//           color: white;
//           cursor: pointer;
//           transition: all 0.3s;
//         }

//         .btn-secondary:hover {
//           background: rgba(255, 255, 255, 0.15);
//           transform: translateY(-2px);
//         }

//         /* Report Modal */
//         .report-reasons {
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//         }

//         .report-reason {
//           padding: 1rem;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 0.75rem;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           transition: all 0.3s;
//         }

//         .report-reason:hover {
//           background: rgba(239, 68, 68, 0.1);
//           border-color: rgba(239, 68, 68, 0.2);
//         }

//         .report-reason.selected {
//           background: rgba(239, 68, 68, 0.2);
//           border-color: #ef4444;
//         }

//         /* FAB */
//         .fab {
//           position: fixed;
//           bottom: 2rem;
//           right: 2rem;
//           padding: 1rem 1.5rem;
//           background: linear-gradient(135deg, #00E5FF, #7F00FF);
//           color: white;
//           border: none;
//           border-radius: 2rem;
//           font-weight: 600;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           box-shadow: 0 4px 20px rgba(0, 229, 255, 0.3);
//           transition: all 0.3s;
//           z-index: 50;
//         }

//         .fab:hover {
//           transform: translateY(-2px) scale(1.05);
//           box-shadow: 0 6px 25px rgba(0, 229, 255, 0.4);
//         }

//         /* Loading */
//         .loading {
//           text-align: center;
//           padding: 3rem;
//           color: #94a3b8;
//         }

//         .loading-spinner {
//           width: 3rem;
//           height: 3rem;
//           border: 3px solid rgba(255, 255, 255, 0.1);
//           border-top-color: #00E5FF;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin: 0 auto 1rem;
//         }

//         /* Empty State */
//         .empty-state {
//           grid-column: 1 / -1;
//           text-align: center;
//           padding: 4rem 2rem;
//           color: #94a3b8;
//         }

//         .empty-icon {
//           font-size: 4rem;
//           margin-bottom: 1rem;
//           opacity: 0.5;
//         }

//         /* Responsive */
//         @media (max-width: 640px) {
//           .header-title {
//             font-size: 2rem;
//           }
          
//           .stats {
//             grid-template-columns: 1fr;
//           }
          
//           .nav-container {
//             flex-wrap: wrap;
//           }
          
//           .nav-search {
//             order: 3;
//             width: 100%;
//             max-width: 100%;
//             margin-top: 0.5rem;
//           }
          
//           .new-posts-notification {
//             top: 60px;
//             padding: 0.75rem;
//             font-size: 0.875rem;
//           }
          
//           .fab {
//             bottom: 1rem;
//             right: 1rem;
//             padding: 0.75rem 1.25rem;
//             font-size: 0.875rem;
//           }
//         }
//       `}</style>

//       {/* New Posts Notification (Instagram-like) */}
//       {showNewPostsToast && newPostsCount > 0 && (
//         <div 
//           className="new-posts-notification"
//           onClick={loadNewPosts}
//         >
//           <Sparkles size={18} />
//           <span>{newPostsCount} new post{newPostsCount > 1 ? 's' : ''} • Tap to refresh</span>
//           <ChevronRight size={18} />
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="nav">
//         <div className="nav-container">
//           <div className="nav-logo" onClick={() => navigate('/dashboard')}>
//             TouchGrass
//           </div>
          
//           <div className="nav-search">
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Search posts..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <Search className="search-icon" size={18} />
//           </div>
          
//           <div className="nav-actions">
//             <button 
//               className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
//               onClick={handleManualRefresh}
//               title="Refresh feed"
//             >
//               <RefreshCw size={20} />
//             </button>
            
//             {userData && (
//               <button 
//                 className="nav-button"
//                 onClick={() => setShowUploadModal(true)}
//               >
//                 <Camera size={18} />
//                 Verify Today
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Header */}
//       <header className="header">
//         <h1 className="header-title">Verification Wall</h1>
//         <p>Real outdoor activities from our community. Share your progress and stay accountable.</p>
        
//         <div className="stats">
//           <div className="stat-card">
//             <div className="stat-value">{stats.totalPosts}</div>
//             <div>Total Posts</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-value">{stats.totalLikes}</div>
//             <div>Total Likes</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-value">{stats.activeUsers}</div>
//             <div>Active Members</div>
//           </div>
//         </div>
//       </header>

//       {/* Tabs */}
//       <div className="tabs">
//         <button 
//           className={`tab ${activeTab === 'all' ? 'active' : ''}`}
//           onClick={() => setActiveTab('all')}
//         >
//           <Globe size={18} />
//           All Posts
//         </button>
        
//         <button 
//           className={`tab ${activeTab === 'my-posts' ? 'active' : ''}`}
//           onClick={() => setActiveTab('my-posts')}
//         >
//           <User size={18} />
//           My Posts
//         </button>
        
//         <button 
//           className={`tab ${activeTab === 'following' ? 'active' : ''}`}
//           onClick={() => setActiveTab('following')}
//         >
//           <Users size={18} />
//           Following
//         </button>
        
//         <button 
//           className={`tab ${activeTab === 'trending' ? 'active' : ''}`}
//           onClick={() => setActiveTab('trending')}
//         >
//           <Flame size={18} />
//           Trending
//         </button>
        
//         <button 
//           className={`tab ${activeTab === 'verified' ? 'active' : ''}`}
//           onClick={() => setActiveTab('verified')}
//         >
//           <Verified size={18} />
//           Verified
//         </button>
//       </div>

//       {/* Activity Filters */}
//       <div className="filters">
//         <div className="filter-buttons">
//           <button 
//             className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
//             onClick={() => setActiveFilter('all')}
//           >
//             All Activities
//           </button>
          
//           {ACTIVITIES.map(activity => (
//             <button
//               key={activity.id}
//               className={`filter-btn ${activeFilter === activity.id ? 'active' : ''}`}
//               onClick={() => setActiveFilter(activity.id)}
//             >
//               {activity.emoji} {activity.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Refresh Indicator */}
//       {isRefreshing && (
//         <div className="refresh-indicator">
//           <RefreshCw size={18} className="spinner" />
//           <span>Loading new posts...</span>
//         </div>
//       )}

//       {/* Posts Grid */}
//       <div className="posts-grid">
//         {isLoading ? (
//           // Loading skeletons
//           [...Array(6)].map((_, i) => (
//             <div key={i} className="post-card">
//               <div style={{ height: '300px', background: 'rgba(255,255,255,0.1)' }} />
//               <div className="post-content">
//                 <div style={{ height: '20px', background: 'rgba(255,255,255,0.1)', marginBottom: '1rem' }} />
//                 <div style={{ height: '60px', background: 'rgba(255,255,255,0.1)' }} />
//               </div>
//             </div>
//           ))
//         ) : filteredPosts.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">🌿</div>
//             <h3>No posts found</h3>
//             <p>Try changing your filters or be the first to post!</p>
//             {userData && (
//               <button 
//                 className="btn-primary"
//                 onClick={() => setShowUploadModal(true)}
//                 style={{ marginTop: '1.5rem', padding: '0.75rem 2rem' }}
//               >
//                 <Camera size={18} />
//                 Post Your First Verification
//               </button>
//             )}
//           </div>
//         ) : (
//           filteredPosts.map((post, index) => (
//             <motion.div
//               key={post.id}
//               className={`post-card ${post.isNew ? 'new' : ''}`}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//             >
//               {/* New Post Indicator */}
//               {post.isNew && (
//                 <div className="new-post-indicator">
//                   <Sparkles size={12} /> NEW
//                 </div>
//               )}

//               {/* Post Header */}
//               <div className="post-header">
//                 <div className="post-user">
//                   <img 
//                     src={post.userAvatar}
//                     alt={post.userName}
//                     className="user-avatar"
//                   />
//                   <div className="user-info">
//                     <div className="user-name">
//                       {post.userName}
//                       {post.userVerified && <CheckCircle size={14} color="#22c55e" />}
//                     </div>
//                     <div className="user-streak">
//                       <Flame size={14} />
//                       Day {post.userStreak}
//                     </div>
//                   </div>
//                 </div>
                
//                 {userData && post.userId !== userData.username && (
//                   <button 
//                     className="follow-btn"
//                     onClick={() => handleFollow(post.userId)}
//                   >
//                     {following.includes(post.userId) ? 'Following' : 'Follow'}
//                   </button>
//                 )}
//               </div>

//               {/* Post Media */}
//               <div 
//                 className="post-media"
//                 onClick={() => post.mediaType === 'photo' && setShowFullImage(post.mediaUrl)}
//               >
//                 <img 
//                   src={post.mediaUrl}
//                   alt={post.caption}
//                   className="post-image"
//                   onError={(e) => {
//                     e.target.src = CLOUDINARY_PHOTOS[index % CLOUDINARY_PHOTOS.length];
//                   }}
//                 />
                
//                 {/* Like Animation */}
//                 {likeAnimation === post.id && (
//                   <div className="like-animation active">❤️</div>
//                 )}
                
//                 {/* Badges */}
//                 {post.verified && (
//                   <div className="verification-badge">
//                     <CheckCircle size={14} />
//                     Verified
//                   </div>
//                 )}
                
//                 <div 
//                   className="activity-badge"
//                   style={{ backgroundColor: post.activityBg, color: post.activityColor }}
//                 >
//                   {post.activityEmoji} {post.activityName}
//                 </div>
//               </div>

//               {/* Post Content */}
//               <div className="post-content">
//                 <p className="post-caption">{post.caption}</p>
                
//                 <div className="post-meta">
//                   <div className="meta-item">
//                     <MapPin size={16} />
//                     {post.location}
//                   </div>
//                   <div className="meta-item">
//                     <Clock size={16} />
//                     {post.duration} min
//                   </div>
//                   <div className="meta-item">
//                     {timeAgo(post.timestamp)}
//                   </div>
//                 </div>

//                 {/* Comments Section */}
//                 {post.comments && post.comments.length > 0 && (
//                   <div className="comments-section">
//                     {post.comments.slice(0, 2).map(comment => (
//                       <div key={comment.id} className="comment">
//                         <img 
//                           src={comment.userAvatar}
//                           alt={comment.userName}
//                           className="comment-avatar"
//                         />
//                         <div>
//                           <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
//                             {comment.userName}
//                           </div>
//                           <div style={{ fontSize: '0.875rem' }}>{comment.text}</div>
//                           <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
//                             {comment.likes} likes • {comment.time}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Comment Input */}
//                 {userData && !post.isBlocked && (
//                   <div className="comment-input">
//                     <input
//                       type="text"
//                       placeholder="Add a comment..."
//                       value={commentInputs[post.id] || ''}
//                       onChange={(e) => setCommentInputs(prev => ({ 
//                         ...prev, 
//                         [post.id]: e.target.value 
//                       }))}
//                       onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
//                     />
//                     <button 
//                       className="send-btn"
//                       onClick={() => handleComment(post.id)}
//                     >
//                       <Send size={18} />
//                     </button>
//                   </div>
//                 )}

//                 {/* Post Actions */}
//                 <div className="post-actions">
//                   <button 
//                     className={`action-btn ${post.isLiked ? 'liked' : ''}`}
//                     onClick={() => handleLike(post.id)}
//                     disabled={post.isBlocked}
//                   >
//                     <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
//                     {post.likes}
//                   </button>
                  
//                   <button 
//                     className="action-btn"
//                     onClick={() => {
//                       if (commentInputs[post.id]?.trim()) {
//                         handleComment(post.id);
//                       } else {
//                         setTimeout(() => {
//                           const input = document.querySelector(`[data-post-id="${post.id}"]`);
//                           if (input) input.focus();
//                         }, 100);
//                       }
//                     }}
//                     disabled={post.isBlocked}
//                   >
//                     <MessageCircle size={20} />
//                     {post.comments?.length || 0}
//                   </button>
                  
//                   <button 
//                     className={`action-btn ${post.isBookmarked ? 'bookmarked' : ''}`}
//                     onClick={() => handleBookmark(post.id)}
//                     disabled={post.isBlocked}
//                   >
//                     <Bookmark size={20} fill={post.isBookmarked ? 'currentColor' : 'none'} />
//                   </button>
                  
//                   <button 
//                     className="action-btn"
//                     onClick={() => handleShare(post)}
//                     disabled={post.isBlocked}
//                   >
//                     <Share2 size={20} />
//                     {post.shareCount}
//                   </button>
                  
//                   {userData && post.userId !== userData.username && !post.isBlocked && (
//                     <button 
//                       className="action-btn"
//                       onClick={() => {
//                         setReportPost(post);
//                         setShowReportModal(true);
//                       }}
//                     >
//                       <Flag size={20} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>

//       {/* Upload Modal */}
//       {showUploadModal && (
//         <div className="modal-overlay" onClick={() => !uploading && setShowUploadModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Verify Your Outdoor Activity</h2>
//               <p>Upload photo proof to share with the community</p>
//             </div>
            
//             <div className="modal-body">
//               {!uploadData.media ? (
//                 <div 
//                   className="upload-area"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <Camera size={48} />
//                   <p>Tap to upload photo/video</p>
//                   <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Max 10MB for photos, 100MB for videos</p>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*,video/*"
//                     onChange={handleMediaUpload}
//                     style={{ display: 'none' }}
//                   />
//                 </div>
//               ) : (
//                 <div className="upload-preview">
//                   {uploadData.mediaType === 'video' ? (
//                     <video src={uploadData.media} controls style={{ width: '100%' }} />
//                   ) : (
//                     <img src={uploadData.media} alt="Preview" style={{ width: '100%' }} />
//                   )}
//                 </div>
//               )}
              
//               <input
//                 type="text"
//                 className="form-input"
//                 placeholder="What did you do today? (Optional)"
//                 value={uploadData.caption}
//                 onChange={(e) => setUploadData({...uploadData, caption: e.target.value})}
//                 disabled={uploading}
//               />
              
//               <input
//                 type="text"
//                 className="form-input"
//                 placeholder="Location (Optional)"
//                 value={uploadData.location}
//                 onChange={(e) => setUploadData({...uploadData, location: e.target.value})}
//                 disabled={uploading}
//               />
              
//               <select 
//                 className="form-input"
//                 value={uploadData.activity}
//                 onChange={(e) => setUploadData({...uploadData, activity: e.target.value})}
//                 disabled={uploading}
//               >
//                 <option value="">Select activity</option>
//                 {ACTIVITIES.map(activity => (
//                   <option key={activity.id} value={activity.id}>
//                     {activity.emoji} {activity.name}
//                   </option>
//                 ))}
//               </select>
              
//               <input
//                 type="number"
//                 className="form-input"
//                 placeholder="Duration in minutes"
//                 value={uploadData.duration}
//                 onChange={(e) => setUploadData({...uploadData, duration: parseInt(e.target.value) || 30})}
//                 min="1"
//                 max="1440"
//                 disabled={uploading}
//               />
//             </div>
            
//             <div className="modal-footer">
//               <button 
//                 className="btn-secondary"
//                 onClick={() => {
//                   if (!uploading) {
//                     setShowUploadModal(false);
//                     setUploadData({
//                       media: null,
//                       mediaType: 'photo',
//                       caption: '',
//                       location: '',
//                       activity: 'walk',
//                       duration: 30,
//                       tags: []
//                     });
//                   }
//                 }}
//                 disabled={uploading}
//               >
//                 Cancel
//               </button>
              
//               <button 
//                 className="btn-primary"
//                 onClick={submitVerification}
//                 disabled={!uploadData.media || uploading}
//               >
//                 {uploading ? `Uploading... ${uploadProgress}%` : 'Post to Wall'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Report Modal */}
//       {showReportModal && reportPost && (
//         <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Report Post</h2>
//               <p>Help keep our community authentic</p>
//             </div>
            
//             <div className="modal-body">
//               <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem' }}>
//                 <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Reporting post by {reportPost.userName}</p>
//                 <p>"{reportPost.caption.substring(0, 100)}..."</p>
//               </div>
              
//               <div className="report-reasons">
//                 {REPORT_CATEGORIES.map(reason => (
//                   <div
//                     key={reason.id}
//                     className={`report-reason ${selectedReportReason === reason.id ? 'selected' : ''}`}
//                     onClick={() => setSelectedReportReason(reason.id)}
//                   >
//                     <div style={{ fontSize: '1.5rem' }}>{reason.icon}</div>
//                     <div>
//                       <div style={{ fontWeight: 600 }}>{reason.name}</div>
//                       <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{reason.description}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             <div className="modal-footer">
//               <button 
//                 className="btn-secondary"
//                 onClick={() => {
//                   setShowReportModal(false);
//                   setReportPost(null);
//                   setSelectedReportReason('');
//                 }}
//               >
//                 Cancel
//               </button>
              
//               <button 
//                 className="btn-primary"
//                 onClick={() => {
//                   if (selectedReportReason) {
//                     handleReport(reportPost.id, selectedReportReason);
//                   } else {
//                     toast.error('Please select a reason');
//                   }
//                 }}
//                 style={{ background: '#ef4444' }}
//               >
//                 Submit Report
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Full Image Modal */}
//       {showFullImage && (
//         <div className="modal-overlay" onClick={() => setShowFullImage(null)}>
//           <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}>
//             <img 
//               src={showFullImage} 
//               alt="Full size" 
//               style={{ 
//                 width: '100%', 
//                 height: '100%', 
//                 objectFit: 'contain',
//                 borderRadius: '0.5rem'
//               }} 
//             />
//             <button
//               onClick={() => setShowFullImage(null)}
//               style={{
//                 position: 'absolute',
//                 top: '1rem',
//                 right: '1rem',
//                 background: 'rgba(0,0,0,0.7)',
//                 border: 'none',
//                 color: 'white',
//                 width: '3rem',
//                 height: '3rem',
//                 borderRadius: '50%',
//                 cursor: 'pointer'
//               }}
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Floating Action Button */}
//       {userData && !showUploadModal && (
//         <button 
//           className="fab"
//           onClick={() => setShowUploadModal(true)}
//         >
//           <Camera size={20} />
//           Verify Today
//         </button>
//       )}
//     </div>
//   );
// };

// export default VerificationWall;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Home,
  Camera,
  Users,
  Calendar,
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle,
  X,
  User,
  UserPlus,
  Send,
  Verified,
  Filter as FilterIcon,
  Flag,
  AlertTriangle,
  Shield,
  Image as ImageIcon,
  Flame,
  Star,
  Globe,
  Bell,
  Search,
  UserCheck,
  Eye,
  Download,
  Copy,
  ExternalLink,
  Play,
  Volume2,
  VolumeX,
  Loader,
  Trash2,
  Edit,
  MoreVertical,
  RefreshCw,
  Zap,
  TrendingUp,
  Sparkles,
  Target,
  Activity,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'your-cloud-name',
  uploadPreset: 'touchgrass_verifications',
  apiUrl: 'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload'
};

const VerificationWall = () => {
  const navigate = useNavigate();
  
  // State Management
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [following, setFollowing] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportPost, setReportPost] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [likeAnimation, setLikeAnimation] = useState(null);
  const [selectedReportReason, setSelectedReportReason] = useState('');
  const [showFullImage, setShowFullImage] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState({});
  const [showActivityFilters, setShowActivityFilters] = useState(true);
  
  // Auto-refresh states
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [showNewPostsToast, setShowNewPostsToast] = useState(false);
  const [usedPhotoIndexes, setUsedPhotoIndexes] = useState(new Set());

  // Refs
  const fileInputRef = useRef(null);
  const videoRefs = useRef({});
  const postsContainerRef = useRef(null);
  const refreshIntervalRef = useRef(null);
  const newPostsTimeoutRef = useRef(null);

  // Upload Data
  const [uploadData, setUploadData] = useState({
    media: null,
    mediaType: 'photo',
    caption: '',
    location: '',
    activity: 'walk',
    duration: 30,
    tags: []
  });

  // ==================== DEMO DATA ====================

  // Cloudinary demo images (40 realistic outdoor photos) - DOUBLED THE COUNT
  const CLOUDINARY_PHOTOS = [
    // Nature and landscapes
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop&auto=format',
    
    // Hiking and trails
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1520095972714-909e91b038e5?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop&auto=format',
    
    // Beaches and oceans
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop&auto=format',
    
    // Mountains and peaks
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop&auto=format',
    
    // Forests and woods
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop&auto=format',
    
    // Outdoor activities
    'https://images.unsplash.com/photo-1511994717241-6c5b6b8e4455?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&auto=format',
    
    // Sunrise/sunset
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop&auto=format',
    
    // Parks and gardens
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1520095972714-909e91b038e5?w=800&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop&auto=format'
  ];

  const ACTIVITIES = [
    { id: 'walk', name: 'Walking', emoji: '🚶‍♂️', color: '#00E5FF', bg: 'rgba(0, 229, 255, 0.2)' },
    { id: 'run', name: 'Running', emoji: '🏃‍♂️', color: '#FF3366', bg: 'rgba(255, 51, 102, 0.2)' },
    { id: 'hike', name: 'Hiking', emoji: '🥾', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.2)' },
    { id: 'cycle', name: 'Cycling', emoji: '🚴‍♂️', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)' },
    { id: 'swim', name: 'Swimming', emoji: '🏊‍♂️', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)' },
    { id: 'yoga', name: 'Yoga', emoji: '🧘‍♂️', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.2)' },
    { id: 'meditate', name: 'Meditation', emoji: '🪷', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)' },
    { id: 'garden', name: 'Gardening', emoji: '🌱', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' },
    { id: 'sports', name: 'Sports', emoji: '⚽', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' },
    { id: 'explore', name: 'Exploring', emoji: '🧭', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)' }
  ];

  const REPORT_CATEGORIES = [
    { id: 'fake', name: 'Fake/Staged Photo', icon: '🎭', description: 'Not genuine outdoor activity' },
    { id: 'indoor', name: 'Indoor/Not Outdoor', icon: '🏠', description: 'Photo taken indoors' },
    { id: 'meme', name: 'Meme/Non-Serious', icon: '😂', description: 'Meme or joke content' },
    { id: 'inappropriate', name: 'Inappropriate Content', icon: '⚠️', description: 'Offensive or unsafe' },
    { id: 'spam', name: 'Spam or Irrelevant', icon: '📧', description: 'Not related to outdoor' },
    { id: 'copyright', name: 'Copyright Violation', icon: '©️', description: 'Stolen content' },
    { id: 'other', name: 'Other Issue', icon: '❓', description: 'Other problem' }
  ];

  // 30 Community members for more variety
  const COMMUNITY_MEMBERS = [
    { username: 'nature_lover', name: 'Alex Green 🌿', bio: 'Daily nature walks', location: 'Portland, OR', streak: 42, followers: 1247, verified: true },
    { username: 'mountain_mike', name: 'Mike Summit 🏔️', bio: 'Peak chaser | Trail runner', location: 'Denver, CO', streak: 89, followers: 2156, verified: true },
    { username: 'yoga_outdoors', name: 'Priya Zen 🧘‍♀️', bio: 'Sunrise yoga coach', location: 'San Diego, CA', streak: 67, followers: 1789, verified: true },
    { username: 'trail_blazer', name: 'Jamie Trail 🥾', bio: 'Ultra runner', location: 'Seattle, WA', streak: 156, followers: 3254, verified: true },
    { username: 'forest_soul', name: 'Sam Woods 🌲', bio: 'Forest therapy guide', location: 'Asheville, NC', streak: 103, followers: 1890, verified: false },
    { username: 'coastal_vibes', name: 'Emma Wave 🌊', bio: 'Beach walks expert', location: 'Miami, FL', streak: 78, followers: 1423, verified: true },
    { username: 'peak_performer', name: 'Ryan Peak ⛰️', bio: 'Mountain climber', location: 'Salt Lake City, UT', streak: 121, followers: 2678, verified: true },
    { username: 'zen_wanderer', name: 'Lily Path 🪷', bio: 'Mindful walking guide', location: 'Boulder, CO', streak: 95, followers: 1987, verified: false },
    { username: 'urban_hiker', name: 'Carlos Street 🏙️', bio: 'City explorer', location: 'New York, NY', streak: 56, followers: 987, verified: true },
    { username: 'wilderness_will', name: 'Will Forest 🌳', bio: 'Wilderness survival', location: 'Anchorage, AK', streak: 203, followers: 4321, verified: true },
    { username: 'sunrise_seeker', name: 'Maya Dawn 🌅', bio: 'Morning routine advocate', location: 'Austin, TX', streak: 134, followers: 2876, verified: true },
    { username: 'trail_mixer', name: 'Taylor Path 🛤️', bio: 'Trail running coach', location: 'Phoenix, AZ', streak: 87, followers: 1543, verified: false },
    { username: 'ocean_odyssey', name: 'Kai Ocean 🌊', bio: 'Ocean conservationist', location: 'Honolulu, HI', streak: 112, followers: 2345, verified: true },
    { username: 'mountain_medic', name: 'Dr. Peak ⚕️', bio: 'Mountain medicine', location: 'Colorado Springs, CO', streak: 65, followers: 1897, verified: true },
    { username: 'urban_yogi', name: 'Nina Om 🧘‍♀️', bio: 'Urban yoga teacher', location: 'Los Angeles, CA', streak: 98, followers: 2109, verified: false },
    { username: 'desert_dweller', name: 'Sandy Dunes 🏜️', bio: 'Desert explorer', location: 'Las Vegas, NV', streak: 76, followers: 1654, verified: true },
    { username: 'river_runner', name: 'Rio Rapids 🚣‍♂️', bio: 'White water rafter', location: 'Jackson Hole, WY', streak: 143, followers: 2987, verified: true },
    { username: 'forest_fairy', name: 'Faye Woods 🧚‍♀️', bio: 'Nature photographer', location: 'Burlington, VT', streak: 109, followers: 2456, verified: false },
    { username: 'cliff_caller', name: 'Rocky Edge 🧗‍♂️', bio: 'Rock climbing guide', location: 'Moab, UT', streak: 187, followers: 3678, verified: true },
    { username: 'meadow_muse', name: 'Flora Field 🌼', bio: 'Wildflower enthusiast', location: 'Portland, ME', streak: 92, followers: 1789, verified: true },
    { username: 'sky_soarer', name: 'Sky High 🦅', bio: 'Bird watching expert', location: 'Chicago, IL', streak: 67, followers: 1432, verified: false },
    { username: 'trail_trekker', name: 'Miles Path 🥾', bio: 'Long distance hiker', location: 'Atlanta, GA', streak: 178, followers: 3210, verified: true },
    { username: 'lake_lover', name: 'River Stone 🪨', bio: 'Lake swimmer', location: 'Minneapolis, MN', streak: 81, followers: 1678, verified: true },
    { username: 'peak_pursuer', name: 'Summit Seeker ⛰️', bio: '14er challenger', location: 'Boise, ID', streak: 156, followers: 2890, verified: true },
    { username: 'coast_cruiser', name: 'Sandy Shore 🏖️', bio: 'Beach runner', location: 'San Francisco, CA', streak: 134, followers: 2567, verified: false },
    { username: 'forest_floater', name: 'Zen Leaf 🍃', bio: 'Forest meditator', location: 'Eugene, OR', streak: 112, followers: 2341, verified: true },
    { username: 'mountain_mover', name: 'Rocky Trail 🪨', bio: 'Trail builder', location: 'Flagstaff, AZ', streak: 203, followers: 3987, verified: true },
    { username: 'water_warrior', name: 'Aqua Flow 💧', bio: 'Swimming coach', location: 'Maui, HI', streak: 145, followers: 2678, verified: false },
    { username: 'sun_chaser', name: 'Solar Soul ☀️', bio: 'Sunrise hunter', location: 'Key West, FL', streak: 98, followers: 1876, verified: true },
    { username: 'night_navigator', name: 'Moon Walker 🌙', bio: 'Night hiker', location: 'Sedona, AZ', streak: 76, followers: 1543, verified: true }
  ];

  const REAL_CAPTIONS = [
    "Day {streak} of my outdoor journey! The sunrise this morning was absolutely breathtaking. Nature never fails to reset my mind. 🍃 #TouchGrass",
    "Just completed a {activity} session. Fresh air therapy is the best medicine! Consistency is key to building habits. 🔥 #OutdoorLife",
    "Found my peace in the mountains today. The view from up here makes every step worth it. Day {streak} strong! ⛰️ #NatureTherapy",
    "Morning {activity} complete! Starting the day grounded and centered. Outdoor time = mental clarity. ✨ #WellnessJourney",
    "The sound of birds and the smell of pine - pure bliss. Another day verified in nature's classroom. 🌲 #OutdoorLiving",
    "Pushed my limits on the trail today. Growth happens outside the comfort zone! Day {streak} of showing up. 💪 #PersonalGrowth",
    "Forest bathing session complete. Letting nature's calm wash over me. So grateful for this community! 🙏 #Mindfulness",
    "Coastal walk with ocean breeze therapy. The waves have a way of washing away stress. 🌊 #CoastalLiving",
    "Mountain air and clear thoughts. Every outdoor moment is an investment in mental health. 🏔️ #MentalHealthMatters",
    "Sunset meditation by the lake. Reflection time is growth time. Day {streak} of intentional living. 🌅 #DailyPractice",
    "Just finished an amazing {activity} session! The fresh air was exactly what I needed today. #OutdoorWellness",
    "Another beautiful day to be outside! Completed my {activity} routine and feeling refreshed. 🌞 #NatureLover",
    "The trail was challenging but rewarding today. Every step forward is progress! 🥾 #HikingAdventures",
    "Water activities are my favorite way to connect with nature! Just spent {duration} minutes swimming. 🏊‍♂️ #WaterTherapy",
    "Found a hidden gem today during my {activity}. Nature always has surprises waiting! 🎁 #ExploreMore",
    "Morning {activity} with a view that can't be beat. Starting the day right! 🌄 #MorningRoutine",
    "The discipline of daily outdoor time is transforming my life. Day {streak} and going strong! 💫 #DailyDiscipline",
    "Nothing beats the feeling of accomplishment after a good {activity} session! #FitnessGoals",
    "Disconnected from screens, connected with nature. The perfect balance for mental wellness. 📵 #DigitalDetox",
    "Shared this beautiful moment with amazing people from our community. Grateful for these connections! 👥 #CommunityLove"
  ];

  const REAL_LOCATIONS = [
    'Central Park, NYC',
    'Mount Rainier National Park',
    'Pacific Coast Highway, CA',
    'Yosemite Valley, CA',
    'Lake District, UK',
    'Swiss Alps, Switzerland',
    'Japanese Garden, Portland',
    'Rocky Mountains, CO',
    'Appalachian Trail',
    'Norwegian Fjords',
    'Banff National Park, Canada',
    'Great Smoky Mountains',
    'Big Sur, California',
    'Yellowstone National Park',
    'Blue Ridge Parkway',
    'Grand Canyon, AZ',
    'Zion National Park, UT',
    'Acadia National Park, ME',
    'Lake Tahoe, CA/NV',
    'Hawaiian Volcanoes National Park',
    'Glacier National Park, MT',
    'Arches National Park, UT',
    'Sedona Red Rocks, AZ',
    'Florida Everglades',
    'Alaska Wilderness',
    'California Redwoods',
    'Texas Hill Country',
    'Colorado River',
    'Mississippi River Trail',
    'Appalachian Mountains'
  ];

  // ==================== AUTO-REFRESH FUNCTIONS ====================

  // Get a unique photo index that hasn't been used recently
  const getUniquePhotoIndex = () => {
    // If all photos have been used, reset the used indexes
    if (usedPhotoIndexes.size >= CLOUDINARY_PHOTOS.length * 0.8) {
      setUsedPhotoIndexes(new Set());
    }
    
    let availableIndexes = [];
    for (let i = 0; i < CLOUDINARY_PHOTOS.length; i++) {
      if (!usedPhotoIndexes.has(i)) {
        availableIndexes.push(i);
      }
    }
    
    // If no unique photos left, use any random photo
    if (availableIndexes.length === 0) {
      return Math.floor(Math.random() * CLOUDINARY_PHOTOS.length);
    }
    
    // Pick a random unique photo
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    setUsedPhotoIndexes(prev => new Set([...prev, randomIndex]));
    return randomIndex;
  };

  // Generate new random post with guaranteed unique photo
  const generateNewPost = useCallback(() => {
    const randomMember = COMMUNITY_MEMBERS[Math.floor(Math.random() * COMMUNITY_MEMBERS.length)];
    const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
    const now = new Date();
    
    // Make post seem recent (1-10 minutes ago)
    const minutesAgo = Math.floor(Math.random() * 10) + 1;
    const postDate = new Date(now - minutesAgo * 60000);
    
    // Get a guaranteed unique photo
    const photoIndex = getUniquePhotoIndex();
    
    const newPost = {
      id: `new_post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: randomMember.username,
      userName: randomMember.name,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomMember.username}_${Date.now()}`,
      userBio: randomMember.bio,
      userLocation: randomMember.location,
      userStreak: randomMember.streak,
      userFollowers: randomMember.followers,
      userVerified: randomMember.verified,
      mediaUrl: CLOUDINARY_PHOTOS[photoIndex],
      mediaType: 'photo',
      caption: REAL_CAPTIONS[Math.floor(Math.random() * REAL_CAPTIONS.length)]
        .replace('{streak}', randomMember.streak)
        .replace('{activity}', activity.name.toLowerCase())
        .replace('{duration}', [15, 30, 45, 60][Math.floor(Math.random() * 4)]),
      location: REAL_LOCATIONS[Math.floor(Math.random() * REAL_LOCATIONS.length)],
      activity: activity.id,
      activityName: activity.name,
      activityEmoji: activity.emoji,
      activityColor: activity.color,
      activityBg: activity.bg,
      duration: [15, 30, 45, 60, 90][Math.floor(Math.random() * 5)],
      likes: Math.floor(Math.random() * 30) + 5, // New posts start with fewer likes
      comments: generateDemoComments(randomMember.username),
      isLiked: false,
      isBookmarked: false,
      isReported: false,
      reportCount: 0,
      reports: [],
      verificationScore: Math.floor(Math.random() * 20) + 80,
      verified: Math.random() > 0.3,
      trending: false,
      featured: false,
      isBlocked: false,
      timestamp: postDate.toISOString(),
      tags: ['touchgrass', activity.id, 'outdoor', 'nature', 'new', 'fresh'],
      shareCount: Math.floor(Math.random() * 5),
      views: Math.floor(Math.random() * 50),
      isNew: true // Flag to identify newly added posts
    };
    
    return newPost;
  }, []);

  // Generate demo comments for new posts
  const generateDemoComments = (postOwner) => {
    const commenters = COMMUNITY_MEMBERS
      .filter(member => member.username !== postOwner)
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    const comments = [
      "Amazing dedication! 💪 Your consistency inspires me!",
      "Beautiful view! Keep up the great work! 🌅",
      "Day {streak} strong here too! 🙏",
      "Nature therapy at its finest! 🌿",
      "The consistency is unreal! 🔥",
      "Outdoor time = mental clarity. So true! ✨",
      "Adding this location to my bucket list! 🏔️",
      "Fresh air is the best medicine indeed! 🌞",
      "The discipline is inspiring! 💫",
      "Love seeing real progress. Keep shining! 🌟",
      "Just wow! This motivates me to get outside today! 🚀",
      "That view is incredible! Thanks for sharing! 📸",
      "Your dedication to daily outdoor time is inspiring! 🌟",
      "This makes me want to go for a walk right now! 🚶‍♂️",
      "Beautiful shot! The colors are amazing! 🎨",
      "Another day, another verification! Love seeing your journey! 💚",
      "The outdoor community is the best! Thanks for being part of it! 👥",
      "That looks so peaceful and refreshing! 🧘‍♂️",
      "Keep up the amazing work! Your posts always brighten my feed! ☀️",
      "The consistency is paying off! Looking strong! 💪"
    ];
    
    return commenters.map((commenter, index) => ({
      id: `comment_${Date.now()}_${index}`,
      userId: commenter.username,
      userName: commenter.name,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${commenter.username}_${Date.now()}`,
      userStreak: commenter.streak,
      text: comments[Math.floor(Math.random() * comments.length)].replace('{streak}', commenter.streak),
      time: 'Just now',
      likes: Math.floor(Math.random() * 3),
      isLiked: false,
      verified: commenter.verified,
      timestamp: new Date().toISOString()
    }));
  };

  // Simulate checking for new posts (like Instagram)
  const checkForNewPosts = useCallback(() => {
    if (!autoRefreshEnabled || isRefreshing) return;
    
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTime;
    
    // Only check every 30-90 seconds (like Instagram)
    if (timeSinceLastRefresh > 30000 && Math.random() > 0.5) {
      const newPostCount = Math.floor(Math.random() * 3) + 1; // 1-3 new posts
      setNewPostsCount(prev => prev + newPostCount);
      setShowNewPostsToast(true);
      
      // Auto-hide toast after 5 seconds
      if (newPostsTimeoutRef.current) {
        clearTimeout(newPostsTimeoutRef.current);
      }
      newPostsTimeoutRef.current = setTimeout(() => {
        setShowNewPostsToast(false);
      }, 5000);
    }
  }, [autoRefreshEnabled, isRefreshing, lastRefreshTime]);

  // Manual refresh function (pull to refresh)
  const handleManualRefresh = useCallback(() => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setLastRefreshTime(Date.now());
    
    // Simulate network delay
    setTimeout(() => {
      // Add some new posts
      const newPostsToAdd = Math.floor(Math.random() * 4) + 2; // 2-5 new posts
      const newPosts = [];
      
      for (let i = 0; i < newPostsToAdd; i++) {
        newPosts.push(generateNewPost());
      }
      
      setPosts(prev => [...newPosts, ...prev]);
      setNewPostsCount(0);
      setShowNewPostsToast(false);
      
      // Update localStorage
      const storedPosts = JSON.parse(localStorage.getItem('touchgrass_verification_posts') || '[]');
      localStorage.setItem('touchgrass_verification_posts', JSON.stringify([...newPosts, ...storedPosts]));
      
      setIsRefreshing(false);
      toast.success(`Loaded ${newPostsToAdd} new posts with fresh photos! ✨`);
    }, 1500);
  }, [isRefreshing, generateNewPost]);

  // Load new posts when user clicks notification
  const loadNewPosts = useCallback(() => {
    if (newPostsCount === 0 || isRefreshing) return;
    
    setIsRefreshing(true);
    
    setTimeout(() => {
      const newPosts = [];
      for (let i = 0; i < newPostsCount; i++) {
        newPosts.push(generateNewPost());
      }
      
      setPosts(prev => [...newPosts, ...prev]);
      setNewPostsCount(0);
      setShowNewPostsToast(false);
      setLastRefreshTime(Date.now());
      
      // Update localStorage
      const storedPosts = JSON.parse(localStorage.getItem('touchgrass_verification_posts') || '[]');
      localStorage.setItem('touchgrass_verification_posts', JSON.stringify([...newPosts, ...storedPosts]));
      
      setIsRefreshing(false);
      
      // Scroll to top to see new posts
      if (postsContainerRef.current) {
        postsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      toast.success(`Loaded ${newPostsCount} new posts! 📸`);
    }, 1000);
  }, [newPostsCount, isRefreshing, generateNewPost]);

  // Initialize auto-refresh interval
  useEffect(() => {
    // Check for new posts every 15-45 seconds (randomized to feel more natural)
    refreshIntervalRef.current = setInterval(() => {
      checkForNewPosts();
    }, 15000 + Math.random() * 30000); // 15-45 seconds

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (newPostsTimeoutRef.current) {
        clearTimeout(newPostsTimeoutRef.current);
      }
    };
  }, [checkForNewPosts]);

  // Initialize used photo indexes on first load
  useEffect(() => {
    // Mark some initial photos as used
    const initialUsed = new Set();
    for (let i = 0; i < 10; i++) {
      initialUsed.add(Math.floor(Math.random() * CLOUDINARY_PHOTOS.length));
    }
    setUsedPhotoIndexes(initialUsed);
  }, []);

  // ==================== REST OF THE CODE (Same as before with minor updates) ====================

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
    
    try {
      const response = await fetch(CLOUDINARY_CONFIG.apiUrl, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.secure_url) {
        return {
          url: data.secure_url,
          publicId: data.public_id,
          type: data.resource_type
        };
      }
      throw new Error('Upload failed');
    } catch (error) {
      throw error;
    }
  };

  const timeAgo = useCallback((timestamp) => {
    if (!timestamp) return 'Recently';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo`;
    return `${Math.floor(seconds / 31536000)}y`;
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('touchgrass_user') || 'null');
    if (user) {
      setUserData(user);
      loadFollowing(user.username);
      loadVerificationData();
    } else {
      navigate('/auth');
    }

    // Listen for verification wall updates from other components
    const handleVerificationWallUpdate = (event) => {
      loadVerificationData();
    };

    window.addEventListener('verification-wall-updated', handleVerificationWallUpdate);

    return () => {
      window.removeEventListener('verification-wall-updated', handleVerificationWallUpdate);
    };
  }, [navigate]);

  const loadVerificationData = useCallback(() => {
    setIsLoading(true);
    try {
      const storedPosts = JSON.parse(localStorage.getItem('touchgrass_verification_posts') || '[]');

      if (storedPosts.length > 0) {
        setPosts(storedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } else {
        const demoPosts = generateDemoPosts();
        setPosts(demoPosts);
        localStorage.setItem('touchgrass_verification_posts', JSON.stringify(demoPosts));
      }
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate initial demo posts
  const generateDemoPosts = () => {
    const posts = [];
    const now = new Date();
    
    // Use first 20 community members for initial posts
    COMMUNITY_MEMBERS.slice(0, 20).forEach((member, index) => {
      const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      const hoursAgo = index * 2;
      const postDate = new Date(now - hoursAgo * 3600000);
      
      // Use a photo from the first half of the array for initial posts
      const photoIndex = index % (CLOUDINARY_PHOTOS.length / 2);
      
      const post = {
        id: `post_${member.username}_${Date.now()}_${index}`,
        userId: member.username,
        userName: member.name,
        userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`,
        userBio: member.bio,
        userLocation: member.location,
        userStreak: member.streak,
        userFollowers: member.followers,
        userVerified: member.verified,
        mediaUrl: CLOUDINARY_PHOTOS[photoIndex],
        mediaType: 'photo',
        caption: REAL_CAPTIONS[Math.floor(Math.random() * REAL_CAPTIONS.length)]
          .replace('{streak}', member.streak)
          .replace('{activity}', activity.name.toLowerCase()),
        location: REAL_LOCATIONS[Math.floor(Math.random() * REAL_LOCATIONS.length)],
        activity: activity.id,
        activityName: activity.name,
        activityEmoji: activity.emoji,
        activityColor: activity.color,
        activityBg: activity.bg,
        duration: [15, 30, 45, 60, 90][Math.floor(Math.random() * 5)],
        likes: Math.floor(Math.random() * 300) + 50,
        comments: generateDemoComments(member.username),
        isLiked: false,
        isBookmarked: false,
        isReported: false,
        reportCount: 0,
        reports: [],
        verificationScore: Math.floor(Math.random() * 30) + 70,
        verified: Math.random() > 0.3,
        trending: false,
        featured: false,
        isBlocked: false,
        timestamp: postDate.toISOString(),
        tags: ['touchgrass', activity.id, 'outdoor', 'nature'],
        shareCount: Math.floor(Math.random() * 20),
        views: Math.floor(Math.random() * 500) + 100,
        isNew: false
      };
      
      posts.push(post);
      // Mark this photo as used
      setUsedPhotoIndexes(prev => new Set([...prev, photoIndex]));
    });
    
    return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const loadFollowing = (username) => {
    const stored = JSON.parse(localStorage.getItem(`touchgrass_following_${username}`) || '[]');
    setFollowing(stored);
  };

  // ==================== INTERACTION FUNCTIONS ====================

  const handleLike = useCallback((postId) => {
    if (!userData) {
      toast.error('Please login to like posts');
      return;
    }

    setLikeAnimation(postId);
    setTimeout(() => setLikeAnimation(null), 800);

    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId) {
          const wasLiked = post.isLiked;
          const newLikes = wasLiked ? post.likes - 1 : post.likes + 1;
          
          return {
            ...post,
            likes: newLikes,
            isLiked: !wasLiked
          };
        }
        return post;
      });

      localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
      return updatedPosts;
    });

    toast.success(posts.find(p => p.id === postId)?.isLiked ? 'Unliked' : 'Liked! ❤️');
  }, [userData, posts]);

  const handleComment = useCallback((postId) => {
    const text = commentInputs[postId] || '';
    if (!text.trim() || !userData) {
      toast.error('Please write a comment');
      return;
    }

    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userData.username,
      userName: userData.displayName || userData.username,
      userAvatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      userStreak: userData.streak || 0,
      text: text,
      time: 'Just now',
      likes: 0,
      isLiked: false,
      verified: true,
      timestamp: new Date().toISOString()
    };

    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [newComment, ...(post.comments || [])]
          };
        }
        return post;
      });

      localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
      return updatedPosts;
    });

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    toast.success('Comment added! 💬');
  }, [userData, commentInputs]);

  const handleReport = useCallback((postId, reason) => {
    if (!userData) {
      toast.error('Please login to report');
      return;
    }

    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId) {
          const newReport = {
            userId: userData.username,
            reason,
            timestamp: new Date().toISOString()
          };
          
          const updatedReports = [...(post.reports || []), newReport];
          const newReportCount = updatedReports.length;
          
          const shouldBlock = newReportCount >= 3;
          
          const updatedPost = {
            ...post,
            reportCount: newReportCount,
            reports: updatedReports,
            isBlocked: shouldBlock,
            isReported: true
          };
          
          if (shouldBlock) {
            toast.error(`⚠️ Post blocked due to ${newReportCount} reports.`, {
              duration: 5000,
            });
          } else {
            toast.success('Report submitted. Thank you! 🛡️');
          }
          
          return updatedPost;
        }
        return post;
      });

      localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
      return updatedPosts;
    });

    setShowReportModal(false);
    setReportPost(null);
    setSelectedReportReason('');
  }, [userData]);

  const handleFollow = useCallback((userId) => {
    if (!userData) {
      toast.error('Please login to follow');
      return;
    }

    const key = `touchgrass_following_${userData.username}`;
    const currentFollowing = JSON.parse(localStorage.getItem(key) || '[]');
    
    let newFollowing;
    if (currentFollowing.includes(userId)) {
      newFollowing = currentFollowing.filter(id => id !== userId);
      toast.success(`Unfollowed`);
    } else {
      newFollowing = [...currentFollowing, userId];
      toast.success(`Following`, { icon: '👥' });
    }
    
    localStorage.setItem(key, JSON.stringify(newFollowing));
    setFollowing(newFollowing);
  }, [userData]);

  const handleBookmark = useCallback((postId) => {
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isBookmarked: !post.isBookmarked
          };
        }
        return post;
      });

      localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
      return updatedPosts;
    });

    const isBookmarked = posts.find(p => p.id === postId)?.isBookmarked;
    toast.success(isBookmarked ? 'Post removed from saved' : 'Post saved! 📌');
  }, [posts]);

  const handleShare = useCallback((post) => {
    if (navigator.share) {
      navigator.share({
        title: `${post.userName}'s outdoor activity`,
        text: post.caption,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard! 📋');
    }
    
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(p => {
        if (p.id === post.id) {
          return {
            ...p,
            shareCount: p.shareCount + 1
          };
        }
        return p;
      });

      localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
      return updatedPosts;
    });
    
    setShowShareMenu({});
  }, []);

  const handleMediaUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload an image or video file');
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    
    if (file.size > maxSize) {
      toast.error(`File too large. Max ${isVideo ? '100MB' : '10MB'}`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadData(prev => ({
        ...prev,
        media: reader.result,
        mediaType: isVideo ? 'video' : 'photo'
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const submitVerification = useCallback(async () => {
    if (!uploadData.media || !userData) {
      toast.error('Please upload proof of your outdoor activity');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const activity = ACTIVITIES.find(a => a.id === uploadData.activity) || ACTIVITIES[0];
      
      // Get a unique photo for user's post
      const photoIndex = getUniquePhotoIndex();
      
      const newPost = {
        id: `post_${userData.username}_${Date.now()}`,
        userId: userData.username,
        userName: userData.displayName || userData.username,
        userAvatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        userBio: userData.bio || 'Outdoor enthusiast',
        userLocation: userData.location || 'Exploring',
        userStreak: 1,
        userFollowers: 0,
        userVerified: true,
        mediaUrl: uploadData.media || CLOUDINARY_PHOTOS[photoIndex],
        mediaType: uploadData.mediaType,
        caption: uploadData.caption || `My outdoor activity! ${activity.emoji}`,
        location: uploadData.location || 'Outdoors',
        activity: uploadData.activity,
        activityName: activity.name,
        activityEmoji: activity.emoji,
        activityColor: activity.color,
        activityBg: activity.bg,
        duration: uploadData.duration,
        likes: 0,
        comments: [],
        isLiked: false,
        isBookmarked: false,
        isReported: false,
        reportCount: 0,
        reports: [],
        verificationScore: 100,
        verified: true,
        trending: true,
        featured: false,
        isBlocked: false,
        timestamp: new Date().toISOString(),
        tags: ['touchgrass', uploadData.activity, 'myverification'],
        shareCount: 0,
        views: 0,
        isNew: true
      };

      clearInterval(progressInterval);
      setUploadProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      setMyPosts([newPost, ...myPosts]);
      
      localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
      setUploadData({
        media: null,
        mediaType: 'photo',
        caption: '',
        location: '',
        activity: 'walk',
        duration: 30,
        tags: []
      });
      setShowUploadModal(false);
      
      toast.success('✅ Verification posted successfully with a fresh photo!');
      
    } catch (error) {
      toast.error('Failed to upload. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [uploadData, userData, posts, myPosts]);

  // ==================== FILTERING ====================

  const getFilteredPosts = useCallback(() => {
    let filtered = posts.filter(post => !post.isBlocked);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.caption?.toLowerCase().includes(query) ||
        post.userName?.toLowerCase().includes(query) ||
        post.location?.toLowerCase().includes(query)
      );
    }
    
    switch (activeTab) {
      case 'my-posts':
        filtered = filtered.filter(post => post.userId === userData?.username);
        break;
      case 'following':
        filtered = filtered.filter(post => following.includes(post.userId));
        break;
      case 'trending':
        filtered = filtered.filter(post => post.likes >= 50);
        break;
      case 'verified':
        filtered = filtered.filter(post => post.verified);
        break;
    }
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(post => post.activity === activeFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [posts, activeTab, activeFilter, following, userData, searchQuery]);

  const filteredPosts = getFilteredPosts();
  const stats = {
    totalPosts: posts.length,
    totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
    activeUsers: new Set(posts.map(p => p.userId)).size
  };

  // ==================== RENDER ====================

  return (
    <div className="verification-wall" ref={postsContainerRef}>
      <style>{`
        /* Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .verification-wall {
          min-height: 100vh;
          background: #0f172a;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        /* New Posts Notification (Instagram-like) */
        .new-posts-notification {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          z-index: 90;
          background: linear-gradient(135deg, #00E5FF, #7F00FF);
          color: white;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          animation: slideDown 0.3s ease-out;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .new-posts-notification:hover {
          background: linear-gradient(135deg, #00d4e6, #7200e6);
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Refresh Indicator */
        .refresh-indicator {
          text-align: center;
          padding: 1rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          animation: pulse 2s infinite;
        }

        .refresh-indicator .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* New Post Indicator */
        .new-post-indicator {
          position: absolute;
          top: 10px;
          left: 10px;
          background: linear-gradient(135deg, #00E5FF, #7F00FF);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 5;
          animation: pulse 2s infinite;
        }

        /* Fresh Photo Badge */
        .fresh-photo-badge {
          position: absolute;
          top: 10px;
          right: 60px;
          background: linear-gradient(135deg, #22c55e, #10b981);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.7rem;
          font-weight: 600;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* Navigation */
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(135deg, #00E5FF, #7F00FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          cursor: pointer;
        }

        .nav-search {
          flex: 1;
          max-width: 400px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: white;
          font-size: 0.875rem;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-button {
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #00E5FF, #7F00FF);
          border: none;
          border-radius: 0.75rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .refresh-button {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem;
          border-radius: 0.75rem;
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .refresh-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(180deg);
        }

        .refresh-button.refreshing {
          animation: spin 1s linear infinite;
        }

        /* Header */
        .header {
          padding: 3rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-title {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00E5FF, #7F00FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 1rem;
          text-align: center;
          transition: transform 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.08);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #00E5FF, #7F00FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Tabs */
        .tabs {
          max-width: 1200px;
          margin: 0 auto 1rem;
          padding: 0 1rem;
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: #cbd5e1;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }

        .tab:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .tab.active {
          background: linear-gradient(135deg, #00E5FF, #7F00FF);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 229, 255, 0.2);
        }

        /* Filters */
        .filters {
          max-width: 1200px;
          margin: 0 auto 2rem;
          padding: 0 1rem;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: #cbd5e1;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .filter-btn.active {
          background: rgba(0, 229, 255, 0.2);
          border-color: #00E5FF;
          color: #00E5FF;
          transform: translateY(-2px);
        }

        /* Posts Grid */
        .posts-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem 4rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .posts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .posts-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Post Card */
        .post-card {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
          position: relative;
        }

        .post-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 229, 255, 0.3);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .post-card.new {
          border-color: #00E5FF;
          animation: glow 2s infinite;
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
          50% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.5); }
        }

        .post-header {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .post-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          border: 2px solid #00E5FF;
          object-fit: cover;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .user-streak {
          font-size: 0.875rem;
          color: #f59e0b;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .follow-btn {
          padding: 0.5rem 1rem;
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid rgba(0, 229, 255, 0.2);
          border-radius: 0.75rem;
          color: #00E5FF;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s;
        }

        .follow-btn:hover {
          background: rgba(0, 229, 255, 0.2);
          transform: scale(1.05);
        }

        /* Post Media */
        .post-media {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          cursor: pointer;
          background: #000;
        }

        .post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .post-card:hover .post-image {
          transform: scale(1.05);
        }

        /* Like Animation */
        .like-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          font-size: 3rem;
          z-index: 10;
          pointer-events: none;
        }

        .like-animation.active {
          animation: likePop 0.8s ease-out;
        }

        @keyframes likePop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }

        /* Badges */
        .verification-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(34, 197, 94, 0.9);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          z-index: 2;
        }

        .activity-badge {
          position: absolute;
          bottom: 0.5rem;
          left: 0.5rem;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          z-index: 2;
        }

        /* Post Content */
        .post-content {
          padding: 1rem;
        }

        .post-caption {
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .post-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .post-actions {
          display: flex;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: none;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          border-radius: 0.5rem;
          transition: all 0.3s;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .action-btn.liked {
          color: #ef4444;
        }

        .action-btn.bookmarked {
          color: #f59e0b;
        }

        /* Comments */
        .comments-section {
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 1rem;
        }

        .comment {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .comment-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          object-fit: cover;
        }

        .comment-input {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .comment-input input {
          flex: 1;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: white;
        }

        .send-btn {
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #00E5FF, #7F00FF);
          border: none;
          border-radius: 0.75rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .send-btn:hover {
          transform: scale(1.05);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: #1e293b;
          border-radius: 1rem;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          padding: 1.5rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-body {
          padding: 1.5rem;
        }

        .upload-area {
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          padding: 3rem;
          text-align: center;
          cursor: pointer;
          margin-bottom: 1.5rem;
          transition: all 0.3s;
        }

        .upload-area:hover {
          border-color: #00E5FF;
          background: rgba(0, 229, 255, 0.05);
        }

        .upload-preview {
          width: 100%;
          max-height: 300px;
          border-radius: 0.75rem;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: white;
          margin-bottom: 1rem;
          transition: all 0.3s;
        }

        .form-input:focus {
          outline: none;
          border-color: #00E5FF;
          box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.1);
        }

        .modal-footer {
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
        }

        .btn-primary {
          flex: 1;
          padding: 1rem;
          background: linear-gradient(135deg, #00E5FF, #7F00FF);
          border: none;
          border-radius: 0.75rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 229, 255, 0.3);
        }

        .btn-secondary {
          flex: 1;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        /* Report Modal */
        .report-reasons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .report-reason {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s;
        }

        .report-reason:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .report-reason.selected {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
        }

        /* FAB */
        .fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #00E5FF, #7F00FF);
          color: white;
          border: none;
          border-radius: 2rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 20px rgba(0, 229, 255, 0.3);
          transition: all 0.3s;
          z-index: 50;
        }

        .fab:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 25px rgba(0, 229, 255, 0.4);
        }

        /* Loading */
        .loading {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #00E5FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: #94a3b8;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .header-title {
            font-size: 2rem;
          }
          
          .stats {
            grid-template-columns: 1fr;
          }
          
          .nav-container {
            flex-wrap: wrap;
          }
          
          .nav-search {
            order: 3;
            width: 100%;
            max-width: 100%;
            margin-top: 0.5rem;
          }
          
          .new-posts-notification {
            top: 60px;
            padding: 0.75rem;
            font-size: 0.875rem;
          }
          
          .fab {
            bottom: 1rem;
            right: 1rem;
            padding: 0.75rem 1.25rem;
            font-size: 0.875rem;
          }
        }
      `}</style>

      {/* New Posts Notification (Instagram-like) */}
      {showNewPostsToast && newPostsCount > 0 && (
        <div 
          className="new-posts-notification"
          onClick={loadNewPosts}
        >
          <Sparkles size={18} />
          <span>{newPostsCount} new post{newPostsCount > 1 ? 's' : ''} with fresh photos • Tap to refresh</span>
          <ChevronRight size={18} />
        </div>
      )}

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/dashboard')}>
            TouchGrass
          </div>
          
          <div className="nav-search">
            <input
              type="text"
              className="search-input"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="search-icon" size={18} />
          </div>
          
          <div className="nav-actions">
            <button 
              className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleManualRefresh}
              title="Refresh feed with new photos"
            >
              <RefreshCw size={20} />
            </button>
            
            {userData && (
              <button 
                className="nav-button"
                onClick={() => setShowUploadModal(true)}
              >
                <Camera size={18} />
                Verify Today
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="header">
        <h1 className="header-title">Verification Wall</h1>
        <p>Real outdoor activities from our community. Share your progress and stay accountable.</p>
        
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{stats.totalPosts}</div>
            <div>Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalLikes}</div>
            <div>Total Likes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.activeUsers}</div>
            <div>Active Members</div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Globe size={18} />
          All Posts
        </button>
        
        {/* <button 
          className={`tab ${activeTab === 'my-posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-posts')}
        >
          <User size={18} />
          
        </button> */}
        
        <button 
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          <Users size={18} />
          Following
        </button>
        
        <button 
          className={`tab ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          <Flame size={18} />
          Trending
        </button>
        
        <button 
          className={`tab ${activeTab === 'verified' ? 'active' : ''}`}
          onClick={() => setActiveTab('verified')}
        >
          <Verified size={18} />
          Verified
        </button>
      </div>

      {/* Activity Filters */}
      <div className="filters">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Activities
          </button>
          
          {ACTIVITIES.map(activity => (
            <button
              key={activity.id}
              className={`filter-btn ${activeFilter === activity.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(activity.id)}
            >
              {activity.emoji} {activity.name}
            </button>
          ))}
        </div>
      </div>

      {/* Refresh Indicator */}
      {isRefreshing && (
        <div className="refresh-indicator">
          <RefreshCw size={18} className="spinner" />
          <span>Loading new posts with fresh photos...</span>
        </div>
      )}

      {/* Posts Grid */}
      <div className="posts-grid">
        {isLoading ? (
          // Loading skeletons
          [...Array(6)].map((_, i) => (
            <div key={i} className="post-card">
              <div style={{ height: '300px', background: 'rgba(255,255,255,0.1)' }} />
              <div className="post-content">
                <div style={{ height: '20px', background: 'rgba(255,255,255,0.1)', marginBottom: '1rem' }} />
                <div style={{ height: '60px', background: 'rgba(255,255,255,0.1)' }} />
              </div>
            </div>
          ))
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌿</div>
            <h3>No posts found</h3>
            <p>Try changing your filters or be the first to post!</p>
            {userData && (
              <button 
                className="btn-primary"
                onClick={() => setShowUploadModal(true)}
                style={{ marginTop: '1.5rem', padding: '0.75rem 2rem' }}
              >
                <Camera size={18} />
                Post Your First Verification
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className={`post-card ${post.isNew ? 'new' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* New Post Indicator */}
              {post.isNew && (
                <>
                  <div className="new-post-indicator">
                    <Sparkles size={12} /> NEW
                  </div>
                  <div className="fresh-photo-badge">
                    <ImageIcon size={12} /> Fresh Photo
                  </div>
                </>
              )}

              {/* Post Header */}
              <div className="post-header">
                <div className="post-user">
                  <img 
                    src={post.userAvatar}
                    alt={post.userName}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <div className="user-name">
                      {post.userName}
                      {post.userVerified && <CheckCircle size={14} color="#22c55e" />}
                    </div>
                    <div className="user-streak">
                      <Flame size={14} />
                      Day {post.userStreak}
                    </div>
                  </div>
                </div>
                
                {userData && post.userId !== userData.username && (
                  <button 
                    className="follow-btn"
                    onClick={() => handleFollow(post.userId)}
                  >
                    {following.includes(post.userId) ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              {/* Post Media */}
              <div 
                className="post-media"
                onClick={() => post.mediaType === 'photo' && setShowFullImage(post.mediaUrl)}
              >
                <img 
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="post-image"
                  onError={(e) => {
                    // Fallback to a different photo if original fails
                    e.target.src = CLOUDINARY_PHOTOS[Math.floor(Math.random() * CLOUDINARY_PHOTOS.length)];
                  }}
                />
                
                {/* Like Animation */}
                {likeAnimation === post.id && (
                  <div className="like-animation active">❤️</div>
                )}
                
                {/* Badges */}
                {post.verified && (
                  <div className="verification-badge">
                    <CheckCircle size={14} />
                    Verified
                  </div>
                )}
                
                <div 
                  className="activity-badge"
                  style={{ backgroundColor: post.activityBg, color: post.activityColor }}
                >
                  {post.activityEmoji} {post.activityName}
                </div>
              </div>

              {/* Post Content */}
              <div className="post-content">
                <p className="post-caption">{post.caption}</p>
                
                <div className="post-meta">
                  <div className="meta-item">
                    <MapPin size={16} />
                    {post.location}
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    {post.duration} min
                  </div>
                  <div className="meta-item">
                    {timeAgo(post.timestamp)}
                  </div>
                </div>

                {/* Comments Section */}
                {post.comments && post.comments.length > 0 && (
                  <div className="comments-section">
                    {post.comments.slice(0, 2).map(comment => (
                      <div key={comment.id} className="comment">
                        <img 
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="comment-avatar"
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            {comment.userName}
                          </div>
                          <div style={{ fontSize: '0.875rem' }}>{comment.text}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                            {comment.likes} likes • {comment.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                {userData && !post.isBlocked && (
                  <div className="comment-input">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ 
                        ...prev, 
                        [post.id]: e.target.value 
                      }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                    />
                    <button 
                      className="send-btn"
                      onClick={() => handleComment(post.id)}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                )}

                {/* Post Actions */}
                <div className="post-actions">
                  <button 
                    className={`action-btn ${post.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                    disabled={post.isBlocked}
                  >
                    <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                    {post.likes}
                  </button>
                  
                  <button 
                    className="action-btn"
                    onClick={() => {
                      if (commentInputs[post.id]?.trim()) {
                        handleComment(post.id);
                      } else {
                        setTimeout(() => {
                          const input = document.querySelector(`[data-post-id="${post.id}"]`);
                          if (input) input.focus();
                        }, 100);
                      }
                    }}
                    disabled={post.isBlocked}
                  >
                    <MessageCircle size={20} />
                    {post.comments?.length || 0}
                  </button>
                  
                  <button 
                    className={`action-btn ${post.isBookmarked ? 'bookmarked' : ''}`}
                    onClick={() => handleBookmark(post.id)}
                    disabled={post.isBlocked}
                  >
                    <Bookmark size={20} fill={post.isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                  
                  <button 
                    className="action-btn"
                    onClick={() => handleShare(post)}
                    disabled={post.isBlocked}
                  >
                    <Share2 size={20} />
                    {post.shareCount}
                  </button>
                  
                  {userData && post.userId !== userData.username && !post.isBlocked && (
                    <button 
                      className="action-btn"
                      onClick={() => {
                        setReportPost(post);
                        setShowReportModal(true);
                      }}
                    >
                      <Flag size={20} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => !uploading && setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Verify Your Outdoor Activity</h2>
              <p>Upload photo proof to share with the community</p>
            </div>
            
            <div className="modal-body">
              {!uploadData.media ? (
                <div 
                  className="upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={48} />
                  <p>Tap to upload photo/video</p>
                  <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Max 10MB for photos, 100MB for videos</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="upload-preview">
                  {uploadData.mediaType === 'video' ? (
                    <video src={uploadData.media} controls style={{ width: '100%' }} />
                  ) : (
                    <img src={uploadData.media} alt="Preview" style={{ width: '100%' }} />
                  )}
                </div>
              )}
              
              <input
                type="text"
                className="form-input"
                placeholder="What did you do today? (Optional)"
                value={uploadData.caption}
                onChange={(e) => setUploadData({...uploadData, caption: e.target.value})}
                disabled={uploading}
              />
              
              <input
                type="text"
                className="form-input"
                placeholder="Location (Optional)"
                value={uploadData.location}
                onChange={(e) => setUploadData({...uploadData, location: e.target.value})}
                disabled={uploading}
              />
              
              <select 
                className="form-input"
                value={uploadData.activity}
                onChange={(e) => setUploadData({...uploadData, activity: e.target.value})}
                disabled={uploading}
              >
                <option value="">Select activity</option>
                {ACTIVITIES.map(activity => (
                  <option key={activity.id} value={activity.id}>
                    {activity.emoji} {activity.name}
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                className="form-input"
                placeholder="Duration in minutes"
                value={uploadData.duration}
                onChange={(e) => setUploadData({...uploadData, duration: parseInt(e.target.value) || 30})}
                min="1"
                max="1440"
                disabled={uploading}
              />
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  if (!uploading) {
                    setShowUploadModal(false);
                    setUploadData({
                      media: null,
                      mediaType: 'photo',
                      caption: '',
                      location: '',
                      activity: 'walk',
                      duration: 30,
                      tags: []
                    });
                  }
                }}
                disabled={uploading}
              >
                Cancel
              </button>
              
              <button 
                className="btn-primary"
                onClick={submitVerification}
                disabled={!uploadData.media || uploading}
              >
                {uploading ? `Uploading... ${uploadProgress}%` : 'Post to Wall'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && reportPost && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report Post</h2>
              <p>Help keep our community authentic</p>
            </div>
            
            <div className="modal-body">
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem' }}>
                <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Reporting post by {reportPost.userName}</p>
                <p>"{reportPost.caption.substring(0, 100)}..."</p>
              </div>
              
              <div className="report-reasons">
                {REPORT_CATEGORIES.map(reason => (
                  <div
                    key={reason.id}
                    className={`report-reason ${selectedReportReason === reason.id ? 'selected' : ''}`}
                    onClick={() => setSelectedReportReason(reason.id)}
                  >
                    <div style={{ fontSize: '1.5rem' }}>{reason.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{reason.name}</div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{reason.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowReportModal(false);
                  setReportPost(null);
                  setSelectedReportReason('');
                }}
              >
                Cancel
              </button>
              
              <button 
                className="btn-primary"
                onClick={() => {
                  if (selectedReportReason) {
                    handleReport(reportPost.id, selectedReportReason);
                  } else {
                    toast.error('Please select a reason');
                  }
                }}
                style={{ background: '#ef4444' }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {showFullImage && (
        <div className="modal-overlay" onClick={() => setShowFullImage(null)}>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}>
            <img 
              src={showFullImage} 
              alt="Full size" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                borderRadius: '0.5rem'
              }} 
            />
            <button
              onClick={() => setShowFullImage(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.7)',
                border: 'none',
                color: 'white',
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {userData && !showUploadModal && (
        <button 
          className="fab"
          onClick={() => setShowUploadModal(true)}
        >
          <Camera size={20} />
          Verify Today
        </button>
      )}
    </div>
  );
};

export default VerificationWall;