const adminLoginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("loginMessage");

adminLoginForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    loginMessage.textContent = "Logging in...";

    try {
        const response = await fetch(
            "https://spice-haven-backend.onrender.com/admin/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const result = await response.json();

        if (result.success) {

        localStorage.setItem("adminToken", result.token);

        window.location.href = "dashboard.html";
        } else {
    loginMessage.textContent =
        result.message || "Invalid username or password";
}

    } catch (error) {
        console.error(error);
        loginMessage.textContent = "Unable to connect to server.";
    }
});