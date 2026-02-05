
// // export default Verify;
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// import { 
//   Camera, 
//   Video, 
//   Upload, 
//   X, 
//   CheckCircle2,
//   AlertCircle,
//   Clock,
//   Flame,
//   Trophy,
//   Users,
//   Calendar,
//   ArrowLeft,
//   FileUp,
//   Image as ImageIcon,
//   Mic,
//   Zap,
//   Loader2
// } from 'lucide-react';

// const Verify = () => {
//   const navigate = useNavigate();
//   const [verificationMethod, setVerificationMethod] = useState(null);
//   const [photo, setPhoto] = useState(null);
//   const [video, setVideo] = useState(null);
//   const [shameMessage, setShameMessage] = useState('');
//   const [duration, setDuration] = useState(15);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [streakData, setStreakData] = useState({
//     current: 0,
//     longest: 0,
//     rank: 1000,
//     nextCheckpoint: '23:59:59'
//   });
//   const [showCamera, setShowCamera] = useState(false);
//   const [showVideoRecorder, setShowVideoRecorder] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [mediaType, setMediaType] = useState('photo');
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [userData, setUserData] = useState(null);
  
//   const cameraRef = useRef(null);
//   const videoRecorderRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);
//   const fileInputRef = useRef(null);
//   const videoFileInputRef = useRef(null);
//   const recordingTimerRef = useRef(null);
//   const dropZoneRef = useRef(null);

//   const durations = [5, 15, 30, 60, 120];
//   const roasts = [
//     "Still a digital zombie, I see. Your chair must be fused to your skin by now.",
//     "Another day indoors? Even houseplants get more sunlight than you.",
//     "Your vitamin D levels are crying. Go outside.",
//     "Your screen time is longer than your life expectancy at this rate.",
//     "The grass is calling. Unfortunately, it's saying 'I don't know this person.'",
//     "You've evolved from human to houseplant. At least they photosynthesize."
//   ];

//   useEffect(() => {
//     loadUserData();
//     loadStreakData();
//     setupDragAndDrop();
//     calculateTimeLeft();
    
//     const timer = setInterval(calculateTimeLeft, 1000);
    
//     return () => {
//       cleanupMediaStreams();
//       if (recordingTimerRef.current) {
//         clearInterval(recordingTimerRef.current);
//       }
//       clearInterval(timer);
//     };
//   }, []);

//   useEffect(() => {
//     if (showSuccess) {
//       const timer = setTimeout(() => {
//         navigate('/dashboard');
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [showSuccess, navigate]);

//   const loadUserData = () => {
//     try {
//       const storedUser = localStorage.getItem('touchgrass_user');
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         setUserData(user);
//       } else {
//         toast.error('Please login to verify');
//         navigate('/dashboard');
//       }
//     } catch (error) {
//     }
//   };

//   const loadStreakData = () => {
//     try {
//       if (!userData) return;
      
//       const streakKey = `touchgrass_streak_${userData.username}`;
//       const storedStreak = localStorage.getItem(streakKey);
      
//       if (storedStreak) {
//         const streak = JSON.parse(storedStreak);
//         setStreakData({
//           current: streak.currentStreak || 0,
//           longest: streak.longestStreak || 0,
//           rank: Math.floor(Math.random() * 1000) + 1,
//           nextCheckpoint: '23:59:59'
//         });
//       }
//     } catch (error) {
//     }
//   };

//   const calculateTimeLeft = () => {
//     const now = new Date();
//     const endOfDay = new Date(now);
//     endOfDay.setHours(23, 59, 59, 999);
//     const difference = endOfDay - now;
    
//     const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
//     const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//     setStreakData(prev => ({ ...prev, nextCheckpoint: timeString }));
//   };

//   const setupDragAndDrop = () => {
//     const dropZone = dropZoneRef.current;
//     if (!dropZone) return;

//     const preventDefaults = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//     };

//     const handleDragEnter = (e) => {
//       preventDefaults(e);
//       setIsDragOver(true);
//     };

//     const handleDragLeave = (e) => {
//       preventDefaults(e);
//       if (!dropZone.contains(e.relatedTarget)) {
//         setIsDragOver(false);
//       }
//     };

//     const handleDragOver = (e) => {
//       preventDefaults(e);
//       setIsDragOver(true);
//     };

//     const handleDrop = (e) => {
//       preventDefaults(e);
//       setIsDragOver(false);
      
//       const files = e.dataTransfer.files;
//       if (files.length > 0) {
//         handleDroppedFiles(files);
//       }
//     };

//     dropZone.addEventListener('dragenter', handleDragEnter);
//     dropZone.addEventListener('dragleave', handleDragLeave);
//     dropZone.addEventListener('dragover', handleDragOver);
//     dropZone.addEventListener('drop', handleDrop);

//     return () => {
//       dropZone.removeEventListener('dragenter', handleDragEnter);
//       dropZone.removeEventListener('dragleave', handleDragLeave);
//       dropZone.removeEventListener('dragover', handleDragOver);
//       dropZone.removeEventListener('drop', handleDrop);
//     };
//   };

//   const handleDroppedFiles = (files) => {
//     if (files.length === 0) return;

//     const file = files[0];
//     const type = file.type.startsWith('image/') ? 'photo' : 
//                   file.type.startsWith('video/') ? 'video' : null;

//     if (!type) {
//       toast.error('Please drop an image or video file');
//       return;
//     }

//     setMediaType(type);
//     handleFileUpload({ target: { files: [file] } }, type);
//   };

//   const cleanupMediaStreams = () => {
//     if (cameraRef.current?.srcObject) {
//       cameraRef.current.srcObject.getTracks().forEach(track => track.stop());
//     }
//     if (videoRecorderRef.current?.srcObject) {
//       videoRecorderRef.current.srcObject.getTracks().forEach(track => track.stop());
//     }
//     if (mediaRecorderRef.current?.state === 'recording') {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const handleFileUpload = (event, type = 'photo') => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const maxSize = type === 'photo' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
//     if (file.size > maxSize) {
//       toast.error(`${type === 'photo' ? 'Image' : 'Video'} size must be less than ${type === 'photo' ? '10MB' : '50MB'}`);
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);
    
