// ======================================
// VENTALUX MONITORING V2
// FIREBASE VERSION
// ======================================

// ===============================
// HISTORY
// ===============================

const history = {

    // =========================
    // TURBIN
    // =========================
    rpm: [],
    wind: [],
    temperature: [],

    // =========================
    // BATERAI
    // =========================
    voltage: [],
    current: [],
    power: [],

    // =========================
    // GENERATOR
    // =========================
    generatorVoltage: [],
    generatorCurrent: [],
    generatorPower: [],

    // =========================
    // STATUS BATERAI
    // =========================
    battery: []

};

const labels = [];

// ===============================
// CHART
// ===============================

const ctx = document
.getElementById("monitorChart")
.getContext("2d");

const chart = new Chart(ctx,{

    type:"line",

    data:{

        labels:labels,

        datasets:[{

            label:"RPM Turbin",

            data:history.rpm,

            borderColor:"#0f766e",

            backgroundColor:"rgba(15,118,110,.15)",

            fill:true,

            borderWidth:3,

            tension:.35

        }]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        animation:false,

        plugins:{

            legend:{

                display:true

            }

        },

        scales:{

            y:{

                beginAtZero:false

            }

        }

    }

});


// ===============================
// DROPDOWN
// ===============================

const select = document.getElementById("chartSelect");

select.addEventListener("change",()=>{

    const pilih = select.value;

    chart.data.datasets[0].data = history[pilih];

    chart.data.datasets[0].label =
        select.options[
            select.selectedIndex
        ].text;

    chart.update();

});


// ===============================
// LOG TABLE
// ===============================

function addLog(parameter,value){

    const table=document.getElementById("logTable");

    const row=table.insertRow(0);

    row.insertCell(0).textContent=
    new Date().toLocaleTimeString("id-ID");

    row.insertCell(1).textContent=
    parameter;

    row.insertCell(2).textContent=
    value;

    while(table.rows.length>10){

        table.deleteRow(10);

    }

}
// ===============================
// UPDATE DARI FIREBASE
// ===============================

window.updateMonitoring = function(data){

    // ===========================
    // UPDATE CARD
    // ===========================

    document.getElementById("rpm").textContent =
    data.rpm + " RPM";

    document.getElementById("wind").textContent =
    data.wind + " m/s";

    document.getElementById("temperature").textContent =
    data.temperature + " °C";

    document.getElementById("voltage").textContent =
    data.voltage_bat + " V";

    document.getElementById("current").textContent =
    data.current_bat + " mA";

    document.getElementById("power").textContent =
    data.power_bat + " mW";

    document.getElementById("generatorVoltage").textContent =
    data.voltage_gen + " V";

    document.getElementById("generatorCurrent").textContent =
    data.current_gen + " mA";

    document.getElementById("generatorPower").textContent =
    data.power_gen + " mW";
    
    document.getElementById("battery").textContent =
    data.battery + " %";

    document.getElementById("batteryFill").style.width =
    data.battery + "%";

    document.getElementById("batteryStatus").textContent =
    data.batteryStatus;

// ===========================
// LAST UPDATE & DELAY
// ===========================

const waktuTerima = Date.now();

// Format waktu sampai milidetik
function formatWaktuMillis(timestamp) {
    const d = new Date(timestamp);

    return d.toLocaleTimeString("id-ID", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }) + "." + String(d.getMilliseconds()).padStart(3, "0");
}

// Tampilkan waktu terakhir pada website
document.getElementById("lastUpdate").textContent =
    formatWaktuMillis(waktuTerima);

// ===========================
// HITUNG DELAY
// ===========================

const timestampKirim = Number(data.timestampKirim || 0);

if (timestampKirim > 0) {

    const delay = waktuTerima - timestampKirim;

   console.log("================================");
console.log("Waktu Kirim  :", formatWaktuMillis(timestampKirim));
console.log("Waktu Terima :", formatWaktuMillis(waktuTerima));
console.log("================================");
}

    // ===========================
    // HISTORY ARRAY
    // ===========================

    const jam = new Date().toLocaleTimeString("id-ID");

    labels.push(jam);

   // ===========================
// HISTORY TURBIN
// ===========================

history.rpm.push(Number(data.rpm));

history.wind.push(Number(data.wind));

history.temperature.push(Number(data.temperature));


// ===========================
// HISTORY BATERAI
// ===========================

history.voltage.push(
    data.voltage_bat !== undefined
        ? Number(data.voltage_bat)
        : null
);

history.current.push(
    data.current_bat !== undefined
        ? Number(data.current_bat)
        : null
);

history.power.push(
    data.power_bat !== undefined
        ? Number(data.power_bat)
        : null
);


// ===========================
// HISTORY GENERATOR
// ===========================

history.generatorVoltage.push(
    data.voltage_gen !== undefined
        ? Number(data.voltage_gen)
        : null
);

history.generatorCurrent.push(
    data.current_gen !== undefined
        ? Number(data.current_gen)
        : null
);

history.generatorPower.push(
    data.power_gen !== undefined
        ? Number(data.power_gen)
        : null
);


// ===========================
// STATUS BATERAI
// ===========================

history.battery.push(Number(data.battery));

    // Maksimal 15 data

    if(labels.length>15){

        labels.shift();

        Object.keys(history).forEach(key=>{

            history[key].shift();

        });

    }

    // ===========================
    // UPDATE GRAFIK
    // ===========================

    const pilih = select.value;

    chart.data.labels = labels;

    chart.data.datasets[0].label =
    select.options[
    select.selectedIndex
    ].text;

    chart.data.datasets[0].data =
    history[pilih];

    chart.update();

    // ===========================
    // LOG
    // ===========================

    addLog(
        select.options[
        select.selectedIndex
        ].text,

        history[pilih][history[pilih].length-1]
    );

}
// ======================================
// INITIAL CHART
// ======================================

chart.data.labels = labels;

chart.data.datasets[0].data = history.rpm;

chart.update();

// ======================================
// STATUS BATTERY
// ======================================

function updateBatteryUI(level){

    const fill = document.getElementById("batteryFill");
    const status = document.getElementById("batteryStatus");

    fill.style.width = level + "%";

    if(level >= 70){

        fill.style.background = "#22c55e";
        status.textContent = "Charging";
        status.style.color = "#16a34a";

    }

    else if(level >= 30){

        fill.style.background = "#f59e0b";
        status.textContent = "Medium";
        status.style.color = "#d97706";

    }

    else{

        fill.style.background = "#ef4444";
        status.textContent = "Low Battery";
        status.style.color = "#dc2626";

    }

}

// ======================================
// OVERRIDE UPDATE MONITORING
// ======================================

const oldUpdateMonitoring = window.updateMonitoring;

window.updateMonitoring = function(data){

    oldUpdateMonitoring(data);

    updateBatteryUI(Number(data.battery));

}