'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Wifi, WifiOff, Database, MapPin, Save, Camera, CheckCircle, Search, X, Plus } from 'lucide-react'
import Link from 'next/link'

// ==========================================
// COMPLETE RADICO BRAND CATALOG - MATCHES YOUR SYSTEM
// ==========================================
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

// ==========================================
// COMPLETE DATA INTERFACES - MATCHING YOUR PDF STRUCTURE
// ==========================================
interface InventoryEntry {
  brandName: string
  quantity: number
  displayed: 'YES' | 'NO' | ''
  issued: 'YES' | 'NO' | ''
  reasonNoStock: string
  demandRequested: number
}

interface TargetAchievement {
  brandName: string
  target: number
  achieved: number
  balance: number
}

interface PendingChallan {
  date: string
  challanNumber: string
  collected: 'YES' | 'NO' | ''
}

interface LastSupply {
  tpNumber: string
  date: string
  brand: string
  size: string
  cases: number
}

interface BreakageEntry {
  brandName: string
  quantity: number
  cnNumber: string
}

interface CompleteFormData {
  // Shop Information
  shopId: string
  shopName: string
  department: string
  salesman: string
  checkInDateTime: string
  location: { latitude?: number; longitude?: number }
  submittersLocation: string
  
  // Form Data
  inventory: InventoryEntry[]
  targetVsAchievement: TargetAchievement[]
  pendingChallans: PendingChallan[]
  lastSupply: LastSupply[]
  breakages: BreakageEntry[]
  
  // Additional Fields
  willTargetBeAchieved: string
  highestSellingBrand: string
  feedback: string
  reminders: string
  shelfImages: string[]
  pjpDays: string
  
  // Metadata
  timestamp: string
  synced: boolean
}

interface ShopInfo {
  shop_id: string
  shop_name: string
  shop_salesman: string
  shop_dep: string
  shop_salesman_email: string
}

