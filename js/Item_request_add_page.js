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

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
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
    const box = e.target.closest(".date-box, .date-input-box");

    if (!box) return;

    const input = box.querySelector("input");

    if (input && input.showPicker) {
        input.showPicker();
    }
});

//=======================================================================//


const allInput = document.querySelectorAll(".request-info-box input");

const reqId = allInput[0];
const subject = allInput[1];
const reqBy = allInput[2];
const reqDate = allInput[3];
const expDelivery = allInput[4];
const statusInput = allInput[5];
const addItemBtn = document.querySelector(".item-list-box-header .right");
const tbody = document.querySelector(".item-list-table tbody");
const totalText = document.querySelector(".item-list-box-header .left span:last-child");
const cancelBtn = document.querySelector(".cancel-btn");
const saveBtn = document.querySelector(".save-btn");
const submitBtn = document.querySelector(".submit-btn");

const items = getItemFromLocal("Inventory") || [];

function getReqId() {
    const arr = getItemFromLocal("items_request");

    if (arr.length === 0) {
        return "REQ-000001";
    }

    const last = arr[arr.length - 1].reqId;

    return getNextCode(last);
}

function setTopValues() {
    reqId.value = getReqId();
    reqDate.value = getCurrentDateTime();
    reqBy.value = "Admin";
    statusInput.value = "Pending";
}

setTopValues();

function getOptions() {
    let options = `<option value="">Select item</option>`;

    for (let i = 0; i < items.length; i += 1) {
        options += `
            <option value="${items[i].itemCode}">
                ${items[i].itemName}
            </option>
        `;
    }

    return options;
}

function countItems() {
    const rows = tbody.querySelectorAll("tr:not(.empty-row)");
    totalText.innerText = `Total ${rows.length} items`;
}

function addRow() {
    const emptyRow = tbody.querySelector(".empty-row");

    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>
            <select>
                ${getOptions()}
            </select>
        </td>

        <td>
            <input type="number" placeholder="Enter quantity">
        </td>

        <td>
            <div class="date-input-box">
                <input type="date">
                <img src="/assets/calendar_blue.png" alt="">
            </div>
        </td>

        <td>
            <button class="delete-btn">🗑</button>
        </td>
    `;

    tbody.insertBefore(tr, emptyRow);

    countItems();
}

function clearTable() {
    tbody.innerHTML = `
        <tr class="empty-row">
            <td colspan="4"></td>
        </tr>
    `;

    addRow();
}

clearTable();

addItemBtn.addEventListener("click", () => {
    addRow();
});

tbody.addEventListener("click", (e) => {
    const delBtn = e.target.closest(".delete-btn");

    if (!delBtn) return;

    const rows = tbody.querySelectorAll("tr:not(.empty-row)");

    if (rows.length === 1) {
        showPopups("At least one item needed", false);
        return;
    }

    delBtn.closest("tr").remove();

    countItems();
});

function getTableItems() {
    const rows = tbody.querySelectorAll("tr:not(.empty-row)");
    const arr = [];

    for (let i = 0; i < rows.length; i += 1) {
        const select = rows[i].querySelector("select");
        const qty = rows[i].querySelector("input[type='number']");
        const date = rows[i].querySelector("input[type='date']");
        const item = getItemByCode("Inventory", select.value);

        arr.push({
            itemCode: select.value,
            itemName: item ? item.itemName : "",
            qty: Number(qty.value),
            expected_date: date.value
        });
    }

    return arr;
}

function checkForm() {
    if (subject.value.trim() === "") {
        showPopups("Please enter the subject", false);
        return false;
    }

    if (expDelivery.value === "") {
        showPopups("Select expecting delivery date", false);
        return false;
    }

    const rows = tbody.querySelectorAll("tr:not(.empty-row)");

    if (rows.length === 0) {
        showPopups("Add item", false);
        return false;
    }

    for (let i = 0; i < rows.length; i += 1) {
        const select = rows[i].querySelector("select");
        const qty = rows[i].querySelector("input[type='number']");
        const date = rows[i].querySelector("input[type='date']");

        if (select.value === "") {
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

function saveRequest(state) {
    if (!checkForm()) return;

    const obj = {
        reqId: reqId.value,
        subject: subject.value.trim(),
        requested_by: reqBy.value.trim(),
        requested_date: reqDate.value,
        expecting_delivery: expDelivery.value,
        status: statusInput.value || "Pending",
        state: state,
        items: getTableItems()
    };

    addItemToLocal("items_request", obj);

    if (state === "saved") {
        showPopups("Saved successfully", true);
    } else {
        showPopups("Request submitted", true);
    }

    subject.value = "";
    expDelivery.value = "";
    statusInput.value = "Pending";

    clearTable();
    setTopValues();
}

saveBtn.addEventListener("click", () => {
    saveRequest("saved");
});

submitBtn.addEventListener("click", () => {
    saveRequest("submitted");
});

cancelBtn.addEventListener("click", () => {
    subject.value = "";
    expDelivery.value = "";
    statusInput.value = "Pending";

    clearTable();

    showPopups("Cancelled", true);
});