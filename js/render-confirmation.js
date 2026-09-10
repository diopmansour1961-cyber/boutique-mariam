function renderConfirmationPage() {
  const root = document.getElementById("confirmation-root");
  const raw = sessionStorage.getItem("bm_pending_order");

  if (!raw) {
    root.innerHTML = `
      <div class="empty-state">
        <p>Aucune commande en attente de confirmation.</p>
        <a class="btn btn-primary" href="index.html">Retour à la boutique</a>
      </div>
    `;
    return;
  }

  const { orderNumber, customer, cart } = JSON.parse(raw);
  const summary = cartComputeSummary(cart, PRODUCTS, CONFIG.DELIVERY_FEE, CONFIG.DELIVERY_FREE_ABOVE);

  const message = buildWhatsAppMessage({
    storeName: CONFIG.STORE_NAME,
    orderNumber,
    summary,
    customer,
    currency: CONFIG.CURRENCY,
    paymentLabel: CONFIG.PAYMENT_METHOD_LABEL,
    formatPrice,
  });
  const link = buildWhatsAppLink(CONFIG.WHATSAPP_NUMBER, message);

  root.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-box__icon">✓</div>
      <h1>Votre commande est prête</h1>
      <p>Il ne reste qu'une étape : envoyez le message ci-dessous sur WhatsApp pour confirmer votre commande #${orderNumber}. Notre équipe vous répondra rapidement.</p>

      <div class="order-recap">${message}</div>

      <a href="${link}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block" id="confirm-whatsapp-btn">
        📲 CONFIRMER MA COMMANDE SUR WHATSAPP
      </a>

      <p style="margin-top:16px;">
        <a href="index.html" class="text-muted">← Continuer mes achats</a>
      </p>
    </div>
  `;

  // Événement Purchase : dédupliqué par numéro de commande pour éviter
  // qu'un rafraîchissement de cette page ne compte deux fois la vente.
  Pixel.track(
    "Purchase",
    {
      content_ids: summary.lines.map((l) => l.id),
      currency: CONFIG.CURRENCY,
      value: summary.total,
      num_items: summary.itemCount,
    },
    orderNumber
  );

  document.getElementById("confirm-whatsapp-btn").addEventListener("click", () => {
    CartStore.clear();
    updateCartBadge();
    sessionStorage.removeItem("bm_pending_order");
  });
}

document.addEventListener("DOMContentLoaded", renderConfirmationPage);
