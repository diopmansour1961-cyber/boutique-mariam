/**
 * ============================================================
 *  PANIER — BOUTIQUE MARIAM
 * ============================================================
 *  Logique du panier, séparée en fonctions "pures" (faciles à
 *  tester) et une petite couche de sauvegarde dans le navigateur
 *  (localStorage) pour que le panier survive à un rafraîchissement
 *  de page.
 * ============================================================
 */

const CART_STORAGE_KEY = "bm_cart_v1";

/* ---------- Fonctions pures (testables sans navigateur) ---------- */

/**
 * Ajoute une quantité d'un produit à un panier existant.
 * Ne modifie pas le panier reçu : retourne un NOUVEAU panier.
 */
function cartAddItem(cart, productId, qty) {
  qty = Math.max(1, Math.floor(Number(qty) || 1));
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    return cart.map((item) =>
      item.id === productId ? { ...item, qty: item.qty + qty } : item
    );
  }
  return [...cart, { id: productId, qty }];
}

/** Change la quantité d'un article. Si qty <= 0, retire l'article. */
function cartSetQty(cart, productId, qty) {
  qty = Math.floor(Number(qty) || 0);
  if (qty <= 0) {
    return cart.filter((item) => item.id !== productId);
  }
  return cart.map((item) =>
    item.id === productId ? { ...item, qty } : item
  );
}

/** Retire un article du panier. */
function cartRemoveItem(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

/**
 * Calcule le détail du panier (lignes avec prix, sous-total,
 * frais de livraison, total) à partir du panier et du catalogue.
 */
function cartComputeSummary(cart, products, deliveryFee, freeAbove) {
  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;
      const qty = Math.min(item.qty, Math.max(product.quantity, 0)) || item.qty;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        qty: item.qty,
        lineTotal: product.price * item.qty,
        inStock: product.quantity > 0,
        availableQty: product.quantity,
      };
    })
    .filter(Boolean);

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);

  let delivery = itemCount > 0 ? deliveryFee : 0;
  if (freeAbove > 0 && subtotal >= freeAbove) {
    delivery = 0;
  }

  return {
    lines,
    itemCount,
    subtotal,
    delivery,
    total: subtotal + delivery,
    hasOutOfStock: lines.some((l) => !l.inStock),
    hasOverStock: lines.some((l) => l.inStock && l.qty > l.availableQty),
  };
}

/** Formate un nombre en prix lisible avec la devise. Ex: 15000 -> "15 000 FCFA" */
function formatPrice(amount, currency) {
  const rounded = Math.round(Number(amount) || 0);
  const withSpaces = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${withSpaces} ${currency}`;
}

/* ---------- Couche de persistance (navigateur uniquement) ---------- */

const CartStore = {
  read() {
    if (typeof localStorage === "undefined") return [];
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },
  write(cart) {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      // Stockage indisponible (navigation privée, quota, etc.) : on ignore
      // silencieusement plutôt que de casser le site.
    }
  },
  add(productId, qty) {
    const next = cartAddItem(this.read(), productId, qty);
    this.write(next);
    return next;
  },
  setQty(productId, qty) {
    const next = cartSetQty(this.read(), productId, qty);
    this.write(next);
    return next;
  },
  remove(productId) {
    const next = cartRemoveItem(this.read(), productId);
    this.write(next);
    return next;
  },
  clear() {
    this.write([]);
    return [];
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    cartAddItem,
    cartSetQty,
    cartRemoveItem,
    cartComputeSummary,
    formatPrice,
    CartStore,
    CART_STORAGE_KEY,
  };
}
