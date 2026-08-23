console.log("SEAT SELECTION JS LOADED");

const seatLayout = document.getElementById("seat-layout");
const selectedSeatsText = document.getElementById("selectedSeats");
const ticketCount = document.getElementById("ticketCount");
const totalPrice = document.getElementById("totalPrice");
const bookingSummary = document.querySelector(".booking-summary");
const continueBtn = document.getElementById("continueBtn");

const currentEvent = {
    title: "Coldplay: Music Of The Spheres",
    type: "concert"
};

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = 8;

const REGULAR_PRICE = 400;
const VIP_PRICE = 600;

const bookedSeats = ["A5", "A6", "C4", "F7"];
const vipRows = ["A", "B"];

let selectedSeats = [];

// SAVE BOOKING

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

function generateSeats() {

    seatLayout.innerHTML = "";

    ROWS.forEach(row => {

        const rowDiv = document.createElement("div");
        rowDiv.classList.add("seat-row");

        const label = document.createElement("span");
        label.classList.add("row-label");
        label.textContent = row;

        rowDiv.appendChild(label);

        for (let col = 1; col <= COLS; col++) {

            if (col === 5) {
                const aisle = document.createElement("div");
                aisle.classList.add("aisle");
                rowDiv.appendChild(aisle);
            }

            const seat = document.createElement("div");
            const seatId = `${row}${col}`;

            seat.classList.add("seat");
            seat.dataset.id = seatId;

            const isVIP = vipRows.includes(row);
            const price = isVIP ? VIP_PRICE : REGULAR_PRICE;

            if (bookedSeats.includes(seatId)) {
                seat.classList.add("booked");
            } else if (isVIP) {
                seat.classList.add("vip");
            } else {
                seat.classList.add("available");
            }

            seat.addEventListener("click", () => {

                if (seat.classList.contains("booked")) {
                    return;
                }

                const existingSeat = selectedSeats.find(
                    s => s.id === seatId
                );

                if (existingSeat) {

                    selectedSeats = selectedSeats.filter(
                        s => s.id !== seatId
                    );

                    seat.classList.remove("selected");

                    seat.classList.add(
                        isVIP ? "vip" : "available"
                    );

                } else {

                    selectedSeats.push({
                        id: seatId,
                        row: row,
                        col: col,
                        type: isVIP ? "VIP" : "Regular",
                        price: price
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

        if (row === "D") {
            const walkway = document.createElement("div");
            walkway.classList.add("walkway");
            seatLayout.appendChild(walkway);
        }
    });
}


// UPDATE SUMMARY

function updateSummary() {

    if (selectedSeats.length === 0) {

        selectedSeatsText.textContent = "None";
        ticketCount.textContent = "0";
        totalPrice.textContent = "₹0";

        bookingSummary.classList.remove("show");
        continueBtn.disabled = true;

        return;
    }

    const total = selectedSeats.reduce(
        (sum, seat) => sum + seat.price,
        0
    );

    selectedSeatsText.textContent =
        selectedSeats.map(seat => seat.id).join(", ");

    ticketCount.textContent =
        selectedSeats.length;

    totalPrice.textContent =
        `₹${total}`;

    bookingSummary.classList.add("show");
    continueBtn.disabled = false;
}


// REVIEW BOOKING

continueBtn.addEventListener("click", () => {

    if (selectedSeats.length === 0) {
        return;
    }

    saveBooking();

    window.location.href = "review_booking.html";
});

// START

generateSeats();
updateSummary();