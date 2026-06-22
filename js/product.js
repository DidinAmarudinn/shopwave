function getSkuFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("sku");
}

function renderProduct(product) {
  document.title = `${product.product_name} — ShopWave`;
  document.getElementById("breadcrumb").innerHTML = `
    <a href="index.html">Home</a><span>/</span>
    <a href="index.html#discovery">Shop</a><span>/</span>
    ${product.product_name}
  `;
  document.getElementById("product-detail").innerHTML = `
    <div class="product-detail__image-wrap">
      <img src="${product.product_image}" alt="${product.product_name}" class="product-detail__image">
    </div>
    <div class="product-detail__info">
      <p class="product-detail__sku">${product.sku}</p>
      <h1 class="product-detail__title heading-serif">${product.product_name}</h1>
      <p class="product-detail__desc">${product.short_description}</p>
      <a href="index.html#discovery" class="btn btn--outline">← Back to Collection</a>
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
