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

// =========================
// AMBIL DATA SENSOR
// =========================

const sensorRef = ref(db, "sensor");

onValue(sensorRef, (snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    document.getElementById("rpm").textContent =
        data.rpm + " RPM";

    document.getElementById("wind").textContent =
        data.wind + " m/s";

    document.getElementById("power").textContent =
        data.power + " mW";

    document.getElementById("battery").textContent =
        data.battery + " %";

    document.getElementById("batteryFill").style.width =
        data.battery + "%";

    document.getElementById("batteryStatus").textContent =
        data.status;

    document.getElementById("temperature").textContent =
        data.temperature.toFixed(1) + " °C";

    document.getElementById("voltage").textContent =
    data.voltage.toFixed(2) + " V";
    
    document.getElementById("current").textContent =
        data.current.toFixed(0) + " mA";
if(window.addDataFirebase){

    window.addDataFirebase(data);

}
if(window.updateMonitoring){

    window.updateMonitoring(data);

}


});
