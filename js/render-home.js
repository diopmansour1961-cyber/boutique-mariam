function productCardHTML(product) {
  const cover = product.photos && product.photos[0] ? product.photos[0] : "";
  const outOfStock = product.quantity <= 0;
  return `
    <a class="product-card" href="produit.html?id=${encodeURIComponent(product.id)}">
      <div class="product-card__media">
        ${product.oldPrice ? '<span class="product-card__tag">Promo</span>' : ""}
        ${outOfStock ? '<span class="product-card__tag product-card__tag--stock">Épuisé</span>' : ""}
        <img src="${cover}" alt="${product.name}" loading="lazy"
             onerror="this.onerror=null;this.src=placeholderImage(400,500,'Photo manquante')">
      </div>
      <div class="product-card__body">
        <div class="product-card__name">${product.name}</div>
        <div class="product-card__price">
          ${formatPrice(product.price, CONFIG.CURRENCY)}
          ${product.oldPrice ? `<span class="product-card__price--old">${formatPrice(product.oldPrice, CONFIG.CURRENCY)}</span>` : ""}
        </div>
      </div>
    </a>
  `;
}

function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  if (!PRODUCTS.length) {
    grid.innerHTML = `<div class="empty-state">Aucun produit disponible pour le moment. Revenez bientôt !</div>`;
    return;
  }
  grid.innerHTML = PRODUCTS.map(productCardHTML).join("");
}

document.addEventListener("DOMContentLoaded", renderProductGrid);
