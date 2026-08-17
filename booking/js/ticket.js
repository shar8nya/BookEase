console.log("TICKET JS LOADED");


const storedBooking =
    sessionStorage.getItem(
        "bookEaseConfirmedBooking"
    );


if (!storedBooking) {

    alert("No confirmed booking found.");

    window.location.href =
        "seat_selection.html";

} else {

    const booking =
        JSON.parse(storedBooking);

    displayTicket(booking);
}


// ==========================================
// DISPLAY TICKET
// ==========================================

function displayTicket(booking) {


    document.getElementById(
        "ticketTitle"
    ).textContent = booking.event;

    document.getElementById(
        "ticketCategory"
    ).textContent = booking.category;

    document.getElementById(
        "ticketVenue"
    ).textContent = booking.venue;

    document.getElementById(
        "ticketDate"
    ).textContent = booking.date;

    document.getElementById(
        "ticketTime"
    ).textContent = booking.time;


    document.getElementById(
        "ticketSeats"
    ).textContent =
        booking.seats
            .map(seat => seat.id)
            .join(", ");


    document.getElementById(
        "ticketCount"
    ).textContent =
        booking.seats.length;


    document.getElementById(
        "bookingId"
    ).textContent =
        booking.bookingId;


    document.getElementById(
        "ticketTotal"
    ).textContent =
        `₹${booking.total}`;

}


// ==========================================
// BUTTONS
// ==========================================

document
    .getElementById("myBookingsBtn")
    .addEventListener("click", () => {

        window.location.href =
            "booking-history.html";

    });


document
    .getElementById("eventsBtn")
    .addEventListener("click", () => {

        window.location.href =
            "events.html";

    });