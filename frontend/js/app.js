// Co-working Space Booking System - Frontend Application Logic
const API_BASE = '/api';

// State Cache
let state = {
  spaces: [],
  plans: [],
  rooms: [],
  members: [],
  bookings: [],
  payments: []
};

// Toast Notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-emerald-600' : (type === 'error' ? 'bg-rose-600' : 'bg-sky-600');
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info');

  toast.className = `${bgColor} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm transition-all transform duration-300 translate-y-2 opacity-0 pointer-events-auto`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-lg"></i>
    <div class="flex-1 font-medium">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-white/70 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Tab Switching
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

  const targetSection = document.getElementById(`tab-${tabId}`);
  const targetBtn = document.getElementById(`tab-btn-${tabId}`);

  if (targetSection) targetSection.classList.remove('hidden');
  if (targetBtn) targetBtn.classList.add('active');
}

// Modal Helpers
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// ====================================================================
// DATA LOADING & RENDERING
// ====================================================================

async function refreshAllData() {
  await Promise.all([
    loadStats(),
    loadSpaces(),
    loadPlans(),
    loadRooms(),
    loadMembers(),
    loadBookings(),
    loadPayments()
  ]);
}

async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    if (data.success) {
      document.getElementById('stat-spaces').textContent = data.stats.totalSpaces;
      document.getElementById('stat-rooms').textContent = data.stats.availableRooms;
      document.getElementById('stat-members').textContent = data.stats.totalMembers;
      document.getElementById('stat-revenue').textContent = `₹ ${Number(data.stats.totalRevenue).toLocaleString()}`;
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

async function loadSpaces() {
  try {
    const res = await fetch(`${API_BASE}/spaces`);
    const data = await res.json();
    if (data.success) {
      state.spaces = data.data;
      const spaceSelect = document.getElementById('room-space-id');
      if (spaceSelect) {
        spaceSelect.innerHTML = state.spaces.map(s => `
          <option value="${s.SPACE_ID}">${s.NAME} (${s.CITY})</option>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Failed to load spaces:', err);
  }
}

async function loadPlans() {
  try {
    const res = await fetch(`${API_BASE}/members/plans`);
    const data = await res.json();
    if (data.success) {
      state.plans = data.data;
      const planSelect = document.getElementById('member-plan-id');
      if (planSelect) {
        planSelect.innerHTML = `<option value="">-- None / Pay per use --</option>` + state.plans.map(p => `
          <option value="${p.PLAN_ID}">${p.PLAN_NAME} (₹${p.MONTHLY_FEE}/mo)</option>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Failed to load plans:', err);
  }
}

// ----------------- ROOMS CRUD -----------------
async function loadRooms() {
  try {
    const res = await fetch(`${API_BASE}/rooms`);
    const data = await res.json();
    if (data.success) {
      state.rooms = data.data;
      renderRoomsTable(state.rooms);
      populateBookingRoomsSelect(state.rooms);
    }
  } catch (err) {
    console.error('Failed to load rooms:', err);
  }
}

function renderRoomsTable(rooms) {
  const tbody = document.getElementById('rooms-table-body');
  if (!rooms || rooms.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-slate-400">No rooms found in database.</td></tr>`;
    return;
  }

  tbody.innerHTML = rooms.map(r => {
    const statusColor = r.STATUS === 'AVAILABLE' 
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : (r.STATUS === 'OCCUPIED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20');

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="px-6 py-4 font-mono text-xs text-sky-400">#${r.ROOM_ID}</td>
        <td class="px-6 py-4 font-semibold text-white">${r.ROOM_NAME}</td>
        <td class="px-6 py-4 text-slate-400">${r.SPACE_NAME || 'Main Space'} <span class="text-xs text-slate-500">(${r.CITY || 'Chennai'})</span></td>
        <td class="px-6 py-4 text-slate-300">${r.ROOM_TYPE}</td>
        <td class="px-6 py-4 text-slate-300"><i class="fa-solid fa-users text-xs mr-1 text-slate-400"></i> ${r.CAPACITY} pax</td>
        <td class="px-6 py-4 font-medium text-emerald-400">₹ ${Number(r.HOURLY_RATE).toFixed(2)}/hr</td>
        <td class="px-6 py-4">
          <span class="px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColor}">
            ${r.STATUS}
          </span>
        </td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="openEditRoomModal(${r.ROOM_ID})" class="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium border border-amber-500/30 transition flex items-center gap-1">
              <i class="fa-solid fa-pen-to-square"></i> Update
            </button>
            <button onclick="deleteRoom(${r.ROOM_ID})" class="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium border border-rose-500/30 transition flex items-center gap-1">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openNewRoomModal() {
  document.getElementById('room-modal-title').textContent = 'Add Meeting Room (Insert)';
  document.getElementById('room-id').value = '';
  document.getElementById('room-form').reset();
  openModal('room-modal');
}

function openEditRoomModal(roomId) {
  const room = state.rooms.find(r => Number(r.ROOM_ID) === Number(roomId));
  if (!room) return;

  document.getElementById('room-modal-title').textContent = `Update Room #${roomId}`;
  document.getElementById('room-id').value = room.ROOM_ID;
  document.getElementById('room-space-id').value = room.SPACE_ID;
  document.getElementById('room-name').value = room.ROOM_NAME;
  document.getElementById('room-type').value = room.ROOM_TYPE;
  document.getElementById('room-capacity').value = room.CAPACITY;
  document.getElementById('room-rate').value = room.HOURLY_RATE;
  document.getElementById('room-status').value = room.STATUS;

  openModal('room-modal');
}

async function handleRoomSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('room-id').value;
  const payload = {
    space_id: document.getElementById('room-space-id').value,
    room_name: document.getElementById('room-name').value,
    room_type: document.getElementById('room-type').value,
    capacity: document.getElementById('room-capacity').value,
    hourly_rate: document.getElementById('room-rate').value,
    status: document.getElementById('room-status').value
  };

  try {
    const url = id ? `${API_BASE}/rooms/${id}` : `${API_BASE}/rooms`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      closeModal('room-modal');
      await loadRooms();
      await loadStats();
    } else {
      showToast(data.error || 'Operation failed', 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteRoom(id) {
  if (!confirm(`Are you sure you want to delete Room #${id}? This will cascade delete linked facilities and bookings in Oracle.`)) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      await loadRooms();
      await loadStats();
    } else {
      showToast(data.error || 'Failed to delete room', 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ----------------- MEMBERS CRUD -----------------
async function loadMembers() {
  try {
    const res = await fetch(`${API_BASE}/members`);
    const data = await res.json();
    if (data.success) {
      state.members = data.data;
      renderMembersTable(state.members);
      populateBookingMembersSelect(state.members);
    }
  } catch (err) {
    console.error('Failed to load members:', err);
  }
}

function renderMembersTable(members) {
  const tbody = document.getElementById('members-table-body');
  if (!members || members.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-slate-400">No members found.</td></tr>`;
    return;
  }

  tbody.innerHTML = members.map(m => `
    <tr class="hover:bg-slate-800/40 transition">
      <td class="px-6 py-4 font-mono text-xs text-sky-400">#${m.MEMBER_ID}</td>
      <td class="px-6 py-4 font-semibold text-white">${m.FIRST_NAME} ${m.LAST_NAME}</td>
      <td class="px-6 py-4 text-slate-400">${m.EMAIL}</td>
      <td class="px-6 py-4 text-slate-300 font-mono text-xs">${m.PHONE || '-'}</td>
      <td class="px-6 py-4">
        <span class="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          ${m.PLAN_NAME || 'Standard'}
        </span>
      </td>
      <td class="px-6 py-4 text-slate-400 text-xs">${m.JOIN_DATE}</td>
      <td class="px-6 py-4">
        <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ${m.STATUS}
        </span>
      </td>
      <td class="px-6 py-4 text-right">
        <div class="flex items-center justify-end gap-2">
          <button onclick="openEditMemberModal(${m.MEMBER_ID})" class="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium border border-amber-500/30 transition flex items-center gap-1">
            <i class="fa-solid fa-pen-to-square"></i> Update
          </button>
          <button onclick="deleteMember(${m.MEMBER_ID})" class="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium border border-rose-500/30 transition flex items-center gap-1">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openNewMemberModal() {
  document.getElementById('member-modal-title').textContent = 'Register New Member (Insert)';
  document.getElementById('member-id').value = '';
  document.getElementById('member-form').reset();
  openModal('member-modal');
}

function openEditMemberModal(memberId) {
  const m = state.members.find(mem => Number(mem.MEMBER_ID) === Number(memberId));
  if (!m) return;

  document.getElementById('member-modal-title').textContent = `Update Member #${memberId}`;
  document.getElementById('member-id').value = m.MEMBER_ID;
  document.getElementById('member-first-name').value = m.FIRST_NAME;
  document.getElementById('member-last-name').value = m.LAST_NAME;
  document.getElementById('member-email').value = m.EMAIL;
  document.getElementById('member-phone').value = m.PHONE || '';
  document.getElementById('member-plan-id').value = m.PLAN_ID || '';

  openModal('member-modal');
}

async function handleMemberSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('member-id').value;
  const payload = {
    first_name: document.getElementById('member-first-name').value,
    last_name: document.getElementById('member-last-name').value,
    email: document.getElementById('member-email').value,
    phone: document.getElementById('member-phone').value,
    plan_id: document.getElementById('member-plan-id').value || null
  };

  try {
    const url = id ? `${API_BASE}/members/${id}` : `${API_BASE}/members`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      closeModal('member-modal');
      await loadMembers();
      await loadStats();
    } else {
      showToast(data.error || 'Operation failed', 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteMember(id) {
  if (!confirm(`Are you sure you want to delete Member #${id}? Linked bookings will also be removed in Oracle.`)) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/members/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      await loadMembers();
      await loadStats();
    } else {
      showToast(data.error || 'Failed to delete member', 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ----------------- BOOKINGS CRUD & TRIGGER DEMO -----------------
async function loadBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    const data = await res.json();
    if (data.success) {
      state.bookings = data.data;
      renderBookingsTable(state.bookings);
    }
  } catch (err) {
    console.error('Failed to load bookings:', err);
  }
}

function renderBookingsTable(bookings) {
  const tbody = document.getElementById('bookings-table-body');
  if (!bookings || bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-slate-400">No bookings found.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => {
    const statusColor = b.STATUS === 'CONFIRMED'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : (b.STATUS === 'CANCELLED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20');

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="px-6 py-4 font-mono text-xs text-sky-400">#${b.BOOKING_ID}</td>
        <td class="px-6 py-4">
          <div class="font-semibold text-white">${b.MEMBER_NAME}</div>
          <div class="text-xs text-slate-400">${b.EMAIL}</div>
        </td>
        <td class="px-6 py-4">
          <div class="font-medium text-slate-200">${b.ROOM_NAME}</div>
          <div class="text-xs text-slate-500">${b.SPACE_NAME}</div>
        </td>
        <td class="px-6 py-4 font-mono text-xs text-slate-300">${b.BOOKING_DATE}</td>
        <td class="px-6 py-4 font-mono text-xs text-amber-400">${b.START_TIME} - ${b.END_TIME}</td>
        <td class="px-6 py-4 font-bold text-emerald-400">₹ ${Number(b.TOTAL_AMOUNT).toFixed(2)}</td>
        <td class="px-6 py-4">
          <span class="px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColor}">
            ${b.STATUS}
          </span>
        </td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-2">
            ${b.STATUS === 'CONFIRMED' ? `
              <button onclick="cancelBooking(${b.BOOKING_ID})" class="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium border border-amber-500/30 transition flex items-center gap-1">
                <i class="fa-solid fa-ban"></i> Cancel
              </button>
            ` : ''}
            <button onclick="deleteBooking(${b.BOOKING_ID})" class="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium border border-rose-500/30 transition flex items-center gap-1">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function populateBookingRoomsSelect(rooms) {
  const select = document.getElementById('booking-room-id');
  if (!select) return;
  select.innerHTML = rooms.map(r => `
    <option value="${r.ROOM_ID}" data-rate="${r.HOURLY_RATE}">${r.ROOM_NAME} (₹${r.HOURLY_RATE}/hr, ${r.CAPACITY} pax)</option>
  `).join('');
}

function populateBookingMembersSelect(members) {
  const select = document.getElementById('booking-member-id');
  if (!select) return;
  select.innerHTML = members.map(m => `
    <option value="${m.MEMBER_ID}">${m.FIRST_NAME} ${m.LAST_NAME} (${m.EMAIL})</option>
  `).join('');
}

function openNewBookingModal() {
  document.getElementById('booking-form').reset();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('booking-date').value = today;
  document.getElementById('booking-start').value = '10:00';
  document.getElementById('booking-end').value = '12:00';
  calculateBookingPrice();
  openModal('booking-modal');
}

function calculateBookingPrice() {
  const roomSelect = document.getElementById('booking-room-id');
  const selectedOption = roomSelect.options[roomSelect.selectedIndex];
  const rate = selectedOption ? Number(selectedOption.getAttribute('data-rate') || 0) : 0;

  const start = document.getElementById('booking-start').value;
  const end = document.getElementById('booking-end').value;

  if (start && end) {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const durationHours = (eh + em / 60) - (sh + sm / 60);

    if (durationHours > 0) {
      const total = durationHours * rate;
      document.getElementById('booking-calculated-amount').textContent = total.toFixed(2);
      return total;
    }
  }
  document.getElementById('booking-calculated-amount').textContent = '0.00';
  return 0;
}

async function handleBookingSubmit(e) {
  e.preventDefault();
  const totalAmount = calculateBookingPrice();

  if (totalAmount <= 0) {
    showToast('End time must be after Start time!', 'error');
    return;
  }

  const payload = {
    member_id: document.getElementById('booking-member-id').value,
    room_id: document.getElementById('booking-room-id').value,
    booking_date: document.getElementById('booking-date').value,
    start_time: document.getElementById('booking-start').value,
    end_time: document.getElementById('booking-end').value,
    total_amount: totalAmount,
    payment_method: document.getElementById('booking-payment-method').value
  };

  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      closeModal('booking-modal');
      await loadBookings();
      await loadPayments();
      await loadStats();
    } else {
      // Oracle Trigger Error (e.g. ORA-20001 double booking)
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function cancelBooking(id) {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Booking status set to CANCELLED in Oracle DB', 'info');
      await loadBookings();
      await loadStats();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteBooking(id) {
  if (!confirm(`Permanently delete booking #${id} from Oracle DB?`)) return;

  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      await loadBookings();
      await loadPayments();
      await loadStats();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ----------------- PAYMENTS -----------------
async function loadPayments() {
  try {
    const res = await fetch(`${API_BASE}/payments`);
    const data = await res.json();
    if (data.success) {
      state.payments = data.data;
      renderPaymentsTable(state.payments);
    }
  } catch (err) {
    console.error('Failed to load payments:', err);
  }
}

function renderPaymentsTable(payments) {
  const tbody = document.getElementById('payments-table-body');
  if (!payments || payments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-8 text-slate-400">No payment records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = payments.map(p => `
    <tr class="hover:bg-slate-800/40 transition">
      <td class="px-6 py-4 font-mono text-xs text-sky-400">#${p.PAYMENT_ID}</td>
      <td class="px-6 py-4 font-mono text-xs text-slate-400">#${p.BOOKING_ID}</td>
      <td class="px-6 py-4 font-semibold text-white">${p.MEMBER_NAME}</td>
      <td class="px-6 py-4 text-slate-300">${p.ROOM_NAME}</td>
      <td class="px-6 py-4 font-bold text-emerald-400">₹ ${Number(p.AMOUNT).toFixed(2)}</td>
      <td class="px-6 py-4 text-xs font-mono text-indigo-400">${p.PAYMENT_METHOD}</td>
      <td class="px-6 py-4 text-xs text-slate-400">${p.PAYMENT_DATE}</td>
      <td class="px-6 py-4">
        <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ${p.STATUS}
        </span>
      </td>
      <td class="px-6 py-4 text-right">
        <button onclick="deletePayment(${p.PAYMENT_ID})" class="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium border border-rose-500/30 transition">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

async function deletePayment(id) {
  if (!confirm(`Delete payment record #${id}?`)) return;
  try {
    const res = await fetch(`${API_BASE}/payments/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      await loadPayments();
      await loadStats();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ====================================================================
// "TYPE QUERY & FETCH IT" SQL CONSOLE
// ====================================================================

const PRESETS = {
  rooms_and_spaces: `SELECT r.room_id, r.room_name, r.room_type, r.capacity, r.hourly_rate, s.name as space_name, s.city
FROM MEETING_ROOMS r
JOIN COWORKING_SPACES s ON r.space_id = s.space_id
ORDER BY r.capacity DESC`,

  active_bookings: `SELECT b.booking_id, m.first_name || ' ' || m.last_name as member, r.room_name, b.booking_date, b.start_time || ' - ' || b.end_time as slot, b.total_amount
FROM BOOKINGS b
JOIN MEMBERS m ON b.member_id = m.member_id
JOIN MEETING_ROOMS r ON b.room_id = r.room_id
WHERE b.status = 'CONFIRMED'
ORDER BY b.booking_date ASC`,

  revenue_by_room: `SELECT r.room_id, r.room_name, COUNT(b.booking_id) as total_bookings, NVL(SUM(b.total_amount), 0) as total_revenue
FROM MEETING_ROOMS r
LEFT JOIN BOOKINGS b ON r.room_id = b.room_id AND b.status = 'CONFIRMED'
GROUP BY r.room_id, r.room_name
ORDER BY total_revenue DESC`,

  member_plans: `SELECT m.member_id, m.first_name || ' ' || m.last_name as member_name, m.email, p.plan_name, p.monthly_fee
FROM MEMBERS m
JOIN MEMBERSHIP_PLANS p ON m.plan_id = p.plan_id
ORDER BY p.monthly_fee DESC`,

  room_facilities: `SELECT r.room_name, f.facility_name, f.quantity
FROM ROOM_FACILITIES f
JOIN MEETING_ROOMS r ON f.room_id = r.room_id
ORDER BY r.room_name, f.facility_name`,

  all_tables: `SELECT table_name, num_rows, status FROM user_tables ORDER BY table_name`
};

function loadPresetQuery(key) {
  const sql = PRESETS[key];
  if (sql) {
    document.getElementById('sql-input').value = sql;
    executeCustomQuery();
  }
}

async function executeCustomQuery() {
  const sqlInput = document.getElementById('sql-input').value.trim();
  const meta = document.getElementById('query-execution-meta');
  const btn = document.getElementById('btn-run-query');
  const outputContainer = document.getElementById('query-output-container');
  const errorContainer = document.getElementById('query-error-container');
  const errorText = document.getElementById('query-error-text');

  if (!sqlInput) {
    showToast('Please type a SQL query first!', 'error');
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xs"></i> Executing...`;
  meta.textContent = 'Query running on Oracle 21c...';
  outputContainer.classList.add('hidden');
  errorContainer.classList.add('hidden');

  try {
    const res = await fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql: sqlInput })
    });

    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-play text-xs"></i> Execute Query (Fetch)`;

    if (data.success) {
      meta.textContent = `Completed in ${data.executionTimeMs} ms | ${data.rowCount} rows returned`;
      renderQueryResults(data.columns, data.rows);
      outputContainer.classList.remove('hidden');

      // If it was an INSERT, UPDATE, or DELETE, refresh the rest of the application
      if (/^\s*(INSERT|UPDATE|DELETE)/i.test(sqlInput)) {
        showToast('Database updated via SQL query!', 'success');
        refreshAllData();
      }
    } else {
      meta.textContent = `Failed in ${data.executionTimeMs || 0} ms`;
      errorText.textContent = data.error || 'SQL Execution error';
      errorContainer.classList.remove('hidden');
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-play text-xs"></i> Execute Query (Fetch)`;
    meta.textContent = 'Execution failed';
    errorText.textContent = err.message;
    errorContainer.classList.remove('hidden');
  }
}

function renderQueryResults(columns, rows) {
  const thead = document.getElementById('query-table-head');
  const tbody = document.getElementById('query-table-body');
  document.getElementById('query-row-count').textContent = rows.length;

  if (!columns || columns.length === 0) {
    thead.innerHTML = '';
    tbody.innerHTML = `<tr><td class="px-6 py-6 text-center text-slate-400">Command executed successfully (no rows returned).</td></tr>`;
    return;
  }

  thead.innerHTML = `<tr>${columns.map(c => `<th class="px-6 py-3 font-mono text-sky-400">${c}</th>`).join('')}</tr>`;

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${columns.length}" class="px-6 py-6 text-center text-slate-400">0 rows returned.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(row => `
    <tr class="hover:bg-slate-800/50 transition">
      ${columns.map(c => `<td class="px-6 py-3 font-mono text-xs text-slate-300">${row[c] !== null && row[c] !== undefined ? row[c] : '<span class="text-slate-600">NULL</span>'}</td>`).join('')}
    </tr>
  `).join('');
}

// Keyboard shortcut: Ctrl+Enter executes the query
document.addEventListener('DOMContentLoaded', () => {
  const sqlInput = document.getElementById('sql-input');
  if (sqlInput) {
    sqlInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCustomQuery();
      }
    });
  }

  // Initial Load
  refreshAllData();
});
