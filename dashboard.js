const API_URL = "https://spice-haven-backend.onrender.com";

const token = localStorage.getItem("adminToken");

const reservationsTable = document.getElementById("reservationsTable");
const contactsTable = document.getElementById("contactsTable");

const reservationCount = document.getElementById("reservationCount");
const contactCount = document.getElementById("contactCount");


// Token nahi hai to login page par bhejo
if (!token) {
    window.location.href = "admin.html";
}


// Reservations load karo
async function loadReservations() {

    try {

        const response = await fetch(
            `${API_URL}/admin/reservations`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        const result = await response.json();

        if (result.success) {

            reservationCount.textContent =
                result.reservations.length;

            if (result.reservations.length === 0) {

                reservationsTable.innerHTML = `
                    <tr>
                        <td colspan="5">
                            No reservations found.
                        </td>
                    </tr>
                `;

                return;
            }

            reservationsTable.innerHTML =
                result.reservations.map(reservation => `

                    <tr>
                        <td>${reservation.name || "-"}</td>
                        <td>${reservation.phone || "-"}</td>
                        <td>${reservation.date || "-"}</td>
                        <td>${reservation.time || "-"}</td>
                        <td>${reservation.guests || "-"}</td>
                    </tr>

                `).join("");

        }

    } catch (error) {

        console.error("Reservation loading error:", error);

        reservationsTable.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load reservations.
                </td>
            </tr>
        `;
    }
}


// Contact messages load karo
async function loadContacts() {

    try {

        const response = await fetch(
            `${API_URL}/admin/contacts`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        const result = await response.json();

        if (result.success) {

            contactCount.textContent =
                result.contacts.length;

            if (result.contacts.length === 0) {

                contactsTable.innerHTML = `
                    <tr>
                        <td colspan="4">
                            No contact messages found.
                        </td>
                    </tr>
                `;

                return;
            }

            contactsTable.innerHTML =
                result.contacts.map(contact => `

                    <tr>
                        <td>${contact.name || "-"}</td>
                        <td>${contact.email || "-"}</td>
                        <td>${contact.phone || "-"}</td>
                        <td>${contact.message || "-"}</td>
                    </tr>

                `).join("");

        }

    } catch (error) {

        console.error("Contact loading error:", error);

        contactsTable.innerHTML = `
            <tr>
                <td colspan="4">
                    Failed to load messages.
                </td>
            </tr>
        `;
    }
}


// Logout
function logout() {

    localStorage.removeItem("adminToken");

    window.location.href = "admin.html";
}


// Buttons
document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);

document
    .getElementById("refreshReservations")
    .addEventListener("click", loadReservations);

document
    .getElementById("refreshContacts")
    .addEventListener("click", loadContacts);


// Page open hote hi data load karo
loadReservations();
loadContacts();