//     const progressInterval = setInterval(() => {
//       setUploadProgress(prev => {
//         if (prev >= 100) {
//           clearInterval(progressInterval);
//           setIsUploading(false);
          
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             if (type === 'photo') {
//               setPhoto(reader.result);
//               setMediaType('photo');
//               toast.success('Photo uploaded successfully!');
//             } else {
//               setVideo(reader.result);
//               setMediaType('video');
//               toast.success('Video uploaded successfully!');
//             }
//           };
//           reader.readAsDataURL(file);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 100);
//   };

//   const startCamera = (type = 'photo') => {
//     cleanupMediaStreams();
    
//     if (type === 'photo') {
//       setShowCamera(true);
//       setShowVideoRecorder(false);
//     } else {
//       setShowVideoRecorder(true);
//       setShowCamera(false);
//       setRecordingTime(0);
//     }
    
//     setTimeout(() => {
//       const constraints = type === 'photo' 
//         ? { video: { facingMode: 'environment' }, audio: false }
//         : { video: { facingMode: 'environment' }, audio: true };
      
//       navigator.mediaDevices.getUserMedia(constraints)
//         .then(stream => {
//           const element = type === 'photo' ? cameraRef.current : videoRecorderRef.current;
//           if (element) {
//             element.srcObject = stream;
            
//             if (type === 'video') {
//               mediaRecorderRef.current = new MediaRecorder(stream);
//               recordedChunksRef.current = [];
              
//               mediaRecorderRef.current.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                   recordedChunksRef.current.push(event.data);
//                 }
//               };
              
//               mediaRecorderRef.current.onstop = () => {
//                 const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
//                 const videoURL = URL.createObjectURL(blob);
//                 setVideo(videoURL);
//                 setMediaType('video');
//                 toast.success('Video recorded successfully!');
//               };
//             }
//           }
//         })
//         .catch(err => {
//           toast.error('Camera access denied. Please check permissions.');
//           setShowCamera(false);
//           setShowVideoRecorder(false);
//         });
//     }, 100);
//   };

//   const capturePhoto = () => {
//     if (!cameraRef.current) return;

//     const canvas = document.createElement('canvas');
//     const video = cameraRef.current;
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
    
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//     const photoData = canvas.toDataURL('image/jpeg', 0.8);
//     setPhoto(photoData);
//     setMediaType('photo');
//     setShowCamera(false);
    
//     cleanupMediaStreams();
//     toast.success('Photo captured!');
//   };

//   const startVideoRecording = () => {
//     if (!mediaRecorderRef.current) return;
    
//     recordedChunksRef.current = [];
//     mediaRecorderRef.current.start();
    
//     setRecordingTime(0);
//     recordingTimerRef.current = setInterval(() => {
//       setRecordingTime(prev => {
//         if (prev >= 30) {
//           stopVideoRecording();
//           return 30;
//         }
//         return prev + 1;
//       });
//     }, 1000);
    
//     toast.success('Recording started...');
//   };

//   const stopVideoRecording = () => {
//     if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;
    
//     mediaRecorderRef.current.stop();
//     clearInterval(recordingTimerRef.current);
//     setShowVideoRecorder(false);
    
//     cleanupMediaStreams();
//   };

//   const submitVerification = async (method) => {
//     if (method === 'photo' && !photo && !video) {
//       toast.error('Please upload a photo or video first');
//       return;
//     }

//     if (method === 'shame' && shameMessage.length < 10) {
//       toast.error('Shame message must be at least 10 characters');
//       return;
//     }

//     setIsSubmitting(true);
    
//     setTimeout(() => {
//       try {
//         const user = JSON.parse(localStorage.getItem('touchgrass_user') || '{}');
//         const streakKey = `touchgrass_streak_${user.username}`;
//         const currentStreak = JSON.parse(localStorage.getItem(streakKey) || '{}');
        
//         const updatedStreak = {
//           ...currentStreak,
//           currentStreak: (currentStreak.currentStreak || 0) + 1,
//           longestStreak: Math.max(currentStreak.longestStreak || 0, (currentStreak.currentStreak || 0) + 1),
//           totalDays: (currentStreak.totalDays || 0) + 1,
//           totalOutdoorTime: (currentStreak.totalOutdoorTime || 0) + (method === 'photo' ? duration : 0),
//           todayVerified: true,
//           lastVerification: new Date().toISOString()
//         };
        
//         if (!updatedStreak.history) {
//           updatedStreak.history = [];
//         }
        
//         updatedStreak.history.push({
//           date: new Date().toISOString(),
//           verified: true,
//           verificationMethod: method,
//           duration: method === 'photo' ? duration : 0,
//           notes: method === 'shame' ? shameMessage : '',
//           timestamp: new Date().toISOString()
//         });
        
//         localStorage.setItem(streakKey, JSON.stringify(updatedStreak));
        
//         setIsSubmitting(false);
//         setShowSuccess(true);
        
//         if (method === 'photo') {
//           toast.success('🌱 Success! Your streak continues to grow');
//         } else {
//           toast.success('😈 Shame accepted. Your streak continues...');
//         }
        
//       } catch (error) {
//         toast.error('Failed to submit verification');
//         setIsSubmitting(false);
//       }
//     }, 1500);
//   };

//   const removeMedia = () => {
//     if (mediaType === 'photo') {
//       setPhoto(null);
//     } else {
//       setVideo(null);
//     }
//     setMediaType('photo');
//   };

//   const styles = `
//     .verify-page {
//       min-height: 100vh;
//       background: #050505;
//       color: white;
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
//       position: relative;
//       overflow-x: hidden;
//     }

//     .verify-bg-grid {
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background-image: 
//         linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
//         linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
//       background-size: 50px 50px;
//       pointer-events: none;
//       z-index: 1;
//     }

//     .verify-floating-elements {
//       position: fixed;
//       width: 100%;
//       height: 100%;
//       pointer-events: none;
//       z-index: 1;
//     }

//     .verify-float-1 {
//       position: absolute;
//       width: 400px;
//       height: 400px;
//       border-radius: 50%;
//       background: linear-gradient(135deg, #22c55e, #3b82f6);
//       filter: blur(40px);
//       opacity: 0.1;
//       top: 10%;
//       left: 10%;
//       animation: float 20s infinite linear;
//     }

//     .verify-float-2 {
//       position: absolute;
//       width: 300px;
//       height: 300px;
//       border-radius: 50%;
//       background: linear-gradient(135deg, #8b5cf6, #ec4899);
//       filter: blur(40px);
//       opacity: 0.1;
//       top: 60%;
//       right: 15%;
//       animation: float 20s infinite linear -5s;
//     }

//     .verify-float-3 {
//       position: absolute;
//       width: 250px;
//       height: 250px;
//       border-radius: 50%;
//       background: linear-gradient(135deg, #fbbf24, #ef4444);
//       filter: blur(40px);
//       opacity: 0.1;
//       bottom: 20%;
//       left: 20%;
//       animation: float 20s infinite linear -10s;
//     }

//     @keyframes float {
//       0%, 100% { transform: translate(0, 0) rotate(0deg); }
//       25% { transform: translate(50px, -50px) rotate(90deg); }
//       50% { transform: translate(0, -100px) rotate(180deg); }
//       75% { transform: translate(-50px, -50px) rotate(270deg); }
//     }

//     .glass {
//       backdrop-filter: blur(10px);
//       background: rgba(15, 23, 42, 0.8);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//     }

//     .text-gradient {
//       background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//     }

//     .verify-container {
//       position: relative;
//       z-index: 2;
//       max-width: 1200px;
//       margin: 0 auto;
//       padding: 6rem 1.5rem 4rem;
//     }

//     .verify-header {
//       text-align: center;
//       margin-bottom: 4rem;
//     }

//     .verify-title {
//       font-size: 4rem;
//       font-weight: 900;
//       letter-spacing: -0.025em;
//       line-height: 1;
//       margin-bottom: 1.5rem;
//       text-transform: uppercase;
//       font-style: italic;
//     }

//     .verify-subtitle {
//       font-size: 1.25rem;
//       color: #a1a1aa;
//       max-width: 600px;
//       margin: 0 auto;
//       line-height: 1.75;
//       font-weight: 300;
//     }

//     .verification-options {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//       gap: 2rem;
//       margin-bottom: 4rem;
//     }

//     .verification-option {
//       cursor: pointer;
//       transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
//     }

//     .verification-option:hover {
//       transform: translateY(-8px);
//     }

//     .option-content {
//       padding: 3rem;
//       border-radius: 3rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       text-align: center;
//       height: 100%;
//     }

//     .option-yes {
//       background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), transparent, rgba(34, 197, 94, 0.1));
//     }

//     .option-no {
//       background: linear-gradient(135deg, rgba(127, 0, 255, 0.1), transparent, rgba(239, 68, 68, 0.1));
//     }

//     .option-icon {
//       font-size: 4rem;
//       margin-bottom: 1.5rem;
//       display: block;
//       animation: iconFloat 3s ease-in-out infinite;
//     }

//     .option-title {
//       font-size: 2rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: -0.025em;
//       margin-bottom: 1rem;
//     }

//     .option-description {
//       font-size: 1rem;
//       color: #71717a;
//       line-height: 1.6;
//       margin: 0;
//     }

//     @keyframes iconFloat {
//       0%, 100% { transform: translateY(0) scale(1); }
//       50% { transform: translateY(-10px) scale(1.1); }
//     }

//     .verify-form {
//       animation: fadeIn 0.6s ease-out;
//     }

//     @keyframes fadeIn {
//       from { opacity: 0; transform: translateY(20px); }
//       to { opacity: 1; transform: translateY(0); }
//     }

//     .form-header {
//       text-align: center;
//       margin-bottom: 3rem;
//     }

//     .form-title {
//       font-size: 2rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: -0.025em;
//       margin-bottom: 0.5rem;
//     }

//     .form-subtitle {
//       font-size: 1rem;
//       color: #71717a;
//       max-width: 600px;
//       margin: 0 auto;
//       line-height: 1.6;
//     }

//     .instructions-panel {
//       padding: 2.5rem;
//       border-radius: 3rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: linear-gradient(135deg, rgba(0, 229, 255, 0.05), rgba(127, 0, 255, 0.05));
//       margin-bottom: 2rem;
//     }

//     .instructions-title {
//       font-size: 1.5rem;
//       font-weight: 700;
//       margin-bottom: 1.5rem;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .instructions-list {
//       list-style: none;
//       padding: 0;
//       margin: 0;
//     }

//     .instruction-item {
//       display: flex;
//       align-items: flex-start;
//       gap: 1rem;
//       padding: 0.75rem 0;
//       font-size: 1rem;
//       color: #a1a1aa;
//     }

//     .instruction-icon {
//       flex-shrink: 0;
//       color: #00E5FF;
//     }

//     .media-upload-container {
//       margin-bottom: 2rem;
//     }

//     .upload-options {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
//       gap: 1rem;
//       margin-bottom: 2rem;
//     }

//     .upload-option {
//       padding: 1.5rem;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(255, 255, 255, 0.01);
//       text-align: center;
//       cursor: pointer;
//       transition: all 0.3s;
//     }

//     .upload-option:hover {
//       background: rgba(255, 255, 255, 0.03);
//       transform: translateY(-2px);
//     }

//     .upload-option.active {
//       background: rgba(0, 229, 255, 0.1);
//       border-color: rgba(0, 229, 255, 0.2);
//     }

//     .upload-option-icon {
//       font-size: 2rem;
//       margin-bottom: 0.5rem;
//       display: block;
//     }

//     .upload-option-text {
//       font-size: 0.875rem;
//       font-weight: 600;
//       color: #a1a1aa;
//     }

//     .photo-upload-area {
//       border: 2px dashed rgba(255, 255, 255, 0.1);
//       border-radius: 2rem;
//       padding: 3rem;
//       text-align: center;
//       cursor: pointer;
//       transition: all 0.3s;
//       margin-bottom: 1rem;
//       position: relative;
//       overflow: hidden;
//       min-height: 300px;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: center;
//     }

//     .photo-upload-area:hover {
//       border-color: rgba(0, 229, 255, 0.3);
//       background: rgba(0, 229, 255, 0.02);
//     }

//     .photo-upload-area.drag-over {
//       border-color: rgba(0, 229, 255, 0.5);
//       background: rgba(0, 229, 255, 0.05);
//       border-style: solid;
//     }

//     .photo-upload-area.has-media {
//       border-style: solid;
//       padding: 0;
//       background: transparent;
//     }

//     .media-preview {
//       width: 100%;
//       height: 300px;
//       object-fit: cover;
//       border-radius: 1.75rem;
//     }

//     .video-preview {
//       width: 100%;
//       height: 300px;
//       object-fit: cover;
//       border-radius: 1.75rem;
//     }

//     .upload-instructions {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       gap: 1rem;
//     }

//     .upload-icon {
//       font-size: 3rem;
//       margin-bottom: 0.5rem;
//       opacity: 0.7;
//     }

//     .upload-text {
//       font-size: 1.125rem;
//       color: white;
//       margin: 0 0 0.5rem 0;
//     }

//     .upload-subtext {
//       font-size: 0.875rem;
//       color: #a1a1aa;
//       margin: 0;
//     }

//     .drag-drop-instruction {
//       font-size: 0.875rem;
//       color: #71717a;
//       margin-top: 1rem;
//       padding: 0.5rem 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border-radius: 0.75rem;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .media-actions {
//       position: absolute;
//       top: 1rem;
//       right: 1rem;
//       display: flex;
//       gap: 0.5rem;
//       z-index: 10;
//     }

//     .media-action-button {
//       width: 2.5rem;
//       height: 2.5rem;
//       border-radius: 50%;
//       background: rgba(0, 0, 0, 0.7);
//       border: none;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       cursor: pointer;
//       transition: all 0.3s;
//     }

//     .media-action-button:hover {
//       background: rgba(0, 0, 0, 0.9);
//       transform: scale(1.1);
//     }

//     .camera-container {
//       position: relative;
//       width: 100%;
//       height: 400px;
//       border-radius: 2rem;
//       overflow: hidden;
//       margin-bottom: 2rem;
//       background: black;
//     }

//     .camera-video {
//       width: 100%;
//       height: 100%;
//       object-fit: cover;
//     }

//     .camera-controls {
//       position: absolute;
//       bottom: 2rem;
//       left: 0;
//       right: 0;
//       display: flex;
//       justify-content: center;
//       gap: 1rem;
//     }

//     .recording-indicator {
//       position: absolute;
//       top: 1rem;
//       left: 1rem;
//       background: rgba(239, 68, 68, 0.8);
//       color: white;
//       padding: 0.5rem 1rem;
//       border-radius: 1rem;
//       font-size: 0.875rem;
//       font-weight: 600;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .recording-dot {
//       width: 8px;
//       height: 8px;
//       background: white;
//       border-radius: 50%;
//       animation: pulse 1s infinite;
//     }

//     @keyframes pulse {
//       0%, 100% { opacity: 1; }
//       50% { opacity: 0.5; }
//     }

//     .duration-selector {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
//       gap: 1rem;
//       margin-bottom: 2rem;
//     }

//     .duration-option {
//       padding: 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 1rem;
//       color: #a1a1aa;
//       text-align: center;
//       cursor: pointer;
//       transition: all 0.3s;
//     }

//     .duration-option:hover {
//       background: rgba(255, 255, 255, 0.1);
//     }

//     .duration-option.selected {
//       background: rgba(0, 229, 255, 0.2);
//       border-color: rgba(0, 229, 255, 0.3);
//       color: white;
//     }

//     .shame-input {
//       width: 100%;
//       min-height: 150px;
//       padding: 1.5rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 1.5rem;
//       color: white;
//       font-size: 1rem;
//       resize: vertical;
//       margin-bottom: 1.5rem;
//       font-family: inherit;
//     }

//     .shame-input:focus {
//       outline: none;
//       border-color: rgba(239, 68, 68, 0.3);
//       box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
//     }

//     .roast-container {
//       background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(127, 0, 255, 0.1));
//       border: 1px solid rgba(239, 68, 68, 0.2);
//       border-radius: 2rem;
//       padding: 2rem;
//       margin-bottom: 2rem;
//       text-align: center;
//     }

//     .roast-icon {
//       font-size: 2rem;
//       margin-bottom: 1rem;
//       display: block;
//     }

//     .roast-text {
//       font-size: 1.125rem;
//       color: #d4d4d8;
//       margin: 0;
//       font-style: italic;
//     }

//     .action-buttons {
//       display: flex;
//       gap: 1rem;
//       margin-top: 2rem;
//     }

//     .verify-button {
//       padding: 1rem 2rem;
//       border-radius: 1rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       font-size: 0.75rem;
//       border: none;
//       cursor: pointer;
//       transition: all 0.2s;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.5rem;
//       flex: 1;
//     }

//     .verify-button:hover:not(:disabled) {
//       transform: scale(1.05);
//     }

//     .verify-button:active:not(:disabled) {
//       transform: scale(0.95);
//     }

//     .button-primary {
//       background: #00E5FF;
//       color: black;
//     }

//     .button-secondary {
//       background: rgba(255, 255, 255, 0.1);
//       border: 1px solid rgba(255, 255, 255, 0.2);
//       color: white;
//     }

//     .button-danger {
//       background: linear-gradient(135deg, #ef4444, #dc2626);
//       color: white;
//     }

//     .verify-button:disabled {
//       opacity: 0.5;
//       cursor: not-allowed;
//     }

//     .streak-stats {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//       gap: 1.5rem;
//       margin-top: 4rem;
//     }

//     .stat-item {
//       padding: 2rem;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       text-align: center;
//     }

//     .stat-value {
//       font-size: 2.5rem;
//       font-weight: 900;
//       color: white;
//       margin: 0;
//       line-height: 1;
//     }

//     .stat-label {
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.2em;
//       color: #71717a;
//       margin-top: 0.5rem;
//     }

//     .back-button {
//       display: inline-flex;
//       align-items: center;
//       gap: 0.5rem;
//       padding: 0.75rem 1.5rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 1rem;
//       color: #a1a1aa;
//       font-size: 0.875rem;
//       cursor: pointer;
//       transition: all 0.3s;
//       margin-bottom: 2rem;
//     }

//     .back-button:hover {
//       background: rgba(255, 255, 255, 0.1);
//       color: white;
//     }

//     .upload-progress {
//       margin-top: 1rem;
//     }

//     .progress-bar {
//       width: 100%;
//       height: 8px;
//       background: rgba(255, 255, 255, 0.1);
//       border-radius: 4px;
//       overflow: hidden;
//     }

//     .progress-fill {
//       height: 100%;
//       background: linear-gradient(90deg, #00E5FF, #7F00FF);
//       border-radius: 4px;
//       transition: width 0.3s;
//     }

//     .progress-text {
//       font-size: 0.875rem;
//       color: #71717a;
//       margin-top: 0.5rem;
//       text-align: center;
//     }

//     .time-left {
//       text-align: center;
//       margin-top: 2rem;
//       padding: 1.5rem;
//       border-radius: 1.5rem;
//       background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
//       border: 1px solid rgba(245, 158, 11, 0.2);
//       animation: pulse 2s ease-in-out infinite;
//     }

//     .time-left-text {
//       margin: 0;
//       color: #fbbf24;
//       font-weight: 600;
//       font-size: 1rem;
//     }

//     /* Mobile-first responsive design */
//     @media (max-width: 320px) {
//       .verify-page {
//         padding: 0;
//       }

//       .verify-container {
//         padding: 2rem 0.5rem 1rem;
//       }

//       .verify-title {
//         font-size: 1.75rem;
//         line-height: 1.2;
//       }

//       .verify-subtitle {
//         font-size: 0.75rem;
//         line-height: 1.3;
//         margin-bottom: 1rem;
//       }

//       .verification-options {
//         grid-template-columns: 1fr;
//         gap: 1rem;
//         margin-bottom: 2rem;
//       }

//       .option-content {
//         padding: 1.5rem;
//       }

//       .option-icon {
//         font-size: 2.5rem;
//         margin-bottom: 1rem;
//       }

//       .option-title {
//         font-size: 1.25rem;
//         margin-bottom: 0.5rem;
//       }

//       .option-description {
//         font-size: 0.75rem;
//         line-height: 1.4;
//       }

//       .streak-stats {
//         grid-template-columns: 1fr;
//         gap: 0.75rem;
//         margin-top: 2rem;
//       }

//       .stat-item {
//         padding: 1rem;
//       }

//       .stat-value {
//         font-size: 1.5rem;
//       }

//       .stat-label {
//         font-size: 0.5rem;
//         margin-top: 0.25rem;
//       }

//       .verify-form {
//         padding: 0;
//       }

//       .back-button {
//         padding: 0.5rem 1rem;
//         font-size: 0.75rem;
//         margin-bottom: 1rem;
//       }

//       .form-header {
//         margin-bottom: 1.5rem;
//       }

//       .form-title {
//         font-size: 1.25rem;
//       }

//       .form-subtitle {
//         font-size: 0.75rem;
//         max-width: none;
//         margin: 0 auto 0.5rem;
//       }

//       .instructions-panel {
//         padding: 1rem;
//         margin-bottom: 1rem;
//       }

//       .instructions-title {
//         font-size: 1rem;
//         margin-bottom: 0.75rem;
//       }

//       .instruction-item {
//         padding: 0.375rem 0;
//         font-size: 0.75rem;
//       }

//       .media-upload-container {
//         margin-bottom: 1rem;
//       }

//       .upload-options {
//         grid-template-columns: 1fr;
//         gap: 0.5rem;
//         margin-bottom: 1rem;
//       }

//       .upload-option {
//         padding: 0.875rem;
//         min-width: none;
//       }

//       .upload-option-icon {
//         font-size: 1.25rem;
//         margin-bottom: 0.25rem;
//       }

//       .upload-option-text {
//         font-size: 0.625rem;
//       }

//       .photo-upload-area {
//         padding: 1.5rem;
//         min-height: 200px;
//       }

//       .upload-instructions {
//         gap: 0.75rem;
//       }

//       .upload-icon {
//         font-size: 2rem;
//       }

//       .upload-text {
//         font-size: 0.875rem;
//       }

//       .upload-subtext {
//         font-size: 0.625rem;
//       }

//       .drag-drop-instruction {
//         font-size: 0.625rem;
//         padding: 0.375rem 0.75rem;
//       }

//       .camera-container {
//         height: 250px;
//         margin-bottom: 1rem;
//       }

//       .camera-controls {
//         bottom: 1rem;
//         gap: 0.5rem;
//       }

//       .recording-indicator {
//         top: 0.5rem;
//         left: 0.5rem;
//         padding: 0.375rem 0.75rem;
//         font-size: 0.75rem;
//       }

//       .duration-selector {
//         grid-template-columns: repeat(3, 1fr);
//         gap: 0.5rem;
//         margin-bottom: 1rem;
//       }

//       .duration-option {
//         padding: 0.75rem;
//         font-size: 0.75rem;
//       }

//       .shame-input {
//         padding: 1rem;
//         font-size: 0.875rem;
//         margin-bottom: 1rem;
//       }

//       .roast-container {
//         padding: 1rem;
//         margin-bottom: 1rem;
//       }

//       .roast-icon {
//         font-size: 1.5rem;
//         margin-bottom: 0.75rem;
//       }

//       .roast-text {
//         font-size: 0.875rem;
//       }

//       .action-buttons {
//         flex-direction: column;
//         gap: 0.75rem;
//         margin-top: 1.5rem;
//       }

//       .verify-button {
//         padding: 0.875rem 1.5rem;
//         font-size: 0.875rem;
//         min-height: 44px;
//       }

//       .time-left {
//         margin-top: 1rem;
//         padding: 1rem;
//       }

//       .time-left-text {
//         font-size: 0.875rem;
//       }
//     }

//     @media (min-width: 321px) and (max-width: 480px) {
//       .verify-container {
//         padding: 2.5rem 0.75rem 1.5rem;
//       }

//       .verify-title {
//         font-size: 2rem;
//         line-height: 1.2;
//       }

//       .verify-subtitle {
//         font-size: 0.8125rem;
//         line-height: 1.4;
//         margin-bottom: 1.25rem;
//       }

//       .verification-options {
//         grid-template-columns: 1fr;
//         gap: 1.25rem;
//         margin-bottom: 2.5rem;
//       }

//       .option-content {
//         padding: 1.75rem;
//       }

//       .option-icon {
//         font-size: 2.75rem;
//         margin-bottom: 1.25rem;
//       }

//       .option-title {
//         font-size: 1.375rem;
//         margin-bottom: 0.625rem;
//       }

//       .option-description {
//         font-size: 0.8125rem;
//         line-height: 1.5;
//       }

//       .streak-stats {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 0.875rem;
//         margin-top: 2.5rem;
//       }

//       .stat-item {
//         padding: 1.25rem;
//       }

//       .stat-value {
//         font-size: 1.75rem;
//       }

//       .stat-label {
//         font-size: 0.5625rem;
//         margin-top: 0.375rem;
//       }

//       .verify-form {
//         padding: 0;
//       }

//       .back-button {
//         padding: 0.625rem 1.25rem;
//         font-size: 0.8125rem;
//         margin-bottom: 1.25rem;
//       }

//       .form-header {
//         margin-bottom: 1.75rem;
//       }

//       .form-title {
//         font-size: 1.375rem;
//       }

//       .form-subtitle {
//         font-size: 0.8125rem;
//         margin: 0 auto 0.625rem;
//       }

//       .instructions-panel {
//         padding: 1.25rem;
//         margin-bottom: 1.25rem;
//       }

//       .instructions-title {
//         font-size: 1.125rem;
//         margin-bottom: 0.875rem;
//       }

//       .instruction-item {
//         padding: 0.4375rem 0;
//         font-size: 0.8125rem;
//       }

//       .media-upload-container {
//         margin-bottom: 1.25rem;
//       }

//       .upload-options {
//         grid-template-columns: 1fr;
//         gap: 0.625rem;
//         margin-bottom: 1.25rem;
//       }

//       .upload-option {
//         padding: 1rem;
//       }

//       .upload-option-icon {
//         font-size: 1.375rem;
//         margin-bottom: 0.375rem;
//       }

//       .upload-option-text {
//         font-size: 0.6875rem;
//       }

//       .photo-upload-area {
//         padding: 1.75rem;
//         min-height: 225px;
//       }

//       .upload-instructions {
//         gap: 0.875rem;
//       }

//       .upload-icon {
//         font-size: 2.25rem;
//       }

//       .upload-text {
//         font-size: 0.9375rem;
//       }

//       .upload-subtext {
//         font-size: 0.6875rem;
//       }

//       .drag-drop-instruction {
//         font-size: 0.6875rem;
//         padding: 0.4375rem 0.875rem;
//       }

//       .camera-container {
//         height: 275px;
//         margin-bottom: 1.25rem;
//       }

//       .camera-controls {
//         bottom: 1.25rem;
//         gap: 0.625rem;
//       }

//       .recording-indicator {
//         top: 0.625rem;
//         left: 0.625rem;
//         padding: 0.4375rem 0.875rem;
//         font-size: 0.8125rem;
//       }

//       .duration-selector {
//         grid-template-columns: repeat(3, 1fr);
//         gap: 0.625rem;
//         margin-bottom: 1.25rem;
//       }

//       .duration-option {
//         padding: 0.875rem;
//         font-size: 0.8125rem;
//       }

//       .shame-input {
//         padding: 1.125rem;
//         font-size: 0.9375rem;
//         margin-bottom: 1.25rem;
//       }

//       .roast-container {
//         padding: 1.25rem;
//         margin-bottom: 1.25rem;
//       }

//       .roast-icon {
//         font-size: 1.625rem;
//         margin-bottom: 0.875rem;
//       }

//       .roast-text {
//         font-size: 0.9375rem;
//       }

//       .action-buttons {
//         flex-direction: column;
//         gap: 0.875rem;
//         margin-top: 1.75rem;
//       }

//       .verify-button {
//         padding: 1rem 1.75rem;
//         font-size: 0.9375rem;
//         min-height: 44px;
//       }

//       .time-left {
//         margin-top: 1.25rem;
//         padding: 1.25rem;
//       }

//       .time-left-text {
//         font-size: 0.9375rem;
//       }
//     }

//     @media (min-width: 481px) and (max-width: 640px) {
//       .verify-container {
//         padding: 3rem 1rem 2rem;
//       }

//       .verify-title {
//         font-size: 2.25rem;
//       }

//       .verify-subtitle {
//         font-size: 0.875rem;
//         margin-bottom: 1.5rem;
//       }

//       .verification-options {
//         grid-template-columns: 1fr;
//         gap: 1.5rem;
//         margin-bottom: 3rem;
//       }

//       .option-content {
//         padding: 2rem;
//       }

//       .option-icon {
//         font-size: 3rem;
//         margin-bottom: 1.5rem;
//       }

//       .option-title {
//         font-size: 1.5rem;
//         margin-bottom: 0.75rem;
//       }

//       .option-description {
//         font-size: 0.875rem;
//       }

//       .streak-stats {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 1rem;
//         margin-top: 3rem;
//       }

//       .stat-item {
//         padding: 1.5rem;
//       }

//       .stat-value {
//         font-size: 2rem;
//       }

//       .stat-label {
//         font-size: 0.625rem;
//         margin-top: 0.5rem;
//       }

//       .verify-form {
//         padding: 0;
//       }

//       .back-button {
//         padding: 0.75rem 1.5rem;
//         font-size: 0.875rem;
//         margin-bottom: 1.5rem;
//       }

//       .form-header {
//         margin-bottom: 2rem;
//       }

//       .form-title {
//         font-size: 1.5rem;
//       }

//       .form-subtitle {
//         font-size: 0.875rem;
//         margin: 0 auto 0.75rem;
//       }

//       .instructions-panel {
//         padding: 1.5rem;
//         margin-bottom: 1.5rem;
//       }

//       .instructions-title {
//         font-size: 1.25rem;
//         margin-bottom: 1rem;
//       }

//       .instruction-item {
//         padding: 0.5rem 0;
//         font-size: 0.875rem;
//       }

//       .media-upload-container {
//         margin-bottom: 1.5rem;
//       }

//       .upload-options {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 0.75rem;
//         margin-bottom: 1.5rem;
//       }

//       .upload-option {
//         padding: 1.125rem;
//       }

//       .upload-option-icon {
//         font-size: 1.5rem;
//         margin-bottom: 0.5rem;
//       }

//       .upload-option-text {
//         font-size: 0.75rem;
//       }

//       .photo-upload-area {
//         padding: 2rem;
//         min-height: 250px;
//       }

//       .upload-instructions {
//         gap: 1rem;
//       }

//       .upload-icon {
//         font-size: 2.5rem;
//       }

//       .upload-text {
//         font-size: 1rem;
//       }

//       .upload-subtext {
//         font-size: 0.75rem;
//       }

//       .drag-drop-instruction {
//         font-size: 0.75rem;
//         padding: 0.5rem 1rem;
//       }

//       .camera-container {
//         height: 300px;
//         margin-bottom: 1.5rem;
//       }

//       .camera-controls {
//         bottom: 1.5rem;
//         gap: 0.75rem;
//       }

//       .recording-indicator {
//         top: 0.75rem;
//         left: 0.75rem;
//         padding: 0.5rem 1rem;
//         font-size: 0.875rem;
//       }

//       .duration-selector {
//         grid-template-columns: repeat(3, 1fr);
//         gap: 0.75rem;
//         margin-bottom: 1.5rem;
//       }

//       .duration-option {
//         padding: 1rem;
//         font-size: 0.875rem;
//       }

//       .shame-input {
//         padding: 1.25rem;
//         font-size: 1rem;
//         margin-bottom: 1.5rem;
//       }

//       .roast-container {
//         padding: 1.5rem;
//         margin-bottom: 1.5rem;
//       }

//       .roast-icon {
//         font-size: 1.75rem;
//         margin-bottom: 1rem;
//       }

//       .roast-text {
//         font-size: 1rem;
//       }

//       .action-buttons {
//         flex-direction: column;
//         gap: 1rem;
//         margin-top: 2rem;
//       }

//       .verify-button {
//         padding: 1.125rem 2rem;
//         font-size: 1rem;
//         min-height: 44px;
//       }

//       .time-left {
//         margin-top: 1.5rem;
//         padding: 1.5rem;
//       }

//       .time-left-text {
//         font-size: 1rem;
//       }
//     }

//     @media (min-width: 641px) and (max-width: 768px) {
//       .verify-container {
//         padding: 3.5rem 1.25rem 2.5rem;
//       }

//       .verify-title {
//         font-size: 2.5rem;
//       }

//       .verify-subtitle {
//         font-size: 0.9375rem;
//         margin-bottom: 1.75rem;
//       }

//       .verification-options {
//         grid-template-columns: 1fr;
//         gap: 1.75rem;
//         margin-bottom: 3.5rem;
//       }

//       .option-content {
//         padding: 2.25rem;
//       }

//       .option-icon {
//         font-size: 3.25rem;
//         margin-bottom: 1.75rem;
//       }

//       .option-title {
//         font-size: 1.625rem;
//         margin-bottom: 0.875rem;
//       }

//       .option-description {
//         font-size: 0.9375rem;
//       }

//       .streak-stats {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 1.25rem;
//         margin-top: 3.5rem;
//       }

//       .stat-item {
//         padding: 1.75rem;
//       }

//       .stat-value {
//         font-size: 2.25rem;
//       }

//       .stat-label {
//         font-size: 0.6875rem;
//         margin-top: 0.625rem;
//       }

//       .verify-form {
//         padding: 0;
//       }

//       .back-button {
//         padding: 0.875rem 1.75rem;
//         font-size: 0.9375rem;
//         margin-bottom: 1.75rem;
//       }

//       .form-header {
//         margin-bottom: 2.25rem;
//       }

//       .form-title {
//         font-size: 1.625rem;
//       }

//       .form-subtitle {
//         font-size: 0.9375rem;
//         margin: 0 auto 0.875rem;
//       }

//       .instructions-panel {
//         padding: 1.75rem;
//         margin-bottom: 1.75rem;
//       }

//       .instructions-title {
//         font-size: 1.375rem;
//         margin-bottom: 1.125rem;
//       }

//       .instruction-item {
//         padding: 0.5625rem 0;
//         font-size: 0.9375rem;
//       }

//       .media-upload-container {
//         margin-bottom: 1.75rem;
//       }

//       .upload-options {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 0.875rem;
//         margin-bottom: 1.75rem;
//       }

//       .upload-option {
//         padding: 1.25rem;
//       }

//       .upload-option-icon {
//         font-size: 1.625rem;
//         margin-bottom: 0.625rem;
//       }

//       .upload-option-text {
//         font-size: 0.8125rem;
//       }

//       .photo-upload-area {
//         padding: 2.25rem;
//         min-height: 275px;
//       }

//       .upload-instructions {
//         gap: 1.125rem;
//       }

//       .upload-icon {
//         font-size: 2.75rem;
//       }

//       .upload-text {
//         font-size: 1.0625rem;
//       }

//       .upload-subtext {
//         font-size: 0.8125rem;
//       }

//       .drag-drop-instruction {
//         font-size: 0.8125rem;
//         padding: 0.5625rem 1.125rem;
//       }

//       .camera-container {
//         height: 325px;
//         margin-bottom: 1.75rem;
//       }

//       .camera-controls {
//         bottom: 1.75rem;
//         gap: 0.875rem;
//       }

//       .recording-indicator {
//         top: 0.875rem;
//         left: 0.875rem;
//         padding: 0.5625rem 1.125rem;
//         font-size: 0.9375rem;
//       }

//       .duration-selector {
//         grid-template-columns: repeat(3, 1fr);
//         gap: 0.875rem;
//         margin-bottom: 1.75rem;
//       }

//       .duration-option {
//         padding: 1.125rem;
//         font-size: 0.9375rem;
//       }

//       .shame-input {
//         padding: 1.375rem;
//         font-size: 1.0625rem;
//         margin-bottom: 1.75rem;
//       }

//       .roast-container {
//         padding: 1.75rem;
//         margin-bottom: 1.75rem;
//       }

//       .roast-icon {
//         font-size: 1.875rem;
//         margin-bottom: 1.125rem;
//       }

//       .roast-text {
//         font-size: 1.0625rem;
//       }

//       .action-buttons {
//         flex-direction: column;
//         gap: 1.125rem;
//         margin-top: 2.25rem;
//       }

//       .verify-button {
//         padding: 1.25rem 2.25rem;
//         font-size: 1.0625rem;
//         min-height: 44px;
//       }

//       .time-left {
//         margin-top: 1.75rem;
//         padding: 1.75rem;
//       }

//       .time-left-text {
//         font-size: 1.0625rem;
//       }
//     }

//     @media (min-width: 769px) and (max-width: 1024px) {
//       .verify-container {
//         padding: 4rem 1.5rem 3rem;
//       }

//       .verify-title {
//         font-size: 2.75rem;
//       }

//       .verify-subtitle {
//         font-size: 1rem;
//         margin-bottom: 2rem;
//       }

//       .verification-options {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 2rem;
//         margin-bottom: 4rem;
//       }

//       .option-content {
//         padding: 2.5rem;
//       }

//       .option-icon {
//         font-size: 3.5rem;
//         margin-bottom: 2rem;
//       }

//       .option-title {
//         font-size: 1.75rem;
//         margin-bottom: 1rem;
//       }

//       .option-description {
//         font-size: 1rem;
//       }

//       .streak-stats {
//         grid-template-columns: repeat(4, 1fr);
//         gap: 1.5rem;
//         margin-top: 4rem;
//       }

//       .stat-item {
//         padding: 2rem;
//       }

//       .stat-value {
//         font-size: 2.5rem;
//       }

//       .stat-label {
//         font-size: 0.75rem;
//         margin-top: 0.75rem;
//       }

//       .verify-form {
//         padding: 0;
//       }

//       .back-button {
//         padding: 1rem 2rem;
//         font-size: 1rem;
//         margin-bottom: 2rem;
//       }

//       .form-header {
//         margin-bottom: 2.5rem;
//       }

//       .form-title {
//         font-size: 1.75rem;
//       }

//       .form-subtitle {
//         font-size: 1rem;
//         margin: 0 auto 1rem;
//       }

//       .instructions-panel {
//         padding: 2rem;
//         margin-bottom: 2rem;
//       }

//       .instructions-title {
//         font-size: 1.5rem;
//         margin-bottom: 1.25rem;
//       }

//       .instruction-item {
//         padding: 0.625rem 0;
//         font-size: 1rem;
//       }

//       .media-upload-container {
//         margin-bottom: 2rem;
//       }

//       .upload-options {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 1rem;
//         margin-bottom: 2rem;
//       }

//       .upload-option {
//         padding: 1.5rem;
//       }

//       .upload-option-icon {
//         font-size: 1.75rem;
//         margin-bottom: 0.75rem;
//       }

//       .upload-option-text {
//         font-size: 0.875rem;
//       }

//       .photo-upload-area {
//         padding: 2.5rem;
//         min-height: 300px;
//       }

//       .upload-instructions {
//         gap: 1.25rem;
//       }

//       .upload-icon {
//         font-size: 3rem;
//       }

//       .upload-text {
//         font-size: 1.125rem;
//       }

//       .upload-subtext {
//         font-size: 0.875rem;
//       }

//       .drag-drop-instruction {
//         font-size: 0.875rem;
//         padding: 0.625rem 1.25rem;
//       }

//       .camera-container {
//         height: 350px;
//         margin-bottom: 2rem;
//       }

//       .camera-controls {
//         bottom: 2rem;
//         gap: 1rem;
//       }

//       .recording-indicator {
//         top: 1rem;
//         left: 1rem;
//         padding: 0.625rem 1.25rem;
//         font-size: 1rem;
//       }

//       .duration-selector {
//         grid-template-columns: repeat(3, 1fr);
//         gap: 1rem;
//         margin-bottom: 2rem;
//       }

//       .duration-option {
//         padding: 1.25rem;
//         font-size: 1rem;
//       }

//       .shame-input {
//         padding: 1.5rem;
//         font-size: 1.125rem;
//         margin-bottom: 2rem;
//       }

//       .roast-container {
//         padding: 2rem;
//         margin-bottom: 2rem;
//       }

//       .roast-icon {
//         font-size: 2rem;
//         margin-bottom: 1.25rem;
//       }

//       .roast-text {
//         font-size: 1.125rem;
//       }

//       .action-buttons {
//         flex-direction: row;
//         gap: 1rem;
//         margin-top: 2.5rem;
//       }

//       .verify-button {
//         padding: 1.5rem 2.5rem;
//         font-size: 1.125rem;
//         min-height: 44px;
//       }

//       .time-left {
//         margin-top: 2rem;
//         padding: 2rem;
//       }

//       .time-left-text {
//         font-size: 1.125rem;
//       }
//     }

//     @media (min-width: 1025px) and (max-width: 1280px) {
//       .verify-container {
//         padding: 5rem 2rem 4rem;
//       }

//       .verify-title {
//         font-size: 3rem;
//       }

//       .verify-subtitle {
//         font-size: 1.0625rem;
//         margin-bottom: 2.25rem;
//       }

//       .verification-options {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 2.25rem;
//         margin-bottom: 4.5rem;
//       }

//       .option-content {
//         padding: 2.75rem;
//       }

//       .option-icon {
//         font-size: 3.75rem;
//         margin-bottom: 2.25rem;
//       }

//       .option-title {
//         font-size: 1.875rem;
//         margin-bottom: 1.125rem;
//       }

//       .option-description {
//         font-size: 1.0625rem;
//       }

//       .streak-stats {
//         grid-template-columns: repeat(4, 1fr);
//         gap: 1.75rem;
//         margin-top: 4.5rem;
//       }

//       .stat-item {
//         padding: 2.25rem;
//       }

//       .stat-value {
//         font-size: 2.75rem;
//       }

//       .stat-label {
//         font-size: 0.8125rem;
//         margin-top: 0.875rem;
//       }

//       .verify-form {
//         padding: 0;
//       }

//       .back-button {
//         padding: 1.125rem 2.25rem;
//         font-size: 1.0625rem;
//         margin-bottom: 2.25rem;
//       }

//       .form-header {
//         margin-bottom: 2.75rem;
//       }

//       .form-title {
//         font-size: 1.875rem;
//       }

//       .form-subtitle {
//         font-size: 1.0625rem;
//         margin: 0 auto 1.125rem;
//       }

//       .instructions-panel {
//         padding: 2.25rem;
//         margin-bottom: 2.25rem;
//       }

//       .instructions-title {
//         font-size: 1.625rem;
//         margin-bottom: 1.375rem;
//       }

//       .instruction-item {
//         padding: 0.6875rem 0;
//         font-size: 1.0625rem;
//       }

//       .media-upload-container {
//         margin-bottom: 2.25rem;
//       }

//       .upload-options {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 1.125rem;
//         margin-bottom: 2.25rem;
//       }

//       .upload-option {
//         padding: 1.625rem;
//       }

//       .upload-option-icon {
//         font-size: 1.875rem;
//         margin-bottom: 0.875rem;
//       }

//       .upload-option-text {
//         font-size: 0.9375rem;
//       }

//       .photo-upload-area {
//         padding: 2.75rem;
//         min-height: 325px;
//       }

//       .upload-instructions {
//         gap: 1.375rem;
//       }

//       .upload-icon {
//         font-size: 3.25rem;
//       }

//       .upload-text {
//         font-size: 1.1875rem;
//       }

//       .upload-subtext {
//         font-size: 0.9375rem;
//       }

//       .drag-drop-instruction {
//         font-size: 0.9375rem;
//         padding: 0.6875rem 1.375rem;
//       }

//       .camera-container {
//         height: 375px;
//         margin-bottom: 2.25rem;
//       }

//       .camera-controls {
//         bottom: 2.25rem;
//         gap: 1.125rem;
//       }

//       .recording-indicator {
//         top: 1.125rem;
//         left: 1.125rem;
//         padding: 0.6875rem 1.375rem;
//         font-size: 1.0625rem;
//       }

//       .duration-selector {
//         grid-template-columns: repeat(3, 1fr);
//         gap: 1.125rem;
//         margin-bottom: 2.25rem;
//       }

//       .duration-option {
//         padding: 1.375rem;
//         font-size: 1.0625rem;
//       }

//       .shame-input {
//         padding: 1.625rem;
//         font-size: 1.1875rem;
//         margin-bottom: 2.25rem;
//       }

//       .roast-container {
//         padding: 2.25rem;
//         margin-bottom: 2.25rem;
//       }

//       .roast-icon {
//         font-size: 2.125rem;
//         margin-bottom: 1.375rem;
//       }

//       .roast-text {
//         font-size: 1.1875rem;
//       }

//       .action-buttons {
//         flex-direction: row;
//         gap: 1.125rem;
//         margin-top: 2.75rem;
//       }

//       .verify-button {
//         padding: 1.625rem 2.75rem;
//         font-size: 1.1875rem;
//         min-height: 44px;
//       }

//       .time-left {
//         margin-top: 2.25rem;
//         padding: 2.25rem;
//       }

//       .time-left-text {
//         font-size: 1.1875rem;
//       }
//     }

//     @media (min-width: 1281px) {
//       .verify-container {
//         max-width: 1600px;
//         margin: 0 auto;
//         padding: 6rem 3rem 5rem;
//       }

//       .verify-title {
//         font-size: 3.5rem;
//       }

//       .verify-subtitle {
//         font-size: 1.125rem;
//         margin-bottom: 2.5rem;
//       }

//       .verification-options {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 2.5rem;
//         margin-bottom: 5rem;
//       }

//       .option-content {
//         padding: 3rem;
//       }

//       .option-icon {
//         font-size: 4rem;
//         margin-bottom: 2.5rem;
//       }

//       .option-title {
//         font-size: 2rem;
//         margin-bottom: 1.25rem;
//       }

//       .option-description {
//         font-size: 1.125rem;
//       }

//       .streak-stats {
//         grid-template-columns: repeat(4, 1fr);
//         gap: 2rem;
//         margin-top: 5rem;
//       }

//       .stat-item {
//         padding: 2.5rem;
//       }

//       .stat-value {
//         font-size: 3rem;
//       }

//       .stat-label {
//         font-size: 0.875rem;
//         margin-top: 1rem;
//       }

//       .verify-form {
//         padding: 0;
//       }

//       .back-button {
//         padding: 1.25rem 2.5rem;
//         font-size: 1.125rem;
//         margin-bottom: 2.5rem;
//       }

//       .form-header {
//         margin-bottom: 3rem;
//       }

//       .form-title {
//         font-size: 2rem;
//       }

//       .form-subtitle {
//         font-size: 1.125rem;
//         margin: 0 auto 1.25rem;
//       }

//       .instructions-panel {
//         padding: 2.5rem;
//         margin-bottom: 2.5rem;
//       }

//       .instructions-title {
//         font-size: 1.75rem;
//         margin-bottom: 1.5rem;
//       }

//       .instruction-item {
//         padding: 0.75rem 0;
//         font-size: 1.125rem;
//       }

//       .media-upload-container {
//         margin-bottom: 2.5rem;
//       }

//       .upload-options {
//         grid-template-columns: repeat(2, 1fr);
//         gap: 1.25rem;
//         margin-bottom: 2.5rem;
//       }

//       .upload-option {
//         padding: 1.75rem;
//       }

//       .upload-option-icon {
//         font-size: 2rem;
//         margin-bottom: 1rem;
//       }

//       .upload-option-text {
//         font-size: 1rem;
//       }

//       .photo-upload-area {
//         padding: 3rem;
//         min-height: 350px;
//       }

//       .upload-instructions {
//         gap: 1.5rem;
//       }

//       .upload-icon {
//         font-size: 3.5rem;
//       }

//       .upload-text {
//         font-size: 1.25rem;
//       }

//       .upload-subtext {
//         font-size: 1rem;
//       }

//       .drag-drop-instruction {
//         font-size: 1rem;
//         padding: 0.75rem 1.5rem;
//       }

//       .camera-container {
//         height: 400px;
//         margin-bottom: 2.5rem;
//       }

//       .camera-controls {
//         bottom: 2.5rem;
//         gap: 1.25rem;
//       }

//       .recording-indicator {
//         top: 1.25rem;
//         left: 1.25rem;
//         padding: 0.75rem 1.5rem;
//         font-size: 1.125rem;
//       }

//       .duration-selector {
//         grid-template-columns: repeat(3, 1fr);
//         gap: 1.25rem;
//         margin-bottom: 2.5rem;
//       }

//       .duration-option {
//         padding: 1.5rem;
//         font-size: 1.125rem;
//       }

//       .shame-input {
//         padding: 1.75rem;
//         font-size: 1.25rem;
//         margin-bottom: 2.5rem;
//       }

//       .roast-container {
//         padding: 2.5rem;
//         margin-bottom: 2.5rem;
//       }

//       .roast-icon {
//         font-size: 2.25rem;
//         margin-bottom: 1.5rem;
//       }

//       .roast-text {
//         font-size: 1.25rem;
//       }

//       .action-buttons {
//         flex-direction: row;
//         gap: 1.25rem;
//         margin-top: 3rem;
//       }

//       .verify-button {
//         padding: 1.75rem 3rem;
//         font-size: 1.25rem;
//         min-height: 44px;
//       }

//       .time-left {
//         margin-top: 2.5rem;
//         padding: 2.5rem;
//       }

//       .time-left-text {
//         font-size: 1.25rem;
//       }
//     }

//     /* Touch-friendly interactions */
//     @media (max-width: 768px) {
//       .verification-option {
//         min-height: 44px;
//       }

//       .upload-option {
//         min-height: 44px;
//       }

//       .duration-option {
//         min-height: 44px;
//       }

//       .verify-button {
//         min-height: 44px;
//         touch-action: manipulation;
//       }

//       .back-button {
//   `;

//   return (
//     <div className="verify-page">
//       <style>{styles}</style>
      
//       <div className="verify-bg-grid"></div>
//       <div className="verify-floating-elements">
//         <div className="verify-float-1"></div>
//         <div className="verify-float-2"></div>
//         <div className="verify-float-3"></div>
//       </div>

//       <div className="verify-container">
//         {!verificationMethod ? (
//           <>
//             <div className="verify-header">
//               <h1 className="verify-title text-gradient">
//                 Have You Touched Grass Today?
//               </h1>
//               <p className="verify-subtitle">
//                 Your {streakData.current}-day streak is on the line. 
//                 Prove your discipline or face the consequences.
//               </p>
//             </div>
            
//             <div className="verification-options">
//               <motion.div 
//                 className="verification-option"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setVerificationMethod('photo')}
//               >
//                 <div className="option-content glass option-yes">
//                   <span className="option-icon">🌱</span>
//                   <h2 className="option-title">Yes</h2>
//                   <p className="option-description">
//                     Upload photo/video proof & continue your streak. Show us you're living in the real world.
//                   </p>
//                 </div>
//               </motion.div>
              
//               <motion.div 
//                 className="verification-option"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setVerificationMethod('shame')}
//               >
//                 <div className="option-content glass option-no">
//                   <span className="option-icon">❌</span>
//                   <h2 className="option-title">No</h2>
//                   <p className="option-description">
//                     Accept public shame & continue streak with a mark. Your ego will hate this.
//                   </p>
//                 </div>
//               </motion.div>
//             </div>
            
//             <div className="streak-stats">
//               <div className="stat-item glass">
//                 <h3 className="stat-value">{streakData.current}</h3>
//                 <p className="stat-label">Current Streak</p>
//               </div>
              
//               <div className="stat-item glass">
//                 <h3 className="stat-value">{streakData.longest}</h3>
//                 <p className="stat-label">Longest Streak</p>
//               </div>
              
//               <div className="stat-item glass">
//                 <h3 className="stat-value">#{streakData.rank}</h3>
//                 <p className="stat-label">Global Rank</p>
//               </div>
              
//               <div className="stat-item glass">
//                 <h3 className="stat-value">{streakData.nextCheckpoint}</h3>
//                 <p className="stat-label">Time Left Today</p>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="verify-form">
//             <button 
//               className="back-button glass"
//               onClick={() => {
//                 setVerificationMethod(null);
//                 setPhoto(null);
//                 setVideo(null);
//                 setShowCamera(false);
//                 setShowVideoRecorder(false);
//                 setIsDragOver(false);
//                 cleanupMediaStreams();
//                 if (recordingTimerRef.current) {
//                   clearInterval(recordingTimerRef.current);
//                 }
//               }}
//             >
//               <ArrowLeft size={16} />
//               Back to choices
//             </button>
            
//             {verificationMethod === 'photo' ? (
//               <>
//                 <div className="form-header">
//                   <h2 className="form-title text-gradient">Prove Your Outdoor Adventure</h2>
//                   <p className="form-subtitle">
//                     Upload a photo or video showing grass, nature, or outdoor activity
//                   </p>
//                 </div>
                
//                 <div className="instructions-panel glass">
//                   <h3 className="instructions-title">
//                     <CheckCircle2 size={24} />
//                     What counts as proof?
//                   </h3>
//                   <ul className="instructions-list">
//                     <li className="instruction-item">
//                       <span className="instruction-icon">✅</span>
//                       Photos/videos showing grass, trees, or nature
//                     </li>
//                     <li className="instruction-item">
//                       <span className="instruction-icon">✅</span>
//                       Outdoor exercise (running, hiking, sports)
//                     </li>
//                     <li className="instruction-item">
//                       <span className="instruction-icon">✅</span>
//                       Sunlight & sky visible in media
//                     </li>
//                     <li className="instruction-item">
//                       <span className="instruction-icon">❌</span>
//                       No indoor plants or old media
//                     </li>
//                   </ul>
//                 </div>
                
//                 <div className="media-upload-container">
//                   <div className="upload-options">
//                     <div 
//                       className={`upload-option glass ${mediaType === 'photo' ? 'active' : ''}`}
//                       onClick={() => setMediaType('photo')}
//                     >
//                       <span className="upload-option-icon">📸</span>
//                       <p className="upload-option-text">Upload Photo</p>
//                     </div>
                    
//                     <div 
//                       className={`upload-option glass ${mediaType === 'video' ? 'active' : ''}`}
//                       onClick={() => setMediaType('video')}
//                     >
//                       <span className="upload-option-icon">🎥</span>
//                       <p className="upload-option-text">Upload Video</p>
//                     </div>
//                   </div>
                  
//                   {showCamera ? (
//                     <div className="camera-container glass">
//                       <video
//                         ref={cameraRef}
//                         className="camera-video"
//                         autoPlay
//                         playsInline
//                       />
//                       <div className="camera-controls">
//                         <button
//                           onClick={capturePhoto}
//                           className="verify-button button-primary"
//                         >
//                           <Camera size={20} />
//                           Capture Photo
//                         </button>
//                         <button
//                           onClick={() => {
//                             setShowCamera(false);
//                             cleanupMediaStreams();
//                           }}
//                           className="verify-button button-secondary"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : showVideoRecorder ? (
//                     <div className="camera-container glass">
//                       <video
//                         ref={videoRecorderRef}
//                         className="camera-video"
//                         autoPlay
//                         playsInline
//                       />
//                       {recordingTime > 0 && (
//                         <div className="recording-indicator">
//                           <div className="recording-dot" />
//                           Recording: {recordingTime}s
//                         </div>
//                       )}
//                       <div className="camera-controls">
//                         {mediaRecorderRef.current?.state === 'recording' ? (
//                           <button
//                             onClick={stopVideoRecording}
//                             className="verify-button button-danger"
//                           >
//                             ⏹️ Stop Recording
//                           </button>
//                         ) : (
//                           <button
//                             onClick={startVideoRecording}
//                             className="verify-button button-primary"
//                           >
//                             <Video size={20} />
//                             Start Recording
//                           </button>
//                         )}
//                         <button
//                           onClick={() => {
//                             setShowVideoRecorder(false);
//                             stopVideoRecording();
//                           }}
//                           className="verify-button button-secondary"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div 
//                       ref={dropZoneRef}
//                       className={`photo-upload-area glass ${photo || video ? 'has-media' : ''} ${isDragOver ? 'drag-over' : ''}`}
//                       onClick={() => {
//                         if (mediaType === 'photo' && !photo) {
//                           fileInputRef.current?.click();
//                         } else if (mediaType === 'video' && !video) {
//                           videoFileInputRef.current?.click();
//                         }
//                       }}
//                     >
//                       {(photo || video) ? (
//                         <>
//                           {mediaType === 'photo' && photo ? (
//                             <>
//                               <img src={photo} alt="Verification" className="media-preview" />
//                               <div className="media-actions">
//                                 <button 
//                                   className="media-action-button"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     removeMedia();
//                                   }}
//                                 >
//                                   <X size={20} color="white" />
//                                 </button>
//                               </div>
//                             </>
//                           ) : video ? (
//                             <>
//                               <video 
//                                 src={video} 
//                                 className="video-preview" 
//                                 controls 
//                                 onClick={(e) => e.stopPropagation()}
//                               />
//                               <div className="media-actions">
//                                 <button 
//                                   className="media-action-button"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     removeMedia();
//                                   }}
//                                 >
//                                   <X size={20} color="white" />
//                                 </button>
//                               </div>
//                             </>
//                           ) : null}
//                         </>
//                       ) : (
//                         <div className="upload-instructions">
//                           <span className="upload-icon">
//                             {isDragOver ? '🎯' : mediaType === 'photo' ? '📸' : '🎥'}
//                           </span>
//                           <p className="upload-text">
//                             {isDragOver 
//                               ? 'Drop your file here!' 
//                               : mediaType === 'photo' 
//                                 ? 'Click to upload photo' 
//                                 : 'Click to upload video'}
//                           </p>
//                           <p className="upload-subtext">
//                             {mediaType === 'photo'
//                               ? 'or drag and drop your photo here'
//                               : 'or drag and drop your video here'}
//                           </p>
//                           <div className="drag-drop-instruction">
//                             <FileUp size={14} />
//                             Supports {mediaType === 'photo' ? 'JPG, PNG, GIF' : 'MP4, MOV, AVI'} • Max {mediaType === 'photo' ? '10MB' : '50MB'}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
                  
//                   {isUploading && (
//                     <div className="upload-progress">
//                       <div className="progress-bar">
//                         <div 
//                           className="progress-fill" 
//                           style={{ width: `${uploadProgress}%` }}
//                         />
//                       </div>
//                       <p className="progress-text">
//                         Uploading... {uploadProgress}%
//                       </p>
//                     </div>
//                   )}
                  
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileUpload(e, 'photo')}
//                     style={{ display: 'none' }}
//                   />
                  
