# React Admin Portal - Quick Reference Guide

## 🎯 Component Quick Reference

### AdminDashboard
Parent container managing all state and data flows

```jsx
import AdminDashboard from './components/AdminDashboard';

// Props: None (manages own state)
// State: donations, loading, error, stats
// Methods: loadDonations, handleApprove, handleReject, handleRefresh
```

**Usage:**
```jsx
<AdminDashboard />
```

---

### StatCards
Displays 4 metric cards (Total, Approved, Pending, Rejected)

```jsx
import StatCards from './components/StatCards';

<StatCards
  totalRecords={100}      // Total donations
  approved={45}           // Approved count
  pending={30}            // Pending count
  rejected={25}           // Rejected count
/>
```

**Props:**
- `totalRecords: number` - Total count
- `approved: number` - Approved count
- `pending: number` - Pending count
- `rejected: number` - Rejected count

---

### DonationTable
Displays responsive table/card list of donations

```jsx
import DonationTable from './components/DonationTable';

<DonationTable
  donations={donations}
  loading={loading}
  onApprove={(id) => handleApprove(id)}
  onReject={(id) => handleReject(id)}
/>
```

**Props:**
- `donations: Donation[]` - Array of donation objects
- `loading: boolean` - Loading state
- `onApprove: (id: string) => void` - Approve handler
- `onReject: (id: string) => void` - Reject handler

---

### ApprovalActions
Approve/Reject buttons for each donation

```jsx
import ApprovalActions from './components/ApprovalActions';

<ApprovalActions
  donationId="DON001"
  status="pending"
  onApprove={(id) => handleApprove(id)}
  onReject={(id) => handleReject(id)}
  isProcessing={false}
/>
```

**Props:**
- `donationId: string` - Donation ID
- `status: 'pending' | 'approved' | 'rejected'` - Current status
- `onApprove: (id: string) => void` - Approve handler
- `onReject: (id: string) => void` - Reject handler
- `isProcessing: boolean` - Processing state (optional)

---

## 🪝 Custom Hooks Quick Reference

### useDonations
Main hook for managing donation data

```jsx
const {
  donations,        // Array of donations
  loading,          // Loading state
  error,            // Error message
  stats,            // Statistics object
  loadDonations,    // Fetch function
  loadStats,        // Fetch stats function
  approveDonation,  // Approve handler
  rejectDonation,   // Reject handler
  search,           // Search function
  filter,           // Filter function
  clearError        // Clear error state
} = useDonations();
```

**Usage:**
```jsx
const { donations, loading, error, approveDonation } = useDonations();

const handleApprove = async (id) => {
  await approveDonation(id);
};
```

---

### useDonationFilters
Manage filter state

```jsx
const {
  filters,          // Current filters object
  updateFilter,     // Update single filter
  resetFilters      // Reset all filters
} = useDonationFilters();
```

**Usage:**
```jsx
const { filters, updateFilter } = useDonationFilters();

const handleStatusChange = (status) => {
  updateFilter('status', status);
};
```

---

### useAsyncAction
Handle async operations with loading/error states

```jsx
const {
  loading,          // Loading state
  error,            // Error message
  execute,          // Execute async function
  clearError        // Clear error
} = useAsyncAction();
```

**Usage:**
```jsx
const { loading, error, execute } = useAsyncAction();

const handleAction = () => {
  execute(async () => {
    return await someAsyncFunction();
  });
};
```

---

## 📡 API Functions Quick Reference

### fetchDonations()
Fetch all donations

```javascript
const donations = await fetchDonations();
// Returns: Donation[]
```

### updateDonationStatus(donationId, status)
Update donation status

```javascript
await updateDonationStatus('DON001', 'approved');
// Returns: Updated Donation object
// Status must be: 'approved' or 'rejected'
```

### searchDonations(query)
Search donations by query

```javascript
const results = await searchDonations('KALVA PAVANI');
// Returns: Donation[]
```

### filterDonations(filters)
Filter donations by criteria

```javascript
const results = await filterDonations({
  status: 'pending',
  org: 'Food Aid Campaign'
});
// Returns: Donation[]
```

### exportDonationsToCSV(donations)
Export donations to CSV file

```javascript
exportDonationsToCSV(donations);
// Downloads donations_{timestamp}.csv
```

---

## 🛠️ Common Tasks

### 1. Fetch and Display Donations
```jsx
const [donations, setDonations] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchDonations();
      setDonations(data);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);
```

