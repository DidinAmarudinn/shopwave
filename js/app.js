let allProducts = [];
let activeFilter = "all";
let searchQuery = "";

const FILTER_MAP = {
  all: () => true,
  "new-arrivals": (_, i) => i < 5,
  "best-sellers": (_, i) => i >= 5 && i < 10,
  minimalist: (p) => p.category === "lifestyle",
  modern: (p) => p.category === "fashion",
  wood: (p) => p.category === "home",
  tech: (p) => p.category === "tech",
};

const CATEGORY_CARDS = [
  {
    title: "Living Room",
    filter: "wood",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop",
  },
  {
    title: "Bedroom Set",
    filter: "minimalist",
    image:
      "https://images.unsplash.com/photo-1616594039964-40891a910a80?w=600&h=800&fit=crop",
  },
  {
    title: "Home Decor",
    filter: "wood",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=800&fit=crop",
  },
  {
    title: "Tables & Chairs",
    filter: "modern",
    image:
      "https://images.unsplash.com/photo-1615066391307-1bfc4c1ea5f2?w=600&h=800&fit=crop",
  },
];

function getFilteredProducts() {
  const filterFn = FILTER_MAP[activeFilter] || FILTER_MAP.all;
  return allProducts.filter((p, i) => {
    const matchesFilter = filterFn(p, i);
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.product_name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });
}

function renderHeroCollage(products) {
  const collage = document.getElementById("hero-collage");
  if (!collage || products.length < 3) return;

  const [a, b, c] = products;
  collage.innerHTML = `
    <div class="hero__collage-main">
      <img src="${a.product_image}" alt="${a.product_name}" loading="eager">
    </div>
    <div class="hero__collage-side">
      <img src="${b.product_image}" alt="${b.product_name}" loading="eager">
      <img src="${c.product_image}" alt="${c.product_name}" loading="eager">
    </div>
  `;
}

function renderCategoryCards() {
  const grid = document.getElementById("category-grid");
  if (!grid) return;

  grid.innerHTML = CATEGORY_CARDS.map(
    (cat) => `
    <article class="category-card" data-filter="${cat.filter}" role="button" tabindex="0" aria-label="Shop ${cat.title}">
      <img src="${cat.image}" alt="${cat.title}" loading="lazy">
      <div class="category-card__overlay">
        <h3 class="category-card__title">${cat.title}</h3>
        <span class="category-card__link">Shop Now <span aria-hidden="true">↗</span></span>
      </div>
    </article>
  `
  ).join("");

  grid.querySelectorAll(".category-card").forEach((card) => {
    const activate = () => setFilter(card.dataset.filter, true);
    card.addEventListener("click", activate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });
}

function renderFilterPills() {
  const container = document.getElementById("filter-pills");
  if (!container) return;

  const pills = [
    { id: "all", label: "All" },
    { id: "new-arrivals", label: "New Arrivals" },
    { id: "best-sellers", label: "Best Sellers" },
    { id: "minimalist", label: "Minimalist" },
    { id: "modern", label: "Modern" },
    { id: "wood", label: "Wood" },
    { id: "tech", label: "Tech" },
  ];

  container.innerHTML = pills
    .map(
      (pill) => `
    <button type="button" class="filter-pill${activeFilter === pill.id ? " active" : ""}" data-filter="${pill.id}">
      ${pill.label}
    </button>
  `
    )
    .join("");

  container.querySelectorAll(".filter-pill").forEach((btn) => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter));
  });
}

function setFilter(filter, scrollToDiscovery = false) {
  activeFilter = filter;
  renderFilterPills();
  renderProducts(getFilteredProducts());
  if (scrollToDiscovery) {
    document.getElementById("discovery")?.scrollIntoView({ behavior: "smooth" });
  }
}

function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  const empty = document.getElementById("empty-state");
  const count = document.getElementById("product-count");

  if (!grid) return;

  if (count) {
    count.textContent = `${products.length} product${products.length !== 1 ? "s" : ""}`;
  }

  if (products.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;
  grid.innerHTML = products
    .map(
      (p) => `
    <article class="product-card">
      <a href="product.html?sku=${encodeURIComponent(p.sku)}" class="product-card__image-wrap">
        <img src="${p.product_image}" alt="${p.product_name}" class="product-card__image" loading="lazy">
      </a>
      <p class="product-card__sku">${p.sku}</p>
      <h3 class="product-card__title">
        <a href="product.html?sku=${encodeURIComponent(p.sku)}">${p.product_name}</a>
      </h3>
      <a href="product.html?sku=${encodeURIComponent(p.sku)}" class="product-card__link">
        View Details <span aria-hidden="true">→</span>
      </a>
    </article>
  `
    )
    .join("");
}

async function init() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  try {
    allProducts = await loadProducts();
    renderHeroCollage(allProducts);
    renderCategoryCards();
    renderFilterPills();
    renderProducts(getFilteredProducts());

    const search = document.getElementById("search");
    if (search) {
      search.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderProducts(getFilteredProducts());
      });
    }

    const searchBtn = document.getElementById("header-search");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        document.getElementById("discovery")?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => search?.focus(), 400);
      });
    }
  } catch {
    grid.innerHTML =
      '<p class="error-msg">Could not load products. Please try again later.</p>';
  }
}

document.addEventListener("DOMContentLoaded", init);
