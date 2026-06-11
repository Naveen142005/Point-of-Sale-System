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

//==================================================================================

const listItemBox = document.querySelector(".items-list-box");
const searchBox = document.querySelector(".search-box");
const items = getItemFromLocal("Inventory");

const priceContent = document.getElementById("price-amendment");
const priceBox = document.getElementById("priceBox");
const billingBox = document.getElementById("billingTable");
const noBillingItem = document.getElementById("noBillingItem");
const newBill = document.querySelector(".new-bill");
const tableHead = document.getElementById("table_head");

let currentBillId = localStorage.getItem("currentBillId");
const total_price = document.querySelector('.rupee');

const printBtn = document.querySelector('.print')


function changeGrantTotal() {
    const billings = getBillingsFromLocal();
    const currBill = billings[currentBillId] || [];

    let sum = currBill.reduce((acc, curr) => {
        return acc + Number(curr.total || 0);
    }, 0);

    total_price.innerText = `₹${sum.toFixed(2)}`;
}


function getBillingsFromLocal() {
    const billings = JSON.parse(localStorage.getItem("Billings") || "{}");

    if (Array.isArray(billings)) {
        return {};
    }

    return billings;
}


function setCurrBillId() {
    currentBillId = "Bill-" + Date.now();
    localStorage.setItem("currentBillId", currentBillId);
}



