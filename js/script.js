const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

if(menuToggle){

    menuToggle.addEventListener("click", () => {

        menu.classList.toggle("active");

    });

}