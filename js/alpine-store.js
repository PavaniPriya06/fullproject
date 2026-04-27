/* =========================================================
   ALPINE.JS 3 STORES — DonateHub Data Schema & Navigation
   =========================================================
   Load order: utils.js → auth.js → service.js → (this file)
   → Alpine CDN (defer). This file registers alpine:init so
   all stores are ready before Alpine boots the DOM.
   ========================================================= */

document.addEventListener('alpine:init', function () {
  'use strict';

  /* ── Utility / Routing store ─────────────────────────────
     Centralises page navigation so all modules use one API.
     window._dmsSession is set by the thin auth block that
     runs synchronously before Alpine boots.
  ──────────────────────────────────────────────────────── */
  Alpine.store('app', {
    /** Navigate to another page, optionally after a delay (ms). */
    navigate(url, delay) {
      redirectTo(url, delay || 0);
    }
  });

  /* ── Food Inventory Store (Path A) ───────────────────────
     Schema: { rice: number, vegetables: number, fruits: number }
  ──────────────────────────────────────────────────────── */
  Alpine.store('foodForm', {
    /* — bound fields — */
    selectedTrust: '',
    rice:       '',
    vegetables: '',
    fruits:     '',

    /* — UI state — */
    isLoading:  false,
    trustError: '',
    riceError:  '',
    vegError:   '',
    fruitsError: '',

    /* — history — */
    records:    [],
    trusts:     [], // Will be populated with Vijayawada trusts

    /* Called automatically by Alpine after the store is created */
    init() {
      this.loadTrusts();
      this.loadRecords();
    },

    loadTrusts() {
      // Load trusts from localStorage or default data
      // This will be populated with actual Vijayawada trusts
      this.trusts = [
        { id: 'trust_001', name: 'Sri Vidyanikethan Educational Trust', category: 'Education' },
        { id: 'trust_003', name: 'Krishna Health Care Trust', category: 'Healthcare' },
        { id: 'trust_006', name: 'Annadana Food Distribution Trust', category: 'Hunger Relief' },
        { id: 'trust_008', name: 'Krishna River Green Initiative', category: 'Environment' },
        { id: 'trust_010', name: 'Divyangjan Empowerment Society', category: 'Disability Support' },
        { id: 'trust_011', name: 'Women Strength & Safety Trust', category: 'Women Empowerment' },
        { id: 'trust_012', name: 'Krishna District Disaster Relief Fund', category: 'Disaster Relief' },
        { id: 'trust_014', name: 'Elderly Care & Dignity Trust', category: 'Elderly Care' },
        { id: 'trust_015', name: 'Skilled Hands Employment Trust', category: 'Vocational Training' }
      ];
    },

    loadRecords() {
      if (!window._dmsSession) return;
      const masters = DonationService
        .getRecordsByUser(window._dmsSession.userId)
        .filter(function (r) { return r.type === 'food'; })
        .slice(0, 10);

      /* Join with Food_Donations sub-table to surface rice_qty / veg_qty / fruits_qty */
      this.records = masters.map(function (r) {
        const sub = DonationService.getFoodByDonationId(r.id) || {};
        return {
          id:        r.id,
          userId:    r.userId,
          type:      r.type,
          createdAt: r.createdAt,
          rice_qty:  sub.rice_qty != null ? sub.rice_qty : 0,
          veg_qty:   sub.veg_qty  != null ? sub.veg_qty  : 0,
          fruits_qty: sub.fruits_qty != null ? sub.fruits_qty : 0
        };
      });
    },

    formatDate(iso) {
      const d = new Date(iso);
      return d.toLocaleDateString() + ' ' +
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    async submit() {
      /* Clear previous errors */
      this.trustError = '';
      this.riceError = '';
      this.vegError  = '';
      this.fruitsError = '';
      let valid      = true;

      if (!this.selectedTrust || this.selectedTrust.trim() === '') {
        this.trustError = 'Please select a trust to donate to.';
        valid = false;
      }

      const rice = parseInt(this.rice, 10);
      const veg  = parseInt(this.vegetables, 10);
      const fruits = parseInt(this.fruits, 10);

      if (isNaN(rice) || rice < 0) {
        this.riceError = 'Please enter a valid non-negative integer for Rice.';
        valid = false;
      }
      if (isNaN(veg) || veg < 0) {
        this.vegError = 'Please enter a valid non-negative integer for Vegetables.';
        valid = false;
      }
      if (isNaN(fruits) || fruits < 0) {
        this.fruitsError = 'Please enter a valid non-negative integer for Fruits.';
        valid = false;
      }
      if (valid && rice === 0 && veg === 0 && fruits === 0) {
        showToast('Please enter at least one non-zero quantity.', 'warning');
        return;
      }
      if (!valid) return;

      this.isLoading = true;

      try {
        /* SEND TO BACKEND API & MySQL */
        const result = await window.DonationAPI.saveFoodDonation(
          window._dmsSession.userId,
          rice,
          veg,
          fruits,
          this.selectedTrust
        );

        this.isLoading = false;
        this.selectedTrust = '';
        this.rice       = '';
        this.vegetables = '';
        this.fruits     = '';
        this.trustError = '';
        this.riceError  = '';
        this.vegError   = '';
        this.fruitsError = '';
        this.loadRecords();

        /* Dispatch success event for redirection */
        const donationId = result.donationId || result.data?.id || 'donation-' + Date.now();
        window.dispatchEvent(new CustomEvent('donationSuccess', { 
          detail: { id: donationId } 
        }));
        
        showToast('✅ Donation saved successfully!', 'success');
        setTimeout(() => { window.location.href = 'confirmation.html?rid=' + donationId; }, 1000);

      } catch (error) {
        console.error('❌ FOOD FORM SUBMISSION FAILED:', error);
        console.error('📋 Error details:', {
          message: error.message,
          status: error.status,
          stack: error.stack
        });
        this.isLoading = false;
        const errorMsg = error.message || 'Failed to save donation. Please try again.';
        showToast(errorMsg, 'error');
      }
    }
  });


  /* ── Apparel Store (Path B) ──────────────────────────────
     Schema: { selectedTrust: string, ageGroup: number | null }
     Fixed source array: [10, 19, 20, 30, 45]
  ──────────────────────────────────────────────────────── */
  Alpine.store('apparelForm', {
    /* — static data — */
    AGE_GROUPS: [10, 19, 20, 30, 45],
    AGE_LABELS: {
      10: 'Children (≤10)',
      19: 'Teens (11–19)',
      20: 'Young Adults (20s)',
      30: 'Adults (30s)',
      45: 'Middle Age (45+)'
    },

    /* — bound fields — */
    selectedTrust: '',
    selectedAge: null,

    /* — UI state — */
    viewMode:   'grid',   /* 'grid' | 'dropdown' */
    isLoading:  false,
    trustError: '',

    /* — history — */
    records:    [],
    trusts:     [],

    init() {
      this.loadTrusts();
      this.loadRecords();
    },

    loadTrusts() {
      this.trusts = [
        { id: 'trust_001', name: 'Sri Vidyanikethan Educational Trust', category: 'Education' },
        { id: 'trust_003', name: 'Krishna Health Care Trust', category: 'Healthcare' },
        { id: 'trust_010', name: 'Divyangjan Empowerment Society', category: 'Disability Support' },
        { id: 'trust_011', name: 'Women Strength & Safety Trust', category: 'Women Empowerment' },
        { id: 'trust_013', name: 'Krishna Animal Welfare Foundation', category: 'Animal Welfare' },
        { id: 'trust_015', name: 'Skilled Hands Employment Trust', category: 'Vocational Training' }
      ];
    },

    /**
     * Called by grid buttons via @click.
     * Kept as a method (not direct mutation) so the dropdown
     * x-model and the grid button selection stay in sync
     * through this single source of truth.
     */
    selectAge(age) {
      this.selectedAge = parseInt(age, 10);
    },

    /** Computed label shown in the selection badge */
    get selectedLabel() {
      return this.selectedAge !== null
        ? this.selectedAge + ' — ' + (this.AGE_LABELS[this.selectedAge] || '')
        : '—';
    },

    formatDate(iso) {
      const d = new Date(iso);
      return d.toLocaleDateString() + ' ' +
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    async submit() {
      this.trustError = '';
      let valid = true;

      // Remove trust requirement - it's optional
      // if (!this.selectedTrust || this.selectedTrust.trim() === '') {
      //   this.trustError = 'Please select a trust to donate to.';
      //   valid = false;
      // }

      if (this.selectedAge === null) {
        showToast('Please select an age group before logging.', 'warning');
        return;
      }

      if (!valid) return;

      this.isLoading = true;

      try {
        /* SEND TO BACKEND API & MySQL */
        const result = await window.DonationAPI.saveApparelDonation(
          window._dmsSession.userId,
          this.selectedAge
        );

        this.isLoading = false;
        this.selectedTrust = '';
        this.selectedAge = null;
        this.trustError = '';
        this.loadRecords();

        /* Dispatch success event for redirection */
        const donationId = result.donationId || result.data?.id || 'donation-' + Date.now();
        window.dispatchEvent(new CustomEvent('donationSuccess', { 
          detail: { id: donationId } 
        }));
        
        showToast('✅ Apparel donation saved successfully!', 'success');
        setTimeout(() => { window.location.href = 'confirmation.html?rid=' + donationId; }, 1000);

      } catch (error) {
        console.error('❌ APPAREL FORM SUBMISSION FAILED:', error);
        console.error('📋 Error details:', {
          message: error.message,
          status: error.status,
          stack: error.stack
        });
        this.isLoading = false;
        const errorMsg = error.message || 'Failed to save donation. Please try again.';
        showToast(errorMsg, 'error');
      }
    },

    loadRecords() {
      if (!window._dmsSession) return;
      const masters = DonationService
        .getRecordsByUser(window._dmsSession.userId)
        .filter(function (r) { return r.type === 'apparel'; })
        .slice(0, 10);

      /* Join with Clothes_Donations sub-table to surface target_age */
      this.records = masters.map(function (r) {
        const sub = DonationService.getClothesByDonationId(r.id) || {};
        return {
          id:         r.id,
          userId:     r.userId,
          type:       r.type,
          createdAt:  r.createdAt,
          target_age: sub.target_age != null ? sub.target_age : null
        };
      });
    }
  });


  /* ── Money / QR Store (Path C) ───────────────────────────
     State machine: idle → scanning → detected → confirmed
     Two-step flow: createPendingMoney (status:false)
                    → completeMoney    (status:true)
     cancelPendingMoney used if user re-scans.
  ──────────────────────────────────────────────────────── */
  Alpine.store('moneyForm', {
    /* — form state — */
    selectedTrust: '',
    paymentCode:   '',
    amount:        '',
    
    /* — UI state — */
    isLoading:     false,
    trustError:    '',
    cameraError:   '',

    /* — trust list — pre-loaded immediately */
    trusts: [
      { id: 'trust_001', name: 'Sri Vidyanikethan Educational Trust', category: 'Education' },
      { id: 'trust_003', name: 'Krishna Health Care Trust', category: 'Healthcare' },
      { id: 'trust_006', name: 'Annadana Food Distribution Trust', category: 'Hunger Relief' },
      { id: 'trust_008', name: 'Krishna River Green Initiative', category: 'Environment' },
      { id: 'trust_012', name: 'Krishna District Disaster Relief Fund', category: 'Disaster Relief' },
      { id: 'trust_014', name: 'Elderly Care & Dignity Trust', category: 'Elderly Care' },
      { id: 'trust_015', name: 'Skilled Hands Employment Trust', category: 'Vocational Training' }
    ],

    /* — history — */
    records:       [],

    init() {
      this.loadRecords();
    },

    loadTrusts() {
      // Trusts are now pre-loaded above, but keep this for compatibility
      this.trusts = this.trusts || [
        { id: 'trust_001', name: 'Sri Vidyanikethan Educational Trust', category: 'Education' },
        { id: 'trust_003', name: 'Krishna Health Care Trust', category: 'Healthcare' },
        { id: 'trust_006', name: 'Annadana Food Distribution Trust', category: 'Hunger Relief' },
        { id: 'trust_008', name: 'Krishna River Green Initiative', category: 'Environment' },
        { id: 'trust_012', name: 'Krishna District Disaster Relief Fund', category: 'Disaster Relief' },
        { id: 'trust_014', name: 'Elderly Care & Dignity Trust', category: 'Elderly Care' },
        { id: 'trust_015', name: 'Skilled Hands Employment Trust', category: 'Vocational Training' }
      ];
    },

    loadRecords() {
      if (!window._dmsSession) return;
      const masters = DonationService
        .getRecordsByUser(window._dmsSession.userId)
        .filter(function (r) { return r.type === 'money'; })
        .slice(0, 10);

      this.records = masters.map(function (r) {
        const sub = DonationService.getMoneyByDonationId(r.id) || {};
        return {
          id:        r.id,
          userId:    r.userId,
          type:      r.type,
          createdAt: r.createdAt,
          amount:    sub.amount != null ? sub.amount : 0,
          paymentCode: sub.paymentCode || ''
        };
      });
    },

    formatDate(iso) {
      const d = new Date(iso);
      return d.toLocaleDateString() + ' ' +
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    /** Format payment code with automatic spacing (every 4 chars) */
    formatPaymentCode() {
      let code = this.paymentCode.replace(/\s/g, '').toUpperCase();
      if (code.length > 0) {
        code = code.match(/.{1,4}/g).join(' ');
      }
      this.paymentCode = code;
    },

    /** Validate amount is a reasonable donation */
    validateAmount() {
      const amt = parseFloat(this.amount);
      if (isNaN(amt) || amt < 10) {
        this.cameraError = 'Minimum donation amount is ₹10.';
        return false;
      }
      if (amt > 100000) {
        this.cameraError = 'Please verify - amount seems unusually large.';
        return false;
      }
      return true;
    },

    async processPaymentCode() {
      console.log('🔍 Processing payment code...');
      console.log('Selected Trust:', this.selectedTrust);
      console.log('Payment Code:', this.paymentCode);
      console.log('Amount:', this.amount);
      
      this.trustError = '';
      this.cameraError = '';

      if (!this.selectedTrust || this.selectedTrust.trim() === '') {
        this.trustError = 'Please select a trust before submitting.';
        console.error('❌ No trust selected');
        return;
      }

      if (!this.paymentCode || this.paymentCode.trim() === '') {
        this.cameraError = 'Please enter or scan a payment code.';
        console.error('❌ No payment code entered');
        return;
      }

      if (!this.amount || this.amount < 10) {
        this.cameraError = 'Please enter a valid amount (minimum ₹10).';
        console.error('❌ Invalid amount:', this.amount);
        return;
      }

      if (!this.validateAmount()) {
        console.error('❌ Amount validation failed');
        return;
      }

      console.log('✅ All validations passed, processing...');
      this.isLoading = true;

      try {
        const record = DonationService.createMoney(
          window._dmsSession.userId,
          this.selectedTrust,
          parseFloat(this.amount),
          this.paymentCode
        );

        console.log('✓ Record created:', record);

        if (record) {
          showToast('Payment recorded successfully! ✓', 'success');
          this.paymentCode = '';
          this.amount = '';
          this.selectedTrust = '';
          this.loadRecords();
          
          // Dispatch success event to redirect to confirmation
          console.log('🎉 Dispatching success event');
          window.dispatchEvent(new CustomEvent('donationSuccess', { detail: { id: record.id } }));
        } else {
          this.cameraError = 'Failed to record payment. Please try again.';
          console.error('❌ No record returned from createMoney');
        }
      } catch (err) {
        this.cameraError = 'Error: ' + err.message;
        console.error('❌ Payment error:', err);
        console.error('Stack:', err.stack);
      } finally {
        this.isLoading = false;
      }
    }
  });


  /* ── Donations Master Table Store ────────────────────────
     Aggregates ALL records across ALL users.
     Schema columns surfaced:
       donation_id  → record.id         (PK)
       user_id      → record.userId     (FK → dms_users)
       category     → record.type       (Enum: food|apparel|money)
       created_at   → record.createdAt  (ISO timestamp)
  ──────────────────────────────────────────────────────── */
  Alpine.store('donationsTable', {
    /* — data — */
    records:  [],
    _userMap: {},   /* userId → { fullName, email } */

    /* — filter / sort state — */
    filter:  'all',   /* 'all' | 'food' | 'apparel' | 'money' */
    sortDir: 'desc',  /* 'desc' | 'asc' (always sorted by created_at) */

    init() {
      this._loadUsers();
      this.loadAll();
    },

    /** Build a userId → user-info lookup from the auth store */
    _loadUsers() {
      try {
        const users = JSON.parse(localStorage.getItem('dms_users')) || [];
        this._userMap = {};
        users.forEach(function (u) {
          this._userMap[u.id] = { fullName: u.fullName, email: u.email };
        }, this);
      } catch (e) {
        this._userMap = {};
      }
    },

    /** Pull every record from localStorage */
    loadAll() {
      this.records = DonationService.getAllRecords();
    },

    /** Filtered + sorted view used directly by x-for in the template */
    get filtered() {
      let rows = this.records.slice();
      if (this.filter !== 'all') {
        rows = rows.filter(function (r) { return r.type === this.filter; }, this);
      }
      const dir = this.sortDir === 'desc' ? -1 : 1;
      rows.sort(function (a, b) {
        return dir * (new Date(a.createdAt) - new Date(b.createdAt));
      });
      return rows;
    },

    /** Toggle created_at sort direction */
    toggleSort() {
      this.sortDir = this.sortDir === 'desc' ? 'asc' : 'desc';
    },

    /* ── Display helpers ── */

    categoryLabel(type) {
      return { food: 'Food', apparel: 'Clothes', money: 'Money' }[type] || type;
    },

    categoryIcon(type) {
      return { food: '🌾', apparel: '👕', money: '💳' }[type] || '📦';
    },

    /** Resolve a userId to a display name; falls back to the raw ID */
    userName(userId) {
      return (this._userMap[userId] || {}).fullName || userId;
    },

    userEmail(userId) {
      return (this._userMap[userId] || {}).email || '';
    },

    /**
     * One-line detail summary — joins the relevant sub-table on demand.
     * Keeps the master schema clean while surfacing per-type data.
     */
    detailSummary(r) {
      if (r.type === 'food') {
        const sub = DonationService.getFoodByDonationId(r.id) || {};
        return 'Rice: ' + (sub.rice_qty != null ? sub.rice_qty : '—') +
               ' kg · Veg: ' + (sub.veg_qty != null ? sub.veg_qty : '—') + ' kg';
      }
      if (r.type === 'apparel') {
        const sub = DonationService.getClothesByDonationId(r.id) || {};
        return 'Age group: ' + (sub.target_age != null ? sub.target_age : '—');
      }
      if (r.type === 'money') {
        const sub = DonationService.getMoneyByDonationId(r.id) || {};
        return sub.transaction_id || '—';
      }
      return '';
    },

    formatDate(iso) {
      return new Date(iso).toLocaleString();
    },

    /* ── Aggregate counts ── */
    get totalCount()   { return this.records.length; },
    get foodCount()    { return this.records.filter(function (r) { return r.type === 'food';    }).length; },
    get apparelCount() { return this.records.filter(function (r) { return r.type === 'apparel'; }).length; },
    get moneyCount()   { return this.records.filter(function (r) { return r.type === 'money';   }).length; }
  });


  /* ── Database Viewer Store ────────────────────────────────
     Shows all 4 normalized tables: Master + 3 sub-tables.
     Tabs: 'master' | 'food' | 'clothes' | 'money'
  ──────────────────────────────────────────────────────── */
  Alpine.store('databaseView', {
    /* — active tab — */
    activeTab: 'master',   /* 'master' | 'food' | 'clothes' | 'money' */

    /* — table data — */
    masterRows:  [],
    foodRows:    [],
    clothesRows: [],
    moneyRows:   [],

    /* — user lookup — */
    _userMap: {},

    init() {
      this._loadUsers();
      this.loadAll();
    },

    _loadUsers() {
      try {
        const users = JSON.parse(localStorage.getItem('dms_users')) || [];
        this._userMap = {};
        users.forEach(function (u) {
          this._userMap[u.id] = { fullName: u.fullName, email: u.email };
        }, this);
      } catch (e) {
        this._userMap = {};
      }
    },

    loadAll() {
      this.masterRows  = DonationService.getAllRecords();
      this.foodRows    = DonationService.getFoodDonations();
      this.clothesRows = DonationService.getClothesDonations();
      this.moneyRows   = DonationService.getMoneyDonations();
    },

    setTab(tab) {
      this.activeTab = tab;
    },

    /* ── Helpers ── */

    userName(userId) {
      return (this._userMap[userId] || {}).fullName || userId;
    },

    formatDate(iso) {
      return new Date(iso).toLocaleString();
    },

    typeLabel(type) {
      return { food: '🌾 Food', apparel: '👕 Clothes', money: '💳 Money' }[type] || type;
    },

    /* ── Counts ── */
    get masterCount()  { return this.masterRows.length; },
    get foodCount()    { return this.foodRows.length; },
    get clothesCount() { return this.clothesRows.length; },
    get moneyCount()   { return this.moneyRows.length; }
  });


  /* ── Admin Dashboard Store ────────────────────────────────
     Superuser CRUD: view, filter, approve, reject, edit, delete.
     Requires requireAdmin() guard on admin.html.
  ──────────────────────────────────────────────────────── */
  Alpine.store('adminDashboard', {
    /* — all records (master + enriched sub-table fields) — */
    records:  [],
    _userMap: {},

    /* — filter state — */
    filterType:   'all',    /* 'all' | 'food' | 'apparel' | 'money' */
    filterStatus: 'all',    /* 'all' | 'pending' | 'approved' | 'rejected' */
    searchQuery:  '',

    /* — edit modal state — */
    editOpen:    false,
    editRecord:  null,   /* enriched flat record being edited */
    editData:    {},     /* form-bound copy */
    editError:   '',
    editLoading: false,

    /* — reject reason modal state — */
    rejectModalOpen: false,
    rejectTargetId:  null,
    rejectReason:    '',
    rejectError:     '',

    /* — static data — */
    VALID_AGES: [10, 19, 20, 30, 45],
    AGE_LABELS: {
      10: 'Children (\u226410)',
      19: 'Teens (11\u201319)',
      20: 'Young Adults (20s)',
      30: 'Adults (30s)',
      45: 'Middle Age (45+)'
    },

    init() {
      this._loadUsers();
      this.loadAll();
    },

    _loadUsers() {
      try {
        const users = JSON.parse(localStorage.getItem('dms_users')) || [];
        this._userMap = {};
        users.forEach(function (u) {
          this._userMap[u.id] = { fullName: u.fullName, email: u.email };
        }, this);
      } catch (e) {
        this._userMap = {};
      }
    },

    /** Load all master records enriched with sub-table data */
    loadAll() {
      this._loadUsers();
      this.records = DonationService.getAllRecords().map(function (r) {
        const enriched = {
          id:              r.id,
          userId:          r.userId,
          type:            r.type,
          createdAt:       r.createdAt,
          approved:        r.approved,
          approvedAt:      r.approvedAt      || null,
          rejectedAt:      r.rejectedAt      || null,
          rejectionReason: r.rejectionReason || null
        };
        if (r.type === 'food') {
          const sub = DonationService.getFoodByDonationId(r.id) || {};
          enriched.rice_qty = sub.rice_qty != null ? sub.rice_qty : 0;
          enriched.veg_qty  = sub.veg_qty  != null ? sub.veg_qty  : 0;
        } else if (r.type === 'apparel') {
          const sub = DonationService.getClothesByDonationId(r.id) || {};
          enriched.target_age = sub.target_age != null ? sub.target_age : null;
        } else if (r.type === 'money') {
          const sub = DonationService.getMoneyByDonationId(r.id) || {};
          enriched.transaction_id = sub.transaction_id || '';
          enriched.qr_payload     = sub.qr_payload     || '';
          enriched.status         = sub.status         || false;
        }
        return enriched;
      });
    },

    /* ── Filtered view for x-for ── */
    get filtered() {
      let rows = this.records.slice();

      if (this.filterType !== 'all') {
        const ft = this.filterType;
        rows = rows.filter(function (r) { return r.type === ft; });
      }

      if (this.filterStatus !== 'all') {
        if (this.filterStatus === 'pending') {
          rows = rows.filter(function (r) { return r.approved === null; });
        } else if (this.filterStatus === 'approved') {
          rows = rows.filter(function (r) { return r.approved === true; });
        } else if (this.filterStatus === 'rejected') {
          rows = rows.filter(function (r) { return r.approved === false; });
        }
      }

      if (this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase();
        rows = rows.filter(function (r) {
          return r.id.toLowerCase().includes(q) ||
                 r.userId.toLowerCase().includes(q) ||
                 r.type.includes(q);
        });
      }

      return rows;
    },

    /* ── Counts ── */
    get totalCount()    { return this.records.length; },
    get pendingCount()  { return this.records.filter(function (r) { return r.approved === null;  }).length; },
    get approvedCount() { return this.records.filter(function (r) { return r.approved === true;  }).length; },
    get rejectedCount() { return this.records.filter(function (r) { return r.approved === false; }).length; },

    /* ── Actions ── */

    approve(donationId) {
      const record = this.records.find(function (r) { return r.id === donationId; });
      DonationService.approveRecord(donationId);
      /* Notify the donor */
      if (record) {
        DonationService.addNotification(
          record.userId, record.id, 'approved',
          'Your ' + record.type + ' donation has been approved!',
          null
        );
      }
      this.loadAll();
      showToast('Record approved and donor notified.', 'success');
    },

    /* Opens the reject-reason modal instead of rejecting immediately */
    reject(donationId) {
      this.rejectTargetId  = donationId;
      this.rejectReason    = '';
      this.rejectError     = '';
      this.rejectModalOpen = true;
    },

    confirmReject() {
      if (!this.rejectReason.trim()) {
        this.rejectError = 'A reason for rejection is required.';
        return;
      }
      const id     = this.rejectTargetId;
      const record = this.records.find(function (r) { return r.id === id; });
      DonationService.rejectRecord(id, this.rejectReason);
      /* Notify the donor */
      if (record) {
        DonationService.addNotification(
          record.userId, record.id, 'rejected',
          'Your ' + record.type + ' donation was rejected.',
          this.rejectReason
        );
      }
      this.cancelReject();
      this.loadAll();
      showToast('Record rejected and donor notified.', 'warning');
    },

    cancelReject() {
      this.rejectModalOpen = false;
      this.rejectTargetId  = null;
      this.rejectReason    = '';
      this.rejectError     = '';
    },

    deleteRec(donationId) {
      if (!confirm('Delete this record? This cannot be undone.')) return;
      DonationService.deleteRecord(donationId);
      this.loadAll();
      showToast('Record deleted.', 'info');
    },

    /* ── Edit modal ── */

    startEdit(record) {
      this.editRecord = record;
      if (record.type === 'food') {
        this.editData = { rice_qty: record.rice_qty, veg_qty: record.veg_qty };
      } else if (record.type === 'apparel') {
        this.editData = { target_age: record.target_age };
      } else if (record.type === 'money') {
        this.editData = { transaction_id: record.transaction_id };
      }
      this.editError  = '';
      this.editOpen   = true;
    },

    cancelEdit() {
      this.editOpen   = false;
      this.editRecord = null;
      this.editData   = {};
      this.editError  = '';
    },

    async saveEdit() {
      if (!this.editRecord) return;
      this.editError   = '';
      this.editLoading = true;
      await new Promise(function (r) { setTimeout(r, 400); });

      try {
        const id   = this.editRecord.id;
        const type = this.editRecord.type;

        if (type === 'food') {
          const rice = parseInt(this.editData.rice_qty, 10);
          const veg  = parseInt(this.editData.veg_qty,  10);
          if (isNaN(rice) || rice < 0 || isNaN(veg) || veg < 0) {
            this.editError   = 'Quantities must be non-negative integers.';
            this.editLoading = false;
            return;
          }
          DonationService.updateFoodRecord(id, rice, veg);

        } else if (type === 'apparel') {
          DonationService.updateApparelRecord(id, this.editData.target_age);

        } else if (type === 'money') {
          const txn = (this.editData.transaction_id || '').trim();
          if (!txn) {
            this.editError   = 'Transaction ID cannot be empty.';
            this.editLoading = false;
            return;
          }
          DonationService.updateMoneyRecord(id, txn);
        }

        this.editLoading = false;
        this.cancelEdit();
        this.loadAll();
        showToast('Record updated.', 'success');
      } catch (err) {
        this.editError   = err.message || 'Update failed.';
        this.editLoading = false;
      }
    },

    /* ── Display helpers ── */

    userName(userId) {
      return (this._userMap[userId] || {}).fullName || userId;
    },

    userEmail(userId) {
      return (this._userMap[userId] || {}).email || '';
    },

    formatDate(iso) {
      if (!iso) return '\u2014';
      return new Date(iso).toLocaleString();
    },

    approvalLabel(approved) {
      if (approved === true)  return 'Approved';
      if (approved === false) return 'Rejected';
      return 'Pending';
    },

    approvalClass(approved) {
      if (approved === true)  return 'status-approved';
      if (approved === false) return 'status-rejected';
      return 'status-pending';
    },

    detailSummary(r) {
      if (r.type === 'food')    return 'Rice: ' + (r.rice_qty ?? '\u2014') + ' kg \u00b7 Veg: ' + (r.veg_qty ?? '\u2014') + ' kg';
      if (r.type === 'apparel') {
        var lbl = this.AGE_LABEL_MAP[r.target_age] || '';
        return 'Age ' + (r.target_age ?? '\u2014') + (lbl ? ' \u2014 ' + lbl : '');
      }
      if (r.type === 'money')   return r.transaction_id || '\u2014';
      return '';
    },

    /* ── Approved Inventory Overview ── */

    get inventory() {
      return DonationService.getApprovedInventory();
    },

    AGE_LABEL_MAP: {
      10: 'Children (\u226410)',
      19: 'Teens (11\u201319)',
      20: 'Young Adults (20s)',
      30: 'Adults (30s)',
      45: 'Middle Age (45+)'
    }
  });

});
