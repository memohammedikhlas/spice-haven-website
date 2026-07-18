const API_URL = "https://spice-haven-backend.onrender.com";

const token = localStorage.getItem("adminToken");

const reservationsTable = document.getElementById("reservationsTable");
const contactsTable = document.getElementById("contactsTable");

const reservationCount = document.getElementById("reservationCount");
const contactCount = document.getElementById("contactCount");

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

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
                        <td colspan="7">
                            No reservations found.
                        </td>
                    </tr>
                `;

                return;
            }

            reservationsTable.innerHTML =
                result.reservations.map(reservation => `

                    <tr>
                        <td>${escapeHTML(reservation.name || "-")}</td>
                        <td>${escapeHTML(reservation.phone || "-")}</td>
                        <td>${escapeHTML(reservation.date || "-")}</td>
                        <td>${escapeHTML(reservation.time || "-")}</td>
                        <td>${escapeHTML(reservation.guests || "-")}</td>
                        <td>
    <select
        class="status-select"
        onchange="updateReservationStatus('${reservation._id}', this.value)"
    >
        <option value="Pending"
            ${(reservation.status || "Pending") === "Pending" ? "selected" : ""}>
            Pending
        </option>

        <option value="Confirmed"
            ${reservation.status === "Confirmed" ? "selected" : ""}>
            Confirmed
        </option>

        <option value="Cancelled"
            ${reservation.status === "Cancelled" ? "selected" : ""}>
            Cancelled
        </option>
    </select>
</td>
<td>
    <button
        class="delete-btn"
        onclick="deleteReservation('${reservation._id}')"
    >
        Delete
    </button>
</td>
                    </tr>

                `).join("");

        }

    } catch (error) {

        console.error("Reservation loading error:", error);

        reservationsTable.innerHTML = `
            <tr>
                <td colspan="7">
                    Failed to load reservations.
                </td>
            </tr>
        `;
    }
}

async function updateReservationStatus(id, status) {

    try {

        const response = await fetch(
            `${API_URL}/admin/reservations/${id}/status`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        if (response.status === 401) {
    logout();
    return;
}

        const result = await response.json();

        if (!result.success) {
            alert("Failed to update status");
            loadReservations();
            return;
        }

        console.log("Status updated successfully");

    } catch (error) {

        console.error("Status update error:", error);

        alert("Something went wrong while updating status");

        loadReservations();
    }
}

async function deleteReservation(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this reservation?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/admin/reservations/${id}`,
            {
                method: "DELETE",
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
            alert("Reservation deleted successfully");

            // Table ko dobara load karega
            loadReservations();
        } else {
            alert(result.message || "Failed to delete reservation");
        }

    } catch (error) {

        console.error("Delete reservation error:", error);
        alert("Something went wrong while deleting reservation");

    }
}

async function deleteContact(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this contact message?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/admin/contacts/${id}`,
            {
                method: "DELETE",
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

            alert("Contact message deleted successfully");

            loadContacts();

        } else {

            alert(result.message || "Failed to delete contact message");

        }

    } catch (error) {

        console.error("Delete contact error:", error);

        alert("Something went wrong while deleting contact message");

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
                        <td colspan="5">
                            No contact messages found.
                        </td>
                    </tr>
                `;

                return;
            }

            contactsTable.innerHTML =
                result.contacts.map(contact => `

                    <tr>
                        <td>${escapeHTML(contact.name || "-")}</td>
                        <td>${escapeHTML(contact.email || "-")}</td>
                        <td>${escapeHTML(contact.phone || "-")}</td>
                        <td>${escapeHTML(contact.message || "-")}</td>
                        <td>
    <button
        class="delete-btn"
        onclick="deleteContact('${contact._id}')"
    >
        Delete
    </button>
</td>
                    </tr>

                `).join("");

        }

    } catch (error) {

        console.error("Contact loading error:", error);

        contactsTable.innerHTML = `
            <tr>
                <td colspan="5">
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