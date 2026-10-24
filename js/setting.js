const session = JSON.parse(localStorage.getItem("hcm_session"));

if (!session || session.role !== "admin") {
    window.location.href = "index.html";
}

const form = document.getElementById("settings-form");
const company = getCompany();

if (company) {
    document.getElementById("company-name").value = company.name || "";
    document.getElementById("office-start").value = company.officeStart || "09:00";
    document.getElementById("grace-minutes").value = company.graceMinutes ?? 15;
    document.getElementById("leave-quota").value = company.leaveQuota ?? 20;
    document.getElementById("working-days").value = company.workingDays ?? 22;
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedCompany = {
        name: document.getElementById("company-name").value.trim(),
        officeStart: document.getElementById("office-start").value,
        graceMinutes: Number(document.getElementById("grace-minutes").value),
        leaveQuota: Number(document.getElementById("leave-quota").value),
        workingDays: Number(document.getElementById("working-days").value)
    };

    saveCompany(updatedCompany);
    document.getElementById("settings-message").textContent = "Settings saved successfully!";
});

document.getElementById("logout-btn").onclick = function () {
    localStorage.removeItem("hcm_session");
    window.location.href = "index.html";
};
