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