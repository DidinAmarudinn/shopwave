let allProducts = [];

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  const empty = document.getElementById("empty-state");
  const count = document.getElementById("product-count");

  if (!grid) return;

  count.textContent = `${products.length} product${products.length !== 1 ? "s" : ""}`;

  if (products.length === 0) {
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.innerHTML = products
    .map(
      (p) => `
    <article class="product-card">
      <a href="product.html?sku=${encodeURIComponent(p.sku)}" class="product-card__image-link">
        <img src="${p.product_image}" alt="${p.product_name}" class="product-card__image" loading="lazy">
      </a>
      <div class="product-card__body">
        <span class="sku-badge">${p.sku}</span>
        <h2 class="product-card__title">
          <a href="product.html?sku=${encodeURIComponent(p.sku)}">${p.product_name}</a>
        </h2>
        <p class="product-card__desc">${truncate(p.short_description, 100)}</p>
        <a href="product.html?sku=${encodeURIComponent(p.sku)}" class="btn btn--primary">View Details</a>
      </div>
    </article>
  `
    )
    .join("");
}

function filterProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    renderProducts(allProducts);
    return;
  }

  const filtered = allProducts.filter(
    (p) =>
      p.product_name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q)
  );
  renderProducts(filtered);
}

async function init() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  try {
    allProducts = await loadProducts();
    renderProducts(allProducts);

    const search = document.getElementById("search");
    if (search) {
      search.addEventListener("input", (e) => filterProducts(e.target.value));
    }
  } catch {
    grid.innerHTML =
      '<p class="error-msg">Could not load products. Please try again later.</p>';
  }
}

document.addEventListener("DOMContentLoaded", init);
