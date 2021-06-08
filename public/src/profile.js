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
            // 登入後取得負評數量
            const getNeg = new XMLHttpRequest();
            getNeg.onreadystatechange = function () {
                if (getNeg.readyState === 4 && getNeg.status === 200) {
                    const response = JSON.parse(getNeg.responseText);
                    const counts = response.length;
                    localStorage.setItem("negativeCounts", counts);
                    // window.location.href = "contentlist.html";
                }
            };
            getNeg.open("GET", "api/1.0/negativeContent");
            getNeg.setRequestHeader("Content-Type", "application/json");
            const accessToken = localStorage.getItem("access_token");
            getNeg.setRequestHeader("Authorization", "bearer " + accessToken);
            getNeg.send();
        }
    };
};
xhr.open("GET", "api/1.0/profile");
xhr.setRequestHeader("Content-Type", "application/json");
const accessToken = localStorage.getItem("access_token");
xhr.setRequestHeader("Authorization", "bearer " + accessToken);
xhr.send();

// 登出按鈕
const button = document.getElementById("button");
button.addEventListener("click", function () {
    Swal.fire({
        title: "確定登出?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "登出",
        cancelButtonText: "取消"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                "已登出!"
            );
            localStorage.removeItem("access_token");
            localStorage.removeItem("negativeCounts");
            window.location.href = "member.html";
        }
    });
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

// When the user scrolls the page, execute myFunction
window.onscroll = function () { myFunction(); };

// Get the navbar
const navbar = document.querySelector(".box1");

// Get the offset position of the navbar
const sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction () {
    const box3 = document.querySelector(".box3");
    if (window.pageYOffset >= sticky) {
        box3.style = "display:flex";
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
        box3.style = "display:none";
    }
}
