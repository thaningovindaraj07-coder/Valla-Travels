/* ── Mobile menu toggle ── */
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
  menuBtn.innerHTML = menu.classList.contains("hidden")
    ? '<i class="fa-solid fa-bars"></i>'
    : '<i class="fa-solid fa-xmark"></i>';
});
document.querySelectorAll(".menu-link").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.add("hidden");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }),
);

/* ── "Book Now" / "Book Ride" routing by device ──
   Android phone/tablet → Google Play Store
   iPhone / iPad        → web app
   Laptop / desktop     → web app */
(function () {
  const BOOK_LINKS = {
    web: "https://app.vallatravels.in/",
    android: "https://play.google.com/store/search?q=Valla+Travels&c=apps",
  };
  const ua = navigator.userAgent || navigator.vendor || "";
  const isAndroid = /Android/i.test(ua);
  const target = isAndroid ? BOOK_LINKS.android : BOOK_LINKS.web;
  document.querySelectorAll(".book-cta").forEach((el) => {
    el.setAttribute("href", target);
    el.setAttribute("rel", "noopener");
  });
})();

/* ── Sticky nav shadow + active-section highlight ── */
const navEl = document.getElementById("nav");
const sectionIds = ["home", "about", "services", "contact"];
const navLinks = document.querySelectorAll(".nav-link");
addEventListener(
  "scroll",
  () => {
    navEl.classList.toggle("shadow-soft", scrollY > 30);
    let current = "home";
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) current = id;
    }
    navLinks.forEach((l) =>
      l.classList.toggle(
        "active",
        l.getAttribute("href") === "#" + current,
      ),
    );
  },
  { passive: true },
);

