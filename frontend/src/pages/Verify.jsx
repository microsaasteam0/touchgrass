// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Card from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import Modal from '../components/ui/Model';
// import Confetti from '../components/ui/Confetti';
// import Toast from '../components/ui/Toast';
// import { Upload, Camera, Video, X, Check, AlertCircle, FileUp, Image as ImageIcon, Mic } from 'lucide-react';

// const Verify = () => {
//   const navigate = useNavigate();
//   const [verificationMethod, setVerificationMethod] = useState(null);
//   const [photo, setPhoto] = useState(null);
//   const [video, setVideo] = useState(null);
//   const [shameMessage, setShameMessage] = useState('');
//   const [duration, setDuration] = useState(15);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [streakData, setStreakData] = useState({
  
//   });
//   const [showCamera, setShowCamera] = useState(false);
//   const [showVideoRecorder, setShowVideoRecorder] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [toasts, setToasts] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [mediaType, setMediaType] = useState('photo');
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [isDragOver, setIsDragOver] = useState(false);
  
//   const cameraRef = useRef(null);
//   const videoRecorderRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);
//   const fileInputRef = useRef(null);
//   const videoFileInputRef = useRef(null);
//   const animationRef = useRef(null);
//   const recordingTimerRef = useRef(null);
//   const dropZoneRef = useRef(null);

//   useEffect(() => {
//     loadStreakData();
//     createVerificationAnimations();
//     setupDragAndDrop();
//     return () => {
//       cleanupMediaStreams();
//       if (recordingTimerRef.current) {
//         clearInterval(recordingTimerRef.current);
//       }
//     };
//   }, []);

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
//       addToast('Please drop an image or video file', 'error');
//       return;
//     }

//     setMediaType(type);
    
//     const event = { target: { files: [file] } };
//     handleFileUpload(event, type);
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

//   const loadStreakData = () => {
//     setTimeout(() => {
//       // Data already set in state
//     }, 500);
//   };

//   const createVerificationAnimations = () => {
//     const container = animationRef.current;
//     if (!container) return;

//     const elements = ['🌱', '☀️', '🚶', '🏃', '🧘', '🌳', '🌄', '🌅'];
//     elements.forEach((element, index) => {
//       const el = document.createElement('div');
//       el.className = 'verification-particle';
//       el.textContent = element;
      
//       const size = 24 + Math.random() * 32;
//       const left = Math.random() * 100;
//       const duration = 10 + Math.random() * 15;
//       const delay = Math.random() * 5;
      
//       el.style.fontSize = `${size}px`;
//       el.style.left = `${left}%`;
//       el.style.animationDuration = `${duration}s`;
//       el.style.animationDelay = `${delay}s`;
//       el.style.opacity = 0.1 + Math.random() * 0.2;
      
//       container.appendChild(el);
//     });
//   };

//   const handleFileUpload = (event, type = 'photo') => {
//     const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
//     if (!file) return;

//     if (type === 'photo') {
//       if (!file.type.startsWith('image/')) {
//         addToast('Please upload an image file (JPG, PNG, etc.)', 'error');
//         return;
//       }
//       if (file.size > 10 * 1024 * 1024) {
//         addToast('Image size must be less than 10MB', 'error');
//         return;
//       }
//     } else if (type === 'video') {
//       if (!file.type.startsWith('video/')) {
//         addToast('Please upload a video file (MP4, MOV, etc.)', 'error');
//         return;
//       }
//       if (file.size > 50 * 1024 * 1024) {
//         addToast('Video size must be less than 50MB', 'error');
//         return;
//       }
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
//               addToast('Photo uploaded successfully!', 'success');
//             } else {
//               setVideo(reader.result);
//               setMediaType('video');
//               addToast('Video uploaded successfully!', 'success');
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
//                 addToast('Video recorded successfully!', 'success');
//               };
//             }
//           }
//         })
//         .catch(err => {
//           console.error('Camera error:', err);
//           addToast('Camera access denied. Please check permissions.', 'error');
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
//     addToast('Photo captured!', 'success');
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
    
//     addToast('Recording started...', 'info');
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
//       addToast('Please upload a photo or video first', 'error');
//       return;
//     }

//     if (method === 'shame' && shameMessage.length < 10) {
//       addToast('Shame message must be at least 10 characters', 'error');
//       return;
//     }

//     setIsSubmitting(true);
    
//     setTimeout(() => {
//       setIsSubmitting(false);
//       setShowSuccess(true);
      
//       if (method === 'photo') {
//         addToast('🌱 Success! Your streak continues to grow', 'success');
//       } else {
//         addToast('😈 Shame accepted. Your streak continues...', 'warning');
//       }
      
//       setStreakData(prev => ({
//         ...prev,
//         current: prev.current + 1,
//         rank: prev.rank - Math.floor(Math.random() * 10)
//       }));
      
//       setVerificationMethod(null);
//       setPhoto(null);
//       setVideo(null);
//       setShameMessage('');
//       setShowCamera(false);
//       setShowVideoRecorder(false);
//       setUploadProgress(0);
//       setIsUploading(false);
      
//       setTimeout(() => setShowSuccess(false), 3000);
//     }, 1500);
//   };

//   const addToast = (message, type = 'info') => {
//     const id = Date.now().toString();
//     setToasts(prev => [...prev, { id, message, type }]);
//     setTimeout(() => {
//       setToasts(prev => prev.filter(toast => toast.id !== id));
//     }, 5000);
//   };

//   const removeMedia = () => {
//     if (mediaType === 'photo') {
//       setPhoto(null);
//     } else {
//       setVideo(null);
//     }
//     setMediaType('photo');
//   };

//   const roasts = [
//     "Still a digital zombie, I see. Your chair must be fused to your skin by now.",
//     "Another day indoors? Even houseplants get more sunlight than you.",
//     "Your vitamin D levels are crying. Go outside.",
//     "Your screen time is longer than your life expectancy at this rate.",
//     "The grass is calling. Unfortunately, it's saying 'I don't know this person.'",
//     "You've evolved from human to houseplant. At least they photosynthesize."
//   ];

//   const durations = [5, 15, 30, 60, 120];

//   const pageStyles = `
//     .verify-container {
//       min-height: 100vh;
//       background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
//       padding: 2rem;
//       position: relative;
//       overflow: hidden;
//     }

//     .verify-background {
//       position: absolute;
//       inset: 0;
//       background: 
//         radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
//         radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
//       animation: verifyBackgroundFloat 20s ease-in-out infinite;
//     }

//     .verify-content {
//       position: relative;
//       z-index: 2;
//       max-width: 1200px;
//       margin: 0 auto;
//     }

//     .daily-question {
//       text-align: center;
//       margin-bottom: 3rem;
//       animation: questionFloat 0.8s ease-out;
//     }

//     .question-title {
//       font-size: 4rem;
//       font-weight: 900;
//       background: linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%);
//       background-clip: text;
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       margin: 0 0 1rem 0;
//       letter-spacing: -0.02em;
//       position: relative;
//     }

//     .question-subtitle {
//       font-size: 1.25rem;
//       color: rgba(255, 255, 255, 0.7);
//       margin: 0 0 2rem 0;
//       line-height: 1.6;
//     }

//     .verification-options {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//       gap: 2rem;
//       margin-bottom: 3rem;
//       animation: optionsFadeIn 0.8s ease-out 0.2s both;
//     }

//     .verification-option {
//       cursor: pointer;
//       transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
//     }

//     .verification-option:hover {
//       transform: translateY(-8px);
//     }

//     .option-content {
//       text-align: center;
//       padding: 3rem 2rem;
//       border-radius: 20px;
//       height: 100%;
//       position: relative;
//       overflow: hidden;
//     }

//     .option-yes {
//       background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%);
//       border: 2px solid rgba(34, 197, 94, 0.2);
//     }

//     .option-no {
//       background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
//       border: 2px solid rgba(239, 68, 68, 0.2);
//     }

//     .option-icon {
//       font-size: 4rem;
//       margin-bottom: 1.5rem;
//       display: block;
//       animation: optionIconFloat 3s ease-in-out infinite;
//     }

//     .option-title {
//       font-size: 2rem;
//       font-weight: 700;
//       color: white;
//       margin: 0 0 1rem 0;
//     }

//     .option-description {
//       font-size: 1rem;
//       color: rgba(255, 255, 255, 0.7);
//       margin: 0;
//       line-height: 1.6;
//     }

//     .verification-form {
//       animation: formFadeIn 0.6s ease-out;
//     }

//     .form-header {
//       text-align: center;
//       margin-bottom: 2rem;
//     }

//     .form-title {
//       font-size: 2rem;
//       font-weight: 700;
//       color: white;
//       margin: 0 0 0.5rem 0;
//     }

//     .form-subtitle {
//       font-size: 1rem;
//       color: rgba(255, 255, 255, 0.6);
//       margin: 0;
//     }

//     .media-upload-container {
//       margin-bottom: 2rem;
//     }

