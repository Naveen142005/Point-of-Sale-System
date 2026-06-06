const btn = document.getElementById('three-dot')
const list = document.getElementById('list')

btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.add('active-three-dot')
    list.style.display = `flex`;
})

document.addEventListener('click', (e) => {
    if (btn.classList.contains('active-three-dot') && !btn.contains(e.target) && !list.contains(e.target)) {
        btn.classList.remove('active-three-dot')
        list.style.display = 'none'
        return;
    }
})



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

const dateBoxes = document.querySelectorAll(".date-box");

dateBoxes.forEach((box) => {
    const input = box.querySelector("input");

    box.addEventListener("click", () => {
        input.showPicker();
    });
});

//=========================================================

const itemSelect = document.querySelector('.filter-item select');
const fromDate = document.querySelector('.filter-date-bottom .filter:nth-child(1) input');
const toDate = document.querySelector('.filter-date-bottom .filter:nth-child(2) input');
const tabs = document.querySelectorAll('.date-tab');
const filterBtn = document.querySelector('.filter-btn .active-btn');
const resetBtn = document.querySelector('.filter-btn button:nth-child(2)');

const page = document.querySelector('.entry-box select')

const table = document.querySelector('.inventory-table tbody')

const showingText = document.getElementById("showingText");

const perPageSelect = document.querySelector(".entry-box select");
const pageCenter = document.querySelector(".page-center");

let currentPage = 1;
let showPerPage = Number(perPageSelect.value);

function updateShowingText() {
    let totalItems = currLoadedItems.length;
    document.querySelector('.total_').innerText = totalItems
    if (totalItems === 0) {
        showingText.textContent = `Showing 0 to 0 of 0 entries`;
        return;
    }

    let start = (currentPage - 1) * showPerPage + 1;
    let end = Math.min(currentPage * showPerPage, totalItems);

    showingText.textContent = `Showing ${start} to ${end} of ${totalItems} entries`;
}


let currLoadedItems;

function getSoldQty(items) {
    let SoldQty = [];

    for (let i = 0; i < items.length; i += 1) {
        const itemName = items[i].itemName;
        // const itemCode = items[i].itemName;
        const sold = items[i].itemQty
        const total = Number(items[i].itemTotal)
        // 

        SoldQty.push({
            itemName, sold, total
        });
    }

    return SoldQty
}


function loadTableContent(SoldQty) {
    currLoadedItems = SoldQty;

    let content = "";

    let startIdx = (currentPage - 1) * showPerPage;
    let endIdx = currentPage * showPerPage;

    if (SoldQty.length === 0) {
        content = `
            <tr>
                <td colspan="3" style="text-align:center">
                    No items found
                </td>
            </tr>
        `;
    } else {
        for (let i = startIdx; i < Math.min(SoldQty.length, endIdx); i += 1) {
            content += `
                <tr>
                    <td>${SoldQty[i].itemName}</td>
                    <td>${SoldQty[i].sold}</td>
                    <td>${SoldQty[i].total}</td>
                </tr>
            `;
        }
    }

    table.innerHTML = content;
    createPaginationButtons();
    updateShowingText()
}


function createPaginationButtons() {
    let totalPages = Math.ceil(currLoadedItems.length / showPerPage);

    if (totalPages === 0) totalPages = 1;

    let buttons = "";

    buttons += `
        <button class="page-btn" data-page="prev">
            &lsaquo;
        </button>
    `;

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            buttons += `
                <button 
                    class="page-btn ${currentPage === i ? "active-page" : ""}" 
                    data-page="${i}">
                    ${i}
                </button>
            `;
        }
    } else {
        buttons += `
            <button class="page-btn ${currentPage === 1 ? "active-page" : ""}" data-page="1">1</button>
            <button class="page-btn ${currentPage === 2 ? "active-page" : ""}" data-page="2">2</button>
            <button class="page-btn ${currentPage === 3 ? "active-page" : ""}" data-page="3">3</button>
            <button class="page-btn dots" disabled>...</button>
            <button class="page-btn ${currentPage === totalPages ? "active-page" : ""}" data-page="${totalPages}">
                ${totalPages}
            </button>
        `;
    }

    buttons += `
        <button class="page-btn" data-page="next">
            &rsaquo;
        </button>
    `;

    pageCenter.innerHTML = buttons;
}


pageCenter.addEventListener("click", function (e) {
    if (!e.target.classList.contains("page-btn")) return;

    let page = e.target.dataset.page;
    let totalPages = Math.ceil(currLoadedItems.length / showPerPage);

    if (page === "prev") {
        if (currentPage > 1) {
            currentPage--;
        }
    } else if (page === "next") {
        if (currentPage < totalPages) {
            currentPage++;
        }
    } else {
        currentPage = Number(page);
    }

    loadTableContent(currLoadedItems);
});

