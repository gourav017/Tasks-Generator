# Tasks Generator - AI-Powered Planning Tool

## 📝 Overview

An AI-powered web application that transforms feature ideas into structured user stories, engineering tasks, risk assessments, and identifies unknowns. Built with React, Node.js, MongoDB, and Groq AI.

---

## 🚀 How to Run

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local or Atlas)
- **Groq API Key** (free from https://console.groq.com/keys)

### Installation Steps

#### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <repo-url>
cd tasks-generator

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend/task-generator
npm install
```

#### 2. Configure Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tasks-generator
GROQ_API_KEY=gsk_your_groq_api_key_here
FRONTEND_URL=http://localhost:3000
```

**Get Groq API Key:**
1. Go to https://console.groq.com/keys
2. Sign up (free, no credit card)
3. Create API key
4. Copy and paste into `.env`

**Frontend (.env) - Optional:**
```bash
cd frontend
cp .env.example .env
```

#### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
Update `MONGODB_URI` in backend `.env` with your Atlas connection string.

#### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

---

## ✅ What is Done

### Core Features
- ✅ **AI-Powered Task Generation** - Using Groq's Llama 3.3 70B model
- ✅ **User Story Generation** - 3-5 stories in proper format
- ✅ **Engineering Task Breakdown** - 8-12 actionable tasks
- ✅ **Risk Analysis** - Identifies 2-4 potential risks
- ✅ **Unknowns/Questions** - 2-4 items needing clarification
- ✅ **Template Selection** - Mobile, Web, Internal Tool, Custom
- ✅ **Drag-and-Drop Reordering** - Intuitive task management
- ✅ **Inline Editing** - Edit tasks directly in the interface
- ✅ **Export to Markdown** - Download specification as .md file
- ✅ **Copy to Clipboard** - Quick copy of entire specification
- ✅ **Recent Specifications** - View last 5 generated specs
- ✅ **System Health Monitoring** - Real-time status dashboard

### Technical Implementation
- ✅ **RESTful API** - 8 endpoints for full CRUD operations
- ✅ **MongoDB Integration** - Persistent data storage
- ✅ **React Frontend** - Modern, responsive UI
- ✅ **Tailwind CSS** - Professional styling
- ✅ **Input Validation** - Client and server-side
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Rate Limiting** - API protection (100 req/15min)
- ✅ **Security Headers** - Helmet.js implementation
- ✅ **CORS Configuration** - Proper cross-origin setup

### User Experience
- ✅ **Responsive Design** - Works on desktop, tablet, mobile
- ✅ **Loading States** - Clear feedback during AI generation
- ✅ **Empty State Handling** - Graceful handling of edge cases
- ✅ **Intuitive Navigation** - Clear user flow
- ✅ **Professional UI** - Modern gradient design
- ✅ **Smooth Animations** - Enhanced user experience

---

## ❌ What is NOT Done

### Features Not Implemented
- ❌ **User Authentication** - No login/signup system
- ❌ **User Accounts** - All specs are publicly accessible
- ❌ **Collaborative Editing** - No real-time multi-user editing
- ❌ **Version History** - No spec versioning or rollback
- ❌ **Task Assignment** - Cannot assign tasks to team members
- ❌ **Due Dates/Deadlines** - No time tracking features
- ❌ **Comments/Discussions** - No commenting on tasks


### Technical Limitations
- ❌ **Automated Testing** - No unit/integration tests
- ❌ **CI/CD Pipeline** - No automated deployment


---

## 📁 Project Structure

```
tasks-generator/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Validation, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── services/        # AI service (Groq integration)
│   ├── test/           # Basic health test
│   ├── server.js       # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API client
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   ├── public/
│   └── package.json
│
├── README.md           # This file
├── AI_NOTES.md         # AI usage documentation
├── ABOUTME.md          # Developer profile
└── PROMPTS_USED.md     # Development prompts log
```

---

## 🔧 API Endpoints

### Health
- `GET /api/health` - System health check

### Specifications
- `POST /api/specifications/generate` - Generate new specification
- `GET /api/specifications/recent` - Get last 5 specifications
- `GET /api/specifications/:id` - Get single specification
- `PUT /api/specifications/:id` - Update specification
- `PUT /api/specifications/:id/tasks/reorder` - Reorder tasks
- `DELETE /api/specifications/:id` - Delete specification
- `GET /api/specifications/:id/export` - Export as Markdown

---

## 🧪 Testing

### Run Health Check Test
```bash
cd backend
npm test
```

### Manual Testing Checklist
- [ ] Backend starts without errors
- [ ] MongoDB connects successfully
- [ ] AI service shows healthy in status page
- [ ] Can create new specification
- [ ] Can view generated tasks
- [ ] Can edit tasks
- [ ] Can reorder tasks (drag-and-drop)
- [ ] Can export as Markdown
- [ ] Can copy to clipboard
- [ ] Can view recent specifications

---

## 🐛 Troubleshooting

### Backend Won't Start
1. Check MongoDB is running: `mongod` or verify Atlas connection
2. Verify environment variables in `.env`
3. Check logs for specific errors

### AI Generation Fails
1. Verify Groq API key is valid
2. Check internet connection
3. View backend logs for detailed error
4. Visit status page to check AI service health

### Frontend Can't Connect
1. Verify backend is running on port 5000
2. Check CORS configuration
3. Check browser console for errors

---

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production` in backend `.env`
- [ ] Use production MongoDB (MongoDB Atlas recommended)
- [ ] Configure proper CORS for production domain
- [ ] Set up reverse proxy (Nginx)
- [ ] Enable HTTPS
- [ ] Set up process manager (PM2)
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tasks-generator
GROQ_API_KEY=your_production_key
FRONTEND_URL=https://yourdomain.com
```

---

## 📊 Performance

### Expected Response Times
- AI Generation: 3-5 seconds (first time)
- Subsequent generations: 2-4 seconds
- API endpoints: <100ms
- Page loads: <1 second

### Rate Limits
- General API: 100 requests per 15 minutes per IP
- AI Generation: 5 requests per minute per IP
- Groq API: 30 requests per minute (free tier)

---

## 🎯 Key Technologies

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Groq API** - AI model provider
- **Axios** - HTTP client

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **React DnD** - Drag and drop
- **Lucide React** - Icon library

---

## 📝 Notes

- This application uses **Groq's free tier** with Llama 3.3 70B model
- First AI generation may take slightly longer (3-5 seconds)
- The application requires an active internet connection
- All specifications are stored in MongoDB (no user isolation without auth)

---

## 🆘 Support

For issues, questions, or contributions:
1. Check the troubleshooting section above
2. Review AI_NOTES.md for technical decisions
3. See ABOUTME.md for developer contact information

---

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ using AI assistance for rapid development**