

// Turns "2026-10-18" into "18 October 2026"
function formatEventDate(dateStr) {
    var d = new Date(dateStr);

    if (isNaN(d)) {
        return dateStr;
    }

    var day = d.getDate();
    var year = d.getFullYear();

    var months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

    var month = months[d.getMonth()];

    return day + " " + month + " " + year;
}


// Turns "19:30" into "7:30 PM"
function formatEventTime(timeStr) {
    if (!timeStr) {
        return "";
    }

    var parts = timeStr.split(":");
    var hours = Number(parts[0]);
    var minutes = Number(parts[1]);

    var period = "AM";
    if (hours >= 12) {
        period = "PM";
    }

    var displayHour = hours % 12;
    if (displayHour === 0) {
        displayHour = 12;
    }

    var minutesText = minutes;
    if (minutes < 10) {
        minutesText = "0" + minutes;
    }

    return displayHour + ":" + minutesText + " " + period;
}


// Builds one event card (used on homepage AND events page)
function buildEventCard(event) {
    var card = document.createElement("a");
    card.href = "event-details.html?id=" + event.id;
    card.classList.add("event-tile");

    var dateText = formatEventDate(event.date);
    var timeText = formatEventTime(event.time);

    card.innerHTML =
        '<div class="event-tile-poster">' +
            '<img src="' + event.poster + '" alt="' + event.title + '">' +
            '<span class="event-tile-category">' + event.category + '</span>' +
        '</div>' +
        '<div class="event-tile-body">' +
            '<h3>' + event.title + '</h3>' +
            '<p>📍 ' + event.venue + '</p>' +
            '<p>📅 ' + dateText + ' · 🕒 ' + timeText + '</p>' +
            '<div class="event-tile-footer">' +
                '<span>From ₹' + event.regularPrice + '</span>' +
                '<span class="view-details">View Details →</span>' +
            '</div>' +
        '</div>';

    return card;
}


// ==========================================
// PART 1: FEATURED EVENTS (on homepage)
// ==========================================
function initFeaturedEvents() {
    var grid = document.getElementById("featuredEvents");

    if (!grid) {
        return; // this page doesn't have this section, so stop
    }

    seedEventsIfEmpty();

    var allEvents = getEvents();
    var featuredEvents = [];

    // just take the first 3 events
    for (var i = 0; i < allEvents.length && i < 3; i++) {
        featuredEvents.push(allEvents[i]);
    }

    if (featuredEvents.length === 0) {
        grid.innerHTML = '<p class="empty-state">No events available right now — check back soon.</p>';
        return;
    }

    for (var j = 0; j < featuredEvents.length; j++) {
        var card = buildEventCard(featuredEvents[j]);
        grid.appendChild(card);
    }
}


// ==========================================
// PART 2: EVENTS PAGE (search + filter)
// ==========================================
function initEventsPage() {
    var grid = document.getElementById("eventsGrid");

    if (!grid) {
        return;
    }

    seedEventsIfEmpty();

    var searchInput = document.getElementById("eventSearch");
    var categorySelect = document.getElementById("categoryFilter");

    var allEvents = getEvents();

    // Build the list of categories for the dropdown
    var categories = ["All"];
    for (var i = 0; i < allEvents.length; i++) {
        var cat = allEvents[i].category;
        if (categories.indexOf(cat) === -1) {
            categories.push(cat);
        }
    }

    var optionsHTML = "";
    for (var k = 0; k < categories.length; k++) {
        optionsHTML += '<option value="' + categories[k] + '">' + categories[k] + '</option>';
    }
    categorySelect.innerHTML = optionsHTML;

    // This function re-draws the grid based on search box + dropdown
    function showFilteredEvents() {
        var searchText = searchInput.value.trim().toLowerCase();
        var selectedCategory = categorySelect.value;

        var results = [];

        for (var i = 0; i < allEvents.length; i++) {
            var event = allEvents[i];

            var titleMatches = event.title.toLowerCase().indexOf(searchText) !== -1;
            var venueMatches = event.venue.toLowerCase().indexOf(searchText) !== -1;

            var matchesSearch = titleMatches || venueMatches;
            var matchesCategory = (selectedCategory === "All" || event.category === selectedCategory);

            if (matchesSearch && matchesCategory) {
                results.push(event);
            }
        }

        grid.innerHTML = "";

        if (results.length === 0) {
            grid.innerHTML = '<p class="empty-state">No events match your search.</p>';
            return;
        }

        for (var j = 0; j < results.length; j++) {
            var card = buildEventCard(results[j]);
            grid.appendChild(card);
        }
    }

    // Re-run the filter every time the user types or changes category
    searchInput.addEventListener("input", showFilteredEvents);
    categorySelect.addEventListener("change", showFilteredEvents);

    // Show everything once, when the page first loads
    showFilteredEvents();
}


// ==========================================
// PART 3: EVENT DETAILS PAGE
// ==========================================
function initEventDetails() {
    var container = document.getElementById("eventDetailsContent");

    if (!container) {
        return;
    }

    seedEventsIfEmpty();

    // Read the event id from the URL, e.g. event-details.html?id=EVT-DEMO1
    var params = new URLSearchParams(window.location.search);
    var eventId = params.get("id");
    var event = getEventById(eventId);

    if (!event) {
        container.innerHTML =
            '<div class="empty-state">' +
                '<h2>Event not found</h2>' +
                '<p>This event may have been removed.</p>' +
                '<a href="events.html" class="btn-primary">Browse Events</a>' +
            '</div>';
        return;
    }

    document.title = event.title + " — BookEase";

    var dateText = formatEventDate(event.date);
    var timeText = formatEventTime(event.time);
    var description = event.description || "";

    container.innerHTML =
        '<div class="details-poster">' +
            '<img src="' + event.poster + '" alt="' + event.title + '">' +
        '</div>' +
        '<div class="details-info">' +
            '<span class="event-tile-category">' + event.category + '</span>' +
            '<h1>' + event.title + '</h1>' +
            '<p>📍 ' + event.venue + '</p>' +
            '<p>📅 ' + dateText + '</p>' +
            '<p>🕒 ' + timeText + '</p>' +
            '<p class="details-description">' + description + '</p>' +
            '<div class="details-pricing">' +
                '<div>' +
                    '<span>Regular</span>' +
                    '<strong>₹' + event.regularPrice + '</strong>' +
                '</div>' +
                '<div>' +
                    '<span>VIP</span>' +
                    '<strong>₹' + event.vipPrice + '</strong>' +
                '</div>' +
            '</div>' +
            '<button id="bookNowBtn" class="btn-primary">Book Now →</button>' +
        '</div>';

    initBookNowButton(event);
}


// ==========================================
// "BOOK NOW" BUTTON
// ==========================================
function initBookNowButton(event) {
    var btn = document.getElementById("bookNowBtn");

    if (!btn) {
        return;
    }

    btn.addEventListener("click", function () {
        var isLoggedIn = requireUserLogin();

        if (!isLoggedIn) {
            return; // requireUserLogin already redirected to login page
        }

        sessionStorage.setItem("bookEaseSelectedEvent", JSON.stringify(event));
        window.location.href = "booking/seat_selection.html";
    });
}


// ==========================================
// RUN EVERYTHING WHEN THE PAGE LOADS
// (each function checks if it's needed first)
// ==========================================
initFeaturedEvents();
initEventsPage();
initEventDetails();