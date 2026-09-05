// ===========================================
// FIREBASE VENTALUX
// ===========================================

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

let lastUpdate = 0;

// =========================
// AMBIL DATA SENSOR
// =========================

const sensorRef = ref(db, "sensor");

onValue(sensorRef, (snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    lastUpdate = Number(data.lastUpdate || 0);


    // ==============================
    // TURBIN
    // ==============================

    const rpm = document.getElementById("rpm");

    if (rpm) {
        rpm.textContent =
            (data.rpm ?? 0) + " RPM";
    }


    const wind = document.getElementById("wind");

    if (wind) {
        wind.textContent =
            (data.wind ?? 0) + " m/s";
    }


    const temperature =
        document.getElementById("temperature");

    if (temperature) {

        const nilaiSuhu =
            Number(data.temperature ?? 0);

        temperature.textContent =
            nilaiSuhu.toFixed(1) + " °C";
    }

// ==============================
// BATERAI
// ==============================

const voltage = document.getElementById("voltage");
const current = document.getElementById("current");
const power = document.getElementById("power");

if (voltage) {
    const nilaiVoltage = Number(data.voltage_bat ?? 0);
    voltage.textContent = nilaiVoltage.toFixed(2) + " V";
}

if (current) {
    const nilaiCurrent = Number(data.current_bat ?? 0);
    current.textContent = nilaiCurrent.toFixed(0) + " mA";
}

if (power) {
    const nilaiPower = Number(data.power_bat ?? 0);
    power.textContent = nilaiPower.toFixed(0) + " mW";
}


// ==============================
// GENERATOR
// ==============================

const generatorVoltage =
    document.getElementById("generatorVoltage");

const generatorCurrent =
    document.getElementById("generatorCurrent");

const generatorPower =
    document.getElementById("generatorPower");

if (generatorVoltage) {
    const nilaiGeneratorVoltage =
        Number(data.voltage_gen ?? 0);

    generatorVoltage.textContent =
        nilaiGeneratorVoltage.toFixed(2) + " V";
}

if (generatorCurrent) {
    const nilaiGeneratorCurrent =
        Number(data.current_gen ?? 0);

    generatorCurrent.textContent =
        nilaiGeneratorCurrent.toFixed(0) + " mA";
}

if (generatorPower) {
    const nilaiGeneratorPower =
        Number(data.power_gen ?? 0);

    generatorPower.textContent =
        nilaiGeneratorPower.toFixed(0) + " mW";
}
    // ==============================
    // STATUS BATERAI
    // ==============================

    const battery =
        document.getElementById("battery");

    const batteryFill =
        document.getElementById("batteryFill");

    const batteryStatus =
        document.getElementById("batteryStatus");


    if (battery) {

        battery.textContent =
            (data.battery ?? 0) + " %";
    }


    if (batteryFill) {

        batteryFill.style.width =
            (data.battery ?? 0) + "%";
    }


    if (batteryStatus) {

        batteryStatus.textContent =
            data.batteryStatus ?? "--";
    }


    // ==============================
    // WARNA STATUS BATERAI
    // ==============================

    if (batteryFill && batteryStatus) {

        switch (data.batteryStatus) {

            case "Penuh":

                batteryFill.style.background =
                    "#22c55e";

                batteryStatus.style.color =
                    "#22c55e";

                break;


            case "Normal":

                batteryFill.style.background =
                    "#3b82f6";

                batteryStatus.style.color =
                    "#3b82f6";

                break;


            case "Rendah":

                batteryFill.style.background =
                    "#f59e0b";

                batteryStatus.style.color =
                    "#f59e0b";

                break;


            case "Perlu Pengisian":

                batteryFill.style.background =
                    "#ef4444";

                batteryStatus.style.color =
                    "#ef4444";

                break;
        }
    }


    // ==============================
    // KIRIM DATA KE GRAFIK
    // ==============================

    if (window.addDataFirebase) {

        window.addDataFirebase(data);
    }


    if (window.updateMonitoring) {

        window.updateMonitoring(data);
    }
});

export { db };