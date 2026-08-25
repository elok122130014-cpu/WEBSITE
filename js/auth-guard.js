import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ========================================
// FIREBASE CONFIG
// ========================================

const firebaseConfig = {

    apiKey: "AIzaSyCo1B0mW8h8HcTIfVZcFyAzVdn0EnYh92g",

    authDomain: "website0-2291b.firebaseapp.com",

    databaseURL:
        "https://website0-2291b-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "website0-2291b",

    storageBucket:
        "website0-2291b.firebasestorage.app",

    messagingSenderId:
        "185379743094",

    appId:
        "1:185379743094:web:dbefea90b74b7924900657"

};


// ========================================
// CEK LOGIN
// ========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.replace("login.html");

    }

});