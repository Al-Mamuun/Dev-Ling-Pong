// Footer year
const yearEl = document.getElementById("current-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Industries pill toggle
const pills = document.querySelectorAll(".ind-pill");
pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((p) => {
      p.classList.remove("is-active");
      p.setAttribute("aria-pressed", "false");
    });
    pill.classList.add("is-active");
    pill.setAttribute("aria-pressed", "true");
  });
});

// Nav link highlight on scroll
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id,
          );
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px" },
  );
  sections.forEach((s) => observer.observe(s));
}

// Mobile menu
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-links");
if (navToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navToggle.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
  navMenu
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
}

// Back to top
const toTop = document.getElementById("to-top");
if (toTop) {
  window.addEventListener(
    "scroll",
    () => toTop.classList.toggle("show", window.scrollY > 600),
    { passive: true },
  );
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

// Stats count-up (runs once when stats come into view)
const counters = document.querySelectorAll("[data-count]");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / 1200, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + "+";
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach((el) => countObserver.observe(el));
}

// Contact form validation
const form = document.getElementById("contact-form");
if (form) {
  const status = document.getElementById("form-status");
  const messages = {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    service: "Please choose a service.",
    message: "Please tell us a little about your project.",
  };

  const check = (field) => {
    const wrap = field.closest(".field");
    const valid = field.checkValidity() && field.value.trim() !== "";
    wrap.classList.toggle("invalid", !valid);
    wrap.querySelector(".error").textContent = valid
      ? ""
      : messages[field.name];
    return valid;
  };

  form.querySelectorAll("input, select, textarea").forEach((f) => {
    f.addEventListener("blur", () => check(f));
    f.addEventListener(
      "input",
      () => f.closest(".field").classList.contains("invalid") && check(f),
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll("input, select, textarea")];
    const allValid = fields.map(check).every(Boolean);
    if (!allValid) {
      status.textContent = "";
      fields
        .find((f) => f.closest(".field").classList.contains("invalid"))
        .focus();
      return;
    }
    // TODO: send the data to your backend or a form service (Formspree, Web3Forms, EmailJS).
    status.textContent =
      "Thank you! We have received your message and will reply soon.";
    form.reset();
  });
}
