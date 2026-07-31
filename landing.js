// ===============================
// FacelessForge Landing Controller
// ===============================
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  initNavbar();
  initSmoothScroll();
  initButtons();
  initRevealAnimation();

});

// ===============================
// Navbar Effect
// ===============================

function initNavbar() {

  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  window.addEventListener("scroll", () => {

    if (window.scrollY > 60) {

      navbar.classList.add("navbar-scrolled");

    } else {

      navbar.classList.remove("navbar-scrolled");

    }

  });

}

// ===============================
// Smooth Scroll
// ===============================

function initSmoothScroll() {

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", e => {

      const target = document.querySelector(link.getAttribute("href"));

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({

        behavior: "smooth"

      });

    });

  });

}

// ===============================
// Buttons
// ===============================

function initButtons() {

  const generateBtn = document.querySelector("#generate-btn");

  if (generateBtn) {

    generateBtn.addEventListener("click", () => {

      window.location.href = "creator.html";

    });

  }

  const creatorBtn = document.querySelector("#creator-btn");

  if (creatorBtn) {

    creatorBtn.addEventListener("click", () => {

      window.location.href = "creator.html";

    });

  }

  const loginBtn = document.querySelector("#login-btn");

  if (loginBtn) {

    loginBtn.addEventListener("click", () => {

      window.location.href = "creator.html";

    });

  }

}

// ===============================
// Reveal Animation
// ===============================

function initRevealAnimation() {

  const items = document.querySelectorAll(".reveal");

  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("active");

      }

    });

  }, {

    threshold: 0.15

  });

  items.forEach(item => observer.observe(item));

}
document.addEventListener("DOMContentLoaded", () => {

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const id = link.getAttribute("href");

      if (id === "#" || id === "#creator") return;

      const target = document.querySelector(id);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

  // Creator Buttons
  document.querySelectorAll(".btn-primary,.btn-secondary").forEach(btn => {

    const text = btn.textContent.toLowerCase();

    if (
      text.includes("generate") ||
      text.includes("start") ||
      text.includes("login") ||
      text.includes("creator")
    ) {

      btn.addEventListener("click", () => {
        window.location.href = "creator.html";
      });

    }

  });

  // Navbar Shadow
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

  });

});
