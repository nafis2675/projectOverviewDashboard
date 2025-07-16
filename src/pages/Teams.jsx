import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Users, 
  User, 
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const Teams = () => {
  const { t } = useTranslation()
  const { teams, members, role, addNotification, deleteTeam } = useApp()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.lead.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteTeam = (teamId) => {
    // Actually delete the team from state
    deleteTeam(teamId)
    addNotification({
      type: 'success',
      title: t('notifications.success'),
      message: t('notifications.teamDeleted')
    })
  }

  const clamp = (val) => Math.max(0, Math.min(100, val))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('teams.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track all teams
            </p>
          </div>
          {(role === 'manager' || role === 'teamLead') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{t('teams.addTeam')}</span>
            </motion.button>
          )}
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </motion.div>

        {/* Teams Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const teamMembers = members.filter(member => team.members.includes(member.id))
            
            return (
              <motion.div
                key={team.id}
                whileHover={{ y: -5 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {team.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{team.lead}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(team.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {team.progress}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${clamp(team.progress)}%` }}
                    />
                  </div>
                </div>

                {/* Members */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Members
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {teamMembers.length}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {teamMembers.slice(0, 4).map((member) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800"
                      >
                        <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    ))}
                    {teamMembers.length > 4 && (
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          +{teamMembers.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/teams/${team.id}`}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                  {(role === 'manager' || role === 'teamLead') && (
                    <>
                      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Empty State */}
        {filteredTeams.length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('teams.noTeams')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No teams found matching your search criteria.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Teams 