//     .upload-options {
//       display: flex;
//       gap: 1rem;
//       margin-bottom: 1.5rem;
//       flex-wrap: wrap;
//     }

//     .upload-option {
//       flex: 1;
//       min-width: 200px;
//       padding: 1.5rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 12px;
//       text-align: center;
//       cursor: pointer;
//       transition: all 0.3s ease;
//     }

//     .upload-option:hover {
//       background: rgba(255, 255, 255, 0.1);
//       transform: translateY(-2px);
//     }

//     .upload-option.active {
//       background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.2) 100%);
//       border-color: rgba(34, 197, 94, 0.3);
//     }

//     .upload-option-icon {
//       font-size: 2rem;
//       margin-bottom: 0.5rem;
//       display: block;
//     }

//     .upload-option-text {
//       font-size: 0.875rem;
//       color: rgba(255, 255, 255, 0.8);
//       margin: 0;
//     }

//     .photo-upload-area {
//       border: 2px dashed rgba(255, 255, 255, 0.2);
//       border-radius: 20px;
//       padding: 3rem;
//       text-align: center;
//       cursor: pointer;
//       transition: all 0.3s ease;
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
//       border-color: rgba(34, 197, 94, 0.5);
//       background: rgba(34, 197, 94, 0.05);
//     }

//     .photo-upload-area.drag-over {
//       border-color: rgba(59, 130, 246, 0.7);
//       background: rgba(59, 130, 246, 0.1);
//       border-width: 3px;
//       border-style: solid;
//     }

//     .photo-upload-area.drag-over::before {
//       content: '🎯';
//       position: absolute;
//       top: 20px;
//       right: 20px;
//       font-size: 2rem;
//       animation: dragPulse 1s infinite;
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
//       border-radius: 18px;
//     }

//     .video-preview {
//       width: 100%;
//       height: 300px;
//       object-fit: cover;
//       border-radius: 18px;
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
//       color: rgba(255, 255, 255, 0.6);
//       margin: 0;
//     }

//     .drag-drop-instruction {
//       font-size: 0.875rem;
//       color: rgba(255, 255, 255, 0.5);
//       margin-top: 1rem;
//       padding: 0.5rem 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border-radius: 8px;
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
//       background: rgba(0, 0, 0, 0.7);
//       border: none;
//       width: 40px;
//       height: 40px;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       cursor: pointer;
//       transition: all 0.3s ease;
//     }

//     .media-action-button:hover {
//       background: rgba(0, 0, 0, 0.9);
//       transform: scale(1.1);
//     }

//     .camera-container {
//       position: relative;
//       width: 100%;
//       height: 400px;
//       border-radius: 20px;
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
//       border-radius: 20px;
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
//       animation: recordingPulse 1s infinite;
//     }

//     .duration-selector {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
//       gap: 0.75rem;
//       margin-bottom: 2rem;
//     }

//     .duration-option {
//       padding: 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 12px;
//       color: rgba(255, 255, 255, 0.7);
//       text-align: center;
//       cursor: pointer;
//       transition: all 0.3s ease;
//     }

//     .duration-option:hover {
//       background: rgba(255, 255, 255, 0.1);
//     }

//     .duration-option.selected {
//       background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.2) 100%);
//       border-color: rgba(34, 197, 94, 0.3);
//       color: white;
//     }

//     .shame-input {
//       width: 100%;
//       min-height: 150px;
//       padding: 1.5rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 16px;
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
//       background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
//       border: 1px solid rgba(239, 68, 68, 0.2);
//       border-radius: 16px;
//       padding: 1.5rem;
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
//       color: rgba(255, 255, 255, 0.9);
//       margin: 0;
//       font-style: italic;
//     }

//     .action-buttons {
//       display: flex;
//       gap: 1rem;
//       margin-top: 2rem;
//     }

//     .streak-stats {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//       gap: 1.5rem;
//       margin-top: 3rem;
//       animation: statsFadeIn 0.6s ease-out 0.4s both;
//     }

//     .stat-item {
//       text-align: center;
//       padding: 1.5rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 16px;
//     }

//     .stat-value {
//       font-size: 2.5rem;
//       font-weight: 700;
//       color: white;
//       margin: 0;
//       line-height: 1;
//     }

//     .stat-label {
//       font-size: 0.875rem;
//       color: rgba(255, 255, 255, 0.6);
//       margin: 0.5rem 0 0 0;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//     }

//     .verification-particle {
//       position: absolute;
//       pointer-events: none;
//       z-index: 1;
//       animation: verificationFloat linear infinite;
//     }

