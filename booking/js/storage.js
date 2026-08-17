function saveBooking(booking) {
    const bookings = JSON.parse(localStorage.getItem("bookEaseBookings")) || [];

    bookings.push(booking);

    localStorage.setItem("bookEaseBookings", JSON.stringify(bookings));
}

function getBookings() {
    return JSON.parse(localStorage.getItem("bookEaseBookings")) || [];
}