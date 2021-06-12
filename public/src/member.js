function ajax (src, data) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const obj = JSON.parse(xhr.responseText);
            if (obj.msg === "此email已經有註冊") {
                //  alert("email已經有註冊");
                Swal.fire("email已經有註冊");
                return;
            } else if (obj.msg === "註冊成功") {
                // alert("註冊成功");
                Swal.fire("註冊成功");
            } else if (obj.msg === "查無此會員，請先註冊") {
                // alert("查無此會員，請先註冊");
                Swal.fire("查無此會員，請先註冊");
                return;
            } else if (obj.msg === "登入成功") {
                // alert("登入成功");
                Swal.fire("登入成功");
            } else if (obj.msg === "密碼錯誤") {
                // alert("密碼錯誤");
                Swal.fire("密碼錯誤");
                return;
            } else if (obj.msg === "email格式不符") {
                Swal.fire("email格式不符");
                return;
            } else if (obj.msg === "公司統編只能為數字") {
                Swal.fire("公司統編只能為數字");
                return;
            }
            window.localStorage.setItem("access_token", obj.token);
            const newXhr = new XMLHttpRequest();
            newXhr.onreadystatechange = function () {
                if (newXhr.readyState === 4 && newXhr.status === 200) {
                    const res = JSON.parse(newXhr.responseText);
                    console.log(res);
                    if (res.msg === "null") {
                        window.location.href = "member.html";
                    } else {
                        // 登入後取得負評數量
                        const getNeg = new XMLHttpRequest();
                        getNeg.onreadystatechange = function () {
                            if (getNeg.readyState === 4 && getNeg.status === 200) {
                                const response = JSON.parse(getNeg.responseText);
                                console.log(response);
                                const counts = response.length;
                                localStorage.setItem("negativeCounts", counts);
                                window.location.href = "contentlist.html";
                            }
                        };
                        getNeg.open("GET", "api/1.0/negativeContent");
                        getNeg.setRequestHeader("Content-Type", "application/json");
                        const accessToken = localStorage.getItem("access_token");
                        getNeg.setRequestHeader("Authorization", "bearer " + accessToken);
                        getNeg.send();
                    }
                }
            };
            newXhr.open("GET", "api/1.0/profile");
            newXhr.setRequestHeader("Content-Type", "application/json");
            const accessToken = localStorage.getItem("access_token");
            newXhr.setRequestHeader("Authorization", "bearer " + accessToken);
            newXhr.send();
        } else if (xhr.readyState === 4 && xhr.status === 404) {
            Swal.fire("請勿包含特殊字元");
        }
    };
    xhr.open("POST", src);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
}

const newXhr = new XMLHttpRequest();
newXhr.onreadystatechange = function () {
    if (newXhr.readyState === 4 && newXhr.status === 200) {
        const response = JSON.parse(newXhr.responseText);
        const responseLen = Object.keys(response).length;
        if (responseLen === 4) {
            window.location.href = "profile.html";
        }
    };
};
newXhr.open("GET", "api/1.0/profile");
newXhr.setRequestHeader("Content-Type", "application/json");
const accessToken = localStorage.getItem("access_token");
newXhr.setRequestHeader("Authorization", "bearer " + accessToken);
newXhr.send();

// 取得負評數量
const negativeCounts = localStorage.getItem("negativeCounts");
if (parseInt(negativeCounts) > 0) {
    const alertElement = document.createElement("div");
    alertElement.id = "alert";
    alertElement.innerHTML = negativeCounts;
    const parentElement = document.getElementById("little_menu");
    parentElement.append(alertElement);
}

const signInButton = document.getElementById("sign_in_button");
signInButton.addEventListener("click", function () {
    const signInCompany = document.getElementById("sign_in_business_no");
    const signInEmail = document.getElementById("sign_in_email");
    const signInPass = document.getElementById("sign_in_password");
    if (signInCompany.value === "" || signInEmail.value === "" || signInPass.value === "") {
        // alert("每一項皆須填寫");
        Swal.fire("每一項皆須填寫");
        return;
    }
    const data = {
        companyNo: signInCompany.value,
        email: signInEmail.value,
        password: signInPass.value
    };
    ajax("/api/1.0/signin", data);
});

const registerButton = document.getElementById("register_button");
registerButton.addEventListener("click", function () {
    const registerCompanyName = document.getElementById("register_business_name");
    const registerCompanyNo = document.getElementById("register_business_no");
    const userName = document.getElementById("register_user_name");
    const registerEmail = document.getElementById("register_email");
    const registerPassword = document.getElementById("register_password");
    const admin = document.getElementById("admin");

    // Regular expression Testing
    const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    // validate email is ok or not
    if (registerEmail.value.search(emailRule) === -1) {
        Swal.fire("email格式有誤");
        return;
    }

    if (/^\d+$/.test(registerCompanyNo.value) === false) {
        Swal.fire("公司統編只能為數字");
        return;
    };

    if (registerCompanyName.value === "" || registerCompanyNo.value === "" || userName.value === "" || registerEmail.value === "" || registerPassword.vale === "" || admin.value === "") {
        // alert("每一項皆須填寫");
        Swal.fire("每一項皆須填寫");
        return;
    }
    if (registerCompanyName.value.length > 50) {
        Swal.fire("公司名稱不可超過50字");
        return;
    }
    if (registerCompanyNo.value.length > 50) {
        Swal.fire("公司統編不可超過50字");
        return;
    }
    if (userName.value.length > 50) {
        Swal.fire("用戶暱稱不可超過50字");
        return;
    }
    if (registerEmail.value.length > 100) {
        Swal.fire("E-mail不可超過100字");
        return;
    }
    if (registerPassword.value.length > 50) {
        Swal.fire("密碼不可超過50字");
        return;
    }

    const data = {
        companyName: registerCompanyName.value,
        companyNo: registerCompanyNo.value,
        userName: userName.value,
        email: registerEmail.value,
        password: registerPassword.value,
        admin: admin.value
    };
    ajax("/api/1.0/register", data);
});

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
