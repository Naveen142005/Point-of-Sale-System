function addItemToLocal(key, object) {
    try {
        const objectArr = JSON.parse(localStorage.getItem(key) || "[]");

        objectArr.push(object);

        localStorage.setItem(key, JSON.stringify(objectArr));

        return true;
    }
    catch (e) {
        console.log("LC add err", e);
        return false;
    }
}


function updateToLocal(key, data) {
    try {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(data));
        } else {
            localStorage.setItem(key, JSON.stringify(data));
        }

        return true;
    } catch (e) {
        console.log("LC update err", e);
        return false;
    }
}

function getBillingsFromLocal() {
    const billings = JSON.parse(localStorage.getItem("Billings") || "{}");

    if (Array.isArray(billings)) {
        return {};
    }

    return billings;
}

function getItemFromLocal(key) {
    return JSON.parse(localStorage.getItem(key) || "[]")

    /**
     *  inventory : [{itemCode: }]
     * 
     * / */
}

function getItemIndex(key, itemCode) {
    const items = getItemFromLocal(key);
    return items.findIndex((item) => item.itemCode == itemCode);
}
function getItemByCode(key, itemCode) {
    const items = getItemFromLocal(key);
    return items.find((item) => item.itemCode == itemCode);
}

function showPopups(mes, isSuccess) {
    const oldPopup = document.querySelector(".my-popup");
    if (oldPopup) oldPopup.remove();

    const popup = document.createElement("div");

    popup.className = "my-popup";
    popup.innerText = mes;

    popup.style.position = "fixed";
    popup.style.left = "50%";
    popup.style.top = "80px";
    popup.style.width = "420px";
    popup.style.maxWidth = "90%";
    popup.style.padding = "14px 22px";
    popup.style.borderRadius = "8px";
    popup.style.color = "white";
    popup.style.backgroundColor = isSuccess ? "#198754" : "#dc3545";
    popup.style.zIndex = "99999";
    popup.style.fontSize = "13px";
    popup.style.fontWeight = "600";
    popup.style.textAlign = "center";
    popup.style.lineHeight = "1.4";
    popup.style.boxShadow = "0 5px 18px rgba(0,0,0,0.22)";

    popup.style.transform = "translate(-50%, -40px)";
    popup.style.opacity = "0";
    popup.style.transition = "0.35s ease";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.transform = "translate(-50%, 0)";
        popup.style.opacity = "1";
    }, 10);

    setTimeout(() => {
        popup.style.transform = "translate(-50%, -40px)";
        popup.style.opacity = "0";
    }, 2200);

    setTimeout(() => {
        popup.remove();
    }, 2700);
}

function getCurrentDateTime() {
    const date = new Date();
    const day = date.getDate();
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let h = date.getHours();
    let m = date.getMinutes();

    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;
    h = h === 0 ? 12 : h;

    m = m < 10 ? "0" + m : m;

    return `${day} ${month} ${year}, ${h}:${m} ${ampm}`;
}


function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

console.log(getCurrentDateTime());

function getNextCode(code) {
    let i = code.length - 1;

    while (i >= 0 && code[i] >= "0" && code[i] <= "9") {
        i--;
    }

    let prefix = code.slice(0, i + 1);
    let np = code.slice(i + 1);

    if (np === "") return code;

    let nxtnum = String(Number(np) + 1);

    let zeros = "";
    let zc = np.length - nxtnum.length;

    for (let i = 0; i < zc; i += 1) {
        zeros += "0";
    }

    return prefix + zeros + nxtnum;
}


async function uploadToCloudinary(file) {
    const cloudName = "dyifzw0io";
    const uploadPreset = "POS_image";

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data);
        return null;
    }

    return data.secure_url;
}

//sort function to sort the table values by the th
function sortItems(items, key, assending = true) {
    if (items.length <= 0) return items;
    if (!key) return items;

    const val = items[0][key];
    console.log(val);
    
    if (val !== "" && !isNaN(Number(val))) {
        items.sort((a, b) => {
            if (assending) {
                return Number(a[key]) - Number(b[key]);
            } else {
                return Number(b[key]) - Number(a[key]);
            }
        });
    }

    // date sort
    else if (!isNaN(Date.parse(val))) {
        items.sort((a, b) => {
            if (assending) {
                return new Date(a[key]) - new Date(b[key]);
            } else {
                return new Date(b[key]) - new Date(a[key]);
            }
        });
    }

    // string sort
    else {
        items.sort((a, b) => {
            if (assending) {
                return String(a[key]).localeCompare(String(b[key]));
            } else {
                return String(b[key]).localeCompare(String(a[key]));
            }
        });
    }

    return items;
}

async function encryptPassword(password) {
    const data = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}


function exportTableToExcel(table, fileName) {
    let newTable = table.cloneNode(true);

    newTable.querySelectorAll("img").forEach((img) => {
        img.remove();
    });

    let blob = new Blob([newTable.outerHTML], {
        type: "application/vnd.ms-excel"
    });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName + ".xls";
    a.click();
}