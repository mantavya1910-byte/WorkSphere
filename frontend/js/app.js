// WorkSphere - Enterprise Frontend Logic & Oracle Integration
const API_BASE = '/api';

// Application State
let state = {
  spaces: [],
  plans: [],
  rooms: [],
  members: [],
  bookings: [],
  payments: [],
  activeCategoryFilter: 'ALL',
  selectedTimelineRoomId: null,
  timelineDate: new Date().toISOString().split('T')[0],
  selectedStartHour: null,
  selectedEndHour: null,
  checkoutData: null,
  appliedPromo: null,
  selectedPaymentMethod: 'UPI'
};

// ====================================================================
// TOAST NOTIFICATIONS & TAB NAVIGATION
// ====================================================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-emerald-600' : (type === 'error' ? 'bg-rose-600' : 'bg-sky-600');
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info');

  toast.className = `${bgColor} text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs transition-all transform duration-300 translate-y-2 opacity-0 pointer-events-auto border border-white/10`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-base"></i>
    <div class="flex-1 font-semibold">${message}</div>
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

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

  const targetSection = document.getElementById(`tab-${tabId}`);
  const targetBtn = document.getElementById(`tab-btn-${tabId}`);

  if (targetSection) targetSection.classList.remove('hidden');
  if (targetBtn) targetBtn.classList.add('active');

  // If switching to timeline, ensure grid is rendered
  if (tabId === 'timeline') {
    renderTimelineGrid();
  }
}

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// ====================================================================
// DATA INITIALIZATION & SYNC
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
  renderDashboard();
  renderCatalog();
  renderTimelineGrid();
}

async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    if (data.success) {
      document.getElementById('stat-spaces').textContent = data.stats.totalSpaces;
      document.getElementById('stat-rooms').textContent = data.stats.availableRooms;
      document.getElementById('stat-bookings').textContent = data.stats.activeBookings;
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

async function loadRooms() {
  try {
    const res = await fetch(`${API_BASE}/rooms`);
    const data = await res.json();
    if (data.success) {
      state.rooms = data.data;
      if (!state.selectedTimelineRoomId && state.rooms.length > 0) {
        state.selectedTimelineRoomId = state.rooms[0].ROOM_ID;
      }
      populateTimelineRoomDropdown();
    }
  } catch (err) {
    console.error('Failed to load rooms:', err);
  }
}

async function loadMembers() {
  try {
    const res = await fetch(`${API_BASE}/members`);
    const data = await res.json();
    if (data.success) {
      state.members = data.data;
      renderMembersTable(state.members);
    }
  } catch (err) {
    console.error('Failed to load members:', err);
  }
}

async function loadBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    const data = await res.json();
    if (data.success) {
      state.bookings = data.data;
      renderDashboardBookings();
    }
  } catch (err) {
    console.error('Failed to load bookings:', err);
  }
}

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

// ====================================================================
// VIEW 1: DASHBOARD ACTIVE RESERVATIONS & QUICK FILTER
// ====================================================================

function renderDashboard() {
  renderDashboardBookings();
  const quickDate = document.getElementById('quick-date');
  if (quickDate && !quickDate.value) {
    quickDate.value = new Date().toISOString().split('T')[0];
  }
}

