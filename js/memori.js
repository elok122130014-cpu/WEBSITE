import { db } from "./firebase.js";
import {
    ref,
    get,
    set,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ========================================
// VARIABEL UTAMA
// ========================================

let memoryChart = null;
let dataMemoriAktif = [];
let namaMemoriAktif = "";


// ========================================
// AMBIL DATA MEMORI DARI FIREBASE
// ========================================

async function loadMemori() {

    try {

        const snapshot = await get(
            ref(db, "memoriHistoris")
        );

        const semuaMemori = snapshot.exists()
            ? snapshot.val()
            : {};


        for (let i = 1; i <= 3; i++) {

            const namaMemori = `memori${i}`;
            const memori = semuaMemori[namaMemori];


            // Elemen HTML
            const status = document.getElementById(
                `statusMemori${i}`
            );

            const total = document.getElementById(
                `totalMemori${i}`
            );

            const waktu = document.getElementById(
                `waktuMemori${i}`
            );

            const btnLihat = document.getElementById(
                `lihatMemori${i}`
            );

            const btnDownload = document.getElementById(
                `downloadMemori${i}`
            );

            const btnHapus = document.getElementById(
                `hapusMemori${i}`
            );


            // ========================================
            // JIKA MEMORI TERISI
            // ========================================

            if (memori && memori.data) {

                const jumlahData =
                    memori.totalData ||
                    Object.keys(memori.data).length;


                status.textContent = "Tersimpan";

                status.classList.remove("empty");
                status.classList.add("filled");


                total.textContent =
                    `${jumlahData} Data`;


                // Format waktu penyimpanan
                if (memori.waktuDisimpan) {

                    const tanggal =
                        new Date(memori.waktuDisimpan);

                    waktu.textContent =
                        tanggal.toLocaleString("id-ID");

                } else {

                    waktu.textContent =
                        "Waktu tidak tersedia";

                }


                // Aktifkan tombol
                btnLihat.disabled = false;
                btnDownload.disabled = false;
                btnHapus.disabled = false;


                // Tombol LIHAT
                btnLihat.onclick = () => {

                    tampilkanMemori(
                        namaMemori,
                        memori
                    );

                };


                // Tombol DOWNLOAD
                btnDownload.onclick = () => {

                    downloadMemori(
                        namaMemori,
                        memori
                    );

                };


                // Tombol HAPUS
                btnHapus.onclick = () => {

                    hapusMemori(namaMemori);

                };

            }


            // ========================================
            // JIKA MEMORI KOSONG
            // ========================================

            else {

                status.textContent = "Kosong";

                status.classList.remove("filled");
                status.classList.add("empty");


                total.textContent = "0 Data";

                waktu.textContent =
                    "Belum ada arsip";


                btnLihat.disabled = true;
                btnDownload.disabled = true;
                btnHapus.disabled = true;

            }

        }

    } catch (error) {

        console.error(
            "Gagal memuat Memori Historis:",
            error
        );

    }

}


// ========================================
// TAMPILKAN DATA MEMORI
// ========================================

function tampilkanMemori(namaMemori, memori) {

    const detailSection =
        document.getElementById(
            "memoryDetailSection"
        );

    const judul =
        document.getElementById(
            "judulDetailMemori"
        );

    const info =
        document.getElementById(
            "infoDetailMemori"
        );


    // Ubah object Firebase menjadi array
    dataMemoriAktif = Array.isArray(memori.data)
        ? memori.data
        : Object.values(memori.data);

    namaMemoriAktif = namaMemori;


    // Urutkan dari lama ke terbaru
    dataMemoriAktif.sort((a, b) => {

        const waktuA =
            new Date(
                `${a.tanggal} ${a.jam.replace(/-/g, ":")}`
            );

        const waktuB =
            new Date(
                `${b.tanggal} ${b.jam.replace(/-/g, ":")}`
            );

        return waktuA - waktuB;

    });


    // Judul detail
    judul.textContent =
        `Detail ${namaMemori.replace("memori", "Memori Historis ")}`;

    info.textContent =
        `${dataMemoriAktif.length} data hasil arsip monitoring.`;


    // Tampilkan section
    detailSection.classList.add("show");


    // Tampilkan tabel
    tampilkanTabelMemori(dataMemoriAktif);


    // Tampilkan grafik
    tampilkanGrafikMemori(dataMemoriAktif);


    // Scroll ke detail
    detailSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ========================================
// TAMPILKAN TABEL
// ========================================

function tampilkanTabelMemori(data) {

    const tbody =
        document.getElementById(
            "memoryTableBody"
        );

    tbody.innerHTML = "";


    data.forEach((item, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.tanggal || "-"}</td>
            <td>${item.jam ? item.jam.replace(/-/g, ":") : "-"}</td>
            <td>${item.rpm ?? "-"}</td>
            <td>${item.wind ?? "-"}</td>
            <td>${item.temperature ?? "-"}</td>
            <td>${item.voltage ?? "-"}</td>
            <td>${item.current ?? "-"}</td>
            <td>${item.power ?? "-"}</td>
            <td>${item.battery ?? "-"}</td>
        `;

        tbody.appendChild(row);

    });

}


// ========================================
// TAMPILKAN GRAFIK
// ========================================

function tampilkanGrafikMemori(data) {

    const canvas =
        document.getElementById("memoryChart");

    if (!canvas) return;


    // Hapus grafik sebelumnya
    if (memoryChart) {
        memoryChart.destroy();
    }


    const labels = data.map(item => {

        const tanggal = item.tanggal || "";
        const jam = item.jam
            ? item.jam.replace(/-/g, ":")
            : "";

        return `${tanggal} ${jam}`;

    });


    memoryChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "RPM",
                    data: data.map(item =>
                        Number(item.rpm ?? 0)
                    ),
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: "yRPM"
                },

                {
                    label: "Kecepatan Angin (m/s)",
                    data: data.map(item =>
                        Number(item.wind ?? 0)
                    ),
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: "yAngin"
                },

                {
                    label: "Suhu (°C)",
                    data: data.map(item =>
                        Number(item.temperature ?? 0)
                    ),
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: "ySuhu"
                },

                {
                    label: "Tegangan (V)",
                    data: data.map(item =>
                        Number(item.voltage ?? 0)
                    ),
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: "yTegangan"
                },

                {
                    label: "Arus (mA)",
                    data: data.map(item =>
                        Number(item.current ?? 0)
                    ),
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: "yArus"
                },

                {
                    label: "Daya (mW)",
                    data: data.map(item =>
                        Number(item.power ?? 0)
                    ),
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: "yDaya"
                },

                {
                    label: "Baterai (%)",
                    data: data.map(item =>
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


// ========================================
// DOWNLOAD MEMORI - EXCEL
// ========================================
// ========================================
// DOWNLOAD MEMORI - EXCEL
// ========================================
// ========================================
// DOWNLOAD MEMORI - EXCEL + GRAFIK
// ========================================

async function downloadMemori(namaMemori, memori) {

    try {

        const data = Array.isArray(memori.data)
            ? memori.data
            : Object.values(memori.data || {});


        if (data.length === 0) {

            alert("Tidak ada data untuk di-download.");
            return;

        }


        // ========================================
        // PASTIKAN GRAFIK SUDAH ADA
        // ========================================

        if (!memoryChart) {

            alert(
                "Silakan klik tombol Lihat terlebih dahulu agar grafik dimuat, kemudian klik Download."
            );

            return;

        }


        // ========================================
        // AMBIL GAMBAR GRAFIK DARI CHART.JS
        // ========================================

        const imageBase64 =
            memoryChart.toBase64Image(
                "image/png",
                1
            );


        // ========================================
        // BUAT WORKBOOK EXCEL
        // ========================================

        const workbook =
            new ExcelJS.Workbook();


        workbook.creator = "VENTALUX";

        workbook.created = new Date();


        // ========================================
        // SHEET 1
        // DATA MEMORI
        // ========================================

        const dataSheet =
            workbook.addWorksheet(
                namaMemori
            );


        dataSheet.columns = [

            {
                header: "No",
                key: "no",
                width: 8
            },

            {
                header: "Tanggal",
                key: "tanggal",
                width: 15
            },

            {
                header: "Jam",
                key: "jam",
                width: 12
            },

            {
                header: "RPM",
                key: "rpm",
                width: 12
            },

            {
                header: "Kecepatan Angin (m/s)",
                key: "wind",
                width: 22
            },

            {
                header: "Suhu (°C)",
                key: "temperature",
                width: 15
            },

            {
                header: "Tegangan (V)",
                key: "voltage",
                width: 15
            },

            {
                header: "Arus (mA)",
                key: "current",
                width: 15
            },

            {
                header: "Daya (mW)",
                key: "power",
                width: 15
            },

            {
                header: "Baterai (%)",
                key: "battery",
                width: 15
            }

        ];


        // ========================================
        // MASUKKAN DATA
        // ========================================

        data.forEach((item, index) => {

            dataSheet.addRow({

                no:
                    index + 1,

                tanggal:
                    item.tanggal ?? "",

                jam:
                    item.jam
                        ? item.jam.replace(/-/g, ":")
                        : "",

                rpm:
                    Number(item.rpm ?? 0),

                wind:
                    Number(item.wind ?? 0),

                temperature:
                    Number(item.temperature ?? 0),

                voltage:
                    Number(item.voltage ?? 0),

                current:
                    Number(item.current ?? 0),

                power:
                    Number(item.power ?? 0),

                battery:
                    Number(item.battery ?? 0)

            });

        });


        // ========================================
        // FORMAT HEADER
        // ========================================

        const header =
            dataSheet.getRow(1);


        header.font = {
            bold: true
        };


        header.alignment = {
            horizontal: "center",
            vertical: "middle"
        };


        dataSheet.views = [
            {
                state: "frozen",
                ySplit: 1
            }
        ];


        // ========================================
        // SHEET 2
        // GRAFIK MEMORI
        // ========================================

        const chartSheet =
            workbook.addWorksheet(
                `Grafik ${namaMemori}`
            );


        chartSheet.getCell("A1").value =
            `Grafik Monitoring ${namaMemori}`;


        chartSheet.getCell("A1").font = {

            bold: true,

            size: 18

        };


        chartSheet.getCell("A3").value =
            "Grafik hasil monitoring VENTALUX";


        chartSheet.getCell("A3").font = {

            italic: true

        };


        // ========================================
        // TAMBAHKAN GAMBAR GRAFIK
        // ========================================

        const imageId =
            workbook.addImage({

                base64: imageBase64,

                extension: "png"

            });


        chartSheet.addImage(
            imageId,
            {
                tl: {
                    col: 0,
                    row: 4
                },

                ext: {
                    width: 1200,
                    height: 600
                }
            }
        );


        // ========================================
        // DOWNLOAD FILE
        // ========================================

        const buffer =
            await workbook.xlsx.writeBuffer();


        const blob =
            new Blob(
                [buffer],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;


        link.download =
            `${namaMemori}_VENTALUX.xlsx`;


        document.body.appendChild(link);


        link.click();


        document.body.removeChild(link);


        URL.revokeObjectURL(url);


        console.log(
            "Excel berhasil dibuat dengan grafik."
        );


    } catch (error) {

        console.error(
            "Gagal membuat Excel:",
            error
        );


        alert(
            "Gagal membuat file Excel. " +
            "Cek Console untuk melihat error."
        );

    }

}


// ========================================
// HAPUS MEMORI
// ========================================

async function hapusMemori(namaMemori) {

    const yakin = confirm(
        `Yakin ingin menghapus ${namaMemori}?`
    );

    if (!yakin) return;


    try {

        await remove(
            ref(
                db,
                `memoriHistoris/${namaMemori}`
            )
        );


        alert(
            `${namaMemori} berhasil dihapus.`
        );


        // Tutup detail jika memori aktif dihapus
        if (namaMemoriAktif === namaMemori) {

            const detailSection =
                document.getElementById(
                    "memoryDetailSection"
                );

            detailSection.classList.remove("show");

            if (memoryChart) {

                memoryChart.destroy();
                memoryChart = null;

            }

            dataMemoriAktif = [];
            namaMemoriAktif = "";

        }


        // Muat ulang status memori
        loadMemori();

    } catch (error) {

        console.error(
            "Gagal menghapus memori:",
            error
        );

        alert(
            "Gagal menghapus memori."
        );

    }

}


// ========================================
// TUTUP DETAIL MEMORI
// ========================================

document
    .getElementById("tutupDetail")
    .addEventListener("click", () => {

        const detailSection =
            document.getElementById(
                "memoryDetailSection"
            );

        detailSection.classList.remove("show");

    });


// ========================================
// JALANKAN SAAT HALAMAN DIBUKA
// ========================================

loadMemori();
// ========================================
// RAPIIKAN MEMORI 1 LAMA
// 837 DATA -> 720 MEMORI + SISANYA HISTORY
// JALANKAN SEKALI SAJA
// ========================================
