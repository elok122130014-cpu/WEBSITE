// ==========================================
// VENTALUX DASHBOARD
// ==========================================

// DATA UNTUK GRAFIK
const history = {
    rpm: [],
    wind: [],
    power: [],
    battery: []
};

const labels = [];


// ==========================================
// UPDATE CARD DARI FIREBASE
// ==========================================

window.updateMonitoring = function(data) {

    const rpm = document.getElementById("rpm");
    const wind = document.getElementById("wind");
    const power = document.getElementById("power");
    const battery = document.getElementById("battery");
    const batteryFill = document.getElementById("batteryFill");
    const batteryStatus = document.getElementById("batteryStatus");


    if (rpm) {
        rpm.textContent = Number(data.rpm ?? 0).toFixed(0) + " RPM";
    }

    if (wind) {
        wind.textContent = Number(data.wind ?? 0).toFixed(2) + " m/s";
    }

    if (power) {
        power.textContent = Number(data.power_gen ?? 0).toFixed(0) + " mW";
    }

    if (battery) {
        battery.textContent = Number(data.battery ?? 0).toFixed(0) + " %";
    }

    if (batteryFill) {
        batteryFill.style.width =
            Number(data.battery ?? 0) + "%";
    }

    if (batteryStatus) {
        batteryStatus.textContent =
            data.batteryStatus ?? "--";
    }


    // ======================================
    // SIMPAN DATA UNTUK GRAFIK
    // ======================================

    const waktu = new Date().toLocaleTimeString("id-ID");

    labels.push(waktu);
    history.rpm.push(Number(data.rpm ?? 0));
    history.wind.push(Number(data.wind ?? 0));
    history.power.push(Number(data.power_gen ?? 0));
    history.battery.push(Number(data.battery ?? 0));


    if (labels.length > 8) {
        labels.shift();
        history.rpm.shift();
        history.wind.shift();
        history.power.shift();
        history.battery.shift();
    }


    // ======================================
    // UPDATE GRAFIK
    // ======================================

    if (typeof chart !== "undefined") {

        const pilih =
            document.getElementById("chartSelect").value;

        chart.data.labels = labels;
        chart.data.datasets[0].data =
            history[pilih];

        chart.update();
    }
};


// ==========================================
// GRAFIK
// ==========================================

const canvas = document.getElementById("monitorChart");

let chart = null;

if (canvas) {

    const ctx = canvas.getContext("2d");

    chart = new Chart(ctx, {

        type: "line",

        data: {
            labels: labels,

            datasets: [{
                label: "RPM Turbin",
                data: history.rpm,
                fill: true,
                borderWidth: 3,
                tension: 0.4
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}


// ==========================================
// DROPDOWN GRAFIK
// ==========================================

const select =
    document.getElementById("chartSelect");

if (select) {

    select.addEventListener("change", function() {

        const pilih = this.value;

        chart.data.datasets[0].data =
            history[pilih];

        switch (pilih) {

            case "rpm":
                chart.data.datasets[0].label =
                    "RPM Turbin";
                break;

            case "wind":
                chart.data.datasets[0].label =
                    "Kecepatan Angin";
                break;

            case "power":
                chart.data.datasets[0].label =
                    "Daya Generator";
                break;

            case "battery":
                chart.data.datasets[0].label =
                    "Status Baterai";
                break;
        }

        chart.update();
    });
}