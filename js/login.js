
const dot_box = document.querySelector(".dots-box");

for (let i = 0; i <= 15; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot_box.appendChild(dot);
}



const eye_icon = document.getElementById('eye-icon')

const form = document.querySelector('.form-box')
const error = document.getElementById("incorrect-credentials");


//dummy users 

users = {
    "Naveen": "Naveen@142005",
    "Kumar": "Kumar@123",
    "User": "123"
}


function showError(err) {
    error.innerText = err;

    setTimeout(() => {
        error.innerText = "";
    }, 2000);
}

const check = (username, password) => {
    if (username === "" || password === "") {
        showError("Please enter username and password")
        return;
    }

    if (!(username in users)) {
        showError("Username does not exist");
        return;
    }

    if (users[username] !== password) {
        showError("Incorrect password");
        return;
    }
    error.innerText = "";

    return true;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (check(username, password)) {
        alert('Login Success...')
    }
    else return;
})


// const eye_icon = document.getElementById("eye-icon");

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