const nav = document.querySelector(".nav");
const navToggleBtn = document.querySelector(".btn--nav-toggle");
const navLinks = document.querySelectorAll(".nav__link");
const modalOpenBtns = document.querySelectorAll(".btn--open-modal");
const modalCloseBtn = document.querySelector(".btn--close-modal");
const modal = document.querySelector(".modal");
const sections = document.querySelectorAll(".section");
const images = document.querySelectorAll("img[srcset]");
const progressBar = document.querySelector(".progress-bar");
const tabs = document.querySelector(".tabs");
const tabsPanels = document.querySelectorAll(".tabs__panel");
const tabsBtns = document.querySelectorAll(".tabs__btn");
const carousel = document.querySelector(".carousel");
const carouselInner = document.querySelector(".carousel__inner");
const carouselIndicators = document.querySelector(".carousel__indicators");
const carouselIndicatorBtns = document.querySelectorAll(
  ".carousel__btn-indicator"
);

// Nav

const toggleNav = () => {
  const isExpanded = navToggleBtn.getAttribute("aria-expanded") === "true";
  navToggleBtn.setAttribute("aria-expanded", !isExpanded);
  nav.classList.toggle("nav--active");
};

const closeNav = () => {
  navToggleBtn.setAttribute("aria-expanded", "false");
  nav.classList.remove("nav--active");
};

const controlNav = () => {
  navToggleBtn.addEventListener("click", toggleNav);
  navLinks.forEach((link) => link.addEventListener("click", closeNav));
};

// Section Reveal

const revealSections = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");

    observer.unobserve(entry.target);
  });
};

const observeSections = () => {
  const observer = new IntersectionObserver(revealSections, {
    root: null,
    threshold: 0,
  });

  sections.forEach((section) => {
    observer.observe(section);
    section.classList.add("section--hidden");
  });
};

// Image Lazy Load

const loadImg = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const { target } = entry;

    target.src = target.srcset;

    target.addEventListener("load", () => {
      target.classList.remove("lazy-img");
    });

    observer.unobserve(target);
  });
};

const observeImages = () => {
  const observer = new IntersectionObserver(loadImg, {
    root: null,
    rootMargin: "0px",
    threshold: 0.25,
  });

  images.forEach((img) => observer.observe(img));
};

// Modal

const openModal = () => {
  modal.showModal();
  document.body.style.overflow = "hidden";
  closeNav();
};

const closeModal = () => {
  document.body.style.overflow = "";
  modal.close();
};

const controlModal = () => {
  modalOpenBtns.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });
  modalCloseBtn.addEventListener("click", closeModal);

  document.body.addEventListener("keydown", (e) =>
    e.key === "Escape" ? closeModal() : ""
  );
};

// Carousel

const goToSlide = (slide) => {
  carouselInner.style.transform = `translateX(-${slide * 100}%)`;
};

const updateSlideAttributes = (currentSlide) => {
  Array.from(carouselInner.children).forEach((slide, i) => {
    if (currentSlide === i) {
      slide.setAttribute("aria-hidden", "false");
      slide.setAttribute("tabindex", "0");
    } else {
      slide.setAttribute("aria-hidden", "true");
      slide.setAttribute("tabindex", "-1");
    }
  });

  carouselIndicatorBtns.forEach((btn, i) => {
    if (currentSlide === i) {
      btn.setAttribute("aria-current", "true");
    } else {
      btn.removeAttribute("aria-current");
    }
  });
};

const controlCarousel = (defaultSlideIndex = 0) => {
  const numSlides = carouselInner.children.length;
  let currentSlide = defaultSlideIndex;
  let interval;

  const update = (slide) => {
    goToSlide(slide);
    updateSlideAttributes(slide);
  };

  const startInterval = () => {
    interval = setInterval(() => {
      currentSlide = currentSlide >= numSlides - 1 ? 0 : currentSlide + 1;
      update(currentSlide);
    }, 5000);
  };

  const resetInterval = () => {
    clearInterval(interval);
    startInterval();
  };

  update(defaultSlideIndex);
  startInterval();

  carousel.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    resetInterval();

    if (btn.classList.contains("carousel__btn-nav--prev")) {
      currentSlide = currentSlide <= 0 ? numSlides - 1 : currentSlide - 1;
    } else if (btn.classList.contains("carousel__btn-nav--next")) {
      currentSlide = currentSlide >= numSlides - 1 ? 0 : currentSlide + 1;
    } else {
      currentSlide = +btn.dataset.slide;
    }

    update(currentSlide);
  });
};

// Tabs

const switchTabs = (tabIndex, shouldFocus = true) => {
  if (tabIndex < 0 || tabIndex >= tabsPanels.length) return;

  tabsPanels.forEach((panel, i) => {
    if (i === tabIndex) {
      panel.removeAttribute("hidden");
      panel.setAttribute("tabindex", 0);
    } else {
      panel.setAttribute("hidden", "");
    }
  });

  tabsBtns.forEach((btn, i) => {
    if (i === tabIndex) {
      btn.setAttribute("aria-selected", "true");
      btn.setAttribute("tabindex", "0");
      if (shouldFocus) btn.focus();
    } else {
      btn.setAttribute("aria-selected", "false");
      btn.setAttribute("tabindex", "-1");
    }
  });
};

const controlTabs = (defaultTabIndex = 0) => {
  switchTabs(defaultTabIndex, false);

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const tabID = btn.getAttribute("aria-controls");
    const tabIndex = Array.from(tabsPanels).findIndex(
      (panel) => panel.id === tabID
    );

    switchTabs(tabIndex);
  });

  tabs.addEventListener("keydown", (e) => {
    const currentTab = document.activeElement;
    const currentTabID = currentTab.getAttribute("aria-controls");
    const currentTabIndex = Array.from(tabsPanels).findIndex(
      (panel) => panel.id === currentTabID
    );

    switch (e.key) {
      case "ArrowLeft":
        switchTabs(currentTabIndex - 1);
        return;
      case "ArrowRight":
        switchTabs(currentTabIndex + 1);
        return;
      default:
        return;
    }
  });
};

// Progress Bar

const controlProgressBar = () => {
  document.addEventListener("scroll", () => {
    const scrollDistance = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollDistance / documentHeight) * 100;

    progressBar.style.right = `${100 - scrollPercentage}%`;
  });
};
const init = () => {
  controlNav();
  observeSections();
  observeImages();
  controlCarousel();
  controlModal();
  controlTabs();
  controlProgressBar();
};

init();
