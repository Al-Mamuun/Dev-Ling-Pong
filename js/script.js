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
