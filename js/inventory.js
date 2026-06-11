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


/* ============================================================================================ */

const addItemBtn = document.getElementById('add-item-btn')

addItemBtn.addEventListener('click', () => {
    location.href = '/pages/inventory_new_item.html';
})

let currLoadedItems;
let currentPage = 1;
let showPerPage = 10;

const pageCenter = document.querySelector(".page-center");
const showingText = document.getElementById("showingText");
const entryBox = document.querySelector(".page-left .entry-box");
const entryValue = document.querySelector(".page-left .entry-box span");

function showTableContent(items, resetPage = true) {
    currLoadedItems = items;

    if (resetPage) {
        currentPage = 1;
    }

    tableContent.innerHTML = "";

    document.querySelectorAll(".totalItem").forEach((i) => {
        i.innerHTML = items.length;
    });

    if (items.length === 0) {
        tableContent.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;">No items found</td>
            </tr>
        `;

        createPageButtons();
        updateShowingText();
        return;
    }

    let startIdx = (currentPage - 1) * showPerPage;
    let endIdx = currentPage * showPerPage;

    for (let i = startIdx; i < Math.min(items.length, endIdx); i++) {
        let item = items[i];
        console.log(item);

        let stock = Number(item.inStock);

        let statusText = stock <= 0 ? "Out of Stock" : "In Stock";
        let statusClass = stock <= 0 ? "out-stock" : "in-stock";
        let stockClass = stock <= 0 ? "stock-red" : "stock-green";

        tableContent.innerHTML += `
            <tr>
                <td>${item.itemCode}</td>
                <td>
                    <div class="item-name">
                        <img 
                            src="${item.itemImage || "/assets/tea.png"}" 
                            alt="" 
                            class="item-img"
                        >
                        <span>${item.itemName || "-"}</span>
                    </div>
                </td>

                <td>${item.category || "-"}</td>
                <td>$${item.basePrice || "0"}</td>
                <td>${item.unit || "-"}</td>
                <td>${item.purchased || 0}</td>
                <td>${item.sold || 0}</td>

                <td class="stock-count ${stockClass}">
                    ${stock}
                </td>

                <td>
                    <span class="status-box ${statusClass}">
                        ${statusText}
                    </span>
                </td>

                <td>
                    ${(item.update_at || "-").replace(",", "<br>")}
                </td>

                <td>
                    <button class="edit-btn" data-id="${item.itemCode}">Edit</button>
                </td>
            </tr>
        `;
    }

    createPageButtons();
    updateShowingText();
}

function setItemsName() {
    const items = getItemFromLocal('Inventory');
    const itemNameSelect = document.getElementById('itemName')

    let options = `<option value="">All Items</option>`;
    items.forEach ((item) => {
        options += `<option value= "${item.itemName}">  ${item.itemName}</option>`
    })
    
    itemNameSelect.innerHTML = options
}

document.addEventListener("DOMContentLoaded", () => {
    // const items = JSON.parse(localStorage.getItem("Inventory") || "[]");
    const items = getItemFromLocal('Inventory');
    setItemsName();
    
    const category = document.getElementById("category");
    const itemName = document.getElementById("itemName");
    const status = document.getElementById("status");
    const dateFrom = document.getElementById("dateFrom");
    const dateTo = document.getElementById("dateTo");

    const filterBtn = document.getElementById("filterBtn");
    const resetBtn = document.getElementById("resetBtn");



    showTableContent(items);

    filterBtn.addEventListener("click", () => {
        const finalData = items.filter((item) => {
            const itemDate = new Date(item.update_at);

            if (category.value && category.value !== "Select category" && category.value !== "All Items" && item.category !== category.value) {
                return false;
            }
            if (itemName.value && item.itemName.toLowerCase() !== itemName.value.toLowerCase()) {
                return false;
            }
            if (status.value && status.value !== "Select status" && item.status !== status.value) {
                return false;
            }
            if (dateFrom.value && itemDate < new Date(dateFrom.value)) {
                return false;
            }
            if (dateTo.value) {
                const toDate = new Date(dateTo.value);
                toDate.setHours(23, 59, 59, 999);

                if (itemDate > toDate) {
                    return false;
                }
            }

            return true;
        });

        showTableContent(finalData);
    });

    resetBtn.addEventListener("click", () => {
        category.value = "";
        itemName.value = "";
        status.value = "";
        dateFrom.value = "";
        dateTo.value = "";

        showTableContent(items);
    });
});


document.querySelector(".date-box").addEventListener("click", () => {
    document.getElementById("dateTo").showPicker();
});
document.querySelector(".date-box-1").addEventListener("click", () => {
    document.getElementById("dateFrom").showPicker();
});



document.addEventListener("click", (e) => {

    if (e.target.classList.contains("edit-btn")) {
        const id = e.target.dataset.id;

        location.href = `./inventory_edit_page.html?id=${id}`;
    }
});



const tableKeys = [
    '',
    "itemName",
    "category",
    "price",
    "unit",
    "purchased",
    "sold",
    "inStock",
    "status",
    "update_at",
    null
];

const ths = document.querySelectorAll('table thead tr th');

let assending = true;
let lastIdx = -1;

ths.forEach((th, idx) => {
    th.style.cursor = "pointer";

    th.addEventListener('click', () => {
        const key = tableKeys[idx];

        if (key === null) return;

        if (lastIdx !== idx) {
            assending = true;
        }
        console.log(key);

        const sorted = sortItems([...currLoadedItems], key, assending);

        showTableContent(sorted);
        console.log(sorted);


        assending = !assending;
        lastIdx = idx;
    });
});


function createPageButtons() {
    let totalPages = Math.ceil(currLoadedItems.length / showPerPage);

    if (totalPages === 0) {
        totalPages = 1;
    }

    let buttons = "";

    buttons += `
        <button class="page-btn" data-page="first">&laquo;</button>
        <button class="page-btn" data-page="prev">&lsaquo;</button>
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
            <button class="page-btn ${currentPage === 4 ? "active-page" : ""}" data-page="4">4</button>
            <button class="page-btn ${currentPage === 5 ? "active-page" : ""}" data-page="5">5</button>
            <button class="page-btn dots" disabled>...</button>
            <button class="page-btn ${currentPage === totalPages ? "active-page" : ""}" data-page="${totalPages}">
                ${totalPages}
            </button>
        `;
    }

    buttons += `
        <button class="page-btn" data-page="next">&rsaquo;</button>
        <button class="page-btn" data-page="last">&raquo;</button>
    `;

    pageCenter.innerHTML = buttons;
}

function updateShowingText() {
    let totalItems = currLoadedItems.length;

    if (totalItems === 0) {
        showingText.innerHTML = `Showing 0 to 0 of 0 entries`;
        return;
    }

    let start = (currentPage - 1) * showPerPage + 1;
    let end = Math.min(currentPage * showPerPage, totalItems);

    showingText.innerHTML = `Showing ${start} to ${end} of ${totalItems} entries`;
}

pageCenter.addEventListener("click", (e) => {
    if (!e.target.classList.contains("page-btn")) return;

    let page = e.target.dataset.page;
    let totalPages = Math.ceil(currLoadedItems.length / showPerPage);

    if (page === "first") {
        currentPage = 1;
    }
    else if (page === "prev") {
        if (currentPage > 1) {
            currentPage--;
        }
    }
    else if (page === "next") {
        if (currentPage < totalPages) {
            currentPage++;
        }
    }
    else if (page === "last") {
        currentPage = totalPages;
    }
    else {
        currentPage = Number(page);
    }

    showTableContent(currLoadedItems, false);
});