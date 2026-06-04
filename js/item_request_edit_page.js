const sideBar = document.getElementById("side-bar");
const main = document.getElementById("main");
const menuIcon = document.getElementById("menu-icon");

document.addEventListener("click", (e) => {
    if (!sideBar.contains(e.target) && sideBar.classList.contains("active")) {
        sideBar.classList.remove("active");
        return;
    }
});

menuIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    const mob = window.innerWidth <= 768;

    if (mob) {
        sideBar.classList.add("active");
    } else {
        if (sideBar.classList.contains("closed")) {
            sideBar.classList.remove("closed");
            main.style.marginLeft = "200px";
            main.style.width = "calc(100vw - 200px)";
            sideBar.style.left = "0px";
        } else {
            sideBar.classList.add("closed");
            main.style.marginLeft = "0px";
            main.style.width = "100vw";
            sideBar.style.left = "-500px";
        }
    }
});

document.addEventListener("click", (e) => {
    const box = e.target.closest(".date-box,.date-input-box");
    if (!box) return;

    const input = box.querySelector("input");
    if (input && input.showPicker) input.showPicker();
});

//==========================================================================================
const inp = document.querySelectorAll(".request-info-box input");

const reqId = inp[0];
const subject = inp[1];
const reqBy = inp[2];
const reqDate = inp[3];
const expDate = inp[4];
const statusInp = document.getElementById('status')

const addBtn = document.querySelector(".item-list-box-header .right");
const tbody = document.querySelector(".item-list-table tbody");
const totalText = document.querySelector(".item-list-box-header .left span:last-child");

const cancelBtn = document.querySelector(".cancel-btn");
const saveBtn = document.querySelector(".save-btn");
const submitBtn = document.querySelector(".submit-btn");

const subBox = document.querySelector(".sub-box");
const okBox = document.querySelector(".ok-box");

const subCancel = subBox.querySelector(".cancel-btn-model");
const subYes = subBox.querySelector(".save-btn-model");

const okCancel = okBox.querySelector(".cancel-btn-model");
const viewBtn = okBox.querySelector(".save-btn-model");

const params = new URLSearchParams(window.location.search);
const editId = params.get("reqId");

const arr = getItemFromLocal("items_request");
const idx = arr.findIndex((x) => {
    return x.reqId === editId;
});

if (!editId || idx === -1) {
    showPopups("Request not found", false);

    setTimeout(() => {
        location.href = "./item_request_list_page.html";
    }, 1500);

    throw new Error("Request not found");
}

const old = arr[idx];
const items = getItemFromLocal("Inventory") || [];

reqId.readOnly = true;
reqDate.readOnly = true;

function opt(selCode = "") {
    let str = `<option value="">Select item</option>`;

    for (let i = 0; i < items.length; i += 1) {
        let sel = "";

        if (items[i].itemCode === selCode) {
            sel = "selected";
        }

        str += `
            <option value="${items[i].itemCode}" ${sel}>
                ${items[i].itemName}
            </option>
        `;
    }

    return str;
}

function rows() {
    return tbody.querySelectorAll("tr:not(.empty-row)");
}

function cnt() {
    totalText.innerText = `Total ${rows().length} items`;
}

function addRow(obj = null) {
    const empty = tbody.querySelector(".empty-row");
    const tr = document.createElement("tr");

    const code = obj ? obj.itemCode : "";
    const qty = obj ? obj.qty : "";
    const date = obj ? obj.expected_date : "";

    tr.innerHTML = `
        <td>
            <select>
                ${opt(code)}
            </select>
        </td>

        <td>
            <input type="number" placeholder="Enter quantity" value="${qty}">
        </td>

        <td>
            <div class="date-input-box">
                <input type="date" value="${date}">
                <img src="/assets/calendar_blue.png" alt="">
            </div>
        </td>

        <td>
            <button class="delete-btn">🗑</button>
        </td>
    `;

    tbody.insertBefore(tr, empty);
    cnt();
}

function clearTbl() {
    tbody.innerHTML = `
        <tr class="empty-row">
            <td colspan="4"></td>
        </tr>
    `;
}

