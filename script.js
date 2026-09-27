/* =========================
   HELPERS
========================= */

const root = document.documentElement;

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* =========================
   HEADER ON SCROLL + BACK TO TOP
========================= */

const header = document.getElementById("header");
const backToTop = document.getElementById("backToTop");

function onScroll() {

    const y = window.scrollY;

    header.classList.toggle("scrolled", y > 20);
    backToTop.classList.toggle("show", y > 600);

}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();


/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

function setMenu(open) {

    navMenu.classList.toggle("active", open);
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("no-scroll", open);

}

menuBtn.addEventListener("click", () => {
    setMenu(!navMenu.classList.contains("active"));
});


/* Close mobile menu after clicking a link */

navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
});


/* Close the menu if the screen grows past the mobile breakpoint */

window.matchMedia("(min-width: 901px)").addEventListener("change", event => {
    if (event.matches) setMenu(false);
});


/* =========================
   ACTIVE NAV LINK
========================= */

const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + entry.target.id
            );
        });

    });

}, { rootMargin: "-45% 0px -50% 0px" });

document.querySelectorAll("main section[id]").forEach(section => {
    sectionObserver.observe(section);
});


/* =========================
   DARK / LIGHT MODE
========================= */

const themeBtn = document.getElementById("themeBtn");

function updateThemeButton() {

    const isDark = root.getAttribute("data-theme") === "dark";

    themeBtn.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

}

themeBtn.addEventListener("click", () => {

    const next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);

    try {
        localStorage.setItem("theme", next);
    } catch (error) {
        /* Storage unavailable (e.g. private mode) - theme still switches */
    }

    updateThemeButton();

});

updateThemeButton();


/* =========================
   SCROLL REVEAL
========================= */

const revealItems = document.querySelectorAll(".reveal");

/* Stagger items that share the same parent */

revealItems.forEach(item => {

    const siblings =
        [...item.parentElement.children].filter(el => el.classList.contains("reveal"));

    const index = siblings.indexOf(item);

    if (index > 0) {
        item.style.setProperty("--delay", `${Math.min(index * 0.08, 0.4)}s`);
    }

});

if ("IntersectionObserver" in window && !prefersReducedMotion) {

    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const item = entry.target;

                item.classList.add("visible");
                observer.unobserve(item);

                /* Hand transitions back to the element's own hover styles */
                item.addEventListener("transitionend", function done(event) {
                    if (event.target !== item) return;
                    item.classList.remove("reveal", "visible");
                    item.style.removeProperty("--delay");
                    item.removeEventListener("transitionend", done);
                });

            }

        });

    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach(item => revealObserver.observe(item));

} else {

    revealItems.forEach(item => item.classList.add("visible"));

}


/* =========================
   ANIMATED COUNTERS
========================= */

const counters = document.querySelectorAll(".counter");

function animateCounter(counter) {

    const target = Number(counter.dataset.target);

    if (prefersReducedMotion) {
        counter.textContent = target;
        return;
    }

    const duration = 1600;
    const start = performance.now();

    function tick(now) {

        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        counter.textContent = Math.round(target * eased);

        if (progress < 1) requestAnimationFrame(tick);

    }

    requestAnimationFrame(tick);

}

const counterObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }

    });

}, { threshold: 0.6 });

counters.forEach(counter => counterObserver.observe(counter));


/* =========================
   SERVICE CARD SPOTLIGHT
========================= */