//                   <input
//                     ref={videoFileInputRef}
//                     type="file"
//                     accept="video/*"
//                     onChange={(e) => handleFileUpload(e, 'video')}
//                     style={{ display: 'none' }}
//                   />
                  
//                   {!showCamera && !showVideoRecorder && (
//                     <div style={{ 
//                       display: 'flex', 
//                       gap: '1rem', 
//                       marginTop: '1rem',
//                       justifyContent: 'center',
//                       flexWrap: 'wrap'
//                     }}>
//                       <button
//                         onClick={() => startCamera('photo')}
//                         className="verify-button button-secondary"
//                         style={{ flex: 'none' }}
//                       >
//                         <Camera size={16} /> Take Photo
//                       </button>
                      
//                       <button
//                         onClick={() => startCamera('video')}
//                         className="verify-button button-secondary"
//                         style={{ flex: 'none' }}
//                       >
//                         <Video size={16} /> Record Video
//                       </button>
//                     </div>
//                   )}
//                 </div>
                
//                 <div style={{ marginBottom: '2rem' }}>
//                   <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
//                     ⏱️ How many minutes were you outside?
//                   </h3>
//                   <div className="duration-selector">
//                     {durations.map((mins) => (
//                       <button
//                         key={mins}
//                         className={`duration-option glass ${duration === mins ? 'selected' : ''}`}
//                         onClick={() => setDuration(mins)}
//                       >
//                         {mins} min
//                       </button>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div className="action-buttons">
//                   <button
//                     onClick={() => submitVerification('photo')}
//                     disabled={(!photo && !video) || isSubmitting}
//                     className="verify-button button-primary"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 size={20} className="animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       '🌱 Submit Verification'
//                     )}
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="form-header">
//                   <h2 className="form-title text-gradient">Accept Your Digital Shame</h2>
//                   <p className="form-subtitle">
//                     You chose to stay indoors. Write a public confession that will be displayed on your profile.
//                   </p>
//                 </div>
                
