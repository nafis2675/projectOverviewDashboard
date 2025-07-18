import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
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
  ChevronRight,
  X,
  Save,
  AlertCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import LoadingSpinner from '../components/LoadingSpinner'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { projects, teams, members, role, addProjectPart, addNotification, updateProject, deleteProject } = useApp()
  
  // State management
  const [selectedTeam, setSelectedTeam] = useState('')
  const [expandedParts, setExpandedParts] = useState(new Set())
  const [showAddPartModal, setShowAddPartModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight: '',
    progress: 0
  })
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    manager: '',
    deadline: '',
    status: 'active'
  })
  const [formErrors, setFormErrors] = useState({})
  const [editFormErrors, setEditFormErrors] = useState({})

  const project = projects.find(p => p.id === id)
  
  // Initialize edit form data when project is loaded
  useEffect(() => {
    if (project) {
      setEditFormData({
        name: project.name,
        description: project.description || '',
        manager: project.manager,
        deadline: project.deadline,
        status: project.status
      })
    }
  }, [project])

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

  // Get selected team details
  const selectedTeamData = selectedTeam ? teams.find(team => team.id === selectedTeam) : null
  const selectedTeamMembers = selectedTeamData ? members.filter(member => member.teamId === selectedTeamData.id) : []
  
  // Clamp progress for project and parts
  const clamp = (val) => Math.max(0, Math.min(100, val))

  // Event handlers
  const handleEditProject = () => {
    setShowEditModal(true)
  }

  const handleDeleteProject = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteProject(id)
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Project deleted successfully'
      })
      navigate('/projects')
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete project'
      })
    }
    setShowDeleteModal(false)
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (editFormErrors[name]) {
      setEditFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateEditForm = () => {
    const errors = {}
    
    if (!editFormData.name.trim()) {
      errors.name = 'Project name is required'
    }
    
    if (!editFormData.manager.trim()) {
      errors.manager = 'Manager name is required'
    }
    
    if (!editFormData.deadline) {
      errors.deadline = 'Deadline is required'
    } else {
      const selectedDate = new Date(editFormData.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate <= today) {
        errors.deadline = 'Deadline must be in the future'
      }
    }
    
    return errors
  }

  const handleUpdateProject = async (e) => {
    e.preventDefault()
    
    const errors = validateEditForm()
    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors)
      return
    }

    setIsUpdating(true)

    try {
      const updatedProject = {
        ...project,
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        manager: editFormData.manager.trim(),
        deadline: editFormData.deadline,
        status: editFormData.status
      }

      await updateProject(updatedProject)
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Project updated successfully'
      })

      setShowEditModal(false)
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update project'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const togglePartExpansion = (partId) => {
    const newExpanded = new Set(expandedParts)
    if (newExpanded.has(partId)) {
      newExpanded.delete(partId)
    } else {
      newExpanded.add(partId)
    }
    setExpandedParts(newExpanded)
  }

  const handleTodoToggle = (partId, todoId) => {
    // This would typically update the todo status in the backend
    addNotification({
      type: 'info',
      title: 'Todo Updated',
      message: 'Todo status updated successfully'
    })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = t('projects.requiredField')
    }
    
    if (!formData.weight.trim()) {
      errors.weight = t('projects.weightRequired')
    } else {
      const weight = parseFloat(formData.weight)
      if (isNaN(weight) || weight < 1 || weight > 100) {
        errors.weight = t('projects.weightInvalid')
      }
    }
    
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsCreating(true)

    try {
      const partData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        weight: parseFloat(formData.weight),
        progress: formData.progress
      }

      await addProjectPart(project.id, partData)
      
      addNotification({
        type: 'success',
        title: t('notifications.success'),
        message: t('notifications.partCreated')
      })

      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        weight: '',
        progress: 0
      })
      setFormErrors({})
      setShowAddPartModal(false)
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('notifications.error'),
        message: 'Failed to create part'
      })
    } finally {
      setIsCreating(false)
    }
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
              <button 
                onClick={handleEditProject}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button 
                onClick={handleDeleteProject}
                className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
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
          </div>
        </motion.div>

        {/* Team Information Section */}
        {selectedTeamData && (
          <motion.div variants={itemVariants} className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('projects.teamInfo')} - {selectedTeamData.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Members */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  {t('projects.teamMembers')}
                </h4>
                <div className="space-y-2">
                  {selectedTeamMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Progress */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  {t('projects.teamProgress')}
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Team Progress
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {clamp(selectedTeamData.progress)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${clamp(selectedTeamData.progress)}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Team Lead: <span className="font-medium text-gray-900 dark:text-white">{selectedTeamData.lead}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Members: <span className="font-medium text-gray-900 dark:text-white">{selectedTeamMembers.length}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Project Parts */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('projects.parts')}
            </h3>
            {(role === 'manager' || role === 'teamLead') && (
              <button 
                onClick={() => setShowAddPartModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
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
                              onChange={() => handleTodoToggle(part.id, todo.id)}
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

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Project
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleUpdateProject} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      editFormErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter project name"
                  />
                  {editFormErrors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {editFormErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter project description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Manager
                  </label>
                  <input
                    type="text"
                    name="manager"
                    value={editFormData.manager}
                    onChange={handleEditFormChange}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      editFormErrors.manager ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter manager name"
                  />
                  {editFormErrors.manager && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {editFormErrors.manager}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={editFormData.deadline}
                    onChange={handleEditFormChange}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      editFormErrors.deadline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {editFormErrors.deadline && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {editFormErrors.deadline}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    {isUpdating ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Update</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Project
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete "{project.name}"? This action cannot be undone.
                </p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Part Modal */}
      <AnimatePresence>
        {showAddPartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('projects.createPartTitle')}
                </h3>
                <button
                  onClick={() => setShowAddPartModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('projects.partName')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter part name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('projects.partDescription')}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter part description (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('projects.partWeight')}
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleFormChange}
                    min="1"
                    max="100"
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      formErrors.weight ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter weight (1-100)"
                  />
                  {formErrors.weight && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.weight}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('projects.partProgress')}
                  </label>
                  <input
                    type="number"
                    name="progress"
                    value={formData.progress}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter initial progress (0-100)"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPartModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    {isCreating ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>{t('projects.creatingPart')}</span>
                      </>
                    ) : (
                      <span>{t('projects.addPart')}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProjectDetail 