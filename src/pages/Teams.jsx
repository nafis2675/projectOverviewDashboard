import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
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
  Trash2,
  X,
  Save,
  AlertCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const Teams = () => {
  const { t } = useTranslation()
  const { teams, members, projects, role, addNotification, deleteTeam, addTeam } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    lead: '',
    deadline: '',
    projectId: '',
    selectedMembers: []
  })
  const [formErrors, setFormErrors] = useState({})

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.lead.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteTeam = (teamId) => {
    deleteTeam(teamId)
    addNotification({
      type: 'success',
      title: t('notifications.success'),
      message: t('notifications.teamDeleted')
    })
  }

  const handleEditTeam = (team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      lead: team.lead,
      deadline: team.deadline,
      projectId: team.projectId || '',
      selectedMembers: team.members || []
    })
    setFormErrors({})
    setShowEditModal(true)
  }

  const handleUpdateTeam = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsUpdating(true)

    try {
      const updatedTeam = {
        ...editingTeam,
        name: formData.name.trim(),
        lead: formData.lead.trim(),
        deadline: formData.deadline,
        projectId: formData.projectId || null,
        members: formData.selectedMembers
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Here you would call updateTeam function from context
      addNotification({
        type: 'success',
        title: t('notifications.success'),
        message: t('notifications.teamUpdated')
      })

      setShowEditModal(false)
      setEditingTeam(null)
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('notifications.error'),
        message: 'Failed to update team. Please try again.'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = t('teams.requiredField')
    }
    
    if (!formData.lead.trim()) {
      errors.lead = t('teams.requiredField')
    }
    
    if (!formData.deadline) {
      errors.deadline = t('teams.requiredField')
    } else {
      const selectedDate = new Date(formData.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate <= today) {
        errors.deadline = t('teams.invalidDate')
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsCreating(true)

    try {
      // Create new team with proper structure
      const newTeam = {
        id: Math.max(...teams.map(t => t.id), 0) + 1,
        name: formData.name.trim(),
        lead: formData.lead.trim(),
        deadline: formData.deadline,
        projectId: formData.projectId || null,
        members: formData.selectedMembers,
        progress: 0
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      addTeam(newTeam)
      
      addNotification({
        type: 'success',
        title: t('notifications.success'),
        message: t('notifications.teamCreated')
      })

      // Reset form and close modal
      setFormData({
        name: '',
        lead: '',
        deadline: '',
        projectId: '',
        selectedMembers: []
      })
      setFormErrors({})
      setShowAddModal(false)
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('notifications.error'),
        message: 'Failed to create team. Please try again.'
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleMemberSelection = (memberId) => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(memberId)
        ? prev.selectedMembers.filter(id => id !== memberId)
        : [...prev.selectedMembers, memberId]
    }))
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
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
              onClick={() => setShowAddModal(true)}
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
            placeholder={`${t('common.search')} teams...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </motion.div>

        {/* Teams Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <motion.div
              key={team.id}
              whileHover={{ y: -5 }}
              className="card group"
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
                    {t('teams.progress')}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {clamp(team.progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${clamp(team.progress)}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${clamp(team.progress)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Team Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{team.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Active</span>
                  </div>
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
                    <button 
                      onClick={() => alert('Edit functionality coming soon!')}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
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
          ))}
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

      {/* Add Team Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('teams.createTeamTitle')}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Team Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('teams.teamName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter team name"
                  />
                  {formErrors.name && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.name}
                    </div>
                  )}
                </div>

                {/* Team Lead */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('teams.teamLeadName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.lead}
                    onChange={(e) => handleInputChange('lead', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.lead ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter team lead name"
                  />
                  {formErrors.lead && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.lead}
                    </div>
                  )}
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('teams.teamDeadline')} *
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formErrors.deadline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {formErrors.deadline && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.deadline}
                    </div>
                  )}
                </div>

                {/* Project Assignment */}
                {projects.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('teams.selectProject')} (Optional)
                    </label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => handleInputChange('projectId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select a project...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Member Selection */}
                {members.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('teams.selectMembers')}
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {members.map((member) => (
                        <label key={member.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selectedMembers.includes(member.id)}
                            onChange={() => handleMemberSelection(member.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {member.name} ({member.role})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isCreating}
                    whileHover={{ scale: isCreating ? 1 : 1.05 }}
                    whileTap={{ scale: isCreating ? 1 : 0.95 }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t('teams.creating')}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{t('common.save')}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Teams 