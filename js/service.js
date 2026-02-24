/* =========================================================
   SERVICE MODULE — Donation Records + Normalized Sub-Tables
   =========================================================
   Storage keys:
     dms_donation_records  → Master Table  (PK, user_id, category, created_at)
     dms_food_donations    → Food_Donations   (rice_qty, veg_qty)
     dms_clothes_donations → Clothes_Donations (target_age)
     dms_money_donations   → Money_Donations  (transaction_id, status)
     dms_notifications     → Donor notifications (approved/rejected alerts)
   ========================================================= */

(function (global) {
  'use strict';

  /* ── Storage keys ──────────────────────────────────────── */
  const RECORDS_KEY = 'dms_donation_records';   /* Master Table          */
  const FOOD_KEY    = 'dms_food_donations';      /* Food_Donations        */
  const CLOTHES_KEY = 'dms_clothes_donations';   /* Clothes_Donations     */
  const MONEY_KEY   = 'dms_money_donations';     /* Money_Donations       */
  const NOTIF_KEY   = 'dms_notifications';       /* Donor Notifications   */

  /* ── Validated target-age values ──────────────────────── */
  const VALID_AGES  = [10, 19, 20, 30, 45];

  /* ── Private helpers ───────────────────────────────────── */

  /** Generic table load */
  function _loadTable(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { return []; }
  }

  /** Generic table save */
  function _saveTable(key, rows) {
    localStorage.setItem(key, JSON.stringify(rows));
  }

  /* Convenience aliases for the master table */
  function _load()         { return _loadTable(RECORDS_KEY); }
  function _save(records)  { _saveTable(RECORDS_KEY, records); }

  /**
   * Generate a prefixed, time-ordered unique ID.
   * @param {string} [prefix='dr'] - two-letter table prefix
   */
  function _genId(prefix) {
    return (prefix || 'dr') + '_' + Date.now() + '_' +
      Math.random().toString(36).slice(2, 7);
  }

  /**
   * Verify the relationship: master row + sub-table FK row both exist.
   * Called immediately after both writes to confirm a full COMMIT.
   *
   * @param {string} donationId  Master Table PK
   * @param {string} subTableKey Storage key of the sub-table  (FOOD_KEY etc.)
   * @returns {boolean}
   */
  function _verifyCommit(donationId, subTableKey) {
    const masterExists = !!getRecordById(donationId);
    const subExists    = _loadTable(subTableKey).some(function (r) {
      return r.donation_id === donationId;
    });
    return masterExists && subExists;
  }

  /**
   * Write a one-time "Thanks for Donating" flag to sessionStorage.
   * Only called after _verifyCommit returns true.
   * Consumed once by confirmation.html then immediately removed.
   *
   * @param {object} masterRecord
   */
  function _setThanksFlag(masterRecord) {
    try {
      sessionStorage.setItem('dms_thanks', JSON.stringify({
        committed:   true,
        donationId:  masterRecord.id,
        type:        masterRecord.type,
        committedAt: new Date().toISOString()
      }));
    } catch (e) { /* sessionStorage unavailable — degrade gracefully */ }
  }

  /**
   * Broadcast the global donationSuccess custom event.
   * Listeners on module pages call redirectTo( confirmation.html ).
   */
  function _dispatchSuccess(record) {
    global.dispatchEvent(new CustomEvent('donationSuccess', { detail: record }));
  }


  /* ═══════════════════════════════════════════════════════
     PUBLIC API — Save methods
  ═══════════════════════════════════════════════════════ */

  /**
   * Path A — Food Inventory.
   * Writes one row to the Master Table and one row to Food_Donations.
   *
   * @param {string} userId
   * @param {number} rice       Integer quantity (kg)
   * @param {number} vegetables Integer quantity (kg)
   * @returns {object} master record
   */
  function saveFoodRecord(userId, rice, vegetables) {
    const riceQty = parseInt(rice, 10);
    const vegQty  = parseInt(vegetables, 10);

    /* ── Master Table insert ── */
    const masterRows = _load();
    const record = {
      id:        _genId('dr'),
      userId,
      type:      'food',
      createdAt: new Date().toISOString(),
      approved:        null,      /* null = pending, true = approved, false = rejected */
      donation_status: 'pending'  /* Enum: 'pending' | 'approved' | 'rejected' */
    };
    masterRows.unshift(record);
    _save(masterRows);

    /* ── Food_Donations insert ── */
    const foodRows = _loadTable(FOOD_KEY);
    foodRows.unshift({
      id:          _genId('fd'),
      donation_id: record.id,   /* FK → Master Table */
      rice_qty:    riceQty,
      veg_qty:     vegQty
    });
    _saveTable(FOOD_KEY, foodRows);

    if (_verifyCommit(record.id, FOOD_KEY)) _setThanksFlag(record);
    _dispatchSuccess(record);
    return record;
  }

  /**
   * Path B — Apparel (Clothes) Donation.
   * Writes one row to the Master Table and one row to Clothes_Donations.
   *
   * @param {string} userId
   * @param {number} ageGroup  Must be one of [10, 19, 20, 30, 45]
   * @returns {object} master record
   */
  function saveApparelRecord(userId, ageGroup) {
    const targetAge = parseInt(ageGroup, 10);

    if (!VALID_AGES.includes(targetAge)) {
      throw new RangeError(
        'target_age must be one of ' + VALID_AGES.join(', ') +
        '. Received: ' + targetAge
      );
    }

    /* ── Master Table insert ── */
    const masterRows = _load();
    const record = {
      id:        _genId('dr'),
      userId,
      type:      'apparel',
      createdAt: new Date().toISOString(),
      approved:        null,      /* null = pending, true = approved, false = rejected */
      donation_status: 'pending'  /* Enum: 'pending' | 'approved' | 'rejected' */
    };
    masterRows.unshift(record);
    _save(masterRows);

    /* ── Clothes_Donations insert ── */
    const clothesRows = _loadTable(CLOTHES_KEY);
    clothesRows.unshift({
      id:          _genId('cd'),
      donation_id: record.id,   /* FK → Master Table */
      target_age:  targetAge
    });
    _saveTable(CLOTHES_KEY, clothesRows);

    if (_verifyCommit(record.id, CLOTHES_KEY)) _setThanksFlag(record);
    _dispatchSuccess(record);
    return record;
  }

  /**
   * Path C step 1 — QR code scanned (payment captured, not yet confirmed).
   * Creates a Master Table row and a Money_Donations row with status = false.
   * Call completeMoney( donationId ) to finalize.
   *
   * @param {string} userId
   * @param {string} qrPayload  Raw string decoded from QR code
   * @returns {object} master record { id, transactionRef }
   */
  function createPendingMoney(userId, qrPayload) {
    const transactionId = 'TXN-' + Date.now();

    /* ── Master Table insert ── */
    const masterRows = _load();
    const record = {
      id:        _genId('dr'),
      userId,
      type:      'money',
      createdAt: new Date().toISOString(),
      approved:        null,      /* null = pending, true = approved, false = rejected */
      donation_status: 'pending'  /* Enum: 'pending' | 'approved' | 'rejected' */
    };
    masterRows.unshift(record);
    _save(masterRows);

    /* ── Money_Donations insert (status: false — pending) ── */
    const moneyRows = _loadTable(MONEY_KEY);
    moneyRows.unshift({
      id:             _genId('md'),
      donation_id:    record.id,   /* FK → Master Table */
      transaction_id: transactionId,
      qr_payload:     qrPayload,
      status:         false        /* Completion not yet reached */
    });
    _saveTable(MONEY_KEY, moneyRows);

    /* Attach for in-memory convenience (not persisted on master) */
    record.transactionId = transactionId;
    return record;
  }

  /**
   * Path C step 2 — "Completion" reached.
   * Flips Money_Donations.status to true and dispatches donationSuccess.
   *
   * @param {string} donationId  Master Table PK from createPendingMoney()
   * @returns {object|null} master record
   */
  function completeMoney(donationId) {
    const moneyRows = _loadTable(MONEY_KEY);
    const row = moneyRows.find(function (r) {
      return r.donation_id === donationId;
    });

    if (row) {
      row.status = true;        /* Completion reached */
      _saveTable(MONEY_KEY, moneyRows);
    }

    const record = getRecordById(donationId);
    if (record) {
      if (_verifyCommit(donationId, MONEY_KEY)) _setThanksFlag(record);
      _dispatchSuccess(record);
    }
    return record;
  }

  /**
   * Cancel a pending Money record (e.g. user hit "Re-scan").
   * Removes the master row and its Money_Donations row.
   *
   * @param {string} donationId
   */
  function cancelPendingMoney(donationId) {
    const masterRows = _load().filter(function (r) {
      return r.id !== donationId;
    });
    _save(masterRows);

    const moneyRows = _loadTable(MONEY_KEY).filter(function (r) {
      return r.donation_id !== donationId;
    });
    _saveTable(MONEY_KEY, moneyRows);
  }

  /**
   * Legacy convenience wrapper — creates + immediately completes a money record.
   * Kept for backward compatibility; prefer createPendingMoney + completeMoney.
   *
   * @param {string} userId
   * @param {string} qrPayload
   * @returns {object} master record
   */
  function saveMoneyRecord(userId, qrPayload) {
    const record = createPendingMoney(userId, qrPayload);
    completeMoney(record.id);
    return record;
  }


  /* ═══════════════════════════════════════════════════════
     PUBLIC API — Read methods
  ═══════════════════════════════════════════════════════ */

  /**
   * Donor query — scoped to a single user.
   * Equivalent to: SELECT * FROM donations WHERE user_id = :userId
   * Used by all donor-facing pages (food-inventory, apparel, money, dashboard).
   * Regular users must NEVER call getAllRecords() — use this instead.
   */
  function getRecordsByUser(userId) {
    return _load().filter(function (r) { return r.userId === userId; });
  }

  /**
   * Admin query — global, unfiltered view of all donations from all users.
   * Equivalent to: SELECT * FROM donations
   * Restricted to admin sessions only (requireAdmin() guard on calling pages).
   * Donors are never given access to this function's output.
   */
  function getAllRecords() {
    return _load();
  }

  /** Single master record by PK. */
  function getRecordById(id) {
    return _load().find(function (r) { return r.id === id; }) || null;
  }

  /**
   * All Food_Donations rows (most-recent first).
   * Schema: { id, donation_id(FK), rice_qty, veg_qty }
   */
  function getFoodDonations() {
    return _loadTable(FOOD_KEY);
  }

  /**
   * All Clothes_Donations rows (most-recent first).
   * Schema: { id, donation_id(FK), target_age }
   */
  function getClothesDonations() {
    return _loadTable(CLOTHES_KEY);
  }

  /**
   * All Money_Donations rows (most-recent first).
   * Schema: { id, donation_id(FK), transaction_id, qr_payload, status }
   */
  function getMoneyDonations() {
    return _loadTable(MONEY_KEY);
  }

  /**
   * Lookup the Food_Donations row for a given master donation_id.
   * @param {string} donationId
   * @returns {object|null}
   */
  function getFoodByDonationId(donationId) {
    return _loadTable(FOOD_KEY).find(function (r) {
      return r.donation_id === donationId;
    }) || null;
  }

  /**
   * Lookup the Clothes_Donations row for a given master donation_id.
   * @param {string} donationId
   * @returns {object|null}
   */
  function getClothesByDonationId(donationId) {
    return _loadTable(CLOTHES_KEY).find(function (r) {
      return r.donation_id === donationId;
    }) || null;
  }

  /**
   * Lookup the Money_Donations row for a given master donation_id.
   * @param {string} donationId
   * @returns {object|null}
   */
  function getMoneyByDonationId(donationId) {
    return _loadTable(MONEY_KEY).find(function (r) {
      return r.donation_id === donationId;
    }) || null;
  }


  /* ═══════════════════════════════════════════════════════
     PUBLIC API — Admin methods (require admin session)
  ═══════════════════════════════════════════════════════ */

  /**
   * Approve a donation record.
   * Equivalent to:
   *   UPDATE donations
   *   SET status = 'approved', approved_by = [admin_id], approved_at = NOW()
   *   WHERE id = [donationId] AND (SELECT role FROM dms_users WHERE id = [admin_id]) = 'admin'
   *
   * Authorization: reads dms_session and rejects the call if the active
   * session is missing or does not carry role === 'admin'.
   *
   * @param {string} donationId
   * @returns {object|null} updated master record
   */
  function approveRecord(donationId) {
    /* ── Authorization guard ── */
    var session = null;
    try { session = JSON.parse(localStorage.getItem('dms_session')); } catch (e) {}
    if (!session || session.role !== 'admin') {
      throw new Error('approveRecord: administrator session required.');
    }

    const rows = _load();
    const row  = rows.find(function (r) { return r.id === donationId; });
    if (!row) return null;
    row.approved         = true;
    row.approvedAt       = new Date().toISOString();
    row.approvedBy       = session.userId;   /* audit — which admin approved */
    row.donation_status  = 'approved';
    delete row.rejectedAt;
    delete row.rejectedBy;
    _save(rows);
    return row;
  }

  /**
   * Reject a donation record.
   * Equivalent to:
   *   UPDATE donations
   *   SET status = 'rejected', rejected_by = [admin_id], rejected_at = NOW(),
   *       rejection_reason = [reason]
   *   WHERE id = [donationId] AND (SELECT role FROM dms_users WHERE id = [admin_id]) = 'admin'
   *
   * Authorization: reads dms_session and rejects the call if the active
   * session is missing or does not carry role === 'admin'.
   *
   * @param {string} donationId
   * @param {string} reason  Mandatory explanation shown to the donor
   * @returns {object|null} updated master record
   */
  function rejectRecord(donationId, reason) {
    /* ── Authorization guard ── */
    var session = null;
    try { session = JSON.parse(localStorage.getItem('dms_session')); } catch (e) {}
    if (!session || session.role !== 'admin') {
      throw new Error('rejectRecord: administrator session required.');
    }

    const rows = _load();
    const row  = rows.find(function (r) { return r.id === donationId; });
    if (!row) return null;
    row.approved         = false;
    row.rejectedAt       = new Date().toISOString();
    row.rejectedBy       = session.userId;   /* audit — which admin rejected */
    row.rejectionReason  = (reason || '').trim();
    row.donation_status  = 'rejected';
    delete row.approvedAt;
    delete row.approvedBy;
    _save(rows);
    return row;
  }

  /**
   * Delete a donation record and its corresponding sub-table row(s).
   * Cascades across all three sub-tables (safe even if unrelated).
   * @param {string} donationId
   */
  function deleteRecord(donationId) {
    /* Master Table */
    _save(_load().filter(function (r) { return r.id !== donationId; }));

    /* Food_Donations */
    _saveTable(FOOD_KEY,
      _loadTable(FOOD_KEY).filter(function (r) { return r.donation_id !== donationId; }));

    /* Clothes_Donations */
    _saveTable(CLOTHES_KEY,
      _loadTable(CLOTHES_KEY).filter(function (r) { return r.donation_id !== donationId; }));

    /* Money_Donations */
    _saveTable(MONEY_KEY,
      _loadTable(MONEY_KEY).filter(function (r) { return r.donation_id !== donationId; }));
  }

  /**
   * Update rice / vegetable quantities for a food donation record.
   * @param {string} donationId
   * @param {number} rice
   * @param {number} veg
   * @returns {object|null} updated sub-table row
   */
  function updateFoodRecord(donationId, rice, veg) {
    const rows = _loadTable(FOOD_KEY);
    const row  = rows.find(function (r) { return r.donation_id === donationId; });
    if (!row) return null;
    row.rice_qty = parseInt(rice, 10);
    row.veg_qty  = parseInt(veg,  10);
    _saveTable(FOOD_KEY, rows);
    return row;
  }

  /**
   * Update the target age group for an apparel donation record.
   * @param {string} donationId
   * @param {number} targetAge  Must be one of VALID_AGES
   * @returns {object|null} updated sub-table row
   */
  function updateApparelRecord(donationId, targetAge) {
    const age = parseInt(targetAge, 10);
    if (!VALID_AGES.includes(age)) {
      throw new RangeError('target_age must be one of ' + VALID_AGES.join(', '));
    }
    const rows = _loadTable(CLOTHES_KEY);
    const row  = rows.find(function (r) { return r.donation_id === donationId; });
    if (!row) return null;
    row.target_age = age;
    _saveTable(CLOTHES_KEY, rows);
    return row;
  }

  /**
   * Update the transaction ID for a money donation record.
   * @param {string} donationId
   * @param {string} transactionId
   * @returns {object|null} updated sub-table row
   */
  function updateMoneyRecord(donationId, transactionId) {
    const rows = _loadTable(MONEY_KEY);
    const row  = rows.find(function (r) { return r.donation_id === donationId; });
    if (!row) return null;
    row.transaction_id = transactionId;
    _saveTable(MONEY_KEY, rows);
    return row;
  }


  /* ═══════════════════════════════════════════════════════
     PUBLIC API — Notification methods
  ═══════════════════════════════════════════════════════ */

  /**
   * Write a notification for a donor.
   * Called by admin after approve/reject.
   *
   * @param {string} userId       Donor user ID
   * @param {string} donationId   Related master record PK
   * @param {string} type         'approved' | 'rejected'
   * @param {string} message      Human-readable message
   * @param {string} [reason]     Rejection reason (only for 'rejected')
   */
  function addNotification(userId, donationId, type, message, reason) {
    const notifs = _loadTable(NOTIF_KEY);
    notifs.unshift({
      id:         'n_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      userId,
      donationId,
      type,
      message,
      reason:     reason ? reason.trim() : null,
      createdAt:  new Date().toISOString(),
      read:       false
    });
    _saveTable(NOTIF_KEY, notifs);
  }

  /** All notifications for a given user, most-recent first. */
  function getNotificationsForUser(userId) {
    return _loadTable(NOTIF_KEY).filter(function (n) {
      return n.userId === userId;
    });
  }

  /** Count of unread notifications for a given user. */
  function getUnreadCountForUser(userId) {
    return _loadTable(NOTIF_KEY).filter(function (n) {
      return n.userId === userId && !n.read;
    }).length;
  }

  /** Mark a single notification as read by its ID. */
  function markNotificationRead(notifId) {
    const notifs = _loadTable(NOTIF_KEY);
    const n = notifs.find(function (x) { return x.id === notifId; });
    if (n) { n.read = true; _saveTable(NOTIF_KEY, notifs); }
  }

  /** Mark all of a user's notifications as read. */
  function markAllNotificationsRead(userId) {
    const notifs = _loadTable(NOTIF_KEY);
    notifs.forEach(function (n) { if (n.userId === userId) n.read = true; });
    _saveTable(NOTIF_KEY, notifs);
  }


  /* ═══════════════════════════════════════════════════════
     PUBLIC API — Inventory Overview
  ═══════════════════════════════════════════════════════ */

  /**
   * Compute the approved inventory totals across all sub-tables.
   * Only records with approved === true are counted.
   *
   * @returns {{
   *   rice_kg:     number,
   *   veg_kg:      number,
   *   clothes:     Object<number,number>,  age → count
   *   money_count: number,
   *   total:       number
   * }}
   */
  function getApprovedInventory() {
    const records = _load().filter(function (r) { return r.approved === true; });

    var rice_kg     = 0;
    var veg_kg      = 0;
    var clothes     = {};  /* target_age → donation count */
    var money_count = 0;

    records.forEach(function (r) {
      if (r.type === 'food') {
        var sub = _loadTable(FOOD_KEY).find(function (s) {
          return s.donation_id === r.id;
        }) || {};
        rice_kg += (sub.rice_qty || 0);
        veg_kg  += (sub.veg_qty  || 0);

      } else if (r.type === 'apparel') {
        var sub = _loadTable(CLOTHES_KEY).find(function (s) {
          return s.donation_id === r.id;
        }) || {};
        if (sub.target_age != null) {
          clothes[sub.target_age] = (clothes[sub.target_age] || 0) + 1;
        }

      } else if (r.type === 'money') {
        money_count++;
      }
    });

    return {
      rice_kg:     rice_kg,
      veg_kg:      veg_kg,
      clothes:     clothes,
      money_count: money_count,
      total:       records.length
    };
  }


  /* ── Export ────────────────────────────────────────────── */
  global.DonationService = {
    /* Write */
    saveFoodRecord,
    saveApparelRecord,
    createPendingMoney,
    completeMoney,
    cancelPendingMoney,
    saveMoneyRecord,      /* legacy */

    /* Read — Master Table */
    getRecordsByUser,
    getAllRecords,
    getRecordById,

    /* Read — Sub-Tables */
    getFoodDonations,
    getClothesDonations,
    getMoneyDonations,
    getFoodByDonationId,
    getClothesByDonationId,
    getMoneyByDonationId,

    /* Admin — Approve / Reject / Delete */
    approveRecord,
    rejectRecord,
    deleteRecord,

    /* Admin — Edit sub-table fields */
    updateFoodRecord,
    updateApparelRecord,
    updateMoneyRecord,

    /* Notifications */
    addNotification,
    getNotificationsForUser,
    getUnreadCountForUser,
    markNotificationRead,
    markAllNotificationsRead,

    /* Inventory */
    getApprovedInventory,

    /* Meta */
    VALID_AGES
  };

})(window);
