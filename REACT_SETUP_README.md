# Donation Admin Portal - React Components

A comprehensive responsive Admin Control Hub built with React functional components, hooks, and Tailwind CSS for managing donation approvals and donor records.

## 📁 Project Structure

```
donation/
├── js/
│   ├── components/
│   │   ├── AdminDashboard.jsx      # Parent container component
│   │   ├── StatCards.jsx            # Statistics display component
│   │   ├── DonationTable.jsx        # Donation records table component
│   │   └── ApprovalActions.jsx      # Action buttons component
│   ├── hooks/
│   │   └── useDonations.js          # Custom React hooks
│   ├── services/
│   │   └── api.js                   # API integration layer
│   ├── utils/
│   │   └── helpers.js               # Utility functions
│   ├── data/
│   │   └── mockData.js              # Mock data for testing
│   ├── index.jsx                    # React entry point
│   └── App.jsx                      # Main App component
├── css/
│   ├── admin-dashboard.css          # Tailwind styles
│   └── styles.css                   # Additional styles
├── public/
│   └── index.html                   # HTML entry point
├── package.json                     # Dependencies
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 14.0 or higher
- npm or yarn package manager

### Installation

```bash
# Navigate to the project directory
cd donation

# Install dependencies
npm install

# Start the development server
npm start
```

The application will open at `http://localhost:3000`

## 🧩 Component Architecture

### AdminDashboard (Parent Container)
Main orchestrator component that:
- Manages global donation data state
- Handles API calls and data fetching
- Manages loading and error states
- Coordinates child component updates
- Provides approval/rejection handlers

```jsx
<AdminDashboard />
├── <StatCards /> - Display metrics
├── <DonationTable /> - List donations
│   └── <ApprovalActions /> - Action buttons per row
└── Error handling & refresh controls
```

### StatCards Component
Displays key metrics in responsive cards:
- **Total Records**: Count of all donations
- **Approved**: Count of approved donations (Green)
- **Pending**: Count of pending donations (Yellow)
- **Rejected**: Count of rejected donations (Red)

Features:
- 4-column grid on desktop
- 2-column on tablet
- Single column on mobile
- Color-coded cards with icons
- Animated transitions

### DonationTable Component
Displays donor records in a responsive format:

**Desktop View**: Full table with columns
```
| ID | Name | Email | Amount | Org | Date | Status | Actions |
```

**Mobile View**: Card-based layout for better readability

Features:
- Sortable columns (extensible)
- Status badges with icons
- Email links
- Formatted currency and dates
- Striped rows for readability
- Hover effects

### ApprovalActions Component
Action buttons for each donation record:

**Buttons:**
- **Approve Button** (Green)
  - Changes status to "approved"
  - Disables after action
  - Shows success feedback

- **Reject Button** (Red)
  - Shows confirmation dialog
  - Prevents accidental rejection
  - Changes status to "rejected"
  - Disables after action

Features:
- Disabled state styling
- Loading spinners
- Confirmation dialogs for destructive actions
- Status-based button availability
- ARIA labels for accessibility

## 🔧 Key Features

### 1. Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Works on phones, tablets, and desktops
- Adaptive layouts and typography

### 2. State Management
- React Hooks (useState, useEffect, useCallback)
- Custom hooks for reusable logic
- Local state management
- Error handling throughout

### 3. API Integration
```javascript
// Fetch donations
const fetchDonations = async () => { ... }

// Update status
const updateDonationStatus = async (id, status) => { ... }

// Search and filter
const searchDonations = async (query) => { ... }
const filterDonations = async (filters) => { ... }

// Export to CSV
const exportDonationsToCSV = (donations) => { ... }
```

### 4. Custom Hooks
```javascript
// Manage donations data
const { donations, loading, error, approveDonation, rejectDonation } = useDonations()

// Manage filters
const { filters, updateFilter, resetFilters } = useDonationFilters()

// Handle async actions
const { loading, error, execute } = useAsyncAction()
```

### 5. Utility Functions
- Date formatting
- Currency formatting
- Email/phone validation
- Array filtering and sorting
- Statistics calculation
- UUID generation
- Clipboard copy

## 📊 Data Model

```javascript
interface Donation {
  id: string;                    // Unique identifier
  name: string;                  // Donor name
  email: string;                 // Contact email
  phone?: string;                // Phone number
  amount: number;                // Donation amount
  date: string;                  // ISO date string
  status: 'pending' | 'approved' | 'rejected';
  org: string;                   // Organization/Campaign
  message?: string;              // Donor message
  createdAt: string;             // Timestamp
  updatedAt: string;             // Last update timestamp
}
```

## 🎨 Styling with Tailwind CSS

### Color Scheme
- **Primary (Blue)**: #3B82F6 - Main actions
- **Success (Green)**: #10B981 - Approval, success states
- **Danger (Red)**: #EF4444 - Rejection, dangerous actions
- **Warning (Yellow)**: #F59E0B - Pending state
- **Background**: #F9FAFB - Light gray

### Utility Classes
```css
/* Component Utilities */
.card                  /* Base card styling */
.btn-primary          /* Primary button */
.btn-success          /* Success button */
.btn-danger           /* Danger button */
.badge-success        /* Success badge */
.alert-danger         /* Alert container */
```

## 🔗 API Integration

### Endpoints Required

```
GET /api/donations              - Fetch all donations
GET /api/donations/:id          - Get single donation
PATCH /api/donations/:id        - Update donation status
GET /api/donations/stats        - Get statistics
GET /api/donations/search?q=... - Search donations
GET /api/donations/filter       - Filter donations
```

### API Configuration

Set the API URL via environment variable:
```bash
REACT_APP_API_URL=http://localhost:3000/api
```

## 🧪 Testing with Mock Data

To use mock data during development:

```javascript
// In AdminDashboard.jsx
import { getMockDonations, updateMockDonationStatus } from '../data/mockData';

// Replace real API calls with mock data
const loadDonations = async () => {
  const data = await getMockDonations();
  setDonations(data);
};
```

Sample mock donations (8 records):
- KALVA PAVANI PRIYA - Pending
- John Smith - Approved
- Maria Garcia - Pending
- Ahmed Hassan - Rejected
- Sarah Johnson - Approved
- Robert Chen - Pending
- Emily Davis - Approved
- Michael Thompson - Pending

## ♿ Accessibility

Implementation includes:
- ARIA labels on buttons
- Keyboard navigation support
- Color + icons for status indicators
- Semantic HTML
- Focus-visible styles
- Alt text for icons
- Loading state indicators

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Single column, card layout)
- **Tablet**: 768px - 1024px (2-column grid)
- **Desktop**: > 1024px (Full 4-column layout)

## 🚨 Error Handling

- Try-catch blocks in all API calls
- User-friendly error messages
- Error reset functionality
- Network error recovery
- Validation on inputs

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Output will be in the `build/` directory
# Ready to deploy to any static hosting service

# Environment variables for production
REACT_APP_API_URL=https://api.production.com/api
```

## 🔐 Security Considerations

- ✅ CSRF protection via credentials: 'include'
- ✅ Input validation
- ✅ XSS prevention with React's built-in escaping
- ✅ Secure HTTP headers via server
- ✅ Confirmation dialogs for destructive actions

## 🚀 Performance Optimizations

- React.memo() for preventing unnecessary re-renders
- useCallback for stable function references
- Lazy loading for large lists
- Debounced search and filters
- CSS Grid for efficient layouts
- Optimized images and assets

## 📚 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using React, Tailwind CSS, and modern web standards**
