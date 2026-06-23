function getSkuFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("sku");
}

const IMG_FALLBACK =
  "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22%23f0eeeb%22%2F%3E%3Cg%20fill%3D%22%23c8c1b8%22%3E%3Crect%20x%3D%22220%22%20y%3D%22230%22%20width%3D%22160%22%20height%3D%22120%22%20rx%3D%2212%22%2F%3E%3Ccircle%20cx%3D%22265%22%20cy%3D%22275%22%20r%3D%2216%22%2F%3E%3Cpath%20d%3D%22M225%20340l45-55%2040%2030%2050-50%2055%2075z%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%22300%22%20y%3D%22400%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20fill%3D%22%237a7368%22%20text-anchor%3D%22middle%22%3EImage%20unavailable%3C%2Ftext%3E%3C%2Fsvg%3E";

const CATEGORY_LABELS = {
  living: "Living Room",
  bedroom: "Bedroom",
  dining: "Dining",
  lighting: "Lighting",
  decor: "Decor",
};

function formatPrice(price) {
  const n = Number(price);
  if (!Number.isFinite(n)) return "";
  return "$" + n.toLocaleString("en-US");
}

function getStockStatus(stock) {
  const n = Number(stock);
  if (!Number.isFinite(n) || n <= 0) {
    return { label: "Sold Out", kind: "out", count: 0 };
  }
  if (n <= 4) {
    return { label: `Only ${n} left in stock`, kind: "low", count: n };
  }
  return { label: "In Stock — ready to ship", kind: "in", count: n };
}

function renderProduct(product) {
  document.title = `${product.product_name} — ShopWave`;
  document.getElementById("breadcrumb").innerHTML = `
    <a href="index.html">Home</a><span>/</span>
    <a href="index.html#discovery">Shop</a><span>/</span>
    ${product.product_name}
  `;
  const stock = getStockStatus(product.stock);
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
  const primaryAction =
    stock.kind === "out"
      ? `<button class="btn btn--outline btn--demo" type="button" aria-disabled="true" title="Demo store — coming soon">Notify When Available</button>`
      : `<button class="btn btn--primary btn--demo" type="button" aria-disabled="true" title="Demo store — checkout disabled">Add to Cart · ${formatPrice(product.price)}</button>`;

  document.getElementById("product-detail").innerHTML = `
    <div class="product-detail__image-wrap">
      <img src="${product.product_image}" alt="${product.product_name}" class="product-detail__image" onerror="this.onerror=null;this.src='${IMG_FALLBACK}'">
    </div>
    <div class="product-detail__info">
      <p class="product-detail__sku">${product.sku} · ${categoryLabel}</p>
      <h1 class="product-detail__title heading-serif">${product.product_name}</h1>
      <div class="product-detail__pricing">
        <span class="product-detail__price">${formatPrice(product.price)}</span>
        <span class="stock-status stock-status--${stock.kind}">
          <span class="stock-dot" aria-hidden="true"></span>${stock.label}
        </span>
      </div>
      <p class="product-detail__desc">${product.short_description}</p>
      <div class="product-detail__meta">
        <div class="product-detail__meta-row"><span>Collection</span><span>${categoryLabel}</span></div>
        <div class="product-detail__meta-row"><span>Lead time</span><span>${stock.kind === "out" ? "Restock in 4–6 weeks" : "Ships in 5–10 business days"}</span></div>
        <div class="product-detail__meta-row"><span>Delivery</span><span>White-glove included</span></div>
        <div class="product-detail__meta-row"><span>Guarantee</span><span>Lifetime craftsmanship</span></div>
      </div>
      <div class="product-detail__actions">
        ${primaryAction}
        <a href="index.html#discovery" class="btn btn--outline">← Back to Collection</a>
      </div>
    </div>
  `;
}

function renderNotFound(sku) {
  document.title = "Product Not Found — ShopWave";
  document.getElementById("breadcrumb").innerHTML = `
    <a href="index.html">Home</a><span>/</span>
    <a href="index.html#discovery">Shop</a><span>/</span>
    Not Found
  `;
  document.getElementById("product-detail").innerHTML = `
    <div class="not-found" style="grid-column: 1 / -1;">
      <h1 class="heading-serif">Product Not Found</h1>
      <p>We couldn't find a product with SKU <strong>${sku || "unknown"}</strong>.</p>
      <a href="index.html#discovery" class="btn btn--primary">Browse All Products</a>
    </div>
  `;
}

async function init() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const sku = getSkuFromUrl();
  if (!sku) {
    renderNotFound(null);
    return;
  }

  try {
    const products = await loadProducts();
    const product = products.find(
      (p) => p.sku.toLowerCase() === sku.toLowerCase()
    );

    if (product) {
      renderProduct(product);
    } else {
      renderNotFound(sku);
    }
  } catch {
    container.innerHTML =
      '<p class="error-msg">Could not load product details. Please try again later.</p>';
  }
}

document.addEventListener("DOMContentLoaded", init);