/* ── Reveal-on-scroll ── */
const io = new IntersectionObserver(
  (es) => {
    for (const e of es)
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ── Animated counters ── */
const counters = document.querySelectorAll("[data-count]");
const cIO = new IntersectionObserver(
  (es) => {
    for (const e of es)
      if (e.isIntersecting) {
        const el = e.target;
        const target = +el.dataset.count;
        const dur = 1600,
          start = performance.now();
        const tick = (t) => {
          const p = Math.min((t - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent =
            Math.floor(target * eased).toLocaleString() + "+";
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cIO.unobserve(el);
      }
  },
  { threshold: 0.4 },
);
counters.forEach((c) => cIO.observe(c));

/* ── Contact form submit handler ── */
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.innerHTML =
    '<i class="fa-solid fa-check"></i> Request sent — we\'ll call you back';
  btn.classList.remove("bg-brand");
  btn.classList.add("bg-emerald-700");
  e.target.reset();
}
window.handleContactSubmit = handleContactSubmit;

/* ── Cab card image sliders (main page) ── */
(function () {
  const sliders = [];
  let timer;

  function start() {
    timer = setInterval(() => {
      sliders.forEach((s) => s.go(s.i + 1));
    }, 5000);
  }
  function restart() {
    clearInterval(timer);
    start();
  }

  document.querySelectorAll(".cab-media").forEach((media) => {
    const track = media.querySelector(".cab-slider-track");
    if (!track) return;
    const slides = track.querySelectorAll(".cab-slide");
    const dotsWrap = media.querySelector(".cab-dots");
    const card = media.closest(".cab-card");

    const realCount = slides.length;
    if (realCount > 1) {
      const firstClone = slides[0].cloneNode(true);
      firstClone.setAttribute("aria-hidden", "true");
      track.appendChild(firstClone);
    }

    const s = {
      i: 0,
      animating: false,
      go(n, manual) {
        if (s.animating) return;
        if (realCount > 1 && n >= realCount) {
          s.animating = true;
          track.style.transform = "translateX(-" + realCount * 100 + "%)";
          dots.forEach((d, k) => d.classList.toggle("active", k === 0));
          setTimeout(() => {
            track.style.transition = "none";
            track.style.transform = "translateX(0%)";
            void track.offsetWidth;
            track.style.transition = "";
            s.i = 0;
            s.animating = false;
            if (manual) restart();
          }, 1200);
          return;
        }
        s.i = (n + realCount) % realCount;
        track.style.transform = "translateX(-" + s.i * 100 + "%)";
        dots.forEach((d, k) => d.classList.toggle("active", k === s.i));
        if (manual) restart();
      },
    };

    slides.forEach((_, n) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "cab-dot";
      dot.setAttribute("aria-label", "Show photo " + (n + 1));
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        s.go(n, true);
      });
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll(".cab-dot");

    media.querySelector(".cab-prev").addEventListener("click", (e) => {
      e.preventDefault();
      s.go(s.i - 1, true);
    });
    media.querySelector(".cab-next").addEventListener("click", (e) => {
      e.preventDefault();
      s.go(s.i + 1, true);
    });
    card.addEventListener("mouseenter", () => clearInterval(timer));
    card.addEventListener("mouseleave", restart);

    s.go(0);
    sliders.push(s);
  });

  start();
})();

/* ── Cab details modal (variants + book-now routing) ── */
(function () {
  const CABS = {
    suv: {
      title: "SUV",
      tag: "Group & Family",
      img: "/img/SUV/Innova Crysta.jpg",
      desc: "Stylish SUVs deliver powerful performance, spacious comfort, and a smooth ride for family getaways, outstation trips, and group travel across Tamil Nadu.",
      specs: [
        { i: "fa-user-group", l: "Seating", v: "7 + 1" },
        { i: "fa-suitcase-rolling", l: "Luggage", v: "5–6 Bags" },
        { i: "fa-snowflake", l: "AC", v: "AC / Non‑AC" },
        { i: "fa-gauge-high", l: "Type", v: "Premium SUV" },
      ],
      features: [
        "Innova Crysta, Kia Carens, Tavera options",
        "Push‑back reclining seats",
        "Ample legroom & boot space",
        "Music system & charging points",
        "Experienced, courteous drivers",
        "GPS‑tracked safe rides",
      ],
      bestFor:
        "Family trips, outstation tours, airport transfers, hill‑station getaways and small group travel up to 7 passengers.",
      variants: [
        {
          img: "/img/Suv-Pack/SUV Premium/Crysta.jpg",
          imgs: [
            "/img/Suv-Pack/SUV/Ertiga.jpg",
            "/img/Suv-Pack/SUV/Rumion.jpg",
            "/img/Suv-Pack/SUV/Tavera.jpg",
            "/img/Suv-Pack/SUV/Xylo.jpg",
          ],
          name: "SUV",
          tag: "Standard",
          seats: "7 + 1",
          seatsList: ["6 + 1", "6 + 1", "9 + 1", "7 + 1"],
          desc: "Spacious 6 , 7 and 9 - seater SUV ideal for family trips, airport transfers and comfortable outstation travel.",
        },
        {
          img: "/img/Suv-Pack/SUV Premium/Careens.jpg",
          imgs: [
            "/img/Suv-Pack/SUV+/Innova.jpg",
            "/img/Suv-Pack/SUV+/Marazzo.jpg",
          ],
          name: "SUV+",
          tag: "Enhanced",
          seats: "7 + 1",
          desc: "Upgraded SUV with extra comfort, modern interiors and a smoother ride for longer journeys.",
        },
        {
          img: "/img/Suv-Pack/SUV Premium/Hycross.jpg",
          name: "SUV Premium",
          tag: "Luxury",
          seats: "6,7 + 1",
          desc: "Top-tier 6 and 7 - seater SUV with premium finish and best-in-class comfort for executive and group travel.",
        },
      ],
    },
    traveller: {
      title: "Traveller",
      tag: "Premium Group Travel",
      img: "/img/Traveller/Urabnia.jpg",
      desc: "Spacious luxury vans like Force Urbania and Tempo Traveller — ideal for premium family tours, corporate trips, and mid‑sized group travel in comfort.",
      specs: [
        { i: "fa-user-group", l: "Seating", v: "13 / 16 + 1" },
        { i: "fa-suitcase-rolling", l: "Luggage", v: "12–15 Bags" },
        { i: "fa-snowflake", l: "AC", v: "AC / Non‑AC" },
        { i: "fa-van-shuttle", l: "Type", v: "Luxury Van" },
      ],
      features: [
        "Force Urbania & Tempo Traveller",
        "Push‑back captain seats",
        "LED TV / music system",
        "Curtains & roof lighting",
        "High roof for easy movement",
        "Wide windows & panoramic views",
      ],
      bestFor:
        "Wedding guests, corporate outings, pilgrimage tours, school excursions, and group outstation trips of 12–17 passengers.",
      variants: [
        {
          img: "/img/Traveller/Urabnia.jpg",
          imgs: [
            "/img/Traveller/Urabnia.jpg",
            "/img/Traveller/Urabnia.jpg",
            "/img/Traveller/Urabnia.jpg",
          ],
          name: "Urbania",
          tag: "Premium Group Travel",
          seats: "10 + 1",
          seatsList: ["10 + 1", "12 + 1", "16 + 1"],
          desc: "Premium luxury van with captain seats and panoramic windows.",
        },
        {
          img: "/img/Traveller/Force.jpg",
          imgs: [
            "/img/Traveller/Force.jpg",
            "/img/Traveller/Force.jpg",
            "/img/Traveller/Force.jpg",
          ],
          name: "Traveller",
          tag: "Premium Group Travel",
          seats: "14 + 1",
          seatsList: ["14 + 1", "17 + 1", "18 + 1"],
          desc: "Roomy traveller built for groups and pilgrim circuits.",
        },
      ],
    },
    coach: {
      title: "Coach",
      tag: "Large Group Journeys",
      img: "/img/Coach/Mini-Bus.jpg",
      desc: "Comfortable coach buses for large groups, weddings, college tours and corporate offsites — built for long road journeys across Tamil Nadu and beyond.",
      specs: [
        { i: "fa-user-group", l: "Seating", v: "21 / 34 + 1" },
        { i: "fa-suitcase-rolling", l: "Luggage", v: "Large Boot" },
        { i: "fa-snowflake", l: "AC", v: "AC / Non‑AC" },
        { i: "fa-bus", l: "Type", v: "Mini / Coach Bus" },
      ],
      features: [
        "Mini bus & full coach options",
        "2x2 push‑back seating",
        "High‑quality music system",
        "Reading lights & charging points",
        "Spacious boot for luggage",
        "Trained drivers for long routes",
      ],
      bestFor:
        "Weddings, college trips, temple tours, corporate offsites and large family functions of 20–35 passengers.",
      variants: [
        {
          img: "/img/Coach/Mini-Bus.jpg",
          name: "Mini Bus",
          tag: "Large Group Journeys",
          seats: "21 + 1",
          desc: "Mini bus for mid-large groups, weddings and college trips.",
        },
        {
          img: "/img/Coach/Coach-Bus.webp",
          name: "Coach Bus",
          tag: "Large Group Journeys",
          seats: "34 + 1",
          desc: "Full coach bus with push-back seating for long road journeys.",
        },
        {
          img: "/img/Coach/Coach-Bus.webp",
          name: "Premium Coach",
          tag: "Large Group Journeys",
          seats: "40 + 1",
          desc: "Premium coach with extra comfort for big group travel.",
        },
      ],
    },
    tourbus: {
      title: "Tour Bus",
      tag: "Tours & Pilgrimage",
      img: "/img/Tour-Bus/Travels.jpg",
      desc: "Air‑conditioned tour buses built for long‑distance journeys, multi‑day pilgrimages and large group tours with premium comfort end to end.",
      specs: [
        { i: "fa-user-group", l: "Seating", v: "40 / 45 + 1" },
        { i: "fa-suitcase-rolling", l: "Luggage", v: "XL Boot" },
        { i: "fa-snowflake", l: "AC", v: "AC / Non‑AC" },
        { i: "fa-bus-simple", l: "Type", v: "Volvo / Luxury Tour" },
      ],
      features: [
        "Volvo & luxury tour bus options",
        "Push‑back reclining seats",
        "LED TV, music & PA system",
        "Reading lights & charging ports",
        "Curtains and tinted windows",
        "Trained, license‑verified drivers",
      ],
      bestFor:
        "Multi‑day pilgrimage tours, large wedding parties, college excursions and long‑distance group travel of 40+ passengers.",
      variants: [
        {
          img: "/img/Tour-Bus/Travels.jpg",
          imgs: [
            "/img/Tour-Bus/Travels.jpg",
            "/img/Tour-Bus/Travels.jpg",
            "/img/Tour-Bus/Travels.jpg",
            "/img/Tour-Bus/Travels.jpg",
          ],
          name: "Bus",
          tag: "Tours & Pilgrimage",
          seats: "40 + 1",
          seatsList: ["35 + 1", "40 + 1", "45 + 1", "54 + 1"],
          desc: "Standard air-conditioned tour bus for group journeys and pilgrimage trips.",
        },
        {
          img: "/img/Tour-Bus/Travels.jpg",
          imgs: ["/img/Tour-Bus/Travels.jpg"],
          name: "Push Back",
          tag: "Tours & Pilgrimage",
          seats: "45 + 1",
          desc: "Push-back seating coach for comfortable long-distance road travel.",
        },
        {
          img: "/img/Tour-Bus/Volvo.jpg",
          imgs: ["/img/Tour-Bus/Volvo.jpg"],
          name: "Semi Sleeper",
          tag: "Tours & Pilgrimage",
          seats: "40 + 1",
          desc: "Semi-sleeper coach with reclining seats for overnight comfort.",
        },
        {
          img: "/img/Tour-Bus/Volvo.jpg",
          imgs: ["/img/Tour-Bus/Volvo.jpg"],
          name: "Sleeper",
          tag: "Tours & Pilgrimage",
          seats: "30",
          desc: "Full sleeper coach with berths for overnight long-distance journeys.",
        },
      ],
    },
  };

  const modal = document.getElementById("cab-modal");
  if (!modal) return;

  const elVariants = document.getElementById("cab-modal-variants");

  let modalTimer;
  const modalSliders = [];
  function startModalAuto() {
    clearInterval(modalTimer);
    modalTimer = setInterval(() => {
      modalSliders.forEach((s) => s.goNext());
    }, 5000);
  }
  function restartModalAuto() {
    clearInterval(modalTimer);
    startModalAuto();
  }

  function open(key) {
    const data = CABS[key];
    if (!data) return;

    const allVariants = data.variants || [];
    const gridCols =
      allVariants.length === 2
        ? "grid grid-cols-1 sm:grid-cols-2 gap-6 p-2 sm:p-4 max-w-4xl mx-auto justify-items-center"
        : allVariants.length === 1
          ? "grid grid-cols-1 gap-6 p-2 sm:p-4 max-w-md mx-auto justify-items-center"
          : allVariants.length === 4
            ? "grid grid-cols-1 sm:grid-cols-2 gap-6 p-2 sm:p-4 max-w-4xl mx-auto justify-items-center"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 sm:p-4";
    elVariants.className = gridCols;
    elVariants.innerHTML = allVariants
      .map((v, idx) => {
        const imgs =
          v.imgs && v.imgs.length
            ? v.imgs
            : [0, 1, 2].map(
                (k) =>
                  allVariants[(idx + k) % allVariants.length].img || v.img,
              );
        const seatsPerImage =
          v.seatsList && v.seatsList.length
            ? v.seatsList
            : imgs.map(() => v.seats);
        const slidesHTML = imgs
          .map(
            (src) => `
                  <div class="cab-slide relative">
                    <img src="${src}" alt="${v.name}" loading="lazy" class="cab-img w-full h-full object-cover" />
                  </div>`,
          )
          .join("");
        const seatsData = seatsPerImage
          .map((s) => String(s).replace(/"/g, "&quot;"))
          .join("|");
        return `
            <article class="variant-card cab-card group rounded-3xl bg-[#faf6eb] text-brand-dark shadow-luxe overflow-hidden">
              <div class="cab-media relative h-52 overflow-hidden" data-seats="${seatsData}">
                <div class="cab-slider-track">${slidesHTML}</div>
                <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent pointer-events-none"></div>
                <span class="cab-index glass absolute top-4 left-4 grid place-items-center w-10 h-10 rounded-full font-[Roboto] text-sm font-semibold text-white z-10">${String(idx + 1).padStart(2, "0")}</span>
                <span class="cab-seats absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#faf6eb] backdrop-blur px-3 py-1.5 font-[Roboto] text-xs font-medium text-brand-dark z-10">
                  <i class="fa-solid fa-user-group text-[10px]"></i> <span class="cab-seats-value">${seatsPerImage[0]}</span>
                </span>
                <button type="button" aria-label="Previous photo" class="cab-slider-btn cab-prev absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/85 text-brand-dark backdrop-blur z-10">
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button type="button" aria-label="Next photo" class="cab-slider-btn cab-next absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/85 text-brand-dark backdrop-blur z-10">
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
                <div class="cab-dots absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10"></div>
              </div>
              <div class="p-6 sm:p-7">
                <div class="font-[Roboto] text-[11px] tracking-[.2em] uppercase text-brand/70">${v.tag}</div>
                <h3 class="mt-2 font-[Roboto] font-semibold text-3xl tracking-tight text-brand-dark">${v.name}</h3>
                <p class="mt-2 text-sm font-[Poppins] text-brand-dark/70 leading-relaxed">${v.desc}</p>
                <div class="mt-5 flex flex-wrap gap-2">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-cream px-3 py-1 font-[Poppins] text-sm text-brand">
                    <i class="fa-solid fa-snowflake text-[14px]"></i> AC/Non AC
                  </span>
                </div>
                <span class="block w-full h-px bg-brand/10 my-3"></span>
                <div class="flex flex-wrap items-center gap-3">
                  <a href="#contact" class="book-cta cab-cta cab-modal-book inline-flex items-center gap-2 rounded-full bg-brand text-brand-cream px-6 py-3 text-base font-semibold shadow-soft">
                    Book Now
                    <i class="fa-solid fa-arrow-right text-sm mt-[2px]"></i>
                  </a>
                </div>
              </div>
            </article>`;
      })
      .join("");

    // initialize sliders for variant cards — shared timer so all advance together
    clearInterval(modalTimer);
    modalSliders.length = 0;

    elVariants.querySelectorAll(".cab-media").forEach((media) => {
      const track = media.querySelector(".cab-slider-track");
      if (!track) return;
      const slides = track.querySelectorAll(".cab-slide");
      const dotsWrap = media.querySelector(".cab-dots");
      const card = media.closest(".cab-card");
      const seatsArr = (media.getAttribute("data-seats") || "").split("|");
      const seatsValue = media.querySelector(".cab-seats-value");
      const realCount = slides.length;
      if (realCount > 1) {
        const firstClone = slides[0].cloneNode(true);
        firstClone.setAttribute("aria-hidden", "true");
        track.appendChild(firstClone);
      }
      const s = { i: 0, animating: false };
      const go = (n, manual) => {
        if (s.animating) return;
        if (realCount > 1 && n >= realCount) {
          s.animating = true;
          track.style.transform = "translateX(-" + realCount * 100 + "%)";
          dots.forEach((d, k) => d.classList.toggle("active", k === 0));
          if (seatsValue && seatsArr[0])
            seatsValue.textContent = seatsArr[0];
          setTimeout(() => {
            track.style.transition = "none";
            track.style.transform = "translateX(0%)";
            void track.offsetWidth;
            track.style.transition = "";
            s.i = 0;
            s.animating = false;
            if (manual) restartModalAuto();
          }, 1200);
          return;
        }
        s.i = (n + realCount) % realCount;
        track.style.transform = "translateX(-" + s.i * 100 + "%)";
        dots.forEach((d, k) => d.classList.toggle("active", k === s.i));
        if (seatsValue && seatsArr[s.i])
          seatsValue.textContent = seatsArr[s.i];
        if (manual) restartModalAuto();
      };
      s.goNext = () => go(s.i + 1);
      slides.forEach((_, n) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "cab-dot";
        dot.setAttribute("aria-label", "Show photo " + (n + 1));
        dot.addEventListener("click", (e) => {
          e.preventDefault();
          go(n, true);
        });
        dotsWrap.appendChild(dot);
      });
      const dots = dotsWrap.querySelectorAll(".cab-dot");
      media.querySelector(".cab-prev").addEventListener("click", (e) => {
        e.preventDefault();
        go(s.i - 1, true);
      });
      media.querySelector(".cab-next").addEventListener("click", (e) => {
        e.preventDefault();
        go(s.i + 1, true);
      });
      card.addEventListener("mouseenter", () => clearInterval(modalTimer));
      card.addEventListener("mouseleave", restartModalAuto);
      go(0);
      modalSliders.push(s);
    });

    startModalAuto();

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function close() {
    clearInterval(modalTimer);
    modalSliders.length = 0;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-details]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      open(btn.getAttribute("data-details"));
    });
  });

  modal.querySelector(".cab-modal-close").addEventListener("click", close);
  modal
    .querySelector(".cab-modal-backdrop")
    .addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
  });

  const BOOK_URL_ANDROID =
    "https://play.google.com/store/apps/details?id=in.vallatravels.app";
  const BOOK_URL_WEB = "https://app.vallatravels.in/";
  const isAndroid = () => /android/i.test(navigator.userAgent || "");
  const getBookUrl = () =>
    isAndroid() ? BOOK_URL_ANDROID : BOOK_URL_WEB;

  elVariants.addEventListener("click", (e) => {
    const bookLink = e.target.closest(".cab-modal-book");
    if (bookLink) {
      e.preventDefault();
      close();
      window.location.href = getBookUrl();
    }
  });
})();
