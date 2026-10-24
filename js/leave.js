const session = JSON.parse(localStorage.getItem("hcm_session"));

if (!session || session.role !== "employee") {
    alert("Please login with your employee account.");
    window.location.href = "index.html";
}

const leaveForm = document.getElementById("leave-form");
const leaveRecords = document.getElementById("leave-records");

function showLeaves() {
    const leaves = getData("hcm_leaves").filter(
        leave => leave.employeeId === session.id
    );

    leaveRecords.innerHTML = leaves.map(leave => `
        <div class="attendance-card">
            <p><strong>Reason:</strong> ${leave.reason}</p>
            <p><strong>From:</strong> ${leave.startDate}</p>
            <p><strong>To:</strong> ${leave.endDate}</p>
            <p><strong>Status:</strong> ${leave.status}</p>
        </div>
    `).join("");

    if (leaves.length === 0) {
        leaveRecords.innerHTML = "<p>No leave requests yet.</p>";
    }
}

leaveForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const reason = document.getElementById("leave-reason").value.trim();
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    if (endDate < startDate) {
        alert("End date start date se pehle nahi ho sakti.");
        return;
    }

    const leaves = getData("hcm_leaves");

    leaves.push({
        id: Date.now(),
        employeeId: session.id,
        employeeName: session.name,
        reason: reason,
        startDate: startDate,
        endDate: endDate,
        status: "Pending"
    });

    saveData("hcm_leaves", leaves);
    leaveForm.reset();
    showLeaves();
    alert("Leave request submitted!");
});

document.getElementById("logout-btn").onclick = function () {
    localStorage.removeItem("hcm_session");
    window.location.href = "index.html";
};

showLeaves();