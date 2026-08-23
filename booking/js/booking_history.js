const bookingList = document.getElementById("bookingList");

let bookings =
    JSON.parse(localStorage.getItem("bookEaseBookings")) || [];


// Remove invalid bookings
bookings = bookings.filter(
    booking =>
        booking.bookingId &&
        booking.event &&
        booking.venue &&
        booking.date &&
        booking.time &&
        Array.isArray(booking.seats)
);


// Remove duplicate bookings
const uniqueBookings = [];

bookings.forEach(booking => {

    if (
        !uniqueBookings.some(
            item => item.bookingId === booking.bookingId
        )
    ) {
        uniqueBookings.push(booking);
    }

});


if (uniqueBookings.length === 0) {

    bookingList.innerHTML = `
        <div class="empty-bookings">
            <h2>No bookings yet</h2>
            <p>Book an event to see your tickets here.</p>
        </div>
    `;

} else {

    uniqueBookings.forEach(booking => {

        const card = document.createElement("div");

        card.classList.add("booking-card");

        const seats = booking.seats
            .map(seat => seat.id)
            .join(", ");

        card.innerHTML = `

            <h2>${booking.event}</h2>

            <div class="booking-info">

                <div>
                    <span>Venue</span>
                    <strong>${booking.venue}</strong>
                </div>

                <div>
                    <span>Date</span>
                    <strong>${booking.date}</strong>
                </div>

                <div>
                    <span>Time</span>
                    <strong>${booking.time}</strong>
                </div>

                <div>
                    <span>Seats</span>
                    <strong>${seats}</strong>
                </div>

                <div>
                    <span>Tickets</span>
                    <strong>${booking.seats.length}</strong>
                </div>

                <div>
                    <span>Total Paid</span>
                    <strong>₹${booking.total}</strong>
                </div>

                <div>
                    <span>Booking ID</span>
                    <strong>${booking.bookingId}</strong>
                </div>

            </div>

            <button class="view-ticket">
                View Ticket →
            </button>

        `;


        card
            .querySelector(".view-ticket")
            .addEventListener("click", () => {

                sessionStorage.setItem(
                    "bookEaseConfirmedBooking",
                    JSON.stringify(booking)
                );

                window.location.href = "ticket.html";

            });


        bookingList.appendChild(card);

    });

}