//     .back-button {
//       display: inline-flex;
//       align-items: center;
//       gap: 0.5rem;
//       padding: 0.75rem 1.5rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 12px;
//       color: rgba(255, 255, 255, 0.7);
//       font-size: 0.875rem;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       margin-bottom: 2rem;
//     }

//     .back-button:hover {
//       background: rgba(255, 255, 255, 0.1);
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
//       background: linear-gradient(90deg, #22c55e, #16a34a);
//       border-radius: 4px;
//       transition: width 0.3s ease;
//     }

//     .progress-text {
//       font-size: 0.875rem;
//       color: rgba(255, 255, 255, 0.6);
//       margin-top: 0.5rem;
//       text-align: center;
//     }

//     .instructions-panel {
//       background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
//       border: 1px solid rgba(59, 130, 246, 0.2);
//       border-radius: 16px;
//       padding: 1.5rem;
//       margin-bottom: 2rem;
//     }

//     .instructions-title {
//       font-size: 1.125rem;
//       font-weight: 600;
//       color: white;
//       margin: 0 0 1rem 0;
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
//       gap: 0.75rem;
//       padding: 0.5rem 0;
//       font-size: 0.875rem;
//       color: rgba(255, 255, 255, 0.8);
//     }

//     .instruction-icon {
//       flex-shrink: 0;
//       color: #22c55e;
//     }

//     .time-left {
//       text-align: center;
//       margin-top: 2rem;
//       padding: 1rem;
//       background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
//       border: 1px solid rgba(245, 158, 11, 0.2);
//       border-radius: 12px;
//       animation: timePulse 2s ease-in-out infinite;
//     }

//     @keyframes verifyBackgroundFloat {
//       0%, 100% { transform: translate(0, 0); }
//       25% { transform: translate(-10px, 10px); }
//       50% { transform: translate(10px, -10px); }
//       75% { transform: translate(-10px, -10px); }
//     }

//     @keyframes questionFloat {
//       0% {
//         opacity: 0;
//         transform: translateY(-30px);
//       }
//       100% {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }

//     @keyframes optionsFadeIn {
//       from {
//         opacity: 0;
//         transform: translateY(30px);
//       }
//       to {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }

//     @keyframes formFadeIn {
//       from { opacity: 0; }
//       to { opacity: 1; }
//     }

//     @keyframes optionIconFloat {
//       0%, 100% { transform: translateY(0) scale(1); }
//       50% { transform: translateY(-10px) scale(1.1); }
//     }

//     @keyframes verificationFloat {
//       0% {
//         transform: translateY(100vh) rotate(0deg);
//         opacity: 0;
//       }
//       10% {
//         opacity: 0.5;
//       }
//       90% {
//         opacity: 0.5;
//       }
//       100% {
//         transform: translateY(-100px) rotate(360deg);
//         opacity: 0;
//       }
//     }

//     @keyframes statsFadeIn {
//       from {
//         opacity: 0;
//         transform: translateY(30px);
//       }
//       to {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }

//     @keyframes dragPulse {
//       0%, 100% { transform: scale(1); opacity: 1; }
//       50% { transform: scale(1.2); opacity: 0.8; }
//     }

//     @keyframes recordingPulse {
//       0%, 100% { opacity: 1; }
//       50% { opacity: 0.5; }
//     }

//     @keyframes timePulse {
//       0%, 100% { opacity: 1; }
//       50% { opacity: 0.7; }
//     }

//     @media (max-width: 768px) {
//       .verify-container {
//         padding: 1rem;
//       }
      
//       .question-title {
//         font-size: 2.5rem;
//       }
      
//       .verification-options {
//         grid-template-columns: 1fr;
//       }
      
//       .upload-options {
//         flex-direction: column;
//       }
      
//       .upload-option {
//         min-width: 100%;
//       }
      
//       .action-buttons {
//         flex-direction: column;
//       }
      
//       .camera-container {
//         height: 300px;
//       }
      
//       .streak-stats {
//         grid-template-columns: repeat(2, 1fr);
//       }
//     }
//   `;

//   return (
//     <>
//       <style>{pageStyles}</style>
//       <div className="verify-container" ref={animationRef}>
//         {showSuccess && <Confetti active={true} duration={3000} />}
//         <div className="verify-background" />
        
//         <div className="verify-content">
//           {!verificationMethod ? (
//             <>
//               <div className="daily-question">
//                 <h1 className="question-title">Have You Touched Grass Today?</h1>
//                 <p className="question-subtitle">
//                   Your {streakData.current}-day streak is on the line. 
//                   Prove your discipline or face the consequences.
//                 </p>
//               </div>
              
