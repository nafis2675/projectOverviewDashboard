import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  User, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Circle,
  Play,
  Pause,
  MoreHorizontal,
  Edit3,
  Trash2,
  MessageSquare,
  History
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const TaskCard = ({ task, onEdit, onDelete, showActions = true }) => {
  const { t } = useTranslation()
  const { members, updateTaskProgress, role } = useApp()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false)

  const assignedToUser = members.find(m => m.id === task.assigned_to)
  const assignedByUser = members.find(m => m.id === task.assigned_by)
  const currentUser = members.find(m => m.role === role)

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    high: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    urgent: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
  }

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Circle size={16} />
      case 'in_progress':
        return <Play size={16} />
      case 'completed':
        return <CheckCircle size={16} />
      case 'cancelled':
        return <Pause size={16} />
      default:
        return <Circle size={16} />
    }
  }

  const isOverdue = () => {
    if (!task.deadline) return false
    const today = new Date()
    const deadline = new Date(task.deadline)
    return deadline < today && task.status !== 'completed'
  }

  const getDaysUntilDeadline = () => {
    if (!task.deadline) return null
    const today = new Date()
    const deadline = new Date(task.deadline)
    const diffTime = deadline - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleProgressUpdate = async (newProgress) => {
    if (currentUser?.id !== task.assigned_to) return
    
    setIsUpdatingProgress(true)
    try {
      await updateTaskProgress(task.id, newProgress)
    } catch (error) {
      console.error('Failed to update progress:', error)
    } finally {
      setIsUpdatingProgress(false)
    }
  }

  const canEdit = role === 'manager' || role === 'teamLead' || currentUser?.id === task.assigned_by
  const canUpdateProgress = currentUser?.id === task.assigned_to
  const daysUntilDeadline = getDaysUntilDeadline()

  return (
    <motion.div 
      layout
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
        isOverdue() ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryIcons[task.category]}</span>
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {task.title}
          </h3>
        </div>
        
        {showActions && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                {canEdit && (
                  <button
                    onClick={() => {
                      onEdit(task)
                      setShowDropdown(false)
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit3 size={14} />
                    {t('task.edit')}
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <MessageSquare size={14} />
                  {t('task.comments')}
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <History size={14} />
                  {t('task.history')}
                </button>
                {canEdit && (
                  <button
                    onClick={() => {
                      onDelete(task.id)
                      setShowDropdown(false)
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    {t('task.delete')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Status and Priority */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {getStatusIcon(task.status)}
          {t(`task.status.${task.status}`)}
        </span>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
          {t(`task.priorities.${task.priority}`)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('task.progress')}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {task.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          />
        </div>
        
        {/* Progress Update Controls */}
        {canUpdateProgress && task.status !== 'completed' && (
          <div className="mt-2 flex gap-1">
            {[0, 25, 50, 75, 100].map(progress => (
              <button
                key={progress}
                onClick={() => handleProgressUpdate(progress)}
                disabled={isUpdatingProgress}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  task.progress === progress
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {progress}%
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-gray-500 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">{t('task.assignedTo')}:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {assignedToUser?.name || t('task.unknownUser')}
          </span>
        </div>
        
        {assignedByUser && (
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{t('task.assignedBy')}:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {assignedByUser.name} ({assignedByUser.role})
            </span>
          </div>
        )}
      </div>

      {/* Deadline Info */}
      {task.deadline && (
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className={isOverdue() ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} />
          <span className={`${isOverdue() ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {t('task.deadline')}:
          </span>
          <span className={`font-medium ${isOverdue() ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {new Date(task.deadline).toLocaleDateString()}
          </span>
          
          {daysUntilDeadline !== null && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              isOverdue() 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                : daysUntilDeadline <= 3
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            }`}>
              {isOverdue() 
                ? t('task.overdue', { days: Math.abs(daysUntilDeadline) })
                : daysUntilDeadline === 0
                  ? t('task.dueToday')
                  : t('task.daysLeft', { days: daysUntilDeadline })
              }
            </span>
          )}
        </div>
      )}

      {/* Estimated Hours */}
      {task.estimated_hours && (
        <div className="flex items-center gap-2 text-sm mt-2">
          <Clock size={14} className="text-gray-500 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">{t('task.estimatedHours')}:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {task.estimated_hours}h
          </span>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {task.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default TaskCard 