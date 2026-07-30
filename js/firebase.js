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

    const rpm = document.getElementById("rpm");
if (rpm) {
    rpm.textContent = data.rpm + " RPM";
}

    const wind = document.getElementById("wind");
if (wind) {
    wind.textContent = data.wind + " m/s";
}

    const power = document.getElementById("power");
if (power) {
    power.textContent = data.power + " mW";
}

    const battery = document.getElementById("battery");
const batteryFill = document.getElementById("batteryFill");
const batteryStatus = document.getElementById("batteryStatus");

battery.textContent = data.battery + " %";

batteryFill.style.width = data.battery + "%";

batteryStatus.textContent = data.batteryStatus;

// Warna sesuai kondisi baterai
switch(data.batteryStatus){

    case "Penuh":
        batteryFill.style.background = "#22c55e";
        batteryStatus.style.color = "#22c55e";
        break;

    case "Normal":
        batteryFill.style.background = "#3b82f6";
        batteryStatus.style.color = "#3b82f6";
        break;

    case "Rendah":
        batteryFill.style.background = "#f59e0b";
        batteryStatus.style.color = "#f59e0b";
        break;

    case "Perlu Pengisian":
        batteryFill.style.background = "#ef4444";
        batteryStatus.style.color = "#ef4444";
        break;
}
const temperature = document.getElementById("temperature");
if (temperature) {
    temperature.textContent = data.temperature.toFixed(1) + " °C";
}

const voltage = document.getElementById("voltage");
if (voltage) {
    voltage.textContent = data.voltage.toFixed(2) + " V";
}

const current = document.getElementById("current");
if (current) {
    current.textContent = data.current.toFixed(0) + " mA";
}
if(window.addDataFirebase){

    window.addDataFirebase(data);

}
if(window.updateMonitoring){

    window.updateMonitoring(data);

}


});