perPageSelect.addEventListener("change", function () {
    showPerPage = Number(perPageSelect.value);
    currentPage = 1;
    loadTableContent(currLoadedItems);
});



const billings = getItemFromLocal('Billings')
const billings_details = getItemFromLocal('billings_details')

function getItemMap(ids) {
    const itemMap = {}
    ids.forEach((id) => {

        billings[id].forEach((bill) => {

            if (!itemMap[bill.itemCode]) {
                itemMap[bill.itemCode] = {
                    itemName: bill.itemName,
                    itemQty: bill.qty,
                    itemTotal: bill.total
                }
            }

            else {
                itemMap[bill.itemCode] = {
                    ...itemMap[bill.itemCode],
                    itemQty: itemMap[bill.itemCode].itemQty + bill.qty,
                    itemTotal: itemMap[bill.itemCode].itemTotal + bill.total
                }
            }
        })

    })
    return itemMap;
}

function getTodayItems() {

    const today = new Date();

    const ids = new Set(
        billings_details
            .filter(bill => {
                const d = new Date(bill.created_at);

                return d.toDateString() === today.toDateString()
                    && bill.status === "Completed";
            })
            .map(bill => bill.billId)
    );

    return getItemMap(ids);
}

function getYesterdayItems() {
    const today = new Date();
    today.setDate(today.getDate() - 1)

    const ids = new Set(
        billings_details
            .filter(bill => {
                const d = new Date(bill.created_at);

                return d.toDateString() === today.toDateString()
                    && bill.status === "Completed";
            })
            .map(bill => bill.billId)
    );


    return getItemMap(ids);
}


function getThisWeekItems() {
    const today = new Date();
    const start = new Date()
    start.setDate(0)
    start.setHours(0, 0, 0, 0)

    const ids = new Set(
        billings_details
            .filter(bill => {
                const d = new Date(bill.created_at);
                return d >= start &&
                    d <= today &&
                    bill.status === "Completed";
            })
            .map(bill => bill.billId)
    );


    return getItemMap(ids);
}


function getThisMonthItems() {
    const today = new Date();

    const ids = new Set(
        billings_details
            .filter(bill => {
                const d = new Date(bill.created_at);

                return d.getMonth() === today.getMonth() &&
                    d.getFullYear() === today.getFullYear() &&
                    bill.status === "Completed";
            })
            .map(bill => bill.billId)
    );

    return getItemMap(ids);
}

document.addEventListener('DOMContentLoaded', () => {
    const items = getItemFromLocal('Inventory')
    let filteredItem = getThisMonthItems()
    const newItems = Object.values(filteredItem)
    const SoldQty = getSoldQty(newItems)
    loadTableContent(SoldQty)
    addSelectItems(currLoadedItems)
})


function addSelectItems(items) {

    let options = `<option>Select Item</option>`

    for (let i = 0; i < items.length; i += 1)
        options += `<option>${items[i].itemName}</option>`

    itemSelect.innerHTML = options
}


tabs.forEach((tab) => {
    tab.addEventListener('click', () => {

        tabs.forEach((t) => {
            t.classList.remove('active-tab')
        })
        tab.classList.add('active-tab')
    })
})


filterBtn.addEventListener('click', () => {
    let itemMap = {};

    if (fromDate.value || toDate.value) {
        const from = fromDate.value ? new Date(fromDate.value + "T00:00:00") : null;
        const to = toDate.value ? new Date(toDate.value + "T23:59:59") : null;

        const ids = new Set(
            billings_details
                .filter(bill => {
                    const d = new Date(bill.created_at);

                    return bill.status === "Completed" &&
                        (!from || d >= from) &&
                        (!to || d <= to);
                })
                .map(bill => bill.billId)
        );

        itemMap = getItemMap(ids);
    } else {
        const activeTab = document.querySelector('.date-tab.active-tab').innerText;

        if (activeTab === "Today") {
            itemMap = getTodayItems();
        } else if (activeTab === "Yesterday") {
            itemMap = getYesterdayItems();
        } else if (activeTab === "This Week") {
            itemMap = getThisWeekItems();
        } else if (activeTab === "This Month") {
            itemMap = getThisMonthItems();
        }
    }

    let items = Object.values(itemMap);
    let soldQty = getSoldQty(items);

    if (itemSelect.value !== "Select Item") {
        soldQty = soldQty.filter(item => item.itemName === itemSelect.value);
    }

    loadTableContent(soldQty);
});


const tableKeys = [
    "itemName",
    "sold",
    "total"
];

const ths = document.querySelectorAll('table thead tr th');

let assending = true;
let lastIdx = -1;

ths.forEach((th, idx) => {
    th.style.cursor = "pointer";

    th.addEventListener('click', () => {
        const key = tableKeys[idx];

        if (lastIdx !== idx) {
            assending = true;
        }

        const sorted = sortItems([...currLoadedItems], key, assending);

        loadTableContent(sorted);

        assending = !assending;
        lastIdx = idx;
    });
});
