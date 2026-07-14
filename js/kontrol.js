// ======================================
// FIREBASE
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
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

// ======================================
// REFERENSI
// ======================================

const relayRef = ref(db, "relay/status");

const modeRef = ref(db, "mode/auto");

const sensorRef = ref(db, "sensor");

const manualMode = document.getElementById("manualMode");

const autoMode = document.getElementById("autoMode");

const btnOn = document.getElementById("btnOn");

const btnOff = document.getElementById("btnOff");

// ======================================
// TOMBOL
// ======================================

document.getElementById("btnOn").onclick = function(){

    set(relayRef, true);

}

document.getElementById("btnOff").onclick = function(){

    set(relayRef, false);

}

// ======================================
// STATUS LAMPU
// ======================================

onValue(relayRef,(snapshot)=>{

    const status = snapshot.val();

    const lamp = document.querySelector(".lamp-icon");

    const text = document.getElementById("lampStatus");

    if(status){

        lamp.classList.remove("lamp-off");

        lamp.classList.add("lamp-on");

        text.innerHTML="🟢 MENYALA";

        text.classList.remove("status-off");

        text.classList.add("status-on");

    }

    else{

        lamp.classList.remove("lamp-on");

        lamp.classList.add("lamp-off");

        text.innerHTML="🔴 MATI";

        text.classList.remove("status-on");

        text.classList.add("status-off");

    }

});
// ======================================
// MODE MANUAL / OTOMATIS
// ======================================

manualMode.addEventListener("change", () => {

    if (manualMode.checked) {

        set(modeRef, false);

    }

});

autoMode.addEventListener("change", () => {

    if (autoMode.checked) {

        set(modeRef, true);

    }

});
// ======================================
// SINKRON MODE
// ======================================

onValue(modeRef, (snapshot)=>{

    const auto = snapshot.val();

    if(auto){

        autoMode.checked = true;

        btnOn.disabled = true;

        btnOff.disabled = true;

        btnOn.style.opacity = "0.5";

        btnOff.style.opacity = "0.5";

    }

    else{

        manualMode.checked = true;

        btnOn.disabled = false;

        btnOff.disabled = false;

        btnOn.style.opacity = "1";

        btnOff.style.opacity = "1";

    }

});