### 2. Approve a Donation
```jsx
const handleApprove = async (donationId) => {
  try {
    await updateDonationStatus(donationId, 'approved');
    // Update local state
    setDonations(prev =>
      prev.map(d => d.id === donationId ? {...d, status: 'approved'} : d)
    );
  } catch (error) {
    console.error('Approve failed:', error);
  }
};
```

### 3. Reject a Donation with Confirmation
```jsx
const handleReject = async (donationId) => {
  if (window.confirm('Are you sure you want to reject this donation?')) {
    try {
      await updateDonationStatus(donationId, 'rejected');
      setDonations(prev =>
        prev.map(d => d.id === donationId ? {...d, status: 'rejected'} : d)
      );
    } catch (error) {
      console.error('Reject failed:', error);
    }
  }
};
```

### 4. Search Donations
```jsx
const [searchQuery, setSearchQuery] = useState('');

const handleSearch = debounce(async (query) => {
  if (query.trim()) {
    const results = await searchDonations(query);
    setDonations(results);
  }
}, 300);

useEffect(() => {
  handleSearch(searchQuery);
}, [searchQuery]);
```

### 5. Format Dates and Currency
```jsx
import { formatDate, formatCurrency } from '../utils/helpers';

const donation = {
  date: '2026-02-20',
  amount: 500
};

console.log(formatDate(donation.date));       // "Feb 20, 2026"
console.log(formatCurrency(donation.amount)); // "$500.00"
```

---

## 🎨 Tailwind Class Reference

### Common Classes
```css
/* Spacing */
p-4      /* Padding: 1rem */
m-2      /* Margin: 0.5rem */
gap-6    /* Gap: 1.5rem */

/* Display */
flex     /* Display: flex */
grid     /* Display: grid */
hidden   /* Display: none */

/* Colors */
text-blue-600    /* Text color */
bg-green-100     /* Background color */
border-red-300   /* Border color */

/* Responsive */
md:grid-cols-2   /* Medium screens and up */
lg:grid-cols-4   /* Large screens and up */
sm:text-sm       /* Small screens and up */

/* Hover/Active */
hover:bg-blue-700
active:scale-95
transition-all   /* Smooth transitions */
```

---

## 📊 Data Structure Examples

### Donation Object
```javascript
{
  id: "DON001",
  name: "KALVA PAVANI PRIYA",
  email: "pavani@email.com",
  phone: "+1-555-0101",
  amount: 500,
  date: "2026-02-20",
  status: "pending",
  org: "Food Aid Campaign",
  message: "Helping families in need",
  createdAt: "2026-02-20T10:30:00Z",
  updatedAt: "2026-02-20T10:30:00Z"
}
```

### Stats Object
```javascript
{
  totalRecords: 100,
  approved: 45,
  pending: 30,
  rejected: 25,
  totalAmount: 15000,
  averageAmount: 150,
  approvalRate: "45.00"
}
```

---

## 🐛 Debugging Tips

### 1. Check Component Rendering
```jsx
console.log('AdminDashboard rendering with:', { donations, loading, error });
```

### 2. Verify API Calls
```javascript
// In browser DevTools Network tab
// Check API_BASE_URL: http://localhost:3000/api
// Look for fetch requests
```

### 3. Inspect State
```jsx
// Add to component
useEffect(() => {
  console.log('State updated:', { donations, stats, loading });
}, [donations, stats, loading]);
```

### 4. Test with Mock Data
```jsx
// Import mock data
import { MOCK_DONATIONS } from '../data/mockData';
setDonations(MOCK_DONATIONS);
```

### 5. Check Tailwind Styles
```jsx
// If styles not applying, verify:
// 1. tailwind.config.js has correct content paths
// 2. admin-dashboard.css imported in App.jsx
// 3. Browser DevTools shows Tailwind classes
```

---

## ✅ Best Practices

1. **Always handle errors** - Every async call should have try-catch
2. **Show loading states** - Users should know when data is loading
3. **Use loading indicators** - Spinners for async operations
4. **Disable buttons while processing** - Prevent double submissions
5. **Ask for confirmation** - On destructive actions (reject)
6. **Format dates/currency** - Use helper functions for consistency
7. **Use debounce for search** - Avoid excessive API calls
8. **Memoize callbacks** - Use useCallback for event handlers
9. **Test on mobile** - Check responsive design regularly
10. **Monitor console** - Watch for errors and warnings

---

## 🔗 Related Files

- Component files: `js/components/*.jsx`
- API service: `js/services/api.js`
- Custom hooks: `js/hooks/useDonations.js`
- Utility helpers: `js/utils/helpers.js`
- Mock data: `js/data/mockData.js`
- Styles: `css/admin-dashboard.css`
- Config: `tailwind.config.js`

---

**Last Updated:** February 25, 2026
