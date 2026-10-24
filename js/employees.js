const session = JSON.parse(localStorage.getItem("hcm_session"));

if (!session || session.role !== "admin") {
    window.location.href = "index.html";
}

document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.removeItem("hcm_session");
    window.location.href = "index.html";
});

const employeeForm = document.getElementById("employee-form");
const employeeList = document.getElementById("employee-list");
const employeeMessage = document.getElementById("employee-message");
const searchInput = document.getElementById("search-employee");

// Add employee
employeeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("employee-name").value.trim();
    const email = document.getElementById("employee-email").value.trim().toLowerCase();
    const password = document.getElementById("employee-password").value;
    const department = document.getElementById("employee-department").value.trim();
    const salary = Number(document.getElementById("employee-salary").value);

    const users = getUsers();

    const emailExists = users.some(function (user) {
        return user.email === email;
    });

    if (emailExists) {
        employeeMessage.textContent = "This email is already registered.";
        return;
    }

    if (salary <= 0 || !Number.isFinite(salary)) {
        employeeMessage.textContent = "Please enter a valid salary.";
        return;
    }

    const employee = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: "employee",
        department: department,
        salary: salary
    };

    users.push(employee);
    saveUsers(users);

    employeeForm.reset();
    employeeMessage.textContent = "Employee added successfully!";

    renderEmployees();
});

// Display employees
function renderEmployees() {
    const users = getUsers();

    const employees = users.filter(function (user) {
        return user.role === "employee";
    });

    const searchText = searchInput.value.trim().toLowerCase();

    const filteredEmployees = employees.filter(function (employee) {
        return employee.name.toLowerCase().includes(searchText) ||
               employee.email.toLowerCase().includes(searchText);
    });

    employeeList.innerHTML = "";

    if (filteredEmployees.length === 0) {
        employeeList.textContent = "No employees found.";
        return;
    }

    filteredEmployees.forEach(function (employee) {
        const card = document.createElement("div");
        card.className = "employee-card";

        const name = document.createElement("h3");
        name.textContent = employee.name;

        const email = document.createElement("p");
        email.textContent = "Email: " + employee.email;

        const department = document.createElement("p");
        department.textContent = "Department: " + employee.department;

        const salary = document.createElement("p");
        salary.textContent = "Monthly Salary: PKR " +
            employee.salary.toLocaleString("en-PK");

        const actions = document.createElement("div");
        actions.className = "employee-actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editEmployee(employee.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteEmployee(employee.id);
        });

        actions.append(editButton, deleteButton);
        card.append(name, email, department, salary, actions);
        employeeList.appendChild(card);
    });
}

// Edit employee
function editEmployee(id) {
    const users = getUsers();
    const employee = users.find(function (user) {
        return user.id === id;
    });

    if (!employee) return;

    const newName = prompt("Enter employee name:", employee.name);
    if (newName === null) return;

    const newDepartment = prompt("Enter department:", employee.department);
    if (newDepartment === null) return;

    const newSalary = prompt("Enter monthly salary:", employee.salary);
    if (newSalary === null) return;

    if (!newName.trim() || !newDepartment.trim() ||
        newSalary.trim() === "" || !Number.isFinite(Number(newSalary)) ||
        Number(newSalary) <= 0) {
        alert("Please enter valid employee details.");
        return;
    }

    employee.name = newName.trim();
    employee.department = newDepartment.trim();
    employee.salary = Number(newSalary);

    saveUsers(users);
    renderEmployees();
}

// Delete employee
function deleteEmployee(id) {
    const confirmed = confirm("Are you sure you want to delete this employee?");

    if (!confirmed) return;

    const users = getUsers().filter(function (user) {
        return user.id !== id;
    });

    saveUsers(users);
    renderEmployees();
}

searchInput.addEventListener("input", renderEmployees);

renderEmployees();