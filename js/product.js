function getSkuFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("sku");
}

function renderProduct(product) {
  document.title = `${product.product_name} — ShopWave`;
  document.getElementById("product-detail").innerHTML = `
    <div class="product-detail__image-wrap">
      <img src="${product.product_image}" alt="${product.product_name}" class="product-detail__image">
    </div>
    <div class="product-detail__info">
      <span class="sku-badge">${product.sku}</span>
      <h1 class="product-detail__title">${product.product_name}</h1>
      <p class="product-detail__desc">${product.short_description}</p>
      <a href="index.html" class="btn btn--secondary">← Back to Shop</a>
    </div>
  `;
}

function renderNotFound(sku) {
  document.title = "Product Not Found — ShopWave";
  document.getElementById("product-detail").innerHTML = `
    <div class="not-found">
      <h1>Product Not Found</h1>
      <p>We couldn't find a product with SKU <strong>${sku || "unknown"}</strong>.</p>
      <a href="index.html" class="btn btn--primary">Browse All Products</a>
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
