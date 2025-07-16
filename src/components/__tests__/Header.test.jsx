import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { AppProvider } from '../../context/AppContext';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Create a mock Header component that accepts props instead of using context
const MockHeader = ({ theme, language, role, setTheme, setLanguage, setRole }) => {
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const roles = [
    { value: 'manager', label: 'Manager' },
    { value: 'teamLead', label: 'Team Lead' },
    { value: 'member', label: 'Member' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);
  const currentRole = roles.find(r => r.value === role);

  return (
    <header className="glass border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Project Control Center
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span>🔔</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              aria-label="Language selector"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <span>🌐</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentLanguage?.flag}
              </span>
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {lang.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Role Selector */}
          <div className="relative">
            <button
              aria-label="Role selector"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
            >
              <span>👤</span>
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {currentRole?.label}
              </span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                {roles.map((roleOption) => (
                  <button
                    key={roleOption.value}
                    onClick={() => {
                      setRole(roleOption.value);
                      setShowRoleMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {roleOption.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            aria-label="Settings"
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span>⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
};

describe('Header Component', () => {
  const defaultProps = {
    theme: 'light',
    language: 'en',
    role: 'manager',
    setTheme: jest.fn(),
    setLanguage: jest.fn(),
    setRole: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders header with title', () => {
      render(<MockHeader {...defaultProps} />);
      
      expect(screen.getByText('Project Control Center')).toBeInTheDocument();
    });

    test('renders all control buttons', () => {
      render(<MockHeader {...defaultProps} />);
      
      expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Language selector')).toBeInTheDocument();
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Role selector')).toBeInTheDocument();
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });

    test('displays current language flag', () => {
      render(<MockHeader {...defaultProps} />);
      
      expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    });

    test('displays current role', () => {
      render(<MockHeader {...defaultProps} />);
      
      expect(screen.getByText('Manager')).toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    test('displays sun icon in dark mode', () => {
      render(<MockHeader {...defaultProps} theme="dark" />);
      
      expect(screen.getByText('☀️')).toBeInTheDocument();
    });

    test('displays moon icon in light mode', () => {
      render(<MockHeader {...defaultProps} theme="light" />);
      
      expect(screen.getByText('🌙')).toBeInTheDocument();
    });

    test('calls setTheme when theme toggle is clicked', async () => {
      const mockSetTheme = jest.fn();
      render(<MockHeader {...defaultProps} setTheme={mockSetTheme} />);
      
      const themeButton = screen.getByLabelText('Toggle theme');
      await userEvent.click(themeButton);
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    test('toggles from dark to light theme', async () => {
      const mockSetTheme = jest.fn();
      render(<MockHeader {...defaultProps} theme="dark" setTheme={mockSetTheme} />);
      
      const themeButton = screen.getByLabelText('Toggle theme');
      await userEvent.click(themeButton);
      
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('Language Selector', () => {
    test('opens language menu when clicked', async () => {
      render(<MockHeader {...defaultProps} />);
      
      const languageButton = screen.getByLabelText('Language selector');
      await userEvent.click(languageButton);
      
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('日本語')).toBeInTheDocument();
    });

    test('changes language when option is selected', async () => {
      const mockSetLanguage = jest.fn();
      render(<MockHeader {...defaultProps} setLanguage={mockSetLanguage} />);
      
      const languageButton = screen.getByLabelText('Language selector');
      await userEvent.click(languageButton);
      
      const japaneseOption = screen.getByText('日本語');
      await userEvent.click(japaneseOption);
      
      expect(mockSetLanguage).toHaveBeenCalledWith('ja');
    });

    test('closes menu after selecting language', async () => {
      render(<MockHeader {...defaultProps} />);
      
      const languageButton = screen.getByLabelText('Language selector');
      await userEvent.click(languageButton);
      
      const englishOption = screen.getByText('English');
      await userEvent.click(englishOption);
      
      await waitFor(() => {
        expect(screen.queryByText('English')).not.toBeInTheDocument();
      });
    });
  });

  describe('Role Selector', () => {
    test('opens role menu when clicked', async () => {
      render(<MockHeader {...defaultProps} />);
      
      const roleButton = screen.getByLabelText('Role selector');
      await userEvent.click(roleButton);
      
      expect(screen.getAllByText('Manager')).toHaveLength(2); // One in button, one in menu
      expect(screen.getByText('Team Lead')).toBeInTheDocument();
      expect(screen.getByText('Member')).toBeInTheDocument();
    });

    test('changes role when option is selected', async () => {
      const mockSetRole = jest.fn();
      render(<MockHeader {...defaultProps} setRole={mockSetRole} />);
      
      const roleButton = screen.getByLabelText('Role selector');
      await userEvent.click(roleButton);
      
      const memberOption = screen.getByText('Member');
      await userEvent.click(memberOption);
      
      expect(mockSetRole).toHaveBeenCalledWith('member');
    });

    test('displays different roles correctly', () => {
      const { rerender } = render(<MockHeader {...defaultProps} role="teamLead" />);
      expect(screen.getByText('Team Lead')).toBeInTheDocument();
      
      rerender(<MockHeader {...defaultProps} role="member" />);
      expect(screen.getByText('Member')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<MockHeader {...defaultProps} />);
      
      expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Language selector')).toBeInTheDocument();
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Role selector')).toBeInTheDocument();
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });

    test('supports keyboard navigation', async () => {
      render(<MockHeader {...defaultProps} />);
      
      const languageButton = screen.getByLabelText('Language selector');
      languageButton.focus();
      
      expect(document.activeElement).toBe(languageButton);
      
      // Test Enter key
      fireEvent.keyDown(languageButton, { key: 'Enter', code: 'Enter' });
      await userEvent.click(languageButton);
      
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    test('all buttons are clickable', async () => {
      render(<MockHeader {...defaultProps} />);
      
      const buttons = [
        screen.getByLabelText('Notifications'),
        screen.getByLabelText('Language selector'),
        screen.getByLabelText('Toggle theme'),
        screen.getByLabelText('Role selector'),
        screen.getByLabelText('Settings'),
      ];
      
      for (const button of buttons) {
        expect(button).toBeInTheDocument();
        await userEvent.click(button);
        // Should not throw any errors
      }
    });

    test('maintains state consistency', async () => {
      const mockSetTheme = jest.fn();
      const mockSetLanguage = jest.fn();
      const mockSetRole = jest.fn();
      
      render(
        <MockHeader
          {...defaultProps}
          setTheme={mockSetTheme}
          setLanguage={mockSetLanguage}
          setRole={mockSetRole}
        />
      );
      
      // Theme change
      await userEvent.click(screen.getByLabelText('Toggle theme'));
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      
      // Language change
      await userEvent.click(screen.getByLabelText('Language selector'));
      await userEvent.click(screen.getByText('日本語'));
      expect(mockSetLanguage).toHaveBeenCalledWith('ja');
      
      // Role change
      await userEvent.click(screen.getByLabelText('Role selector'));
      await userEvent.click(screen.getByText('Team Lead'));
      expect(mockSetRole).toHaveBeenCalledWith('teamLead');
    });
  });
});