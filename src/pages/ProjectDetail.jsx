import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Users, 
  CheckCircle, 
  Clock,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const ProjectDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { projects, teams, role } = useApp()
  const [selectedTeam, setSelectedTeam] = useState('')
  const [expandedParts, setExpandedParts] = useState(new Set())

  const project = projects.find(p => p.id === parseInt(id))
  
  if (!project) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Project not found
        </h1>
        <Link to="/projects" className="btn-primary">
          Back to Projects
        </Link>
      </div>
    )
  }

  const projectTeams = teams.filter(team => project.teams.includes(team.id))
  const daysUntilDeadline = Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))

  // Clamp progress for project and parts
  const clamp = (val) => Math.max(0, Math.min(100, val))

  const togglePartExpansion = (partId) => {
    const newExpanded = new Set(expandedParts)
    if (newExpanded.has(partId)) {
      newExpanded.delete(partId)
    } else {
      newExpanded.add(partId)
    }
    setExpandedParts(newExpanded)
  }

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
              to="/projects"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('projects.projectDetails')}
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

        {/* Project Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manager</p>
                  <p className="font-medium text-gray-900 dark:text-white">{project.manager}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Teams</p>
                  <p className="font-medium text-gray-900 dark:text-white">{projectTeams.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {project.status}
                  </div>
                </div>
              </div>
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
                    Overall Progress
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {clamp(project.progress)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${clamp(project.progress)}%` }}
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

          {/* Team Selector */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('projects.teamSelector')}
            </h3>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a team</option>
              {projectTeams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {selectedTeam && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Team selected: {projectTeams.find(t => t.id === parseInt(selectedTeam))?.name}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={itemVariants} className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('projects.timeline')}
          </h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">S</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Project Started</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">January 1, 2026</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Planning Phase Complete</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">January 15, 2026</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Development in Progress</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">D</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Project Deadline</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(project.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Project Parts */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('projects.parts')}
            </h3>
            {(role === 'manager' || role === 'teamLead') && (
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>{t('projects.addPart')}</span>
              </button>
            )}
          </div>
          <div className="space-y-4">
            {project.parts.map((part) => (
              <div key={part.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => togglePartExpansion(part.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {expandedParts.has(part.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{part.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Weight: {part.weight}% • Progress: {clamp(part.progress)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${clamp(part.progress)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {expandedParts.has(part.id) && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                        {t('projects.todoList')}
                      </h5>
                      <div className="space-y-2">
                        {part.todos.map((todo) => (
                          <div key={todo.id} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                            />
                            <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                              {todo.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Project Activity Log */}
        <motion.div variants={itemVariants} className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('projects.activityLog')}
          </h3>
          <div className="space-y-2">
            {(project.activityLog || []).length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No recent activity.</p>
            ) : (
              project.activityLog.map((log, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{log.date}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-200">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ProjectDetail 