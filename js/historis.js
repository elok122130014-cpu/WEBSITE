import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    set,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ========================================
// FIREBASE
// ========================================

const firebaseConfig = {

    apiKey: "AIzaSyCo1B0mW8h8HcTIfVZcFyAzVdn0EnYh92g",

    authDomain: "website0-2291b.firebaseapp.com",

    databaseURL:
        "https://website0-2291b-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "website0-2291b",

    storageBucket:
        "website0-2291b.firebasestorage.app",

    messagingSenderId: "185379743094",

    appId:
        "1:185379743094:web:dbefea90b74b7924900657"

};


const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


// ========================================
// ELEMENT HTML
// ========================================

const tbody =
    document.getElementById("historyBody");

const totalRecord =
    document.getElementById("totalRecord");


// ========================================
// DATA
// ========================================

let semuaData = [];
let dataFilter = [];
let historyChart = null;

const MAX_HISTORY = 720;
// ========================================
// ARSIP HISTORY KE MEMORI
// ========================================

async function arsipKeMemoriHistoris() {

    try {

        // Ambil data memori yang sudah ada
        const memoriRef = ref(db, "memoriHistoris");
        const snapshotMemori = await get(memoriRef);

        const memori = snapshotMemori.exists()
            ? snapshotMemori.val()
            : {};


        // Cari slot memori yang masih kosong
        let slotKosong = null;

        for (let i = 1; i <= 3; i++) {

            if (!memori[`memori${i}`]) {

                slotKosong = `memori${i}`;
                break;

            }

        }


        // Kalau semua slot penuh
        if (!slotKosong) {

            alert(
                "Memori Historis sudah penuh. " +
                "Silakan hapus salah satu memori terlebih dahulu."
            );

            return false;

        }


        // ========================================
        // URUTKAN DARI DATA TERLAMA
        // ========================================

        const dataUrutLama = [...semuaData].sort((a, b) => {

            const A = new Date(
                `${a.tanggal} ${a.jam.replace(/-/g, ":")}`
            );

            const B = new Date(
                `${b.tanggal} ${b.jam.replace(/-/g, ":")}`
            );

            return A - B;

        });


        // ========================================
        // AMBIL TEPAT 720 DATA
        // ========================================

        const dataArsip =
            dataUrutLama.slice(0, MAX_HISTORY);


        // ========================================
        // SISANYA
        // ========================================

        const dataSisa =
            dataUrutLama.slice(MAX_HISTORY);


        console.log(
            "Data masuk memori:",
            dataArsip.length
        );

        console.log(
            "Data tersisa di history:",
            dataSisa.length
        );


        // ========================================
        // SIMPAN KE MEMORI
        // ========================================

        await set(
            ref(db, `memoriHistoris/${slotKosong}`),
            {
                waktuDisimpan:
                    new Date().toISOString(),

                totalData:
                    dataArsip.length,

                data:
                    dataArsip
            }
        );


        // ========================================
        // HAPUS HISTORY LAMA
        // ========================================

        await remove(
            ref(db, "history")
        );


        // ========================================
        // KEMBALIKAN DATA SISA
        // ========================================

        for (const item of dataSisa) {

            await set(
                ref(
                    db,
                    `history/${item.tanggal}/${item.jam}`
                ),
                {
                    rpm:
                        item.rpm ?? 0,

                    wind:
                        item.wind ?? 0,

                    temperature:
                        item.temperature ?? 0,

                    voltage:
                        item.voltage ?? 0,

                    current:
                        item.current ?? 0,

                    power:
                        item.power ?? 0,

                    battery:
                        item.battery ?? 0,

                    batteryStatus:
                        item.batteryStatus ?? ""
                }
            );

        }


        alert(
            `${dataArsip.length} data berhasil ` +
            `disimpan ke ${slotKosong}.`
        );


        return true;


    } catch (error) {

        console.error(
            "Gagal menyimpan Memori Historis:",
            error
        );

        alert(
            "Gagal menyimpan data ke Memori Historis."
        );

        return false;

    }

}
// ========================================
// LOAD HISTORY
// ========================================

async function loadHistory() {

    try {

        const historyRef =
            ref(db, "history");

        const snapshot =
            await get(historyRef);


        semuaData = [];


        // Jika tidak ada data
        if (!snapshot.exists()) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="10">
                        Tidak ada data.
                    </td>
                </tr>
            `;

            totalRecord.textContent =
                "0 Record";

            return;
        }


        const history =
            snapshot.val();


        // ========================================
        // BACA TANGGAL
        // ========================================

        Object.keys(history).forEach(tanggal => {


            // Pastikan hanya membaca
            // node tanggal
            if (
                !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)
            ) {
                return;
            }


            // ========================================
            // BACA JAM
            // ========================================

            Object.keys(history[tanggal]).forEach(jam => {


                const data =
                    history[tanggal][jam];


                semuaData.push({

                    tanggal: tanggal,

                    jam: jam,

                    ...data

                });

            });

        });


        // ========================================
        // URUTKAN DATA
        // TERBARU DI ATAS
        // ========================================

        semuaData.sort((a, b) => {

            const A =
                new Date(
                    `${a.tanggal} ${a.jam.replace(/-/g, ":")}`
                );

            const B =
                new Date(
                    `${b.tanggal} ${b.jam.replace(/-/g, ":")}`
                );

            return B - A;

        });


        // ========================================
        // TAMPILKAN
        // ========================================

        // ========================================
// CEK BATAS 720 DATA
// ========================================

if (semuaData.length >= MAX_HISTORY) {

    console.log(
        "Data sudah mencapai 720 record."
    );

    const berhasil =
        await arsipKeMemoriHistoris();

    if (berhasil) {

        // Baca ulang history
        await loadHistory();

        return;

    }

}


// ========================================
// TAMPILKAN DATA
// ========================================

tampilkanData(semuaData);

dataFilter = [...semuaData];

updateChart(dataFilter);

console.log(
    "Data historis berhasil dibaca:",
    semuaData.length
);

        console.log(
            "Data historis berhasil dibaca:",
            semuaData.length
        );


    } catch (error) {

        console.error(
            "Gagal membaca data historis:",
            error
        );

        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    Gagal membaca data historis.
                </td>
            </tr>
        `;

    }

}


