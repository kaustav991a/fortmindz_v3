document.addEventListener("DOMContentLoaded", function () {
  // ! Custom Menu
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  if (!toggle || !menu) {
    console.warn("Menu toggle or menu not found. Check your selectors.");
    return;
  }

  const submenuParents = Array.from(menu.querySelectorAll(".has-submenu > a"));

  // Accessibility helpers
  const openMenu = () => {
    toggle.classList.add("active");
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open"); // optional: lock scroll in CSS
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

  // main toggle click
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // click-outside to close
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

  // Submenu behaviour (works on mobile and desktop; mobile uses accordion)
  submenuParents.forEach((link) => {
    const parentLi = link.parentElement;
    // ensure aria attributes
    link.setAttribute("aria-haspopup", "true");
    link.setAttribute(
      "aria-expanded",
      parentLi.classList.contains("open") ? "true" : "false"
    );

    link.addEventListener("click", (e) => {
      // mobile behaviour: toggle accordion (<= 767)
      if (window.innerWidth <= 767) {
        e.preventDefault(); // prevent navigation on parent
        parentLi.classList.toggle("open");
        const isOpen = parentLi.classList.contains("open");
        link.setAttribute("aria-expanded", isOpen ? "true" : "false");
      } else {
        // desktop: let anchor work normally (or you may want to prevent and show submenu)
        // If you want hover-only on desktop, simply return here.
        // e.preventDefault(); // <-- uncomment if parent links should not navigate on desktop
      }
    });
  });

  // keep things sane on resize: remove mobile open states when switching to desktop
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 767) {
        // ensure the mobile panel is closed when moving to desktop view
        closeMenu();
        // optionally remove inline styles or heights on submenus
        menu
          .querySelectorAll(".has-submenu")
          .forEach((li) => li.classList.remove("open"));
      }
    }, 120);
  });

  // OPTIONAL: If your markup is injected dynamically, observe mutations to re-bind - not usually needed.
  // ! Custom Menu

  // --------------------------------------------------------------------

  // ! Banner soft Mask
  const banner = document.querySelector(".banner");
  const initZero = document.querySelector(".init-zero"); // The top, masked element

  if (!banner || !initZero) {
    console.error("Required elements (.banner or .init-zero) not found.");
    return;
  }

  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;

  // Get the initial top offset of the banner container
  // This value is constant if the banner is at the top of the page.
  const bannerRect = banner.getBoundingClientRect();
  const topOffset = bannerRect.top; // The distance from the viewport top to the banner top

  /**
   * Updates the CSS Custom Properties for the mask position.
   */
  function updateMaskPosition() {
    // Update the custom properties on the top layer image element.
    initZero.style.setProperty("--mask-x", `${mouseX}px`);
    initZero.style.setProperty("--mask-y", `${mouseY}px`);

    rafId = null;
  }

  /**
   * Mousemove event handler with coordinate correction.
   * @param {MouseEvent} e - The mouse event object.
   */
  function handleMouseMove(e) {
    // X-coordinate is relative to the *banner's left edge*, so use clientX - bannerRect.left
    mouseX = e.clientX - bannerRect.left;

    // Y-coordinate needs to be adjusted by the banner's top offset.
    // This makes the mask position relative to the top of the banner container.
    mouseY = e.clientY - topOffset; // <-- THE CRITICAL FIX

    // Use requestAnimationFrame for performance
    if (rafId === null) {
      rafId = window.requestAnimationFrame(updateMaskPosition);
    }
  }

  /**
   * Mouseleave event handler.
   */
  function handleMouseLeave() {
    // Reset the mask position to the initial state (outside the viewport)
    initZero.style.setProperty("--mask-x", `-50px`);
    initZero.style.setProperty("--mask-y", `-50px`);

    // Cancel any pending requestAnimationFrame
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Attach the event listeners
  banner.addEventListener("mousemove", handleMouseMove);
  banner.addEventListener("mouseleave", handleMouseLeave);
  // ! Banner soft Mask

  // --------------------------------------------------------------------

  //! Initialization function for the marquee slider
  //! We use the AutoScroll extension to achieve the smooth, continuous motion.
  new Splide(".logo-slider", {
    type: "loop",
    perPage: 6,
    arrows: false,
    pagination: false,
    focus: "center",
    gap: "1em",
  }).mount(window.splide.Extensions);

  // ! --------------------------------------
  // ! GSAP Pin section
  // ! --------------------------------------
  gsap.registerPlugin(ScrollTrigger);

  const slides = gsap.utils.toArray(".serv-scroll-slide .slide-inner");
  const menuItems = gsap.utils.toArray(".serv-left li");

  // show the first one initially
  gsap.set(slides[0], { y: 0 });

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".our-services",
      start: "top top",
      end: "+=" + slides.length * 800,
      scrub: true,
      pin: true,
      anticipatePin: 1,
    },
  });

  slides.forEach((slide, i) => {
    if (i !== 0) {
      tl.to(
        slide,
        {
          y: 0,
          duration: 1,
          ease: "power3.out",
          onStart: () => updateMenu(i),
          onReverseComplete: () => updateMenu(i - 1),
        },
        "+=0.5"
      );
    }
  });

  function updateMenu(activeIndex) {
    menuItems.forEach((li, idx) =>
      li.classList.toggle("active", idx === activeIndex)
    );
  }

  // ! --------------------------------------
  // ! GSAP Pin section
  // ! --------------------------------------
});
