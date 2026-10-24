const setupForm = document.getElementById("setup-form");
const loginForm = document.getElementById("login-form");
const setupSection = document.getElementById("setup-section");
const loginSection = document.getElementById("login-section");
const message = document.getElementById("message");

// Check whether the company is already registered
function checkSetup() {
    const company = getCompany();

    if (company) {
        setupSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    }
}

checkSetup();

// Create Admin Account
setupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (getCompany()) {
        message.textContent = "Company is already registered. Please login.";
        checkSetup();
        return;
    }

    const companyName = document.getElementById("company-name").value.trim();
    const adminName = document.getElementById("admin-name").value.trim();
    const adminEmail = document.getElementById("admin-email").value.trim().toLowerCase();
    const adminPassword = document.getElementById("admin-password").value;

    const company = {
        name: companyName,
        officeStart: "09:00",
        graceMinutes: 15,
        leaveQuota: 20,
        workingDays: 22
    };

    const admin = {
        id: Date.now(),
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        department: "Management",
        salary: 0
    };

    saveCompany(company);
    saveUsers([admin]);

    message.textContent = "Admin account created successfully! Please login.";

    setupForm.reset();
    checkSetup();
});

// Login
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    const users = getUsers();

    const user = users.find(function (item) {
        return item.email === email && item.password === password;
    });

    if (!user) {
        message.textContent = "Incorrect email or password.";
        return;
    }

    localStorage.setItem("hcm_session", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }));

    if (user.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "attendance.html";
    }
});


function togglePassword(inputId, button) {
    const passwordInput = document.getElementById(inputId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        button.textContent = "👁️";
    } else {
        passwordInput.type = "password";
        button.textContent = "👁️‍🗨️";
    }
}