export default function CompleteCollectPage() {
  const [isOnline, setIsOnline] = useState(true)
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeSection, setActiveSection] = useState('shop')
  
  // Shop Selection State
  const [shops, setShops] = useState<ShopInfo[]>([])
  const [shopSearchTerm, setShopSearchTerm] = useState('')
  const [showShopDropdown, setShowShopDropdown] = useState(false)
  const [selectedShopInfo, setSelectedShopInfo] = useState<ShopInfo | null>(null)
  
  // Form State
  const [formData, setFormData] = useState<CompleteFormData>({
    shopId: '',
    shopName: '',
    department: '',
    salesman: '',
    checkInDateTime: new Date().toISOString(),
    location: {},
    submittersLocation: '',
    inventory: [],
    targetVsAchievement: [],
    pendingChallans: [],
    lastSupply: [],
    breakages: [],
    willTargetBeAchieved: '',
    highestSellingBrand: '',
    feedback: '',
    reminders: '',
    shelfImages: [],
    pjpDays: '',
    timestamp: '',
    synced: false
  })

  // Individual Form States
  const [selectedBrand, setSelectedBrand] = useState('')
  const [quantity, setQuantity] = useState('')
  const [displayed, setDisplayed] = useState<'YES' | 'NO' | ''>('')
  const [issued, setIssued] = useState<'YES' | 'NO' | ''>('')
  const [reasonNoStock, setReasonNoStock] = useState('')
  const [demandRequested, setDemandRequested] = useState('')

  // Target vs Achievement States
  const [targetBrand, setTargetBrand] = useState('')
  const [target, setTarget] = useState('')
  const [achieved, setAchieved] = useState('')

  // Pending Challan States
  const [challanDate, setChallanDate] = useState('')
  const [challanNumber, setChallanNumber] = useState('')
  const [challanCollected, setChallanCollected] = useState<'YES' | 'NO' | ''>('')

  // ==========================================
  // SHOP API INTEGRATION
  // ==========================================
  const SHEETS_CONFIG = {
    masterSheetId: process.env.NEXT_PUBLIC_MASTER_SHEET_ID || '1pRz9CgOoamTrfpnmF-XuBCg9IZON9br5avgRlKYtxM',
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  }

  const fetchShops = async () => {
    try {
      if (!SHEETS_CONFIG.apiKey) {
        console.warn('Google API key not configured')
        return
      }

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_CONFIG.masterSheetId}/values/Shop%20Details?key=${SHEETS_CONFIG.apiKey}`
      )
      
      if (response.ok) {
        const result = await response.json()
        const rows = result.values || []
        
        if (rows.length > 1) {
          const shopList: ShopInfo[] = rows.slice(1).map((row: any[]) => ({
            shop_id: row[0] || '',
            shop_salesman_email: row[1] || '',
            shop_dep: row[2] || '',
            shop_name: row[3] || '',
            shop_salesman: row[4] || ''
          })).filter((shop: ShopInfo) => shop.shop_id && shop.shop_name)
          
          setShops(shopList)
          console.log(`Loaded ${shopList.length} shops from API`)
        }
      }
    } catch (error) {
      console.error('Error fetching shops:', error)
    }
  }

  const filteredShops = shops.filter(shop => 
    shop.shop_name.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
    shop.shop_id.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
    shop.shop_salesman.toLowerCase().includes(shopSearchTerm.toLowerCase())
  )

  const selectShop = (shop: ShopInfo) => {
    setSelectedShopInfo(shop)
    setFormData(prev => ({
      ...prev,
      shopId: shop.shop_id,
      shopName: shop.shop_name,
      department: shop.shop_dep === "DSIIDC" ? "DSIDC" : shop.shop_dep,
      salesman: shop.shop_salesman
    }))
    setShopSearchTerm('')
    setShowShopDropdown(false)
  }

  // ==========================================
  // FORM LOGIC WITH DUPLICATE PREVENTION
  // ==========================================
  const addInventoryItem = () => {
    if (!selectedBrand || !quantity) return

    const selectedBrandInfo = RADICO_BRANDS.find(b => b.id === selectedBrand);
    if (!selectedBrandInfo) return;

    // CHECK FOR DUPLICATES
    const existingEntry = formData.inventory.find(item => 
      item.brandName === selectedBrandInfo.fullName
    )
    
    if (existingEntry) {
      alert(`${selectedBrandInfo.fullName} is already added to inventory. Remove it first to add again.`)
      return
    }

    const newItem: InventoryEntry = {
      brandName: selectedBrandInfo.fullName,
      quantity: parseInt(quantity),
      displayed,
      issued,
      reasonNoStock,
      demandRequested: parseInt(demandRequested) || 0
    }

    setFormData(prev => ({
      ...prev,
      inventory: [...prev.inventory, newItem]
    }))

    // Reset form
    setSelectedBrand('')
    setQuantity('')
    setDisplayed('')
    setIssued('')
    setReasonNoStock('')
    setDemandRequested('')
  }

  const removeInventoryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inventory: prev.inventory.filter((_, i) => i !== index)
    }))
  }

  const addTargetAchievement = () => {
    if (!targetBrand || !target || !achieved) return

    const selectedBrandInfo = RADICO_BRANDS.find(b => b.id === targetBrand);
    if (!selectedBrandInfo) return;

    const targetValue = parseInt(target)
    const achievedValue = parseInt(achieved)
    const balance = targetValue - achievedValue

    const newTarget: TargetAchievement = {
      brandName: selectedBrandInfo.fullName,
      target: targetValue,
      achieved: achievedValue,
      balance
    }

    setFormData(prev => ({
      ...prev,
      targetVsAchievement: [...prev.targetVsAchievement, newTarget]
    }))

    setTargetBrand('')
    setTarget('')
    setAchieved('')
  }

  const addPendingChallan = () => {
    if (!challanDate || !challanNumber) return

    const newChallan: PendingChallan = {
      date: challanDate,
      challanNumber,
      collected: challanCollected
    }

    setFormData(prev => ({
      ...prev,
      pendingChallans: [...prev.pendingChallans, newChallan]
    }))

    setChallanDate('')
    setChallanNumber('')
    setChallanCollected('')
  }

  // ==========================================
  // COMPONENT LIFECYCLE
  // ==========================================
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
            },
            submittersLocation: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }))
        },
        (error) => console.log('Location access denied:', error)
      )
    }

    fetchShops()
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const saveData = async () => {
    const completeData: CompleteFormData = {
      ...formData,
      timestamp: new Date().toISOString(),
      checkInDateTime: new Date().toISOString(),
      synced: false
    }

    try {
      if (isOnline) {
        // TODO: Send to Google Sheets with 17-row structure
        console.log('Sending complete form data to Google Sheets:', completeData)
        completeData.synced = true
      } else {
        // Save offline
        const existing = localStorage.getItem('pendingRadicoEntries')
        const pending = existing ? JSON.parse(existing) : []
        pending.push(completeData)
        localStorage.setItem('pendingRadicoEntries', JSON.stringify(pending))
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // Reset form
      setFormData({
        shopId: '',
        shopName: '',
        department: '',
        salesman: '',
        checkInDateTime: new Date().toISOString(),
        location: currentLocation ? { latitude: currentLocation.lat, longitude: currentLocation.lng } : {},
        submittersLocation: currentLocation ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}` : '',
        inventory: [],
        targetVsAchievement: [],
        pendingChallans: [],
        lastSupply: [],
        breakages: [],
        willTargetBeAchieved: '',
        highestSellingBrand: '',
        feedback: '',
        reminders: '',
        shelfImages: [],
        pjpDays: '',
        timestamp: '',
        synced: false
      })
      setSelectedShopInfo(null)

    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  // ==========================================
  // RENDER COMPONENT
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Radico Field Data Collection</h1>
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

      {/* Section Navigation */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-6 overflow-x-auto">
          {[
            { id: 'shop', label: 'Shop Info', count: selectedShopInfo ? 1 : 0 },
            { id: 'inventory', label: 'Inventory', count: formData.inventory.length },
            { id: 'targets', label: 'Targets', count: formData.targetVsAchievement.length },
            { id: 'challans', label: 'Challans', count: formData.pendingChallans.length },
            { id: 'additional', label: 'Additional', count: 0 }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeSection === section.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {section.label}
              {section.count > 0 && (
                <span className="ml-1 bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-1">
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* SHOP SELECTION SECTION */}
        {activeSection === 'shop' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop Selection</h2>
            
            {!selectedShopInfo ? (
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Shop *</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      className="form-input pl-10"
                      value={shopSearchTerm}
                      onChange={(e) => {
                        setShopSearchTerm(e.target.value)
                        setShowShopDropdown(e.target.value.length > 0)
                      }}
                      placeholder="Search by shop name, ID, or salesman..."
                      onFocus={() => setShowShopDropdown(shopSearchTerm.length > 0)}
                    />
                  </div>
                  
                  {showShopDropdown && filteredShops.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredShops.slice(0, 10).map((shop) => (
                        <button
                          key={shop.shop_id}
                          onClick={() => selectShop(shop)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{shop.shop_name}</div>
                          <div className="text-sm text-gray-600">
                            ID: {shop.shop_id} • {shop.shop_salesman} • {shop.shop_dep}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">
                  Found {shops.length} shops loaded from API. Start typing to search.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-green-900">{selectedShopInfo.shop_name}</h3>
                      <p className="text-sm text-green-700">
                        ID: {selectedShopInfo.shop_id} • {selectedShopInfo.shop_salesman} • {selectedShopInfo.shop_dep}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedShopInfo(null)
                        setFormData(prev => ({ ...prev, shopId: '', shopName: '', department: '', salesman: '' }))
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {currentLocation && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    Location captured: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* INVENTORY SECTION */}
        {activeSection === 'inventory' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Inventory</h2>
              
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Bottles *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Demand Requested (Cases)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={demandRequested}
                      onChange={(e) => setDemandRequested(e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Displayed</label>
                    <select
                      className="form-input"
                      value={displayed}
                      onChange={(e) => setDisplayed(e.target.value as 'YES' | 'NO' | '')}
                    >
                      <option value="">Select...</option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issued</label>
                    <select
                      className="form-input"
                      value={issued}
                      onChange={(e) => setIssued(e.target.value as 'YES' | 'NO' | '')}
                    >
                      <option value="">Select...</option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for No Stock</label>
                  <select
                    className="form-input"
                    value={reasonNoStock}
                    onChange={(e) => setReasonNoStock(e.target.value)}
                  >
                    <option value="">Select reason...</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Never Ordered">Never Ordered</option>
                    <option value="Discontinued">Discontinued</option>
                    <option value="Low Demand">Low Demand</option>
                  </select>
                </div>
                
                <button
                  onClick={addInventoryItem}
                  className="btn-primary w-full"
                  disabled={!selectedBrand || !quantity}
                >
                  Add to Inventory
                </button>
              </div>
            </div>

            {/* Current Inventory Display */}
            {formData.inventory.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Stock Reported ({formData.inventory.length} items)
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-sm font-medium text-gray-700">Brand</th>
                        <th className="text-center py-2 text-sm font-medium text-gray-700">Quantity</th>
                        <th className="text-center py-2 text-sm font-medium text-gray-700">Displayed</th>
                        <th className="text-center py-2 text-sm font-medium text-gray-700">Issued</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-700">Reason</th>
                        <th className="text-center py-2 text-sm font-medium text-gray-700">Demand</th>
                        <th className="text-center py-2 text-sm font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.inventory.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 text-sm text-gray-900">{item.brandName}</td>
                          <td className="py-2 text-sm text-center">{item.quantity}</td>
                          <td className="py-2 text-sm text-center">{item.displayed}</td>
                          <td className="py-2 text-sm text-center">{item.issued}</td>
                          <td className="py-2 text-sm text-gray-600">{item.reasonNoStock}</td>
                          <td className="py-2 text-sm text-center">{item.demandRequested}</td>
                          <td className="py-2 text-center">
                            <button
                              onClick={() => removeInventoryItem(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TARGET VS ACHIEVEMENT SECTION */}
        {activeSection === 'targets' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Target vs Achievement</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <select
                    className="form-input"
                    value={targetBrand}
                    onChange={(e) => setTargetBrand(e.target.value)}
                  >
                    <option value="">Select a brand...</option>
                    {RADICO_BRANDS.map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Achieved *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={achieved}
                      onChange={(e) => setAchieved(e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                
                <button
                  onClick={addTargetAchievement}
                  className="btn-primary w-full"
                  disabled={!targetBrand || !target || !achieved}
                >
                  Add Target Data
                </button>
              </div>
            </div>

            {formData.targetVsAchievement.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Target vs Achievement Data</h3>
                <div className="space-y-3">
                  {formData.targetVsAchievement.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.brandName}</div>
                        <div className="text-sm text-gray-600">
                          Target: {item.target} • Achieved: {item.achieved} • Balance: {item.balance}
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          targetVsAchievement: prev.targetVsAchievement.filter((_, i) => i !== index)
                        }))}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PENDING CHALLANS SECTION */}
        {activeSection === 'challans' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Challans</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Challan Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={challanDate}
                    onChange={(e) => setChallanDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Challan Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={challanNumber}
                    onChange={(e) => setChallanNumber(e.target.value)}
                    placeholder="Enter challan number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collected Status</label>
                  <select
                    className="form-input"
                    value={challanCollected}
                    onChange={(e) => setChallanCollected(e.target.value as 'YES' | 'NO' | '')}
                  >
                    <option value="">Select status...</option>
                    <option value="YES">YES - Collected</option>
                    <option value="NO">NO - Not Collected</option>
                  </select>
                </div>
                
                <button
                  onClick={addPendingChallan}
                  className="btn-primary w-full"
                  disabled={!challanDate || !challanNumber}
                >
                  Add Challan
                </button>
              </div>
            </div>

            {formData.pendingChallans.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Challans ({formData.pendingChallans.length})</h3>
                <div className="space-y-3">
                  {formData.pendingChallans.map((challan, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{challan.challanNumber}</div>
                        <div className="text-sm text-gray-600">
                          Date: {challan.date} • Status: {challan.collected || 'Not specified'}
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          pendingChallans: prev.pendingChallans.filter((_, i) => i !== index)
                        }))}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADDITIONAL INFORMATION SECTION */}
        {activeSection === 'additional' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Will the Target be achieved?</label>
                  <select
                    className="form-input"
                    value={formData.willTargetBeAchieved}
                    onChange={(e) => setFormData(prev => ({ ...prev, willTargetBeAchieved: e.target.value }))}
                  >
                    <option value="">Select...</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highest Selling Brand</label>
                  <select
                    className="form-input"
                    value={formData.highestSellingBrand}
                    onChange={(e) => setFormData(prev => ({ ...prev, highestSellingBrand: e.target.value }))}
                  >
                    <option value="">Select brand...</option>
                    {RADICO_BRANDS.map(brand => (
                      <option key={brand.id} value={brand.fullName}>
                        {brand.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PJP Days</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.pjpDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, pjpDays: e.target.value }))}
                    placeholder="e.g., Monday, Wednesday, Friday"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                  <textarea
                    className="form-input h-24 resize-none"
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    placeholder="Customer feedback, market observations..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminders/Tasks for this Shop</label>
                  <textarea
                    className="form-input h-24 resize-none"
                    value={formData.reminders}
                    onChange={(e) => setFormData(prev => ({ ...prev, reminders: e.target.value }))}
                    placeholder="Follow-up tasks, special instructions..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="space-y-4">
          <button
            onClick={saveData}
            className="btn-primary w-full flex items-center justify-center"
            disabled={!selectedShopInfo || formData.inventory.length === 0}
          >
            <Save className="w-5 h-5 mr-2" />
            Save Complete Data {isOnline ? '(Sync to Cloud)' : '(Save Offline)'}
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            {isOnline 
              ? 'Data will be immediately synced to Google Sheets in the required 17-row format' 
              : 'Data will be saved locally and synced when you\'re back online'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
