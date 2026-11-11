(() => {
  const WEDDING_DATE = new Date("2026-12-11T10:00:00+05:30");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Floating feather particles */
  const drift = document.getElementById("feather-drift");
  if (drift && !reducedMotion) {
    for (let i = 0; i < 12; i += 1) {
      const feather = document.createElement("span");
      feather.className = "feather-particle";
      feather.style.left = `${Math.random() * 100}%`;
      feather.style.animationDuration = `${12 + Math.random() * 16}s`;
      feather.style.animationDelay = `${Math.random() * 10}s`;
      feather.style.transform = `scale(${0.5 + Math.random() * 0.9})`;
      drift.appendChild(feather);
    }
  }

  /* Nav scroll state */
  const nav = document.querySelector(".site-nav");
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* Door opening tied to sticky scroll scene */
  const scene = document.querySelector(".door-scene");
  const doorLeft = document.querySelector("[data-door-left]");
  const doorRight = document.querySelector("[data-door-right]");
  const reveal = document.querySelector("[data-door-reveal]");

  const updateDoors = () => {
    if (!scene || !doorLeft || !doorRight || !reveal) return;

    if (reducedMotion) {
      doorLeft.style.transform = "rotateY(-78deg)";
      doorRight.style.transform = "rotateY(78deg)";
      reveal.style.opacity = "1";
      reveal.style.transform = "scale(1)";
      return;
    }

    const rect = scene.getBoundingClientRect();
    const total = scene.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = total > 0 ? scrolled / total : 1;

    const angle = progress * 78;
    doorLeft.style.transform = `rotateY(${-angle}deg)`;
    doorRight.style.transform = `rotateY(${angle}deg)`;

    const revealProgress = Math.max(0, (progress - 0.15) / 0.55);
    reveal.style.opacity = String(Math.min(revealProgress, 1));
    reveal.style.transform = `scale(${0.96 + Math.min(revealProgress, 1) * 0.04})`;
  };

  updateDoors();
  window.addEventListener("scroll", updateDoors, { passive: true });
  window.addEventListener("resize", updateDoors);

  /* Section reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  if (reducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Countdown */
  const daysEl = document.querySelector("[data-days]");
  const hoursEl = document.querySelector("[data-hours]");
  const minsEl = document.querySelector("[data-mins]");
  const secsEl = document.querySelector("[data-secs]");

  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  const tick = () => {
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    const now = new Date();
    let diff = WEDDING_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * 1000 * 60;
    const secs = Math.floor(diff / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = pad(secs);
  };

  tick();
  setInterval(tick, 1000);
})();
