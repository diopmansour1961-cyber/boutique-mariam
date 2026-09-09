function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function mediaSlideHTML(src, isVideo) {
  return isVideo
    ? `<video src="${src}" controls playsinline></video>`
    : `<img src="${src}" alt="" onerror="this.onerror=null;this.src=placeholderImage(600,750,'Photo manquante')">`;
}

function renderProductPage() {
  const root = document.getElementById("product-root");
  const breadcrumb = document.getElementById("breadcrumb");
  const id = getQueryParam("id");
  const product = id ? findProduct(id) : null;

  if (!product) {
    root.innerHTML = `
      <div class="empty-state">
        <h2>Produit introuvable</h2>
        <p>Ce produit n'existe pas ou n'est plus disponible.</p>
        <a class="btn btn-primary" href="index.html">Retour à la boutique</a>
      </div>
    `;
    return;
  }

  breadcrumb.innerHTML = `<a href="index.html">Boutique</a> / ${product.category || "Produits"} / ${product.name}`;

  const media = [
    ...product.photos.map((src) => ({ src, isVideo: false })),
    ...product.videos.map((src) => ({ src, isVideo: true })),
  ];
  const outOfStock = product.quantity <= 0;

  root.innerHTML = `
    <div class="product-detail">
      <div class="gallery">
        <div class="gallery__main" id="gallery-main">${mediaSlideHTML(media[0].src, media[0].isVideo)}</div>
        ${media.length > 1 ? `
          <div class="gallery__thumbs" id="gallery-thumbs">
            ${media.map((m, i) => `
              <button type="button" class="gallery__thumb ${i === 0 ? "is-active" : ""}" data-index="${i}" aria-label="Voir média ${i + 1}">
                ${m.isVideo
                  ? `<span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#20201c;color:#fff;font-size:0.7rem;">▶ Vidéo</span>`
                  : `<img src="${m.src}" alt="" onerror="this.onerror=null;this.src=placeholderImage(100,100,'')">`}
              </button>
            `).join("")}
          </div>` : ""}
      </div>

      <div class="product-info">
        <div class="product-info__category">${product.category || ""}</div>
        <h1>${product.name}</h1>
        <span class="free-delivery-badge">🚚 ${CONFIG.FREE_DELIVERY_LABEL || "Livraison gratuite"}</span>

        <div class="product-info__price">
          ${formatPrice(product.price, CONFIG.CURRENCY)}
          ${product.oldPrice ? `<span class="product-info__price--old">${formatPrice(product.oldPrice, CONFIG.CURRENCY)}</span>` : ""}
        </div>

        <p class="stock-note ${outOfStock ? "stock-note--out" : "stock-note--ok"}">
          ${outOfStock ? "Rupture de stock — de retour bientôt" : `En stock (${product.quantity} disponibles)`}
        </p>

        <p>${product.description}</p>

        ${!outOfStock ? `
          <div class="qty-selector" role="group" aria-label="Quantité">
            <button type="button" id="qty-minus" aria-label="Diminuer la quantité">−</button>
            <input type="number" id="qty-input" value="1" min="1" max="${product.quantity}" inputmode="numeric">
            <button type="button" id="qty-plus" aria-label="Augmenter la quantité">+</button>
          </div>
          <div>
            <button type="button" id="add-to-cart-btn" class="btn btn-primary btn-block">Ajouter au panier</button>
          </div>
          <p id="add-to-cart-feedback" class="text-muted" style="margin-top:10px;" aria-live="polite"></p>
        ` : `
          <a href="index.html" class="btn btn-outline btn-block">Voir d'autres produits</a>
        `}
      </div>
    </div>
  `;

  // Galerie : changement de média au clic sur une vignette
  const mainEl = document.getElementById("gallery-main");
  const thumbButtons = document.querySelectorAll("#gallery-thumbs .gallery__thumb");
  thumbButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index);
      mainEl.innerHTML = mediaSlideHTML(media[i].src, media[i].isVideo);
      thumbButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  // Sélecteur de quantité
  if (!outOfStock) {
    const qtyInput = document.getElementById("qty-input");
    document.getElementById("qty-minus").addEventListener("click", () => {
      qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
    });
    document.getElementById("qty-plus").addEventListener("click", () => {
      qtyInput.value = Math.min(product.quantity, Number(qtyInput.value) + 1);
    });
    qtyInput.addEventListener("change", () => {
      let v = Math.floor(Number(qtyInput.value) || 1);
      v = Math.max(1, Math.min(product.quantity, v));
      qtyInput.value = v;
    });

    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
      const qty = Number(qtyInput.value) || 1;
      CartStore.add(product.id, qty);
      updateCartBadge();
      document.getElementById("add-to-cart-feedback").textContent =
        `✓ ${qty} × ${product.name} ajouté${qty > 1 ? "s" : ""} au panier.`;

      Pixel.track("AddToCart", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        currency: CONFIG.CURRENCY,
        value: product.price * qty,
      });
    });
  }

  // Événement ViewContent à l'affichage de la fiche produit
  Pixel.track("ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    currency: CONFIG.CURRENCY,
    value: product.price,
  });
}

document.addEventListener("DOMContentLoaded", renderProductPage);
