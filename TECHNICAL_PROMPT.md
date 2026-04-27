# Technical Prompt: React Frontend for Donation Admin Portal

## Role
**Senior Frontend Engineer (React/Tailwind CSS)**

---

## Objective
Build a responsive Admin Control Hub using React functional components and hooks to manage donation approvals, track donor records, and visualize key metrics in a modern, user-friendly interface.

---

## 1. Component Architecture

### Overview Diagram
```
<AdminDashboard /> (Parent Container)
├── <StatCards />
│   ├── Total Records Card
│   ├── Approved Card
│   ├── Pending Card
│   └── Rejected Card
├── <DonationTable />
│   ├── Table Header
│   └── Table Rows
│       └── <ApprovalActions /> (Per Row)
│           ├── Approve Button
│           └── Reject Button
└── <FilterBar /> (Optional Enhancement)
    ├── Search Input
    ├── Status Filter Dropdown
    └── Date Range Filter
```

---

## 2. Component Specifications

### 2.1 `<AdminDashboard />`
**Purpose:** Main parent container that orchestrates the entire admin portal

**Responsibilities:**
- Manage global state (donations list, loading state, error handling)
- Fetch donation data from backend API
- Pass data to child components via props
- Handle layout and responsive structure

**Props:**
- None (manages own state)

**State:**
```javascript
{
  donations: Array<Donation>,
  loading: boolean,
  error: string | null,
  filters: { status: string, searchTerm: string }
}
```

**Key Methods:**
- `fetchDonations()` - Retrieve donation records from API
- `handleApprove(donationId)` - Update donation status to approved
- `handleReject(donationId)` - Update donation status to rejected
- `refreshData()` - Refetch data after action

---

### 2.2 `<StatCards />`
**Purpose:** Display key metrics in card format

**Props:**
```javascript
{
  totalRecords: number,
  approved: number,
  pending: number,
  rejected: number
}
```

**Features:**
- Four responsive cards in a grid layout
- Icons representing each status (checkmark, hourglass, X, etc.)
- Color coding (green=approved, yellow=pending, red=rejected, blue=total)
- Hover effects and smooth transitions
- Mobile: Stack vertically; Desktop: 4-column grid

**Styling:**
- Tailwind classes: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
- Card: `bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`

---

### 2.3 `<DonationTable />`
**Purpose:** Display donor records in a table/list format

**Props:**
```javascript
{
  donations: Array<{
    id: string,
    name: string,
    email: string,
    amount: number,
    date: string,
    status: 'pending' | 'approved' | 'rejected',
    org: string
  }>,
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
  loading: boolean
}
```

**Features:**
- Responsive table (horizontal scroll on mobile or card view alternative)
- Columns: ID, Donor Name, Email, Amount, Date, Organization, Status, Actions
- Status badges with color coding
- Sortable columns (optional enhancement)
- Pagination support (optional)
- Empty state message when no donations exist

**Example Row Data:**
```
| ID | Name | Email | Amount | Date | Org | Status | Actions |
|---|---|---|---|---|---|---|---|
| DON001 | KALVA PAVANI PRIYA | pavani@email.com | $500 | 2026-02-20 | OrgA | Pending | [Approve] [Reject] |
```

**Styling:**
- Tailwind: `w-full border-collapse`
- Striped rows: `even:bg-gray-50`
- Responsive: Hide non-critical columns on mobile

---

### 2.4 `<ApprovalActions />`
**Purpose:** Action buttons for each donation record (Approve/Reject)

**Props:**
```javascript
{
  donationId: string,
  status: 'pending' | 'approved' | 'rejected',
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
  isLoading: boolean
}
```

**Features:**
- Two buttons: **Approve** (green) and **Reject** (red)
- Disabled buttons when donation is already approved/rejected
- Loading state indicators (spinners)
- Confirmation dialog on reject (safety feature)
- Inline tooltips showing action outcomes
- Smooth hover and click transitions

**Button Styling:**
- Approve: `bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded`
- Reject: `bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded`
- Disabled: `opacity-50 cursor-not-allowed`

**Behavior:**
```javascript
// Approve: Change status to 'approved', disable both buttons
// Reject: Show confirmation modal, change status to 'rejected', disable both buttons
// Pending: Both buttons enabled and clickable
```

---

## 3. Data Model

### Donation Object
```javascript
interface Donation {
  id: string;                    // Unique identifier
  name: string;                  // Donor name (e.g., "KALVA PAVANI PRIYA")
  email: string;                 // Contact email
  phone?: string;                // Phone number (optional)
  amount: number;                // Donation amount in dollars
  date: string;                  // ISO date string (2026-02-20)
  status: 'pending' | 'approved' | 'rejected'; // Current status
  org: string;                   // Organization/Campaign name
  message?: string;              // Optional donor message
  createdAt: string;             // Timestamp
  updatedAt: string;             // Last update timestamp
}
```

