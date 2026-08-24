function formatDate(date) {
    const d = new Date(date);
    return isNaN(d) ? date : d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function formatTime(time) {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    if (isNaN(h)) return time;

    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function buildEventCard(event) {
    const card = document.createElement("a");
    card.href = `event-details.html?id=${event.id}`;
    card.className = "event-tile";

    card.innerHTML = `
        <div class="event-tile-poster">
            <img src="${event.poster}" alt="${event.title}">
            <span class="event-tile-category">${event.category}</span>
        </div>
        <div class="event-tile-body">
            <h3>${event.title}</h3>
            <p>📍 ${event.venue}</p>
            <p>📅 ${formatDate(event.date)} · 🕒 ${formatTime(event.time)}</p>
            <div class="event-tile-footer">
                <span>From ₹${event.regularPrice}</span>
                <span>View Details →</span>
            </div>
        </div>
    `;

    return card;
}

function initEventsPage() {
    const grid = document.getElementById("eventsGrid");
    if (!grid) return;

    const search = document.getElementById("eventSearch");
    const filter = document.getElementById("categoryFilter");
    const events = getEvents();

    filter.innerHTML = ["All", ...new Set(events.map(e => e.category))]
        .map(c => `<option>${c}</option>`)
        .join("");

    function render() {
        const query = search.value.toLowerCase().trim();
        const category = filter.value;

        const result = events.filter(e =>
            (e.title.toLowerCase().includes(query) ||
             e.venue.toLowerCase().includes(query)) &&
            (category === "All" || e.category === category)
        );

        grid.innerHTML = result.length
            ? ""
            : `<p class="empty-state">No events match your search.</p>`;

        result.forEach(e => grid.appendChild(buildEventCard(e)));
    }

    search.addEventListener("input", render);
    filter.addEventListener("change", render);
    render();
}

function initEventDetails() {
    const container = document.getElementById("eventDetailsContent");
    if (!container) return;

    const id = new URLSearchParams(location.search).get("id");
    const event = getEventById(id);

    if (!event) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Event not found</h2>
                <a href="events.html">Browse Events</a>
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
            <p>📅 ${formatDate(event.date)}</p>
            <p>🕒 ${formatTime(event.time)}</p>
            <p>${event.description || ""}</p>

            <div class="details-pricing">
                <span>Regular <strong>₹${event.regularPrice}</strong></span>
                <span>VIP <strong>₹${event.vipPrice}</strong></span>
            </div>

            <button id="bookNowBtn" class="btn-primary">Book Now →</button>
        </div>
    `;

    document.getElementById("bookNowBtn").addEventListener("click", () => {
        if (typeof requireUserLogin === "function" && !requireUserLogin()) return;

        sessionStorage.setItem("bookEaseSelectedEvent", JSON.stringify(event));
        location.href = "booking/seat_selection.html";
    });
}

initEventsPage();
initEventDetails();