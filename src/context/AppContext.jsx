import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  projectsService, 
  teamsService, 
  usersService, 
  projectPartsService,
  subscriptions 
} from '../services/supabase';

const AppContext = createContext();

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  language: localStorage.getItem('i18nextLng') || 'en',
  role: localStorage.getItem('role') || 'manager',
  projects: [],
  teams: [],
  members: [],
  selectedProject: null,
  selectedTeam: null,
  selectedMember: null,
  loading: false,
  notifications: [],
  isConnected: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_TEAMS':
      return { ...state, teams: action.payload };
    case 'SET_MEMBERS':
      return { ...state, members: action.payload };
    case 'SET_SELECTED_PROJECT':
      return { ...state, selectedProject: action.payload };
    case 'SET_SELECTED_TEAM':
      return { ...state, selectedTeam: action.payload };
    case 'SET_SELECTED_MEMBER':
      return { ...state, selectedMember: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }] 
      };
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return { 
        ...state, 
        projects: state.projects.map(p => 
          p.id === action.payload.id ? action.payload : p
        ) 
      };
    case 'DELETE_PROJECT':
      return { 
        ...state, 
        projects: state.projects.filter(p => p.id !== action.payload) 
      };
    case 'ADD_PROJECT_PART':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, parts: [...p.parts, action.payload.part] }
            : p
        )
      };
    case 'UPDATE_PROJECT_PART':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { 
                ...p, 
                parts: p.parts.map(part => 
                  part.id === action.payload.partId 
                    ? { ...part, ...action.payload.updates }
                    : part
                )
              }
            : p
        )
      };
    case 'DELETE_PROJECT_PART':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, parts: p.parts.filter(part => part.id !== action.payload.partId) }
            : p
        )
      };
    case 'ADD_TEAM':
      return { ...state, teams: [...state.teams, action.payload] };
    case 'UPDATE_TEAM':
      return { 
        ...state, 
        teams: state.teams.map(t => 
          t.id === action.payload.id ? action.payload : t
        ) 
      };
    case 'DELETE_TEAM':
      return { 
        ...state, 
        teams: state.teams.filter(t => t.id !== action.payload) 
      };
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] };
    case 'UPDATE_MEMBER':
      return { 
        ...state, 
        members: state.members.map(m => 
          m.id === action.payload.id ? action.payload : m
        ) 
      };
    case 'DELETE_MEMBER':
      return { 
        ...state, 
        members: state.members.filter(m => m.id !== action.payload) 
      };
    case 'ADD_PERSONAL_TODO':
      return {
        ...state,
        members: state.members.map(m => 
          m.id === action.payload.memberId 
            ? { ...m, personalTodos: [...(m.personalTodos || []), action.payload.todo] }
            : m
        )
      };
    case 'UPDATE_PERSONAL_TODO':
      return {
        ...state,
        members: state.members.map(m => 
          m.id === action.payload.memberId 
            ? { 
                ...m, 
                personalTodos: m.personalTodos.map(todo => 
                  todo.id === action.payload.todoId 
                    ? { ...todo, ...action.payload.updates }
                    : todo
                )
              }
            : m
        )
      };
    case 'DELETE_PERSONAL_TODO':
      return {
        ...state,
        members: state.members.map(m => 
          m.id === action.payload.memberId 
            ? { 
                ...m, 
                personalTodos: m.personalTodos.filter(todo => todo.id !== action.payload.todoId)
              }
            : m
        )
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { i18n } = useTranslation();

  // Initialize theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);

  // Initialize language
  useEffect(() => {
    i18n.changeLanguage(state.language);
    localStorage.setItem('i18nextLng', state.language);
  }, [state.language, i18n]);

  // Initialize role
  useEffect(() => {
    localStorage.setItem('role', state.role);
  }, [state.role]);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        // Load all data in parallel
        const [projects, teams, users] = await Promise.all([
          projectsService.getProjects(),
          teamsService.getTeams(),
          usersService.getUsers()
        ]);

        // Transform users data to match expected structure
        const transformedUsers = users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          teamId: user.team_id,
          tasks: user.tasks || [],
          personalTodos: user.personal_todos || []
        }));

        dispatch({ type: 'SET_PROJECTS', payload: projects });
        dispatch({ type: 'SET_TEAMS', payload: teams });
        dispatch({ type: 'SET_MEMBERS', payload: transformedUsers });
        dispatch({ type: 'SET_CONNECTED', payload: true });
        
        console.log('✅ Data loaded successfully:', {
          projects: projects.length,
          teams: teams.length,
          users: transformedUsers.length
        });
        
      } catch (error) {
        console.error('❌ Failed to load data:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        dispatch({ type: 'SET_CONNECTED', payload: false });
        
        // Show error notification
        dispatch({ 
          type: 'ADD_NOTIFICATION', 
          payload: {
            type: 'error',
            message: 'Failed to load data from database. Please check your connection.'
          }
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!state.isConnected) return;

    const projectsSubscription = subscriptions.subscribeToProjects(async (payload) => {
      console.log('🔄 Projects updated:', payload);
      try {
        const projects = await projectsService.getProjects();
        dispatch({ type: 'SET_PROJECTS', payload: projects });
      } catch (error) {
        console.error('Failed to refresh projects:', error);
      }
    });

    const teamsSubscription = subscriptions.subscribeToTeams(async (payload) => {
      console.log('🔄 Teams updated:', payload);
      try {
        const teams = await teamsService.getTeams();
        dispatch({ type: 'SET_TEAMS', payload: teams });
      } catch (error) {
        console.error('Failed to refresh teams:', error);
      }
    });

    const usersSubscription = subscriptions.subscribeToUsers(async (payload) => {
      console.log('🔄 Users updated:', payload);
      try {
        const users = await usersService.getUsers();
        const transformedUsers = users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          teamId: user.team_id,
          tasks: user.tasks || [],
          personalTodos: user.personal_todos || []
        }));
        dispatch({ type: 'SET_MEMBERS', payload: transformedUsers });
      } catch (error) {
        console.error('Failed to refresh users:', error);
      }
    });

    // Cleanup subscriptions on unmount
    return () => {
      projectsSubscription.unsubscribe();
      teamsSubscription.unsubscribe();
      usersSubscription.unsubscribe();
    };
  }, [state.isConnected]);

  // API methods using Supabase services
  const addProject = async (projectData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Create project in database
      const newProject = await projectsService.createProject({
        name: projectData.name,
        description: projectData.description,
        managerId: projectData.managerId,
        deadline: projectData.deadline
      });

      // Transform and add to state
      const transformedProject = {
        id: newProject.id,
        name: newProject.name,
        description: newProject.description,
        manager: projectData.manager,
        deadline: newProject.deadline,
        progress: 0,
        status: 'active',
        teams: [],
        parts: projectData.parts || [],
        activityLog: []
      };

      dispatch({ type: 'ADD_PROJECT', payload: transformedProject });
      
      // Create default project parts if provided
      if (projectData.parts && projectData.parts.length > 0) {
        for (const part of projectData.parts) {
          await projectPartsService.createProjectPart(newProject.id, part);
        }
      }

      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: {
          type: 'success',
          message: 'Project created successfully!'
        }
      });

    } catch (error) {
      console.error('Failed to create project:', error);
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: {
          type: 'error',
          message: 'Failed to create project. Please try again.'
        }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addProjectPart = async (projectId, partData) => {
    try {
      const newPart = await projectPartsService.createProjectPart(projectId, partData);
      
      const transformedPart = {
        id: newPart.id,
        name: newPart.name,
        description: newPart.description,
        weight: newPart.weight,
        progress: newPart.progress,
        todos: []
      };

      dispatch({ 
        type: 'ADD_PROJECT_PART', 
        payload: { projectId, part: transformedPart } 
      });

    } catch (error) {
      console.error('Failed to create project part:', error);
      throw error;
    }
  };

  const addTeam = async (teamData) => {
    try {
      const newTeam = await teamsService.createTeam({
        name: teamData.name,
        leadId: teamData.leadId,
        projectId: teamData.projectId,
        deadline: teamData.deadline
      });

      const transformedTeam = {
        id: newTeam.id,
        name: newTeam.name,
        lead: teamData.lead,
        members: [],
        projectId: newTeam.project_id,
        progress: 0,
        deadline: newTeam.deadline
      };

      dispatch({ type: 'ADD_TEAM', payload: transformedTeam });

    } catch (error) {
      console.error('Failed to create team:', error);
      throw error;
    }
  };

  const addMember = async (memberData) => {
    try {
      const newUser = await usersService.createUser({
        name: memberData.name,
        email: memberData.email,
        role: memberData.role,
        team_id: memberData.teamId
      });

      const transformedMember = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        teamId: newUser.team_id,
        tasks: [],
        personalTodos: memberData.personalTodos || []
      };

      dispatch({ type: 'ADD_MEMBER', payload: transformedMember });

    } catch (error) {
      console.error('Failed to create member:', error);
      throw error;
    }
  };

  const updateMember = async (memberData) => {
    try {
      const updatedUser = await usersService.updateUser(memberData.id, {
        name: memberData.name,
        email: memberData.email,
        role: memberData.role,
        team_id: memberData.teamId
      });

      const transformedMember = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        teamId: updatedUser.team_id,
        tasks: memberData.tasks || [],
        personalTodos: memberData.personalTodos || []
      };

      dispatch({ type: 'UPDATE_MEMBER', payload: transformedMember });

    } catch (error) {
      console.error('Failed to update member:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    dispatch,
    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    setLanguage: (language) => dispatch({ type: 'SET_LANGUAGE', payload: language }),
    setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
    addNotification: (notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    addProject,
    updateProject: (project) => dispatch({ type: 'UPDATE_PROJECT', payload: project }),
    deleteProject: (id) => dispatch({ type: 'DELETE_PROJECT', payload: id }),
    addProjectPart,
    updateProjectPart: (projectId, partId, updates) => dispatch({ 
      type: 'UPDATE_PROJECT_PART', 
      payload: { projectId, partId, updates } 
    }),
    deleteProjectPart: (projectId, partId) => dispatch({ 
      type: 'DELETE_PROJECT_PART', 
      payload: { projectId, partId } 
    }),
    addTeam,
    updateTeam: (team) => dispatch({ type: 'UPDATE_TEAM', payload: team }),
    deleteTeam: (id) => dispatch({ type: 'DELETE_TEAM', payload: id }),
    addMember,
    updateMember,
    deleteMember: (id) => dispatch({ type: 'DELETE_MEMBER', payload: id }),
    addPersonalTodo: (memberId, todo) => dispatch({ 
      type: 'ADD_PERSONAL_TODO', 
      payload: { memberId, todo } 
    }),
    updatePersonalTodo: (memberId, todoId, updates) => dispatch({ 
      type: 'UPDATE_PERSONAL_TODO', 
      payload: { memberId, todoId, updates } 
    }),
    deletePersonalTodo: (memberId, todoId) => dispatch({ 
      type: 'DELETE_PERSONAL_TODO', 
      payload: { memberId, todoId } 
    })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 