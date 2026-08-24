function getEvents() {
    return JSON.parse(localStorage.getItem("bookEaseEvents")) || [];
}

function saveEvents(events) {
    localStorage.setItem("bookEaseEvents", JSON.stringify(events));
}

function getEventById(id) {
    return getEvents().find(event => event.id === id);
}