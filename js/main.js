(() => {
  const WEDDING_DATE = new Date("2026-12-11T10:00:00+05:30");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Floating feather particles */
  const drift = document.getElementById("feather-drift");
  if (drift && !reducedMotion) {
    for (let i = 0; i < 10; i += 1) {
      const feather = document.createElement("span");
      feather.className = "feather-particle";
      feather.style.left = `${Math.random() * 100}%`;
      feather.style.animationDuration = `${12 + Math.random() * 16}s`;
      feather.style.animationDelay = `${Math.random() * 10}s`;
      feather.style.transform = `scale(${0.5 + Math.random() * 0.9})`;
      drift.appendChild(feather);
    }
  }

  /* Nav */
  const nav = document.querySelector(".site-nav");
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* Peacocks move with scroll */
  const peacocks = [...document.querySelectorAll("[data-parallax]")];
  const updatePeacocks = () => {
    if (reducedMotion || !peacocks.length) return;
    const y = window.scrollY;
    peacocks.forEach((el) => {
      const factor = Number(el.dataset.parallax) || 0.15;
      const flip = el.classList.contains("peacock--door-left") ? "scaleX(-1) " : "";
      el.style.transform = `${flip}translate3d(0, ${y * factor}px, 0)`;
    });
  };

  /* Door opening → lake / resort reveal */
  const scene = document.querySelector(".door-scene");
  const doorLeft = document.querySelector("[data-door-left]");
  const doorRight = document.querySelector("[data-door-right]");
  const reveal = document.querySelector("[data-door-reveal]");

  const updateDoors = () => {
    if (!scene || !doorLeft || !doorRight || !reveal) return;

    if (reducedMotion) {
      doorLeft.style.transform = "rotateY(-82deg)";
      doorRight.style.transform = "rotateY(82deg)";
      reveal.style.opacity = "1";
      reveal.style.transform = "scale(1)";
      return;
    }

    const rect = scene.getBoundingClientRect();
    const total = scene.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = total > 0 ? scrolled / total : 1;

    const angle = progress * 82;
    doorLeft.style.transform = `rotateY(${-angle}deg)`;
    doorRight.style.transform = `rotateY(${angle}deg)`;

    const revealProgress = Math.max(0, (progress - 0.12) / 0.55);
    reveal.style.opacity = String(Math.min(revealProgress, 1));
    reveal.style.transform = `scale(${0.98 + Math.min(revealProgress, 1) * 0.02})`;
  };

  const onScroll = () => {
    updateDoors();
    updatePeacocks();
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateDoors);

  /* Section reveals */
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
      daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = "00";
      return;
    }
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = pad(secs);
  };

  tick();
  setInterval(tick, 1000);
})();