//               <div className="verification-options">
//                 <div 
//                   className="verification-option" 
//                   onClick={() => setVerificationMethod('photo')}
//                 >
//                   <div className="option-content option-yes">
//                     <span className="option-icon">🌱</span>
//                     <h2 className="option-title">Yes</h2>
//                     <p className="option-description">
//                       Upload photo/video proof & continue your streak. Show us you're living in the real world.
//                     </p>
//                   </div>
//                 </div>
                
//                 <div 
//                   className="verification-option" 
//                   onClick={() => setVerificationMethod('shame')}
//                 >
//                   <div className="option-content option-no">
//                     <span className="option-icon">❌</span>
//                     <h2 className="option-title">No</h2>
//                     <p className="option-description">
//                       Accept public shame & continue streak with a mark. Your ego will hate this.
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="streak-stats">
//                 <div className="stat-item">
//                   <h3 className="stat-value"></h3>
//                   <p className="stat-label">Current Streak</p>
//                 </div>
                
//                 <div className="stat-item">
//                   <h3 className="stat-value"></h3>
//                   <p className="stat-label">Longest Streak</p>
//                 </div>
                
//                 <div className="stat-item">
//                   <h3 className="stat-value"></h3>
//                   <p className="stat-label">Global Rank</p>
//                 </div>
                
//                 <div className="stat-item">
//                   <h3 className="stat-value"></h3>
//                   <p className="stat-label">Time Left Today</p>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="verification-form">
//               <button 
//                 className="back-button"
//                 onClick={() => {
//                   setVerificationMethod(null);
//                   setPhoto(null);
//                   setVideo(null);
//                   setShowCamera(false);
//                   setShowVideoRecorder(false);
//                   setIsDragOver(false);
//                   cleanupMediaStreams();
//                   if (recordingTimerRef.current) {
//                     clearInterval(recordingTimerRef.current);
//                   }
//                 }}
//               >
//                 ← Back to choices
//               </button>
              
//               {verificationMethod === 'photo' ? (
//                 <>
//                   <div className="form-header">
//                     <h2 className="form-title">Prove Your Outdoor Adventure</h2>
//                     <p className="form-subtitle">
//                       Upload a photo or video showing grass, nature, or outdoor activity
//                     </p>
//                   </div>
                  
//                   <div className="instructions-panel">
//                     <h3 className="instructions-title">📸 What counts as proof?</h3>
//                     <ul className="instructions-list">
//                       <li className="instruction-item">
//                         <span className="instruction-icon">✅</span>
//                         Photos/videos showing grass, trees, or nature
//                       </li>
//                       <li className="instruction-item">
//                         <span className="instruction-icon">✅</span>
//                         Outdoor exercise (running, hiking, sports)
//                       </li>
//                       <li className="instruction-item">
//                         <span className="instruction-icon">✅</span>
//                         Sunlight & sky visible in media
//                       </li>
//                       <li className="instruction-item">
//                         <span className="instruction-icon">❌</span>
//                         No indoor plants or old media
//                       </li>
//                     </ul>
//                   </div>
                  
//                   <div className="media-upload-container">
//                     <div className="upload-options">
//                       <div 
//                         className={`upload-option ${mediaType === 'photo' ? 'active' : ''}`}
//                         onClick={() => setMediaType('photo')}
//                       >
//                         <span className="upload-option-icon">📸</span>
//                         <p className="upload-option-text">Upload Photo</p>
//                       </div>
                      
//                       <div 
//                         className={`upload-option ${mediaType === 'video' ? 'active' : ''}`}
//                         onClick={() => setMediaType('video')}
//                       >
//                         <span className="upload-option-icon">🎥</span>
//                         <p className="upload-option-text">Upload Video</p>
//                       </div>
//                     </div>
                    
