const session = JSON.parse(localStorage.getItem("hcm_session"));

if (!session || session.role !== "admin") {
    window.location.href = "index.html";
}

const employeeSelect = document.getElementById("employee-select");
const monthInput = document.getElementById("pay-month");
const result = document.getElementById("payslip-result");

const users = getUsers();
const employees = users.filter(user => user.role === "employee");

employees.forEach(employee => {
    const option = document.createElement("option");
    option.value = employee.id;
    option.textContent = employee.name;
    employeeSelect.appendChild(option);
});

monthInput.value = new Date().toISOString().slice(0, 7);

document.getElementById("generate-btn").addEventListener("click", function () {
    const employee = employees.find(
        user => String(user.id) === employeeSelect.value
    );

    if (!employee || !monthInput.value) {
        alert("Employee aur salary month select karo.");
        return;
    }

    const salary = Number(employee.salary) || 0;

    result.innerHTML = `
        <div class="attendance-card">
            <h2>HCM Lite - Payslip</h2>
            <p><strong>Employee:</strong> ${employee.name}</p>
            <p><strong>Email:</strong> ${employee.email}</p>
            <p><strong>Department:</strong> ${employee.department || "N/A"}</p>
            <p><strong>Salary Month:</strong> ${monthInput.value}</p>
            <hr>
            <p><strong>Basic Salary:</strong> PKR ${salary.toLocaleString()}</p>
            <p><strong>Deductions:</strong> PKR 0</p>
            <h3>Net Salary: PKR ${salary.toLocaleString()}</h3>
            <button onclick="window.print()">Print Payslip</button>
        </div>
    `;
});

document.getElementById("logout-btn").onclick = function () {
    localStorage.removeItem("hcm_session");
    window.location.href = "index.html";
};