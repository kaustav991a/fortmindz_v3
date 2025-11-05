document.addEventListener("DOMContentLoaded", function () {
  // Global Setup
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.error("GSAP or ScrollTrigger library not found.");
  }

  //! --- 1. Custom Menu ---
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (toggle && menu) {
    const submenuParents = Array.from(
      menu.querySelectorAll(".has-submenu > a")
    );

    // Menu State Functions
    const openMenu = () => {
      toggle.classList.add("active");
      menu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open"); // optional: lock scroll
    };
    const closeMenu = () => {
      toggle.classList.remove("active");
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      // close all opened submenus on mobile
      menu
        .querySelectorAll(".has-submenu.open")
        .forEach((el) => el.classList.remove("open"));
    };
    const toggleMenu = () =>
      menu.classList.contains("open") ? closeMenu() : openMenu();

    // Event Listeners
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Click-outside to close
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("open")) return;
      if (!e.target.closest(".menu") && !e.target.closest(".menu-toggle")) {
        closeMenu();
      }
    });

    // Escape to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        closeMenu();
        toggle.focus();
      }
    });

    // Submenu behaviour
    submenuParents.forEach((link) => {
      const parentLi = link.parentElement;
      link.setAttribute("aria-haspopup", "true");
      link.setAttribute(
        "aria-expanded",
        parentLi.classList.contains("open") ? "true" : "false"
      );

      link.addEventListener("click", (e) => {
        // mobile behaviour: toggle accordion (<= 767px)
        if (window.innerWidth <= 767) {
          e.preventDefault();
          parentLi.classList.toggle("open");
          const isOpen = parentLi.classList.contains("open");
          link.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
      });
    });

    // Resize handler (cleanup mobile state on desktop switch)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 767) {
          closeMenu();
          menu
            .querySelectorAll(".has-submenu")
            .forEach((li) => li.classList.remove("open"));
        }
      }, 120);
    });
  } else {
    console.warn("Menu toggle or menu not found. Custom menu script skipped.");
  }

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
    const caseStudySliderEl = document.querySelector(".case-study-slider");
    if (caseStudySliderEl) {
      new Splide(caseStudySliderEl, {
        type: "slide",
        perPage: 1,
        arrows: true,
        pagination: false,
        gap: "22px",
      }).mount(); // .mount() is crucial!
    }

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
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smooth: true,
      smoothTouch: false,
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
    gsap.set(slides[0], { y: 0 }); // show first slide initially

    const scrollPerSlide = 450; // smaller value = less scroll distance (was 800)
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
            duration: 0.4, // faster transition
            ease: "power2.out",
            onStart: () => tl.scrollTrigger.direction > 0 && updateMenu(i),
            onReverseComplete: () =>
              tl.scrollTrigger.direction < 0 && updateMenu(i - 1),
          },
          "+=0.3" // shorter delay between slides
        );
      }
    });

    updateMenu(0); // activate first item
  } else {
    console.warn(
      "GSAP Pin Section (our-services) elements or library not found. Script skipped."
    );
  }

  //! --- 6. Isotope Filtering/Masonry ---
  const grid = document.querySelector(".grid");

  if (
    grid &&
    typeof Isotope !== "undefined" &&
    typeof imagesLoaded !== "undefined"
  ) {
    // wait for images to load
    imagesLoaded(grid, function () {
      // init isotope after images are loaded
      const iso = new Isotope(grid, {
        itemSelector: ".grid-item",
        layoutMode: "masonry",
        percentPosition: true,
        masonry: {
          gutter: 30, // space between columns
        },
      });

      // filter buttons
      const filterButtons = document.querySelectorAll(".filter-btn");
      filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterButtons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          let filterValue = btn.getAttribute("data-filter");
          iso.arrange({ filter: filterValue });
        });
      });
    });
  } else {
    console.warn(
      "Isotope, imagesLoaded, or grid element not found. Filtering script skipped."
    );
  }

  //! --- 7. GSAP Animated Tabs (NEW SECTION) ---
  const tabButtons = document.querySelectorAll(".animated-tabs .tab-btn");
  const tabContentWrapper = document.querySelector(
    ".animated-tabs .tab-content-wrapper"
  );
  const tabPanes = document.querySelectorAll(".animated-tabs .tab-pane");

  if (
    tabButtons.length > 0 &&
    tabContentWrapper &&
    tabPanes.length > 0 &&
    typeof gsap !== "undefined"
  ) {
    // 1. Initial Setup: Hide all non-active tabs
    gsap.set(tabPanes, {
      opacity: 0,
      y: 30,
      position: "absolute",
      visibility: "hidden",
    });

    const initialActiveTab = document.querySelector(
      ".animated-tabs .tab-pane.active"
    );

    // 2. Set the initial active tab correctly
    if (initialActiveTab) {
      gsap.set(initialActiveTab, {
        opacity: 1,
        y: 0,
        position: "relative",
        visibility: "visible",
      });
    }

    let activeTab = initialActiveTab;
    let isAnimating = false;

    function switchTab(newTabId) {
      if (isAnimating) return;

      const newTab = document.querySelector(`[data-tab-content="${newTabId}"]`);
      if (newTab === activeTab) return;

      isAnimating = true;

      // A. Outgoing Tab Animation (Slide Down and Fade Out)
      gsap.to(activeTab, {
        opacity: 0,
        y: 30, // Slide down
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          // Hide and reset outgoing tab
          activeTab.classList.remove("active");
          activeTab.style.position = "absolute";
          activeTab.style.visibility = "hidden";

          const newHeight = newTab.scrollHeight;

          // B. Incoming Tab Animation (Height adjustment + Slide Up and Fade In)
          gsap
            .timeline({
              onComplete: () => {
                isAnimating = false;
                activeTab = newTab; // Set new tab as active for next click
              },
            })
            .set(newTab, {
              y: -30, // Start new tab from sliding up
              position: "relative",
              visibility: "visible",
            })
            .to(
              tabContentWrapper,
              {
                height: newHeight,
                duration: 0.4,
                ease: "power2.inOut",
              },
              0
            )
            .to(
              newTab,
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.inOut",
                onStart: () => newTab.classList.add("active"),
              },
              0.1
            );
        },
      });
    }

    // Initialize content wrapper height based on the active tab
    if (initialActiveTab) {
      tabContentWrapper.style.height = `${initialActiveTab.scrollHeight}px`;
    }

    // Attach click listeners to buttons
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const tabId = button.getAttribute("data-tab");
        switchTab(tabId);
      });
    });
  } else {
    console.warn(
      "GSAP Animated Tabs: Required elements or library not found. Script skipped."
    );
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
  //! --- Footer Scroll Text Animation (refined stagger effect) ---
  const footerSection = document.querySelector(".mainft");
  if (
    footerSection &&
    typeof gsap !== "undefined" &&
    typeof ScrollTrigger !== "undefined"
  ) {
    const mainText = footerSection.querySelector(".text-layer.main");
    const topLayers = footerSection.querySelectorAll(".top1, .top2, .top3");
    const bottomLayers = footerSection.querySelectorAll(".bottom1, .bottom2");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerSection,
        start: "top 80%",
        once: true,
      },
      delay: 1.2,
    });

    // all layers fade in almost together, but farther layers delay a little
    const baseDuration = 1.2;

    // upper layers (translateY negative)
    topLayers.forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, y: 0, scale: 1 },
        {
          opacity: 0.5 - i * 0.1,
          y: -(60 + i * 30),
          scale: 1,
          duration: baseDuration,
          ease: "power3.out",
        },
        0 + i * 0.15 // small stagger
      );
    });

    // lower layers (translateY positive)
    bottomLayers.forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, y: 0, scale: 1 },
        {
          opacity: 0.4 - i * 0.1,
          y: 60 + i * 30,
          scale: 1,
          duration: baseDuration,
          ease: "power3.out",
        },
        0.1 + i * 0.15 // slight offset to keep depth feel
      );
    });
  }
});
