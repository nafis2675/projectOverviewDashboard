# Project Control Center Dashboard

A modern, full-stack project management dashboard built with React, featuring role-based access control, internationalization, and real-time progress tracking.

## 🌟 Features

- **📊 Interactive Dashboard** - Real-time project statistics and progress charts
- **👥 Role-Based Access** - Manager, Team Lead, and Member permissions
- **🌐 Internationalization** - Full English and Japanese support
- **🌙 Dark Mode** - Beautiful light and dark themes
- **📱 Responsive Design** - Works perfectly on all devices
- **⚡ Modern UI** - Glassmorphism design with smooth animations
- **📈 Progress Tracking** - Visual progress bars and timeline views
- **✅ Todo Management** - Interactive task lists and completion tracking

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context + useReducer
- **Internationalization**: react-i18next
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Mock API**: JSON Server

## 📁 Project Structure

```
project-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route components
│   ├── context/            # State management
│   ├── i18n/              # Internationalization
│   └── App.jsx            # Main app component
├── docs/                   # Documentation
├── db.json                # Mock data
└── package.json
```

## 🎯 Key Features

### Role-Based Access Control
- **Manager**: Full access to all features
- **Team Lead**: Limited management access
- **Member**: View-only access to assigned tasks

### Internationalization
- Complete English/Japanese translation
- Real-time language switching
- Persistent language preferences

### Modern UI/UX
- Glassmorphism design effects
- Smooth animations and transitions
- Responsive mobile-first design
- Dark/light theme toggle

### Project Management
- Project overview with progress tracking
- Team management and member assignments
- Interactive timeline visualization
- Todo list management

## 📖 Documentation

- [Setup and Usage Guide](docs/SETUP_AND_USAGE.md)
- [Development Timeline](docs/DEVELOPMENT_TIMELINE.md)
- [Design Log](docs/DESIGN_LOG.md)

## 🎨 Screenshots

### Dashboard
- Overview statistics and charts
- Recent projects and activities
- Progress visualization

### Projects
- Project cards with progress bars
- Search and filtering capabilities
- Role-based actions

### Teams
- Team management interface
- Member visualization
- Progress tracking

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Setup

1. **Node.js** (version 16 or higher)
2. **npm** or **yarn** package manager
3. **Modern web browser**

### Mock Data

The application includes realistic mock data:
- 2 sample projects (E-commerce Platform, CRM System)
- 3 teams (Frontend, Backend, CRM)
- 8 team members with various roles

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This project is created for demonstration purposes.

## 🤝 Contributing

This is a demo project showcasing modern React development practices.

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies** 