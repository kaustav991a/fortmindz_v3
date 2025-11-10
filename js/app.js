document.addEventListener("DOMContentLoaded", function () {
  // Global Setup
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.error("GSAP or ScrollTrigger library not found.");
  }

  //! --- 1. Custom Menu ---

  // --- Desktop Submenu Animation (≥768px) ---
  const setupDesktopMenu = () => {
    // --- Mega Menu Animation (Desktop) ---
    document.querySelectorAll(".has-megamenu").forEach((menu) => {
      const mega = menu.querySelector(".megamenu");
      if (!mega) return;

      // initial hidden state
      gsap.set(mega, { display: "none", opacity: 0, y: -15 });

      const tl = gsap.timeline({ paused: true });

      tl.to(mega, {
        display: "flex",
        opacity: 1,
        y: 0,
        duration: 0.25, // faster reveal
        ease: "power2.out",
      })
        .from(
          mega.querySelectorAll(".mega-column, .mega-left, .mega-group"),
          {
            opacity: 0,
            y: 15,
            stagger: 0.05, // faster column entry
            duration: 0.25,
            ease: "power2.out",
          },
          "-=0.15"
        )
        .from(
          mega.querySelectorAll("ul li"),
          {
            opacity: 0,
            y: 8,
            stagger: 0.02, // quick list reveal
            duration: 0.2,
            ease: "power2.out",
          },
          "-=0.15"
        )
        .from(
          mega.querySelector(".mega-footer"),
          {
            opacity: 0,
            y: 10,
            duration: 0.25,
            ease: "power2.out",
          },
          "-=0.15"
        );

      menu.addEventListener("mouseenter", () => tl.play());
      menu.addEventListener("mouseleave", () => tl.reverse());
    });

    document.querySelectorAll(".has-submenu .menu-head").forEach((head) => {
      head.addEventListener("click", () => {
        const parent = head.parentElement;
        const icon = head.querySelector(".icon");

        parent.classList.toggle("active");
        icon.textContent = parent.classList.contains("active") ? "-" : "+";
      });
    });
  };

  // --- Mobile Menu Animation (≤767px) ---
  const setupMobileMenu = () => {
    const toggleBtn = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    const menuLinks = document.querySelectorAll(".menu li");

    const mobileTl = gsap.timeline({ paused: true, reversed: true });

    mobileTl
      // hamburger → cross
      .to(
        ".menu-toggle span:nth-child(1)",
        { y: 7, rotate: 45, duration: 0.3, ease: "power2.inOut" },
        0
      )
      .to(".menu-toggle span:nth-child(2)", { opacity: 0, duration: 0.2 }, 0)
      .to(
        ".menu-toggle span:nth-child(3)",
        { y: -7, rotate: -45, duration: 0.3, ease: "power2.inOut" },
        0
      )
      // slide nav in
      .to(nav, { right: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
      // animate menu items
      .from(
        menuLinks,
        {
          opacity: 0,
          x: 40,
          stagger: 0.07,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.3"
      );

    toggleBtn.addEventListener("click", () => {
      const isMobile = window.innerWidth <= 767;
      if (!isMobile) return; // prevent triggering on larger screens

      if (mobileTl.reversed()) {
        mobileTl.play();
        nav.classList.add("active");
      } else {
        mobileTl.reverse();
        nav.classList.remove("active");
      }
    });
  };

  // --- Initialize Based on Screen Size ---
  const initMenu = () => {
    if (window.innerWidth <= 767) {
      setupMobileMenu();
    } else {
      setupDesktopMenu();
    }
  };

  initMenu();
  window.addEventListener("resize", () => {
    // reset all inline GSAP styles on resize for safety
    gsap.killTweensOf("*");
    document
      .querySelectorAll(".submenu")
      .forEach((el) => gsap.set(el, { clearProps: "all" }));
    document.querySelector(".nav")?.classList.remove("active");
    initMenu();
  });

  //! --- 2. Banner soft Mask (Mouse following effect) ---
  const banner = document.querySelector(".banner");
  const initZero = document.querySelector(".init-zero");

  if (banner && initZero) {
    let rafId = null;
    let mouseX = 0;
    let mouseY = 0;

    /**
     * Updates the CSS Custom Properties for the mask position.
     */
    function updateMaskPosition() {
      initZero.style.setProperty("--mask-x", `${mouseX}px`);
      initZero.style.setProperty("--mask-y", `${mouseY}px`);
      rafId = null;
    }

    /**
     * Mousemove event handler with coordinate correction.
     */
    function handleMouseMove(e) {
      const bannerRect = banner.getBoundingClientRect(); // Get fresh position on move

      // Calculate coordinates relative to the banner element's top-left corner
      mouseX = e.clientX - bannerRect.left;
      mouseY = e.clientY - bannerRect.top; // CORRECTED: Now relative to banner top

      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateMaskPosition);
      }
    }

    /**
     * Mouseleave event handler.
     */
    function handleMouseLeave() {
      // Reset the mask position to the initial state (e.g., outside the viewport)
      initZero.style.setProperty("--mask-x", `-50px`);
      initZero.style.setProperty("--mask-y", `-50px`);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    banner.addEventListener("mousemove", handleMouseMove);
    banner.addEventListener("mouseleave", handleMouseLeave);
  } else {
    console.warn(
      "Banner or init-zero elements not found. Banner soft Mask script skipped."
    );
  }

  //! --- 3. Splide Sliders ---

  /* testimonial-swiper: responsive + continuous autoplay on desktop
   Behavior:
   - Mobile (<768): swipeable, no autoplay, normal speed
   - Tablet (>=768 && <992): small autoplay disabled, nicer speed
   - Desktop (>=992): continuous marquee-like autoplay (delay:0) with freeMode
*/

  (function () {
    // destroy existing instance if re-initializing in dev
    if (window.testimonialSwiper && window.testimonialSwiper.destroy) {
      try {
        window.testimonialSwiper.destroy(true, true);
      } catch (e) {}
    }

    window.testimonialSwiper = new Swiper(".testimonial-swiper", {
      // core
      direction: "horizontal",
      loop: true,
      grabCursor: true,
      keyboard: { enabled: true },
      watchOverflow: true,

      // default (mobile-first)
      slidesPerView: 1.15,
      spaceBetween: 20,
      speed: 1200,
      freeMode: false,
      autoplay: false,

      // navigation (works if .swiper-button-next / prev exist)
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      // breakpoints (min-width)
      breakpoints: {
        // >= 768px
        767: {
          slidesPerView: 1.5,
          spaceBetween: 12,
          speed: 1500,
          freeMode: false,
          autoplay: false,
        },
        // >= 992px -> continuous marquee-like behavior
        991: {
          slidesPerView: 3,
          spaceBetween: 20,
          // continuous autoplay:
          autoplay: {
            delay: 0, // start immediately
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          },
          freeMode: true, // enable freeMode for smooth momentum
          freeModeMomentum: true,
          freeModeMomentumRatio: 0.9,
          freeModeMomentumVelocityRatio: 0.8,
          speed: 6000, // slide transition speed (tune for smoothness)
          // increase loopedSlides to avoid gaps (should be >= slidesPerView)
          loopedSlides: 6,
        },
        // >=1200px — slightly slower/longer travel for larger screens
        1191: {
          slidesPerView: 3,
          spaceBetween: 30,
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          },
          freeMode: true,
          freeModeMomentum: true,
          speed: 10000,
          loopedSlides: 8,
        },
      },

      // keep interactions smooth when autoplaying in freeMode
      // note: these options depend on the Swiper version but are safe in v8/v9
      touchStartPreventDefault: false,
      simulateTouch: true,
      // prevent flick when resizing
      on: {
        init() {
          // minor safety: if autoplay should not run on current breakpoint, stop it
          const a = this.params.autoplay;
          if (!a || !a.delay)
            this.autoplay && this.autoplay.stop && this.autoplay.stop();
        },
        breakpoint(swiper, breakpointParams) {
          // ensure autoplay/freeMode are in expected state after breakpoint change
          if (swiper.params.autoplay && swiper.params.autoplay.delay === 0) {
            swiper.autoplay.start();
          } else {
            swiper.autoplay.stop && swiper.autoplay.stop();
          }
        },
      },
    });
  })();

  if (typeof Splide !== "undefined") {
    // Marquee Slider (AutoScroll requires the extension to be loaded)
    const logoSliderEl = document.querySelector(".logo-slider");
    if (logoSliderEl) {
      new Splide(logoSliderEl, {
        type: "loop",
        perPage: 6,
        arrows: false,
        pagination: false,
        focus: "center",
        gap: "1em",
        // The mount argument assumes the AutoScroll extension is correctly loaded
      }).mount(window.splide ? window.splide.Extensions : {});
      // Added a safety check for window.splide
    }

    // Case Study Slider
    // const caseStudySliderEl = document.querySelector(".case-study-slider");
    // if (caseStudySliderEl) {
    //   new Splide(caseStudySliderEl, {
    //     type: "slide",
    //     perPage: 1,
    //     arrows: true,
    //     pagination: false,
    //     gap: "22px",
    //   }).mount(); // .mount() is crucial!
    // }

    // Case Study Slider
    const testimonialSliderEl = document.querySelector(".testimonial-slider");
    if (testimonialSliderEl) {
      new Splide(testimonialSliderEl, {
        type: "loop",
        perPage: 4,
        arrows: false,
        pagination: false,
        gap: "0",
      }).mount(window.splide ? window.splide.Extensions : {});
    }
  } else {
    console.warn("Splide library not found. Sliders script skipped.");
  }

  //! --- 4. Lenis Scroll (Smooth Scrolling) ---
  if (typeof Lenis !== "undefined" && typeof ScrollTrigger !== "undefined") {
    const lenis = new Lenis({
      // duration: 1.2,
      // easing: (t) => 1 - Math.pow(1 - t, 3),
      // smooth: true,
      // smoothTouch: false,

      duration: 0.9, // shorter = snappier response
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 1.6, // increase a bit for mobile feel
      easing: (t) => 1 - Math.pow(1 - t, 3.2), // custom easing curve like loco
      direction: "vertical",
      gestureDirection: "vertical",
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker to drive Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Force a refresh after everything loads
    window.addEventListener("load", () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
        lenis.raf(performance.now());
      }, 100);
    });

    // --- Optional: Adjust scroll speed based on device ---
    if (window.innerWidth <= 767) {
      lenis.options.duration = 1.0;
      lenis.options.touchMultiplier = 2.0;
    }
  } else {
    console.warn(
      "Lenis or ScrollTrigger not found. Smooth scroll script skipped."
    );
  }

  //! --- 5. GSAP Pin section (Service Scroll) ---
  const slides = gsap.utils.toArray(".serv-scroll-slide .slide-inner");
  const menuItems = gsap.utils.toArray(".serv-left li");
  const servicesTrigger = document.querySelector(".our-services");

  if (slides.length > 0 && servicesTrigger && typeof gsap !== "undefined") {
    const isMobile = window.innerWidth <= 767;

    if (!isMobile) {
      // === DESKTOP ===
      gsap.set(slides[0], { y: 0 }); // show first slide initially

      const scrollPerSlide = 450; // adjust scroll distance per slide
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: servicesTrigger,
          start: "top top",
          end: `+=${slides.length * scrollPerSlide}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      function updateMenu(activeIndex) {
        menuItems.forEach((li, idx) =>
          li.classList.toggle("active", idx === activeIndex)
        );
      }

      slides.forEach((slide, i) => {
        if (i !== 0) {
          tl.to(
            slide,
            {
              y: 0,
              duration: 0.4,
              ease: "power2.out",
              onStart: () => tl.scrollTrigger.direction > 0 && updateMenu(i),
              onReverseComplete: () =>
                tl.scrollTrigger.direction < 0 && updateMenu(i - 1),
            },
            "+=0.3"
          );
        }
      });

      updateMenu(0);
    } else {
      // === MOBILE ===
      console.log("📱 Mobile mode: using sticky sidebar + natural scroll");

      // Reset any GSAP styles from desktop view
      gsap.set(slides, { clearProps: "all" });

      // Make menu sticky
      const servLeft = document.querySelector(".serv-left");
      if (servLeft) {
        servLeft.classList.add("mobile-sticky");
      }

      // Optional: highlight menu item as user scrolls through each slide
      slides.forEach((slide, i) => {
        ScrollTrigger.create({
          trigger: slide,
          start: "top center",
          end: "bottom center",
          onEnter: () => updateMenu(i),
          onEnterBack: () => updateMenu(i),
        });
      });

      function updateMenu(activeIndex) {
        menuItems.forEach((li, idx) =>
          li.classList.toggle("active", idx === activeIndex)
        );
      }

      updateMenu(0);
    }
  } else {
    console.warn(
      "GSAP Pin Section (our-services) elements or library not found. Script skipped."
    );
  }

  //! --- 6. Case Studies: Isotope + Splide + GSAP Sync ---
  const grid = document.querySelector(".grid");
  const caseStudyText = document.querySelector(".case-study-text");
  const templates = document.querySelector(".case-study-templates");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let iso;
  let caseStudySlider;
  let gridItems = [];

  // --- INIT ISOTOPE ---
  if (
    grid &&
    typeof Isotope !== "undefined" &&
    typeof imagesLoaded !== "undefined"
  ) {
    imagesLoaded(grid, function () {
      iso = new Isotope(grid, {
        itemSelector: ".grid-item",
        layoutMode: "masonry",
        percentPosition: true,
        masonry: { gutter: 30 },
      });

      gridItems = Array.from(grid.querySelectorAll(".grid-item"));

      // Initial Splide
      buildSplideFromVisibleItems();
      initGridInteractions();

      // Filter buttons
      filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterButtons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          const filterValue = btn.getAttribute("data-filter");
          iso.arrange({ filter: filterValue });

          // Wait for Isotope transition complete
          iso.once("arrangeComplete", function () {
            buildSplideFromVisibleItems();
          });
        });
      });
    });
  }

  // --- BUILD SPLIDE FROM VISIBLE ITEMS ---
  function buildSplideFromVisibleItems() {
    const visibleItems = Array.from(
      grid.querySelectorAll(".grid-item:not([style*='display: none'])")
    );

    const splideList = document.querySelector(
      ".case-study-slider .splide__list"
    );
    splideList.innerHTML = "";

    // Rebuild slides
    visibleItems.forEach((item) => {
      const img = item.querySelector("img");
      if (!img) return;
      const slide = document.createElement("li");
      slide.className = "splide__slide";
      slide.innerHTML = `<div class="splide__slide__container"><img src="${img.src}" alt=""></div>`;
      splideList.appendChild(slide);
    });

    // Destroy previous Splide if exists
    if (caseStudySlider) {
      caseStudySlider.destroy(true);
    }

    // Reinitialize Splide
    if (visibleItems.length > 0) {
      caseStudySlider = new Splide(".case-study-slider", {
        type: "slide",
        perPage: 1,
        arrows: true,
        pagination: false,
        gap: "22px",
        rewind: true,
        speed: 800,
      }).mount();

      // On slide move → change text
      caseStudySlider.on("move", function (newIndex) {
        const activeItem = visibleItems[newIndex];
        if (activeItem) {
          visibleItems.forEach((el) => el.classList.remove("active"));
          activeItem.classList.add("active");
          updateCaseContent(activeItem.dataset.case);
        }
      });

      // Set first visible as active initially
      visibleItems.forEach((el) => el.classList.remove("active"));
      visibleItems[0].classList.add("active");
      updateCaseContent(visibleItems[0].dataset.case);
    } else {
      console.warn("⚠️ No visible items found after filter!");
    }

    initGridInteractions(visibleItems);
  }

  // --- GRID ITEM CLICK BEHAVIOR ---
  function initGridInteractions(items = gridItems) {
    items.forEach((item, index) => {
      item.addEventListener("click", () => {
        items.forEach((el) => el.classList.remove("active"));
        item.classList.add("active");
        const caseId = item.dataset.case;
        updateCaseContent(caseId);
        if (caseStudySlider) caseStudySlider.go(index);
      });
    });
  }

  // --- UPDATE TEXT CONTENT (Apple-like smooth animation) ---
  function updateCaseContent(caseId) {
    const template = templates.querySelector(`#${caseId}`);
    if (!template) return;
    const newContent = template.innerHTML;

    // Animate old content out + new content in
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });

    tl.to(caseStudyText, {
      filter: "blur(6px)",
      autoAlpha: 0,
      y: 30,
      scale: 0.98,
      duration: 0.4,
      onComplete: () => {
        caseStudyText.innerHTML = newContent;
      },
    });

    tl.to(caseStudyText, {
      filter: "blur(0px)",
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
    });
  }

  //! --- 7. GSAP Animated Tabs (Desktop + Mobile Dropdown) ---
  const tabsSection = document.querySelector(".animated-tabs");
  if (!tabsSection) return;

  const tabButtonsContainer = tabsSection.querySelector(".tab-buttons");
  const tabButtons = tabButtonsContainer.querySelectorAll(".tab-btn");
  const tabContentWrapper = tabsSection.querySelector(".tab-content-wrapper");
  const tabPanes = tabContentWrapper.querySelectorAll(".tab-pane");

  // --- Create dropdown for mobile ---
  const dropdown = document.createElement("div");
  dropdown.className = "tab-dropdown";
  dropdown.innerHTML = `
    <div class="tab-dropdown-selected">
      ${tabButtonsContainer.querySelector(".active")?.textContent || "Select"}
    </div>
    <ul class="tab-dropdown-list">
      ${Array.from(tabButtons)
        .map(
          (btn) =>
            `<li data-tab="${btn.dataset.tab}" class="${
              btn.classList.contains("active") ? "active" : ""
            }">${btn.textContent}</li>`
        )
        .join("")}
    </ul>
  `;

  // Insert dropdown after tab-buttons safely
  tabButtonsContainer.parentNode.insertBefore(
    dropdown,
    tabButtonsContainer.nextSibling
  );

  const selected = dropdown.querySelector(".tab-dropdown-selected");
  const list = dropdown.querySelector(".tab-dropdown-list");

  // --- Dropdown toggle animation ---
  selected.addEventListener("click", () => {
    const isOpen = list.classList.toggle("open");
    gsap.to(list, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
      onStart: () => {
        if (isOpen) list.style.display = "block";
      },
      onComplete: () => {
        if (!isOpen) list.style.display = "none";
      },
    });
  });

  // --- Dropdown item click ---
  list.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => {
      const tabName = li.dataset.tab;
      setActiveTab(tabName);
      selected.textContent = li.textContent;
      gsap.to(list, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: () => list.classList.remove("open"),
      });
    });
  });

  // --- Tab click (desktop) ---
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      setActiveTab(tabName);
      selected.textContent = btn.textContent;
    });
  });

  // --- Core tab switch animation ---
  function setActiveTab(tabName) {
    tabButtons.forEach((b) =>
      b.classList.toggle("active", b.dataset.tab === tabName)
    );
    list
      .querySelectorAll("li")
      .forEach((li) =>
        li.classList.toggle("active", li.dataset.tab === tabName)
      );

    tabPanes.forEach((pane) => {
      if (pane.dataset.tabContent === tabName) {
        gsap.to(pane, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          display: "block",
          onStart: () => {
            pane.classList.add("active");
            pane.style.visibility = "visible";
          },
        });
      } else {
        gsap.to(pane, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          display: "none",
          onComplete: () => {
            pane.classList.remove("active");
            pane.style.visibility = "hidden";
          },
        });
      }
    });
  }

  //! --- 8. File upload animation ---
  const fileInput = document.querySelector('.fileupload input[type="file"]');
  const fileName = document.getElementById("file-name");
  const fileUploadBox = document.querySelector(".fileupload");

  if (fileInput && fileName && fileUploadBox) {
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        fileName.textContent = fileInput.files[0].name;
        fileUploadBox.classList.add("has-file");

        // Subtle animation when a file is selected
        gsap.fromTo(
          fileName,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
      } else {
        fileName.textContent = "No file chosen";
        fileUploadBox.classList.remove("has-file");
      }
    });
  }

  //! --- 9. GSAP Animated FAQ Section ---
  const faqItems = document.querySelectorAll(".faq-main");

  if (faqItems.length > 0 && typeof gsap !== "undefined") {
    faqItems.forEach((item) => {
      const head = item.querySelector(".faq-head");
      const content = item.querySelector(".faq-content");

      // Set initial state
      gsap.set(content, { height: 0, opacity: 0, y: -8 });

      head.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close all others first
        faqItems.forEach((el) => {
          el.classList.remove("active");
          const innerContent = el.querySelector(".faq-content");
          gsap.to(innerContent, {
            height: 0,
            opacity: 0,
            y: -8,
            duration: 0.4,
            ease: "power2.inOut",
          });
        });

        // Open this one if not already open
        if (!isActive) {
          item.classList.add("active");

          const contentHeight = content.scrollHeight;
          gsap.fromTo(
            content,
            { height: 0, opacity: 0, y: -8 },
            {
              height: contentHeight,
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
            }
          );
        }
      });
    });
  }

  //! --- 10. Footer Scroll Text Animation ---
  const footerSection = document.querySelector(".mainft");

  if (
    footerSection &&
    typeof gsap !== "undefined" &&
    typeof ScrollTrigger !== "undefined"
  ) {
    const mainText = footerSection.querySelector(".text-layer.main");
    const topLayers = footerSection.querySelectorAll(".top1, .top2, .top3");
    const bottomLayers = footerSection.querySelectorAll(".bottom1, .bottom2");

    // detect mobile
    const isMobile = window.innerWidth <= 767;

    // movement strength (tighter on mobile)
    const baseY = isMobile ? 30 : 60; // reduced Y movement on mobile
    const stepY = isMobile ? 30 : 30; // tighter spacing between layers

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerSection,
        start: "top -30%",
        once: true,
      },
    });

    const baseDuration = 1.2;

    // main layer fade
    tl.fromTo(
      mainText,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
      0
    );

    // upper layers (move up)
    topLayers.forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, y: 0, scale: 1 },
        {
          opacity: 0.5 - i * 0.1,
          y: -(baseY + i * stepY),
          scale: 1,
          duration: baseDuration,
          ease: "power3.out",
        },
        0.15 + i * 0.15
      );
    });

    // lower layers (move down)
    bottomLayers.forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, y: 0, scale: 1 },
        {
          opacity: 0.4 - i * 0.1,
          y: baseY + i * stepY,
          scale: 1,
          duration: baseDuration,
          ease: "power3.out",
        },
        0.2 + i * 0.15
      );
    });
  }

  //! --- 11. Stats Counter Animation (Smooth, Luxurious Version) ---
  //! --- Stats Counter Animation (Starts from 0, Smooth Motion) ---
  const statsSection = document.querySelector(".stats");

  if (
    statsSection &&
    typeof gsap !== "undefined" &&
    typeof ScrollTrigger !== "undefined"
  ) {
    const counters = statsSection.querySelectorAll("h6");
    const icons = statsSection.querySelectorAll(".icon img");
    const items = statsSection.querySelectorAll("li");

    // --- Set initial state ---
    counters.forEach((counter) => {
      counter.textContent = "0";
    });
    gsap.set(items, { opacity: 0, y: 30 });
    gsap.set(icons, { rotation: 0 });

    // --- Main timeline ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: statsSection,
        start: "top 80%", // when section enters viewport
        once: true,
      },
    });

    // --- Fade-in + upward slide for list items ---
    tl.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.15,
    });

    // --- Smooth icon rotation (gentle ease) ---
    tl.to(
      icons,
      {
        rotation: 360,
        duration: 2.2,
        ease: "power2.inOut",
        stagger: 0.2,
      },
      "<"
    ); // starts together with fade

    // --- Counter animation (count up smoothly) ---
    counters.forEach((counter, i) => {
      const text =
        counter.getAttribute("data-target") || counter.textContent.trim();
      const numericValue = parseInt(text.replace(/\D/g, ""), 10);
      const suffix = text.replace(/[0-9]/g, "");
      const obj = { val: 0 };

      tl.to(
        obj,
        {
          val: numericValue,
          duration: 2.4,
          ease: "power3.out",
          onUpdate: () => {
            counter.textContent = Math.floor(obj.val).toLocaleString() + suffix;
          },
          onComplete: () => {
            // Subtle pulse when number completes
            gsap.to(counter, {
              scale: 1.15,
              duration: 0.25,
              ease: "power1.out",
              yoyo: true,
              repeat: 1,
            });
          },
        },
        0.4 + i * 0.25
      );
    });
  }

  // ! -- 12. Aos animation
  AOS.init({
    duration: 1000, // animation speed (ms)
    once: true, // animate only once
    easing: "ease-out-cubic",
  });

  // ! -- 13. Aos animation
  const phoneInput = document.querySelector("#phone");
  const iti = window.intlTelInput(phoneInput, {
    initialCountry: "in", // default country (India)
    preferredCountries: ["in", "us", "gb", "ca", "au"],
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.6.1/js/utils.js",
  });

  // ! -- 14. Responsive structure change
  const ftContact = document.querySelector(".ftcontact");
  const ftMenus = document.querySelector(".ftmenurow");
  const ftmenusWrapper = document.querySelector(".ftmenus");

  function moveFooterContact() {
    if (!ftContact || !ftMenus || !ftmenusWrapper) return;

    if (window.innerWidth <= 767) {
      const allFtMenus = ftMenus.querySelectorAll(".ftmenu");
      const lastMenu = allFtMenus[allFtMenus.length - 1];

      // Move ftcontact after last ftmenu
      lastMenu.insertAdjacentElement("afterend", ftContact);
    } else {
      // Move ftcontact back to its original position (after .ftmenus)
      ftmenusWrapper.insertAdjacentElement("afterend", ftContact);
    }
  }

  // Run on load
  moveFooterContact();

  // Run on resize (debounced for performance)
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(moveFooterContact, 200);
  });
});
