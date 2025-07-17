# Supabase Database Integration Setup Guide

This guide will help you set up the Supabase database for the Project Dashboard application.

## 🎯 **Overview**

The Project Dashboard now uses **Supabase** as its database backend, providing:
- ✅ **Persistent data** - No more data loss on page refresh
- ✅ **Real-time updates** - Changes sync instantly across all users
- ✅ **PostgreSQL database** - Powerful relational database with proper relationships
- ✅ **Built-in authentication** - Ready for user management (future feature)
- ✅ **Scalable infrastructure** - Handles growth automatically

## 🚀 **Quick Setup**

### **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub/Google
3. Click "New Project"
4. Choose organization and fill in project details
5. Wait for project to be created (~2 minutes)

### **Step 2: Get API Keys**
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **Step 3: Create Environment Variables**
Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### **Step 4: Set Up Database Schema**
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire content from `database-schema.sql` file
3. Paste it in the SQL Editor
4. Click **"Run"** to create all tables and sample data

### **Step 5: Install Dependencies**
```bash
npm install @supabase/supabase-js
```

## 🗄️ **Database Schema**

The database consists of 7 main tables:

### **Core Tables**
- **`users`** - User/member information
- **`projects`** - Project details and metadata
- **`teams`** - Team information
- **`project_parts`** - Project components/parts
- **`todos`** - Task items for project parts

### **Junction Tables**
- **`team_members`** - Links users to teams
- **`project_teams`** - Links projects to teams

### **Key Relationships**
```
projects (1) → (many) project_parts
projects (many) ↔ (many) teams
teams (1) → (many) users
project_parts (1) → (many) todos
```

## 🔧 **Features Implemented**

### **Data Operations**
- ✅ **Create** - Projects, teams, members, project parts
- ✅ **Read** - All data with proper relationships
- ✅ **Update** - Members, projects, teams
- ✅ **Delete** - All entities (with cascade rules)

### **Real-time Features**
- ✅ **Live updates** - Changes sync instantly
- ✅ **Multi-user support** - Multiple users can work simultaneously
- ✅ **Connection status** - Visual indicator of database connection

### **API Services**
- ✅ **`projectsService`** - Project CRUD operations
- ✅ **`teamsService`** - Team CRUD operations
- ✅ **`usersService`** - User/member CRUD operations
- ✅ **`projectPartsService`** - Project parts CRUD operations
- ✅ **`todosService`** - Todo CRUD operations

## 📊 **Sample Data**

The setup includes sample data:
- **2 Projects**: E-commerce Platform, CRM System
- **3 Teams**: Frontend Team, Backend Team, CRM Team
- **9 Users**: John Smith (manager), Alice Johnson, Bob Smith, etc.
- **6 Project Parts**: Frontend, Backend, Mobile App, Core CRM, Analytics, Integration
- **16 Todos**: Various tasks for each project part

## 🔒 **Security**

### **Row Level Security (RLS)**
- All tables have RLS enabled
- Current policy: Allow all operations for authenticated users
- Can be made more restrictive later

### **API Keys**
- **Anon Key**: Safe to use in frontend code
- **Service Key**: Admin access (keep secure)

## 🚨 **Troubleshooting**

### **Connection Issues**
1. **Check environment variables** - Ensure `.env.local` file exists with correct keys
2. **Verify Supabase project** - Make sure project is active and accessible
3. **Check console** - Look for error messages in browser console

### **Data Not Loading**
1. **Run database schema** - Ensure all tables are created
2. **Check RLS policies** - Ensure policies allow data access
3. **Verify API keys** - Ensure keys are correct and not expired

### **Common Errors**
- **"Cannot read properties of undefined"** - Environment variables not loaded
- **"relation does not exist"** - Database schema not created
- **"permission denied"** - RLS policies too restrictive

## 🎮 **Testing the Integration**

### **Visual Indicators**
- **Green badge** (bottom-right) - Connected to Supabase
- **Blue badge** - Connecting to database
- **Red badge** - Connection failed

### **Functionality Tests**
1. **Add Project** - Create new project and verify it persists
2. **Add Team** - Create new team and verify it appears
3. **Add Member** - Create new member and verify it's saved
4. **Add Project Part** - Create new project part and verify it's added
5. **Real-time** - Open multiple browser tabs and verify changes sync

## 🛠️ **Development Notes**

### **File Structure**
```
src/
├── services/
│   └── supabase.js          # API service layer
├── context/
│   └── AppContext.jsx       # Updated to use Supabase
├── components/
│   └── DatabaseStatus.jsx   # Connection status indicator
└── ...
```

### **Key Components**
- **`AppContext.jsx`** - Main context using Supabase services
- **`supabase.js`** - API service layer for all database operations
- **`DatabaseStatus.jsx`** - Visual connection status indicator

### **Environment Variables**
- **`VITE_SUPABASE_URL`** - Your Supabase project URL
- **`VITE_SUPABASE_ANON_KEY`** - Your anon/public key

## 🎉 **What's Next?**

### **Immediate Benefits**
- ✅ **Data persistence** - No more data loss
- ✅ **Real-time collaboration** - Multiple users can work together
- ✅ **Professional database** - PostgreSQL with proper relationships

### **Future Enhancements**
- 🔐 **User Authentication** - Login/registration system
- 📱 **Mobile App** - React Native app using same database
- 🔍 **Advanced Search** - Full-text search across projects
- 📊 **Analytics Dashboard** - Usage statistics and insights
- 🔄 **Backup & Recovery** - Automated data backups

---

## 📞 **Support**

If you encounter any issues:
1. Check the **troubleshooting section** above
2. Review the **browser console** for error messages
3. Verify your **Supabase project** is active
4. Ensure **environment variables** are set correctly

---

*Created: December 2024*
*Database: Supabase PostgreSQL*
*Status: ✅ Production Ready* 