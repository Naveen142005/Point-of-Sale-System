const sideBar = document.getElementById('side-bar');
const main = document.getElementById('main');
const menuIcon = document.getElementById('menu-icon');

document.addEventListener('click', (e) => {
    if (!sideBar.contains(e.target) && sideBar.classList.contains('active')) {
        sideBar.classList.remove('active');
        return;
    }
});

menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();

    const isMobile = window.innerWidth <= 768;
    console.log(isMobile);

    if (isMobile) {
        sideBar.classList.add('active');
    } else {
        if (sideBar.classList.contains('closed')) {
            sideBar.classList.remove('closed');
            main.style.marginLeft = '200px';
            main.style.width = 'calc(100vw - 200px)';
            sideBar.style.left = '0px';
        } else {
            sideBar.classList.add('closed');
            main.style.marginLeft = '0px';
            main.style.width = '100vw';
            sideBar.style.left = '-500px';
        }
    }
});



const listItemBox = document.querySelector('.items-list-box');
const searchBox = document.querySelector('.search-box');
const items = getItemFromLocal('Inventory');

const priceContent = document.getElementById("price-amendment");
const priceBox = document.getElementById("priceBox");
const billingBox = document.getElementById("billingTable");
const noBillingItem = document.getElementById("noBillingItem");
const newBill = document.querySelector('.new-bill');





let currentBillId = localStorage.getItem("currentBillId");

function getBillingsFromLocal() {
    const billings = JSON.parse(localStorage.getItem("Billings") || "{}");

    if (Array.isArray(billings)) {
        return {};
    }

    return billings;
}

function getNextBillId() {
    const billings = getBillingsFromLocal();
    const keys = Object.keys(billings);

    if (keys.length === 0) {
        return "Bill-1";
    }

    const numbers = keys.map((key) => {
        return Number(key.split("-")[1]);
    });

    const maxNumber = Math.max(...numbers);

    return "Bill-" + (maxNumber + 1);
}

function createBillIfNeeded() {
    if (!currentBillId) {
        currentBillId = getNextBillId();
        localStorage.setItem("currentBillId", currentBillId);
    }
}

function addTheBillingToLocal(bill) {
    const billings = getBillingsFromLocal();

    createBillIfNeeded();

    if (!billings[currentBillId]) {
        billings[currentBillId] = [];
    }

    billings[currentBillId].push(bill);

    updateToLocal("Billings", billings);
}





newBill.addEventListener('click', () => {
    const billings = getBillingsFromLocal();

    if (currentBillId && billings[currentBillId] && billings[currentBillId].length > 0) {
        currentBillId = getNextBillId();
        localStorage.setItem("currentBillId", currentBillId);
    }

    billingBox.innerHTML = "";

    showOnly("empty");
    updatePriceBoxByCurrentBillId();
});





function showOnly(section) {
    billingBox.style.display = "none";
    noBillingItem.style.display = "none";
    priceBox.classList.add("none");

    const tableHead = document.getElementById("table_head");

    if (tableHead) {
        tableHead.style.display = "none";
    }

    if (section === "empty") {
        noBillingItem.style.display = "flex";
    }

    if (section === "billing") {
        billingBox.style.display = "table";

        if (tableHead) {
            tableHead.style.display = "table";
        }
    }

    if (section === "price") {
        priceBox.classList.remove("none");
    }
}

function updateBillingView() {
    if (billingBox.rows.length === 0) {
        showOnly("empty");
    } else {
        showOnly("billing");
    }
}





function updatePriceBoxByCurrentBillId() {
    const billings = getBillingsFromLocal();
    const currentBillItems = billings[currentBillId] || [];

    let totalAmount = 0;

    currentBillItems.forEach((item) => {
        totalAmount += Number(item.total);
    });

    const gstAmount = totalAmount * 0.07;
    const payableAmount = totalAmount + gstAmount;

    const total = priceBox.querySelectorAll(".price-row h4")[0];
    const gst = priceBox.querySelectorAll(".price-row h4")[1];
    const pay = priceBox.querySelector(".payable-row h2");
    const tender = priceBox.querySelector(".tender-box input");
    const change = priceBox.querySelector(".change-box h2");

    total.innerText = `$${totalAmount.toFixed(2)}`;
    gst.innerText = `$${gstAmount.toFixed(2)}`;
    pay.innerText = `$${payableAmount.toFixed(2)}`;

    const tenderAmount = Number(tender.value) || 0;
    const changeAmount = tenderAmount - payableAmount;

    change.innerText = `$${changeAmount.toFixed(2)}`;
}

priceBox.querySelector(".tender-box input").addEventListener("input", () => {
    updatePriceBoxByCurrentBillId();
});

