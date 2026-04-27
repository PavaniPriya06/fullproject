# React Admin Portal - Implementation Guide

## 📋 Complete Setup Instructions

### Step 1: Install Dependencies

```bash
cd donation
npm install
```

This will install:
- `react` - UI library
- `react-dom` - React rendering
- `react-scripts` - Build tools
- `tailwindcss` - Styling framework
- `postcss` & `autoprefixer` - CSS processing

### Step 2: Project Structure Overview

```
donation/
├── js/
│   ├── components/
│   │   ├── AdminDashboard.jsx          # ✓ Created
│   │   ├── StatCards.jsx               # ✓ Created
│   │   ├── DonationTable.jsx           # ✓ Created
│   │   └── ApprovalActions.jsx         # ✓ Created
│   ├── hooks/
│   │   └── useDonations.js             # ✓ Created
│   ├── services/
│   │   └── api.js                      # ✓ Created
│   ├── utils/
│   │   └── helpers.js                  # ✓ Created
│   ├── data/
│   │   └── mockData.js                 # ✓ Created
│   ├── index.jsx                       # ✓ Created
│   └── App.jsx                         # ✓ Created
├── css/
│   ├── admin-dashboard.css             # ✓ Created
│   └── styles.css                      # Existing
├── public/
│   └── index.html                      # Place React here
├── package.json                        # ✓ Created
├── tailwind.config.js                  # ✓ Created
├── postcss.config.js                   # ✓ Created
├── .env.example                        # ✓ Created
└── public/
    └── index.html                      # Create:
```

### Step 3: Create public/index.html

Create `donation/public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#3B82F6" />
    <meta
      name="description"
      content="Donation Admin Portal - Manage and approve donor records"
    />
    <title>Donation Admin Portal</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

### Step 4: Create .env File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Example `.env` content:

```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
REACT_APP_DEBUG=false
REACT_APP_USE_MOCK_DATA=false
REACT_APP_ITEMS_PER_PAGE=10
```

### Step 5: Configure API Service (Optional)

To use mock data during development, update `js/services/api.js`:

```javascript
import {
  getMockDonations,
  updateMockDonationStatus,
} from '../data/mockData';

// Replace real API calls with mock:
export const fetchDonations = async () => {
  if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
    return getMockDonations();
  }
  // ... rest of real API call
};
```

### Step 6: Start Development Server

```bash
npm start
```

The app will:
- Open at `http://localhost:3000`
- Auto-reload on file changes
- Show compilation errors in browser

### Step 7: Build for Production

```bash
npm run build
```

This creates an optimized build in the `build/` folder ready for deployment.

---

## 🔄 Component Data Flow

```
┌─────────────────────────────────────┐
│      AdminDashboard                 │
│  (Manages: donations, stats, etc)   │
└──────────────┬──────────────────────┘
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
    StatCards  DonationTable  Refresh Button
               │
               ▼
        (Per Row Components)
      ┌──────────────────────┐
      │  ApprovalActions     │
      │  - Approve Button    │
      │  - Reject Button     │
      │  - Confirmation Modal│
      └──────────────────────┘

Data Flow:
AdminDashboard loads donations → 
StatCards displays metrics → 
DonationTable shows all donations →
ApprovalActions allows approve/reject →
AdminDashboard updates state & UI
```

---

## 📡 API Integration Workflow

### 1. Fetch Donations (on app load)
```
AdminDashboard mounts
  ↓
useEffect calls loadDonations()
  ↓
fetchDonations() makes GET /api/donations
  ↓
Response updates state
  ↓
StatCards & DonationTable re-render with data
```

### 2. Approve Donation (user clicks Approve)
```
User clicks Approve Button
  ↓
ApprovalActions.handleApproveClick()
  ↓
AdminDashboard.handleApprove(donationId)
  ↓
updateDonationStatus(id, 'approved')
  ↓
Makes PATCH /api/donations/:id
  ↓
Updates local state
  ↓
Components re-render with new status
```

### 3. Reject Donation (user clicks Reject)
```
User clicks Reject Button
  ↓
Confirmation dialog appears
  ↓
User confirms rejection
  ↓
AdminDashboard.handleReject(donationId)
  ↓
updateDonationStatus(id, 'rejected')
  ↓
Makes PATCH /api/donations/:id
  ↓
Updates local state
  ↓
Components re-render with new status
```

---

## 🎯 Key Implementation Details

### AdminDashboard - State Management
```jsx
// Main state
const [donations, setDonations] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [stats, setStats] = useState({ ... });

// Load on mount
useEffect(() => {
  loadDonations();
}, []);

// Calculate stats whenever donations change
useEffect(() => {
  // Update stats based on donations
}, [donations]);
```

### StatCards - Responsive Grid
```jsx
// Desktop: 4 columns
// Tablet: 2 columns
// Mobile: 1 column

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* 4 cards */}
</div>
```

