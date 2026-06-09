
let g = null;
function loadGraph(type) {

    let X = [], Y = [];
    let XX = [], YY = [];
    if (type == 'Daily') {
        [X, Y] = getThisWeek();
        [XX, YY] = getLastWeek();
    }
    else if (type === 'This Week') {
        [X, Y] = getThisWeek()
    }
    else if (type === 'This Month') {
        [X, Y] = getThisMonth()
    }
    else if (type === 'Last Week') {
        [X, Y] = getLastWeek()
    }
    else if (type === 'This Year') {
        [X, Y] = getThisYear()
    }
    console.log(X);
    console.log(Y);
    console.log(YY);
    const canva = document.getElementById("sales-graph");
    if (g) {
        g.destroy()
    }

    g = new Chart(canva, {
        type: "line",

        data: {
            labels: X,

            datasets: [
                {
                    data: Y,
                    borderColor: "#4b35ff",
                    borderWidth: 3,
                    tension: 0.34,
                    pointRadius: 0,
                },

                {
                    data: YY,
                    borderColor: "#a798ff",
                    borderWidth: 3,
                    tension: 0.34,
                    pointRadius: 0,
                    borderDash: [4, 4]
                }

            ]
        },

        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 10
                        },
                        callback: function (value) {
                            return Intl.NumberFormat("en", {
                                notation: "compact"
                            }).format(value);
                        }
                    }
                }
            }
        },


    });
}

function getGraphData(startDate, endDate, type) {
    /* 
        I am calculating based on the type.
        week -> 4 (for month, instead of showing 1 - 31. I am showing weekly ok ?)
        days -> 7
        years -> 12
    */
    const billings_details = getItemFromLocal('billings_details')
    const billings = getItemFromLocal('Billings')

    const filtered_bills = billings_details.filter((bill) => {
        const d = new Date(bill.created_at)
        if (d >= startDate && d <= endDate) return true;
    })


    // Each array will get change based on the type.
    let week = [0, 0, 0, 0] // this is for type = 'month'
    let days = [0, 0, 0, 0, 0, 0, 0] // this for type = 'week' because we have 7 days in a weekk,
    let year = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // this is for year. simple.
 
    console.log(filtered_bills);

    filtered_bills.forEach((d) => {
        const bill = billings[d.billId] || []
        let totalamt = 0;
        console.log("bills", bill);

        bill.forEach((b) => {
            totalamt += Number(b.total)
        })
        console.log(totalamt);

        let date = new Date(d.created_at)

        if (type === "month") {
            let w = (date.getDate() % 7); // date % 7 -> week.... 
            week[w] += totalamt
        }
        else if (type === 'week') {
            let day = date.getDay()
            days[day] += totalamt
        }
        else {
            const mon = date.getMonth();
            year[mon] += totalamt
        }
    })

    if (type == 'month') return week;
    else if (type === "week") return days;
    else return year;
}


// All the 4 function... for the line graph

function getThisWeek() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const dataY = getGraphData(startDate, endDate, 'week');

    let dataX = [];
    for (let i = 0; i < 7; i++) {
        let date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        dataX.push(date.getDate() + ' ' + date.toLocaleString('en-US', { month: 'short' }));
    }

    return [dataX, dataY]

}

function getLastWeek() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() - 7);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const dataY = getGraphData(startDate, endDate, 'week');
    let dataX = [];
    for (let i = 0; i < 7; i++) {
        let date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        dataX.push(date.getDate() + ' ' + date.toLocaleString('en-US', { month: 'short' }));
    }
    return [dataX, dataY]
}

function getThisMonth() {
    const startDate = new Date();
    startDate.setDate(1);

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    const dataY = getGraphData(startDate, endDate, 'month');
    const dataX = ['week-1', 'week-2', 'week-3', 'week-4']
    return [dataX, dataY]
}

