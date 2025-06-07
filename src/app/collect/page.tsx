'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Camera, Save, Wifi, WifiOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'

// Radico Brand Catalog (17 variants) - CORRECTED TO MATCH YOUR ACTUAL BRANDS
const RADICO_BRANDS = [
  // 8PM FAMILY (5 variants)
  { id: '8pm-black-750', name: '8 PM BLACK', size: '750', category: '8PM', fullName: '8 PM BLACK 750' },
  { id: '8pm-black-375', name: '8 PM BLACK', size: '375', category: '8PM', fullName: '8 PM BLACK 375' },
  { id: '8pm-black-180p', name: '8 PM BLACK', size: '180 P', category: '8PM', fullName: '8 PM BLACK 180 P' },
  { id: '8pm-black-90', name: '8 PM BLACK', size: '90', category: '8PM', fullName: '8 PM BLACK 90' },
  { id: '8pm-black-60p', name: '8 PM BLACK', size: '60 P', category: '8PM', fullName: '8 PM BLACK 60 P' },
  
  // VERVE LEMON LUSH FAMILY (3 variants)
  { id: 'verve-lemon-lush-750', name: 'VERVE LEMON LUSH', size: '750', category: 'VERVE', fullName: 'VERVE LEMON LUSH 750' },
  { id: 'verve-lemon-lush-375', name: 'VERVE LEMON LUSH', size: '375', category: 'VERVE', fullName: 'VERVE LEMON LUSH 375' },
  { id: 'verve-lemon-lush-180', name: 'VERVE LEMON LUSH', size: '180', category: 'VERVE', fullName: 'VERVE LEMON LUSH 180' },
  
  // VERVE GRAIN FAMILY (3 variants)
  { id: 'verve-grain-750', name: 'VERVE GRAIN', size: '750', category: 'VERVE', fullName: 'VERVE GRAIN 750' },
  { id: 'verve-grain-375', name: 'VERVE GRAIN', size: '375', category: 'VERVE', fullName: 'VERVE GRAIN 375' },
  { id: 'verve-grain-180', name: 'VERVE GRAIN', size: '180', category: 'VERVE', fullName: 'VERVE GRAIN 180' },
  
  // VERVE CRANBERRY FAMILY (3 variants)
  { id: 'verve-cranberry-750', name: 'VERVE CRANBERRY', size: '750', category: 'VERVE', fullName: 'VERVE CRANBERRY 750' },
  { id: 'verve-cranberry-375', name: 'VERVE CRANBERRY', size: '375', category: 'VERVE', fullName: 'VERVE CRANBERRY 375' },
  { id: 'verve-cranberry-180', name: 'VERVE CRANBERRY', size: '180', category: 'VERVE', fullName: 'VERVE CRANBERRY 180' },
  
  // VERVE GREEN APPLE FAMILY (3 variants)
  { id: 'verve-green-apple-750', name: 'VERVE GREEN APPLE', size: '750', category: 'VERVE', fullName: 'VERVE GREEN APPLE 750' },
  { id: 'verve-green-apple-375', name: 'VERVE GREEN APPLE', size: '375', category: 'VERVE', fullName: 'VERVE GREEN APPLE 375' },
  { id: 'verve-green-apple-180', name: 'VERVE GREEN APPLE', size: '180', category: 'VERVE', fullName: 'VERVE GREEN APPLE 180' }
]

// Brand family mapping to match your dashboard system
const getBrandFamily = (brandName: string): '8PM' | 'VERVE' | 'Unknown' => {
  const cleanBrand = brandName.toUpperCase().trim();
  
  if (cleanBrand.includes('8 PM') || cleanBrand.includes('8PM')) {
    return '8PM';
  } else if (cleanBrand.includes('VERVE')) {
    return 'VERVE';
  }
  
  return 'Unknown';
};

// Normalize brand name to match your Google Sheets format
const normalizeBrandForSheets = (brandName: string): string => {
  // This function ensures the brand name matches your existing sheet structure
  const family = getBrandFamily(brandName);
  
  // For your Google Sheets integration, we keep the exact format
  // that matches your current "Radico Visit Final" sheet structure
  return brandName;
};

interface InventoryEntry {
  brandId: string
  quantity: number
  price: number
  stockLevel: 'high' | 'medium' | 'low' | 'out'
}

interface CollectionData {
  id: string
  timestamp: string
  storeName: string
  storeAddress: string
  location: {
    latitude?: number
    longitude?: number
  }
  inventory: InventoryEntry[]
  notes: string
  photos: string[]
  agentName: string
  synced: boolean
}

