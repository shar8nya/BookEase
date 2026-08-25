
// REVIEW BOOKING

console.log("REVIEW BOOKING JS LOADED");



// DOM ELEMENTS

const selectedSeatsList =
    document.getElementById("selectedSeatsList");

const ticketPrice =
    document.getElementById("ticketPrice");

const convenienceFee =
    document.getElementById("convenienceFee");

const totalPrice =
    document.getElementById("totalPrice");

const confirmBookingBtn =
    document.getElementById("confirmBookingBtn");



// EVENT DETAILS

// GET SELECTED EVENT FROM SESSION STORAGE

const storedEvent =
    sessionStorage.getItem("bookEaseSelectedEvent");

if (!storedEvent) {

    alert(
        "No event selected. Please select an event first."
    );

    window.location.href = "../events.html";

}

const eventData = JSON.parse(storedEvent);


// GET BOOKING FROM SESSION STORAGE

const storedBooking =
    sessionStorage.getItem("bookEaseCurrentBooking");


// CHECK BOOKING

if (!storedBooking) {

    alert(
        "No booking information found. Please select your seats first."
    );

    window.location.href = "seat_selection.html";

} else {

    const booking = JSON.parse(storedBooking);

    displayEvent();

    displaySeats(booking.seats);

    calculatePrice(booking.seats);

    setupConfirmButton(booking);

}

// DISPLAY EVENT

function displayEvent() {

    document.getElementById("eventTitle").textContent =
        eventData.title;

    document.getElementById("eventCategory").textContent =
        eventData.category;

    document.getElementById("eventVenue").textContent =
        `📍 ${eventData.venue}`;

    document.getElementById("eventDate").textContent =
        `📅 ${eventData.date}`;

    document.getElementById("eventTime").textContent =
        `🕒 ${eventData.time}`;

    document.getElementById("eventPoster").src =
        eventData.poster;

}

// DISPLAY SELECTED SEATS

function displaySeats(seats) {

    selectedSeatsList.innerHTML = "";

    seats.forEach(seat => {

        const card =
            document.createElement("div");

        card.classList.add(
            "selected-seat-card"
        );

        // Seat number

        const seatId =
            document.createElement("span");

        seatId.classList.add(
            "selected-seat-id"
        );

        seatId.textContent =
            seat.id;


        // Seat type

        const seatType =
            document.createElement("span");

        seatType.classList.add(
            "selected-seat-type"
        );

        seatType.textContent =
            seat.type;


        // Seat price

        const seatPrice =
            document.createElement("span");

        seatPrice.classList.add(
            "selected-seat-price"
        );

        seatPrice.textContent =
            `₹${seat.price}`;


        // Add everything to card

        card.appendChild(seatId);

        card.appendChild(seatType);

        card.appendChild(seatPrice);

        // Add card to page

        selectedSeatsList.appendChild(card);

    });

}

// CALCULATE PRICE

function calculatePrice(seats) {

    // Add all seat prices

    const subtotal =
        seats.reduce(
            (total, seat) =>
                total + Number(seat.price),
            0
        );


    // 5% convenience fee

    const fee =
        Math.round(subtotal * 0.05);


    // Final amount

    const total =
        subtotal + fee;


    // Display prices

    ticketPrice.textContent =
        `₹${subtotal}`;

    convenienceFee.textContent =
        `₹${fee}`;

    totalPrice.textContent =
        `₹${total}`;


    return {
        subtotal,
        fee,
        total
    };

}


// CONFIRM BOOKING

function setupConfirmButton(booking) {

    confirmBookingBtn.addEventListener(
        "click",
        () => {

            const prices =
                calculatePrice(booking.seats);


            // Generate booking ID

            const bookingId =
                "BE-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase();


            // Add booking information

            booking.bookingId =
                bookingId;

            booking.event =
                eventData.title;

            booking.category =
                eventData.category;

            booking.venue =
                eventData.venue;

            booking.date =
                eventData.date;

            booking.time =
                eventData.time;

            booking.poster =
                eventData.poster;

            booking.subtotal =
                prices.subtotal;

            booking.convenienceFee =
                prices.fee;

            booking.total =
                prices.total;

            booking.bookedAt =
                new Date().toISOString();

            // GET OLD BOOKINGS

            const bookings =
                JSON.parse(
                    localStorage.getItem(
                        "bookEaseBookings"
                    )
                ) || [];


            // Add new booking

            bookings.push(booking);

            // Save booking history

            localStorage.setItem(
                "bookEaseBookings",
                JSON.stringify(bookings)
            );

            // Save booking for ticket page

            sessionStorage.setItem(
                "bookEaseConfirmedBooking",
                JSON.stringify(booking)
            );
            // Remove temporary booking

            sessionStorage.removeItem(
                "bookEaseCurrentBooking"
            );

            // Go to ticket
            window.location.href =
                "ticket.html";

        }
    );

}