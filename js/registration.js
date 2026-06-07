const form = document.getElementById("form");

const nameErr = document.getElementById("nameErr");
const usernameErr = document.getElementById("usernameErr");
const emailErr = document.getElementById("emailErr");
const passwordErr = document.getElementById("passwordErr");
const confirmErr = document.getElementById("confirmErr");
const termsErr = document.getElementById("termsErr");

function showerror(ele, eleId, mes) {
    ele.style.opacity = 1;
    ele.style.visibility = "visible";
    ele.innerText = mes;

    let element;

    if (eleId) {
        element = document.getElementById(eleId);
        element.style.border = "1px solid red";
    }

    setTimeout(() => {
        ele.style.opacity = 0;
        ele.style.visibility = "hidden";
        ele.innerText = "";

        if (eleId) {
            element.style.border = "1px solid #e3dcdc";
        }
    }, 2000);
}
function validName(name) {
    name = name.trim();

    const reg = /^[A-Za-z ]+$/;

    return reg.test(name);
}

function validUsername(username) {
    username = username.trim();

    const reg = /^[A-Za-z0-9_]+$/;

    return reg.test(username);
}

function validEmail(email) {
    email = email.trim();

    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return reg.test(email);
}

function isUsernameAlreadyExists(users, username) {
    return users.some((user) => {
        return user.username.toLowerCase() === username.trim().toLowerCase();
    });
}

function isEmailAlreadyExists(users, email) {
    return users.some((user) => {
        return user.email.toLowerCase() === email.trim().toLowerCase();
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("Cpassword").value;
    const checkBox = document.getElementById("Terms_agree").checked;

    let isValid = true;

    const users = getItemFromLocal("Users");

    if (!validName(fullname)) {
        showerror(nameErr, "nameBox", "Please enter valid name");
        isValid = false;
    }

    if (!validUsername(username)) {
        showerror(usernameErr, "usernameBox", "Please enter valid username");
        isValid = false;
    } else if (isUsernameAlreadyExists(users, username)) {
        showerror(usernameErr, "usernameBox", "Username already exists");
        isValid = false;
    }

    if (!validEmail(email)) {
        showerror(emailErr, "emailBox", "Please enter valid email");
        isValid = false;
    } else if (isEmailAlreadyExists(users, email)) {
        showerror(emailErr, "emailBox", "Email already exists");
        isValid = false;
    }

    if (password.length < 6) {
        showerror(passwordErr, "passwordBox", "Password must contain 6 characters");
        isValid = false;
    }

    if (password.length >= 6 && password !== confirmPassword) {
        showerror(confirmErr, "CpasswordBox", "Password does not match");
        isValid = false;
    }

    if (!checkBox) {
        showerror(termsErr, "Terms_agree", "Please check the terms and conditions");
        isValid = false;
    }

    if (isValid) {
        const encryptedPassword = await encryptPassword(password);

        const user = {
            fullname: fullname.trim(),
            username: username.trim(),
            email: email.trim(),
            password: encryptedPassword,
            created_at: getCurrentDateTime()
        };

        const saved = addItemToLocal("Users", user);

        if (saved) {
            showPopups("Registered Successfully", true);
            form.reset();

            document.querySelectorAll(".eye-toggle").forEach((img) => {
                img.src = "/assets/icons/eye-slash.svg";

                const targetId = img.dataset.target;
                const input = document.getElementById(targetId);

                if (input) {
                    input.type = "password";
                }
            });
        } else {
            showPopups("Something went wrong", false);
        }
    }
});



const passwordInp = document.getElementById("password");
const confirmPasswordInp = document.getElementById("Cpassword");

const passwordEye = document.getElementById("passwordEye");
const confirmPasswordEye = document.getElementById("confirmPasswordEye");

passwordEye.addEventListener("click", () => {
    if (passwordInp.type === "password") {
        passwordInp.type = "text";
        passwordEye.src = "/assets/icons/eye-open.svg";
    } else {
        passwordInp.type = "password";
        passwordEye.src = "/assets/icons/eye-slash.svg";
    }
});

confirmPasswordEye.addEventListener("click", () => {
    if (confirmPasswordInp.type === "password") {
        confirmPasswordInp.type = "text";
        confirmPasswordEye.src = "/assets/icons/eye-open.svg";
    } else {
        confirmPasswordInp.type = "password";
        confirmPasswordEye.src = "/assets/icons/eye-slash.svg";
    }
});