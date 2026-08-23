function formatEventDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;

    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function formatEventTime(timeStr) {
    if (!timeStr) return "";

    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours)) return timeStr;

    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;

    return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function buildEventCard(event) {
    const card = document.createElement("a");
    card.href = `event-details.html?id=${event.id}`;
    card.classList.add("event-tile");

    card.innerHTML = `
        <div class="event-tile-poster">
            <img src="${event.poster}" alt="${event.title}">
            <span class="event-tile-category">${event.category}</span>
        </div>
        <div class="event-tile-body">
            <h3>${event.title}</h3>
            <p>📍 ${event.venue}</p>
            <p>📅 ${formatEventDate(event.date)} · 🕒 ${formatEventTime(event.time)}</p>
            <div class="event-tile-footer">
                <span>From ₹${event.regularPrice}</span>
                <span class="view-details">View Details →</span>
            </div>
        </div>
    `;

    return card;
}

function initFeaturedEvents() {
    const grid = document.getElementById("featuredEvents");
    if (!grid) return;

    seedEventsIfEmpty();

    const events = getEvents().slice(0, 3);

    if (events.length === 0) {
        grid.innerHTML = `<p class="empty-state">No events available right now — check back soon.</p>`;
        return;
    }

    events.forEach((event) => grid.appendChild(buildEventCard(event)));
}

function initEventsPage() {
    const grid = document.getElementById("eventsGrid");
    if (!grid) return;

    seedEventsIfEmpty();

    const searchInput = document.getElementById("eventSearch");
    const categorySelect = document.getElementById("categoryFilter");

    const allEvents = getEvents();

    const categories = ["All", ...new Set(allEvents.map((e) => e.category))];
    categorySelect.innerHTML = categories
        .map((c) => `<option value="${c}">${c}</option>`)
        .join("");

    function render() {
        const query = searchInput.value.trim().toLowerCase();
        const category = categorySelect.value;

        const filtered = allEvents.filter((event) => {
            const matchesQuery =
                event.title.toLowerCase().includes(query) ||
                event.venue.toLowerCase().includes(query);

            const matchesCategory = category === "All" || event.category === category;

            return matchesQuery && matchesCategory;
        });

        grid.innerHTML = "";

        if (filtered.length === 0) {
            grid.innerHTML = `<p class="empty-state">No events match your search.</p>`;
            return;
        }

        filtered.forEach((event) => grid.appendChild(buildEventCard(event)));
    }

    searchInput.addEventListener("input", render);
    categorySelect.addEventListener("change", render);

    render();
}

function initEventDetails() {
    const container = document.getElementById("eventDetailsContent");
    if (!container) return;

    seedEventsIfEmpty();

    const params = new URLSearchParams(window.location.search);
    const event = getEventById(params.get("id"));

    if (!event) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Event not found</h2>
                <p>This event may have been removed.</p>
                <a href="events.html" class="btn-primary">Browse Events</a>
            </div>
        `;
        return;
    }

    document.title = `${event.title} — BookEase`;

    container.innerHTML = `
        <div class="details-poster">
            <img src="${event.poster}" alt="${event.title}">
        </div>
        <div class="details-info">
            <span class="event-tile-category">${event.category}</span>
            <h1>${event.title}</h1>
            <p>📍 ${event.venue}</p>
            <p>📅 ${formatEventDate(event.date)}</p>
            <p>🕒 ${formatEventTime(event.time)}</p>
            <p class="details-description">${event.description || ""}</p>

            <div class="details-pricing">
                <div>
                    <span>Regular</span>
                    <strong>₹${event.regularPrice}</strong>
                </div>
                <div>
                    <span>VIP</span>
                    <strong>₹${event.vipPrice}</strong>
                </div>
            </div>

            <button id="bookNowBtn" class="btn-primary">Book Now →</button>
        </div>
    `;

    initBookNowButton(event);
}

function initBookNowButton(event) {
    const btn = document.getElementById("bookNowBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        if (!requireUserLogin()) return;

        sessionStorage.setItem("bookEaseSelectedEvent", JSON.stringify(event));
        window.location.href = "booking/seat_selection.html";
    });
}

initFeaturedEvents();
initEventsPage();
initEventDetails();