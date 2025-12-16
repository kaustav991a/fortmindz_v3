document.addEventListener("DOMContentLoaded", () => {
  // Global Setup
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.error("GSAP or ScrollTrigger library not found.");
  }

  //! --- 1. Custom Menu ---

  // State to track current menu mode
  let currentMenuMode = null;
  let menuLenis = null; // Separate Lenis for mobile menu ul

  // --- Desktop Submenu Animation (≥768px) ---
  const setupDesktopMenu = () => {
    // --- Mega Menu Animation (Desktop) ---
    document.querySelectorAll(".has-megamenu").forEach((menu) => {
      const mega = menu.querySelector(".megamenu");
      if (!mega) return;

      gsap.set(mega, { display: "none", opacity: 0, y: -15 });

      const tl = gsap.timeline({ paused: true });

      tl.to(mega, {
        display: "flex",
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      })
        .from(
          mega.querySelectorAll(".mega-column, .mega-left, .mega-group"),
          {
            opacity: 0,
            y: 15,
            stagger: 0.05,
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
            stagger: 0.02,
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
    if (currentMenuMode === "mobile") return;

    if (currentMenuMode === "desktop") {
      // Cleanup: Remove desktop event listeners if needed
    }

    const toggleBtn = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    const menuUl = document.querySelector(".menu"); // The ul with overflow for Lenis

    if (!toggleBtn || !nav || !menuUl) {
      console.warn("Mobile menu elements not found. Skipping setup.");
      return;
    }

    if (!toggleBtn.dataset.listenerAttached) {
      const mobileTl = gsap.timeline({ paused: true, reversed: true });

      mobileTl
        .to(
          ".menu-toggle span:nth-child(1)",
          { y: 6, rotate: 45, duration: 0.25, ease: "power2.inOut" },
          0
        )
        .to(".menu-toggle span:nth-child(2)", { opacity: 0, duration: 0.2 }, 0)
        .to(
          ".menu-toggle span:nth-child(3)",
          { y: -6, rotate: -45, duration: 0.25, ease: "power2.inOut" },
          0
        )
        .to(nav, { right: 0, duration: 0.5, ease: "power3.out" }, "-=0.1")
        .from(
          document.querySelectorAll(".menu > li"),
          {
            opacity: 0,
            x: 40,
            stagger: 0.05,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.2"
        );

      const clickHandler = () => {
        const isMobile = window.innerWidth <= 991;
        if (!isMobile) return;

        if (mobileTl.reversed()) {
          // Menu opening: Stop body scroll and init menu Lenis
          document.body.style.overflow = "hidden"; // Lock body scroll
          if (typeof lenis !== "undefined") lenis.stop(); // Stop main Lenis

          // Create separate Lenis for the menu ul (matching your main Lenis options)
          menuLenis = new Lenis({
            wrapper: menuUl, // Target the ul for scrolling
            duration: 1.0, // Mobile-adjusted from your code
            smoothWheel: true,
            smoothTouch: true,
            touchMultiplier: 2.0, // Mobile-adjusted
            easing: (t) => 1 - Math.pow(1 - t, 3.2),
            direction: "vertical",
            gestureDirection: "vertical",
            infinite: false,
          });

          // Integrate menuLenis with GSAP ticker (like your main Lenis)
          gsap.ticker.add((time) => {
            if (menuLenis) menuLenis.raf(time * 1000);
          });

          mobileTl.timeScale(1).play();
          nav.classList.add("active");
          mobileTl.eventCallback("onReverseComplete", null);
        } else {
          // Menu closing: Restart body scroll and destroy menu Lenis
          mobileTl.timeScale(1).reverse();
          mobileTl.eventCallback("onReverseComplete", () => {
            nav.classList.remove("active");
            document.body.style.overflow = ""; // Unlock body scroll
            if (typeof lenis !== "undefined") lenis.start(); // Restart main Lenis

            // Destroy menu Lenis and remove ticker
            if (menuLenis) {
              gsap.ticker.remove(menuLenis.raf); // Remove from GSAP ticker
              menuLenis.destroy();
              menuLenis = null;
            }
          });
        }
      };

      toggleBtn.addEventListener("click", clickHandler);
      toggleBtn.dataset.listenerAttached = "true";
    }

    // Mobile submenu handling
    document.querySelectorAll(".mobile-submenu").forEach((item) => {
      const arrow = item.querySelector(".mobile-arrow");
      const submenu = item.querySelector(".megamenu");

      if (!arrow || !submenu) return;

      arrow.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains("open");

        document
          .querySelectorAll(".mobile-submenu.open")
          .forEach((openItem) => {
            if (openItem !== item) {
              gsap.to(openItem.querySelector(".megamenu"), {
                maxHeight: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => openItem.classList.remove("open"),
              });
              // openItem.querySelector(".mobile-arrow").textContent = "+";
            }
          });

        if (isOpen) {
          gsap.to(submenu, {
            maxHeight: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => item.classList.remove("open"),
          });
          // arrow.textContent = "+";
        } else {
          gsap.set(submenu, { maxHeight: "auto", opacity: 1 });
          const height = submenu.offsetHeight;
          gsap.set(submenu, { maxHeight: 0, opacity: 0 });
          gsap.to(submenu, {
            maxHeight: height,
            opacity: 1,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => item.classList.add("open"),
          });
          // arrow.textContent = "-";
        }
      });
    });

    document
      .querySelectorAll(".service-submenu .has-submenu .menu-head")
      .forEach((head) => {
        head.addEventListener("click", () => {
          const parent = head.closest(".has-submenu");
          const submenu = parent.querySelector(".submenu");
          const icon = head.querySelector(".icon");

          parent.classList.toggle("active");
          // icon.textContent = parent.classList.contains("active") ? "-" : "+";

          if (parent.classList.contains("active")) {
            gsap.fromTo(
              submenu,
              { maxHeight: 0, opacity: 0 },
              { maxHeight: 500, opacity: 1, duration: 0.3, ease: "power2.out" }
            );
          } else {
            gsap.to(submenu, {
              maxHeight: 0,
              opacity: 0,
              duration: 0.3,
              ease: "power2.inOut",
            });
          }
        });
      });

    currentMenuMode = "mobile";
  };

  // --- Initialize Based on Screen Size ---
  const initMenu = () => {
    if (window.innerWidth <= 991) {
      setupMobileMenu();
    } else {
      setupDesktopMenu();
    }
  };

  // Initialize immediately on load
  initMenu();

  window.addEventListener("resize", () => {
    gsap.killTweensOf("*");
    document
      .querySelectorAll(".submenu, .megamenu")
      .forEach((el) => gsap.set(el, { clearProps: "all" }));
    document.querySelector(".nav")?.classList.remove("active");
    document
      .querySelectorAll(".mobile-submenu")
      .forEach((el) => el.classList.remove("open"));
    // Cleanup on resize
    document.body.style.overflow = "";
    if (typeof lenis !== "undefined") lenis.start();
    if (menuLenis) {
      gsap.ticker.remove(menuLenis.raf);
      menuLenis.destroy();
      menuLenis = null;
    }
    currentMenuMode = null;
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

  // Testimonial Swiper — safe, isolated init (won't break pages without the section)
  (function initTestimonialSwiper() {
    try {
      const el = document.querySelector(".testimonial-swiper");
      if (!el) return; // safe early exit for pages without this section
      if (typeof Swiper === "undefined") {
        console.warn("Swiper not found — testimonial-swiper skipped.");
        return;
      }

      // destroy previous instance if present (dev hot-reload safety)
      if (window.testimonialSwiper?.destroy) {
        try {
          window.testimonialSwiper.destroy(true, true);
        } catch (e) {
          /* ignore */
        }
      }

      // Create new Swiper instance and expose to window (optional)
      window.testimonialSwiper = new Swiper(".testimonial-swiper", {
        direction: "horizontal",
        loop: true,
        grabCursor: true,
        keyboard: { enabled: true },
        watchOverflow: true,
        simulateTouch: true,

        // mobile-first defaults (no autoplay)
        slidesPerView: 1.15,
        spaceBetween: 20,
        freeMode: false,
        speed: 1200,
        autoplay: false,

        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        breakpoints: {
          // Mobile (>=639)
          639: {
            slidesPerView: 1.4,
            spaceBetween: 16,
            freeMode: false,
            speed: 1400,
            autoplay: false,
          },
          // Tablet (>=768)
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
            loop: true,
            freeMode: true,
            // continuous autoplay: use delay 0 if your Swiper version supports it reliably.
            // If you see issues, change delay to 1 (fallback).
            autoplay: {
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            },
            speed: 6000,
            loopedSlides: 8,
          },
          // Desktop (>=992) — marquee-like behavior
          992: {
            slidesPerView: 3,
            spaceBetween: 24,
            loop: true,
            freeMode: true,
            // continuous autoplay: use delay 0 if your Swiper version supports it reliably.
            // If you see issues, change delay to 1 (fallback).
            autoplay: {
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            },
            speed: 6000,
            loopedSlides: 8,
          },

          // Large Desktop (>=1200)
          1200: {
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            freeMode: true,
            autoplay: {
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            },
            speed: 9000,
            loopedSlides: 10,
          },
        },

        // Lifecycle hooks — ensure autoplay state matches active breakpoint
        on: {
          init(swiper) {
            try {
              if (
                swiper.params.autoplay &&
                typeof swiper.autoplay?.start === "function"
              ) {
                // force start only when autoplay configured
                swiper.autoplay.start();
              } else {
                swiper.autoplay?.stop?.();
              }
            } catch (e) {
              /* noop safe */
            }
          },
          breakpoint(swiper) {
            try {
              if (
                swiper.params.autoplay &&
                typeof swiper.autoplay?.start === "function"
              ) {
                swiper.autoplay.start();
              } else {
                swiper.autoplay?.stop?.();
              }
            } catch (e) {
              /* noop safe */
            }
          },
        },
      });
    } catch (err) {
      // very last-resort safety: do not let this module break other scripts
      console.error("testimonial-swiper init failed:", err);
    }
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

        breakpoints: {
          767: {
            perPage: 3, // 👈 show 3 logos on mobile
            gap: "0.6em",
          },
          480: {
            perPage: 2, // optional — even fewer on very small screens
            gap: "0.5em",
          },
        },
      }).mount(window.splide ? window.splide.Extensions : {});
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
  const servLeft = document.querySelector(".serv-left");

  if (slides.length > 0 && servicesTrigger && typeof gsap !== "undefined") {
    // Check mobile state
    const isMobile = window.innerWidth <= 767;
    // const lastIndex = slides.length - 1; // <-- Removed from here

    // --- SHARED HELPER: Update Active Class + Horizontal Scroll ---
    function updateMenu(activeIndex) {
      // Toggle Active Class
      menuItems.forEach((li, idx) =>
        li.classList.toggle("active", idx === activeIndex)
      );

      // Horizontal Scroll Logic (Mobile Only)
      if (servLeft && isMobile) {
        const activeItem = menuItems[activeIndex];
        if (activeItem) {
          const containerRect = servLeft.getBoundingClientRect();
          const itemRect = activeItem.getBoundingClientRect();
          const currentScroll = servLeft.scrollLeft;
          const relativeOffset = itemRect.left - containerRect.left;

          // Calculate center target
          const targetX =
            currentScroll +
            relativeOffset -
            servLeft.clientWidth / 2 +
            itemRect.width / 2;

          if (gsap.plugins.scrollTo) {
            gsap.to(servLeft, {
              duration: 0.3,
              scrollTo: { x: targetX },
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            servLeft.scrollLeft = targetX;
          }
        }
      }
    }

    // Init first state
    updateMenu(0);

    // ==================================================================
    // 📱 MOBILE LOGIC: Sticky Header + Native Scroll Flow
    // ==================================================================
    if (isMobile) {
      // Define lastIndex within the mobile scope to ensure accessibility
      const lastIndex = slides.length - 1;

      // 1. Sticky Menu (Pin the .serv-left only)
      // We are adding boundary handlers here to ensure the state is locked when entering/exiting the whole section.
      ScrollTrigger.create({
        trigger: servLeft,
        start: "top top+=0",
        endTrigger: servicesTrigger,
        end: "bottom bottom-=200",
        pin: true,
        pinSpacing: false,
        pinReparent: true,
        anticipatePin: 1,

        // --- FIX: Boundary Handlers for seamless transition out of the section ---
        onEnter: () => updateMenu(0), // Scrolling down: Lock to first item immediately upon pin start
        onLeaveBack: () => updateMenu(0), // Scrolling up: Lock to first item when unpinning

        onLeave: () => updateMenu(lastIndex), // Scrolling down: Lock to last item when unpinning at bottom
        onEnterBack: () => updateMenu(lastIndex), // Scrolling up: Lock to last item when re-entering from bottom
      });

      // 2. ScrollSpy (Trigger active class as slides scroll by)
      slides.forEach((slide, i) => {
        ScrollTrigger.create({
          trigger: slide,
          start: "top center",
          end: "bottom center",
          onEnter: () => updateMenu(i),
          onEnterBack: () => updateMenu(i),

          // This is the correct intermediate chaining for scrolling up (i.e., 3 -> 2 -> 1)
          onLeaveBack: () => {
            if (i > 0) {
              updateMenu(i - 1);
            }
          },
        });
      });

      // Ensure slides are visible
      gsap.set(slides, { y: 0, opacity: 1 });
      // High Z-Index to ensure it sits on top of scrolling content
      gsap.set(servLeft, { zIndex: 0, position: "relative" });
    }
    // ==================================================================
    // 💻 DESKTOP LOGIC: Whole Section Pin + Card Stacking
    // ==================================================================
    else {
      const scrollPerSlide = 550;

      // Ensure the first slide is visible initially
      gsap.set(slides[0], { y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: servicesTrigger,
          start: "top top",
          end: `+=${slides.length * scrollPerSlide}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
        },
      });

      slides.forEach((slide, i) => {
        // Set z-index for correct card stacking order (i=0 -> zIndex=1, i=1 -> zIndex=2, etc.)
        gsap.set(slide, { zIndex: i + 1 });

        if (i !== 0) {
          // Prepare subsequent slides to slide IN from bottom
          gsap.set(slide, { y: "100%" });

          tl.to(slide, {
            y: "0%",
            duration: 1,
            ease: "none",
            onStart: () => {
              if (tl.scrollTrigger.direction > 0) updateMenu(i);
            },
            onReverseComplete: () => {
              if (tl.scrollTrigger.direction < 0) updateMenu(i - 1);
            },
          });
        }
      });
    }
  } else {
    console.warn("GSAP Pin Section elements not found.");
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
  } else {
    console.warn(
      "Case Studies: Isotope + Splide + GSAP Sync Not found. Script skipped."
    );
  }

  // --- BUILD SPLIDE FROM VISIBLE ITEMS ---
  function buildSplideFromVisibleItems() {
    const visibleItems = Array.from(
      grid.querySelectorAll(".grid-item:not([style*='display: none'])")
    );

    const splideList = document.querySelector(
      ".case-study-slider .splide__list"
    );

    // FIX 1: Check if splideList exists before setting innerHTML
    if (!splideList) {
      console.warn(
        "⚠️ SPLIDE list container not found. Skipping Splide setup."
      );
      return;
    }

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

      // Custom pagination container
      const customPagination = document.querySelector(
        ".splide_custom_pagination"
      );

      // FIX 2: Check if customPagination exists before setting innerHTML
      if (customPagination) {
        customPagination.innerHTML = "";

        // Build bullets based on slide count
        visibleItems.forEach((_, i) => {
          const bullet = document.createElement("button");
          bullet.className = "splide-custom-bullet";
          if (i === 0) bullet.classList.add("active");
          bullet.dataset.slide = i;
          customPagination.appendChild(bullet);
        });

        // Bullet click → go to slide
        const bullets = customPagination.querySelectorAll(
          ".splide-custom-bullet"
        );

        bullets.forEach((bullet) => {
          bullet.addEventListener("click", () => {
            const index = Number(bullet.dataset.slide);
            caseStudySlider.go(index);
          });
        });

        // Sync bullets with slider movement
        caseStudySlider.on("move", function (newIndex) {
          bullets.forEach((b) => b.classList.remove("active"));
          bullets[newIndex].classList.add("active");
        });
      } else {
        console.warn(
          "⚠️ Custom pagination container not found. Pagination will not work."
        );
      }
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

  // ! --- 7. GSAP Animated Tabs (Desktop + Mobile Dropdown) ---
  (function initAnimatedTabs() {
    const tabsSection = document.querySelector(".animated-tabs");
    if (!tabsSection) return; // <-- Now this ONLY exits this function

    const tabButtonsContainer = tabsSection.querySelector(".tab-buttons");
    if (!tabButtonsContainer) return;

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

    // --- Desktop button click ---
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.dataset.tab;
        setActiveTab(tabName);
        selected.textContent = btn.textContent;
      });
    });

    // --- Core Tab Switch Animation ---
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
  })();

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
    disable: "mobile",
  });

  const BREAKPOINT_MOBILE = 767; // Defined once

  // ! -- 13. Country Selector (Isolated)
  (() => {
    const phoneInput = document.querySelector("#phone");

    // Guard: If field doesn't exist or is already initialized → exit this module only
    if (!phoneInput || phoneInput.dataset.itiInit === "true") return;

    // Guard: If intlTelInput isn't loaded → exit this module only
    if (typeof window.intlTelInput === "undefined") {
      console.warn("intlTelInput library not loaded.");
      return;
    }

    phoneInput.dataset.itiInit = "true";

    window.intlTelInput(phoneInput, {
      initialCountry: "in",
      preferredCountries: ["in", "us", "gb", "ca", "au"],
      separateDialCode: true,
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.6.1/js/utils.js",
    });
  })();

  // ----------------------------------------------------------------------

  // ! -- 14. Responsive Structure Change (Isolated)
  (() => {
    const ftContact = document.querySelector(".ftcontact");
    const ftMenus = document.querySelector(".ftmenurow");
    const ftmenusWrapper = document.querySelector(".ftmenus");

    if (!ftContact || !ftMenus || !ftmenusWrapper) return; // Exit this module only

    function moveFooterContact() {
      if (window.innerWidth <= BREAKPOINT_MOBILE) {
        const allFtMenus = ftMenus.querySelectorAll(".ftmenu");
        const lastMenu = allFtMenus[allFtMenus.length - 1];

        // Check if lastMenu exists before attempting to insert
        if (lastMenu) {
          // Move ftcontact after last ftmenu
          lastMenu.insertAdjacentElement("afterend", ftContact);
        }
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
  })();

  // ----------------------------------------------------------------------

  // ! -- 15. UI/UX Tab Switcher (Optimized Smooth Version)
  (() => {
    const uiuxtab = document.querySelector(".uiuxtab");
    if (!uiuxtab) return;

    const tabItems = uiuxtab.querySelectorAll(".stickytabnav ul li");
    const tabSwitcherRows = uiuxtab.querySelectorAll(
      ".col-md-8 > .row.tabswitcher"
    );

    if (
      tabItems.length === 0 ||
      tabSwitcherRows.length === 0 ||
      tabItems.length !== tabSwitcherRows.length
    ) {
      console.warn("UI/UX Tab Switcher setup incomplete.");
      return;
    }

    if (typeof gsap === "undefined") {
      console.warn("GSAP not loaded. Animation skipped.");
      return;
    }

    // INITIAL STATES
    tabSwitcherRows.forEach((row, i) => {
      const active = tabItems[i].classList.contains("active");
      gsap.set(row, {
        opacity: active ? 1 : 0,
        y: active ? 0 : 10,
        filter: active ? "blur(0px)" : "blur(8px)",
        display: active ? "flex" : "none",
        position: active ? "relative" : "absolute",
        visibility: active ? "visible" : "hidden",
      });
    });

    // CLICK HANDLER
    tabItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        if (item.classList.contains("active")) return;

        // Switch active class
        tabItems.forEach((li) => li.classList.remove("active"));
        item.classList.add("active");

        const currentRow = [...tabSwitcherRows].find(
          (r) => r.style.display === "flex"
        );
        const newRow = tabSwitcherRows[index];

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // PREPARE NEW ROW (ABSOLUTE + INVISIBLE)
        gsap.set(newRow, {
          display: "block",
          position: "absolute",
          visibility: "hidden",
          opacity: 0,
          y: 15,
          filter: "blur(6px)",
          pointerEvents: "none",
        });

        // OUT ANIMATION FOR CURRENT ROW
        if (currentRow && currentRow !== newRow) {
          tl.to(currentRow, {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            duration: 0.35,
            onComplete: () => {
              // ONLY HIDE AFTER ANIMATION IS DONE
              gsap.set(currentRow, {
                display: "none",
                position: "absolute",
                visibility: "hidden",
              });
            },
          });
        }

        // SWITCH LAYOUT: MAKE NEW ROW TAKE THE SPACE
        tl.set(newRow, {
          position: "relative",
          visibility: "visible",
          display: "flex",
        });

        // IN ANIMATION FOR NEW ROW
        tl.to(newRow, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.45,
          pointerEvents: "auto",
        });

        // Accordion text animation
        tabItems.forEach((li, i2) => {
          const p = li.querySelector("p");
          if (!p) return;

          gsap.killTweensOf(p);

          if (i2 === index) {
            gsap.fromTo(
              p,
              { height: 0, opacity: 0, display: "block" },
              { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
            );
          } else {
            gsap.to(p, {
              height: 0,
              opacity: 0,
              duration: 0.25,
              ease: "power2.inOut",
              onComplete: () => (p.style.display = "none"),
            });
          }
        });
      });
    });
  })();

  // ! -- 16. Copy blog URL button
  document.addEventListener("click", function (e) {
    const link = e.target.closest(".copy-link");
    if (!link) return; // button না থাকলে exit

    e.preventDefault();

    const linkToCopy = window.location.href;

    // Copy to clipboard
    navigator.clipboard.writeText(linkToCopy);

    // Create span
    const span = document.createElement("span");
    span.className = link.className;
    span.innerHTML = 'Copied <i class="fa-solid fa-check"></i>';

    // Replace a → span
    link.replaceWith(span);
  });

  // ! -- 17. Equal height of "Trust us" box
  $(".trustbx-inner").matchHeight();
});
