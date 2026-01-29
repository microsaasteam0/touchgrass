# TouchGrass

A SaaS platform designed to help users build and maintain outdoor activity streaks, promoting healthier lifestyles through gamified accountability and community engagement.

## Overview

TouchGrass is a comprehensive web application that combines habit tracking, social accountability, and gamification to encourage users to spend more time outdoors. The platform features streak tracking, community challenges, leaderboards, and real-time chat to create a supportive environment for building sustainable outdoor habits.

## Features

### Core Functionality
- **Streak Tracking**: Monitor daily outdoor activities with visual progress indicators
- **Community Challenges**: Participate in group challenges with shared goals
- **Leaderboards**: Compete with friends and global users
- **Real-time Chat**: Connect with like-minded individuals
- **Social Sharing**: Share achievements and progress on social media
- **Payment Integration**: Subscription-based premium features

### Technical Features
- **Real-time Notifications**: WebSocket-based instant messaging
- **Image Processing**: Cloudinary integration for user uploads
- **Geolocation Services**: Location-based features and analytics
- **Email Services**: Automated notifications and newsletters
- **Analytics**: Comprehensive user behavior tracking
- **SEO Optimized**: Dynamic sitemap generation and meta tag management

## Technology Stack

### Frontend
- **React 18** with Vite build system
- **Tailwind CSS** for styling
- **React Router** for client-side routing
- **Context API** for state management
- **Socket.io-client** for real-time features

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Redis** for caching and session management
- **Stripe** for payment processing

### Infrastructure
- **Docker** for containerization
- **Nginx** for reverse proxy
- **PM2** for process management
- **GitHub Actions** for CI/CD

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/touchgrass.git
   cd touchgrass
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env

   # Edit environment variables
   nano backend/.env
   nano frontend/.env
   ```

4. **Start Development Servers**
   ```bash
   # Backend (from backend directory)
   npm run dev

   # Frontend (from frontend directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/touchgrass
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
EMAIL_SERVICE_API_KEY=your-email-api-key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## Project Structure

```
touchgrass/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, cloud services config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Authentication, validation, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── sockets/         # Real-time communication
│   │   ├── utils/           # Helper functions
│   │   └── tests/           # Unit and integration tests
│   ├── server.js            # Application entry point
│   └── package.json
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Helper utilities
│   │   └── styles/          # CSS and styling
│   ├── index.html
│   └── package.json
├── docs/                    # Documentation
├── scripts/                 # Deployment and maintenance scripts
└── docker-compose.yml       # Docker orchestration
```

## API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Streaks
- `GET /api/streaks` - Get user streaks
- `POST /api/streaks` - Create new streak
- `PUT /api/streaks/:id` - Update streak
- `DELETE /api/streaks/:id` - Delete streak

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/friends` - Get friends leaderboard

### Payments
- `POST /api/payments/create-session` - Create Stripe checkout session
- `GET /api/payments/success` - Payment success callback
- `GET /api/payments/cancel` - Payment cancel callback

## Testing

### Backend Tests
```bash
cd backend
npm test              # Run all tests
npm run test:unit     # Run unit tests only
npm run test:integration  # Run integration tests only
```

### Frontend Tests
```bash
cd frontend
npm test              # Run tests
npm run test:coverage # Run tests with coverage
```

## Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual services
docker build -t touchgrass-backend ./backend
docker build -t touchgrass-frontend ./frontend
```

### Manual Deployment
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve dist/ with nginx or similar
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use ESLint and Prettier for code formatting
- Follow conventional commit messages
- Write tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/touchgrass/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/touchgrass/discussions)

## Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with fitness wearables
- [ ] Multi-language support
- [ ] Advanced gamification features

---

Built with ❤️ for healthier, more active lifestyles