document.querySelectorAll(".service-card").forEach(card => {

    card.addEventListener("pointermove", event => {

        const rect = card.getBoundingClientRect();

        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);

    });

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
const modalList = document.getElementById("modalList");

let lastFocused = null;


const services = {

    web: {
        title: "Web Development",
        icon: "#i-code",
        description:
            "We build fast, responsive and modern websites using clean HTML, CSS and JavaScript.",
        features: [
            "Responsive, mobile-first layouts",
            "Performance and accessibility built in",
            "Easy-to-manage content"
        ]
    },

    uiux: {
        title: "UI/UX Design",
        icon: "#i-pen",
        description:
            "We design clean, intuitive and user-friendly interfaces focused on excellent user experiences.",
        features: [
            "User research and wireframes",
            "High-fidelity interactive prototypes",
            "Design systems that scale"
        ]
    },

    seo: {
        title: "SEO",
        icon: "#i-search",
        description:
            "We improve website visibility through keyword research, on-page optimization and SEO strategies.",
        features: [
            "Keyword and competitor research",
            "Technical and on-page optimization",
            "Monthly ranking reports"
        ]
    },

    marketing: {
        title: "Digital Marketing",
        icon: "#i-megaphone",
        description:
            "We create digital marketing strategies that help businesses reach their target audience.",
        features: [
            "Social media campaigns",
            "Paid ads and targeting",
            "Analytics and conversion tracking"
        ]
    },

    software: {
        title: "Software Development",
        icon: "#i-layers",
        description:
            "We develop custom software solutions designed around specific business requirements.",
        features: [
            "Custom web applications",
            "API and third-party integrations",
            "Ongoing maintenance and support"
        ]
    },

    cloud: {
        title: "Cloud Solutions",
        icon: "#i-cloud",
        description:
            "We provide scalable cloud solutions that help businesses improve reliability and efficiency.",
        features: [
            "Cloud migration and setup",
            "Scalable, secure infrastructure",
            "Monitoring and backups"
        ]
    }

};


function openModal(serviceName) {

    const service = services[serviceName];

    if (!service) return;

    modalTitle.textContent = service.title;
    modalDescription.textContent = service.description;
    modalIcon.setAttribute("href", service.icon);

    modalList.innerHTML = "";

    service.features.forEach(feature => {

        const item = document.createElement("li");

        item.innerHTML =
            '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';

        item.append(feature);
        modalList.append(item);

    });

    lastFocused = document.activeElement;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    modalClose.focus();

}


function closeModal() {

    if (!modal.classList.contains("active")) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    if (lastFocused) lastFocused.focus();

}


document.querySelectorAll(".learn-more").forEach(button => {

    button.addEventListener("click", () => {
        openModal(button.dataset.service);
    });

});

modalClose.addEventListener("click", closeModal);

modalDone.addEventListener("click", closeModal);


/* Close modal by clicking outside */

modal.addEventListener("click", event => {

    if (event.target === modal) {
        closeModal();
    }

});


/* Keyboard: Escape closes overlays, Tab stays inside the modal */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeModal();
        setMenu(false);
    }

    if (event.key === "Tab" && modal.classList.contains("active")) {

        const focusable = modal.querySelectorAll("button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }

    }

});


/* =========================
   PORTFOLIO FILTER
========================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project-card");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        const filter = button.dataset.filter;

        projects.forEach(project => {

            const match =
                filter === "all" || project.dataset.category === filter;

            project.classList.toggle("hide", !match);
            project.classList.remove("fade-in");

            if (match) {
                /* Restart the entrance animation */
                void project.offsetWidth;
                project.classList.remove("reveal", "visible");
                project.classList.add("fade-in");
            }

        });

    });

});


/* =========================
   CONTACT FORM VALIDATION
========================= */

const contactForm = document.getElementById("contactForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

const successMessage = document.getElementById("successMessage");
const submitBtn = contactForm.querySelector(".submit-btn");
const submitLabel = submitBtn.querySelector(".btn-label");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/* Each rule returns an error message, or "" when the value is valid */

const rules = {

    name: value => {
        if (value === "") return "Name is required.";
        if (value.length < 3) return "Name must contain at least 3 characters.";
        return "";
    },

    email: value => {
        if (value === "") return "Email is required.";
        if (!emailPattern.test(value)) return "Enter a valid email address.";
        return "";
    },

    subject: value => {
        if (value === "") return "Subject is required.";
        return "";
    },

    message: value => {
        if (value === "") return "Message is required.";
        if (value.length < 10) return "Message must contain at least 10 characters.";
        return "";
    }

};

const fields = [nameInput, emailInput, subjectInput, messageInput];


function validateField(input) {

    const message = rules[input.id](input.value.trim());
    const group = input.closest(".form-group");

    document.getElementById(input.id + "Error").textContent = message;
    group.classList.toggle("invalid", message !== "");
    input.setAttribute("aria-invalid", String(message !== ""));

    return message === "";

}


/* Re-check a field as the user fixes it */

fields.forEach(input => {

    input.addEventListener("input", () => {

        successMessage.textContent = "";

        if (input.closest(".form-group").classList.contains("invalid")) {
            validateField(input);
        }

    });

    input.addEventListener("blur", () => {
        if (input.value.trim() !== "") validateField(input);
    });

});


contactForm.addEventListener("submit", event => {

    event.preventDefault();

    successMessage.textContent = "";

    const results = fields.map(validateField);
    const isValid = results.every(Boolean);

    if (!isValid) {
        fields[results.indexOf(false)].focus();
        return;
    }


    /* Successful submission (simulated send) */

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    submitLabel.textContent = "Sending...";

    setTimeout(() => {

        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
        submitLabel.textContent = "Send Message";

        successMessage.textContent =
            "✓ Your message has been submitted successfully!";

        contactForm.reset();

        fields.forEach(input => input.removeAttribute("aria-invalid"));

    }, 900);

});


/* =========================
   FOOTER YEAR
========================= */

document.getElementById("year").textContent = new Date().getFullYear();
