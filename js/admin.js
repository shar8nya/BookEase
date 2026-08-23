// ==========================================
// ADMIN.JS
// Handles: Admin login, Dashboard stats,
// Add Event, Manage Events (edit/delete)
// ==========================================

// ------------------------------------------
// STORAGE KEYS (shared contract — confirm
// with Person 1 & 2 that everyone uses these)
// ------------------------------------------
const EVENTS_KEY = "bookEaseEvents";
const BOOKINGS_KEY = "bookEaseBookings"; // already used by Person 3
const USERS_KEY = "bookEaseUsers";       // Person 1 should own this
const ADMIN_FLAG_KEY = "bookEaseIsAdmin";

// Temporary hardcoded admin credentials (no backend, so this is fine for a course project)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// ------------------------------------------
// SHARED HELPERS
// ------------------------------------------
function getEvents() {
    return JSON.parse(localStorage.getItem(EVENTS_KEY)) || [];
}

function saveEvents(events) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function getBookings() {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
}

function getUsers() {
    // Falls back to empty array until Person 1 builds real auth/storage
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function isAdminLoggedIn() {
    return sessionStorage.getItem(ADMIN_FLAG_KEY) === "true";
}

function requireAdminLogin() {
    if (!isAdminLoggedIn()) {
        window.location.href = "admin-login.html";
    }
}

function generateEventId() {
    return "EVT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ------------------------------------------
// ADMIN LOGIN (runs only on admin-login.html)
// ------------------------------------------
function initAdminLogin() {
    const form = document.getElementById("adminLoginForm");
    if (!form) return; // not on this page

    const errorMsg = document.getElementById("loginError");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("adminUsername").value.trim();
        const password = document.getElementById("adminPassword").value;

        if (!username || !password) {
            errorMsg.textContent = "Please fill in both fields.";
            return;
        }

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            sessionStorage.setItem(ADMIN_FLAG_KEY, "true");
            window.location.href = "admin-dashboard.html";
        } else {
            errorMsg.textContent = "Invalid admin username or password.";
        }
    });
}

// ------------------------------------------
// DASHBOARD STATS (runs only on admin-dashboard.html)
// ------------------------------------------
function initAdminDashboard() {
    const totalEventsEl = document.getElementById("totalEvents");
    if (!totalEventsEl) return; // not on this page

    requireAdminLogin();

    const events = getEvents();
    const bookings = getBookings();
    const users = getUsers();

    totalEventsEl.textContent = events.length;
    document.getElementById("totalBookings").textContent = bookings.length;
    document.getElementById("totalUsers").textContent = users.length;

    // Optional: total revenue, since booking objects already have `total`
    const revenueEl = document.getElementById("totalRevenue");
    if (revenueEl) {
        const revenue = bookings.reduce((sum, b) => sum + (Number(b.total) || 0), 0);
        revenueEl.textContent = `₹${revenue}`;
    }

    setupLogoutButton();
}

// ------------------------------------------
// ADD EVENT (runs only on admin-add-event.html)
// ------------------------------------------
function initAddEvent() {
    const form = document.getElementById("addEventForm");
    if (!form) return; // not on this page

    requireAdminLogin();
    setupLogoutButton();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("eventTitle").value.trim();
        const category = document.getElementById("eventCategory").value.trim();
        const venue = document.getElementById("eventVenue").value.trim();
        const date = document.getElementById("eventDate").value;
        const time = document.getElementById("eventTime").value;
        const regularPrice = Number(document.getElementById("eventRegularPrice").value);
        const vipPrice = Number(document.getElementById("eventVipPrice").value);
        const poster = document.getElementById("eventPoster").value.trim() || "/assets/images.jpg";

        const errorMsg = document.getElementById("addEventError");
        errorMsg.textContent = "";

        // Basic validation
        if (!title || !category || !venue || !date || !time) {
            errorMsg.textContent = "Please fill in all required fields.";
            return;
        }
        if (!regularPrice || regularPrice <= 0 || !vipPrice || vipPrice <= 0) {
            errorMsg.textContent = "Prices must be positive numbers.";
            return;
        }

        const newEvent = {
            id: generateEventId(),
            title,
            category,
            venue,
            date,
            time,
            poster,
            regularPrice,
            vipPrice,
            createdAt: new Date().toISOString()
        };

        const events = getEvents();
        events.push(newEvent);
        saveEvents(events);

        alert("Event added successfully!");
        window.location.href = "admin-manage-events.html";
    });
}

// ------------------------------------------
// MANAGE EVENTS — list + delete (runs only on admin-manage-events.html)
// ------------------------------------------
function initManageEvents() {
    const listEl = document.getElementById("eventList");
    if (!listEl) return; // not on this page

    requireAdminLogin();
    setupLogoutButton();

    renderEventList();

    function renderEventList() {
        const events = getEvents();
        listEl.innerHTML = "";

        if (events.length === 0) {
            listEl.innerHTML = `<p class="empty-state">No events yet. Add one to get started.</p>`;
            return;
        }

        events.forEach((event) => {
            const row = document.createElement("div");
            row.classList.add("event-row");

            row.innerHTML = `
                <div class="event-row-info">
                    <strong>${event.title}</strong>
                    <span>${event.category} · ${event.venue}</span>
                    <span>${event.date} · ${event.time}</span>
                </div>
                <div class="event-row-actions">
                    <button class="edit-btn" data-id="${event.id}">Edit</button>
                    <button class="delete-btn" data-id="${event.id}">Delete</button>
                </div>
            `;

            row.querySelector(".delete-btn").addEventListener("click", () => {
                handleDelete(event.id, event.title);
            });

            row.querySelector(".edit-btn").addEventListener("click", () => {
                // Simple approach: redirect to add-event page with an editId query param
                window.location.href = `admin-add-event.html?editId=${event.id}`;
            });

            listEl.appendChild(row);
        });
    }

    function handleDelete(eventId, eventTitle) {
        const bookings = getBookings();
        const affectedBookings = bookings.filter((b) => b.eventId === eventId);

        let confirmMsg = `Delete "${eventTitle}"?`;
        if (affectedBookings.length > 0) {
            confirmMsg = `${affectedBookings.length} booking(s) exist for "${eventTitle}". Deleting this event will NOT delete those bookings, but they'll reference a removed event. Delete anyway?`;
        }

        if (!confirm(confirmMsg)) return;

        const events = getEvents().filter((e) => e.id !== eventId);
        saveEvents(events);
        renderEventList();
    }
}

// ------------------------------------------
// LOGOUT (shared across admin pages)
// ------------------------------------------
function setupLogoutButton() {
    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem(ADMIN_FLAG_KEY);
        window.location.href = "admin-login.html";
    });
}

// ------------------------------------------
// INIT — run whichever page-specific setup applies
// ------------------------------------------
initAdminLogin();
initAdminDashboard();
initAddEvent();
initManageEvents();