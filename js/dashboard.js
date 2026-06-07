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
    console.log(isMobile);
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


function per(now, old) {
    if (old == 0 && now == 0) return 0;
    if (old == 0) return 100;

    let ans = ((now - old) / old) * 100;
    return ans;
}

function loadCards() {
    let cards = document.querySelectorAll(".card");

    let bills = getItemFromLocal("Billings");
    let details = getItemFromLocal("billings_details");
    let users = getItemFromLocal("Users");

    let today = new Date();
    let day = today.getDay();

    let thisStart = new Date(today);
    thisStart.setDate(today.getDate() - day);
    thisStart.setHours(0, 0, 0, 0);

    let thisEnd = new Date(thisStart);
    thisEnd.setDate(thisStart.getDate() + 6);
    thisEnd.setHours(23, 59, 59, 999);

    let lastStart = new Date(thisStart);
    lastStart.setDate(thisStart.getDate() - 7);

    let lastEnd = new Date(lastStart);
    lastEnd.setDate(lastStart.getDate() + 6);
    lastEnd.setHours(23, 59, 59, 999);

    let totalAmt = 0;
    let thisAmt = 0;
    let lastAmt = 0;

    let totalCount = 0;
    let thisCount = 0;
    let lastCount = 0;

    details.forEach((d) => {
        if (d.status != "Completed") return;

        totalCount++;

        let amt = 0;

        (bills[d.billId] || []).forEach((item) => {
            amt += Number(item.total);
        });

        totalAmt += amt;

        let date = new Date(d.created_at);

        if (date >= thisStart && date <= thisEnd) {
            thisCount++;
            thisAmt += amt;
        }

        if (date >= lastStart && date <= lastEnd) {
            lastCount++;
            lastAmt += amt;
        }
    });

    let thisCus = 0;
    let lastCus = 0;

    users.forEach((u) => {
        let date = new Date(u.created_at);

        if (date >= thisStart && date <= thisEnd) {
            thisCus++;
        }

        if (date >= lastStart && date <= lastEnd) {
            lastCus++;
        }
    });

    let avg = totalCount == 0 ? 0 : totalAmt / totalCount;

    let thisAvg = thisCount == 0 ? 0 : thisAmt / thisCount;
    let lastAvg = lastCount == 0 ? 0 : lastAmt / lastCount;

    let salesPer = per(thisAmt, lastAmt);
    let orderPer = per(thisCount, lastCount);
    let cusPer = per(thisCus, lastCus);
    let avgPer = per(thisAvg, lastAvg);

    const greenColor = "rgb(35, 235, 5)";
    const redColor = "rgb(255,80,80)";
    cards[0].querySelector(".price").innerText = "₹ " + totalAmt.toFixed(2);

    if (salesPer >= 0) {
        cards[0].querySelector(".comp span").style.color = greenColor;
        cards[0].querySelector(".comp span").innerHTML = "↑ " + salesPer.toFixed(1) + "%";
    } else {
        cards[0].querySelector(".comp span").style.color = redColor;
        cards[0].querySelector(".comp span").innerHTML = "↓ " + Math.abs(salesPer).toFixed(1) + "%";
    }

    cards[1].querySelector(".price").innerText = totalCount;

    if (orderPer >= 0) {
        cards[1].querySelector(".comp span").style.color = greenColor;
        cards[1].querySelector(".comp span").innerHTML = "↑ " + orderPer.toFixed(1) + "%";
    } else {
        cards[1].querySelector(".comp span").style.color = redColor;
        cards[1].querySelector(".comp span").innerHTML = "↓ " + Math.abs(orderPer).toFixed(1) + "%";
    }

    cards[2].querySelector(".price").innerText = users.length;

    if (cusPer >= 0) {
        cards[2].querySelector(".comp span").style.color = greenColor;
        cards[2].querySelector(".comp span").innerHTML = "↑ " + cusPer.toFixed(1) + "%";
    } else {
        cards[2].querySelector(".comp span").style.color = redColor;
        cards[2].querySelector(".comp span").innerHTML = "↓ " + Math.abs(cusPer).toFixed(1) + "%";
    }

    cards[3].querySelector(".price").innerText = "₹ " + avg.toFixed(2);

    if (avgPer >= 0) {
        cards[3].querySelector(".comp span").style.color = greenColor;
        cards[3].querySelector(".comp span").innerHTML = "↑ " + avgPer.toFixed(1) + "%";
    } else {
        cards[3].querySelector(".comp span").style.color = redColor;
        cards[3].querySelector(".comp span").innerHTML = "↓ " + Math.abs(avgPer).toFixed(1) + "%";
    }

    cards[4].querySelector(".price").innerText = "₹ 0.00";
    cards[4].querySelector(".comp span").style.color = greenColor;
    cards[4].querySelector(".comp span").innerHTML = "↑ 0%";
}


function loadTopItems() {
    let bills = getItemFromLocal("Billings");
    let details = getItemFromLocal("billings_details");
    let inventory = getItemFromLocal("Inventory");

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
    let bills = getItemFromLocal("Billings");
    let details = getItemFromLocal("billings_details");
    let box = document.querySelector(".transaction-list");

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
    let inventory = getItemFromLocal("Inventory");
    let box = document.querySelector(".stock-list");

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
        box.style.justifyContent ='center'
        content = `
            <div style="padding: 15px; text-align: center;">
                No low stock items
            </div>
        `;
    }

    box.innerHTML = content;
}

loadLowStock();
loadRecentTransactions();
loadTopItems();
loadCards();