import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const LoadingSpinner = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400 rounded-full mx-auto mb-4"
        />
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          {t('common.loading')}
        </p>
      </div>
    </div>
  )
}

export default LoadingSpinner 