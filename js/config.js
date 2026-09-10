/**
 * ============================================================
 *  CONFIGURATION CENTRALE — BOUTIQUE MARIAM
 * ============================================================
 *  Toutes les informations que tu dois pouvoir modifier
 *  facilement se trouvent ICI et NULLE PART AILLEURS.
 *
 *  ⚠️ Ne modifie que les valeurs après le signe "=".
 *  Garde bien les guillemets " " autour des textes.
 * ============================================================
 */

const CONFIG = {

  // ---- IDENTITÉ DE LA BOUTIQUE ----
  STORE_NAME: "Boutique Mariam",
  STORE_SLOGAN: "Mode & essentiels, livrés chez vous",
  LOGO_PATH: "assets/logo/logo.svg",

  // ---- WHATSAPP ----
  // Format international SANS "+", SANS espaces, SANS "00".
  // Exemple : +221 78 154 08 56  ->  221781540856
  WHATSAPP_NUMBER: "221781540856",

  // ---- PAIEMENT & DEVISE ----
  CURRENCY: "FCFA",
  PAYMENT_METHOD_LABEL: "Paiement à la livraison (COD)",

  // ---- LIVRAISON ----
  // Livraison gratuite sur toutes les commandes : laisse DELIVERY_FEE à 0.
  // Si un jour tu veux facturer la livraison, mets un montant ici
  // (ex: 2000) et ajuste DELIVERY_FREE_ABOVE si besoin.
  DELIVERY_FEE: 0,              // Frais de livraison par défaut (en FCFA)
  DELIVERY_FREE_ABOVE: 0,       // Seuil de livraison offerte (0 = déjà gratuite pour tous, ce champ est ignoré)
  FREE_DELIVERY_LABEL: "Livraison gratuite",
  CITIES_SERVED: [
    "Dakar", "Pikine", "Guédiawaye", "Rufisque", "Thiès", "Mbour", "Saint-Louis"
  ],

  // ---- HORAIRES ----
  OPENING_HOURS: "Lundi – Samedi, 9h – 19h",

  // ---- RÉSEAUX SOCIAUX ----
  SOCIAL_LINKS: {
    instagram: "https://instagram.com/boutiquemariam",
    facebook: "https://facebook.com/boutiquemariam",
    tiktok: ""
  },

  // ---- META PIXEL ----
  // Remplace "À_REMPLACER" par ton véritable identifiant Meta Pixel
  // (Meta Events Manager -> Sources de données -> ton Pixel -> Paramètres).
  // Tant que cette valeur vaut "À_REMPLACER", le Pixel NE SE CHARGE PAS
  // (c'est volontaire : on ne veut jamais d'un faux Pixel actif).
  META_PIXEL_ID: "À_REMPLACER",

  // Active un mode debug qui affiche dans la console du navigateur
  // (F12 -> Console) chaque événement Pixel envoyé. Utile pour tester.
  META_PIXEL_DEBUG: true,
};

// Ne pas modifier ce qui suit : rend la config disponible partout.
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
