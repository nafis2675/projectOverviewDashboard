import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle,
  Target,
  FileText,
  Tag,
  Zap
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const TaskAssignmentModal = ({ isOpen, onClose, projectId, projectPartId = null, initialData = null }) => {
  const { t } = useTranslation()
  const { members, projects, createTask, updateTask, role, addNotification } = useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    assignedTo: initialData?.assigned_to || '',
    priority: initialData?.priority || 'medium',
    category: initialData?.category || 'development',
    deadline: initialData?.deadline || '',
    estimatedHours: initialData?.estimated_hours || '',
    tags: initialData?.tags || []
  })
  const [errors, setErrors] = useState({})
  const [newTag, setNewTag] = useState('')

  const project = projects.find(p => p.id === projectId)
  const availableMembers = members.filter(m => 
    m.role !== 'manager' && (role === 'manager' || m.teamId === getCurrentUser()?.teamId)
  )

  const getCurrentUser = () => {
    return members.find(m => m.role === role)
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200'
  }

  const categoryIcons = {
    development: '💻',
    design: '🎨',
    testing: '🧪',
    documentation: '📝',
    meeting: '🤝',
    review: '👀',
    general: '📋'
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = t('task.errors.titleRequired')
    }
    
    if (!formData.assignedTo) {
      newErrors.assignedTo = t('task.errors.assigneeRequired')
    }
    
    if (!formData.deadline) {
      newErrors.deadline = t('task.errors.deadlineRequired')
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = t('task.errors.deadlineInPast')
    }
    
    if (formData.estimatedHours && (formData.estimatedHours < 1 || formData.estimatedHours > 200)) {
      newErrors.estimatedHours = t('task.errors.invalidHours')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const currentUser = getCurrentUser()
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        project_id: projectId,
        project_part_id: projectPartId,
        assigned_to: formData.assignedTo,
        assigned_by: currentUser?.id,
        priority: formData.priority,
        category: formData.category,
        deadline: formData.deadline,
        estimated_hours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
        tags: formData.tags,
        status: 'pending',
        progress: 0
      }
      
      if (initialData) {
        await updateTask(initialData.id, taskData)
        addNotification({
          type: 'success',
          message: t('task.updated')
        })
      } else {
        await createTask(taskData)
        addNotification({
          type: 'success',
          message: t('task.assigned')
        })
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to save task:', error)
      addNotification({
        type: 'error',
        message: t('task.error')
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? t('task.edit') : t('task.assign')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Project Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Target size={16} />
                <span className="font-medium">{project?.name}</span>
              </div>
            </div>

            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('task.title')} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder={t('task.titlePlaceholder')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('task.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder={t('task.descriptionPlaceholder')}
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('task.assignTo')} *
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.assignedTo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">{t('task.selectAssignee')}</option>
                {availableMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.assignedTo}</p>
              )}
            </div>

            {/* Priority and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('task.priority')}
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">{t('task.priorities.low')}</option>
                  <option value="medium">{t('task.priorities.medium')}</option>
                  <option value="high">{t('task.priorities.high')}</option>
                  <option value="urgent">{t('task.priorities.urgent')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('task.category')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="development">{t('task.categories.development')}</option>
                  <option value="design">{t('task.categories.design')}</option>
                  <option value="testing">{t('task.categories.testing')}</option>
                  <option value="documentation">{t('task.categories.documentation')}</option>
                  <option value="meeting">{t('task.categories.meeting')}</option>
                  <option value="review">{t('task.categories.review')}</option>
                  <option value="general">{t('task.categories.general')}</option>
                </select>
              </div>
            </div>

            {/* Deadline and Estimated Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('task.deadline')} *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.deadline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deadline}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('task.estimatedHours')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.estimatedHours ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="8"
                />
                {errors.estimatedHours && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.estimatedHours}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('task.tags')}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={t('task.addTag')}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <Tag size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('common.saving')}
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    {initialData ? t('task.update') : t('task.assign')}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default TaskAssignmentModal 