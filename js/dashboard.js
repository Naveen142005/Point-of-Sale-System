const canva = document.getElementById("sales-graph");

new Chart(canva, {
    type: "line",

    data: {
        labels: ["15 May", "16 May", "17 May", "18 May", "19 May", "20 May", "21 May"],

        datasets: [
            {
                data: [6400, 5700, 9000, 3800, 6000, 7600, 9000],
                borderColor: "#4b35ff",
                borderWidth: 3,
                tension: 0.34,
                pointRadius: 0,
                fill: false
            },
            {
                data: [5800, 4200, 7000, 2200, 5400, 5600, 7100],
                borderColor: "#a798ff",
                borderWidth: 3,
                borderDash: [4, 4],
                tension: 0.45,
                pointRadius: 0,
                fill: false
            }
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            x: {
                grid: {
                    display: false
                },

                ticks: {
                    color: "#8d87a8",
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    font: {
                        size: 9,
                        weight: "700"
                    },
                    padding: 0
                }
            },

            y: {
                min: 0,
                max: 10000,

                ticks: {
                    stepSize: 2000,
                    color: "#8d87a8",
                    font: {
                        size: 9,
                        weight: "700"
                    },
                    padding: 8,
                    callback: function (val) {
                        return val === 0 ? "0" : val / 1000 + "K";
                    }
                },

                grid: {
                    color: "#eeeaf7",
                    drawTicks: false
                },

                border: {
                    display: false
                }
            }
        }
    }
});


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


function loadTopItems() {
    const bills = getItemFromLocal("Billings");
    const details = getItemFromLocal("billings_details");
    const inventory = getItemFromLocal("Inventory");

    let itemMap = {};

    details.forEach((d) => {
        if (d.status != "Completed") return;

        (bills[d.billId] || []).forEach((item) => {
            let invItem = inventory.find((inv) => {
                return inv.itemCode == item.itemCode;
            });

            if (!itemMap[item.itemCode]) {
                itemMap[item.itemCode] = {
                    itemName: item.itemName,
                    itemImage: item.itemImage || invItem.itemImage,
                    qty: 0,
                    revenue: 0
                };
            }

            itemMap[item.itemCode].qty += Number(item.qty);
            itemMap[item.itemCode].revenue += Number(item.total);
        });
    });

    let topItems = Object.values(itemMap);

    topItems.sort((a, b) => {
        return b.qty - a.qty;
    });

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

dateText.textContent = `${formatDate(thisStart)} - ${formatDate(thisEnd)}, ${thisEnd.getFullYear()}`;
loadCards(thisStart, thisEnd);