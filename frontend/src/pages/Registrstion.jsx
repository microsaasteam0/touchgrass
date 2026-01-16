import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Lock, Globe, Camera, Upload,
  Check, X, Eye, EyeOff, MapPin, Calendar
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Registration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    firstName: '',
    lastName: '',
    bio: '',
    location: {
      country: '',
      city: ''
    },
    avatar: '',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Only letters, numbers, and underscores allowed';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Display name validation
    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }
    
    // Terms agreement
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setFormData(prev => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const generateAvatar = () => {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username || 'user'}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    setAvatarPreview(avatarUrl);
    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare registration data
      const registrationData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        displayName: formData.displayName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        location: formData.location,
        avatar: formData.avatar
      };
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`,
        registrationData
      );
      
      if (response.data.success) {
        // Save token
        localStorage.setItem('token', response.data.data.token);
        
        // Show success message
        toast.success('Account created successfully! Starting your streak...');
        
        // Redirect to verification page
        setTimeout(() => {
          navigate('/verify');
        }, 1500);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.errors) {
        // Set field-specific errors from backend
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.path] = err.msg;
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Branding */}
          <div className="hidden md:block">
            <div className="sticky top-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Join TouchGrass</h1>
                <p className="text-gray-400">
                  Start your journey to better habits and real-world accountability
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Daily Accountability</h3>
                    <p className="text-sm text-gray-400">Build unbreakable habits</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Globe size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Global Community</h3>
                    <p className="text-sm text-gray-400">Compete & connect worldwide</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <User size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Real Profiles</h3>
                    <p className="text-sm text-gray-400">Verified achievements</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
                <h3 className="font-bold mb-2">Already have an account?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Sign in to continue your streak journey
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full text-center py-3 border border-gray-700 hover:border-gray-600 rounded-xl font-bold transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right side - Registration Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-8">Create Your Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-emerald-500/30 overflow-hidden">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <User size={48} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => document.getElementById('avatar-upload').click()}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
                  >
                    <Camera size={20} />
                  </button>
                </div>
                
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={generateAvatar}
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Generate random avatar
                </button>
              </div>
              
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="John"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-xl focus:outline-none transition-colors ${
                    errors.displayName
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-emerald-500'
                  }`}
                  placeholder="How you'll appear"
                />
                {errors.displayName && (
                  <p className="text-red-400 text-sm mt-1">{errors.displayName}</p>
                )}
              </div>
              
              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    @
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-xl focus:outline-none transition-colors ${
                      errors.username
                        ? 'border-red-500'
                        : 'border-gray-700 focus:border-emerald-500'
                    }`}
                    placeholder="johndoe"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-400 text-sm mt-1">{errors.username}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Letters, numbers, and underscores only
                </p>
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-xl focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-gray-700 focus:border-emerald-500'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-800 border rounded-xl focus:outline-none transition-colors ${
                      errors.password
                        ? 'border-red-500'
                        : 'border-gray-700 focus:border-emerald-500'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Minimum 8 characters
                </p>
              </div>
              
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-xl focus:outline-none transition-colors ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : 'border-gray-700 focus:border-emerald-500'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              
              {/* Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    City (Optional)
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="New York"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country (Optional)
                  </label>
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="USA"
                  />
                </div>
              </div>
              
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                  maxLength={250}
                />
                <p className="text-gray-500 text-sm mt-1">
                  {formData.bio.length}/250 characters
                </p>
              </div>
              
              {/* Terms */}
              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    I agree to the{' '}
                    <Link to="/terms" className="text-emerald-400 hover:text-emerald-300">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-400 text-sm mt-1">{errors.terms}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 rounded-xl font-bold text-lg transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account & Start Streak'
                )}
              </button>
              
              {/* Login Link */}
              <p className="text-center text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;