function getThisYear() {
    const startDate = new Date();
    startDate.setMonth(0);
    startDate.setDate(1);

    const endDate = new Date();
    endDate.setMonth(11);
    endDate.setDate(31);

    const dataY = getGraphData(startDate, endDate, 'year');
    const dataX = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return [dataX, dataY]
}



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
    // console.log(isMobile);
    if (isMobile) {
        sideBar.classList.add('active')
    }
    else {
        if (sideBar.classList.contains('closed')) {
            sideBar.classList.remove('closed');
            main.style.marginLeft = '245px';
            main.style.width = 'calc(100vw - 245px)';
            sideBar.style.left = '0px'
        } else {
            sideBar.classList.add('closed');
            main.style.marginLeft = '0px';
            main.style.width = '100vw';
            sideBar.style.left = '-500px'
        }
    }
});



//====================================================================

const calBox = document.querySelector('.calendar-box')

const dateText = document.getElementById("dateText");

flatpickr("#rangePicker", {
    mode: "range",
    dateFormat: "Y-m-d",

    onChange: function (selectedDates) {
        if (selectedDates.length !== 2) return;

        const startDate = new Date(selectedDates[0]);
        const endDate = new Date(selectedDates[1]);
        endDate.setHours(23, 59, 59, 999)

        dateText.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}, ${endDate.getFullYear()}`;

        loadCards(startDate, endDate)
    }
});


function per(now, old) {
    if (old == 0 && now == 0) return 0;
    if (old == 0) return 100;

    let ans = ((now - old) / old) * 100;
    return ans;
}


document.querySelector('.all-date').addEventListener('click', () => {
    const today = new Date()
    const start = new Date(today)
    start.setFullYear(2000,1,1)
    loadCards(start, today)
    
    
    dateText.textContent = 'Select Date'
})


function loadCards(thisStart, thisEnd) {
    // console.log("======================");
    // console.log(thisStart, thisEnd);
    // console.log("======================");

    // console.log("This Start Date: " + thisStart);
    // console.log("This End Date: " + thisStart);


    const bills = getItemFromLocal("Billings");
    const details = getItemFromLocal("billings_details");
    const users = getItemFromLocal("Users");

    const rg = (thisEnd - thisStart) / 86400000;
    const lastEnd = new Date(thisStart);
    lastEnd.setDate(thisStart.getDate() - 1);
    lastEnd.setHours(23, 59, 59, 999);

    const lastStart = new Date(lastEnd);
    lastStart.setDate(lastEnd.getDate() - rg);



    // console.log("++++++++++++++++++");
    // console.log(lastStart);
    // console.log(lastEnd);


    // console.log("++++++++++++++++++");

    let totalAmt = 0;
    let thisAmt = 0;
    let lastAmt = 0;

    let totalCount = 0;
    let thisCount = 0;
    let lastCount = 0;

    let totalProfit = 0;
    let thisTotalPro = 0;
    let lastTotalPro = 0;

    details.forEach((d) => {
        if (d.status != "Completed") return;
        let date = new Date(d.created_at);

        (bills[d.billId] || []).forEach((item) => {
            if (date >= thisStart && date <= thisEnd) {
                totalCount += 1;
                totalAmt += Number(item.total)
                totalProfit += Number(item.profit)
            }
            if (date >= lastStart && date <= lastEnd) {
                lastCount++;
                lastAmt += Number(item.total);
                lastTotalPro += Number(item.profit);
            }
        })
    });

    let thisCus = 0;
    let lastCus = 0;

    users.forEach((u) => {
        let date = new Date(u.created_at);
        // console.log("This user date: " + date);


        if (date >= thisStart && date <= thisEnd) {
            // console.log("Valid : " + date + " " + thisStart + " " + thisEnd);

            thisCus++;
        }

        if (date >= lastStart && date <= lastEnd) {
            lastCus++;
        }
    });

    // console.log(thisCus, lastCus);


    const avg = totalCount == 0 ? 0 : totalAmt / totalCount;

    const thisAvg = thisCount == 0 ? 0 : thisAmt / thisCount;
    const lastAvg = lastCount == 0 ? 0 : lastAmt / lastCount;


    // console.log(thisAmt);
    // console.log(lastAmt);
    // console.log(thisCount);
    // console.log(lastCount);
    // console.log(thisTotalPro);
    // console.log(lastTotalPro);
    // console.log();

    const salesPer = per(thisAmt, lastAmt);
    const orderPer = per(thisCount, lastCount);
    const cusPer = per(thisCus, lastCus);
    const avgPer = per(thisAvg, lastAvg);
    const profitPer = per(thisTotalPro, lastTotalPro)

    setCard(0, totalAmt, salesPer, true);
    setCard(1, totalCount, orderPer, false);
    setCard(2, thisCus, cusPer, false);
    setCard(3, avg, avgPer, true);
    setCard(4, totalProfit, profitPer, true);

    document.querySelectorAll('.sale-data h2')[0].innerText = "₹ " + totalAmt
    document.querySelectorAll('.sale-data h2')[1].innerText = "₹ " + lastAmt

    const k = document.querySelector('.profit')
    if (salesPer >= 0) {
        k.innerText = `↗ ${salesPer}%`;
        // k.style.background = 'rgba(59, 213, 141, 0.4)';
        // k.style.color = 'white';
    }
    else {
        k.innerText = `↘ ${Math.abs(salesPer)}%`;
        k.style.background = 'rgba(225, 62, 62, 0.4)';
        k.style.color = 'red';
    }

}

function setCard(index, value, percent, rupee) {
    const cards = document.querySelectorAll(".card");
    const greenColor = "rgb(35, 235, 5)";
    const redColor = "rgb(255,80,80)";
    cards[index].querySelector(".price").innerText =
        rupee ? "₹ " + value.toFixed(2) : value;

    let span = cards[index].querySelector(".comp span");

    if (percent >= 0) {
        span.style.color = greenColor;
        span.innerHTML = "↑ " + percent.toFixed(1) + "%";
    } else {
        span.style.color = redColor;
        span.innerHTML = "↓ " + Math.abs(percent).toFixed(1) + "%";
    }
}


function loadTopItems(type = "All") {
    const bills = getItemFromLocal("Billings") || {};
    const details = getItemFromLocal("billings_details") || [];
    const inventory = getItemFromLocal("Inventory") || [];

    const [startDate, endDate] = getTopItemDateRange(type);

    let itemMap = {};

    details.forEach((d) => {
        if (d.status != "Completed") return;

        const billDate = new Date(d.created_at);

        if (startDate && endDate) {
            if (billDate < startDate || billDate > endDate) return;
        }

        (bills[d.billId] || []).forEach((item) => {
            let invItem = inventory.find((inv) => inv.itemCode == item.itemCode);

            if (!itemMap[item.itemCode]) {
                itemMap[item.itemCode] = {
                    itemName: item.itemName,
                    itemImage: item.itemImage || invItem?.itemImage || "",
                    qty: 0,
                    revenue: 0
                };
            }

            itemMap[item.itemCode].qty += Number(item.qty);
            itemMap[item.itemCode].revenue += Number(item.total);
        });
    });

    let topItems = Object.values(itemMap);

    topItems.sort((a, b) => b.qty - a.qty);

    topItems = topItems.slice(0, 5);

    let content = "";

    if (topItems.length == 0) {
        content = `
            <tr>
                <td colspan="5" style="text-align:center">No items found</td>
            </tr>
        `;
    }

    topItems.forEach((item, index) => {
        content += `
            <tr>
                <td style="border-bottom: 1px solid transparent">${index + 1}.</td>

                <td style="border-bottom: 1px solid transparent">
                    <img src="${item.itemImage}" alt="" />
                </td>

                <td>${item.itemName}</td>

                <td style="text-align: center">${item.qty}</td>

                <td>₹${item.revenue.toFixed(2)}</td>
            </tr>
        `;
    });

    document.getElementById("topItemsBody").innerHTML = content;
}

function getTopItemDateRange(type) {
    /*
     Instead of writing each function for each type, we can done by only one function.
     This is How... 
    */
    let startDate = new Date();
    let endDate = new Date();

    if (type === "This Week") {
        startDate.setDate(startDate.getDate() - startDate.getDay());
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
    }
    else if (type === "Last Week") {
        startDate.setDate(startDate.getDate() - startDate.getDay() - 7);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
    }
    else if (type === "This Month") {
        startDate.setDate(1);

        endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
    }
    else if (type === "This Year") {
        startDate.setMonth(0);
        startDate.setDate(1);

        endDate.setMonth(11);
        endDate.setDate(31);
    }
    else {
        return [null, null]; // all
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999); // i set the end of the day.

    return [startDate, endDate];
}


function loadRecentTransactions() {
    const bills = getItemFromLocal("Billings");
    const details = getItemFromLocal("billings_details");
    const box = document.querySelector(".transaction-list");

    let content = "";

    details.reverse().slice(0, 5).forEach((bill, i) => {
        let total = 0;

        (bills[bill.billId] || []).forEach((item) => {
            total += Number(item.total);
        });

        content += `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-icon">
                        <img src="/assets/icons/transaction-receipt-1.svg" width="25" height="25">
                    </div>

                    <div class="transaction-details">
                        <h4>#${bill.billId}</h4>
                        <p>${bill.created_at}</p>
                    </div>
                </div>

                <div class="transaction-right">
                    <h4>₹${total}</h4>
                    <span>${bill.status}</span>
                </div>
            </div>
        `;
    });

    box.innerHTML = content;
}

function loadLowStock() {
    const inventory = getItemFromLocal("Inventory");
    const box = document.querySelector(".stock-list");

    let content = "";

    inventory.forEach((item) => {
        let stock = Number(item.inStock);

        if (stock >= 1 && stock <= 10) {
            content += `
                <div class="stock-item">
                    <div class="stock-img coffee-bag">
                        <img src="${item.itemImage}" alt="">
                    </div>

                    <div>
                        <h4>${item.itemName}</h4>
                        <p>${item.unit}</p>
                        <span>Stock: ${stock}</span>
                    </div>
                </div>
            `;
        }
    });

    if (content == "") {
        box.style.justifyContent = 'center'
        box.style.alignItems = "center";
        box.style.height = `100%`
        content = `
            <div style="padding: 15px; text-align: center;">
                No low stock items
            </div>
        `;
    }

    box.innerHTML = content;
}

const today = new Date();
const day = today.getDay();

const thisStart = new Date(today)
thisStart.setDate(thisStart.getDate() - 7);
thisStart.setHours(0, 0, 0, 0);

const thisEnd = new Date(today)
thisEnd.setDate(thisStart.getDate() + 7);
thisEnd.setHours(23, 59, 59, 999);

loadLowStock();
loadRecentTransactions();
loadTopItems();
loadGraph('Daily')


dateText.textContent = `${formatDate(thisStart)} - ${formatDate(thisEnd)}, ${thisEnd.getFullYear()}`;
loadCards(thisStart, thisEnd);

const dropDown = document.querySelector(".drop-down");
const menu = document.querySelector(".dropdown-menu");
const selectedText = document.querySelector("#selectedGraphType");

dropDown.onclick = function () {
    menu.classList.toggle("show");
};

menu.querySelectorAll("div").forEach((item) => {
    item.addEventListener('click', () => {
        selectedText.innerText = item.innerText;
        menu.classList.remove("show");
        loadGraph(item.innerText);
    });

});


document.onclick = function (e) {
    if (!e.target.closest(".dropdown-box")) {
        menu.classList.remove("show");
    }
};


const topSellingDropDown = document.getElementById("topSellingDropDown");
const topSellingMenu = document.getElementById("topSellingMenu");
const topSellingText = document.getElementById("topSellingText");

topSellingDropDown.onclick = function () {
    topSellingMenu.classList.toggle("show");
};

topSellingMenu.querySelectorAll("div").forEach(function (item) {
    item.onclick = function () {
        topSellingText.innerText = item.innerText;
        topSellingMenu.classList.remove("show");

        loadTopItems(item.innerText);
    };
});

document.addEventListener("click", function (e) {
    if (!e.target.closest(".top-selling-filter")) {
        topSellingMenu.classList.remove("show");
    }
});