export default function CollectPage() {
  const [isOnline, setIsOnline] = useState(true)
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<Partial<CollectionData>>({
    storeName: '',
    storeAddress: '',
    location: {},
    inventory: [],
    notes: '',
    photos: [],
    agentName: 'Field Agent', // TODO: Get from login
    synced: false
  })

  const [selectedBrand, setSelectedBrand] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [stockLevel, setStockLevel] = useState<'high' | 'medium' | 'low' | 'out'>('medium')

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }))
        },
        (error) => console.log('Location access denied:', error)
      )
    }
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const addInventoryItem = () => {
    if (!selectedBrand || !quantity) return

    const selectedBrandInfo = RADICO_BRANDS.find(b => b.id === selectedBrand);
    if (!selectedBrandInfo) return;

    const newItem: InventoryEntry = {
      brandId: selectedBrandInfo.fullName, // Use the full name that matches your sheets
      quantity: parseInt(quantity),
      price: parseFloat(price) || 0,
      stockLevel: stockLevel
    }

    setFormData(prev => ({
      ...prev,
      inventory: [...(prev.inventory || []), newItem]
    }))

    // Reset form
    setSelectedBrand('')
    setQuantity('')
    setPrice('')
    setStockLevel('medium')
  }

  const removeInventoryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inventory: prev.inventory?.filter((_, i) => i !== index) || []
    }))
  }

  const saveData = async () => {
    const collectionData: CollectionData = {
      id: `collection_${Date.now()}`,
      timestamp: new Date().toISOString(),
      storeName: formData.storeName || '',
      storeAddress: formData.storeAddress || '',
      location: formData.location || {},
      inventory: formData.inventory || [],
      notes: formData.notes || '',
      photos: formData.photos || [],
      agentName: formData.agentName || 'Field Agent',
      synced: false
    }

    try {
      if (isOnline) {
        // TODO: Send to Google Sheets with 17-row structure matching your "Radico Visit Final" sheet
        // Each brand variant should create a separate row to match your existing dashboard system
        console.log('Sending to Google Sheets:', collectionData)
        console.log('Brand family breakdown:', collectionData.inventory.map(item => ({
          brand: item.brandId,
          family: getBrandFamily(item.brandId),
          normalized: normalizeBrandForSheets(item.brandId)
        })))
        collectionData.synced = true
      } else {
        // Save offline
        const existing = localStorage.getItem('pendingRadicoEntries')
        const pending = existing ? JSON.parse(existing) : []
        pending.push(collectionData)
        localStorage.setItem('pendingRadicoEntries', JSON.stringify(pending))
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // Reset form
      setFormData({
        storeName: '',
        storeAddress: '',
        location: currentLocation ? { latitude: currentLocation.lat, longitude: currentLocation.lng } : {},
        inventory: [],
        notes: '',
        photos: [],
        agentName: 'Field Agent',
        synced: false
      })

    } catch (error) {
      console.error('Error saving data:', error)
      // TODO: Show error message
    }
  }

  const getBrandName = (brandId: string) => {
    const brand = RADICO_BRANDS.find(b => b.id === brandId)
    return brand ? brand.fullName : brandId
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Collect Data</h1>
          <div className={`flex items-center text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500 text-white px-4 py-3 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Data saved successfully! {isOnline ? 'Synced to cloud.' : 'Saved offline.'}
        </div>
      )}

      <div className="p-4 space-y-6">
        
        {/* Store Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.storeName}
                onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                placeholder="Enter store name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
              <textarea
                className="form-input h-20 resize-none"
                value={formData.storeAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, storeAddress: e.target.value }))}
                placeholder="Enter store address"
              />
            </div>
            
            {currentLocation && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                Location captured: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </div>
            )}
          </div>
        </div>

        {/* Add Inventory Items */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Inventory</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <select
                className="form-input"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                required
              >
                <option value="">Select a brand...</option>
                {RADICO_BRANDS.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.fullName} - {brand.category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Level</label>
              <select
                className="form-input"
                value={stockLevel}
                onChange={(e) => setStockLevel(e.target.value as any)}
              >
                <option value="high">High Stock</option>
                <option value="medium">Medium Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            
            <button
              onClick={addInventoryItem}
              className="btn-primary w-full"
              disabled={!selectedBrand || !quantity}
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Current Inventory List */}
        {formData.inventory && formData.inventory.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Inventory ({formData.inventory.length} items)</h2>
            
            <div className="space-y-3">
              {formData.inventory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.brandId}</div>
                    <div className="text-sm text-gray-600">
                      Qty: {item.quantity} • ₹{item.price || 'N/A'} • {item.stockLevel} stock
                    </div>
                  </div>
                  <button
                    onClick={() => removeInventoryItem(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
          <textarea
            className="form-input h-24 resize-none"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Any additional observations, competitor info, customer feedback, etc."
          />
        </div>

        {/* Save Button */}
        <div className="space-y-4">
          <button
            onClick={saveData}
            className="btn-primary w-full flex items-center justify-center"
            disabled={!formData.storeName || !formData.inventory?.length}
          >
            <Save className="w-5 h-5 mr-2" />
            Save Data {isOnline ? '(Sync to Cloud)' : '(Save Offline)'}
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            {isOnline 
              ? 'Data will be immediately synced to Google Sheets' 
              : 'Data will be saved locally and synced when you\'re back online'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