priceContent.addEventListener("click", () => {
    if (billingBox.rows.length === 0) {
        showOnly("empty");
    } else {
        updatePriceBoxByCurrentBillId();
        showOnly("price");
    }
});





billingBox.addEventListener("click", (e) => {
    const delBtn = e.target.closest(".del-bill-item");

    if (!delBtn) return;

    const row = delBtn.closest("tr");
    const billingId = row.id;

    row.remove();

    const billings = getBillingsFromLocal();

    if (billings[currentBillId]) {
        billings[currentBillId] = billings[currentBillId].filter((bill) => {
            return bill.billingId !== billingId;
        });
    }

    updateToLocal("Billings", billings);

    updateBillingView();
    updatePriceBoxByCurrentBillId();
});





billingBox.addEventListener("input", (e) => {
    if (e.target.type === "number") {
        if (e.target.value <= 0) {
            e.target.style.color = "red";
            e.target.parentElement.style.borderColor = "red";
            return;
        } else {
            e.target.style.color = "black";
            e.target.parentElement.style.borderColor = "#e8e9f3";
        }

        const row = e.target.closest("tr");
        const billingId = row.id;
        const newQty = Number(e.target.value);

        const billings = getBillingsFromLocal();

        if (billings[currentBillId]) {
            billings[currentBillId] = billings[currentBillId].map((bill) => {
                if (bill.billingId === billingId) {
                    const newTotal = newQty * bill.price;

                    row.children[3].innerText = `₹${newTotal.toFixed(2)}`;

                    return {
                        ...bill,
                        qty: newQty,
                        total: newTotal
                    };
                }

                return bill;
            });
        }

        updateToLocal("Billings", billings);
        updatePriceBoxByCurrentBillId();
    }
});





function addIntoBillingBox(itemId) {
    const item = items.find((item) => item.itemCode == itemId);

    if (!item) {
        console.log("Item not found");
        return;
    }

    createBillIfNeeded();

    const billings = getBillingsFromLocal();

    if (!billings[currentBillId]) {
        billings[currentBillId] = [];
    }

    const existingBill = billings[currentBillId].find((bill) => {
        return bill.itemCode == itemId;
    });

    if (existingBill) {
        existingBill.qty = Number(existingBill.qty) + 1;
        existingBill.total = existingBill.qty * existingBill.price;

        updateToLocal("Billings", billings);

        const row = document.getElementById(existingBill.billingId);

        if (row) {
            const qtyInput = row.querySelector("input[type='number']");
            qtyInput.value = existingBill.qty;

            row.children[3].innerText = `₹${existingBill.total.toFixed(2)}`;
        }

        updateBillingView();
        updatePriceBoxByCurrentBillId();
        return;
    }

    const qty = 1;
    const price = Number(item.price);
    const total = qty * price;
    let r = document.querySelector('.rupee').innerText
    const billingId = "bill-" + Date.now();

    billingBox.innerHTML += `
        <tr id="${billingId}">
            <td>
                <div class="bill-item">
                    <div class="item-icon">
                        <img src="${item.itemImage || '/assets/soya_milk.png'}" alt="">
                    </div>
                    <span>${item.itemName}</span>
                </div>
            </td>

            <td>
                <div class="qty-num">
                    <input type="number" min="0" value="${qty}" id="qty"/>
                </div>
            </td>

            <td>₹${price.toFixed(2)}</td>

            <td>₹${total.toFixed(2)}</td>

            <td class="del-bill-item">
                <button class="del-btn">
                    <img src="/assets/delete.png" alt="">
                </button>
            </td>
        </tr>
    `;

    const billingItem = {
        billingId: billingId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        itemImage: item.itemImage,
        price: price,
        qty: qty,
        total: total
    };

    billings[currentBillId].push(billingItem);

    updateToLocal("Billings", billings);

    updateBillingView();
    updatePriceBoxByCurrentBillId();
}





function showListItems(items) {
    listItemBox.innerHTML = "";

    if (!items) return;

    for (let i = 0; i < items.length; i += 1) {
        listItemBox.innerHTML += `
            <div class="items-pic" id="${items[i].itemCode}" style="cursor:pointer">
                <img src="${items[i].itemImage}" alt="">
                <div class="img-title">
                    ${items[i].itemName}
                    <div class="price-pic">$ ${items[i].price}</div>
                </div> 
            </div>
        `;
    }

    document.querySelectorAll('.items-pic').forEach((itemBox) => {
        itemBox.addEventListener('click', () => {
            addIntoBillingBox(itemBox.id);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showListItems(items);
    updateBillingView();
    updatePriceBoxByCurrentBillId();
});



searchBox.addEventListener('input', () => {
    const value = searchBox.value.toLowerCase();

    const data = items.filter((item) => {
        return item.itemName.toLowerCase().startsWith(value);
    });

    showListItems(data);
});