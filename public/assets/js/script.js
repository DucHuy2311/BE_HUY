"use strict";

/**
 * preload
 *
 * loading will be and after document is ready
 */

const preloader = document.querySelector("[data-preload]");
window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");

  // document.body.style.overflow = "auto";
});

// add event listener on multiple elements

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

// navbar

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};

addEventOnElements(navTogglers, "click", toggleNavbar);

// Header

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
};

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.add("active");
    backTopBtn.classList.remove("active");
  }
});

/**
 * Hero slider
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
};

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
};

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
};

heroSliderPrevBtn.addEventListener("click", slidePrev);

let autoSlideInterval;
const autoSlide = function () {
  autoSlideInterval = setInterval(() => {
    slideNext();
  }, 5000);
};

addEventOnElements(
  [heroSliderNextBtn, heroSliderPrevBtn],
  "mouseover",
  function () {
    clearInterval(autoSlideInterval);
  }
);

addEventOnElements(
  [heroSliderNextBtn, heroSliderPrevBtn],
  "mouseout",
  autoSlide
);

window.addEventListener("load", autoSlide);

// parallax effect

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;
window.addEventListener("mousemove", function (event) {
  x = (event.clientX / window.innerWidth) * 10 - 5;
  y = (event.clientY / window.innerHeight) * 10 - 5;

  x = x - x * 2;
  y = y - y * 2;

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }
});

// login
document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const tabBtns = document.querySelectorAll(".tab-btn");
  const forms = document.querySelectorAll(".auth-form");
  const formTitle = document.getElementById("form-title");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Update active tab
      tabBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // Show corresponding form
      const formId = this.getAttribute("data-tab");
      forms.forEach((form) => form.classList.remove("active"));
      document.getElementById(`${formId}-form`).classList.add("active");

      // Update form title
      formTitle.textContent = formId === "login" ? "Sign In" : "Create Account";
    });
  });

  // Form switch links
  const switchLinks = document.querySelectorAll(".switch-form");
  switchLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const formToShow = this.getAttribute("data-form");

      // Update active tab
      tabBtns.forEach((btn) => {
        if (btn.getAttribute("data-tab") === formToShow) {
          btn.click();
        }
      });
    });
  });

  // Form submission (prevent default for demo)
  const authForms = document.querySelectorAll("form");
  authForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      //   alert('Form submitted! This is just a demo.');
    });
  });
});
