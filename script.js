console.log("Restaurant Website Loaded");
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {

    navLinks.classList.toggle("active");

    if(navLinks.classList.contains("active")){
        menuToggle.innerHTML = "✖";
        document.body.style.overflow = "hidden";
    }else{
        menuToggle.innerHTML = "☰";
        document.body.style.overflow = "";
    }

});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        menuToggle.innerHTML = "☰";
    });
});

function revealElements(){

    const reveals = document.querySelectorAll(".reveal");

    reveals.forEach(function(reveal){

        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 120;

        if(revealTop < windowHeight - revealPoint){
            reveal.classList.add("active");
        }

    });

}

window.addEventListener("scroll", revealElements);

revealElements();

const galleryImages = document.querySelectorAll(".gallery-item img");

const lightbox = document.querySelector(".lightbox");

const lightboxImg = document.querySelector(".lightbox-img");

const closeBtn = document.querySelector(".close");

const imageCounter = document.querySelector(".image-counter");

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;

galleryImages.forEach(function(image){

    image.addEventListener("click",function(){

        currentIndex = Array.from(galleryImages).indexOf(image);

        lightbox.classList.add("active");

        lightboxImg.src = image.src;

        updateCounter();

    });

});

closeBtn.addEventListener("click",function(){

    lightbox.classList.remove("active");

});

// ESC key se close
document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

        lightbox.classList.remove("active");

    }

});

// Background click se close
lightbox.addEventListener("click", function(e){

    if(e.target === lightbox){

        lightbox.classList.remove("active");

    }

});

nextBtn.addEventListener("click", function(){

    currentIndex++;

    if(currentIndex >= galleryImages.length){

        currentIndex = 0;

    }

    lightboxImg.src = galleryImages[currentIndex].src;

    updateCounter();

});

prevBtn.addEventListener("click", function(){

    currentIndex--;

    if(currentIndex < 0){

        currentIndex = galleryImages.length - 1;

    }

    lightboxImg.src = galleryImages[currentIndex].src;

    updateCounter();
});

function updateCounter(){

    imageCounter.textContent =
        `${currentIndex + 1} / ${galleryImages.length}`;

}

const reservationForm = document.querySelector(".reservation-form");

const reservationMessage = document.querySelector(".reservation-message");

reservationForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const formData = new FormData(reservationForm);

    const reservationData = Object.fromEntries(formData.entries());

    try{

      const response = await fetch("https://spice-haven-backend.onrender.com/reservation", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(reservationData)

        });

        const result = await response.json();

        if(result.success){

            reservationMessage.textContent =
                "✔ Table Reserved Successfully!";

            reservationForm.reset();

        }

    }catch(error){

        reservationMessage.textContent =
            "Something went wrong. Please try again.";

        console.error(error);

    }

});

const contactForm = document.querySelector(".contact-form");
const contactMessage = document.querySelector(".contact-message");

contactForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const formData = new FormData(contactForm);
    const contactData = Object.fromEntries(formData.entries());

    try{

        const response = await fetch(
            "https://spice-haven-backend.onrender.com/contact",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(contactData)
            }
        );

        const result = await response.json();

        if(result.success){

            contactMessage.textContent =
                "✔ Message Sent Successfully!";

            contactForm.reset();

        }else{

            contactMessage.textContent =
                "Something went wrong. Please try again.";

        }

    }catch(error){

        contactMessage.textContent =
            "Something went wrong. Please try again.";

        console.error(error);

    }

});

const loader = document.querySelector(".loader");

window.addEventListener("load", function(){

    loader.classList.add("hide");

    setTimeout(function(){

        loader.style.display = "none";

    },600);

});

const sections = document.querySelectorAll("section");

const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", function(){

    let current = "";

    sections.forEach(function(section){

        const sectionTop = section.offsetTop - 120;

        if(window.scrollY >= sectionTop){

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(function(link){

        link.classList.remove("active");

        if(link.getAttribute("href") === "#" + current){

            link.classList.add("active");

        }

    });

});

document.addEventListener("click", function(e){

    if(
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)
    ){
        navLinks.classList.remove("active");
        menuToggle.innerHTML = "☰";
        document.body.style.overflow = "";
    }

});

navLinks.querySelectorAll("a").forEach(function(link){

    link.addEventListener("click", function(){

        navLinks.classList.remove("active");

        menuToggle.innerHTML = "☰";

        document.body.style.overflow = "";

    });

});

const reservationDate = document.querySelector(
    '.reservation-form input[type="date"]'
);

const today = new Date().toISOString().split("T")[0];

reservationDate.min = today;

