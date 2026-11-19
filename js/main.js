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
  const venueLabel =
    cfg.venue?.label ||
    cfg.venue?.name ||
    "Venue details to follow";
  const venueAddress =
    cfg.venue?.addressShort || cfg.venue?.address || "";
  const venueMapUrl = cfg.venue?.mapUrl || "";

  document.querySelectorAll("[data-venue-label]").forEach((el) => {
    el.textContent = venueLabel;
  });

  document.querySelectorAll("[data-venue-address]").forEach((el) => {
    if (!venueAddress) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.textContent = venueAddress;
  });

  document.querySelectorAll("[data-venue-map]").forEach((el) => {
    if (!venueMapUrl) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.setAttribute("href", venueMapUrl);
  });

  const venueLine = venueAddress
    ? `${venueLabel}<br /><span class="event-card__venue-address">${venueAddress}</span>`
    : venueLabel;

  /* Events from config */
  const eventsRoot = document.getElementById("events-root");
  if (eventsRoot && Array.isArray(cfg.events)) {
    const days =
      Array.isArray(cfg.programmeDays) && cfg.programmeDays.length
        ? cfg.programmeDays
        : [
            { id: "day-1", label: "The Celebrations", title: "Day One" },
            { id: "day-2", label: "The Celebrations", title: "Day Two" },
          ];
    eventsRoot.innerHTML = days
      .map((d, index) => {
        const items = cfg.events.filter((e) =>
          d.id ? e.dayId === d.id : e.day === d.day
        );
        if (!items.length) return "";
        const cards = items
          .map((e) => {
            const eventVenue = e.venueLabel || venueLine;
            const eventMap = e.mapUrl || (e.venueLabel ? null : venueMapUrl);
            return `
          <article class="event-card event-card--${e.accent || "champagne"} reveal-on-scroll">
            <div class="event-card__arch">
              <p class="event-card__time">${e.timeLabel}</p>
              <h4 class="event-card__name">${e.name}</h4>
              <p class="event-card__desc">${e.description || ""}</p>
              <p class="event-card__venue">${eventVenue}${
                eventMap
                  ? `<br /><a class="event-card__map" href="${eventMap}" target="_blank" rel="noopener noreferrer">View on map</a>`
                  : ""
              }</p>
            </div>
          </article>`;
          })
          .join("");
        return `
          <div class="day-panel day-panel--${index + 1} reveal-on-scroll">
            <p class="day-panel__label">${d.label || "The Celebrations"}</p>
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
  const autoDoors = scene && scene.classList.contains("door-scene--auto");

  const openDoors = (progress = 1) => {
    if (!doorLeft || !doorRight || !reveal) return;
    const angle = progress * 80;
    doorLeft.style.transform = `rotateY(${-angle}deg)`;
    doorRight.style.transform = `rotateY(${angle}deg)`;
    const rp = Math.max(0, (progress - 0.08) / 0.55);
    reveal.style.opacity = String(Math.min(rp, 1));
    reveal.style.transform = `scale(${0.97 + Math.min(rp, 1) * 0.03})`;
    if (progress >= 1) scene?.classList.add("is-open");
  };

  if (scene && doorLeft && doorRight && reveal) {
    if (reducedMotion || autoDoors) {
      if (reducedMotion) {
        openDoors(1);
      } else {
        openDoors(0);
        window.requestAnimationFrame(() => {
          window.setTimeout(() => {
            scene.classList.add("is-animating");
            openDoors(1);
          }, 350);
        });
      }
    } else {
      const updateDoors = () => {
        const total = scene.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-scene.getBoundingClientRect().top, 0), total);
        const progress = total > 0 ? scrolled / total : 1;
        openDoors(progress);
      };
      updateDoors();
      window.addEventListener("scroll", updateDoors, { passive: true });
      window.addEventListener("resize", updateDoors);
    }
  }

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

  /* Landing — Idha invite
     Browsers block unmuted autoplay. One user tap starts playback reliably
     (especially iOS Safari / in-app browsers). */
  const idhaAudio = document.getElementById("idha-audio");
  const idhaPlay = document.getElementById("idha-play");
  const idhaUnlock = document.getElementById("idha-unlock");
  if (idhaAudio && idhaPlay) {
    const audioSrc =
      (window.weddingConfig && window.weddingConfig.landing && window.weddingConfig.landing.audioSrc) ||
      "/assets/audio/idha-invite.m4a";

    if (idhaAudio.getAttribute("src") !== audioSrc) {
      idhaAudio.src = audioSrc;
    }
    idhaAudio.setAttribute("playsinline", "");
    idhaAudio.setAttribute("webkit-playsinline", "");
    idhaAudio.preload = "auto";
    idhaAudio.muted = false;
    idhaAudio.volume = 1;

    let unlocked = false;

    const setPlaying = (playing) => {
      idhaPlay.classList.toggle("is-playing", playing);
      idhaPlay.textContent = playing ? "Playing…" : "Hear Idha";
    };

    const hideUnlock = () => {
      if (!idhaUnlock) return;
      idhaUnlock.hidden = true;
      idhaUnlock.classList.remove("is-visible");
    };

    const showUnlock = () => {
      if (!idhaUnlock) return;
      idhaUnlock.hidden = false;
      idhaUnlock.classList.add("is-visible");
    };

    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", onFirstGesture, true);
      window.removeEventListener("touchstart", onFirstGesture, true);
      window.removeEventListener("click", onFirstGesture, true);
    };

    const playFromGesture = () => {
      idhaAudio.muted = false;
      idhaAudio.volume = 1;
      try {
        if (idhaAudio.readyState >= 1 && idhaAudio.currentTime > 0.05) {
          idhaAudio.currentTime = 0;
        }
      } catch (_) {
        /* ignore seek errors before metadata */
      }

      const playPromise = idhaAudio.play();
      if (playPromise && typeof playPromise.then === "function") {
        return playPromise
          .then(() => {
            unlocked = true;
            hideUnlock();
            setPlaying(true);
            removeGestureListeners();
            return true;
          })
          .catch(() => {
            unlocked = false;
            setPlaying(false);
            showUnlock();
            return false;
          });
      }

      unlocked = !idhaAudio.paused;
      if (unlocked) {
        hideUnlock();
        setPlaying(true);
        removeGestureListeners();
      } else {
        showUnlock();
      }
      return Promise.resolve(unlocked);
    };

    const onFirstGesture = (event) => {
      if (unlocked) return;
      const target = event.target;
      if (target && target.closest && target.closest("a[href='/invite/'], a[href=\"/invite/\"]")) {
        return;
      }
      // Keep this sync with the gesture — do not await before play()
      playFromGesture();
    };

    idhaPlay.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!idhaAudio.paused && unlocked) {
        idhaAudio.pause();
        setPlaying(false);
        return;
      }
      playFromGesture();
    });

    if (idhaUnlock) {
      const unlockHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        playFromGesture();
      };
      idhaUnlock.addEventListener("pointerdown", unlockHandler);
      idhaUnlock.addEventListener("click", unlockHandler);
    }

    idhaAudio.addEventListener("playing", () => {
      unlocked = true;
      hideUnlock();
      setPlaying(true);
      removeGestureListeners();
    });
    idhaAudio.addEventListener("ended", () => setPlaying(false));
    idhaAudio.addEventListener("pause", () => {
      if (!idhaAudio.ended) setPlaying(false);
    });

    showUnlock();
    window.addEventListener("pointerdown", onFirstGesture, true);
    window.addEventListener("touchstart", onFirstGesture, { capture: true, passive: true });
    window.addEventListener("click", onFirstGesture, true);

    // Best-effort unmuted autoplay (usually blocked; unlock stays until a tap)
    const tryAutoplay = () => {
      if (unlocked || !idhaAudio.paused) return;
      const p = idhaAudio.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          unlocked = true;
          hideUnlock();
          setPlaying(true);
          removeGestureListeners();
        }).catch(() => {
          showUnlock();
        });
      }
    };
    if (idhaAudio.readyState >= 2) tryAutoplay();
    else idhaAudio.addEventListener("canplaythrough", tryAutoplay, { once: true });
  }
})();