//                 <div className="roast-container glass">
//                   <span className="roast-icon">🤖</span>
//                   <p className="roast-text">
//                     {roasts[Math.floor(Math.random() * roasts.length)]}
//                   </p>
//                 </div>
                
//                 <textarea
//                   className="shame-input glass"
//                   placeholder="I failed to touch grass today because..."
//                   value={shameMessage}
//                   onChange={(e) => setShameMessage(e.target.value)}
//                   maxLength={200}
//                 />
                
//                 <div style={{ 
//                   textAlign: 'right', 
//                   marginBottom: '1.5rem',
//                   color: '#71717a',
//                   fontSize: '0.875rem'
//                 }}>
//                   {shameMessage.length}/200 characters
//                 </div>
                
//                 <div className="instructions-panel glass">
//                   <h3 className="instructions-title">
//                     <AlertCircle size={24} />
//                     Consequences of Shame
//                   </h3>
//                   <ul className="instructions-list">
//                     <li className="instruction-item">
//                       <span className="instruction-icon">📉</span>
//                       Your streak continues but marked with shame
//                     </li>
//                     <li className="instruction-item">
//                       <span className="instruction-icon">👁️</span>
//                       "Shame Day" badge on your profile for 24h
//                     </li>
//                     <li className="instruction-item">
//                       <span className="instruction-icon">📊</span>
//                       Ranked below users with verified days
//                     </li>
//                   </ul>
//                 </div>
                
