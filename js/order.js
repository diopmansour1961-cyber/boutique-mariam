/**
 * ============================================================
 *  COMMANDES — BOUTIQUE MARIAM
 * ============================================================
 *  Génération du numéro de commande et du message WhatsApp
 *  pré-rempli. Fonctions pures + petite persistance du compteur.
 * ============================================================
 */

const ORDER_COUNTER_KEY = "bm_order_counter_v1";

/** Formate un numéro de commande à partir d'un compteur. 1 -> "BM-00001" */
function formatOrderNumber(counter) {
  return "BM-" + String(counter).padStart(5, "0");
}

/** Lit puis incrémente le compteur de commandes dans localStorage. */
function nextOrderNumber() {
  let counter = 1;
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(ORDER_COUNTER_KEY);
      counter = raw ? parseInt(raw, 10) + 1 : 1;
      if (!Number.isFinite(counter) || counter < 1) counter = 1;
      localStorage.setItem(ORDER_COUNTER_KEY, String(counter));
    } catch (e) {
      counter = Math.floor(Date.now() / 1000) % 100000;
    }
  }
  return formatOrderNumber(counter);
}

/**
 * Construit le texte du message WhatsApp prérempli à partir
 * du résumé du panier (cartComputeSummary) et des infos client.
 */
function buildWhatsAppMessage({ storeName, orderNumber, summary, customer, currency, paymentLabel, formatPrice }) {
  const productLines = summary.lines
    .map((l) => `- ${l.name} × ${l.qty}`)
    .join("\n");

  return [
    `Bonjour ${storeName} 👋`,
    ``,
    `Je souhaite confirmer ma commande.`,
    ``,
    `🛍️ Commande : #${orderNumber}`,
    ``,
    `Produits :`,
    productLines,
    ``,
    `💰 Sous-total : ${formatPrice(summary.subtotal, currency)}`,
    `🚚 Livraison : ${summary.delivery > 0 ? formatPrice(summary.delivery, currency) : "Offerte"}`,
    `💰 Total : ${formatPrice(summary.total, currency)}`,
    ``,
    `👤 Client :`,
    `Nom : ${customer.lastName}`,
    `Prénom : ${customer.firstName}`,
    ``,
    `📞 Téléphone : ${customer.phone}`,
    ``,
    `📍 Adresse :`,
    customer.address,
    ``,
    `🏙️ Ville : ${customer.city}`,
    ``,
    `💵 Paiement : ${paymentLabel}`,
    ``,
    `Merci.`,
  ].join("\n");
}

/** Construit l'URL wa.me à partir du numéro et du message. */
function buildWhatsAppLink(whatsappNumber, message) {
  const cleanNumber = String(whatsappNumber).replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Valide les informations client. Retourne un objet
 * { valid: boolean, errors: { champ: "message" } }.
 */
function validateCustomer(customer) {
  const errors = {};
  if (!customer.firstName || !customer.firstName.trim()) {
    errors.firstName = "Le prénom est obligatoire.";
  }
  if (!customer.lastName || !customer.lastName.trim()) {
    errors.lastName = "Le nom est obligatoire.";
  }
  const phoneDigits = (customer.phone || "").replace(/[^0-9]/g, "");
  if (phoneDigits.length < 9) {
    errors.phone = "Le numéro de téléphone n'est pas valide.";
  }
  if (!customer.address || !customer.address.trim()) {
    errors.address = "L'adresse est obligatoire.";
  }
  if (!customer.city || !customer.city.trim()) {
    errors.city = "La ville est obligatoire.";
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    formatOrderNumber,
    nextOrderNumber,
    buildWhatsAppMessage,
    buildWhatsAppLink,
    validateCustomer,
    ORDER_COUNTER_KEY,
  };
}
