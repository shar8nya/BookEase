console.log("SEAT SELECTION JS LOADED");

// DOM ELEMENTS
const seatLayout = document.getElementById("seat-layout");
const selectedSeatsText = document.getElementById("selectedSeats");
const ticketCount = document.getElementById("ticketCount");
const totalPrice = document.getElementById("totalPrice");
const bookingSummary = document.querySelector(".booking-summary");
const continueBtn = document.getElementById("continueBtn");


// GET SELECTED EVENT

const storedEvent =
    sessionStorage.getItem("bookEaseSelectedEvent");

if (!storedEvent) {
    alert("No event selected.");
    window.location.href = "../events.html";
}

const currentEvent = JSON.parse(storedEvent);


// SEAT CONFIGURATION

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = 8;

const REGULAR_PRICE = Number(currentEvent.regularPrice);
const VIP_PRICE = Number(currentEvent.vipPrice);


const bookedSeats = ["A5", "A6", "C4", "F7"];


const vipRows = ["A", "B"];

let selectedSeats = [];


// SAVE CURRENT BOOKING
// Stores the selected event and seats temporarily for the next page.

function saveBooking() {
    sessionStorage.setItem(
        "bookEaseCurrentBooking",
        JSON.stringify({
            event: currentEvent,
            seats: selectedSeats
        })
    );
}


// GENERATE SEATS
// Creates the complete seat layout dynamically using JavaScript.

function generateSeats() {

    seatLayout.innerHTML = "";

    ROWS.forEach(row => {

        const rowDiv = document.createElement("div");
        rowDiv.classList.add("seat-row");

        // Display the row label.
        const label = document.createElement("span");
        label.classList.add("row-label");
        label.textContent = row;
        rowDiv.appendChild(label);

        for (let col = 1; col <= COLS; col++) {

            // Create an aisle after the fourth seat.
            if (col === 5) {
                const aisle = document.createElement("div");
                aisle.classList.add("aisle");
                rowDiv.appendChild(aisle);
            }

            const seat = document.createElement("div");
            const seatId = `${row}${col}`;

            // Determine whether this is a VIP seat.
            const isVIP = vipRows.includes(row);
            const price = isVIP ? VIP_PRICE : REGULAR_PRICE;

            seat.classList.add("seat");
            seat.dataset.id = seatId;

            // Set the initial seat status.
            if (bookedSeats.includes(seatId)) {
                seat.classList.add("booked");
            } else {
                seat.classList.add(
                    isVIP ? "vip" : "available"
                );
            }


            // HANDLE SEAT CLICK
            seat.addEventListener("click", () => {

                // Booked seats cannot be selected.
                if (seat.classList.contains("booked")) {
                    return;
                }

                // Check whether the seat is already selected.
                const existingSeat =
                    selectedSeats.find(s => s.id === seatId);


                // DESELECT SEAT
                if (existingSeat) {

                    selectedSeats =
                        selectedSeats.filter(
                            s => s.id !== seatId
                        );

                    seat.classList.remove("selected");
                    seat.classList.add(
                        isVIP ? "vip" : "available"
                    );

                }

                // SELECT SEAT
                else {

                    selectedSeats.push({
                        id: seatId,
                        row,
                        col,
                        type: isVIP ? "VIP" : "Regular",
                        price
                    });

                    seat.classList.remove(
                        "available",
                        "vip"
                    );

                    seat.classList.add("selected");
                }

                updateSummary();
                saveBooking();
            });

            rowDiv.appendChild(seat);
        }

        seatLayout.appendChild(rowDiv);

        // Add a walkway between rows D and E.
        if (row === "D") {
            const walkway = document.createElement("div");
            walkway.classList.add("walkway");
            seatLayout.appendChild(walkway);
        }
    });
}


// UPDATE BOOKING SUMMARY
function updateSummary() {

    const total = selectedSeats.reduce(
        (sum, seat) => sum + seat.price,
        0
    );

    selectedSeatsText.textContent =
        selectedSeats.length
            ? selectedSeats.map(seat => seat.id).join(", ")
            : "None";

    ticketCount.textContent =
        selectedSeats.length;

    totalPrice.textContent =
        `₹${total}`;

    bookingSummary.classList.toggle(
        "show",
        selectedSeats.length > 0
    );

    
    continueBtn.disabled =
        selectedSeats.length === 0;
}


// CONTINUE TO REVIEW BOOKING

continueBtn.addEventListener("click", () => {

    if (!selectedSeats.length) {
        return;
    }

    saveBooking();

    window.location.href =
        "review_booking.html";
});


// START

generateSeats();
updateSummary();