//                 <div className="action-buttons">
//                   <button
//                     onClick={() => submitVerification('shame')}
//                     disabled={shameMessage.length < 10 || isSubmitting}
//                     className="verify-button button-danger"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 size={20} className="animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       '😈 Accept Public Shame'
//                     )}
//                   </button>
                  
//                   <button
//                     onClick={() => setVerificationMethod('photo')}
//                     className="verify-button button-secondary"
//                   >
//                     🌱 Redeem with Photo/Video Instead
//                   </button>
//                 </div>
//               </>
//             )}
            
//             <div className="time-left glass">
//               <p className="time-left-text">
//                 ⏰ Time until streak breaks: {streakData.nextCheckpoint}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {showSuccess && (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 flex items-center justify-center z-50"
//           style={{ background: 'rgba(0, 0, 0, 0.8)' }}
//         >
//           <motion.div
//             initial={{ scale: 0.5 }}
//             animate={{ scale: 1 }}
//             className="p-8 rounded-3xl glass text-center"
//             style={{ maxWidth: '400px' }}
//           >
//             <div className="text-6xl mb-4">🎉</div>
//             <h3 className="text-2xl font-bold mb-2">Verification Complete!</h3>
//             <p className="text-gray-400">Redirecting to dashboard...</p>
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default Verify;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
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
  Activity,
  Timer,
  MessageCircle,
  Hash,
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  Bookmark
} from 'lucide-react';

