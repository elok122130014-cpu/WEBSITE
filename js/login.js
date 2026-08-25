import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ========================================
// KONFIGURASI FIREBASE VENTALUX
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
// FIREBASE AUTHENTICATION
// ========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// ========================================
// FORM LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    // ========================================
    // VALIDASI
    // ========================================

    if (!email || !password) {

        loginMessage.textContent =
            "Email dan password wajib diisi.";

        loginMessage.style.color = "#dc2626";

        return;

    }


    // ========================================
    // PROSES LOGIN
    // ========================================

    try {

        loginMessage.textContent =
            "Sedang memproses login...";

        loginMessage.style.color =
            "#0f766e";


        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        // ========================================
        // LOGIN BERHASIL
        // ========================================

        loginMessage.textContent =
            "Login berhasil. Mengarahkan ke Dashboard...";

        loginMessage.style.color =
            "#16a34a";


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 500);


    } catch (error) {

        console.error(
            "Login gagal:",
            error
        );


        // ========================================
        // PESAN ERROR
        // ========================================

        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            loginMessage.textContent =
                "Email atau password salah.";

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            loginMessage.textContent =
                "Format email tidak valid.";

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            loginMessage.textContent =
                "Akun belum terdaftar.";

        }

        else {

            loginMessage.textContent =
                "Login gagal. Silakan coba lagi.";

        }


        loginMessage.style.color =
            "#dc2626";

    }

});