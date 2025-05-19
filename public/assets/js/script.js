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

async function getMenus() {
  try {
    const response = await fetch("http://localhost:5000/api/menu");
    const data = await response.json();
    console.log("API Response:", data);
    return data.data || data; // Trả về data.data nếu có, nếu không thì trả về data
  } catch (error) {
    console.error("Error fetching menus:", error);
    return [];
  }
}

async function displayMenus() {
  try {
    const menus = await getMenus();
    console.log("Menus to display:", menus);

    const menuList = document.querySelector(".grid-menu");
    console.log("menuList", menuList);

    // Clear existing menu items
    menuList.innerHTML = "";

    if (!menus || menus.length === 0) {
      menuList.innerHTML = "<p>Không có món ăn nào</p>";
      return;
    }

    menus.forEach((menu) => {
      const menuItem = document.createElement("li");
      menuItem.innerHTML = `
                <figure class="card-banner img-holder" style="--width: 100; --height: 100">
                    <img src="${menu.image || "./assets/images/menu-2.png"}" 
                        width="100" 
                        height="100" 
                        loading="lazy" 
                        alt="${menu.name || "Không có ảnh"}"
                        class="img-cover" />
                </figure>

                <div>
                    <div class="title-wrapper">
                        <h3 class="title-3">
                            <a href="#" class="card-title">${
                              menu.name || "Không có tên"
                            }</a>
                        </h3>

                        <span class="span title-2">${formatPrice(
                          menu.price || 0
                        )} VND</span>

                        <p class="card-text label-1">
                            ${menu.description || "Không có mô tả"}
                        </p>
                    </div>
                </div>
            `;
      menuItem.className = "menu-card hover:card";
      menuList.appendChild(menuItem);
    });
  } catch (error) {
    console.error("Error displaying menus:", error);
  }
}

// Format price with commas
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Call displayMenus when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, calling displayMenus");
  displayMenus();
});
