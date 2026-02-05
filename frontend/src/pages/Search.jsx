import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Users, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Search = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    users: [],
    challenges: [],
    posts: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Mock search data - replace with real API calls
  const mockSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ users: [], challenges: [], posts: [] });
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock results
    const mockUsers = [
      {
        id: '1',
        username: 'john_doe',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        streak: 15,
        location: 'New York, USA'
      },
      {
        id: '2',
        username: 'jane_smith',
        displayName: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        streak: 28,
        location: 'London, UK'
      }
    ].filter(user => user.displayName.toLowerCase().includes(query.toLowerCase()) ||
                     user.username.toLowerCase().includes(query.toLowerCase()));

    const mockChallenges = [
      {
        id: '1',
        name: 'No Complaining Week',
        type: 'mindset',
        description: 'Ban all complaints for 7 days',
        participants: 45,
        difficulty: 'hard'
      },
      {
        id: '2',
        name: 'Daily Outdoor Time',
        type: 'health',
        description: 'Spend 30 minutes outdoors daily',
        participants: 123,
        difficulty: 'medium'
      }
    ].filter(challenge => challenge.name.toLowerCase().includes(query.toLowerCase()) ||
                          challenge.description.toLowerCase().includes(query.toLowerCase()));

    const mockPosts = [
      {
        id: '1',
        user: { username: 'john_doe', displayName: 'John Doe' },
        content: 'Just completed my 15th day streak! Feeling amazing! 🌱',
        likes: 12,
        timestamp: '2 hours ago'
      }
    ].filter(post => post.content.toLowerCase().includes(query.toLowerCase()));

    setSearchResults({
      users: mockUsers,
      challenges: mockChallenges,
      posts: mockPosts
    });

    setIsLoading(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      mockSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const styles = `
    .search-page {
      width: 100%;
      min-height: 100vh;
      background: #050505;
      color: white;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .search-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .search-title {
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .search-input-container {
      position: relative;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-input {
      width: 100%;
      padding: 1rem 3rem 1rem 1rem;
      border-radius: 2rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1.1rem;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .search-icon {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #00E5FF;
    }

    .search-tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin: 2rem 0;
    }

    .search-tab {
      padding: 0.75rem 1.5rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      transition: all 0.3s;
    }

    .search-tab.active {
      background: rgba(0, 229, 255, 0.2);
      border-color: rgba(0, 229, 255, 0.3);
    }

    .search-results {
      display: grid;
      gap: 2rem;
    }

    .results-section {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 2rem;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 900;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .results-grid {
      display: grid;
      gap: 1rem;
    }

    .user-card, .challenge-card, .post-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s;
      cursor: pointer;
    }

    .user-card:hover, .challenge-card:hover, .post-card:hover {
      background: rgba(255, 255, 255, 0.05);
      transform: translateY(-2px);
    }

    .user-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-info h3 {
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .user-info p {
      color: #71717a;
      font-size: 0.875rem;
    }

    .challenge-info h3 {
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .challenge-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #71717a;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #71717a;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .loading-spinner {
      display: inline-block;
      width: 2rem;
      height: 2rem;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top-color: #00E5FF;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  const renderResults = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: '#71717a' }}>Searching...</p>
        </div>
      );
    }

    if (!searchQuery.trim()) {
      return (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Start Searching</h3>
          <p>Search for users, challenges, or posts</p>
        </div>
      );
    }

    const hasResults = searchResults.users.length > 0 ||
                      searchResults.challenges.length > 0 ||
                      searchResults.posts.length > 0;

    if (!hasResults) {
      return (
        <div className="empty-state">
          <div className="empty-icon">😔</div>
          <h3>No Results Found</h3>
          <p>Try different keywords or check your spelling</p>
        </div>
      );
    }

    return (
      <div className="search-results">
        {/* Users */}
        {(activeTab === 'all' || activeTab === 'users') && searchResults.users.length > 0 && (
          <div className="results-section">
            <h2 className="section-title">
              <Users size={20} />
              Users ({searchResults.users.length})
            </h2>
            <div className="results-grid">
              {searchResults.users.map(user => (
                <div key={user.id} className="user-card">
                  <img src={user.avatar} alt={user.displayName} className="user-avatar" />
                  <div className="user-info">
                    <h3>{user.displayName}</h3>
                    <p>@{user.username} • {user.streak} day streak • {user.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges */}
        {(activeTab === 'all' || activeTab === 'challenges') && searchResults.challenges.length > 0 && (
          <div className="results-section">
            <h2 className="section-title">
              <Target size={20} />
              Challenges ({searchResults.challenges.length})
            </h2>
            <div className="results-grid">
              {searchResults.challenges.map(challenge => (
                <div key={challenge.id} className="challenge-card">
                  <div style={{ fontSize: '2rem' }}>
                    {challenge.type === 'mindset' ? '🧠' : challenge.type === 'health' ? '💪' : '🎯'}
                  </div>
                  <div className="challenge-info">
                    <h3>{challenge.name}</h3>
                    <p>{challenge.description}</p>
                    <div className="challenge-meta">
                      <span>{challenge.participants} participants</span>
                      <span>{challenge.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        {(activeTab === 'all' || activeTab === 'posts') && searchResults.posts.length > 0 && (
          <div className="results-section">
            <h2 className="section-title">
              <TrendingUp size={20} />
              Posts ({searchResults.posts.length})
            </h2>
            <div className="results-grid">
              {searchResults.posts.map(post => (
                <div key={post.id} className="post-card">
                  <div style={{ fontSize: '2rem' }}>📝</div>
                  <div>
                    <p style={{ marginBottom: '0.5rem' }}>{post.content}</p>
                    <p style={{ fontSize: '0.875rem', color: '#71717a' }}>
                      {post.user.displayName} • {post.timestamp} • {post.likes} likes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="search-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <style>{styles}</style>

      <div className="search-header">
        <h1 className="search-title">Search TouchGrass</h1>
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for users, challenges, posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <SearchIcon className="search-icon" size={20} />
        </div>
      </div>

      {searchQuery.trim() && (
        <div className="search-tabs">
          <button
            className={`search-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Results
          </button>
          <button
            className={`search-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({searchResults.users.length})
          </button>
          <button
            className={`search-tab ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => setActiveTab('challenges')}
          >
            Challenges ({searchResults.challenges.length})
          </button>
          <button
            className={`search-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts ({searchResults.posts.length})
          </button>
        </div>
      )}

      {renderResults()}
    </motion.div>
  );
};

export default Search;