---

## 4. State Management & Hooks

### Using React Hooks
```javascript
// AdminDashboard.jsx
const [donations, setDonations] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Fetch data on mount
useEffect(() => {
  fetchDonations();
}, []);

// Handle approval
const handleApprove = async (donationId) => {
  setLoading(true);
  try {
    await api.updateDonation(donationId, { status: 'approved' });
    setDonations(prev => 
      prev.map(d => d.id === donationId ? {...d, status: 'approved'} : d)
    );
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 5. API Integration

### Endpoints Required
```
GET /api/donations              - Fetch all donations
PATCH /api/donations/:id        - Update (approve/reject) a donation
GET /api/donations/stats        - Get totals (approved, pending, rejected)
```

### Request/Response Examples

**GET /api/donations**
```json
{
  "success": true,
  "data": [
    {
      "id": "DON001",
      "name": "KALVA PAVANI PRIYA",
      "email": "pavani@org.com",
      "amount": 500,
      "date": "2026-02-20",
      "status": "pending",
      "org": "Food Aid Campaign"
    }
  ]
}
```

**PATCH /api/donations/:id**
```json
{
  "success": true,
  "data": {
    "id": "DON001",
    "status": "approved",
    "updatedAt": "2026-02-25T10:30:00Z"
  }
}
```

---

## 6. Styling & UI Guidelines

### Tailwind CSS Utilities
- **Colors:** Blue (primary), Green (approve/success), Red (reject/danger), Gray (neutral)
- **Spacing:** Use Tailwind's spacing scale (p-4, m-2, gap-6, etc.)
- **Typography:** 
  - Headings: `text-2xl font-bold text-gray-900`
  - Body: `text-base text-gray-700`
  - Labels: `text-sm font-semibold text-gray-600`

### Responsive Design
- **Mobile (< 768px):** Single column, stacked cards, simplified table
- **Tablet (768px - 1024px):** 2-column layout for StatCards
- **Desktop (> 1024px):** Full 4-column StatCards, full table display

### Theme Colors
```
Primary:    #3B82F6 (Blue)
Success:    #10B981 (Green)
Danger:     #EF4444 (Red)
Pending:    #F59E0B (Amber)
Background: #F9FAFB (Light Gray)
Text:       #111827 (Dark Gray)
```

---

## 7. Additional Features (Enhancements)

### Phase 1 (MVP)
✅ Display donations in table format
✅ Approve/Reject functionality
✅ Real-time status updates

### Phase 2 (Future)
- Search and filter by donor name, status
- Date range filtering
- Bulk approve/reject actions
- Export donations to CSV
- Donation notes/comments section
- Audit log (who approved/rejected and when)

### Phase 3 (Advanced)
- Pagination with customizable page size
- Sorting by columns
- Advanced analytics dashboard
- Donor profile view
- Email notifications on status change

---

## 8. Accessibility & Best Practices

✅ ARIA labels on buttons (`aria-label="Approve donation"`)
✅ Keyboard navigation (Tab, Enter to activate buttons)
✅ Color not the only indicator (use icons + text)
✅ Loading states with disabled buttons
✅ Error messages displayed prominently
✅ Responsive font sizes
✅ Sufficient color contrast (WCAG AA compliance)

---

## 9. Performance Considerations

- Lazy load DonationTable if list is large (1000+ records)
- Memoize StatCards with `React.memo()` to prevent unnecessary re-renders
- Implement virtual scrolling for large lists
- Debounce search/filter inputs
- Cache API responses using React Query or SWR (optional)

---

## 10. Testing Checklist

- [ ] Approve button updates status and disables
- [ ] Reject button shows confirmation and updates status
- [ ] StatCards display correct counts
- [ ] Table renders all donation records
- [ ] Loading states display correctly
- [ ] Error handling shows user-friendly messages
- [ ] Responsive layout on mobile, tablet, desktop
- [ ] API calls work correctly
- [ ] Empty state displays when no donations

---

## File Structure

```
src/
├── components/
│   ├── AdminDashboard.jsx
│   ├── StatCards.jsx
│   ├── DonationTable.jsx
│   ├── ApprovalActions.jsx
│   └── ConfirmDialog.jsx (optional modal)
├── hooks/
│   ├── useDonations.js
│   └── useApi.js
├── services/
│   └── api.js
├── styles/
│   └── tailwind.css
└── utils/
    └── formatters.js
```

---

## Success Criteria

✅ All components render without errors
✅ Approval/rejection workflow functions end-to-end
✅ Dashboard is fully responsive (mobile to desktop)
✅ No console errors or warnings
✅ API integration works with backend
✅ Load time < 2 seconds
✅ User can complete workflow in < 3 clicks
