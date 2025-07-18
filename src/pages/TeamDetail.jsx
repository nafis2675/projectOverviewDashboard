import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const TeamDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { teams, members, projects, role } = useApp()
  const [selectedMember, setSelectedMember] = useState('')

  const team = teams.find(t => t.id === id)
  
  if (!team) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Team not found
        </h1>
        <Link to="/teams" className="btn-primary">
          Back to Teams
        </Link>
      </div>
    )
  }

  const teamMembers = members.filter(member => team.members.includes(member.id))
  const teamProject = projects.find(p => p.id === team.projectId)
  const daysUntilDeadline = Math.ceil((new Date(team.deadline) - new Date()) / (1000 * 60 * 60 * 24))

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
          <div className="flex items-center space-x-4">
            <Link
              to="/teams"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {team.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('teams.teamDetails')}
              </p>
            </div>
          </div>
          {(role === 'manager' || role === 'teamLead') && (
            <div className="flex items-center space-x-2">
              <button className="btn-secondary flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Team Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Team Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Team Lead</p>
                  <p className="font-medium text-gray-900 dark:text-white">{team.lead}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(team.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
                  <p className="font-medium text-gray-900 dark:text-white">{teamMembers.length}</p>
                </div>
              </div>
              {teamProject && (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Project</p>
                    <p className="font-medium text-gray-900 dark:text-white">{teamProject.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progress Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Team Progress
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
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
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Days Remaining</p>
                  <p className={`font-medium ${daysUntilDeadline > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {daysUntilDeadline > 0 ? daysUntilDeadline : Math.abs(daysUntilDeadline)} days
                    {daysUntilDeadline <= 0 ? ' overdue' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Member Selector */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('teams.memberSelector')}
            </h3>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a member</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {selectedMember && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Member selected: {teamMembers.find(m => m.id === selectedMember)?.name}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Team Members */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Members
            </h3>
            {role === 'manager' && (
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tasks: {member.tasks?.length || 0}
                  </span>
                  <Link
                    to={`/members/${member.id}`}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TeamDetail 