### DonationTable - Responsive Views
```jsx
// Desktop: Full table (hidden mobile)
<div className="hidden md:block">
  {/* Table */}
</div>

// Mobile: Card layout (hidden desktop)
<div className="md:hidden">
  {/* Cards */}
</div>
```

### ApprovalActions - Interactive Buttons
```jsx
// Disabled based on status
const isDisabled = status !== 'pending' || isProcessing;

// Confirmation for reject
const [showConfirmReject, setShowConfirmReject] = useState(false);
```

---

## 🧪 Testing the Application

### Test with Real Backend
1. Start your backend API server on port 3000
2. Set `REACT_APP_API_URL=http://localhost:3000/api` in `.env`
3. Start React app: `npm start`

### Test with Mock Data
1. Set `REACT_APP_USE_MOCK_DATA=true` in `.env`
2. App loads sample donations automatically
3. Approve/reject updates local state

### Test Specific Features

**Test Approve:**
1. Click "Approve" button on a pending donation
2. Status should change to "Approved"
3. Buttons should be disabled
4. Card should turn green

**Test Reject:**
1. Click "Reject" button on a pending donation
2. Confirmation dialog should appear
3. Click "Reject" in dialog
4. Status should change to "Rejected"
5. Buttons should be disabled
6. Card should turn red

**Test Statistics:**
1. Open app
2. StatCards should show correct counts
3. After approving/rejecting, stats should update
4. Refresh button should refetch data

**Test Responsiveness:**
1. Resize browser window
2. Desktop: Full table view
3. Tablet: 2-column stats, table or cards
4. Mobile: 1-column stats, card-based donations

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Option 3: AWS S3
```bash
npm run build
aws s3 sync build/ s3://your-bucket-name/
```

### Option 4: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔐 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `REACT_APP_API_URL` | Backend API endpoint | `http://localhost:3000/api` |
| `REACT_APP_ENV` | Environment | `development`, `production` |
| `REACT_APP_DEBUG` | Enable debug logging | `false` |
| `REACT_APP_USE_MOCK_DATA` | Use mock data | `false` |
| `REACT_APP_ITEMS_PER_PAGE` | Pagination size | `10` |
| `REACT_APP_ENABLE_EXPORT` | CSV export feature | `true` |

---

## 📊 Component Communication Map

```
┌─────────────────────┐
│  AdminDashboard     │ ← Manages all state and API calls
├─────────────────────┤
│  Props received:    │
│  - (none)           │
│                     │
│  State managed:     │
│  - donations[]      │
│  - loading          │
│  - error            │
│  - stats{}          │
│                     │
│  Callbacks passed:  │
│  - onApprove()      │
│  - onReject()       │
└──────────┬──────────┘
           │
     ┌─────┴─────┬──────────┐
     ▼           ▼          ▼
┌─────────┐ ┌──────────┐ ┌──────────┐
│StatCards│ │Donation  │ │Refresh   │
│         │ │Table     │ │Button    │
└─────────┘ │          │ └──────────┘
            │  Props:  │
            │- donations[]
            │- loading
            │- onApprove
            │- onReject
            │          │
            │     ┌────▼────┐
            │     ▼         │
            │┌──────────────┐
            ││Approval      │
            ││Actions       │
            ││(per row)     │
            │├──────────────┤
            ││Props:        │
            ││- donationId  │
            ││- status      │
            ││- onApprove   │
            ││- onReject    │
            │└──────────────┘
            └─────────────────┘
```

---

## 🆘 Troubleshooting

### Issue: "Cannot find module 'react'"
**Solution:** Run `npm install`

### Issue: Tailwind styles not appearing
**Solution:** 
- Check `tailwind.config.js` content paths
- Ensure `admin-dashboard.css` is imported in `App.jsx`
- Clear browser cache

### Issue: API calls failing
**Solution:**
- Check `REACT_APP_API_URL` in `.env`
- Verify backend is running
- Check browser DevTools Network tab
- Look for CORS errors

### Issue: Components not rendering
**Solution:**
- Check console for JavaScript errors
- Verify component paths in imports
- Check for missing props
- Use React DevTools extension

### Issue: Mock data not working
**Solution:**
- Set `REACT_APP_USE_MOCK_DATA=true` in `.env`
- Restart dev server: `npm start`

---

## ✨ Next Steps

1. **Install dependencies**: `npm install`
2. **Configure environment**: Create `.env` file
3. **Start development**: `npm start`
4. **Test features**: Try approve/reject on mock data
5. **Connect to backend**: Update API URL when ready
6. **Build for production**: `npm run build`
7. **Deploy**: Choose hosting platform

---

**Created:** February 25, 2026
**React Version:** 18.2.0+
**Node Version:** 14.0+