function renderDashboardBookings() {
  const container = document.getElementById('dashboard-bookings-list');
  if (!container) return;

  const activeBookings = (state.bookings || []).filter(b => b.STATUS === 'CONFIRMED').slice(0, 5);

  if (activeBookings.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-slate-400 text-xs">
        <i class="fa-solid fa-calendar-xmark text-2xl text-slate-300 block mb-2"></i>
        No active reservations found. Click "Book a Time Slot" to lock a space!
      </div>
    `;
    return;
  }

  container.innerHTML = activeBookings.map(b => `
    <div class="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition">
      <div class="flex items-start gap-3.5">
        <div class="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
          <i class="fa-solid fa-door-open"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="font-bold text-slate-900 text-sm">${b.ROOM_NAME}</h4>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">CONFIRMED</span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">${b.SPACE_NAME} • Reserved by <span class="text-slate-800 font-semibold">${b.MEMBER_NAME}</span></p>
          <div class="flex items-center gap-3 text-[11px] text-slate-600 mt-1 font-mono">
            <span><i class="fa-regular fa-calendar text-[10px] mr-1 text-slate-400"></i>${b.BOOKING_DATE}</span>
            <span class="text-blue-700 font-bold"><i class="fa-regular fa-clock text-[10px] mr-1"></i>${b.START_TIME} - ${b.END_TIME}</span>
            <span class="text-emerald-700 font-bold">₹${Number(b.TOTAL_AMOUNT).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 self-end sm:self-center">
        <button onclick="cancelBooking(${b.BOOKING_ID})" class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition">
          <i class="fa-solid fa-ban text-[10px] mr-1"></i> Cancel
        </button>
      </div>
    </div>
  `).join('');
}

function handleQuickFilter(e) {
  e.preventDefault();
  const hub = document.getElementById('quick-hub').value;
  const type = document.getElementById('quick-type').value;
  const date = document.getElementById('quick-date').value;

  if (date) {
    state.timelineDate = date;
    const dp = document.getElementById('timeline-date-picker');
    if (dp) dp.value = date;
  }

  // Switch to catalog or timeline
  if (type) state.activeCategoryFilter = type;
  if (hub) {
    const hubFilter = document.getElementById('filter-hub');
    if (hubFilter) hubFilter.value = hub;
  }

  switchTab('catalog');
  renderCatalog();
}

// ====================================================================
// VIEW 2: SPACE CATALOG & 2D FLOOR PLAN
// ====================================================================

function toggleCatalogView(viewType) {
  const grid = document.getElementById('catalog-grid-view');
  const map = document.getElementById('catalog-map-view');
  const btnGrid = document.getElementById('view-btn-grid');
  const btnMap = document.getElementById('view-btn-map');

  if (viewType === 'map') {
    grid.classList.add('hidden');
    map.classList.remove('hidden');
    btnMap.classList.add('bg-sky-600', 'text-white');
    btnMap.classList.remove('text-slate-400');
    btnGrid.classList.remove('bg-sky-600', 'text-white');
    btnGrid.classList.add('text-slate-400');
  } else {
    map.classList.add('hidden');
    grid.classList.remove('hidden');
    btnGrid.classList.add('bg-sky-600', 'text-white');
    btnGrid.classList.remove('text-slate-400');
    btnMap.classList.remove('bg-sky-600', 'text-white');
    btnMap.classList.add('text-slate-400');
  }
}

function filterRoomsByType(type) {
  state.activeCategoryFilter = type;
  document.querySelectorAll('.room-pill').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.includes(type) || (type === 'ALL' && btn.textContent.includes('All Spaces'))) {
      btn.classList.add('active');
    }
  });
  renderCatalog();
}

function applyRoomFilters() {
  renderCatalog();
}

function getRoomImage(room) {
  const name = (room.ROOM_NAME || '').toLowerCase();
  const type = (room.ROOM_TYPE || '').toLowerCase();

  if (name.includes('titan') || name.includes('apex')) {
    return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
  } else if (name.includes('nexus') || name.includes('video')) {
    return 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80';
  } else if (name.includes('emerald') || type.includes('meeting')) {
    return 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80';
  } else if (type.includes('hot') || name.includes('desk')) {
    return 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80';
  } else if (name.includes('focus') || name.includes('pod')) {
    return 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80';
  } else if (type.includes('private')) {
    return 'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80';
}

function renderCatalog() {
  const container = document.getElementById('rooms-catalog-cards');
  if (!container) return;

  const hubFilter = document.getElementById('filter-hub')?.value || 'ALL';
  const capacityFilter = Number(document.getElementById('filter-capacity')?.value || 0);
  const checkedAmenities = Array.from(document.querySelectorAll('.amenity-checkbox:checked')).map(c => c.value.toLowerCase());

  const filtered = state.rooms.filter(room => {
    // Type Filter
    if (state.activeCategoryFilter !== 'ALL' && room.ROOM_TYPE !== state.activeCategoryFilter) {
      return false;
    }
    // Hub Filter
    if (hubFilter !== 'ALL' && !room.SPACE_NAME.toLowerCase().includes(hubFilter.toLowerCase())) {
      return false;
    }
    // Capacity Filter
    if (capacityFilter > 0 && Number(room.CAPACITY) < capacityFilter) {
      return false;
    }
    // Amenity Filter
    if (checkedAmenities.length > 0) {
      const roomFacs = (room.FACILITIES || []).join(' ').toLowerCase();
      const matchesAll = checkedAmenities.every(a => roomFacs.includes(a));
      if (!matchesAll) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div class="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
          <i class="fa-solid fa-filter-circle-xmark"></i>
        </div>
        <h4 class="font-bold text-slate-900 text-base">No spaces match your filters</h4>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try relaxing your hub location or capacity filters to explore more available conference rooms and hot desks.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(room => {
    const facilitiesList = (room.FACILITIES && room.FACILITIES.length > 0)
      ? room.FACILITIES.slice(0, 3)
      : ['High-Speed Wi-Fi', 'Power Outlets', 'Ergonomic Seating'];

    const imgUrl = getRoomImage(room);

    return `
      <div class="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between group">
        <div>
          <!-- Image Header with Badges -->
          <div class="h-44 relative overflow-hidden bg-slate-100">
            <img src="${imgUrl}" alt="${room.ROOM_NAME}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent"></div>
            
            <!-- Top Badges -->
            <div class="absolute top-3 inset-x-3 flex justify-between items-center">
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur border border-white/50">
                <i class="fa-solid fa-layer-group text-blue-600 mr-1"></i> ${room.ROOM_TYPE}
              </span>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${room.STATUS === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'} flex items-center gap-1 shadow-sm">
                <span class="h-1.5 w-1.5 rounded-full ${room.STATUS === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-rose-500'}"></span> ${room.STATUS}
              </span>
            </div>

            <!-- Bottom Card Title inside Image overlay -->
            <div class="absolute bottom-3 inset-x-3 text-white">
              <span class="text-[11px] text-blue-200 font-medium block flex items-center gap-1">
                <i class="fa-solid fa-location-dot text-blue-400"></i> ${room.SPACE_NAME}
              </span>
              <h3 class="text-base font-bold text-white tracking-tight drop-shadow-sm">${room.ROOM_NAME}</h3>
            </div>
          </div>

          <!-- Specs & Amenities -->
          <div class="p-5 space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-3 py-2 border-b border-slate-100">
              <div class="flex items-center gap-2 text-slate-600">
                <div class="h-7 w-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-users"></i>
                </div>
                <div>
                  <div class="text-[10px] text-slate-400 uppercase font-semibold">Capacity</div>
                  <strong class="text-slate-900 font-bold">${room.CAPACITY} Pax</strong>
                </div>
              </div>
              <div class="flex items-center gap-2 text-slate-600">
                <div class="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-tag"></i>
                </div>
                <div>
                  <div class="text-[10px] text-slate-400 uppercase font-semibold">Hourly Rate</div>
                  <strong class="text-emerald-700 font-bold font-mono">₹${Number(room.HOURLY_RATE).toFixed(0)}/hr</strong>
                </div>
              </div>
            </div>

            <!-- Facilities Tags -->
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Included Amenities</span>
              <div class="flex flex-wrap gap-1.5">
                ${facilitiesList.map(f => `
                  <span class="px-2.5 py-1 rounded-md bg-slate-50 text-[11px] text-slate-700 border border-slate-200 flex items-center gap-1.5">
                    <i class="fa-solid fa-check text-[9px] text-blue-600"></i> ${f}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="p-5 pt-0 flex items-center gap-2 border-t border-slate-100/80 mt-2">
          <button onclick="openSlotPickerForRoom(${room.ROOM_ID})" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
            <i class="fa-solid fa-calendar-check text-xs"></i> Select Slots & Lock
          </button>
          <button onclick="openEditRoomModal(${room.ROOM_ID})" class="h-9 w-9 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 flex items-center justify-center text-xs border border-slate-200 hover:border-amber-300 transition" title="Update Room in Oracle">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button onclick="deleteRoom(${room.ROOM_ID})" class="h-9 w-9 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 flex items-center justify-center text-xs border border-slate-200 hover:border-rose-300 transition" title="Delete Room from Oracle">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function selectRoomFromMap(roomId) {
  openSlotPickerForRoom(roomId);
}

// ====================================================================
// VIEW 3: CALENDAR & TIME-SLOT TIMELINE PICKER
// ====================================================================

function populateTimelineRoomDropdown() {
  const select = document.getElementById('timeline-room-select');
  if (!select) return;
  select.innerHTML = state.rooms.map(r => `
    <option value="${r.ROOM_ID}" ${Number(r.ROOM_ID) === Number(state.selectedTimelineRoomId) ? 'selected' : ''}>
      ${r.ROOM_NAME} (₹${r.HOURLY_RATE}/hr, ${r.CAPACITY} pax)
    </option>
  `).join('');
}

function openSlotPickerForRoom(roomId) {
  if (roomId) {
    state.selectedTimelineRoomId = roomId;
    const select = document.getElementById('timeline-room-select');
    if (select) select.value = roomId;
  }
  state.selectedStartHour = null;
  state.selectedEndHour = null;
  switchTab('timeline');
}

function shiftTimelineDate(days) {
  const cur = new Date(state.timelineDate);
  cur.setDate(cur.getDate() + days);
  state.timelineDate = cur.toISOString().split('T')[0];
  const dp = document.getElementById('timeline-date-picker');
  if (dp) dp.value = state.timelineDate;
  state.selectedStartHour = null;
  state.selectedEndHour = null;
  renderTimelineGrid();
}

function setTimelineDate(mode) {
  const cur = new Date();
  if (mode === 'tomorrow') cur.setDate(cur.getDate() + 1);
  else if (mode === 'monday') {
    const day = cur.getDay();
    const diff = cur.getDate() + (day === 0 ? 1 : 8 - day);
    cur.setDate(diff);
  }
  state.timelineDate = cur.toISOString().split('T')[0];
  const dp = document.getElementById('timeline-date-picker');
  if (dp) dp.value = state.timelineDate;
  state.selectedStartHour = null;
  state.selectedEndHour = null;
  renderTimelineGrid();
}

function renderTimelineGrid() {
  const select = document.getElementById('timeline-room-select');
  if (select) state.selectedTimelineRoomId = select.value;

  const dp = document.getElementById('timeline-date-picker');
  if (dp) {
    if (!dp.value) dp.value = state.timelineDate;
    else state.timelineDate = dp.value;
  }

  const curRoom = state.rooms.find(r => Number(r.ROOM_ID) === Number(state.selectedTimelineRoomId)) || state.rooms[0];
  if (!curRoom) return;

  // Header meta
  document.getElementById('timeline-current-room-name').textContent = curRoom.ROOM_NAME;
  document.getElementById('timeline-current-rate').textContent = `₹ ${Number(curRoom.HOURLY_RATE).toFixed(0)}/hr`;
  document.getElementById('timeline-current-space-city').textContent = `${curRoom.SPACE_NAME}, ${curRoom.CITY}`;

  // Find confirmed bookings for this room on this date in Oracle
  const existingBookings = state.bookings.filter(b => 
    Number(b.ROOM_ID) === Number(curRoom.ROOM_ID) &&
    b.BOOKING_DATE === state.timelineDate &&
    b.STATUS === 'CONFIRMED'
  );

  const container = document.getElementById('hourly-blocks-container');
  container.innerHTML = '';

  // Hours 08:00 to 20:00 (12 one-hour slots)
  const hours = [
    { start: 8, label: '08:00 - 09:00' },
    { start: 9, label: '09:00 - 10:00' },
    { start: 10, label: '10:00 - 11:00' },
    { start: 11, label: '11:00 - 12:00' },
    { start: 12, label: '12:00 - 13:00' },
    { start: 13, label: '13:00 - 14:00' },
    { start: 14, label: '14:00 - 15:00' },
    { start: 15, label: '15:00 - 16:00' },
    { start: 16, label: '16:00 - 17:00' },
    { start: 17, label: '17:00 - 18:00' },
    { start: 18, label: '18:00 - 19:00' },
    { start: 19, label: '19:00 - 20:00' }
  ];

  hours.forEach(slot => {
    // Check if slot overlaps with any confirmed booking in Oracle
    const isBooked = existingBookings.some(b => {
      const bStart = parseInt(b.START_TIME.split(':')[0], 10);
      const bEnd = parseInt(b.END_TIME.split(':')[0], 10);
      return slot.start >= bStart && slot.start < bEnd;
    });

    const isSelected = state.selectedStartHour !== null && 
                       slot.start >= state.selectedStartHour && 
                       slot.start < state.selectedEndHour;

    const block = document.createElement('div');
    block.className = `time-block p-3 rounded-xl text-center border text-xs font-mono font-semibold transition ${
      isBooked ? 'booked' : (isSelected ? 'selected' : 'available')
    }`;

    block.innerHTML = `
      <div class="text-[11px] mb-1">${slot.label}</div>
      <div class="text-[10px] uppercase font-bold tracking-wider">
        ${isBooked ? '🔒 Reserved' : (isSelected ? '✓ Selected' : 'Free Slot')}
      </div>
    `;

    if (!isBooked) {
      block.onclick = () => handleSlotClick(slot.start);
    }

    container.appendChild(block);
  });

  updateSelectedTimelineSummary(curRoom);
}

function handleSlotClick(hour) {
  if (state.selectedStartHour === null) {
    state.selectedStartHour = hour;
    state.selectedEndHour = hour + 1;
  } else if (state.selectedStartHour !== null && state.selectedEndHour === (state.selectedStartHour + 1) && hour > state.selectedStartHour) {
    state.selectedEndHour = hour + 1;
  } else {
    // Reset selection
    state.selectedStartHour = hour;
    state.selectedEndHour = hour + 1;
  }
  renderTimelineGrid();
}

function updateSelectedTimelineSummary(curRoom) {
  const summarySpan = document.getElementById('timeline-selected-span');
  const priceSpan = document.getElementById('timeline-selected-price');
  const btn = document.getElementById('btn-proceed-checkout');

  if (state.selectedStartHour !== null && state.selectedEndHour !== null) {
    const duration = state.selectedEndHour - state.selectedStartHour;
    const sStr = String(state.selectedStartHour).padStart(2, '0') + ':00';
    const eStr = String(state.selectedEndHour).padStart(2, '0') + ':00';
    const total = duration * Number(curRoom.HOURLY_RATE);

    summarySpan.innerHTML = `<span class="text-amber-400 font-mono">${sStr} - ${eStr}</span> (${duration} hr${duration > 1 ? 's' : ''}) on <span class="text-sky-400 font-mono">${state.timelineDate}</span>`;
    priceSpan.textContent = `₹ ${total.toFixed(2)}`;
    btn.disabled = false;

    // Cache checkout details
    state.checkoutData = {
      room: curRoom,
      date: state.timelineDate,
      startTime: sStr,
      endTime: eStr,
      durationHours: duration,
      basePrice: total
    };
  } else {
    summarySpan.textContent = 'Click on free time slots above to select';
    priceSpan.textContent = '₹ 0.00';
    btn.disabled = true;
    state.checkoutData = null;
  }
}

// ====================================================================
// VIEW 4: CHECKOUT & CONFIRMATION MODAL
// ====================================================================

function launchCheckoutFromTimeline() {
  if (!state.checkoutData) return;
  const d = state.checkoutData;

  document.getElementById('checkout-room-name').textContent = d.room.ROOM_NAME;
  document.getElementById('checkout-space-loc').textContent = `${d.room.SPACE_NAME}, ${d.room.CITY}`;
  document.getElementById('checkout-date').textContent = d.date;
  document.getElementById('checkout-slot').textContent = `${d.startTime} - ${d.endTime}`;
  document.getElementById('checkout-duration').textContent = `${d.durationHours} Hour(s)`;
  document.getElementById('checkout-rate').textContent = `₹ ${d.room.HOURLY_RATE}/hr`;

  // Reset checkboxes & promo
  document.getElementById('addon-coffee').checked = false;
  document.getElementById('addon-recording').checked = false;
  document.getElementById('addon-concierge').checked = false;
  document.getElementById('checkout-promo-input').value = '';
  state.appliedPromo = null;

  recalculateCheckoutTotal();
  openModal('checkout-modal');
}

function recalculateCheckoutTotal() {
  if (!state.checkoutData) return;

  let total = state.checkoutData.basePrice;
  let amenitiesTotal = 0;

  if (document.getElementById('addon-coffee').checked) amenitiesTotal += 200;
  if (document.getElementById('addon-recording').checked) amenitiesTotal += 500;
  if (document.getElementById('addon-concierge').checked) amenitiesTotal += 600;

  total += amenitiesTotal;

  // Apply promo
  let discount = 0;
  if (state.appliedPromo === 'VIT2026') {
    discount = total * 0.20; // 20% discount
  } else if (state.appliedPromo === 'STARTUP50') {
    discount = Math.min(500, total * 0.5);
  }

  total = Math.max(0, total - discount);

  // Add 18% GST standard in India
  const gst = total * 0.18;
  const grandTotal = total + gst;

  document.getElementById('checkout-grand-total').textContent = `₹ ${grandTotal.toFixed(2)}`;

  const discountBadge = document.getElementById('checkout-discount-badge');
  if (discount > 0) {
    discountBadge.textContent = `Promo Code Applied: -₹${discount.toFixed(2)} savings + 18% GST`;
    discountBadge.classList.remove('hidden');
  } else {
    discountBadge.textContent = '+ 18% GST applicable';
    discountBadge.classList.remove('hidden');
  }

  state.checkoutData.calculatedGrandTotal = grandTotal;
}

function applyPromoCode() {
  const code = document.getElementById('checkout-promo-input').value.trim().toUpperCase();
  if (code === 'VIT2026' || code === 'STARTUP50') {
    state.appliedPromo = code;
    showToast(`Promo "${code}" applied successfully!`, 'success');
    recalculateCheckoutTotal();
  } else {
    showToast('Invalid promo code. Try: VIT2026 or STARTUP50', 'error');
  }
}

function selectPaymentMethod(method) {
  state.selectedPaymentMethod = method;
  document.querySelectorAll('.pay-method-btn').forEach(btn => btn.classList.remove('active', 'bg-sky-600', 'text-white'));
  
  if (method === 'UPI') document.getElementById('pay-btn-UPI').classList.add('active', 'bg-sky-600', 'text-white');
  else if (method === 'Credit Card') document.getElementById('pay-btn-CARD').classList.add('active', 'bg-sky-600', 'text-white');
  else if (method === 'Net Banking') document.getElementById('pay-btn-NET').classList.add('active', 'bg-sky-600', 'text-white');
  else if (method === 'Corporate Account') document.getElementById('pay-btn-CORP').classList.add('active', 'bg-sky-600', 'text-white');
}

async function submitCompleteCheckout() {
  if (!state.checkoutData) return;

  const btn = document.getElementById('btn-confirm-payment');
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xs"></i> Writing to Oracle 21c...`;

  // Use default active resident member for checkout booking
  const defaultMember = state.members[0] || { MEMBER_ID: 1001 };

  const payload = {
    member_id: defaultMember.MEMBER_ID,
    room_id: state.checkoutData.room.ROOM_ID,
    booking_date: state.checkoutData.date,
    start_time: state.checkoutData.startTime,
    end_time: state.checkoutData.endTime,
    total_amount: state.checkoutData.calculatedGrandTotal,
    payment_method: state.selectedPaymentMethod
  };

  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-check-double"></i> Authorize & Lock Space`;

    if (data.success) {
      showToast('Reservation Locked & Settled in Oracle DB!', 'success');
      closeModal('checkout-modal');
      await loadBookings();
      await loadPayments();
      await loadStats();
      switchTab('dashboard');
    } else {
      // Caught Oracle trigger error (e.g. ORA-20001 double booking)
      showToast(data.error, 'error');
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-check-double"></i> Authorize & Lock Space`;
    showToast(err.message, 'error');
  }
}

// ====================================================================
// CRUD: ROOMS & MEMBERS (FACULTY RUBRIC M-1, M-2, M-3)
// ====================================================================

function openNewRoomModal() {
  document.getElementById('room-modal-title').textContent = 'Add Space (Insert)';
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
      renderCatalog();
    } else {
      showToast(data.error || 'Operation failed', 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteRoom(id) {
  if (!confirm(`Permanently delete room #${id} from Oracle DB? All linked reservations and facilities will cascade delete.`)) return;

  try {
    const res = await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      await loadRooms();
      await loadStats();
      renderCatalog();
    } else {
      showToast(data.error || 'Failed to delete room', 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ----------------- MEMBERS CRUD -----------------
function renderMembersTable(members) {
  const tbody = document.getElementById('members-table-body');
  if (!tbody) return;

  if (!members || members.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-slate-400">No members registered.</td></tr>`;
    return;
  }

  tbody.innerHTML = members.map(m => `
    <tr class="hover:bg-blue-50/40 border-b border-slate-100 transition">
      <td class="px-6 py-4 font-mono font-bold text-blue-600">#${m.MEMBER_ID}</td>
      <td class="px-6 py-4 font-bold text-slate-900">${m.FIRST_NAME} ${m.LAST_NAME}</td>
      <td class="px-6 py-4 text-slate-600 font-mono text-xs">${m.EMAIL}</td>
      <td class="px-6 py-4 text-slate-600 font-mono text-xs">${m.PHONE || '-'}</td>
      <td class="px-6 py-4">
        <span class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          ${m.PLAN_NAME || 'Standard'} (₹${m.MONTHLY_FEE || 0}/mo)
        </span>
      </td>
      <td class="px-6 py-4 text-slate-500 font-mono text-xs">${m.JOIN_DATE}</td>
      <td class="px-6 py-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          ${m.STATUS}
        </span>
      </td>
      <td class="px-6 py-4 text-right">
        <div class="flex items-center justify-end gap-2">
          <button onclick="openEditMemberModal(${m.MEMBER_ID})" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200 transition">
            Update
          </button>
          <button onclick="deleteMember(${m.MEMBER_ID})" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-semibold border border-rose-200 transition">
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openNewMemberModal() {
  document.getElementById('member-modal-title').textContent = 'Register Member (Insert)';
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
  if (!confirm(`Delete member #${id}? All associated reservations will be deleted in Oracle.`)) return;

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

// ----------------- CANCELLATION -----------------
async function cancelBooking(id) {
  if (!confirm(`Cancel reservation #${id}?`)) return;
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Reservation marked CANCELLED in Oracle DB', 'info');
      await loadBookings();
      await loadStats();
      renderDashboard();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ----------------- PAYMENTS LEDGER -----------------
function renderPaymentsTable(payments) {
  const tbody = document.getElementById('payments-table-body');
  if (!tbody) return;

  if (!payments || payments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-8 text-slate-400">No payment receipts found.</td></tr>`;
    return;
  }

  tbody.innerHTML = payments.map(p => `
    <tr class="hover:bg-blue-50/40 border-b border-slate-100 transition">
      <td class="px-6 py-4 font-mono font-bold text-blue-600">#${p.PAYMENT_ID}</td>
      <td class="px-6 py-4 font-mono text-slate-400 text-xs">#${p.BOOKING_ID}</td>
      <td class="px-6 py-4 font-bold text-slate-900">${p.MEMBER_NAME}</td>
      <td class="px-6 py-4 text-slate-700 font-medium">${p.ROOM_NAME}</td>
      <td class="px-6 py-4 font-bold text-emerald-700 font-mono">₹ ${Number(p.AMOUNT).toFixed(2)}</td>
      <td class="px-6 py-4">
        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
          ${p.PAYMENT_METHOD}
        </span>
      </td>
      <td class="px-6 py-4 text-slate-500 font-mono text-xs">${p.PAYMENT_DATE}</td>
      <td class="px-6 py-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          ${p.STATUS}
        </span>
      </td>
      <td class="px-6 py-4 text-right">
        <button onclick="deletePayment(${p.PAYMENT_ID})" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200 transition">
          Delete
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
// VIEW 6: "TYPE QUERY & FETCH IT" SQL CONSOLE
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

  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xs"></i> Executing on Oracle...`;
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
    btn.innerHTML = `<i class="fa-solid fa-play text-xs"></i> Run Query (Fetch)`;

    if (data.success) {
      meta.textContent = `Completed in ${data.executionTimeMs} ms | ${data.rowCount} rows returned`;
      renderQueryResults(data.columns, data.rows);
      outputContainer.classList.remove('hidden');

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
    btn.innerHTML = `<i class="fa-solid fa-play text-xs"></i> Run Query (Fetch)`;
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
    tbody.innerHTML = `<tr><td class="px-6 py-6 text-center text-slate-500 font-medium">Command executed successfully on Oracle 21c (no rows returned).</td></tr>`;
    return;
  }

  thead.innerHTML = `<tr class="bg-slate-50 border-b border-slate-200">${columns.map(c => `<th class="px-6 py-3 font-mono text-xs font-bold text-slate-700 uppercase tracking-wider text-left">${c}</th>`).join('')}</tr>`;

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${columns.length}" class="px-6 py-6 text-center text-slate-500 font-medium">0 rows returned from Oracle.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(row => `
    <tr class="hover:bg-blue-50/50 border-b border-slate-100 transition">
      ${columns.map(c => `<td class="px-6 py-3 font-mono text-xs text-slate-800">${row[c] !== null && row[c] !== undefined ? row[c] : '<span class="text-slate-400 italic">NULL</span>'}</td>`).join('')}
    </tr>
  `).join('');
}

// Shortcuts & Startup
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

  refreshAllData();
});
