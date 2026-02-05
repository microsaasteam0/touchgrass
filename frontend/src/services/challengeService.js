import React from 'react';

  const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class RealChallengeService {
  // REAL API call - replaces localStorage
  static async joinChallenge(challengeId, userEmail) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_URL}/challenges/${challengeId}/join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userEmail })
    });

    if (!response.ok) throw new Error('Failed to join challenge');
    return await response.json();
  }

  // Get available challenges from backend
  static async getAvailableChallenges(userEmail) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_URL}/challenges/available?userEmail=${encodeURIComponent(userEmail)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch available challenges');
    return await response.json();
  }

  // Get user's active challenges from backend
  static async getUserActiveChallenges(userEmail) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_URL}/user/challenges/active?userEmail=${encodeURIComponent(userEmail)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch user active challenges');
    return await response.json();
  }

  // REAL API call - replaces localStorage
  static async getUserChallenges() {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_URL}/user/challenges`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch challenges');
    return await response.json();
  }

  // REAL API call - replaces localStorage
  static async updateDailyProgress(challengeId, completed = true) {
    const token = localStorage.getItem('authToken');
    const today = new Date().toISOString().split('T')[0];

    const response = await fetch(`${API_URL}/challenges/${challengeId}/progress`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: today,
        completed,
        notes: `Daily progress for ${today}`
      })
    });

    if (!response.ok) throw new Error('Failed to update progress');
    return await response.json();
  }

  // REAL API call - replaces localStorage
  static async getStreakData() {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_URL}/user/streaks`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch streak data');
    return await response.json();
  }
}

export default RealChallengeService;
