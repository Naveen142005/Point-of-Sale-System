const form = document.getElementById("form");

const nameErr = document.getElementById("nameErr");
const usernameErr = document.getElementById("usernameErr");
const emailErr = document.getElementById("emailErr");
const passwordErr = document.getElementById("passwordErr");
const confirmErr = document.getElementById("confirmErr");
const termsErr = document.getElementById("termsErr");


function showerror(ele, eleId, mes) {

    console.log(ele);

    ele.style.opacity = 1
    ele.innerText = mes;

    let element;
    if (eleId) {
        element = document.getElementById(eleId)
        element.style.border = `1px solid red`;
        console.log(element);
    }

    setTimeout(() => {
        ele.style.opacity = 0;
        ele.innerText = 's'

        if (eleId)
            element.style.border = `1px solid #e3dcdc`
    }, 2000)

    console.log(ele);
}

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("Cpassword").value;
    const checkBox = document.getElementById('Terms_agree').checked


    let isValid = true;

    if (!validName(fullname)) {
        showerror(nameErr, "nameBox", "Please enter valid name");
        isValid = false;
    }

    if (!validUsername(username)) {
        showerror(usernameErr, "usernameBox", "Please enter valid username");
        isValid = false;
    }

    if (!validEmail(email)) {
        showerror(emailErr, "emailBox", "Please enter valid email");
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
        showerror(termsErr, 'Terms_agree', "Please check the terms and conditions")
    }

    if (isValid) {
        alert("Form Submitted Successfully");
    }

});

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

    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return reg.test(email);
}

const eye_icon = document.getElementById('eye-icon')


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
    const password = document.getElementById("password");
    if (password.type === "password") {
        password.type = "text";
        eye_icon.innerHTML = eyeOpen;
    } else {
        password.type = "password";
        eye_icon.innerHTML = eyeSlash;
    }
});