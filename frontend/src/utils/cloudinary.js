import React from 'react';
  
  // utils/cloudinary.js
export const uploadToCloudinary = async (file) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  
  // Validate environment variables
  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary configuration missing. Check your .env file.');
    throw new Error('Cloudinary configuration missing');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'touchgrass/avatars');
  
  try {
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the optimized avatar URL
    return data.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fill,g_face,q_auto:good/');
    
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Helper to delete from Cloudinary (optional, for future use)
export const deleteFromCloudinary = async (publicId) => {
  // Note: This requires server-side implementation due to API secret
};