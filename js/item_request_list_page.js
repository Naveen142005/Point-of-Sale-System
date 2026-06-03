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

function showReqs(arr) {
    tbody.innerHTML = "";

    if (arr.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">No requests found</td>
            </tr>
        `;

        setTotal(0);
        return;
    }

    for (let i = 0; i < arr.length; i += 1) {
        const req = arr[i];

        let editBtn = "";

       
        editBtn = `
            <button class="edit-btn" data-id="${req.reqId}" style="background-color: transparent;border: none;">
                    <img src="/assets/eye.png" alt="" width="20" height="20">         
            </button>
        `;
        

        tbody.innerHTML += `
            <tr>
                <td>${req.reqId}</td>
                <td>${req.subject}</td>
                <td>${req.requested_by}</td>
                <td>${req.requested_date}</td>
                <td>${req.expecting_delivery}</td>
                <td>
                <span class="status-box ${req.status.toLowerCase()}"> ${req.status}</span>
               </td>
                <td>${editBtn}</td>
            </tr>
        `;
    }

    setTotal(arr.length);
}

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