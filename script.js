const hamburger = document.querySelector(".hamburger");
const navCenter = document.querySelector(".nav-center");

hamburger.addEventListener("click", () => {
  navCenter.classList.toggle("open");
});

/* ======================================================
   GLOBAL CONFIG
====================================================== */
const WHATSAPP_NUMBER = "2348087349163"; // <-- CHANGE TO YOUR REAL NUMBER
const CURRENCY = "₦";

/* ======================================================
   1️⃣ HERO SLIDER
====================================================== */
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dots .dot");
let heroIndex = 0;

function showHeroSlide(index) {
  heroSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
    heroDots[i]?.classList.toggle("active", i === index);
  });
}

setInterval(() => {
  heroIndex = (heroIndex + 1) % heroSlides.length;
  showHeroSlide(heroIndex);
}, 5000);

/* ======================================================
   2️⃣ PRODUCT SLIDER (AUTO + DOTS)
====================================================== */
document.querySelectorAll(".product-section").forEach((section) => {
  const track = section.querySelector(".product-track");
  const cards = section.querySelectorAll(".product-card");
  const dotsContainer = section.querySelector(".slider-dots");
  const prevBtn = section.querySelector(".prev");
  const nextBtn = section.querySelector(".next");

  if (!track || cards.length === 0) return;

  let index = 0;
  let cardsPerView = window.innerWidth >= 1024 ? 4 : 2;
  let autoSlide;

  /* ---- Create dots dynamically ---- */
  dotsContainer.innerHTML = "";
  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot";
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      index = i;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
  });

  function updateSlider() {
    const cardWidth = cards[0].offsetWidth + 13; // gap compensation
    track.style.transform = `translateX(-${index * cardWidth}px)`;

    dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    index = (index + 1) % cards.length;
    updateSlider();
  }

  function prevSlide() {
    index = (index - 1 + cards.length) % cards.length;
    updateSlider();
  }

  nextBtn?.addEventListener("click", nextSlide);
  prevBtn?.addEventListener("click", prevSlide);

  function startAutoSlide() {
    // Mobile-first: auto-slide ONLY on small screens
    if (window.innerWidth <= 768) {
      autoSlide = setInterval(nextSlide, 5000); // 🔥 slower mobile slide
    }
  }

  function stopAutoSlide() {
    if (autoSlide) {
      clearInterval(autoSlide);
      autoSlide = null;
    }
  }

  // Initial run
  startAutoSlide();

  // Re-check on resize (orientation / desktop resize)
  window.addEventListener("resize", () => {
    stopAutoSlide();
    startAutoSlide();
  });

  // Touch pause (mobile)
  track.addEventListener("touchstart", stopAutoSlide);
  track.addEventListener("touchend", startAutoSlide);

  // Mouse pause (tablet / hybrid devices)
  track.addEventListener("mouseenter", stopAutoSlide);
  track.addEventListener("mouseleave", startAutoSlide);
});

/* ======================================================
   3️⃣ WHATSAPP ORDER LOGIC
====================================================== */
document.querySelectorAll(".order-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const name = card.querySelector("h3").innerText;
    const priceEl = card.querySelector(".price");
    const price = Number(priceEl.dataset.price);
    const qtyInput = card.querySelector("input");
    const quantity = Number(qtyInput.value);
    const image = card.querySelector("img").src;

    if (quantity < 1) {
      alert("Please select a valid quantity.");
      return;
    }

    const total = price * quantity;

    const message = `
Hello Al Haarith Farm 👋

I want to order:

Product: ${name}
Quantity: ${quantity}
Price per unit: ${CURRENCY}${price.toLocaleString()}
Total Price: ${CURRENCY}${total.toLocaleString()}

Product Image:
${image}

Thank you.
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  });
});

/* ======================================================
   4️⃣ ADMIN PRICING LOGIC (JSON-BASED MVP)
====================================================== */

/*
  HOW THIS WORKS:
  - Prices & stock live in a JSON file
  - Admin updates JSON
  - Site auto-updates prices without touching HTML
*/

fetch("data/products.json")
  .then((res) => res.json())
  .then((data) => {
    document.querySelectorAll(".product-card").forEach((card) => {
      const productId = card.dataset.id;
      const product = data.products.find((p) => p.id === productId);
      if (!product) return;

      // Update price
      const priceEl = card.querySelector(".price");
      const priceValueEl = priceEl.querySelector(".price-value");

      if (priceValueEl) {
        priceValueEl.textContent = product.price.toLocaleString();
      } else {
        // fallback (for old cards without spans)
        priceEl.innerText = `${CURRENCY}${product.price.toLocaleString()}`;
      }

      priceEl.dataset.price = product.price;

      // Stock badge
      const stockBadge = card.querySelector(".badge.stock");
      if (!product.inStock) {
        stockBadge.innerText = "Out of Stock";
        stockBadge.style.background = "#fee2e2";
        card.querySelector(".order-btn").disabled = true;
        card.querySelector(".order-btn").innerText = "Unavailable";
      }
    });
  })
  .catch(() => {
    console.warn("Admin pricing JSON not loaded.");
  });

/* ======================================================
   FOOTER YEAR
====================================================== */
document.getElementById("year").innerText = new Date().getFullYear();
