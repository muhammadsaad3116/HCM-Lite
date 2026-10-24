const session = JSON.parse(localStorage.getItem("hcm_session"));

if (!session || session.role !== "employee") {
    alert("Please login with your employee account.");
    window.location.href = "index.html";
}


function getAttendance() {
    const session = JSON.parse(localStorage.getItem("hcm_session"));
    return getData("hcm_attendance").filter(a => a.employeeId === session.id);
}

function saveAttendance(attendance) {
    const session = JSON.parse(localStorage.getItem("hcm_session"));
    let allAttendance = getData("hcm_attendance").filter(a => a.employeeId !== session.id);

    allAttendance.push(...attendance);
    saveData("hcm_attendance", allAttendance);
}


function getTodayDate() {
    return new Date().toLocaleDateString("en-CA");
}

function getCurrentTime() {
    return new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

document.getElementById("checkInBtn").addEventListener("click", function () {
    let attendance = getAttendance();
    let today = getTodayDate();

    if (attendance.some(a => a.date === today)) {
        alert("Aaj ki attendance pehle se mojood hai!");
        return;
    }


    const company = getCompany();
    const [hours, minutes] = company.officeStart.split(":").map(Number);
    const grace = company.graceMinutes;
    const lateAfter = hours * 60 + minutes + grace;
    const [checkHours, checkMinutes] = getCurrentTime().split(":").map(Number);
    const status = checkHours * 60 + checkMinutes > lateAfter ? "Late" : "Present";


    attendance.push({
        employeeId: JSON.parse(localStorage.getItem("hcm_session")).id,
        date: today,
        checkIn: getCurrentTime(),
        checkOut: "",
        status: status
    });

    saveAttendance(attendance);
    showAttendance();
});

document.getElementById("checkOutBtn").addEventListener("click", function () {
    let attendance = getAttendance();
    let today = getTodayDate();
    let record = attendance.find(a => a.date === today);

    if (!record || record.checkOut) {
        alert("Check In karo ya Check Out pehle ho chuka hai!");
        return;
    }

    record.checkOut = getCurrentTime();
    saveAttendance(attendance);
    showAttendance();
});


function showAttendance() {
    let attendance = getAttendance();
    let container = document.getElementById("attendanceRecord");

    container.innerHTML = attendance.map(a => `
        <div class="attendance-card">
            <p><strong>Date:</strong> ${a.date}</p>
            <p><strong>Check In:</strong> ${a.checkIn}</p>
            <p><strong>Check Out:</strong> ${a.checkOut || "Pending"}</p>
            <p><strong>Status:</strong> 
                <span class="${a.status === "Late" ? "late-status" : "present-status"}">
                    ${a.status}
                </span>
            </p>
        </div>
    `).join("");
}

showAttendance();

document.getElementById("logout-btn").addEventListener("click", function () {
    alert("Logout button clicked!");
    localStorage.removeItem("hcm_session");
    window.location.href = "index.html";
});