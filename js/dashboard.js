// ==========================================
// VENTALUX DASHBOARD V4
// Ringkasan Monitoring
// ==========================================

// DATA DUMMY
// Nanti diganti Firebase



// ==========================================
// UPDATE CARD
// ==========================================




// ==========================================
// HISTORY DATA
// ==========================================

const history = {

    rpm: [],

    wind: [],

    power: [],

    battery: []

};

const labels = [];


// ==========================================
// CHART
// ==========================================

const ctx = document.getElementById("monitorChart").getContext("2d");

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

            tension:.4

        }]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        plugins:{

            legend:{

                display:true

            }

        }

    }

});


// ==========================================
// TAMBAH DATA
// ==========================================



// ==========================================
// DROPDOWN
// ==========================================

const select = document.getElementById("chartSelect");

select.addEventListener("change",function(){

    const pilih = this.value;

    chart.data.datasets[0].data = history[pilih];

    switch(pilih){

        case "rpm":

            chart.data.datasets[0].label = "RPM Turbin";

            break;

        case "wind":

            chart.data.datasets[0].label = "Kecepatan Angin";

            break;

        case "power":

            chart.data.datasets[0].label = "Daya Generator";

            break;

        case "battery":

            chart.data.datasets[0].label = "Status Baterai";

            break;

    }

    chart.update();

});


// ==========================================
// SIMULASI REALTIME
// ==========================================
// ======================================
// FIREBASE -> GRAFIK
// ======================================

window.addDataFirebase = function(data){

    const waktu = new Date().toLocaleTimeString("id-ID");

    labels.push(waktu);

    history.rpm.push(data.rpm);
    history.wind.push(data.wind);
    history.power.push(data.power);
    history.battery.push(data.battery);

    if(labels.length>8){

        labels.shift();

        history.rpm.shift();
        history.wind.shift();
        history.power.shift();
        history.battery.shift();

    }

    const pilih=document.getElementById("chartSelect").value;

    chart.data.labels=labels;

    chart.data.datasets[0].data=history[pilih];

    switch(pilih){

        case "rpm":

            chart.data.datasets[0].label="RPM Turbin";

            break;

        case "wind":

            chart.data.datasets[0].label="Kecepatan Angin";

            break;

        case "power":

            chart.data.datasets[0].label="Daya Generator";

            break;

        case "battery":

            chart.data.datasets[0].label="Status Baterai";

            break;

    }

    chart.update();

}