function fill() {
    reqId.value = old.reqId;
    subject.value = old.subject;
    reqBy.value = old.requested_by;
    reqDate.value = old.requested_date;
    expDate.value = old.expecting_delivery;
    statusInp.value = old.status;

    clearTbl();

    for (let i = 0; i < old.items.length; i += 1) {
        addRow(old.items[i]);
    }

    if (old.items.length === 0) {
        addRow();
    }
}

fill();

function makeReadOnly() {
    const allInputs = document.querySelectorAll("input");
    const allSelects = document.querySelectorAll("select");

    const msg = document.querySelector(".read-msg");
    msg.classList.remove("none");

    allInputs.forEach((inp) => {
        inp.readOnly = true;
    });

    allSelects.forEach((sel) => {
        sel.disabled = true;
    });

    addBtn.style.display = "none";
    saveBtn.style.display = "none";
    submitBtn.style.display = "none";

    const delBtns = document.querySelectorAll(".delete-btn");

    delBtns.forEach((btn) => {
        btn.style.display = "none";
    });
}

if (old.state === "submitted") {
    makeReadOnly();
}

addBtn.addEventListener("click", () => {
    addRow();
});

tbody.addEventListener("click", (e) => {
    const del = e.target.closest(".delete-btn");
    if (!del) return;

    if (rows().length === 1) {
        showPopups("At least one item needed", false);
        return;
    }

    del.closest("tr").remove();
    cnt();
});

function tblItems() {
    const r = rows();
    const a = [];

    for (let i = 0; i < r.length; i += 1) {
        const sel = r[i].querySelector("select");
        const qty = r[i].querySelector("input[type='number']");
        const date = r[i].querySelector("input[type='date']");
        const item = getItemByCode("Inventory", sel.value);

        a.push({
            itemCode: sel.value,
            itemName: item ? item.itemName : "",
            qty: Number(qty.value),
            expected_date: date.value
        });
    }

    return a;
}

function check() {
    if (subject.value.trim() === "") {
        showPopups("Please enter the subject", false);
        return false;
    }

    if (expDate.value === "") {
        showPopups("Select expecting delivery date", false);
        return false;
    }

    const r = rows();

    if (r.length === 0) {
        showPopups("Add item", false);
        return false;
    }

    for (let i = 0; i < r.length; i += 1) {
        const sel = r[i].querySelector("select");
        const qty = r[i].querySelector("input[type='number']");
        const date = r[i].querySelector("input[type='date']");

        if (sel.value === "") {
            showPopups("Select item", false);
            return false;
        }

        if (Number(qty.value) <= 0) {
            showPopups("Enter valid quantity", false);
            return false;
        }

        if (date.value === "") {
            showPopups("Select expected date", false);
            return false;
        }
    }

    return true;
}

function upd(st) {
    let oldState = arr[idx].state;

    if (st) {
        oldState = st;
    }
    
    alert(statusInp.value);
    
    arr[idx] = {
        ...arr[idx],
        reqId: reqId.value,
        subject: subject.value.trim(),
        requested_by: reqBy.value.trim(),
        requested_date: reqDate.value,
        expecting_delivery: expDate.value,
        status: statusInp.value || "Pending",
        state: oldState,
        items: tblItems(),
        update_at: getCurrentDateTime()
    };

    updateToLocal("items_request", arr);
}

saveBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!check()) return;

    upd();

    showPopups("Request updated successfully", true);

    setTimeout(() => {
        location.href = "./item_request_list_page.html";
    }, 1500);
});

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!check()) return;

    subBox.style.display = "flex";
});

subCancel.addEventListener("click", () => {
    subBox.style.display = "none";
});

subYes.addEventListener("click", () => {
    upd("submitted");

    subBox.style.display = "none";
    okBox.style.display = "flex";
});

okCancel.addEventListener("click", () => {
    okBox.style.display = "none";
});

viewBtn.addEventListener("click", () => {
    location.href = "./item_request_list_page.html";
});

subBox.addEventListener("click", (e) => {
    if (e.target === subBox) {
        subBox.style.display = "none";
    }
});

okBox.addEventListener("click", (e) => {
    if (e.target === okBox) {
        okBox.style.display = "none";
    }
});

cancelBtn.addEventListener("click", () => {
    location.href = "./item_request_list_page.html";
});