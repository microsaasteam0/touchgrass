import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useStreak } from '../contexts/StreakContext';
import streakService from '../services/streakservice';
import { verificationWallApi } from '../services/api';
import { 
  Camera, 
  Video, 
  Upload, 
  X, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  Trophy,
  Users,
  Calendar,
  ArrowLeft,
  FileUp,
  Image as ImageIcon,
  Mic,
  Zap,
  Loader2,
  MapPin,
  Hash,
  Globe,
  Smile,
  Link as LinkIcon,
  Image,
  Film
} from 'lucide-react';

const Verify = () => {
  const navigate = useNavigate();
  const { 
    streakData: contextStreakData, 
    loadStreakData, 
    currentStreak, 
    longestStreak,
    refreshStreak 
  } = useStreak();
  const [verificationMethod, setVerificationMethod] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [shameMessage, setShameMessage] = useState('');
  const [duration, setDuration] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    rank: 1000,
    nextCheckpoint: '23:59:59'
  });
  const [showCamera, setShowCamera] = useState(false);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaType, setMediaType] = useState('photo');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // New state for verification wall features
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [privacy, setPrivacy] = useState('public');
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);
  const [mediaUploaded, setMediaUploaded] = useState(false);
  const [canVerifyStatus, setCanVerifyStatus] = useState({ canVerify: true, hoursRemaining: 0 });
  
  const cameraRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const dropZoneRef = useRef(null);
  const captionInputRef = useRef(null);
  const autoVerifyTimerRef = useRef(null);

  // Check if user can verify (cooldown check)
  const checkCanVerifyStatus = async () => {
    try {
      const status = await streakService.checkCanVerify();
      setCanVerifyStatus(status);
    } catch (error) {
      console.error('Error checking canVerify status:', error);
    }
  };

  const durations = [5, 15, 30, 60, 120];
  const roasts = [
    "Still a digital zombie, I see. Your chair must be fused to your skin by now.",
    "Another day indoors? Even houseplants get more sunlight than you.",
    "Your vitamin D levels are crying. Go outside.",
    "Your screen time is longer than your life expectancy at this rate.",
    "The grass is calling. Unfortunately, it's saying 'I don't know this person.'",
    "You've evolved from human to houseplant. At least they photosynthesize."
  ];

  useEffect(() => {
    loadUserData();
    loadLocalStreakData();
    setupDragAndDrop();
    calculateTimeLeft();
    checkCanVerifyStatus();
    
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => {
      cleanupMediaStreams();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (autoVerifyTimerRef.current) {
        clearTimeout(autoVerifyTimerRef.current);
      }
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  const loadUserData = () => {
    try {
      // Check for Supabase session first (which is what streakService uses)
      const supabaseTokenKey = 'sb-lkrwoidwisbwktndxoca-auth-token';
      const supabaseToken = localStorage.getItem(supabaseTokenKey);
      
      if (supabaseToken) {
        // User is logged in via Supabase - parse the token to get user info
        try {
          const parsed = JSON.parse(supabaseToken);
          if (parsed?.user) {
            setUserData(parsed.user);
            return;
          }
          // Try alternative format
          const sessionData = JSON.parse(supabaseToken);
          if (sessionData?.access_token) {
            // User has a valid session
            setUserData({ 
              id: sessionData.user?.id || 'unknown',
              username: sessionData.user?.email?.split('@')[0] || 'user',
              email: sessionData.user?.email
            });
            return;
          }
        } catch (e) {
          console.log('Could not parse Supabase token');
        }
      }
      
      // Fallback to touchgrass_user (legacy)
      const storedUser = localStorage.getItem('touchgrass_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);
      } else {
        // Check if user has any auth - if so, allow them to proceed
        // The streakService will handle the actual auth check
        console.log('No local user found, but allowing verification to proceed');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadLocalStreakData = () => {
    try {
      // If we have context streak data from the app, use that
      if (contextStreakData) {
        setStreakData({
          current: currentStreak || 0,
          longest: longestStreak || 0,
          rank: Math.floor(Math.random() * 1000) + 1,
          nextCheckpoint: '23:59:59'
        });
        return;
      }
      
      // Try to get streak from userData if available
      if (userData?.username) {
        const streakKey = `touchgrass_streak_${userData.username}`;
        const storedStreak = localStorage.getItem(streakKey);
        
        if (storedStreak) {
          const streak = JSON.parse(storedStreak);
          setStreakData({
            current: streak.currentStreak || 0,
            longest: streak.longestStreak || 0,
            rank: Math.floor(Math.random() * 1000) + 1,
            nextCheckpoint: '23:59:59'
          });
        }
      }
    } catch (error) {
      console.error('Error loading streak data:', error);
    }
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const difference = endOfDay - now;
    
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    setStreakData(prev => ({ ...prev, nextCheckpoint: timeString }));
  };

  const setupDragAndDrop = () => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragEnter = (e) => {
      preventDefaults(e);
      setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
      preventDefaults(e);
      if (!dropZone.contains(e.relatedTarget)) {
        setIsDragOver(false);
      }
    };

    const handleDragOver = (e) => {
      preventDefaults(e);
      setIsDragOver(true);
    };

    const handleDrop = (e) => {
      preventDefaults(e);
      setIsDragOver(false);
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleDroppedFiles(files);
      }
    };

    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('drop', handleDrop);
    };
  };

  const handleDroppedFiles = (files) => {
    if (files.length === 0) return;

    const file = files[0];
    const type = file.type.startsWith('image/') ? 'photo' : 
                  file.type.startsWith('video/') ? 'video' : null;

    if (!type) {
      toast.error('Please drop an image or video file');
      return;
    }

    setMediaType(type);
    handleFileUpload({ target: { files: [file] } }, type);
  };

  const cleanupMediaStreams = () => {
    if (cameraRef.current?.srcObject) {
      cameraRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (videoRecorderRef.current?.srcObject) {
      videoRecorderRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleFileUpload = (event, type = 'photo') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = type === 'photo' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`${type === 'photo' ? 'Image' : 'Video'} size must be less than ${type === 'photo' ? '10MB' : '50MB'}`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          
          const reader = new FileReader();
          reader.onloadend = () => {
            if (type === 'photo') {
              setPhoto(reader.result);
              setMediaType('photo');
              toast.success('Photo uploaded successfully!');
            } else {
              setVideo(reader.result);
              setMediaType('video');
              toast.success('Video uploaded successfully!');
            }
          };
          reader.readAsDataURL(file);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const startCamera = (type = 'photo') => {
    cleanupMediaStreams();
    setMediaUploaded(false);
    
    if (type === 'photo') {
      setShowCamera(true);
      setShowVideoRecorder(false);
    } else {
      setShowVideoRecorder(true);
      setShowCamera(false);
      setRecordingTime(0);
    }
    
    setTimeout(() => {
      const constraints = type === 'photo' 
        ? { video: { facingMode: 'environment' }, audio: false }
        : { video: { facingMode: 'environment' }, audio: true };
      
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          const element = type === 'photo' ? cameraRef.current : videoRecorderRef.current;
          if (element) {
            element.srcObject = stream;
            
            if (type === 'video') {
              mediaRecorderRef.current = new MediaRecorder(stream);
              recordedChunksRef.current = [];
              
              mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                  recordedChunksRef.current.push(event.data);
                }
              };
              
              mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
                const videoURL = URL.createObjectURL(blob);
                setVideo(videoURL);
                setMediaType('video');
                toast.success('Video recorded successfully!');
              };
            }
          }
        })
        .catch(err => {
          toast.error('Camera access denied. Please check permissions.');
          setShowCamera(false);
          setShowVideoRecorder(false);
        });
    }, 100);
  };

  const capturePhoto = () => {
    if (!cameraRef.current) return;

    const canvas = document.createElement('canvas');
    const video = cameraRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    setPhoto(photoData);
    setMediaType('photo');
    setShowCamera(false);
    
    cleanupMediaStreams();
    toast.success('Photo captured!');
  };

  const startVideoRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    recordedChunksRef.current = [];
    mediaRecorderRef.current.start();
    
    setRecordingTime(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) {
          stopVideoRecording();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
    
    toast.success('Recording started...');
  };

  const stopVideoRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;
    
    mediaRecorderRef.current.stop();
    clearInterval(recordingTimerRef.current);
    setShowVideoRecorder(false);
    
    cleanupMediaStreams();
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          const locationName = data.display_name.split(',')[0] || 'Unknown location';
          setLocation(locationName);
          setShowLocationInput(true);
          toast.success('Location detected!');
        } catch (error) {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setShowLocationInput(true);
          toast.success('Location coordinates captured!');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Could not get your location. You can enter it manually.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const updateDashboardAndProfileStreak = () => {
    // If no userData, we still allow verification to proceed - just skip local storage update
    if (!userData) {
      console.log('No userData, but API verification succeeded - returning mock streak');
      // Return a mock streak object so the verification can proceed
      return {
        currentStreak: 1,
        longestStreak: 1
      };
    }

    const streakKey = `touchgrass_streak_${userData.username}`;
    const existingStreak = localStorage.getItem(streakKey);
    let streak = existingStreak ? JSON.parse(existingStreak) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVerificationDate: null,
      verificationHistory: []
    };

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    console.log('Current streak before update:', streak);
    console.log('Today:', today);
    console.log('Last verification date:', streak.lastVerificationDate);
    
    // Check if already verified today
    if (streak.lastVerificationDate === today) {
      console.log('Already verified today');
      toast.error('You have already verified today!');
      return null;
    }

    // Update streak logic
    let newStreakValue = streak.currentStreak;
    
    if (streak.lastVerificationDate === yesterday) {
      // Consecutive day
      newStreakValue = streak.currentStreak + 1;
      console.log('Consecutive day! New streak:', newStreakValue);
    } else {
      // Streak broken or first verification
      newStreakValue = 1;
      console.log('New streak started:', newStreakValue);
    }

    // Update streak object
    streak.currentStreak = newStreakValue;
    
    // Update longest streak if needed
    if (newStreakValue > streak.longestStreak) {
      streak.longestStreak = newStreakValue;
    }

    streak.lastVerificationDate = today;
    
    // Add to verification history
    if (!streak.verificationHistory) {
      streak.verificationHistory = [];
    }
    
    streak.verificationHistory.push({
      date: today,
      type: verificationMethod,
      duration: duration,
      timestamp: new Date().toISOString()
    });

    // Keep only last 30 days of history
    if (streak.verificationHistory.length > 30) {
      streak.verificationHistory = streak.verificationHistory.slice(-30);
    }

    // Save to localStorage
    localStorage.setItem(streakKey, JSON.stringify(streak));
    console.log('✅ Streak updated:', streak);

    // Update user data in multiple places
    const userKey = `touchgrass_user_${userData.username}`;
    const existingUser = localStorage.getItem(userKey);
    if (existingUser) {
      const user = JSON.parse(existingUser);
      user.streak = streak.currentStreak;
      user.longestStreak = streak.longestStreak;
      user.lastActive = today;
      localStorage.setItem(userKey, JSON.stringify(user));
    }

    // Update main user object
    const mainUserKey = 'touchgrass_user';
    const mainUser = localStorage.getItem(mainUserKey);
    if (mainUser) {
      const user = JSON.parse(mainUser);
      user.streak = streak.currentStreak;
      user.longestStreak = streak.longestStreak;
      user.lastActive = today;
      localStorage.setItem(mainUserKey, JSON.stringify(user));
    }

    // Update streak data in context
    setStreakData(prev => ({
      ...prev,
      current: streak.currentStreak,
      longest: streak.longestStreak
    }));

    return streak;
  };

  // Compress image to reduce size for localStorage
  const compressImage = (base64Image, maxWidth = 800, quality = 0.6) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        // If image fails to load, return original
        resolve(base64Image);
      };
      img.src = base64Image;
    });
  };

  const submitVerification = async (method) => {
    if (method === 'photo' && !photo && !video) {
      toast.error('Please upload a photo or video first');
      return;
    }

    if (method === 'shame' && shameMessage.length < 10) {
      toast.error('Shame message must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if user can verify (skip check for testing - use force in API)
      console.log('Checking if user can verify...');
      const canVerifyStatus = await streakService.checkCanVerify();
      console.log('Can verify status:', canVerifyStatus);
      
      // Check if user can verify - show toast if cooldown is active
      if (!canVerifyStatus.canVerify) {
        const hoursMsg = canVerifyStatus.hoursRemaining 
          ? `${canVerifyStatus.hoursRemaining} hours` 
          : 'a while';
        toast.error(`⏰ You've already verified today! Please wait ${hoursMsg} before verifying again.`);
        setIsSubmitting(false);
        
        // Refresh canVerify status
        const newStatus = await streakService.checkCanVerify();
        setCanVerifyStatus(newStatus);
        return;
      }

      // Prepare verification data
      const verificationData = {
        method: method,
        duration: method === 'photo' ? duration : 0,
        activity: 'Outdoor time',
        shameMessage: method === 'shame' ? shameMessage : null,
        caption: caption || null,
        location: location || null,
        mediaUrl: method === 'photo' ? photo : video,
        tags: tags.length > 0 ? tags : null,
        privacy: privacy,
        force: false // Let backend enforce 23-hour cooldown
      };

      console.log('Submitting verification:', verificationData);

      // Submit verification
      const result = await streakService.verifyToday(verificationData);
      console.log('Verification result:', result);
      
      if (result.success) {
        console.log('✅ Verification successful!', result.streak);
        
        // Update canVerify status to false after successful verification
        setCanVerifyStatus({ canVerify: false, hoursRemaining: 23 });
        
        // Dispatch event to update streak on dashboard and profile
        window.dispatchEvent(new CustomEvent('streak-updated', { detail: { streak: result.streak } }));
        
        // Update dashboard and profile streaks (local storage)
        const updatedStreak = updateDashboardAndProfileStreak();
        console.log('Updated local streak:', updatedStreak);
        
        // Clear streak cache and reload from server to ensure consistency
        streakService.clearCache();
        await loadStreakData();
        await refreshStreak();
        console.log('Streak data reloaded from server');
        
        // Continue with success flow even if local update failed (server data is authoritative)
        // if (!updatedStreak) {
        //   setIsSubmitting(false);
        //   return;
        // }

        // Create verification post for the wall
        // Compress image first to prevent localStorage issues
        let mediaToSave = video;
        if (method === 'photo') {
          try {
            mediaToSave = await compressImage(photo);
          } catch (e) {
            mediaToSave = photo; // Fallback to original if compression fails
          }
        }
        
        const post = {
          id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: userData?.id || 'anonymous',
          username: userData?.username || 'user',
          userAvatar: userData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.username || 'User')}&background=22c55e&color=fff`,
          type: method,
          media: mediaToSave,
          mediaType: mediaType,
          caption: caption || (method === 'shame' ? shameMessage : ''),
          timestamp: new Date().toISOString(),
          duration: method === 'photo' ? duration : 0,
          location: location || null,
          tags: tags,
          likes: 0,
          likedBy: [],
          comments: 0,
          streakDay: updatedStreak.currentStreak,
          shameMessage: method === 'shame' ? shameMessage : null,
          privacy: privacy,
          verified: true
        };

        // Save to localStorage for the wall
        const postsKey = 'touchgrass_verification_posts';
        try {
          const existingPosts = localStorage.getItem(postsKey);
          let posts = existingPosts ? JSON.parse(existingPosts) : [];
          
          posts.unshift(post);
          
          if (posts.length > 50) {
            posts = posts.slice(0, 50);
          }
          
          localStorage.setItem(postsKey, JSON.stringify(posts));
          console.log('✅ Post saved to verification wall');
        } catch (storageError) {
          console.warn('⚠️ LocalStorage error:', storageError.message);
        }

        // Dispatch custom event to notify verification wall to refresh
        window.dispatchEvent(new CustomEvent('verification-wall-updated', { detail: { post } }));
        
        // Trigger storage event for other tabs
        window.dispatchEvent(new Event('storage'));

        // Save user posts
        try {
          const userPostsKey = `touchgrass_user_posts_${userData?.username}`;
          const existingUserPosts = localStorage.getItem(userPostsKey);
          let userPosts = existingUserPosts ? JSON.parse(existingUserPosts) : [];
          userPosts.unshift(post);
          if (userPosts.length > 30) userPosts = userPosts.slice(0, 30);
          localStorage.setItem(userPostsKey, JSON.stringify(userPosts));
        } catch (userStorageError) {
          console.warn('⚠️ User posts storage error:', userStorageError.message);
        }

        // Update activity feed
        try {
          const feedKey = 'touchgrass_activity_feed';
          const existingFeed = localStorage.getItem(feedKey);
          let feed = existingFeed ? JSON.parse(existingFeed) : [];
          
          const activity = {
            id: `activity_${Date.now()}`,
            type: method === 'photo' ? 'verification' : 'shame',
            username: userData?.username || 'user',
            userAvatar: userData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.username || 'User')}&background=22c55e&color=fff`,
            timestamp: new Date().toISOString(),
            duration: method === 'photo' ? duration : 0,
            streakDay: updatedStreak.currentStreak,
            caption: caption || (method === 'shame' ? shameMessage : ''),
            postId: post.id
          };
          
          feed.unshift(activity);
          if (feed.length > 100) feed = feed.slice(0, 100);
          localStorage.setItem(feedKey, JSON.stringify(feed));
        } catch (feedError) {
          console.warn('⚠️ Feed storage error:', feedError.message);
        }

        // Try to send to API
        try {
          // Format data for backend API
          const wallPostData = {
            photoUrl: method === 'photo' ? photo : video, // base64 or URL
            activityType: 'walk', // default activity
            duration: method === 'photo' ? duration : 30,
            caption: caption || (method === 'shame' ? shameMessage : ''),
            location: location || null,
            tags: tags.length > 0 ? tags : []
          };
          
          const apiResponse = await verificationWallApi.createPost(wallPostData);
          console.log('✅ Verification wall API response:', apiResponse);
          
          // If API returns the created post, add it to local posts
          if (apiResponse.success && apiResponse.post) {
            const apiPost = {
              id: apiResponse.post._id,
              userId: apiResponse.post.userId._id || apiResponse.post.userId,
              userName: apiResponse.post.userId.displayName || apiResponse.post.userId.username || 'User',
              userAvatar: apiResponse.post.userId.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiResponse.post.userId._id || apiResponse.post.userId}`,
              mediaUrl: apiResponse.post.photoUrl,
              mediaType: apiResponse.post.photoUrl?.includes('video') ? 'video' : 'photo',
              caption: apiResponse.post.caption,
              location: apiResponse.post.location,
              activity: apiResponse.post.activityType,
              activityName: apiResponse.post.activityType,
              activityEmoji: '🌱',
              activityColor: '#22c55e',
              duration: apiResponse.post.duration,
              likes: apiResponse.post.likeCount || 0,
              comments: [],
              isLiked: false,
              isBookmarked: false,
              isReported: false,
              reportCount: 0,
              reports: [],
              verificationScore: 100,
              verified: true,
              trending: false,
              featured: false,
              isBlocked: false,
              timestamp: apiResponse.post.createdAt,
              tags: apiResponse.post.tags || [],
              shareCount: 0,
              views: 0,
              isNew: true
            };
            
            // Add to localStorage posts
            const postsKey = 'touchgrass_verification_posts';
            const existingPosts = localStorage.getItem(postsKey);
            let posts = existingPosts ? JSON.parse(existingPosts) : [];
            posts.unshift(apiPost);
            if (posts.length > 50) posts = posts.slice(0, 50);
            localStorage.setItem(postsKey, JSON.stringify(posts));
          }
          
          // Dispatch event to update verification wall
          window.dispatchEvent(new Event('verification-wall-updated'));
        } catch (wallError) {
          console.warn('⚠️ Verification wall API error:', wallError.message);
          // Even if API fails, the post is saved locally, so we continue
        }

        // Refresh streak data from context
        await refreshStreak();
        
        setIsSubmitting(false);
        setShowSuccess(true);
        
        if (method === 'photo') {
          toast.success(`🌱 Success! Your streak is now ${updatedStreak.currentStreak} days!`);
        } else {
          toast.success('😈 Shame accepted. Your streak continues...');
        }
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to submit verification');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Failed to submit verification');
      setIsSubmitting(false);
    }
  };

  const removeMedia = () => {
    if (mediaType === 'photo') {
      setPhoto(null);
    } else {
      setVideo(null);
    }
    setMediaType('photo');
    setMediaUploaded(false);
    if (autoVerifyTimerRef.current) {
      clearTimeout(autoVerifyTimerRef.current);
    }
  };

  const styles = `
    .verify-page {
      min-height: 100vh;
      background: #050505;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    .verify-bg-grid {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      z-index: 1;
    }

    .verify-floating-elements {
      position: fixed;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .verify-float-1 {
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      filter: blur(40px);
      opacity: 0.1;
      top: 10%;
      left: 10%;
      animation: float 20s infinite linear;
    }

    .verify-float-2 {
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      filter: blur(40px);
      opacity: 0.1;
      top: 60%;
      right: 15%;
      animation: float 20s infinite linear -5s;
    }

    .verify-float-3 {
      position: absolute;
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24, #ef4444);
      filter: blur(40px);
      opacity: 0.1;
      bottom: 20%;
      left: 20%;
      animation: float 20s infinite linear -10s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(50px, -50px) rotate(90deg); }
      50% { transform: translate(0, -100px) rotate(180deg); }
      75% { transform: translate(-50px, -50px) rotate(270deg); }
    }

    .glass {
      backdrop-filter: blur(10px);
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .text-gradient {
      background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .verify-container {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      padding: 6rem 1.5rem 4rem;
    }

    .verify-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .verify-title {
      font-size: 4rem;
      font-weight: 900;
      letter-spacing: -0.025em;
      line-height: 1;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      font-style: italic;
    }

    .verify-subtitle {
      font-size: 1.25rem;
      color: #a1a1aa;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.75;
      font-weight: 300;
    }

    .verification-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .verification-option {
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .verification-option:hover {
      transform: translateY(-8px);
    }

    .option-content {
      padding: 3rem;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
      height: 100%;
    }

    .option-yes {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), transparent, rgba(34, 197, 94, 0.1));
    }

    .option-no {
      background: linear-gradient(135deg, rgba(127, 0, 255, 0.1), transparent, rgba(239, 68, 68, 0.1));
    }

    .option-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      display: block;
      animation: iconFloat 3s ease-in-out infinite;
    }

    .option-title {
      font-size: 2rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: 1rem;
    }

    .option-description {
      font-size: 1rem;
      color: #71717a;
      line-height: 1.6;
      margin: 0;
    }

    @keyframes iconFloat {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-10px) scale(1.1); }
    }

    .verify-form {
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .form-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .form-title {
      font-size: 2rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: 0.5rem;
    }

    .form-subtitle {
      font-size: 1rem;
      color: #71717a;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .instructions-panel {
      padding: 2.5rem;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.05), rgba(127, 0, 255, 0.05));
      margin-bottom: 2rem;
    }

    .instructions-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .instructions-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .instruction-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 0.75rem 0;
      font-size: 1rem;
      color: #a1a1aa;
    }

    .instruction-icon {
      flex-shrink: 0;
      color: #00E5FF;
    }

    .media-upload-container {
      margin-bottom: 2rem;
    }

    .upload-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .upload-option {
      padding: 1.5rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .upload-option:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateY(-2px);
    }

    .upload-option.active {
      background: rgba(0, 229, 255, 0.1);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .upload-option-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      display: block;
    }

    .upload-option-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: #a1a1aa;
    }

    .photo-upload-area {
      border: 2px dashed rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 1rem;
      position: relative;
      overflow: hidden;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .photo-upload-area:hover {
      border-color: rgba(0, 229, 255, 0.3);
      background: rgba(0, 229, 255, 0.02);
    }

    .photo-upload-area.drag-over {
      border-color: rgba(0, 229, 255, 0.5);
      background: rgba(0, 229, 255, 0.05);
      border-style: solid;
    }

    .photo-upload-area.has-media {
      border-style: solid;
      padding: 0;
      background: transparent;
    }

    .media-preview {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 1.75rem;
    }

    .video-preview {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 1.75rem;
    }

    .upload-instructions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .upload-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      opacity: 0.7;
    }

    .upload-text {
      font-size: 1.125rem;
      color: white;
      margin: 0 0 0.5rem 0;
    }

    .upload-subtext {
      font-size: 0.875rem;
      color: #a1a1aa;
      margin: 0;
    }

    .drag-drop-instruction {
      font-size: 0.875rem;
      color: #71717a;
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .media-actions {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
      z-index: 10;
    }

    .media-action-button {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.7);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .media-action-button:hover {
      background: rgba(0, 0, 0, 0.9);
      transform: scale(1.1);
    }

    .camera-container {
      position: relative;
      width: 100%;
      height: 400px;
      border-radius: 2rem;
      overflow: hidden;
      margin-bottom: 2rem;
      background: black;
    }

    .camera-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .camera-controls {
      position: absolute;
      bottom: 2rem;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .recording-indicator {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(239, 68, 68, 0.8);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .recording-dot {
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .duration-selector {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .duration-option {
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      color: #a1a1aa;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .duration-option:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .duration-option.selected {
      background: rgba(0, 229, 255, 0.2);
      border-color: rgba(0, 229, 255, 0.3);
      color: white;
    }

    .caption-section {
      margin-bottom: 2rem;
    }

    .caption-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .caption-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .caption-toggle {
      background: none;
      border: none;
      color: #00E5FF;
      cursor: pointer;
      font-size: 0.875rem;
      text-decoration: underline;
    }

    .caption-input {
      width: 100%;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      color: white;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .caption-input:focus {
      outline: none;
      border-color: rgba(0, 229, 255, 0.3);
      box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.1);
    }

    .caption-input::placeholder {
      color: #71717a;
    }

    .location-section {
      margin-bottom: 2rem;
    }

    .location-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .location-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .location-input-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .location-input {
      flex: 1;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      color: white;
      font-size: 1rem;
    }

    .location-input:focus {
      outline: none;
      border-color: rgba(0, 229, 255, 0.3);
    }

    .location-button {
      padding: 0 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      color: white;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .location-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(0, 229, 255, 0.3);
    }

    .location-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .tags-section {
      margin-bottom: 2rem;
    }

    .tags-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tags-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .tags-input-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tags-input {
      flex: 1;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      color: white;
      font-size: 1rem;
    }

    .tags-input:focus {
      outline: none;
      border-color: rgba(0, 229, 255, 0.3);
    }

    .tags-add-button {
      padding: 0 1.5rem;
      background: rgba(0, 229, 255, 0.2);
      border: 1px solid rgba(0, 229, 255, 0.3);
      border-radius: 1rem;
      color: white;
      cursor: pointer;
      transition: all 0.3s;
    }

    .tags-add-button:hover {
      background: rgba(0, 229, 255, 0.3);
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid rgba(0, 229, 255, 0.2);
      border-radius: 2rem;
      color: white;
      font-size: 0.875rem;
    }

    .tag-remove {
      background: none;
      border: none;
      color: #a1a1aa;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .tag-remove:hover {
      color: #ef4444;
    }

    .privacy-section {
      margin-bottom: 2rem;
    }

    .privacy-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .privacy-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .privacy-options {
      display: flex;
      gap: 1rem;
    }

    .privacy-option {
      flex: 1;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      color: #a1a1aa;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .privacy-option:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .privacy-option.selected {
      background: rgba(0, 229, 255, 0.2);
      border-color: rgba(0, 229, 255, 0.3);
      color: white;
    }

    .shame-input {
      width: 100%;
      min-height: 150px;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      color: white;
      font-size: 1rem;
      resize: vertical;
      margin-bottom: 1.5rem;
      font-family: inherit;
    }

    .shame-input:focus {
      outline: none;
      border-color: rgba(239, 68, 68, 0.3);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .roast-container {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(127, 0, 255, 0.1));
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 2rem;
      padding: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .roast-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
      display: block;
    }

    .roast-text {
      font-size: 1.125rem;
      color: #d4d4d8;
      margin: 0;
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .verify-button {
      padding: 1rem 2rem;
      border-radius: 1rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.75rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      flex: 1;
    }

    .verify-button:hover:not(:disabled) {
      transform: scale(1.05);
    }

    .verify-button:active:not(:disabled) {
      transform: scale(0.95);
    }

    .button-primary {
      background: #00E5FF;
      color: black;
    }

    .button-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    .button-danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    .verify-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .streak-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 4rem;
    }

    .stat-item {
      padding: 2rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 900;
      color: white;
      margin: 0;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #71717a;
      margin-top: 0.5rem;
    }

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      color: #a1a1aa;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 2rem;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .upload-progress {
      margin-top: 1rem;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00E5FF, #7F00FF);
      border-radius: 4px;
      transition: width 0.3s;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #71717a;
      margin-top: 0.5rem;
      text-align: center;
    }

    .time-left {
      text-align: center;
      margin-top: 2rem;
      padding: 1.5rem;
      border-radius: 1.5rem;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
      border: 1px solid rgba(245, 158, 11, 0.2);
      animation: pulse 2s ease-in-out infinite;
    }

    .time-left-text {
      margin: 0;
      color: #fbbf24;
      font-weight: 600;
      font-size: 1rem;
    }

    .fixed {
      position: fixed;
    }

    .inset-0 {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .flex {
      display: flex;
    }

    .items-center {
      align-items: center;
    }

    .justify-center {
      justify-content: center;
    }

    .z-50 {
      z-index: 50;
    }

    .p-8 {
      padding: 2rem;
    }

    .rounded-3xl {
      border-radius: 1.5rem;
    }

    .text-center {
      text-align: center;
    }

    .text-6xl {
      font-size: 4rem;
    }

    .mb-4 {
      margin-bottom: 1rem;
    }

    .text-2xl {
      font-size: 1.5rem;
    }

    .font-bold {
      font-weight: 700;
    }

    .mb-2 {
      margin-bottom: 0.5rem;
    }

    .text-gray-400 {
      color: #9ca3af;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .verify-container {
        padding: 4rem 1rem 2rem;
      }

      .verify-title {
        font-size: 2.5rem;
      }

      .verify-subtitle {
        font-size: 1rem;
      }

      .verification-options {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .option-content {
        padding: 2rem;
      }

      .option-icon {
        font-size: 3rem;
      }

      .option-title {
        font-size: 1.5rem;
      }

      .streak-stats {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .stat-value {
        font-size: 2rem;
      }

      .camera-container {
        height: 300px;
      }

      .camera-controls {
        flex-direction: column;
        padding: 0 1rem;
      }

      .verify-button {
        width: 100%;
      }

      .privacy-options {
        flex-direction: column;
      }

      .location-input-group {
        flex-direction: column;
      }

      .location-button {
        width: 100%;
        padding: 1rem;
      }

      .tags-input-group {
        flex-direction: column;
      }

      .tags-add-button {
        width: 100%;
        padding: 1rem;
      }
    }

    @media (max-width: 480px) {
      .verify-container {
        padding: 3rem 0.75rem 1.5rem;
      }

      .verify-title {
        font-size: 2rem;
      }

      .verify-subtitle {
        font-size: 0.875rem;
      }

      .option-content {
        padding: 1.5rem;
      }

      .option-icon {
        font-size: 2.5rem;
      }

      .option-title {
        font-size: 1.25rem;
      }

      .instructions-panel {
        padding: 1.5rem;
      }

      .instructions-title {
        font-size: 1.25rem;
      }

      .instruction-item {
        font-size: 0.875rem;
      }

      .upload-options {
        grid-template-columns: 1fr;
      }

      .photo-upload-area {
        padding: 2rem;
        min-height: 200px;
      }

      .upload-icon {
        font-size: 2.5rem;
      }

      .upload-text {
        font-size: 1rem;
      }

      .duration-selector {
        grid-template-columns: repeat(3, 1fr);
      }

      .duration-option {
        padding: 0.75rem;
        font-size: 0.875rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .verify-button {
        padding: 0.875rem 1.5rem;
        font-size: 0.875rem;
      }

      .time-left {
        padding: 1rem;
      }

      .time-left-text {
        font-size: 0.875rem;
      }
    }
  `;

  return (
    <div className="verify-page">
      <style>{styles}</style>
      
      <div className="verify-bg-grid"></div>
      <div className="verify-floating-elements">
        <div className="verify-float-1"></div>
        <div className="verify-float-2"></div>
        <div className="verify-float-3"></div>
      </div>

      <div className="verify-container">
        {!verificationMethod ? (
          <>
            <div className="verify-header">
              <h1 className="verify-title text-gradient">
                Have You Touched Grass Today?
              </h1>
              <p className="verify-subtitle">
                Your {streakData.current}-day streak is on the line. 
                Prove your discipline or face the consequences.
              </p>
            </div>
            
            <div className="verification-options">
              <motion.div 
                className="verification-option"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVerificationMethod('photo')}
              >
                <div className="option-content glass option-yes">
                  <span className="option-icon">🌱</span>
                  <h2 className="option-title">Yes</h2>
                  <p className="option-description">
                    Upload photo/video proof & continue your streak. Show us you're living in the real world.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="verification-option"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVerificationMethod('shame')}
              >
                <div className="option-content glass option-no">
                  <span className="option-icon">❌</span>
                  <h2 className="option-title">No</h2>
                  <p className="option-description">
                    Accept public shame & continue streak with a mark. Your ego will hate this.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="streak-stats">
              <div className="stat-item glass">
                <h3 className="stat-value">{streakData.current}</h3>
                <p className="stat-label">Current Streak</p>
              </div>
              
              <div className="stat-item glass">
                <h3 className="stat-value">{streakData.longest}</h3>
                <p className="stat-label">Longest Streak</p>
              </div>
              
              {/* <div className="stat-item glass">
                <h3 className="stat-value">#{streakData.rank}</h3>
                <p className="stat-label">Global Rank</p>
              </div> */}
              
              <div className="stat-item glass">
                <h3 className="stat-value">{streakData.nextCheckpoint}</h3>
                <p className="stat-label">Time Left Today</p>
              </div>
            </div>
          </>
        ) : (
          <div className="verify-form">
            <button 
              className="back-button glass"
              onClick={() => {
                setVerificationMethod(null);
                setPhoto(null);
                setVideo(null);
                setShowCamera(false);
                setShowVideoRecorder(false);
                setCaption('');
                setLocation('');
                setTags([]);
                setPrivacy('public');
                setShowLocationInput(false);
                setShowCaptionInput(false);
                setIsDragOver(false);
                setMediaUploaded(false);
                cleanupMediaStreams();
                if (recordingTimerRef.current) {
                  clearInterval(recordingTimerRef.current);
                }
                if (autoVerifyTimerRef.current) {
                  clearTimeout(autoVerifyTimerRef.current);
                }
              }}
            >
              <ArrowLeft size={16} />
              Back to choices
            </button>
            
            {verificationMethod === 'photo' ? (
              <>
                <div className="form-header">
                  <h2 className="form-title text-gradient">Prove Your Outdoor Adventure</h2>
                  <p className="form-subtitle">
                    Upload a photo or video showing grass, nature, or outdoor activity
                  </p>
                </div>
                
                <div className="instructions-panel glass">
                  <h3 className="instructions-title">
                    <CheckCircle2 size={24} />
                    What counts as proof?
                  </h3>
                  <ul className="instructions-list">
                    <li className="instruction-item">
                      <span className="instruction-icon">✅</span>
                      Photos/videos showing grass, trees, or nature
                    </li>
                    <li className="instruction-item">
                      <span className="instruction-icon">✅</span>
                      Outdoor exercise (running, hiking, sports)
                    </li>
                    <li className="instruction-item">
                      <span className="instruction-icon">✅</span>
                      Sunlight & sky visible in media
                    </li>
                    <li className="instruction-item">
                      <span className="instruction-icon">❌</span>
                      No indoor plants or old media
                    </li>
                  </ul>
                </div>
                
                <div className="media-upload-container">
                  <div className="upload-options">
                    <div 
                      className={`upload-option glass ${mediaType === 'photo' ? 'active' : ''}`}
                      onClick={() => setMediaType('photo')}
                    >
                      <span className="upload-option-icon">📸</span>
                      <p className="upload-option-text">Upload Photo</p>
                    </div>
                    
                    <div 
                      className={`upload-option glass ${mediaType === 'video' ? 'active' : ''}`}
                      onClick={() => setMediaType('video')}
                    >
                      <span className="upload-option-icon">🎥</span>
                      <p className="upload-option-text">Upload Video</p>
                    </div>
                  </div>
                  
                  {showCamera ? (
                    <div className="camera-container glass">
                      <video
                        ref={cameraRef}
                        className="camera-video"
                        autoPlay
                        playsInline
                      />
                      <div className="camera-controls">
                        <button
                          onClick={capturePhoto}
                          className="verify-button button-primary"
                        >
                          <Camera size={20} />
                          Capture Photo
                        </button>
                        <button
                          onClick={() => {
                            setShowCamera(false);
                            cleanupMediaStreams();
                          }}
                          className="verify-button button-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : showVideoRecorder ? (
                    <div className="camera-container glass">
                      <video
                        ref={videoRecorderRef}
                        className="camera-video"
                        autoPlay
                        playsInline
                      />
                      {recordingTime > 0 && (
                        <div className="recording-indicator">
                          <div className="recording-dot" />
                          Recording: {recordingTime}s
                        </div>
                      )}
                      <div className="camera-controls">
                        {mediaRecorderRef.current?.state === 'recording' ? (
                          <button
                            onClick={stopVideoRecording}
                            className="verify-button button-danger"
                          >
                            ⏹️ Stop Recording
                          </button>
                        ) : (
                          <button
                            onClick={startVideoRecording}
                            className="verify-button button-primary"
                          >
                            <Video size={20} />
                            Start Recording
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowVideoRecorder(false);
                            stopVideoRecording();
                          }}
                          className="verify-button button-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      ref={dropZoneRef}
                      className={`photo-upload-area glass ${photo || video ? 'has-media' : ''} ${isDragOver ? 'drag-over' : ''}`}
                      onClick={() => {
                        if (mediaType === 'photo' && !photo) {
                          fileInputRef.current?.click();
                        } else if (mediaType === 'video' && !video) {
                          videoFileInputRef.current?.click();
                        }
                      }}
                    >
                      {(photo || video) ? (
                        <>
                          {mediaType === 'photo' && photo ? (
                            <>
                              <img src={photo} alt="Verification" className="media-preview" />
                              <div className="media-actions">
                                <button 
                                  className="media-action-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeMedia();
                                  }}
                                >
                                  <X size={20} color="white" />
                                </button>
                              </div>
                            </>
                          ) : video ? (
                            <>
                              <video 
                                src={video} 
                                className="video-preview" 
                                controls 
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="media-actions">
                                <button 
                                  className="media-action-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeMedia();
                                  }}
                                >
                                  <X size={20} color="white" />
                                </button>
                              </div>
                            </>
                          ) : null}
                        </>
                      ) : (
                        <div className="upload-instructions">
                          <span className="upload-icon">
                            {isDragOver ? '🎯' : mediaType === 'photo' ? '📸' : '🎥'}
                          </span>
                          <p className="upload-text">
                            {isDragOver 
                              ? 'Drop your file here!' 
                              : mediaType === 'photo' 
                                ? 'Click to upload photo' 
                                : 'Click to upload video'}
                          </p>
                          <p className="upload-subtext">
                            {mediaType === 'photo'
                              ? 'or drag and drop your photo here'
                              : 'or drag and drop your video here'}
                          </p>
                          <div className="drag-drop-instruction">
                            <FileUp size={14} />
                            Supports {mediaType === 'photo' ? 'JPG, PNG, GIF' : 'MP4, MOV, AVI'} • Max {mediaType === 'photo' ? '10MB' : '50MB'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {isUploading && (
                    <div className="upload-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="progress-text">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'photo')}
                    style={{ display: 'none' }}
                  />
                  
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    style={{ display: 'none' }}
                  />
                  
                  {!showCamera && !showVideoRecorder && !photo && !video && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      marginTop: '1rem',
                      justifyContent: 'center',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={() => startCamera('photo')}
                        className="verify-button button-secondary"
                        style={{ flex: 'none' }}
                      >
                        <Camera size={16} /> Take Photo
                      </button>
                      
                      <button
                        onClick={() => startCamera('video')}
                        className="verify-button button-secondary"
                        style={{ flex: 'none' }}
                      >
                        <Video size={16} /> Record Video
                      </button>
                    </div>
                  )}
                </div>
                
                {(photo || video) && (
                  <>
                    <div className="caption-section">
                      <div className="caption-header">
                        <Image size={20} color="#00E5FF" />
                        <h3>Add a Caption</h3>
                        <button 
                          className="caption-toggle"
                          onClick={() => setShowCaptionInput(!showCaptionInput)}
                        >
                          {showCaptionInput ? 'Hide' : 'Add Caption'}
                        </button>
                      </div>
                      
                      {showCaptionInput && (
                        <input
                          ref={captionInputRef}
                          type="text"
                          className="caption-input"
                          placeholder="Write something about your outdoor adventure..."
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          maxLength={150}
                        />
                      )}
                    </div>
                    
                    <div className="location-section">
                      <div className="location-header">
                        <MapPin size={20} color="#00E5FF" />
                        <h3>Where were you?</h3>
                        <button 
                          className="caption-toggle"
                          onClick={() => setShowLocationInput(!showLocationInput)}
                        >
                          {showLocationInput ? 'Hide' : 'Add Location'}
                        </button>
                      </div>
                      
                      {showLocationInput && (
                        <div>
                          <div className="location-input-group">
                            <input
                              type="text"
                              className="location-input"
                              placeholder="e.g., Central Park, NY"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="tags-section">
                      <div className="tags-header">
                        <Hash size={20} color="#00E5FF" />
                        <h3>Add Tags</h3>
                      </div>
                      
                      <div className="tags-input-group">
                        <input
                          type="text"
                          className="tags-input"
                          placeholder="e.g., nature, hiking, sunset"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                        />
                        <button
                          className="tags-add-button"
                          onClick={addTag}
                        >
                          Add
                        </button>
                      </div>
                      
                      {tags.length > 0 && (
                        <div className="tags-container">
                          {tags.map((tag, index) => (
                            <span key={index} className="tag">
                              #{tag}
                              <button
                                className="tag-remove"
                                onClick={() => removeTag(tag)}
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="privacy-section">
                      <div className="privacy-header">
                        <Users size={20} color="#00E5FF" />
                        <h3>Who can see this?</h3>
                      </div>
                      
                      <div className="privacy-options">
                        <button
                          className={`privacy-option ${privacy === 'public' ? 'selected' : ''}`}
                          onClick={() => setPrivacy('public')}
                        >
                          🌍 Public
                        </button>
                        <button
                          className={`privacy-option ${privacy === 'friends' ? 'selected' : ''}`}
                          onClick={() => setPrivacy('friends')}
                        >
                          👥 Friends
                        </button>
                        <button
                          className={`privacy-option ${privacy === 'private' ? 'selected' : ''}`}
                          onClick={() => setPrivacy('private')}
                        >
                          🔒 Private
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
                    ⏱️ How many minutes were you outside?
                  </h3>
                  <div className="duration-selector">
                    {durations.map((mins) => (
                      <button
                        key={mins}
                        className={`duration-option glass ${duration === mins ? 'selected' : ''}`}
                        onClick={() => setDuration(mins)}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Submit button - show Verified Today when can't verify */}
                {!canVerifyStatus.canVerify && (
                  <div className="action-buttons">
                    <button
                      disabled
                      className="verify-button button-primary"
                      style={{ opacity: 0.7 }}
                    >
                      <CheckCircle2 size={20} />
                      Verified Today ({canVerifyStatus.hoursRemaining}h remaining)
                    </button>
                  </div>
                )}
                
                {canVerifyStatus.canVerify && (photo || video) && !isSubmitting && (
                  <div className="action-buttons">
                    <button
                      onClick={() => submitVerification('photo')}
                      className="verify-button button-primary"
                    >
                      <CheckCircle2 size={20} />
                      Submit Verification
                    </button>
                  </div>
                )}
                
                {isSubmitting && (
                  <div className="action-buttons">
                    <button
                      disabled
                      className="verify-button button-primary"
                    >
                      <Loader2 size={20} className="animate-spin" />
                      Verifying...
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="form-header">
                  <h2 className="form-title text-gradient">Accept Your Digital Shame</h2>
                  <p className="form-subtitle">
                    You chose to stay indoors. Write a public confession that will be displayed on your profile and the verification wall.
                  </p>
                </div>
                
                <div className="roast-container glass">
                  <span className="roast-icon">🤖</span>
                  <p className="roast-text">
                    {roasts[Math.floor(Math.random() * roasts.length)]}
                  </p>
                </div>
                
                <textarea
                  className="shame-input glass"
                  placeholder="I failed to touch grass today because..."
                  value={shameMessage}
                  onChange={(e) => setShameMessage(e.target.value)}
                  maxLength={200}
                />
                
                <div style={{ 
                  textAlign: 'right', 
                  marginBottom: '1.5rem',
                  color: '#71717a',
                  fontSize: '0.875rem'
                }}>
                  {shameMessage.length}/200 characters
                </div>
                
                <div className="privacy-section">
                  <div className="privacy-header">
                    <Users size={20} color="#ef4444" />
                    <h3>Shame visibility</h3>
                  </div>
                  
                  <div className="privacy-options">
                    <button
                      className={`privacy-option ${privacy === 'public' ? 'selected' : ''}`}
                      onClick={() => setPrivacy('public')}
                    >
                      🌍 Public Shame
                    </button>
                    <button
                      className={`privacy-option ${privacy === 'friends' ? 'selected' : ''}`}
                      onClick={() => setPrivacy('friends')}
                    >
                      👥 Friends Only
                    </button>
                  </div>
                </div>
                
                <div className="instructions-panel glass">
                  <h3 className="instructions-title">
                    <AlertCircle size={24} />
                    Consequences of Shame
                  </h3>
                  <ul className="instructions-list">
                    <li className="instruction-item">
                      <span className="instruction-icon">📉</span>
                      Your streak continues but marked with shame
                    </li>
                    <li className="instruction-item">
                      <span className="instruction-icon">👁️</span>
                      Your confession will appear on the verification wall
                    </li>
                    <li className="instruction-item">
                      <span className="instruction-icon">🏷️</span>
                      "Shame Day" badge on your profile for 24h
                    </li>
                    <li className="instruction-item">
                      <span className="instruction-icon">📊</span>
                      Ranked below users with verified days
                    </li>
                  </ul>
                </div>
                
                <div className="action-buttons">
                  <button
                    onClick={() => submitVerification('shame')}
                    disabled={shameMessage.length < 10 || isSubmitting}
                    className="verify-button button-danger"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      '😈 Accept Public Shame'
                    )}
                  </button>
                  
                  <button
                    onClick={() => setVerificationMethod('photo')}
                    className="verify-button button-secondary"
                  >
                    🌱 Redeem with Photo/Video Instead
                  </button>
                </div>
              </>
            )}
            
            <div className="time-left glass">
              <p className="time-left-text">
                ⏰ Time until streak breaks: {streakData.nextCheckpoint}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="p-8 rounded-3xl glass text-center"
            style={{ maxWidth: '400px' }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Verification Complete!</h3>
            <p className="text-gray-400">Your streak is now {streakData.current} days! Post shared to verification wall. Redirecting to dashboard...</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Verify;