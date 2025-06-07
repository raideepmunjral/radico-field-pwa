
# 🚀 Radico Field PWA

**Mobile-first Progressive Web App for Radico Khaitan field sales data collection**

[![Deploy Status](https://img.shields.io/badge/Deploy-GitHub%20Pages-green)](https://raidepmunjal.github.io/radico-field-pwa/)
[![PWA](https://img.shields.io/badge/PWA-Ready-blue)](https://raidepmunjal.github.io/radico-field-pwa/)
[![Offline](https://img.shields.io/badge/Offline-Capable-orange)](https://raidepmunjal.github.io/radico-field-pwa/)

## 📱 Overview

This PWA replaces failing Zoho Forms with a reliable, offline-capable mobile data collection system for Radico Khaitan field sales teams. It maintains complete compatibility with existing Google Sheets backend and dashboard analytics.

### 🎯 Key Features

- **📱 Mobile-First Design** - Optimized for field staff tablets and smartphones
- **🔄 Offline Capability** - Works without internet, syncs when connection restored
- **📊 17-Brand Inventory** - Complete SKU collection for 8PM and VERVE families
- **📈 Target Tracking** - Target vs Achievement data collection
- **🧾 Challan Management** - Pending challan collection tracking
- **📸 Photo Upload** - 4 shelf images per visit
- **📍 Location Capture** - Automatic GPS location logging
- **⚡ Auto-Sync** - Intelligent background synchronization
- **🔒 Data Integrity** - Generates exact 17-row structure for Google Sheets

## 🏗️ Architecture

```
Frontend (PWA) → Google Sheets API → Existing Dashboard
     ↓              ↓                    ↓
Offline Queue → Auto-Sync → Apps Script → Zoho Cliq Reports
```

### 🔄 Data Flow
1. **Field Collection** - Mobile PWA collects visit data offline
2. **Auto-Sync** - Data submits to Google Sheets when online
3. **17-Row Generation** - Creates exact format expected by existing systems
4. **Dashboard Integration** - Existing analytics dashboard remains unchanged
5. **Apps Script Triggers** - Existing PDF generation and Zoho Cliq integration continues working

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google API Key with Sheets API access
- Access to Radico Google Sheets

### Installation

```bash
# Clone repository
git clone https://github.com/raidepmunjal/radico-field-pwa.git
cd radico-field-pwa

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Google API credentials

# Start development server
npm run dev
```

### Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
NEXT_PUBLIC_MASTER_SHEET_ID=1pRz9CgOoamTrfpnmF-XuBCg9IZON9br5avgRlKYtxM
NEXT_PUBLIC_VISIT_SHEET_ID=1XG4c_Lrpk-YglTq3G3ZY9Qjt7wSnUq0UZWDSYT61eWE
NEXT_PUBLIC_HISTORICAL_SHEET_ID=1yXzEYHJeHlETrEmU4TZ9F2_qv4OE10N4DPdYX0Iqfx0
```

## 📊 Brand Catalog

### 17 Tracked Variants

**8PM Family (5 variants):**
- 8 PM BLACK 750ml
- 8 PM BLACK 375ml  
- 8 PM BLACK 180ml P
- 8 PM BLACK 90ml
- 8 PM BLACK 60ml P

**VERVE Family (12 variants):**

*Lemon Lush (3):* 750ml, 375ml, 180ml  
*Grain (3):* 750ml, 375ml, 180ml  
*Cranberry (3):* 750ml, 375ml, 180ml  
*Green Apple (3):* 750ml, 375ml, 180ml

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── collect/           # Data collection pages
│   ├── login/             # Future: Sales login
│   └── dashboard/         # Future: Personal dashboard
├── components/
│   ├── forms/             # Data collection forms
│   ├── offline/           # Offline functionality
│   └── ui/                # Reusable UI components
├── lib/
│   ├── googleSheets.ts    # Google Sheets API
│   ├── brandCatalog.ts    # 17-brand definitions
│   ├── offline.ts         # Offline queue management
│   └── validation.ts      # Form validation
├── hooks/                 # React hooks
├── types/                 # TypeScript definitions
└── utils/                 # Utility functions
```

### Key Components

#### Data Collection Form
```typescript
// Handles all 17 brand variants
<InventoryForm 
  brands={BRAND_CATALOG}
  onSubmit={handleInventorySubmit}
  offline={isOffline}
/>
```

#### Offline Queue
```typescript
// Manages failed submissions
<OfflineQueue 
  submissions={pendingSubmissions}
  onSync={handleSync}
  isOnline={!isOffline}
/>
```

## 🌐 Deployment

### GitHub Pages (Automatic)

1. **Push to main branch** - Triggers automatic deployment
2. **GitHub Actions** - Builds and deploys to GitHub Pages
3. **Live URL** - `https://raidepmunjal.github.io/radico-field-pwa/`

### Manual Deployment

```bash
# Build production version
npm run build

# Deploy to GitHub Pages
npm run deploy

# Or export static files
npm run export
```

## 📱 PWA Installation

### For Field Staff:

1. **Visit PWA URL** on mobile device
2. **Add to Home Screen** when prompted
3. **Grant Permissions** for location and camera
4. **Start Collecting Data** - works offline!

### PWA Features:
- ✅ **Installable** - Appears like native app
- ✅ **Offline First** - Works without internet
- ✅ **Background Sync** - Syncs data when connection restored
- ✅ **Push Notifications** - Future: Sync status updates
- ✅ **Camera Access** - Shelf photo capture
- ✅ **Location Services** - GPS coordinate logging

## 🔄 Data Synchronization

### Offline-First Strategy

1. **All Data Stored Locally** - IndexedDB for submissions
2. **Background Sync** - Service Worker handles sync
3. **Conflict Resolution** - Timestamp-based deduplication
4. **Progress Indicators** - Real-time sync status
5. **Error Handling** - Retry failed submissions

### Sync Process

```typescript
// Automatic sync when online
const syncOfflineData = async () => {
  const pending = await getOfflineSubmissions();
  for (const submission of pending) {
    try {
      await submitToGoogleSheets(submission);
      await removeFromOfflineQueue(submission.id);
    } catch (error) {
      // Retry later
      await markForRetry(submission.id);
    }
  }
};
```

## 🔗 Integration Points

### Google Sheets API
- **Read**: Shop details, targets, pending challans
- **Write**: Visit data in 17-row format
- **Format**: Maintains compatibility with existing "Radico Visit Final" sheet

### Existing Dashboard
- **Zero Changes Required** - PWA uses same data structure
- **Real-time Updates** - New data appears in existing analytics
- **Historical Compatibility** - All existing reports continue working

### Apps Script Automation
- **PDF Generation** - Existing scripts continue working
- **Zoho Cliq Integration** - Automatic notifications maintained
- **Trigger Compatibility** - "PC Collected" triggers existing workflows

## 📋 Usage Workflow

### Typical Field Visit:

1. **📱 Open PWA** - Even without internet connection
2. **🏪 Select Shop** - From master list or search
3. **📊 Pre-fill Data** - Auto-loads targets, challans, last supply
4. **📦 Inventory Collection** - All 17 brand variants
5. **🎯 Target Update** - Record achievements vs targets
6. **🧾 Challan Status** - Mark collected/pending
7. **📸 Photo Capture** - 4 shelf images
8. **📍 Location Stamp** - Automatic GPS capture
9. **💾 Submit Data** - Queues offline, syncs when online
10. **✅ Confirmation** - Success notification

## 🛠️ Troubleshooting

### Common Issues

**PWA Not Installing:**
- Check HTTPS requirement
- Verify manifest.json is accessible
- Clear browser cache

**Offline Sync Failing:**
- Check Google API credentials
- Verify sheet permissions
- Check network connectivity

**Data Not Appearing in Dashboard:**
- Verify sheet ID configuration
- Check 17-row format generation
- Confirm Apps Script triggers

### Debug Tools

```bash
# Check PWA status
chrome://inspect/#devices

# View offline data
Application → Storage → IndexedDB

# Check service worker
Application → Service Workers
```

## 🔒 Security & Permissions

### Required Permissions:
- **📸 Camera** - Shelf photo capture
- **📍 Location** - GPS coordinates
- **💾 Storage** - Offline data queue
- **🌐 Network** - Google Sheets API access

### Data Security:
- **🔐 API Keys** - Environment variables only
- **🛡️ HTTPS Only** - Secure data transmission
- **📱 Local Storage** - Encrypted offline queue
- **🔄 Auto-Clear** - Synced data removed from device

## 🗺️ Roadmap

### Phase 1: Core PWA ✅
- [x] Mobile-first data collection
- [x] Offline capability  
- [x] 17-brand inventory forms
- [x] Google Sheets integration

### Phase 2: Advanced Features (Coming Soon)
- [ ] Sales login system
- [ ] Personal performance dashboard
- [ ] Advanced offline sync
- [ ] Push notifications
- [ ] Bulk upload capability

### Phase 3: Analytics Integration
- [ ] Real-time dashboard integration
- [ ] Advanced reporting
- [ ] Predictive analytics
- [ ] Performance insights

## 🤝 Contributing

### Development Setup

1. **Fork repository**
2. **Create feature branch** - `git checkout -b feature/amazing-feature`
3. **Make changes** - Follow existing code patterns
4. **Test thoroughly** - Especially offline functionality
5. **Submit PR** - With detailed description

### Code Standards

- **TypeScript** - Strict mode enabled
- **ESLint** - Airbnb configuration
- **Prettier** - Code formatting
- **PWA Best Practices** - Offline-first design

## 📞 Support

### Technical Issues:
- **Repository Issues** - [GitHub Issues](https://github.com/raidepmunjal/radico-field-pwa/issues)
- **Google Sheets API** - Check credentials and permissions
- **PWA Installation** - Verify HTTPS and manifest

### Business Logic:
- **Brand Catalog** - Contact sales team for updates
- **Sheet Structure** - Coordinate with dashboard team
- **Apps Script** - Check existing automation scripts

## 📄 License

This project is proprietary software for Radico Khaitan internal use.

---

## 🚀 Quick Links

- **🌐 Live PWA**: https://raidepmunjal.github.io/radico-field-pwa/
- **📊 Analytics Dashboard**: https://raidepmunjal.github.io/radico-dashboard/
- **📋 Google Sheets**: [Radico Visit Final](https://docs.google.com/spreadsheets/d/1XG4c_Lrpk-YglTq3G3ZY9Qjt7wSnUq0UZWDSYT61eWE)
- **📈 Master Data**: [Radico Master Final](https://docs.google.com/spreadsheets/d/1pRz9CgOoamTrfpnmF-XuBCg9IZON9br5avgRlKYtxM)

---

**Built with ❤️ for Radico Khaitan field sales teams**

*Replacing unreliable forms with reliable, offline-capable data collection*
