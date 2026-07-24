import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {

    apiKey: "AIzaSyCo1B0mW8h8HcTIfVZcFyAzVdn0EnYh92g",

    authDomain: "website0-2291b.firebaseapp.com",

    databaseURL: "https://website0-2291b-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "website0-2291b",

    storageBucket: "website0-2291b.firebasestorage.app",

    messagingSenderId: "185379743094",

    appId: "1:185379743094:web:dbefea90b74b7924900657"

};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tbody = document.getElementById("historyBody");
const totalRecord = document.getElementById("totalRecord");

let semuaData = [];

function loadHistory() {

    const historyRef = ref(db, "history");

    onValue(historyRef, (snapshot) => {

        tbody.innerHTML = "";
        semuaData = [];

        if (!snapshot.exists()) {

            tbody.innerHTML = `
            <tr>
                <td colspan="10">Belum ada data historis.</td>
            </tr>
            `;

            return;
        }

        const history = snapshot.val();

        Object.keys(history)
            .reverse()
            .forEach(tanggal => {

                Object.keys(history[tanggal])
                    .reverse()
                    .forEach(jam => {

                        semuaData.push({
                            tanggal,
                            jam,
                            ...history[tanggal][jam]
                        });

                    });

            });

        tampilkanData(semuaData);

    });

}

loadHistory();
function tampilkanData(data) {

    tbody.innerHTML = "";

    if (data.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="10">Data tidak ditemukan.</td>
        </tr>
        `;

        totalRecord.textContent = "0 Record";
        return;
    }

    data.forEach((item, index) => {

        tbody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${item.tanggal}</td>

            <td>${item.jam.replace("-", ":")}</td>

            <td>${item.rpm ?? "-"}</td>

            <td>${item.wind ?? "-"} m/s</td>

            <td>${Number(item.temperature).toFixed(1)} °C</td>

            <td>${Number(item.voltage).toFixed(2)} V</td>

            <td>${Number(item.current).toFixed(0)} mA</td>

            <td>${Number(item.power).toFixed(0)} mW</td>

            <td>${item.battery}%</td>

        </tr>

        `;

    });

    totalRecord.textContent = `${data.length} Record`;

}