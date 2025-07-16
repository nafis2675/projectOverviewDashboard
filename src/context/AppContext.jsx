import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  notifications: []
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

  // Load mock data
  useEffect(() => {
    const loadMockData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate API call
      setTimeout(() => {
        const mockProjects = [
          {
            id: 1,
            name: 'E-commerce Platform',
            manager: 'John Smith',
            deadline: '2026-03-15',
            progress: 75,
            status: 'active',
            teams: [1, 2],
            parts: [
              { id: 1, name: 'Frontend', weight: 40, progress: 80, todos: [
                { id: 1, text: 'Design system implementation', completed: true },
                { id: 2, text: 'User authentication', completed: true },
                { id: 3, text: 'Shopping cart functionality', completed: false },
                { id: 4, text: 'Payment integration', completed: false }
              ]},
              { id: 2, name: 'Backend', weight: 35, progress: 70, todos: [
                { id: 5, text: 'API development', completed: true },
                { id: 6, text: 'Database design', completed: true },
                { id: 7, text: 'Security implementation', completed: false }
              ]},
              { id: 3, name: 'Mobile App', weight: 25, progress: 60, todos: [
                { id: 8, text: 'UI/UX design', completed: true },
                { id: 9, text: 'Core functionality', completed: false },
                { id: 10, text: 'Testing and optimization', completed: false }
              ]}
            ],
            activityLog: [
              { date: '2026-07-14', message: 'Frontend part completed.' },
              { date: '2026-07-13', message: 'Team assigned to project.' }
            ]
          },
          {
            id: 2,
            name: 'CRM System',
            manager: 'Sarah Johnson',
            deadline: '2026-04-20',
            progress: 45,
            status: 'active',
            teams: [3],
            parts: [
              { id: 4, name: 'Core CRM', weight: 50, progress: 50, todos: [
                { id: 11, text: 'Customer database', completed: true },
                { id: 12, text: 'Lead management', completed: false },
                { id: 13, text: 'Reporting system', completed: false }
              ]},
              { id: 5, name: 'Analytics', weight: 30, progress: 30, todos: [
                { id: 14, text: 'Data visualization', completed: false },
                { id: 15, text: 'Performance metrics', completed: false }
              ]},
              { id: 6, name: 'Integration', weight: 20, progress: 20, todos: [
                { id: 16, text: 'Third-party APIs', completed: false }
              ]}
            ]
          }
        ];

        const mockTeams = [
          {
            id: 1,
            name: 'Frontend Team',
            lead: 'Mike Chen',
            members: [1, 2, 3],
            projectId: 1,
            progress: 80,
            deadline: '2026-03-15'
          },
          {
            id: 2,
            name: 'Backend Team',
            lead: 'Lisa Wang',
            members: [4, 5],
            projectId: 1,
            progress: 70,
            deadline: '2026-03-15'
          },
          {
            id: 3,
            name: 'CRM Team',
            lead: 'David Kim',
            members: [6, 7, 8],
            projectId: 2,
            progress: 45,
            deadline: '2026-04-20'
          }
        ];

        const mockMembers = [
          { 
            id: 1, 
            name: 'Alice Johnson', 
            role: 'member', 
            teamId: 1, 
            tasks: [1, 2],
            personalTodos: [
              { id: 1, text: 'Review project documentation', completed: true },
              { id: 2, text: 'Update personal skills profile', completed: false },
              { id: 3, text: 'Schedule team meeting', completed: false }
            ]
          },
          { 
            id: 2, 
            name: 'Bob Smith', 
            role: 'member', 
            teamId: 1, 
            tasks: [3],
            personalTodos: [
              { id: 1, text: 'Complete training module', completed: true },
              { id: 2, text: 'Prepare presentation', completed: false }
            ]
          },
          { 
            id: 3, 
            name: 'Carol Davis', 
            role: 'member', 
            teamId: 1, 
            tasks: [4],
            personalTodos: [
              { id: 1, text: 'Review code standards', completed: false },
              { id: 2, text: 'Update documentation', completed: true }
            ]
          },
          { 
            id: 4, 
            name: 'Mike Chen', 
            role: 'teamLead', 
            teamId: 1, 
            tasks: [5, 6],
            personalTodos: [
              { id: 1, text: 'Team performance review', completed: false },
              { id: 2, text: 'Budget planning', completed: false },
              { id: 3, text: 'Client meeting preparation', completed: true }
            ]
          },
          { 
            id: 5, 
            name: 'Eva Wilson', 
            role: 'member', 
            teamId: 2, 
            tasks: [7],
            personalTodos: [
              { id: 1, text: 'Database optimization', completed: false },
              { id: 2, text: 'Security audit', completed: true }
            ]
          },
          { 
            id: 6, 
            name: 'Frank Brown', 
            role: 'member', 
            teamId: 3, 
            tasks: [11, 12],
            personalTodos: [
              { id: 1, text: 'Customer feedback analysis', completed: false },
              { id: 2, text: 'CRM system testing', completed: false }
            ]
          },
          { 
            id: 7, 
            name: 'Grace Lee', 
            role: 'member', 
            teamId: 3, 
            tasks: [13],
            personalTodos: [
              { id: 1, text: 'Report generation', completed: true },
              { id: 2, text: 'Data validation', completed: false }
            ]
          },
          { 
            id: 8, 
            name: 'Henry Taylor', 
            role: 'member', 
            teamId: 3, 
            tasks: [14, 15],
            personalTodos: [
              { id: 1, text: 'Analytics dashboard', completed: false },
              { id: 2, text: 'Performance metrics', completed: false },
              { id: 3, text: 'User testing', completed: true }
            ]
          }
        ];

        dispatch({ type: 'SET_PROJECTS', payload: mockProjects });
        dispatch({ type: 'SET_TEAMS', payload: mockTeams });
        dispatch({ type: 'SET_MEMBERS', payload: mockMembers });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 1000);
    };

    loadMockData();
  }, []);

  const value = {
    ...state,
    dispatch,
    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    setLanguage: (language) => dispatch({ type: 'SET_LANGUAGE', payload: language }),
    setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
    addNotification: (notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    addProject: (project) => dispatch({ type: 'ADD_PROJECT', payload: project }),
    updateProject: (project) => dispatch({ type: 'UPDATE_PROJECT', payload: project }),
    deleteProject: (id) => dispatch({ type: 'DELETE_PROJECT', payload: id }),
    addTeam: (team) => dispatch({ type: 'ADD_TEAM', payload: team }),
    updateTeam: (team) => dispatch({ type: 'UPDATE_TEAM', payload: team }),
    deleteTeam: (id) => dispatch({ type: 'DELETE_TEAM', payload: id }),
    addMember: (member) => dispatch({ type: 'ADD_MEMBER', payload: member }),
    updateMember: (member) => dispatch({ type: 'UPDATE_MEMBER', payload: member }),
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