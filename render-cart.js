function renderCartPage() {
  const root = document.getElementById("cart-root");
  const cart = CartStore.read();

  if (!cart.length) {
    root.innerHTML = `
      <div class="empty-state">
        <p>Votre panier est vide pour le moment.</p>
        <a class="btn btn-primary" href="index.html">Découvrir la collection</a>
      </div>
    `;
    return;
  }

  const summary = cartComputeSummary(cart, PRODUCTS, CONFIG.DELIVERY_FEE, CONFIG.DELIVERY_FREE_ABOVE);

  const warnings = [];
  if (summary.hasOutOfStock) {
    warnings.push(`<div class="alert alert--danger">Un ou plusieurs articles de votre panier ne sont plus en stock. Merci de les retirer avant de continuer.</div>`);
  }
  if (summary.hasOverStock) {
    warnings.push(`<div class="alert alert--warning">La quantité demandée pour un article dépasse le stock disponible. Ajustez la quantité ci-dessous.</div>`);
  }

  root.innerHTML = `
    ${warnings.join("")}
    <div>
      ${summary.lines.map((line) => {
        const product = findProduct(line.id);
        const cover = product && product.photos && product.photos[0] ? product.photos[0] : "";
        return `
          <div class="cart-line">
            <div class="cart-line__thumb">
              <img src="${cover}" alt="" onerror="this.onerror=null;this.src='https://placehold.co/100x100/EFE9DA/5B5346?text=%20'">
            </div>
            <div>
              <div class="cart-line__name">${line.name}</div>
              <div class="cart-line__price">${formatPrice(line.price, CONFIG.CURRENCY)} × 
                <input type="number" min="1" max="${Math.max(line.availableQty, 1)}" value="${line.qty}"
                  data-id="${line.id}" class="cart-qty-input" style="width:56px; padding:4px 6px; border:1px solid var(--color-line); border-radius:4px; margin-left:4px;">
              </div>
              <button type="button" class="cart-line__remove" data-id="${line.id}">Retirer</button>
            </div>
            <div style="font-weight:700; color:var(--color-primary);">${formatPrice(line.lineTotal, CONFIG.CURRENCY)}</div>
          </div>
        `;
      }).join("")}
    </div>

    <div class="cart-summary">
      <div class="summary-row"><span>Sous-total</span><span>${formatPrice(summary.subtotal, CONFIG.CURRENCY)}</span></div>
      <div class="summary-row"><span>Livraison</span><span>${summary.delivery > 0 ? formatPrice(summary.delivery, CONFIG.CURRENCY) : "🚚 Offerte"}</span></div>
      <div class="summary-row summary-row--total"><span>Total</span><span>${formatPrice(summary.total, CONFIG.CURRENCY)}</span></div>
      <div style="margin-top:16px;">
        <button type="button" id="checkout-btn" class="btn btn-primary btn-block" ${summary.hasOutOfStock ? "disabled" : ""}>
          Commander
        </button>
      </div>
    </div>
  `;

  document.querySelectorAll(".cart-line__remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      CartStore.remove(btn.dataset.id);
      updateCartBadge();
      renderCartPage();
    });
  });

  document.querySelectorAll(".cart-qty-input").forEach((input) => {
    input.addEventListener("change", () => {
      let v = Math.floor(Number(input.value) || 1);
      const max = Number(input.max) || v;
      v = Math.max(1, Math.min(max, v));
      CartStore.setQty(input.dataset.id, v);
      updateCartBadge();
      renderCartPage();
    });
  });

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "commande.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", renderCartPage);