//                     {showCamera ? (
//                       <div className="camera-container">
//                         <video
//                           ref={cameraRef}
//                           className="camera-video"
//                           autoPlay
//                           playsInline
//                         />
//                         <div className="camera-controls">
//                           <button
//                             onClick={capturePhoto}
//                             style={{
//                               padding: '1rem 2rem',
//                               background: 'linear-gradient(135deg, #22c55e, #16a34a)',
//                               border: 'none',
//                               borderRadius: '12px',
//                               color: 'white',
//                               fontWeight: 'bold',
//                               cursor: 'pointer',
//                               fontSize: '1rem'
//                             }}
//                           >
//                             📸 Capture Photo
//                           </button>
//                           <button
//                             onClick={() => {
//                               setShowCamera(false);
//                               cleanupMediaStreams();
//                             }}
//                             style={{
//                               padding: '1rem 2rem',
//                               background: 'rgba(255, 255, 255, 0.1)',
//                               border: '1px solid rgba(255, 255, 255, 0.2)',
//                               borderRadius: '12px',
//                               color: 'white',
//                               cursor: 'pointer',
//                               fontSize: '1rem'
//                             }}
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : showVideoRecorder ? (
//                       <div className="camera-container">
//                         <video
//                           ref={videoRecorderRef}
//                           className="camera-video"
//                           autoPlay
//                           playsInline
//                         />
//                         {recordingTime > 0 && (
//                           <div className="recording-indicator">
//                             <div className="recording-dot" />
//                             Recording: {recordingTime}s
//                           </div>
//                         )}
//                         <div className="camera-controls">
//                           {mediaRecorderRef.current?.state === 'recording' ? (
//                             <button
//                               onClick={stopVideoRecording}
//                               style={{
//                                 padding: '1rem 2rem',
//                                 background: 'linear-gradient(135deg, #ef4444, #dc2626)',
//                                 border: 'none',
//                                 borderRadius: '12px',
//                                 color: 'white',
//                                 fontWeight: 'bold',
//                                 cursor: 'pointer',
//                                 fontSize: '1rem'
//                               }}
//                             >
//                               ⏹️ Stop Recording
//                             </button>
//                           ) : (
//                             <button
//                               onClick={startVideoRecording}
//                               style={{
//                                 padding: '1rem 2rem',
//                                 background: 'linear-gradient(135deg, #22c55e, #16a34a)',
//                                 border: 'none',
//                                 borderRadius: '12px',
//                                 color: 'white',
//                                 fontWeight: 'bold',
//                                 cursor: 'pointer',
//                                 fontSize: '1rem'
//                               }}
//                             >
//                               🎥 Start Recording
//                             </button>
//                           )}
//                           <button
//                             onClick={() => {
//                               setShowVideoRecorder(false);
//                               stopVideoRecording();
//                             }}
//                             style={{
//                               padding: '1rem 2rem',
//                               background: 'rgba(255, 255, 255, 0.1)',
//                               border: '1px solid rgba(255, 255, 255, 0.2)',
//                               borderRadius: '12px',
//                               color: 'white',
//                               cursor: 'pointer',
//                               fontSize: '1rem'
//                             }}
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div 
//                         ref={dropZoneRef}
//                         className={`photo-upload-area ${photo || video ? 'has-media' : ''} ${isDragOver ? 'drag-over' : ''}`}
//                         onClick={() => {
//                           if (mediaType === 'photo' && !photo) {
//                             fileInputRef.current?.click();
//                           } else if (mediaType === 'video' && !video) {
//                             videoFileInputRef.current?.click();
//                           }
//                         }}
//                       >
//                         {(photo || video) ? (
//                           <>
//                             {mediaType === 'photo' && photo ? (
//                               <>
//                                 <img src={photo} alt="Verification" className="media-preview" />
//                                 <div className="media-actions">
//                                   <button 
//                                     className="media-action-button"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       removeMedia();
//                                     }}
//                                   >
//                                     <X size={20} color="white" />
//                                   </button>
//                                 </div>
//                               </>
//                             ) : video ? (
//                               <>
//                                 <video 
//                                   src={video} 
//                                   className="video-preview" 
//                                   controls 
//                                   onClick={(e) => e.stopPropagation()}
//                                 />
//                                 <div className="media-actions">
//                                   <button 
//                                     className="media-action-button"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       removeMedia();
//                                     }}
//                                   >
//                                     <X size={20} color="white" />
//                                   </button>
//                                 </div>
//                               </>
//                             ) : null}
//                           </>
//                         ) : (
//                           <div className="upload-instructions">
//                             <span className="upload-icon">
//                               {isDragOver ? '🎯' : mediaType === 'photo' ? '📸' : '🎥'}
//                             </span>
//                             <p className="upload-text">
//                               {isDragOver 
//                                 ? 'Drop your file here!' 
//                                 : mediaType === 'photo' 
//                                   ? 'Click to upload photo' 
//                                   : 'Click to upload video'}
//                             </p>
//                             <p className="upload-subtext">
//                               {mediaType === 'photo'
//                                 ? 'or drag and drop your photo here'
//                                 : 'or drag and drop your video here'}
//                             </p>
//                             <div className="drag-drop-instruction">
//                               <FileUp size={14} />
//                               Supports {mediaType === 'photo' ? 'JPG, PNG, GIF' : 'MP4, MOV, AVI'} • Max {mediaType === 'photo' ? '10MB' : '50MB'}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
                    
//                     {isUploading && (
//                       <div className="upload-progress">
//                         <div className="progress-bar">
//                           <div 
//                             className="progress-fill" 
//                             style={{ width: `${uploadProgress}%` }}
//                           />
//                         </div>
//                         <p className="progress-text">
//                           Uploading... {uploadProgress}%
//                         </p>
//                       </div>
//                     )}
                    
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleFileUpload(e, 'photo')}
//                       style={{ display: 'none' }}
//                     />
                    
