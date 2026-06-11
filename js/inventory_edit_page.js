const form = document.querySelector("form");

const cancelBtn = document.querySelector(".cancel-btn");
const saveBtn = document.querySelector(".save-btn");

cancelBtn.type = "button";
saveBtn.type = "submit";

const reqFields = form.querySelectorAll("[data-req]");

const itemCode = document.getElementById('itemCode')
let newValue = "ITM-00129";

const defaultImgUrl = "https://res.cloudinary.com/dyifzw0io/image/upload/v1780902691/spx6qyuhghvvnkgtvvxs.png";

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
    });

    field.addEventListener("blur", () => {
        checkField(field);
    });

    field.addEventListener("change", () => {
        checkField(field);
    });
});



// file input id is itemImage-box
// preview image id is uploadedImg
const itemImageBox = document.getElementById("itemImage-box");
const ele = document.getElementById("uploadedImg");

const h4 = document.querySelector(".upload-box h4");
const p = document.querySelector(".upload-box p");
const defaultImg = ele.src;
const defaultH4 = h4 ? h4.innerHTML : "";
const defaultP = p ? p.innerHTML : "";

let currentImgUrl = null;
let selectedImageFile = null;

itemImageBox.addEventListener("change", () => {
    const file = itemImageBox.files[0];

    if (!file) return;

    selectedImageFile = file;

    if (currentImgUrl)
        URL.revokeObjectURL(currentImgUrl);

    currentImgUrl = URL.createObjectURL(file);
    ele.src = currentImgUrl;
})

const params = new URLSearchParams(window.location.search);
const editId = params.get("id");


document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    const items = JSON.parse(localStorage.getItem("Inventory") || "[]");

    const itemIndex = items.findIndex((item) => item.itemCode === editId);

    if (editId && itemIndex === -1) {
        alert("Item not found");
        location.href = "./inventory.html";
        return;
    }

    const item = items[itemIndex];

    const itemCode = document.getElementById("itemCode");
    const itemName = document.getElementById("itemName");

    const itemImage = document.getElementById("uploadedImg");
    const changeImgBtn = document.getElementById("changeImgBtn");
    const itemDescription = document.getElementById("itemDescription");
    const category = document.getElementById("category");
    const Baseprice = document.getElementById("price");
    const unit = document.getElementById("unit");
    const inStock = document.getElementById("inStock");
    const status = document.getElementById("status");
    const supplier = document.getElementById("supplier");
    const saveBtn = document.getElementById("save-btn");
    const deleteBtn = document.getElementById("deleteBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const sellingPrice = document.getElementById('Sprice')

    itemCode.value = item.itemCode;
    itemName.value = item.itemName;
    itemImage.src = item.itemImage || defaultImgUrl
    itemDescription.value = item.itemDescription;
    category.value = item.category;
    Baseprice.value = item.basePrice;
    unit.value = item.unit;
    inStock.value = item.inStock;
    status.value = item.status;
    supplier.value = item.supplier;
    sellingPrice.value = item.sellingPrice


    inStock.addEventListener("input", () => {
        if (Number(inStock.value) > 0) {
            status.value = "In Stock";
        } else {
            status.value = "Out of Stock";
        }
    });


    saveBtn.addEventListener("click", async (event) => {
        event.preventDefault()
        saveBtn.innerText="Saving..."
        console.log(itemIndex);
        console.log("hello");
        console.log(itemImage.src);
        console.log(itemImageBox.files[0]);

        let finalImageUrl = items[itemIndex].itemImage || defaultImgUrl;

        if (selectedImageFile) {
            finalImageUrl = await uploadToCloudinary(selectedImageFile);
        }
        const totalPurchased = Number(items[itemIndex].purchased) + Math.abs((Number(inStock.value) - Number(items[itemIndex].inStock)))
        // alert(Math.abs((Number(inStock.value) - Number(items[itemIndex].inStock))))
        items[itemIndex] = {
            ...items[itemIndex],
            itemName: itemName.value,
            itemImage: finalImageUrl || defaultImgUrl,
            itemDescription: itemDescription.value,
            category: category.value,
            basePrice: Number(Baseprice.value),
            sellingPrice: Number(sellingPrice.value),
            unit: unit.value,
            purchased: totalPurchased,
            inStock: inStock.value,
            status: Number(inStock.value) > 0 ? "In Stock" : "Out of Stock",
            supplier: supplier.value,
            update_at: new Date().toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            })
        };

        console.log(items);

        updateToLocal("Inventory", items);

        showPopups("Item Updated SuccessFully", true);

        setTimeout(() => {
            window.location.href = './inventory.html'
        }, 3000);

    });


    deleteBtn.addEventListener("click", (e) => {

        e.preventDefault()
        e.stopPropagation()

        document.querySelector('.temp-body').style.display = 'flex'

        document.getElementById('cancel-btn').addEventListener('click', () => {
            document.querySelector('.temp-body').style.display = 'none'
        })

        document.getElementById('del-btn').addEventListener('click', () => {
            items.splice(itemIndex, 1);

            if (updateToLocal("Inventory", items)) {
                document.querySelector('.temp-body').style.display = 'none'
                showPopups("Item deleted successfully", true);

                setTimeout(() => {
                    showPopups('Redirecting to inventory page...', true)
                }, 1000)

                setTimeout(() => {
                    location.href = "./inventory.html";
                }, 3500)
            }
            else showPopups('Unknown Error occured', false)
        })

    });


    cancelBtn.addEventListener("click", () => {
        location.href = "./inventory.html";
    });

   
});