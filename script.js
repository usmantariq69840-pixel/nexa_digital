/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("active");

    if (navMenu.classList.contains("active")) {
        menuBtn.textContent = "✕";
    } else {
        menuBtn.textContent = "☰";
    }

});


/* Close mobile menu after clicking a link */

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");
        menuBtn.textContent = "☰";

    });

});


/* =========================
   DARK / LIGHT MODE
========================= */

const themeBtn = document.getElementById("themeBtn");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";

}


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "☀️";

        localStorage.setItem("theme", "dark");

    } else {

        themeBtn.textContent = "🌙";

        localStorage.setItem("theme", "light");

    }

});


/* =========================
   SERVICE MODAL
========================= */

const modal = document.getElementById("serviceModal");
const modalClose = document.getElementById("modalClose");
const modalDone = document.getElementById("modalDone");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalIcon = document.getElementById("modalIcon");


const services = {

    web: {
        title: "Web Development",
        icon: "</>",
        description:
            "We build fast, responsive and modern websites using clean HTML, CSS and JavaScript."
    },

    uiux: {
        title: "UI/UX Design",
        icon: "◈",
        description:
            "We design clean, intuitive and user-friendly interfaces focused on excellent user experiences."
    },

    seo: {
        title: "SEO",
        icon: "SEO",
        description:
            "We improve website visibility through keyword research, on-page optimization and SEO strategies."
    },

    marketing: {
        title: "Digital Marketing",
        icon: "↗",
        description:
            "We create digital marketing strategies that help businesses reach their target audience."
    },

    software: {
        title: "Software Development",
        icon: "{ }",
        description:
            "We develop custom software solutions designed around specific business requirements."
    },

    cloud: {
        title: "Cloud Solutions",
        icon: "☁",
        description:
            "We provide scalable cloud solutions that help businesses improve reliability and efficiency."
    }

};


const learnMoreButtons =
    document.querySelectorAll(".learn-more");


learnMoreButtons.forEach(button => {

    button.addEventListener("click", () => {

        const serviceName =
            button.getAttribute("data-service");

        const service =
            services[serviceName];

        modalTitle.textContent = service.title;
        modalDescription.textContent = service.description;
        modalIcon.textContent = service.icon;

        modal.classList.add("active");

    });

});


function closeModal() {

    modal.classList.remove("active");

}


modalClose.addEventListener("click", closeModal);

modalDone.addEventListener("click", closeModal);


/* Close modal by clicking outside */

modal.addEventListener("click", event => {

    if (event.target === modal) {
        closeModal();
    }

});


/* =========================
   PORTFOLIO FILTER
========================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const projects =
    document.querySelectorAll(".project-card");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const filter =
            button.getAttribute("data-filter");


        projects.forEach(project => {

            const category =
                project.getAttribute("data-category");

            if (filter === "all" || category === filter) {

                project.classList.remove("hide");

            } else {

                project.classList.add("hide");

            }

        });

    });

});


/* =========================
   CONTACT FORM VALIDATION
========================= */

const contactForm =
    document.getElementById("contactForm");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const subjectInput =
    document.getElementById("subject");

const messageInput =
    document.getElementById("message");

const successMessage =
    document.getElementById("successMessage");


function showError(elementId, message) {

    document.getElementById(elementId).textContent = message;

}


function clearErrors() {

    document.querySelectorAll(".error")
        .forEach(error => {
            error.textContent = "";
        });

    successMessage.textContent = "";

}


contactForm.addEventListener("submit", event => {

    event.preventDefault();

    clearErrors();

    let isValid = true;


    /* Name validation */

    if (nameInput.value.trim() === "") {

        showError(
            "nameError",
            "Name is required."
        );

        isValid = false;

    } else if (nameInput.value.trim().length < 3) {

        showError(
            "nameError",
            "Name must contain at least 3 characters."
        );

        isValid = false;

    }


    /* Email validation */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (emailInput.value.trim() === "") {

        showError(
            "emailError",
            "Email is required."
        );

        isValid = false;

    } else if (!emailPattern.test(emailInput.value)) {

        showError(
            "emailError",
            "Enter a valid email address."
        );

        isValid = false;

    }


    /* Subject validation */

    if (subjectInput.value.trim() === "") {

        showError(
            "subjectError",
            "Subject is required."
        );

        isValid = false;

    }


    /* Message validation */

    if (messageInput.value.trim() === "") {

        showError(
            "messageError",
            "Message is required."
        );

        isValid = false;

    } else if (messageInput.value.trim().length < 10) {

        showError(
            "messageError",
            "Message must contain at least 10 characters."
        );

        isValid = false;

    }


    /* Successful submission */

    if (isValid) {

        successMessage.textContent =
            "✓ Your message has been submitted successfully!";

        contactForm.reset();

    }
    
});
// Dark Mode
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});

// Save theme after page refresh
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}