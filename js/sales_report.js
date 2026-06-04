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

//=========================================================

const table = document.querySelector('.inventory-table tbody')
let currLoadedItems;

function getSoldQty(items) {
    let SoldQty = [];
    
    for (let i = 0; i < items.length; i += 1) {
        const itemName = items[i].itemName;
        const itemCode = items[i].itemName;
        const sold = items[i].sold
        const total = Number(items[i].price) * Number(sold);
        // console.log(sold , Number(ite));
        
        SoldQty.push({
            itemName, itemCode, sold, total
        });
    }
    
    return SoldQty
}




function loadTableContent (SoldQty) {
    let content = ''
    for (let i = 0; i < SoldQty.length; i += 1) {
        content += `<tr>
        <td>${SoldQty[i].itemName}</td>
        <td>${SoldQty[i].sold}</td>
        <td>${SoldQty[i].total}</td>
        </tr>`
    }
    console.log(table);
    
    table.innerHTML = content
    console.log("aa");
    currLoadedItems = SoldQty;
    
}

document.addEventListener('DOMContentLoaded', () => {
    const items = getItemFromLocal ('Inventory')
    const SoldQty = getSoldQty(items)
    loadTableContent(SoldQty)
    addSelectItems(currLoadedItems)
})


const itemSelect = document.querySelector('.filter-item select');
const fromDate = document.querySelector('.filter-date-bottom .filter:nth-child(1) input');
const toDate = document.querySelector('.filter-date-bottom .filter:nth-child(2) input');
const tabs = document.querySelectorAll('.date-tab');
const filterBtn = document.querySelector('.filter-btn .active-btn');
const resetBtn = document.querySelector('.filter-btn button:nth-child(2)');


function addSelectItems(items) {
    
    let options = `<option>Select Item</option>`
    
    for (let i = 0; i < items.length; i += 1)
        options += `<option>${items[i].itemName}</option>`
    
    itemSelect.innerHTML = options
}

console.log(itemSelect);
console.log(fromDate);
console.log(toDate);
console.log(tabs);
console.log(filterBtn);
console.log(resetBtn);
console.log(itemSelect);

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        console.log(tab)
        tabs.forEach((t) => {
            t.classList.remove('active-tab')
        })
        tab.classList.add('active-tab')
    })
})


filterBtn.addEventListener('click', () => {
    const itemName = itemSelect.value
    const tab = [...tabs].find(t => t.classList.contains('active-tab')).dataset.value
    // console.log(tab.dataset.value);
    const from = fromDate.value
    const to = toDate.value

    const data = currLoadedItems.filter ((item) => {
        if (item.itemName == itemName) {
            return item;
        }
    })

    console.log(data);
    
    loadTableContent(data)
    addSelectItems(currLoadedItems)
    // (tab)
})


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

        console.log(key);
        
        if (lastIdx !== idx) {
            assending = true;
        }

        const sorted = sortItems([...currLoadedItems], key, assending);

        loadTableContent(sorted);

        assending = !assending;
        lastIdx = idx;
    });
});