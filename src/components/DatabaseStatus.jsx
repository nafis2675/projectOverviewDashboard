import React from 'react'
import { useApp } from '../context/AppContext'
import { Database, WifiOff, Loader2 } from 'lucide-react'

const DatabaseStatus = () => {
  const { isConnected, loading, error } = useApp()

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">Connecting to database...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Database connection failed</span>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50 opacity-75 hover:opacity-100 transition-opacity">
        <Database className="w-4 h-4" />
        <span className="text-sm font-medium">Connected to Supabase</span>
      </div>
    )
  }

  return null
}

export default DatabaseStatus 