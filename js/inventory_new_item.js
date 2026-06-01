const sideBar = document.getElementById('side-bar');
const main = document.getElementById('main');
const menuIcon = document.getElementById('menu-icon')

document.addEventListener('click', (e) => {
    if (!sideBar.contains(e.target) && sideBar.classList.contains('active')) {
        sideBar.classList.remove('active');
        return;
    }
})

menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    const isMobile = window.innerWidth <= 768;
    console.log(isMobile);
    if (isMobile) {
        sideBar.classList.add('active')
    }
    else {  
        if (sideBar.classList.contains('closed')) {
            sideBar.classList.remove('closed');
            main.style.marginLeft = '200px';
            main.style.width = 'calc(100vw - 200px)';
            sideBar.style.left = '0px'
        } else {
            sideBar.classList.add('closed');
            main.style.marginLeft = '0px';
            main.style.width = '100vw';
            sideBar.style.left = '-500px'
        }
    }
});


/*==========================================================================================*/
const form = document.querySelector("form");

const cancelBtn = document.querySelector(".cancel-btn");
const saveBtn = document.querySelector(".save-btn");

cancelBtn.type = "button";
saveBtn.type = "submit";

const reqFields = form.querySelectorAll("[data-req]");

const itemCode = document.getElementById('itemCode')
let newValue = "ITM-00129";

// For increasing Item ID.
const savedValueArray = JSON.parse(localStorage.getItem("Inventory") || "[]");

if (savedValueArray.length > 0) {
    let lastItem = savedValueArray[savedValueArray.length - 1];

    if (lastItem && lastItem.itemCode) {
        newValue = getNextCode(lastItem.itemCode);
    }
}

itemCode.value = newValue

function showError(field, message) {
    const inputBox = field.closest(".input-box");

    let error = inputBox.querySelector(".error-msg");

    if (!error) {
        error = document.createElement("small");
        error.className = "error-msg";
        inputBox.appendChild(error);
    }

    error.innerText = message;
    error.style.color = "red";
    error.style.fontSize = "12px";
    error.style.marginTop = "5px";
}

function clearError(field) {
    const inputBox = field.closest(".input-box");
    const error = inputBox.querySelector(".error-msg");

    if (error) {
        error.innerText = "";
        error.remove()
    }
}

function checkField(field) {
    const value = field.value.trim();
    const name = field.dataset.name || "This field";
    const type = field.dataset.type;

    console.log(type);
    
    if (value === "" || value.startsWith("Select")) {
        showError(field, `${name} is required`);
        return false;
    }

    if (type === "price" && (isNaN(value) || Number(value) <= 0)) {
        showError(field, "Enter valid price");
        return false;
    }
    
    
    if (type === "number" && (isNaN(value) || Number(value) < 0)) {
        showError(field, "Enter valid stock quantity");
        console.log(value);
        return false;
    }
    if (type === "number") {
        if (Number(value) == 0) document.getElementById('status').value = 'Out of Stock'
        else document.getElementById('status').value = 'In Stock';
    }

    clearError(field);
    return true;
}

reqFields.forEach((field) => {
    field.addEventListener("input", () => {
        checkField(field);
    });
    field.addEventListener("blur", () => {
        checkField(field);
    });

    field.addEventListener("change", () => {
        checkField(field);
    });
});


const itemImage = document.getElementById("itemImage");
const ele = document.getElementById("uploadedImg");
const h4 = document.querySelector(".upload-box h4");
const p = document.querySelector(".upload-box p");
const defaultImg = ele.src;
const defaultH4 = h4.innerHTML;
const defaultP = p.innerHTML;

let currentImgUrl = null;

itemImage.addEventListener("change", () => {
    const file = itemImage.files[0];

    if (!file) return;

    if (currentImgUrl) 
        URL.revokeObjectURL(currentImgUrl);
    

    currentImgUrl = URL.createObjectURL(file);
    ele.src = currentImgUrl;

    h4.innerHTML = "Click to change the image";
    p.innerHTML = "Remove the image";

    p.classList.add("having-image");
    p.style.textDecoration = "underline";
    p.style.color = "blue";
    p.style.fontSize = "10px";
    p.style.cursor = "pointer";
    p.style.position = "relative";
    p.style.zIndex = "10";
});

p.addEventListener("click", (e) => {
    if (p.classList.contains("having-image")) {
        e.preventDefault();
        e.stopPropagation();

        ele.src = defaultImg;
        itemImage.value = "";

        h4.innerHTML = defaultH4;
        p.innerHTML = defaultP;

        p.classList.remove("having-image");
        p.style.textDecoration = "";
        p.style.color = "";
        p.style.fontSize = "";
        p.style.cursor = "";
        p.style.position = "";
        p.style.zIndex = "";

        if (currentImgUrl) {
            URL.revokeObjectURL(currentImgUrl);
            currentImgUrl = null;
        }
    }
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;

    reqFields.forEach((field) => {
        if (!checkField(field)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showPopups("Please fill all required fields", false);
        return;
    }

    const inputs = form.querySelectorAll("input");
    const selects = form.querySelectorAll("select");
    const textarea = form.querySelector("textarea");
    const file = inputs[2].files[0];

    let imageUrl = null;

    if (file) {
        saveBtn.disabled = true;
        saveBtn.innerText = "Uploading...";

        imageUrl = await uploadToCloudinary(file);

        saveBtn.disabled = false;
        saveBtn.innerText = "Save";

        if (!imageUrl) {
            showPopups("Image upload failed", false);
            return;
        }
    }

    const itemData = {
        itemCode: inputs[0].value.trim(),
        itemName: inputs[1].value.trim(),
        itemImage: imageUrl,
        itemDescription: textarea.value.trim(),
        category: selects[0].value,
        price: inputs[3].value.trim(),
        unit: selects[1].value,
        inStock: inputs[4].value.trim(),
        status: selects[2].value,
        supplier: selects[3].value,
        purchased: 0,
        sold: 0,
        update_at: getCurrentDateTime()
    };

    const isAdded = addIntoLocalStorage("Inventory", itemData);

    if (isAdded) {
        showPopups("Item added successfully", true);
        form.reset();
    } else {
        showPopups("Unknown error occurred", false);
    }
});

