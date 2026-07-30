import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
    remove

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

const searchInput = document.getElementById("searchData");
const filterDate = document.getElementById("filterDate");

const btnExcel = document.getElementById("btnExcel");
const btnPDF = document.getElementById("btnPDF");

const btnReset=document.getElementById("btnReset");

let semuaData = [];
let dataFilter = [];

async function loadHistory(){

    const historyRef = ref(db,"history");

    const snapshot = await get(historyRef);

    semuaData=[];

    if(!snapshot.exists()){

        tampilkanData([]);

        return;

    }

    const history=snapshot.val();
    
    Object.keys(history).forEach(tanggal => {

    // Lewati node yang bukan format tanggal YYYY-MM-DD
    if(!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)){
        return;
    }

    Object.keys(history[tanggal]).forEach(jam => {

        semuaData.push({
            tanggal,
            jam,
            ...history[tanggal][jam]
        });

    });

});
    semuaData.sort((a,b)=>{

        const A=new Date(`${a.tanggal} ${a.jam.replace(/-/g,":")}`);

        const B=new Date(`${b.tanggal} ${b.jam.replace(/-/g,":")}`);

        return B-A;

    });

    dataFilter=[...semuaData];

    tampilkanData(dataFilter);

}

loadHistory();

// Refresh data setiap 5 detik
setInterval(loadHistory, 5000);

    function tampilkanData(data){

    tbody.innerHTML="";

    if(data.length===0){

        tbody.innerHTML=`
        <tr>
            <td colspan="10">Tidak ada data.</td>
        </tr>
        `;

        totalRecord.textContent="0 Record";

        return;

    }

    data.forEach((item,index)=>{

        tbody.innerHTML+=`

        <tr>

            <td>${index+1}</td>

            <td>${item.tanggal ?? "-"}</td>

            <td>${item.jam ? item.jam.replace(/-/g,":") : "-"}</td>

            <td>${item.rpm ?? "-"}</td>

            <td>${item.wind ?? "-"} m/s</td>

            <td>${item.temperature!=null ? Number(item.temperature).toFixed(1) : "-"} °C</td>

            <td>${item.voltage!=null ? Number(item.voltage).toFixed(2) : "-"} V</td>

            <td>${item.current!=null ? Number(item.current).toFixed(0) : "-"} mA</td>

            <td>${item.power!=null ? Number(item.power).toFixed(0) : "-"} mW</td>

            <td>${item.battery ?? "-"}%</td>

        </tr>

        `;

    });

    totalRecord.textContent=`${data.length} Record`;

}
searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    const hasil = dataFilter.filter(item => {

        return Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(keyword);

    });

    tampilkanData(hasil);

});
function filterTanggal(){

    if(filterDate.value==""){

        dataFilter=[...semuaData];

    }else{

        dataFilter=semuaData.filter(item=>item.tanggal===filterDate.value);

    }

    tampilkanData(dataFilter);

}

filterDate.addEventListener("change",filterTanggal);
btnExcel.addEventListener("click", () => {

    if(dataFilter.length==0){

        alert("Tidak ada data untuk diexport!");

        return;

    }

    const excelData = dataFilter.map(item => ({

        "Tanggal": item.tanggal,

        "Jam": item.jam.replace(/-/g,":"),

        "RPM": item.rpm,

        "Kecepatan Angin (m/s)": item.wind,

        "Suhu (°C)": item.temperature,

        "Tegangan (V)": item.voltage,

        "Arus (mA)": item.current,

        "Daya (mW)": item.power,

        "Baterai (%)": item.battery

    }));

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Historis");

    XLSX.writeFile(wb, "Historis_VENTALUX.xlsx");

});
btnPDF.addEventListener("click", () => {

    if(dataFilter.length==0){

        alert("Tidak ada data untuk diexport!");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);

    doc.text("Historis Monitoring VENTALUX",14,15);

    const rows = dataFilter.map(item => [

        item.tanggal,

        item.jam.replace(/-/g,":"),

        item.rpm,

        item.wind,

        item.temperature,

        item.voltage,

        item.current,

        item.power,

        item.battery

    ]);

    doc.autoTable({

        head:[[
            "Tanggal",
            "Jam",
            "RPM",
            "Angin",
            "Suhu",
            "Volt",
            "Arus",
            "Daya",
            "Battery"
        ]],

        body:rows,

        startY:25,

        theme:"grid",

        styles:{
            fontSize:8
        }

    });

    doc.save("Historis_VENTALUX.pdf");

});
btnReset.addEventListener("click", async () => {

    const yakin = confirm("Yakin ingin menghapus seluruh data historis?");

    if (!yakin) return;

    try {

        await remove(ref(db, "history"));

        tbody.innerHTML = "";

        totalRecord.textContent = "0 Record";

        alert("Data historis berhasil dihapus.");

    } catch (error) {

        console.error(error);

        alert("Gagal menghapus data.");

    }

});