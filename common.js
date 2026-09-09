/**
 * ============================================================
 *  COMMUN — s'exécute sur TOUTES les pages
 *  En-tête, pied de page, bouton WhatsApp flottant, compteur du
 *  panier, initialisation du Pixel + événement PageView.
 * ============================================================
 */

function svgIcon(name) {
  const icons = {
    cart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="21" r="1.4"/><circle cx="18" cy="21" r="1.4"/><path d="M2 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21 7H6"/></svg>',
    whatsapp: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.6 2 2.16 6.44 2.16 11.9c0 1.87.5 3.62 1.4 5.13L2 22l5.13-1.53a9.86 9.86 0 0 0 4.91 1.3h.01c5.44 0 9.88-4.44 9.88-9.9C21.93 6.44 17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.32-1.65-.62-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .9 2.14.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.15.46.13.63-.08.17-.2.72-.84.92-1.13.19-.29.39-.24.65-.14.27.1 1.7.8 1.99.95.29.14.48.22.55.34.07.13.07.72-.17 1.4Z"/></svg>',
    instagram: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
    facebook: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.65 15.4 3.5 14.3 3.5c-2.4 0-4 1.45-4 4.1V9.9H7.6V13h2.7v8h3.2Z"/></svg>',
  };
  return icons[name] || "";
}

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML = `
    <div class="header-strip">📲 Commande par WhatsApp — Paiement à la livraison — 🚚 Livraison gratuite</div>
    <div class="site-header__bar container">
      <a class="brand" href="index.html">
        <img class="brand__logo" src="${CONFIG.LOGO_PATH}" alt="${CONFIG.STORE_NAME}" onerror="this.style.display='none'">
        <span class="brand__name">${CONFIG.STORE_NAME}</span>
      </a>
      <div class="header-actions">
        <a class="cart-link" href="panier.html" aria-label="Voir le panier">
          ${svgIcon("cart")}
          <span class="cart-link__badge" id="cart-badge" hidden>0</span>
        </a>
      </div>
    </div>
  `;
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const cart = CartStore.read();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const social = CONFIG.SOCIAL_LINKS || {};
  el.innerHTML = `
    <div class="container">
      <div>
        <h3>${CONFIG.STORE_NAME}</h3>
        <p style="color:#D9CFB8; max-width:32ch;">${CONFIG.STORE_SLOGAN}</p>
        <div class="social-row">
          ${social.instagram ? `<a href="${social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${svgIcon("instagram")}</a>` : ""}
          ${social.facebook ? `<a href="${social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${svgIcon("facebook")}</a>` : ""}
        </div>
      </div>
      <div>
        <h3>Livraison</h3>
        <p style="color:#D9CFB8; margin-bottom:4px;">Villes desservies :</p>
        <p style="color:#D9CFB8;">${(CONFIG.CITIES_SERVED || []).join(", ")}</p>
      </div>
      <div>
        <h3>Contact</h3>
        <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}" target="_blank" rel="noopener">WhatsApp : +${CONFIG.WHATSAPP_NUMBER}</a>
        <p style="color:#D9CFB8; margin-top:8px;">${CONFIG.OPENING_HOURS}</p>
      </div>
    </div>
      <div>
        <h3>Gestion</h3>
        <a href="gestion-produits.html">Gérer les produits</a>
      </div>
    </div>
    <div class="site-footer__bottom">© ${new Date().getFullYear()} ${CONFIG.STORE_NAME}. Tous droits réservés.</div>
  `;
}

function renderWhatsAppFloat() {
  const el = document.getElementById("whatsapp-float");
  if (!el) return;
  el.innerHTML = `
    <a class="whatsapp-float" href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}" target="_blank" rel="noopener" aria-label="Nous contacter sur WhatsApp">
      ${svgIcon("whatsapp")}
    </a>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderWhatsAppFloat();
  Pixel.init();
  Pixel.track("PageView", {});
});
