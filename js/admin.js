    const session = JSON.parse(localStorage.getItem("hcm_session"));

    if (!session || session.role !== "admin") {
        window.location.href = "index.html";
    } else {
        document.getElementById("admin-name").textContent =
            "Welcome, " + session.name;
    }

    document.getElementById("logout-btn").addEventListener("click", function () {
        localStorage.removeItem("hcm_session");
        window.location.href = "index.html";
    });

    const users = getUsers();
    const employees = users.filter(function (user) {
        return user.role === "employee";
    });

    document.getElementById("total-employees").textContent = employees.length;

    const attendance = getData("hcm_attendance");
    const today = new Date().toLocaleDateString("en-CA");

    const todayRecords = attendance.filter(function (record) {
        return record.date === today;
    });

    document.getElementById("today-attendance").textContent = todayRecords.length;

    const leaves = getData("hcm_leaves");
    const pendingLeaves = leaves.filter(function (leave) {
        return leave.status === "Pending";
    });

    document.getElementById("pending-leaves").textContent = pendingLeaves.length;


    const attendanceContainer = document.getElementById("admin-attendance-records");

    attendanceContainer.innerHTML = todayRecords.map(function (record) {
        const employee = employees.find(function (user) {
            return user.id === record.employeeId;
        });

        
    return `
        <div class="attendance-card">
            <h3>${employee ? employee.name : "Unknown Employee"}</h3>
            <p><strong>Date:</strong> ${record.date}</p>
            <p><strong>Check In:</strong> ${record.checkIn}</p>
            <p><strong>Check Out:</strong> ${record.checkOut || "Pending"}</p>
            <p><strong>Status:</strong> ${record.status}</p>
        </div>
    `;

    }).join("");

    if (todayRecords.length === 0) {
        attendanceContainer.innerHTML = "<p>No attendance records for today.</p>";
    }

    