//                     <input
//                       ref={videoFileInputRef}
//                       type="file"
//                       accept="video/*"
//                       onChange={(e) => handleFileUpload(e, 'video')}
//                       style={{ display: 'none' }}
//                     />
                    
//                     {!showCamera && !showVideoRecorder && (
//                       <div style={{ 
//                         display: 'flex', 
//                         gap: '1rem', 
//                         marginTop: '1rem',
//                         justifyContent: 'center'
//                       }}>
//                         <button
//                           onClick={() => startCamera('photo')}
//                           style={{
//                             padding: '0.75rem 1.5rem',
//                             background: 'rgba(255, 255, 255, 0.05)',
//                             border: '1px solid rgba(255, 255, 255, 0.1)',
//                             borderRadius: '8px',
//                             color: 'white',
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '0.5rem',
//                             fontSize: '0.875rem'
//                           }}
//                         >
//                           <Camera size={16} /> Take Photo
//                         </button>
                        
//                         <button
//                           onClick={() => startCamera('video')}
//                           style={{
//                             padding: '0.75rem 1.5rem',
//                             background: 'rgba(255, 255, 255, 0.05)',
//                             border: '1px solid rgba(255, 255, 255, 0.1)',
//                             borderRadius: '8px',
//                             color: 'white',
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '0.5rem',
//                             fontSize: '0.875rem'
//                           }}
//                         >
//                           <Video size={16} /> Record Video
//                         </button>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div style={{ marginBottom: '2rem' }}>
//                     <h3 style={{ color: 'white', marginBottom: '1rem' }}>⏱️ How many minutes were you outside?</h3>
//                     <div className="duration-selector">
//                       {durations.map((mins) => (
//                         <button
//                           key={mins}
//                           className={`duration-option ${duration === mins ? 'selected' : ''}`}
//                           onClick={() => setDuration(mins)}
//                         >
//                           {mins} min
//                         </button>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="action-buttons">
//                     <button
//                       onClick={() => submitVerification('photo')}
//                       disabled={(!photo && !video) || isSubmitting}
//                       style={{
//                         padding: '1rem 2rem',
//                         background: 'linear-gradient(135deg, #22c55e, #16a34a)',
//                         border: 'none',
//                         borderRadius: '12px',
//                         color: 'white',
//                         fontWeight: 'bold',
//                         cursor: (!photo && !video) || isSubmitting ? 'not-allowed' : 'pointer',
//                         fontSize: '1rem',
//                         opacity: (!photo && !video) || isSubmitting ? 0.5 : 1,
//                         width: '100%'
//                       }}
//                     >
//                       {isSubmitting ? 'Submitting...' : '🌱 Submit Verification'}
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="form-header">
//                     <h2 className="form-title">Accept Your Digital Shame</h2>
//                     <p className="form-subtitle">
//                       You chose to stay indoors. Write a public confession that will be displayed on your profile.
//                     </p>
//                   </div>
                  
//                   <div className="roast-container">
//                     <span className="roast-icon">🤖</span>
//                     <p className="roast-text">
//                       {roasts[Math.floor(Math.random() * roasts.length)]}
//                     </p>
//                   </div>
                  
//                   <textarea
//                     className="shame-input"
//                     placeholder="I failed to touch grass today because..."
//                     value={shameMessage}
//                     onChange={(e) => setShameMessage(e.target.value)}
//                     maxLength={200}
//                   />
                  
//                   <div style={{ 
//                     textAlign: 'right', 
//                     marginBottom: '1.5rem',
//                     color: 'rgba(255, 255, 255, 0.6)',
//                     fontSize: '0.875rem'
//                   }}>
//                     {shameMessage.length}/200 characters
//                   </div>
                  