const Verify = () => {
  const navigate = useNavigate();
  const [verificationMethod, setVerificationMethod] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [shameMessage, setShameMessage] = useState('');
  const [duration, setDuration] = useState(15);
  const [activityType, setActivityType] = useState('walk');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
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
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [isPostedToWall, setIsPostedToWall] = useState(false);
  
  const cameraRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const dropZoneRef = useRef(null);

  const durations = [5, 15, 30, 60, 120];
  const roasts = [
    "Still a digital zombie, I see. Your chair must be fused to your skin by now.",
    "Another day indoors? Even houseplants get more sunlight than you.",
    "Your vitamin D levels are crying. Go outside.",
    "Your screen time is longer than your life expectancy at this rate.",
    "The grass is calling. Unfortunately, it's saying 'I don't know this person.'",
    "You've evolved from human to houseplant. At least they photosynthesize."
  ];

  // Activity types with Instagram-style emojis
  const activityTypes = [
    { value: 'walk', label: 'Walk', emoji: '🚶', color: '#3b82f6', description: 'Casual walking outdoors' },
    { value: 'run', label: 'Run', emoji: '🏃', color: '#ef4444', description: 'Running or jogging' },
    { value: 'hike', label: 'Hike', emoji: '🥾', color: '#22c55e', description: 'Hiking in nature' },
    { value: 'sports', label: 'Sports', emoji: '⚽', color: '#f59e0b', description: 'Sports activities' },
    { value: 'gardening', label: 'Gardening', emoji: '🌱', color: '#10b981', description: 'Gardening work' },
    { value: 'picnic', label: 'Picnic', emoji: '🧺', color: '#f97316', description: 'Outdoor picnic' },
    { value: 'meditation', label: 'Meditation', emoji: '🧘', color: '#8b5cf6', description: 'Outdoor meditation' },
    { value: 'reading', label: 'Reading', emoji: '📚', color: '#6366f1', description: 'Reading outside' },
    { value: 'cycling', label: 'Cycling', emoji: '🚴', color: '#ec4899', description: 'Bicycle riding' },
    { value: 'swimming', label: 'Swimming', emoji: '🏊', color: '#06b6d4', description: 'Swimming outdoors' },
    { value: 'yoga', label: 'Yoga', emoji: '🧘‍♀️', color: '#8b5cf6', description: 'Outdoor yoga' },
    { value: 'fishing', label: 'Fishing', emoji: '🎣', color: '#3b82f6', description: 'Fishing activity' },
    { value: 'camping', label: 'Camping', emoji: '🏕️', color: '#ea580c', description: 'Camping outdoors' },
    { value: 'photography', label: 'Photography', emoji: '📷', color: '#8b5cf6', description: 'Nature photography' },
    { value: 'other', label: 'Other', emoji: '✨', color: '#64748b', description: 'Other outdoor activity' }
  ];

  // Load user data
  useEffect(() => {
    loadUserData();
    loadStreakData();
    setupDragAndDrop();
    calculateTimeLeft();
    
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => {
      cleanupMediaStreams();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      clearInterval(timer);
    };
  }, []);

  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem('touchgrass_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const loadStreakData = () => {
    try {
      const user = loadUserData();
      if (!user) return;
      
      const streakKey = `touchgrass_streak_${user.username}`;
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
    } catch (error) {
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

  // Setup drag and drop
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

  // CRITICAL FUNCTION: AUTO-POST TO VERIFICATION WALL
  const autoPostToVerificationWall = (verificationData, user) => {
    try {
      // Use passed user data
      if (!user || !user.username) {
        return null;
      }

      // Get current streak data
      const streakKey = `touchgrass_streak_${user.username}`;
      const streak = JSON.parse(localStorage.getItem(streakKey) || '{}');
      
      // Get activity info
      const selectedActivity = activityTypes.find(a => a.value === verificationData.activityType) || activityTypes[activityTypes.length - 1];
      
      // Generate unique post ID
      const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create Instagram-style post object
      const newPost = {
        id: postId,
        userId: user.username,
        displayName: user.displayName || user.username,
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        photoUrl: verificationData.photo || verificationData.video || '',
        activityType: verificationData.activityType || 'other',
        activityEmoji: selectedActivity.emoji,
        activityLabel: selectedActivity.label,
        activityColor: selectedActivity.color,
        duration: verificationData.duration || 15,
        caption: verificationData.caption || `${selectedActivity.emoji} Day ${streak.currentStreak || 1} streak! ${selectedActivity.description}`,
        location: verificationData.location || 'Outdoors',
        likes: 0,
        likeCount: 0,
        comments: [],
        commentCount: 0,
        reports: 0,
        reportCount: 0,
        verified: true,
        createdAt: new Date().toISOString(),
        likedBy: [],
        streak: streak.currentStreak || 0,
        // Instagram-like engagement features
        isLiked: false,
        isBookmarked: false,
        hasComments: false,
        shareCount: 0,
        viewCount: Math.floor(Math.random() * 1000) + 100,
        // For instant Instagram-like UI
        showComments: false,
        showLikes: false,
        isVerified: true,
        verificationBadge: true,
        // Add to my posts section
        isMyPost: true
      };
      
      // Get existing posts from localStorage
      const existingPosts = JSON.parse(localStorage.getItem('touchgrass_verification_posts') || '[]');
      
      // Add new post to the beginning (most recent first)
      const updatedPosts = [newPost, ...existingPosts];
      
      // Save updated posts to localStorage
      localStorage.setItem('touchgrass_verification_posts', JSON.stringify(updatedPosts));
      
      
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('verification-wall-updated', {
        detail: { posts: updatedPosts }
      }));
      
      // Store the posted ID for immediate access
      localStorage.setItem('last_posted_id', postId);
      
      return newPost;
    } catch (error) {
      return null;
    }
  };

  // MAIN VERIFICATION SUBMISSION
  const submitVerification = async (method) => {
    if (method === 'photo' && !photo && !video) {
      toast.error('Please upload a photo or video first');
      return;
    }

    if (method === 'shame' && shameMessage.length < 10) {
      toast.error('Shame message must be at least 10 characters');
      return;
    }

    if (!userData || !userData.username) {
      toast.error('Please login first');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const user = userData;
        
        const streakKey = `touchgrass_streak_${user.username}`;
        const currentStreak = JSON.parse(localStorage.getItem(streakKey) || '{}');
        
        // Update streak data
        const updatedStreak = {
          ...currentStreak,
          currentStreak: (currentStreak.currentStreak || 0) + 1,
          longestStreak: Math.max(currentStreak.longestStreak || 0, (currentStreak.currentStreak || 0) + 1),
          totalDays: (currentStreak.totalDays || 0) + 1,
          totalOutdoorTime: (currentStreak.totalOutdoorTime || 0) + (method === 'photo' ? duration : 0),
          todayVerified: true,
          lastVerification: new Date().toISOString()
        };
        
        if (!updatedStreak.history) {
          updatedStreak.history = [];
        }
        
        updatedStreak.history.push({
          date: new Date().toISOString(),
          verified: true,
          verificationMethod: method,
          duration: method === 'photo' ? duration : 0,
          notes: method === 'shame' ? shameMessage : '',
          timestamp: new Date().toISOString()
        });
        
        localStorage.setItem(streakKey, JSON.stringify(updatedStreak));
        
        // AUTO-POST TO VERIFICATION WALL FOR PHOTO VERIFICATIONS
        if (method === 'photo' && (photo || video)) {
          const postData = {
            photo: photo,
            video: video,
            activityType: activityType,
            duration: duration,
            caption: caption || `${activityTypes.find(a => a.value === activityType)?.emoji} Day ${updatedStreak.currentStreak} streak!`,
            location: location || 'Outdoors'
          };

          const posted = autoPostToVerificationWall(postData, user);

          if (posted) {
            setIsPostedToWall(true);
            toast.success('📸 Posted to Verification Wall!', {
              icon: '✅',
              duration: 3000,
              style: {
                background: '#10b981',
                color: 'white',
                fontWeight: 'bold'
              }
            });
            setIsSubmitting(false);
            // Navigate immediately to see the post
            setTimeout(() => navigate('/verification-wall'), 500);
            return; // Exit early, don't show success modal
          }
        }

        setIsSubmitting(false);
        setShowSuccess(true);
        
        if (method === 'photo') {
          toast.success(`🌱 Success! Day ${updatedStreak.currentStreak} verified`, {
            duration: 2000
          });
        } else {
          toast.success('😈 Shame accepted. Your streak continues...', {
            duration: 2000
          });
        }
        
      } catch (error) {
        toast.error('Failed to submit verification');
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const removeMedia = () => {
    if (mediaType === 'photo') {
      setPhoto(null);
    } else {
      setVideo(null);
    }
    setMediaType('photo');
  };

  const getActivityInfo = (type) => {
    return activityTypes.find(a => a.value === type) || activityTypes[activityTypes.length - 1];
  };

  // Return to dashboard or verification wall
  const handleSuccessNavigation = () => {
    if (verificationMethod === 'photo' && isPostedToWall) {
      navigate('/verification-wall'); // Go directly to see the post
    } else {
      navigate('/dashboard');
    }
  };

  // Effect for success navigation
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        handleSuccessNavigation();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, verificationMethod, isPostedToWall, navigate]);

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

    .activity-selector {
      margin-bottom: 2rem;
    }

    .activity-preview {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .activity-preview:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .activity-emoji {
      font-size: 1.5rem;
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
    }

    .activity-info {
      flex: 1;
    }

    .activity-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .activity-description {
      font-size: 0.875rem;
      color: #a1a1aa;
    }

    .activity-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .activity-modal-content {
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.95);
      position: relative;
      padding: 2rem;
    }

    .activity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .activity-option {
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .activity-option:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.08);
    }

    .activity-option.selected {
      border-color: rgba(0, 229, 255, 0.3);
      background: rgba(0, 229, 255, 0.2);
    }

    .activity-option-emoji {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .activity-option-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .activity-option-desc {
      font-size: 0.75rem;
      color: #a1a1aa;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
      margin-bottom: 1rem;
      font-family: inherit;
    }

    .form-input:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: #a1a1aa;
      font-weight: 500;
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

    /* Instagram-style verification wall post preview */
    .wall-post-preview {
      margin: 2rem 0;
      border-radius: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      background: rgba(255, 255, 255, 0.02);
    }

    .wall-preview-header {
      display: flex;
      align-items: center;
      padding: 1rem;
      gap: 0.75rem;
    }

    .wall-preview-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .wall-preview-user {
      flex: 1;
    }

    .wall-preview-name {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .wall-preview-time {
      font-size: 0.75rem;
      color: #71717a;
    }

    .wall-preview-media {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .wall-preview-caption {
      padding: 1rem;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .wall-preview-stats {
      padding: 0 1rem 1rem;
      font-size: 0.75rem;
      color: #71717a;
      display: flex;
      gap: 1rem;
    }

    /* Responsive styles */
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
        gap: 1.5rem;
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

      .activity-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      }

      .action-buttons {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .verify-title {
        font-size: 2rem;
      }

      .verify-subtitle {
        font-size: 0.875rem;
      }

      .option-content {
        padding: 1.5rem;
      }

      .activity-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .form-title {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <div className="verify-page">
      <style>{styles}</style>
      
      {/* Background Effects */}
      <div className="verify-bg-grid"></div>
      <div className="verify-floating-elements">
        <div className="verify-float-1"></div>
        <div className="verify-float-2"></div>
        <div className="verify-float-3"></div>
      </div>

      <div className="verify-container">
        {!verificationMethod ? (
          <>
            {/* Initial Verification Choice */}
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
                  <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#22c55e' }}>
                    📸 Automatically posts to Verification Wall
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
                  <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#ef4444' }}>
                    😈 Public confession on your profile
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
              
              <div className="stat-item glass">
                <h3 className="stat-value">#{streakData.rank}</h3>
                <p className="stat-label">Global Rank</p>
              </div>
              
              <div className="stat-item glass">
                <h3 className="stat-value">{streakData.nextCheckpoint}</h3>
                <p className="stat-label">Time Left Today</p>
              </div>
            </div>
          </>
        ) : (
          <div className="verify-form">
            {/* Back Button */}
            <button 
              className="back-button glass"
              onClick={() => {
                setVerificationMethod(null);
                setPhoto(null);
                setVideo(null);
                setShowCamera(false);
                setShowVideoRecorder(false);
                setIsDragOver(false);
                cleanupMediaStreams();
                if (recordingTimerRef.current) {
                  clearInterval(recordingTimerRef.current);
                }
              }}
            >
              <ArrowLeft size={16} />
              Back to choices
            </button>
            
            {verificationMethod === 'photo' ? (
              <>
                {/* Photo Verification Form */}
                <div className="form-header">
                  <h2 className="form-title text-gradient">Prove Your Outdoor Adventure</h2>
                  <p className="form-subtitle">
                    Upload a photo or video showing grass, nature, or outdoor activity
                  </p>
                  <p style={{ color: '#00E5FF', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    📸 This will be automatically posted to the public Verification Wall
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
                
                {/* Media Upload Section */}
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
                  
                  {/* Camera Views */}
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
                  
                  {/* Upload Progress */}
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
                  
                  {/* Hidden File Inputs */}
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
                  
                  {/* Camera Buttons */}
                  {!showCamera && !showVideoRecorder && (
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
                
                {/* Activity Type Selector */}
                <div className="activity-selector">
                  <div className="form-label">
                    <Activity size={16} style={{ marginRight: '0.5rem' }} />
                    Activity Type
                  </div>
                  <div 
                    className="activity-preview glass"
                    onClick={() => setShowActivitySelector(true)}
                  >
                    <div 
                      className="activity-emoji"
                      style={{ background: `${getActivityInfo(activityType).color}20` }}
                    >
                      {getActivityInfo(activityType).emoji}
                    </div>
                    <div className="activity-info">
                      <div className="activity-name">{getActivityInfo(activityType).label}</div>
                      <div className="activity-description">{getActivityInfo(activityType).description}</div>
                    </div>
                  </div>
                </div>
                
                {/* Duration Selector */}
                <div style={{ marginBottom: '2rem' }}>
                  <div className="form-label">
                    <Timer size={16} style={{ marginRight: '0.5rem' }} />
                    How many minutes were you outside?
                  </div>
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
                
                {/* Caption Input */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="form-label">
                    <MessageCircle size={16} style={{ marginRight: '0.5rem' }} />
                    Caption (optional)
                  </div>
                  <textarea
                    className="form-input"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Describe your outdoor activity..."
                    rows="3"
                    maxLength="300"
                  />
                  <div style={{ fontSize: '0.75rem', color: '#71717a', textAlign: 'right', marginTop: '0.25rem' }}>
                    {caption.length}/300 characters
                  </div>
                </div>
                
                {/* Location Input */}
                <div style={{ marginBottom: '2rem' }}>
                  <div className="form-label">
                    <MapPin size={16} style={{ marginRight: '0.5rem' }} />
                    Location (optional)
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where did you do this activity?"
                  />
                </div>
                
                {/* Post Preview */}
                {(photo || video) && (
                  <div className="wall-post-preview glass">
                    <p style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.875rem',
                      color: '#a1a1aa'
                    }}>
                      📸 This is how your post will appear on the Verification Wall:
                    </p>
                    <div className="wall-preview-header">
                      <img 
                        src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || 'user'}`} 
                        alt="Avatar" 
                        className="wall-preview-avatar"
                      />
                      <div className="wall-preview-user">
                        <div className="wall-preview-name">{userData?.displayName || userData?.username || 'User'}</div>
                        <div className="wall-preview-time">Just now • {getActivityInfo(activityType).label}</div>
                      </div>
                    </div>
                    {mediaType === 'photo' ? (
                      <img src={photo} alt="Preview" className="wall-preview-media" />
                    ) : (
                      <video src={video} className="wall-preview-media" controls />
                    )}
                    <div className="wall-preview-caption">
                      {caption || `${getActivityInfo(activityType).emoji} Day ${streakData.current + 1} streak! ${getActivityInfo(activityType).description}`}
                    </div>
                    <div className="wall-preview-stats">
                      <span>❤️ 0 likes</span>
                      <span>💬 0 comments</span>
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="action-buttons">
                  <button
                    onClick={() => submitVerification('photo')}
                    disabled={(!photo && !video) || isSubmitting}
                    className="verify-button button-primary"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      '🌱 Submit Verification & Post to Wall'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Shame Verification Form */}
                <div className="form-header">
                  <h2 className="form-title text-gradient">Accept Your Digital Shame</h2>
                  <p className="form-subtitle">
                    You chose to stay indoors. Write a public confession that will be displayed on your profile.
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
                      "Shame Day" badge on your profile for 24h
                    </li>
                    <li className="instruction-item">
                      <span className="instruction-icon">📊</span>
                      Ranked below users with verified days
                    </li>
                    <li className="instruction-item">
                      <span className="instruction-icon">🚫</span>
                      No post on verification wall
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
            
            {/* Time Left Counter */}
            <div className="time-left glass">
              <p className="time-left-text">
                ⏰ Time until streak breaks: {streakData.nextCheckpoint}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Activity Type Modal */}
      {showActivitySelector && (
        <div className="activity-modal">
          <motion.div 
            className="activity-modal-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              onClick={() => setShowActivitySelector(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ✕
            </button>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>
              Select Activity Type
            </h2>
            <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>
              Choose the type of outdoor activity you did
            </p>
            
            <div className="activity-grid">
              {activityTypes.map((activity) => (
                <div
                  key={activity.value}
                  className={`activity-option glass ${activityType === activity.value ? 'selected' : ''}`}
                  onClick={() => {
                    setActivityType(activity.value);
                    setShowActivitySelector(false);
                  }}
                  style={{
                    borderColor: activityType === activity.value ? activity.color : undefined,
                    background: activityType === activity.value ? `${activity.color}20` : undefined
                  }}
                >
                  <div className="activity-option-emoji">{activity.emoji}</div>
                  <div className="activity-option-name">{activity.label}</div>
                  <div className="activity-option-desc">{activity.description}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Success Modal */}
      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="activity-modal"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="activity-modal-content glass text-center"
            style={{ maxWidth: '400px' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>
              Verification Complete!
            </h3>
            <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>
              {verificationMethod === 'photo' 
                ? 'Your verification has been posted to the Verification Wall!' 
                : 'Your shame confession has been recorded.'}
            </p>
            
            {verificationMethod === 'photo' && (
              <button
                onClick={() => navigate('/verification-wall')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#00E5FF',
                  color: 'black',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: '1rem'
                }}
              >
                View Verification Wall →
              </button>
            )}
            
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Back to Dashboard
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Verify;