// ========================================
// TAMPILKAN DATA
// ========================================

function tampilkanData(data) {

    tbody.innerHTML = "";


    if (data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    Tidak ada data.
                </td>
            </tr>
        `;

        totalRecord.textContent =
            "0 Record";

        return;

    }


    data.forEach((item, index) => {

        tbody.innerHTML += `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${item.tanggal ?? "-"}
                </td>

                <td>
                    ${
                        item.jam
                        ? item.jam.replace(/-/g, ":")
                        : "-"
                    }
                </td>

                <td>
                    ${item.rpm ?? "-"}
                </td>

                <td>
                    ${item.wind ?? "-"} m/s
                </td>

                <td>
                    ${
                        item.temperature != null
                        ? Number(item.temperature).toFixed(1)
                        : "-"
                    } °C
                </td>

                <td>
                    ${
                        item.voltage != null
                        ? Number(item.voltage).toFixed(2)
                        : "-"
                    } V
                </td>

                <td>
                    ${
                        item.current != null
                        ? Number(item.current).toFixed(0)
                        : "-"
                    } mA
                </td>

                <td>
                    ${
                        item.power != null
                        ? Number(item.power).toFixed(0)
                        : "-"
                    } mW
                </td>

                <td>
                    ${item.battery ?? "-"}%
                </td>

            </tr>

        `;

    });


    totalRecord.textContent =
        `${data.length} Record`;

}


// ========================================
// JALANKAN
// ========================================

loadHistory();


// ========================================
// REFRESH SETIAP 2 MENIT
// ========================================

setInterval(
    loadHistory,
    120000
);
// ========================================
// GRAFIK HISTORIS
// ========================================

function updateChart(data) {

    const ctx = document.getElementById("historyChart");

    if (!ctx) {
        console.log("Canvas historyChart tidak ditemukan");
        return;
    }

    // Data grafik dari waktu terlama ke terbaru
    const dataGrafik = [...data].reverse();

    const labels = dataGrafik.map(item => {
        return `${item.tanggal} ${item.jam.replace(/-/g, ":")}`;
    });


    // Hapus grafik sebelumnya
    if (historyChart) {
        historyChart.destroy();
    }


    // Buat grafik baru
    historyChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "RPM",

                    data: dataGrafik.map(item =>
                        Number(item.rpm ?? 0)
                    ),

                    borderWidth: 2,

                    tension: 0.3,

                    yAxisID: "yRPM"
                },


                {
                    label: "Kecepatan Angin (m/s)",

                    data: dataGrafik.map(item =>
                        Number(item.wind ?? 0)
                    ),

                    borderWidth: 2,

                    tension: 0.3,

                    yAxisID: "yAngin"
                },


                {
                    label: "Suhu (°C)",

                    data: dataGrafik.map(item =>
                        Number(item.temperature ?? 0)
                    ),

                    borderWidth: 2,

                    tension: 0.3,

                    yAxisID: "ySuhu"
                },


                {
                    label: "Tegangan (V)",

                    data: dataGrafik.map(item =>
                        Number(item.voltage ?? 0)
                    ),

                    borderWidth: 2,

                    tension: 0.3,

                    yAxisID: "yTegangan"
                },


                {
                    label: "Arus (mA)",

                    data: dataGrafik.map(item =>
                        Number(item.current ?? 0)
                    ),

                    borderWidth: 2,

                    tension: 0.3,

                    yAxisID: "yArus"
                },


                {
                    label: "Daya (mW)",

                    data: dataGrafik.map(item =>
                        Number(item.power ?? 0)
                    ),

                    borderWidth: 2,

                    tension: 0.3,

                    yAxisID: "yDaya"
                },


                {
                    label: "Baterai (%)",

                    data: dataGrafik.map(item =>
                        Number(item.battery ?? 0)
                    ),

                    borderWidth: 2,

                    tension: 0.3,

                    yAxisID: "yBaterai"
                }

            ]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            interaction: {
                mode: "index",
                intersect: false
            },


            plugins: {

                legend: {
                    position: "top"
                },

                tooltip: {
                    mode: "index",
                    intersect: false
                }

            },


            scales: {

                x: {

                    title: {
                        display: true,
                        text: "Waktu"
                    },

                    ticks: {
                        maxTicksLimit: 12
                    }

                },


                yRPM: {

                    type: "linear",

                    position: "left",

                    title: {
                        display: true,
                        text: "RPM"
                    }

                },


                yAngin: {

                    type: "linear",

                    display: false,

                    position: "right"

                },


                ySuhu: {

                    type: "linear",

                    display: false,

                    position: "right"

                },


                yTegangan: {

                    type: "linear",

                    display: false,

                    position: "right"

                },


                yArus: {

                    type: "linear",

                    display: false,

                    position: "right"

                },


                yDaya: {

                    type: "linear",

                    display: false,

                    position: "right"

                },


                yBaterai: {

                    type: "linear",

                    display: false,

                    position: "right",

                    min: 0,

                    max: 100

                }

            }

        }

    });

}