//                   <div className="instructions-panel">
//                     <h3 className="instructions-title">⚠️ Consequences of Shame</h3>
//                     <ul className="instructions-list">
//                       <li className="instruction-item">
//                         <span className="instruction-icon">📉</span>
//                         Your streak continues but marked with shame
//                       </li>
//                       <li className="instruction-item">
//                         <span className="instruction-icon">👁️</span>
//                         "Shame Day" badge on your profile for 24h
//                       </li>
//                       <li className="instruction-item">
//                         <span className="instruction-icon">📊</span>
//                         Ranked below users with verified days
//                       </li>
//                     </ul>
//                   </div>
                  
//                   <div className="action-buttons">
//                     <button
//                       onClick={() => submitVerification('shame')}
//                       disabled={shameMessage.length < 10 || isSubmitting}
//                       style={{
//                         padding: '1rem 2rem',
//                         background: 'linear-gradient(135deg, #ef4444, #dc2626)',
//                         border: 'none',
//                         borderRadius: '12px',
//                         color: 'white',
//                         fontWeight: 'bold',
//                         cursor: (shameMessage.length < 10 || isSubmitting) ? 'not-allowed' : 'pointer',
//                         fontSize: '1rem',
//                         opacity: (shameMessage.length < 10 || isSubmitting) ? 0.5 : 1,
//                         width: '100%'
//                       }}
//                     >
//                       {isSubmitting ? 'Submitting...' : '😈 Accept Public Shame'}
//                     </button>
                    
//                     <button
//                       onClick={() => setVerificationMethod('photo')}
//                       style={{
//                         padding: '1rem 2rem',
//                         background: 'rgba(255, 255, 255, 0.05)',
//                         border: '1px solid rgba(255, 255, 255, 0.1)',
//                         borderRadius: '12px',
//                         color: 'white',
//                         fontWeight: 'bold',
//                         cursor: 'pointer',
//                         fontSize: '1rem',
//                         width: '100%'
//                       }}
//                     >
//                       🌱 Redeem with Photo/Video Instead
//                     </button>
//                   </div>
//                 </>
//               )}
              
//               <div className="time-left">
//                 <p style={{ margin: 0, color: '#f59e0b', fontWeight: '600' }}>
//                   ⏰ Time until streak breaks: {streakData.nextCheckpoint}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={{
//         position: 'fixed',
//         top: '20px',
//         right: '20px',
//         zIndex: 9999,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '10px'
//       }}>
//         {toasts.map((toast) => (
//           <div
//             key={toast.id}
//             style={{
//               padding: '1rem 1.5rem',
//               background: toast.type === 'error' ? '#7f1d1d' : 
//                          toast.type === 'success' ? '#14532d' : 
//                          toast.type === 'warning' ? '#713f12' : '#1e293b',
//               border: '1px solid rgba(255, 255, 255, 0.1)',
//               borderRadius: '8px',
//               color: 'white',
//               maxWidth: '300px',
//               animation: 'fadeIn 0.3s ease'
//             }}
//           >
//             {toast.message}
//           </div>
//         ))}
//       </div>
//     </>
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
  Loader2
} from 'lucide-react';

const Verify = () => {
  const navigate = useNavigate();
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
      const storedUser = localStorage.getItem('touchgrass_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);
      } else {
        toast.error('Please login to verify');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadStreakData = () => {
    try {
      if (!userData) return;
      
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
          console.error('Camera error:', err);
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
    
    setTimeout(() => {
      try {
        const user = JSON.parse(localStorage.getItem('touchgrass_user') || '{}');
        const streakKey = `touchgrass_streak_${user.username}`;
        const currentStreak = JSON.parse(localStorage.getItem(streakKey) || '{}');
        
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
        
        setIsSubmitting(false);
        setShowSuccess(true);
        
        if (method === 'photo') {
          toast.success('🌱 Success! Your streak continues to grow');
        } else {
          toast.success('😈 Shame accepted. Your streak continues...');
        }
        
      } catch (error) {
        console.error('Error submitting verification:', error);
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

    @media (max-width: 768px) {
      .verify-container {
        padding: 4rem 1rem 2rem;
      }
      
      .verify-title {
        font-size: 2.5rem;
      }
      
      .verification-options {
        grid-template-columns: 1fr;
      }
      
      .upload-options {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .camera-container {
        height: 300px;
      }
      
      .streak-stats {
        grid-template-columns: repeat(2, 1fr);
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
                      '🌱 Submit Verification'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
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
            <p className="text-gray-400">Redirecting to dashboard...</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Verify;