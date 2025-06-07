'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Database, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingEntries, setPendingEntries] = useState(0)

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    // Check for pending offline entries
    const checkPendingEntries = () => {
      const stored = localStorage.getItem('pendingRadicoEntries')
      if (stored) {
        const entries = JSON.parse(stored)
        setPendingEntries(entries.length)
      }
    }
    
    checkPendingEntries()
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Status Bar */}
      <div className={`flex items-center justify-center py-2 text-sm font-medium ${
        isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 mr-2" />
            Online - Data syncing enabled
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 mr-2" />
            Offline - Data saved locally ({pendingEntries} pending)
          </>
        )}
      </div>

      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Radico Field
          </h1>
          <p className="text-gray-600 text-lg">
            Mobile Data Collection
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Offline-capable field sales data collection
          </p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-6 space-y-4">
        
        {/* Primary Action - Data Collection */}
        <Link href="/collect" className="block">
          <div className="card hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-600">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Collect Data
                </h3>
                <p className="text-gray-600 text-sm">
                  Record inventory, visits, and sales data
                </p>
              </div>
              <div className="text-blue-600 text-2xl">→</div>
            </div>
          </div>
        </Link>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-4">
          
          <Link href="/dashboard" className="block">
            <div className="card text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Dashboard</h4>
              <p className="text-xs text-gray-600 mt-1">View analytics</p>
            </div>
          </Link>
          
          <Link href="/login" className="block">
            <div className="card text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Profile</h4>
              <p className="text-xs text-gray-600 mt-1">User settings</p>
            </div>
          </Link>
          
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mt-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3">Today's Overview</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs text-blue-700">Visits</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-xs text-blue-700">Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">₹2.4L</div>
              <div className="text-xs text-blue-700">Sales</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pt-8 pb-6 text-center">
        <p className="text-xs text-gray-500">
          Radico Khaitan Field Sales © 2025
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Version 1.0.0 • PWA Enabled
        </p>
      </div>
    </div>
  )
}
