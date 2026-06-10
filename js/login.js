const dot_box = document.querySelector(".dots-box");

for (let i = 0; i <= 15; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot_box.appendChild(dot);
}

const eye_icon = document.getElementById("eye-icon");

const form = document.querySelector(".form-box");
const error = document.getElementById("incorrect-credentials");

error.style.opacity = 0;

const usernameInp = document.getElementById("username");
const passwordInp = document.getElementById("password");

const usernameErr = document.getElementById("usernameErr");
const passwordErr = document.getElementById("passwordErr");

const usernameBox = usernameInp.parentElement;
const passwordBox = passwordInp.parentElement;

function showErr(eleErr, box, mess) {
    eleErr.innerText = mess;
    eleErr.style.opacity = 1;
    eleErr.style.visibility = "visible";

    box.style.border = "1px solid red";

    setTimeout(() => {
        clearErr(eleErr, box);
    }, 2000);
}

function clearErr(eleErr, box) {
    eleErr.innerText = "";
    eleErr.style.opacity = 0;
    eleErr.style.visibility = "hidden";

    box.style.border = "1px solid rgb(227, 220, 220)";
}

function clearAllErr() {
    clearErr(usernameErr, usernameBox);
    clearErr(passwordErr, passwordBox);

    error.innerHTML = "";
    error.style.opacity = 0;
    error.style.padding = "0";
}

async function check(username, password) {
    let isValid = true;

    clearAllErr();

    if (username === "") {
        showErr(usernameErr, usernameBox, "Please enter the user name");
        isValid = false;
    }

    if (password === "") {
        showErr(passwordErr, passwordBox, "Please enter the password");
        isValid = false;
    }

    if (!isValid) {
        return false;
    }

    const users = getItemFromLocal("Users");

    const user = users.find((user) => {
        return user.username.toLowerCase() === username.toLowerCase();
    });

    if (!user) {
        showErr(usernameErr, usernameBox, "Username does not exist");
        return false;
    }

    const encryptedPassword = await encryptPassword(password);

    if (user.password !== encryptedPassword) {
        showErr(passwordErr, passwordBox, "Incorrect password");
        return false;
    }

    const loggedUser = {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        login_at: getCurrentDateTime()
    };

    updateToLocal("LoggedUser", loggedUser);

    return true;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInp.value.trim();
    const password = passwordInp.value.trim();

    const isLoginSuccess = await check(username, password);
    console.log(isLoginSuccess);

    if (isLoginSuccess) {
        error.innerHTML = "Login Success. Redirecting to dashboard...";
        error.style.color = "green";
        error.style.opacity = 1;
        error.style.padding = "12px 0";
        error.style.fontWeight = 600;

        setTimeout(() => {
            location.href = "./dashboard.html";
        }, 2000);
    }
});


eye_icon.addEventListener("click", () => {
    if (passwordInp.type === "password") {
        passwordInp.type = "text";
        eye_icon.src = "/assets/icons/eye-open.svg";
    } else {
        passwordInp.type = "password";
        eye_icon.src = "/assets/icons/eye-slash.svg";
    }
});