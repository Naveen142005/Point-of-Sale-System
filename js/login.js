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

// dummy users
const users = {
    "Naveen": "Naveen@142005",
    "Kumar": "Kumar@123",
    "User": "123",
    "1": "1"
};

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
}

const check = (username, password) => {
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

    if (!(username in users)) {
        showErr(usernameErr, usernameBox, "Username does not exist");
        return false;
    }

    if (users[username] !== password) {
        showErr(passwordErr, passwordBox, "Incorrect password");
        return false;
    }

    return true;
};

form.addEventListener("submit", (event) => {
     
    event.preventDefault();

    const username = usernameInp.value.trim();
    const password = passwordInp.value.trim();

    if (check(username, password)) {
        error.innerHTML = "Login Success. Redirecting to dashboard..."
        error.style.color = `green`;
        error.style.opacity = 1;
        error.style.padding = `12px 0`
        error.style.fontWeight = 600;

        setTimeout(() => {
            location.href = "./dashboard.html"; 
        }, 2000);

    }
});

const eyeOpen = `
<path stroke-linecap="round" stroke-linejoin="round" 
d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
<path stroke-linecap="round" stroke-linejoin="round" 
d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
`;

const eyeSlash = `
<path stroke-linecap="round" stroke-linejoin="round" 
d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
`;

eye_icon.addEventListener("click", () => {
    if (passwordInp.type === "password") {
        passwordInp.type = "text";
        eye_icon.innerHTML = eyeOpen;
    } else {
        passwordInp.type = "password";
        eye_icon.innerHTML = eyeSlash;
    }
});