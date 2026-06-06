const btn = document.getElementById('three-dot')
const list = document.getElementById('list')

btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.add('active-three-dot')
    list.style.display=`flex`;
})

document.addEventListener('click', (e) => {
    if (btn.classList.contains('active-three-dot') && !btn.contains(e.target) && !list.contains(e.target)){
        btn.classList.remove('active-three-dot')
        list.style.display='none'
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



const dateBoxes = document.querySelectorAll(".date-box");

dateBoxes.forEach((box) => {
    const input = box.querySelector("input");
    
    box.addEventListener("click", () => {
        input.showPicker();
    });
});

//=================================================================================================

const tbody = document.querySelector(".inventory-table tbody");
const tot = document.querySelectorAll(".tot");
const reqSelect = document.querySelector(".filter:nth-child(1) select");
const subInput = document.querySelector(".filter:nth-child(2) input");
const bySelect = document.querySelector(".filter:nth-child(3) select");
const fromDate = document.querySelector(".filter:nth-child(4) input");
const toDate = document.querySelector(".filter:nth-child(5) input");
const filterBtn = document.querySelector(".filter-btn button:nth-child(1)");
const resetBtn = document.querySelector(".filter-btn button:nth-child(2)");
const newBtns = document.querySelectorAll(".btn-1");


let currentPage = 1;
let showPerPage = 10;

const pageCenter = document.querySelector(".page-center");
const showingText = document.getElementById("showingText");
const perPageSelect = document.getElementById("perPageSelect");

let currLoadedItems;
function getReqs() {
    return getItemFromLocal("items_request");
}

function setTotal(count) {
    tot.forEach((item) => {
        item.innerText = count;
    });
}

function setReqOptions() {
    const arr = getReqs();

    reqSelect.innerHTML = `<option value="">Select request ID</option>`;

    for (let i = 0; i < arr.length; i += 1) {
        reqSelect.innerHTML += `
            <option value="${arr[i].reqId}">${arr[i].reqId}</option>
        `;
    }
}

function getDateOnly(dateValue) {
    const d = new Date(dateValue);
    if (isNaN(d)) 
        return "";
    return d.toISOString().slice(0, 10);
}

function showReqs(arr, resetPage = true) {
    currLoadedItems = arr;

    if (resetPage) {
        currentPage = 1;
    }

    tbody.innerHTML = "";

    setTotal(arr.length);

    if (arr.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">No requests found</td>
            </tr>
        `;

        createPageButtons();
        updateShowingText();
        return;
    }

    let startIdx = (currentPage - 1) * showPerPage;
    let endIdx = currentPage * showPerPage;

    for (let i = startIdx; i < Math.min(arr.length, endIdx); i += 1) {
        const req = arr[i];

        tbody.innerHTML += `
            <tr>
                <td>${req.reqId}</td>
                <td>${req.subject}</td>
                <td>${req.requested_by}</td>
                <td>${req.requested_date}</td>
                <td>${req.expecting_delivery}</td>
                <td>
                    <span class="status-box ${req.status.toLowerCase()}">
                        ${req.status}
                    </span>
                </td>
                <td>
                    <button class="edit-btn" data-id="${req.reqId}" style="background-color: transparent;border: none;">
                        <img src="/assets/eye.png" alt="" width="20" height="20">         
                    </button>
                </td>
            </tr>
        `;
    }

    createPageButtons();
    updateShowingText();
}

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

    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i += 1) {
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
        showingText.innerHTML = "Showing 0 to 0 of 0 entries";
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
    } else if (page === "prev") {
        if (currentPage > 1) currentPage--;
    } else if (page === "next") {
        if (currentPage < totalPages) currentPage++;
    } else if (page === "last") {
        currentPage = totalPages;
    } else {
        currentPage = Number(page);
    }

    showReqs(currLoadedItems, false);
});

perPageSelect.addEventListener("change", () => {
    showPerPage = Number(perPageSelect.value);
    currentPage = 1;
    showReqs(currLoadedItems, false);
});

function filterReqs() {
    const arr = getReqs();

    const reqVal = reqSelect.value;
    const subVal = subInput.value.toLowerCase();
    const byVal = bySelect.value;
    const fromVal = fromDate.value;
    const toVal = toDate.value;

    const data = arr.filter((req) => {
        if (reqVal !== "" && req.reqId !== reqVal) {
            return false;
        }

        if (subVal !== "" && !req.subject.toLowerCase().includes(subVal)) {
            return false;
        }

        if (byVal !== "Select requested by" && byVal !== "" && req.requested_by !== byVal) {
            return false;
        }

        const reqDate = getDateOnly(req.requested_date);

        if (fromVal !== "" && reqDate < fromVal) {
            return false;
        }

        if (toVal !== "" && reqDate > toVal) {
            return false;
        }

        return true;
    });

    showReqs(data);
}

function resetFilter() {
    reqSelect.value = "";
    subInput.value = "";
    bySelect.value = "Select requested by";
    fromDate.value = "";
    toDate.value = "";

    showReqs(getReqs());
}

filterBtn.addEventListener("click", () => {
    filterReqs();
});

resetBtn.addEventListener("click", () => {
    resetFilter();
});

tbody.addEventListener("click", (e) => {
    const btn = e.target.closest(".edit-btn");

    if (!btn) return;

    const reqId = btn.dataset.id;

    location.href = `./item_request_edit.html?reqId=${reqId}`;
});

newBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        location.href = "./Item_request_add_page.html";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    setReqOptions();
    showReqs(getReqs());
});




const tableKeys = [
    "reqId",
    "subject",
    "requested_by",
    "requested_date",
    "expecting_delivery",
    "status",
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

        const sorted = sortItems([...currLoadedItems], key, assending);

        showReqs(sorted);

        assending = !assending;
        lastIdx = idx;
    });
});