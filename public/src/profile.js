const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.msg === "null") {
            window.location.href = "member.html";
        } else {
            console.log(response);
            const userName = response.userName;
            const email = response.email;
            const admin = response.admin;
            const parentElement = document.getElementById("main");
            const welcome = document.createElement("div");
            const name = document.createElement("div");
            const emailElement = document.createElement("div");
            const adminElement = document.createElement("div");
            welcome.className = "text";
            name.className = "text";
            emailElement.className = "text";
            adminElement.className = "text";
            welcome.innerHTML = `${userName}您好~`;
            name.innerHTML = `暱稱：${userName}`;
            emailElement.innerHTML = `email:${email}`;
            adminElement.innerHTML = `是否為管理員：${admin}`;
            parentElement.append(welcome, name, emailElement, adminElement);
        }
    };
};
xhr.open("GET", "api/1.0/profile");
xhr.setRequestHeader("Content-Type", "application/json");
const accessToken = localStorage.getItem("access_token");
xhr.setRequestHeader("Authorization", "bearer " + accessToken);
xhr.send();

const button = document.getElementById("button");
button.addEventListener("click", function () {
    localStorage.removeItem("access_token");
    localStorage.removeItem("negativeCounts");
    window.location.href = "member.html";
});

// 取得負評數量
const negativeCounts = localStorage.getItem("negativeCounts");
if (parseInt(negativeCounts) > 0) {
    const alertElement = document.createElement("div");
    alertElement.id = "alert";
    alertElement.innerHTML = negativeCounts;
    const parentElement = document.getElementById("little_menu");
    parentElement.append(alertElement);
}
