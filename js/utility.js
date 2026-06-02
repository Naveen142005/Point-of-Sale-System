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

function updateToLocal(key, arr) {
    try {
        localStorage.setItem(key, JSON.stringify(arr));
        return true;
    } catch (e) {
        console.log("LC update err", e);
        return false;
    }
}

function getItemFromLocal (key) {
    return JSON.parse(localStorage.getItem(key) || "[]")
}



function showPopups(mes, isSuccess) {
    const popup = document.createElement("div");

    popup.innerText = mes;
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.padding = "12px 20px";
    popup.style.borderRadius = "8px";
    popup.style.color = "white";
    popup.style.backgroundColor = isSuccess ? "green" : "red";
    popup.style.zIndex = "9999";
    popup.style.fontSize='12px'
    popup.style.transform = "translateX(120%)";
    popup.style.transition = "0.4s ease";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
        popup.style.transform = "translateX(150%)";
    }, 2000);

    setTimeout(() => {
        popup.remove()
    },3000)
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