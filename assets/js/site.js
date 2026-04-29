document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector("header");
  const nav = document.querySelector("header nav");
  const currentPage = window.location.pathname.split("\\").pop().split("/").pop() || "index.html";
  const pageSlug = currentPage.replace(".html", "").toLowerCase();

  body.dataset.page = pageSlug;
  if (!body.classList.contains(`page-${pageSlug}`)) {
    body.classList.add(`page-${pageSlug}`);
  }

  if (!document.querySelector(".skip-link")) {
    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = "#main-content";
    skipLink.textContent = "Aller au contenu";
    body.insertAdjacentElement("afterbegin", skipLink);
  }

  if (nav) {
    nav.setAttribute("aria-label", "Navigation principale");

    const navLinks = [...nav.querySelectorAll("a[href]")];
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isVeilleSubPage = href === "veille.html" && pageSlug.startsWith("veille");
      if (href === currentPage || isVeilleSubPage) {
        link.setAttribute("aria-current", "page");
      }
    });

    if (!nav.id) {
      nav.id = "site-navigation";
    }

    if (header && !header.querySelector(".nav-toggle")) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "nav-toggle";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", nav.id);
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      toggle.innerHTML = [
        '<span class="nav-toggle-bar"></span>',
        '<span class="nav-toggle-bar"></span>',
        '<span class="nav-toggle-bar"></span>'
      ].join("");

      header.insertBefore(toggle, nav);

      const closeMenu = () => {
        body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Ouvrir le menu");
      };

      toggle.addEventListener("click", () => {
        const isOpen = body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
      });

      navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
          closeMenu();
        }
      });
    }
  }

  const mainTarget =
    document.querySelector("main") ||
    document.querySelector(".content-wrapper") ||
    document.querySelector(".about-content");

  if (mainTarget && !mainTarget.id) {
    mainTarget.id = "main-content";
  }

  document.querySelectorAll("img").forEach((image) => {
    if (!image.hasAttribute("loading")) {
      image.setAttribute("loading", "lazy");
    }
    if (!image.hasAttribute("decoding")) {
      image.setAttribute("decoding", "async");
    }
  });

  const revealTargets = [
    ...document.querySelectorAll(".project, .skill-tile, .source-card, .socials a, .hero-badge, .hero-stat, .section-kicker, .synthese-link, .content-wrapper > *, .about-content > *, main > *, .projects-grid > *")
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const disableScrollReveal = pageSlug.startsWith("veille");

  if (revealTargets.length > 0) {
    revealTargets.forEach((item) => item.classList.add("reveal-on-scroll"));

    if (disableScrollReveal || reducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((item) => item.classList.add("is-visible"));
    } else {
      const shouldRevealNow = (item) => {
        const rect = item.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      revealTargets.forEach((item) => {
        if (shouldRevealNow(item)) {
          item.classList.add("is-visible");
        } else {
          observer.observe(item);
        }
      });
    }
  }

  const updateHeaderState = () => {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
});
