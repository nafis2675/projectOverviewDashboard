import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  User,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const Sidebar = () => {
  const { t } = useTranslation()
  const { role, projects, teams } = useApp()
  const location = useLocation()
  
  // Calculate quick stats
  const activeProjects = projects.filter(p => p.status === 'active').length
  const dueSoonProjects = projects.filter(p => {
    const deadline = new Date(p.deadline)
    const today = new Date()
    const timeDiff = deadline - today
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    return daysDiff <= 7 && daysDiff > 0
  }).length

  const navigation = [
    {
      name: t('nav.dashboard'),
      href: '/',
      icon: LayoutDashboard,
      roles: ['manager', 'teamLead', 'member']
    },
    {
      name: t('nav.projects'),
      href: '/projects',
      icon: FolderOpen,
      roles: ['manager', 'teamLead', 'member']
    },
    {
      name: t('nav.teams'),
      href: '/teams',
      icon: Users,
      roles: ['manager', 'teamLead']
    },
    {
      name: t('nav.members'),
      href: '/members',
      icon: User,
      roles: ['manager', 'teamLead', 'member']
    }
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(role)
  )

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            PCC
          </h2>
        </div>

        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {activeProjects}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Due Soon
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {dueSoonProjects}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar 