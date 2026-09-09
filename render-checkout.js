function renderCheckoutPage() {
  const root = document.getElementById("checkout-root");
  const cart = CartStore.read();

  if (!cart.length) {
    root.innerHTML = `
      <div class="empty-state">
        <p>Votre panier est vide. Ajoutez des produits avant de passer commande.</p>
        <a class="btn btn-primary" href="index.html">Découvrir la collection</a>
      </div>
    `;
    return;
  }

  const summary = cartComputeSummary(cart, PRODUCTS, CONFIG.DELIVERY_FEE, CONFIG.DELIVERY_FREE_ABOVE);

  if (summary.hasOutOfStock) {
    root.innerHTML = `
      <div class="alert alert--danger">
        Un article de votre panier n'est plus disponible. Retournez au panier pour le retirer.
      </div>
      <a class="btn btn-outline" href="panier.html">Retour au panier</a>
    `;
    return;
  }

  root.innerHTML = `
    <form id="checkout-form" novalidate>
      <div class="form-grid form-grid--2">
        <div class="form-field" data-field="firstName">
          <label for="firstName">Prénom</label>
          <input type="text" id="firstName" name="firstName" autocomplete="given-name" required>
          <div class="form-error" hidden></div>
        </div>
        <div class="form-field" data-field="lastName">
          <label for="lastName">Nom</label>
          <input type="text" id="lastName" name="lastName" autocomplete="family-name" required>
          <div class="form-error" hidden></div>
        </div>
      </div>

      <div class="form-field" data-field="phone">
        <label for="phone">Téléphone</label>
        <input type="tel" id="phone" name="phone" autocomplete="tel" inputmode="tel" placeholder="Ex : 77 123 45 67" required>
        <div class="form-error" hidden></div>
      </div>

      <div class="form-field" data-field="address">
        <label for="address">Adresse</label>
        <textarea id="address" name="address" autocomplete="street-address" required></textarea>
        <div class="form-error" hidden></div>
      </div>

      <div class="form-field" data-field="city">
        <label for="city">Ville</label>
        <select id="city" name="city" required>
          <option value="">Choisir une ville</option>
          ${(CONFIG.CITIES_SERVED || []).map((c) => `<option value="${c}">${c}</option>`).join("")}
          <option value="Autre">Autre</option>
        </select>
        <div class="form-error" hidden></div>
      </div>

      <div class="cart-summary" style="margin-bottom:20px;">
        <div class="summary-row"><span>Sous-total</span><span>${formatPrice(summary.subtotal, CONFIG.CURRENCY)}</span></div>
        <div class="summary-row"><span>Livraison</span><span>${summary.delivery > 0 ? formatPrice(summary.delivery, CONFIG.CURRENCY) : "🚚 Offerte"}</span></div>
        <div class="summary-row summary-row--total"><span>Total</span><span>${formatPrice(summary.total, CONFIG.CURRENCY)}</span></div>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Continuer vers le paiement à la livraison</button>
    </form>
  `;

  const form = document.getElementById("checkout-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const customer = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
    };

    const { valid, errors } = validateCustomer(customer);

    document.querySelectorAll(".form-field").forEach((field) => {
      const name = field.dataset.field;
      const errorEl = field.querySelector(".form-error");
      if (errors[name]) {
        field.classList.add("has-error");
        errorEl.hidden = false;
        errorEl.textContent = errors[name];
      } else {
        field.classList.remove("has-error");
        errorEl.hidden = true;
      }
    });

    if (!valid) {
      const firstErrorField = document.querySelector(".form-field.has-error input, .form-field.has-error textarea, .form-field.has-error select");
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    const orderNumber = nextOrderNumber();
    sessionStorage.setItem("bm_pending_order", JSON.stringify({
      orderNumber,
      customer,
      cart,
    }));

    window.location.href = "confirmation.html";
  });

  // Événement InitiateCheckout : une seule fois par session pour éviter les doublons
  Pixel.track(
    "InitiateCheckout",
    {
      content_ids: summary.lines.map((l) => l.id),
      currency: CONFIG.CURRENCY,
      value: summary.total,
      num_items: summary.itemCount,
    },
    "checkout-session"
  );
}

document.addEventListener("DOMContentLoaded", renderCheckoutPage);
