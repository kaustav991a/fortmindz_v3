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
      display: "block",
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

      document.querySelectorAll(".mobile-submenu.open").forEach((openItem) => {
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
