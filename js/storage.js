function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getCompany() {
    return JSON.parse(localStorage.getItem("hcm_company")) || null;
}

function saveCompany(company) {
    localStorage.setItem("hcm_company", JSON.stringify(company));
}

function getUsers() {
    return getData("hcm_users");
}

function saveUsers(users) {
    saveData("hcm_users", users);
}