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


function showTableContent(items) {
    tableContent.innerHTML = "";
    const total = document.querySelectorAll('.totalItem').forEach((i) => i.innerHTML = items.length)

    if (items.length === 0) {
        tableContent.innerHTML = `
        <tr>
            <td colspan="10" style="text-align:center;">No items found</td>
        </tr>
    `;
    }

    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        let stock = Number(item.inStock);

        let statusText = stock <= 0 ? "Out of Stock" : "In Stock";
        let statusClass = stock <= 0 ? "out-stock" : "in-stock";
        let stockClass = stock <= 0 ? "stock-red" : "stock-green";

        tableContent.innerHTML += `
        <tr>
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
            <td>$${item.price || "0"}</td>
            <td>${item.unit || "-"}</td>
            <td>${item.purchased}</td>
            <td>${item.sold}</td>

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
                <button class="edit-btn" data-id = ${item.itemCode}>Edit</button>
            </td>
        </tr>
    `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const items = JSON.parse(localStorage.getItem("Inventory") || "[]");

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

            if (category.value && item.category !== category.value) {
                return false;
            }

            if (itemName.value && item.itemName !== itemName.value) {
                return false;
            }

            if (status.value && item.status !== status.value) {
                return false;
            }

            if (dateFrom.value && itemDate < new Date(dateFrom.value)) {
                return false;
            }

            if (dateTo.value && itemDate > new Date(dateTo.value)) {
                return false;
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