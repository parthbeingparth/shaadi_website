(() => {
  const cfg = window.weddingConfig || {};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Petals */
  const drift = document.getElementById("petal-drift");
  if (drift && !reducedMotion) {
    for (let i = 0; i < 10; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${11 + Math.random() * 14}s`;
      petal.style.animationDelay = `${Math.random() * 8}s`;
      petal.style.transform = `scale(${0.5 + Math.random()})`;
      drift.appendChild(petal);
    }
  }

  /* Mobile nav */
  const nav = document.getElementById("site-nav") || document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("primary-nav");
  toggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  const onScrollNav = () => {
    nav?.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* Venue labels */
  document.querySelectorAll("[data-venue-label]").forEach((el) => {
    el.textContent = cfg.venue?.label || "Venue details to follow";
  });

  /* Events from config */
  const eventsRoot = document.getElementById("events-root");
  if (eventsRoot && Array.isArray(cfg.events)) {
    const days = [
      { day: 1, title: "Day One — Friday, 11 December 2026" },
      { day: 2, title: "Day Two — Saturday, 12 December 2026" },
    ];
    eventsRoot.innerHTML = days
      .map((d) => {
        const items = cfg.events.filter((e) => e.day === d.day);
        const cards = items
          .map(
            (e) => `
          <article class="event-card event-card--${e.accent || "champagne"} reveal-on-scroll">
            <div class="event-card__arch">
              <p class="event-card__time">${e.timeLabel}</p>
              <h4 class="event-card__name">${e.name}</h4>
              <p class="event-card__desc">${e.description}</p>
              <p class="event-card__venue">${cfg.venue?.label || "Venue details to follow"}</p>
            </div>
          </article>`
          )
          .join("");
        return `
          <div class="day-panel day-panel--${d.day} reveal-on-scroll">
            <p class="day-panel__label">The Celebrations</p>
            <h3 class="day-panel__title">${d.title}</h3>
            <div class="event-timeline">${cards}</div>
          </div>`;
      })
      .join("");
  }

  /* Doors */
  const scene = document.querySelector(".door-scene");
  const doorLeft = document.querySelector("[data-door-left]");
  const doorRight = document.querySelector("[data-door-right]");
  const reveal = document.querySelector("[data-door-reveal]");

  const updateDoors = () => {
    if (!scene || !doorLeft || !doorRight || !reveal) return;
    if (reducedMotion) {
      doorLeft.style.transform = "rotateY(-80deg)";
      doorRight.style.transform = "rotateY(80deg)";
      reveal.style.opacity = "1";
      reveal.style.transform = "scale(1)";
      return;
    }
    const total = scene.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-scene.getBoundingClientRect().top, 0), total);
    const progress = total > 0 ? scrolled / total : 1;
    const angle = progress * 80;
    doorLeft.style.transform = `rotateY(${-angle}deg)`;
    doorRight.style.transform = `rotateY(${angle}deg)`;
    const rp = Math.max(0, (progress - 0.1) / 0.55);
    reveal.style.opacity = String(Math.min(rp, 1));
    reveal.style.transform = `scale(${0.97 + Math.min(rp, 1) * 0.03})`;
  };
  updateDoors();
  window.addEventListener("scroll", updateDoors, { passive: true });
  window.addEventListener("resize", updateDoors);

  /* Reveals */
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
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Countdown */
  const target = new Date(cfg.countdown || "2026-12-11T10:00:00+05:30");
  const daysEl = document.querySelector("[data-days]");
  const hoursEl = document.querySelector("[data-hours]");
  const minsEl = document.querySelector("[data-mins]");
  const secsEl = document.querySelector("[data-secs]");
  const doneEl = document.getElementById("countdown-done");
  const timerEl = document.getElementById("countdown");
  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  const tick = () => {
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;
    let diff = target.getTime() - Date.now();
    if (diff <= 0) {
      if (timerEl) timerEl.hidden = true;
      if (doneEl) doneEl.hidden = false;
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

  /* Greeting audio */
  const audio = document.getElementById("greeting-audio");
  const playBtn = document.getElementById("greeting-play");
  const missing = document.getElementById("greeting-missing");
  if (audio && playBtn) {
    const src = cfg.greeting?.audioSrc || "assets/audio/childhood-greeting.mp3";
    audio.src = src;
    fetch(src, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) throw new Error("missing");
        if (missing) missing.hidden = true;
      })
      .catch(() => {
        playBtn.disabled = true;
        if (missing) missing.hidden = false;
      });
    playBtn.addEventListener("click", async () => {
      try {
        await audio.play();
        playBtn.textContent = "Playing…";
      } catch {
        playBtn.textContent = "Tap to Hear My Message";
      }
    });
    audio.addEventListener("ended", () => {
      playBtn.textContent = "Tap to Hear My Message";
    });
  }
})();
