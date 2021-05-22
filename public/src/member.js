function ajax (src, data) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const obj = JSON.parse(xhr.responseText);
            console.log(obj);
            if (obj.msg === "此email已經有註冊") {
                alert("email已經有註冊");
            } else if (obj.msg === "註冊成功") {
                alert("註冊成功");
            } else if (obj.msg === "查無此會員，請先註冊") {
                alert("查無此會員，請先註冊");
            } else if (obj.msg === "登入成功") {
                alert("登入成功");
            }
            window.localStorage.setItem("access_token", obj.token);
        }
    };
    xhr.open("POST", src);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
}

const signInButton = document.getElementById("sign_in_button");
signInButton.addEventListener("click", function () {
    const signInCompany = document.getElementById("sign_in_business_no");
    const signInEmail = document.getElementById("sign_in_email");
    const signInPass = document.getElementById("sign_in_password");
    if (signInCompany.value === "" || signInEmail.value === "" || signInPass.value === "") {
        alert("每一項皆須填寫");
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
    if (registerCompanyName.value === "" || registerCompanyNo.value === "" || userName.value === "" || registerEmail.value === "" || registerPassword.vale === "" || admin.value === "") {
        alert("每一項皆須填寫");
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