function showOnly(section) {
    billingBox.style.display = "none";
    noBillingItem.style.display = "none";
    priceBox.classList.add("none");

    if (tableHead) {
        tableHead.style.display = "none";
    }

    if (section === "empty") {
        noBillingItem.style.display = "flex";
    }

    if (section === "billing") {
        billingBox.style.display = 'table';

        if (tableHead) {
            tableHead.style.display = 'table';
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


function updatePrice() {
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

    total.innerText = `₹${totalAmount.toFixed(2)}`;
    gst.innerText = `₹${gstAmount.toFixed(2)}`;
    pay.innerText = `₹${payableAmount.toFixed(2)}`;

    const tenderAmount = Number(tender.value) || 0;
    const changeAmount = tenderAmount - payableAmount;

    change.innerText = `₹${changeAmount.toFixed(2)}`;
}



newBill.addEventListener("click", () => {
    // const sum = 0;
    total_price.innerText = `₹0.00`;

    const billings = getBillingsFromLocal();
    setCurrBillId();
    billingBox.innerHTML = "";

    showOnly("empty");
    updatePrice();
});


priceBox.querySelector(".tender-box input").addEventListener("input", () => {
    updatePrice();
});

priceContent.addEventListener("click", () => {
    if (billingBox.rows.length === 0) {
        showOnly("empty");
    } else {
        updatePrice();
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
    changeGrantTotal();
    updateBillingView();
    updatePrice();
});


function inputListen(e) {
    if (e.target.type !== "number") return;

    const row = e.target.closest("tr");
    const billingId = row.id;
    const itemId = row.getAttribute("itemid");

    let newQty = Number(e.target.value);

    const item = getItemByCode("Inventory", itemId);

    if (!item) {
        showPopups("Item not found", false);
        return;
    }

    const availableQty = Number(item.inStock || 0);

    const currqty = Number(getItemByCode('Inventory', itemId).inStock || 0)

    if (newQty > availableQty) {
        newQty = availableQty;
        e.target.value = availableQty;
        showPopups("Not Enough Qty", false);
        setTimeout(() => {
                showPopups('Avaiable qty is ' + currqty, true)
        }, 2500);
    }

    e.target.style.color = "black";
    e.target.parentElement.style.borderColor = "#e8e9f3";

    const billings = getBillingsFromLocal();

    if (billings[currentBillId]) {
        billings[currentBillId] = billings[currentBillId].map((bill) => {
            if (bill.billingId === billingId) {
                const newTotal = newQty * Number(bill.sellingPrice);

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
    updatePrice();
    changeGrantTotal();
}

billingBox.addEventListener("input", (e) => {
    inputListen(e);
});

billingBox.addEventListener("focusout", (e) => {
    inputListen(e);
});

function addIntoBillingBox(itemId, qty = 1) {
    
    const item = items.find((item) => item.itemCode == itemId);
    if (!item) {
        showPopups('Item not found')
        console.log("Item not found");
        return;
    }

    const currqty = Number(getItemByCode('Inventory', itemId).inStock || 0)

    if (currqty <= 0) {
        showPopups('Not Enough Qty', false);
        setTimeout(() => {
                showPopups('Avaiable qty is ' + currqty, true)
            }, 2500);
        return;
    }


    const billings = getBillingsFromLocal();

    if (!billings[currentBillId]) {
        billings[currentBillId] = [];
    }
    
    const billedItem = billings[currentBillId].find((bill) => {
        return bill.itemCode == itemId;
    });
    const BasePrice = Number(item.basePrice);

    if (billedItem) {
        const last_qty = Number(billedItem.qty) + Number(qty)
        if (last_qty > currqty) {
            showPopups('Not enough of quantity');
            setTimeout(() => {
                showPopups('Avaiable qty is ' + currqty, true)
            }, 2500);
            return;
        }
        console.log(billedItem);
        
        billedItem.qty = Number(billedItem.qty) + Number(qty);
        billedItem.total = billedItem.qty * Number(billedItem.sellingPrice);
        billedItem.profit = (billedItem.qty * Number(billedItem.sellingPrice)) - (billedItem.qty * BasePrice);

        
        
        updateToLocal("Billings", billings);

        const row = document.getElementById(billedItem.billingId);

        if (row) {
            const qtyInput = row.querySelector("input[type='number']");
            qtyInput.value = billedItem.qty;

            row.children[3].innerText = `₹${billedItem.total.toFixed(2)}`;
        }

        // updateBillingView();
        updatePrice();
        changeGrantTotal()
        return;
    }
    if (currqty <= 0) {
        showPopups('Not Enough Qty', false);
        setTimeout(() => {
                showPopups('Avaiable qty is ' + currqty, true)
            }, 2500);
        return;
    }
    
    const price = Number(item.sellingPrice);
    const total = qty * price;
    // console.log("--------------");
    console.log(total);
    
    
    const billingId = "bill-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    billingBox.insertAdjacentHTML('beforeend', `
        <tr id="${billingId}" itemid = "${itemId}">
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
                    <input type="number"  value="1" min ="1"/>
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
    `);

    const billingItem = {
        billingId: billingId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        itemImage: item.itemImage,
        sellingPrice: price,
        qty: qty,
        total: total,
        status: "processing",
        profit: total - qty*BasePrice
    };

    billings[currentBillId].push(billingItem);

    updateToLocal("Billings", billings);

    updateBillingView();
    updatePrice();
    changeGrantTotal()
}


function showListItems(items) {
    listItemBox.innerHTML = "";

    if (!items) return;

    for (let i = 0; i < items.length; i += 1) {
        listItemBox.innerHTML += `
            <div class="items-pic" id="${items[i].itemCode}" style="cursor:pointer"  >
                <span class="item-id">${items[i].itemCode}</span>
                <img src="${items[i].itemImage}" alt="">
                <div class="img-title">
                    ${items[i].itemName}
                    <div class="price-pic">₹ ${items[i].sellingPrice}</div>
                </div> 
            </div>
        `;
    }

    document.querySelectorAll(".items-pic").forEach((itemBox) => {
        itemBox.addEventListener("click", (e) => {
            if (e.target.classList.contains('item-id'))  return
            getItemIndex('')
            addIntoBillingBox(itemBox.id, 1);
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    setCurrBillId();
    showListItems(items);
    updateBillingView();
    updatePrice();
    changeGrantTotal()
});

// BILLING DETAILS FNCIONS =========================================

function getBillDetails() {
    return JSON.parse(localStorage.getItem("billings_details") || "[]");
}
function updateBillStatus(billId, status) {
    const arr = getBillDetails();

    const bill = arr.find((item) => {
        return item.billId === billId;
    });

    if (bill) {
        bill.status = status;
    } else {
        arr.push({
            billId: billId,
            status: status,
            created_at: getCurrentDateTime()
        });
    }

    updateToLocal("billings_details", arr);
}
function getBillStatus(billId) {
    const arr = getBillDetails();

    const bill = arr.find((item) => {
        return item.billId === billId;
    });

    if (!bill) {
        return "processing";
    }

    return bill.status;
}
// =========================================================



printBtn.addEventListener("click", () => {
    // billing state should change. 
    // qty items should change
    // new billing open aganum
    // inventory also gets updated.
    // const currBill = billings[billingId]


    const billings = getBillingsFromLocal();
    const currBillings = billings[currentBillId] || [];

    if (currBillings.length === 0) {
        showPopups("No items in bill", false);
        return;
    }

    if (priceBox.classList.contains("none")) {
        showPopups("Move to price amendment section for complete the billing", false);
        return;
    }
     const change = priceBox.querySelector(".change-box h2");
     console.log(change.innerText);
     
    if (change.innerText.includes('-')) {
        showPopups ("Give valid amount in the tender");
        return;
    }

    if (getBillStatus(currentBillId) === "Completed") {
        showPopups("This bill already completed", false);
        return;
    }

    const inventory = getItemFromLocal("Inventory") || [];

    for (let i = 0; i < currBillings.length; i += 1) {
        const itemCode = currBillings[i].itemCode;
        const qty = Number(currBillings[i].qty);

        const itemIdx = inventory.findIndex((item) => {
            return item.itemCode == itemCode;
        });

        if (itemIdx === -1) {
            showPopups("Item not found in inventory", false);
            return;
        }

        inventory[itemIdx].sold = Number(inventory[itemIdx].sold || 0) + qty;
        inventory[itemIdx].inStock = Number(inventory[itemIdx].inStock || 0) - qty;

        if (inventory[itemIdx].inStock == 0) {
            inventory[itemIdx].status = 'Out of Stock';
        }
    }

    updateToLocal("Inventory", inventory);

    updateBillStatus(currentBillId, "Completed");

    showPopups("Success", true);
    total_price.innerText = `₹0.00`;
    setCurrBillId();

    billingBox.innerHTML = "";
    showOnly("empty");
    updatePrice();
});

//=======================================================================================
// Side la 

const numInput = document.querySelector(".calc-left .input-group:first-child input");
const qtySpan = document.querySelector(".qty-box span");
const minusBtn = document.querySelector(".qty-box button:first-child");
const plusBtn = document.querySelector(".qty-box button:last-child");
const addBtn = document.querySelector(".add-btn");
const numPadBtns = document.querySelectorAll(".num-pad button");

minusBtn.addEventListener("click", () => {
    let qty = Number(qtySpan.innerText);

    if (qty > 1) {
        qty -= 1;
    }

    qtySpan.innerText = qty;
});

plusBtn.addEventListener("click", () => {
    let qty = Number(qtySpan.innerText);

    qty += 1;

    qtySpan.innerText = qty;
});

numPadBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const val = btn.innerText;

        if (val === "⌫") {
            numInput.value = numInput.value.slice(0, -1);
            return;
        }

        if (val === ".") {
            if (!numInput.value.includes(".")) {
                numInput.value += val;
            }
            return;
        }

        numInput.value += val;
    });
});

addBtn.addEventListener("click", () => {
    const itemCode = numInput.value.trim();
    const qty = Number(qtySpan.innerText);

    if (itemCode === "") {
        showPopups("Enter item number", false);
        return;
    }

    const item = items.find((item) => {
        return item.itemCode == itemCode;
    });

    if (!item) {
        showPopups("Item not found", false);
        return;
    }
    
    addIntoBillingBox(itemCode, qty);

    numInput.value = "";
    qtySpan.innerText = "1";
});

numInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addBtn.click();
    }
});

let selectedCat = "All Items";

function cleanText(text) {
    return text.replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/").trim();
}

function filterItems() {
    const searchValue = searchBox.value.toLowerCase();

    const data = items.filter((item) => {
        const itemNameOk = item.
        itemName.toLowerCase().
        includes(searchValue);

        const itemCat = cleanText(item.category || "");
        const catOk = selectedCat === "All Items" || itemCat === selectedCat;

        return itemNameOk && catOk;
    });

    showListItems(data);
}

searchBox.addEventListener("input", () => {
    filterItems();
});

document.querySelectorAll(".items-menu .item").forEach((catBox) => {
    catBox.addEventListener("click", () => {
        document.querySelectorAll(".items-menu .item").forEach((box) => {
            box.classList.remove("active");
        });

        catBox.classList.add("active");

        selectedCat = cleanText(catBox.innerText);

        filterItems();
    });
});


document.addEventListener("click", (e) => {
    const idBox = e.target.closest(".item-id");

    if (!idBox) return;

    e.preventDefault();
    e.stopPropagation();

    const id = idBox.innerText;

    navigator.clipboard.writeText(id);

    idBox.innerText = "Copied!";

    setTimeout(() => {
        idBox.innerText = id;
    }, 1000);
});