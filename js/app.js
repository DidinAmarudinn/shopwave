let allProducts = [];
let activeFilter = "all";
let searchQuery = "";

const FILTER_MAP = {
  all: () => true,
  "new-arrivals": (_, i) => i < 5,
  "best-sellers": (_, i) => i >= 5 && i < 10,
  living: (p) => p.category === "living",
  bedroom: (p) => p.category === "bedroom",
  dining: (p) => p.category === "dining",
  lighting: (p) => p.category === "lighting",
  decor: (p) => p.category === "decor",
};

const CATEGORY_CARDS = [
  {
    title: "Living Room",
    filter: "living",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop",
  },
  {
    title: "Bedroom",
    filter: "bedroom",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=800&fit=crop",
  },
  {
    title: "Dining",
    filter: "dining",
    image:
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=600&h=800&fit=crop",
  },
  {
    title: "Lighting & Decor",
    filter: "decor",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=800&fit=crop",
  },
];

const IMG_FALLBACK =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22%23f0eeeb%22%2F%3E%3Cg%20fill%3D%22%23c8c1b8%22%3E%3Crect%20x%3D%22220%22%20y%3D%22230%22%20width%3D%22160%22%20height%3D%22120%22%20rx%3D%2212%22%2F%3E%3Ccircle%20cx%3D%22265%22%20cy%3D%22275%22%20r%3D%2216%22%2F%3E%3Cpath%20d%3D%22M225%20340l45-55%2040%2030%2050-50%2055%2075z%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%22300%22%20y%3D%22400%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20fill%3D%22%237a7368%22%20text-anchor%3D%22middle%22%3EImage%20unavailable%3C%2Ftext%3E%3C%2Fsvg%3E";

function formatPrice(price) {
  const n = Number(price);
  if (!Number.isFinite(n)) return "";
  return "$" + n.toLocaleString("en-US");
}

function getStockStatus(stock) {
  const n = Number(stock);
  if (!Number.isFinite(n) || n <= 0) {
    return { label: "Sold Out", short: "Sold Out", kind: "out" };
  }
  if (n <= 4) {
    return { label: `Only ${n} left`, short: `Only ${n} left`, kind: "low" };
  }
  return { label: "In Stock", short: "In Stock", kind: "in" };
}

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
      <img src="${a.product_image}" alt="${a.product_name}" loading="eager" onerror="this.onerror=null;this.src='${IMG_FALLBACK}'">
    </div>
    <div class="hero__collage-side">
      <img src="${b.product_image}" alt="${b.product_name}" loading="eager" onerror="this.onerror=null;this.src='${IMG_FALLBACK}'">
      <img src="${c.product_image}" alt="${c.product_name}" loading="eager" onerror="this.onerror=null;this.src='${IMG_FALLBACK}'">
    </div>
  `;
}

function renderCategoryCards() {
  const grid = document.getElementById("category-grid");
  if (!grid) return;

  grid.innerHTML = CATEGORY_CARDS.map(
    (cat) => `
    <article class="category-card" data-filter="${cat.filter}" role="button" tabindex="0" aria-label="Shop ${cat.title}">
      <img src="${cat.image}" alt="${cat.title}" loading="lazy" onerror="this.onerror=null;this.src='${IMG_FALLBACK}'">
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
    { id: "living", label: "Living Room" },
    { id: "bedroom", label: "Bedroom" },
    { id: "dining", label: "Dining" },
    { id: "lighting", label: "Lighting" },
    { id: "decor", label: "Decor" },
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
    .map((p) => {
      const stock = getStockStatus(p.stock);
      const isOut = stock.kind === "out";
      const linkLabel = isOut ? "Notify Me" : "View Details";
      return `
    <article class="product-card${isOut ? " product-card--out" : ""}">
      <a href="product.html?sku=${encodeURIComponent(p.sku)}" class="product-card__image-wrap">
        <span class="stock-badge stock-badge--${stock.kind}">${stock.short}</span>
        <img src="${p.product_image}" alt="${p.product_name}" class="product-card__image" loading="lazy" onerror="this.onerror=null;this.src='${IMG_FALLBACK}'">
      </a>
      <p class="product-card__sku">${p.sku}</p>
      <h3 class="product-card__title">
        <a href="product.html?sku=${encodeURIComponent(p.sku)}">${p.product_name}</a>
      </h3>
      <div class="product-card__footer">
        <span class="product-card__price">${formatPrice(p.price)}</span>
        <a href="product.html?sku=${encodeURIComponent(p.sku)}" class="product-card__link">
          ${linkLabel} <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  `;
    })
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
