/**
 * ============================================================
 *  META PIXEL — BOUTIQUE MARIAM
 * ============================================================
 *  - Ne charge JAMAIS le Pixel tant que META_PIXEL_ID vaut
 *    "À_REMPLACER" dans js/config.js (aucun faux Pixel actif).
 *  - Empêche les événements en double lors d'un rafraîchissement
 *    de page (surtout important pour "Purchase").
 *  - En mode debug (CONFIG.META_PIXEL_DEBUG = true), affiche
 *    chaque événement envoyé dans la console (F12 -> Console).
 * ============================================================
 */

const Pixel = (function () {
  const SENT_EVENTS_KEY = "bm_pixel_sent_events_v1";
  let loaded = false;

  function isConfigured() {
    return (
      typeof CONFIG !== "undefined" &&
      CONFIG.META_PIXEL_ID &&
      CONFIG.META_PIXEL_ID !== "À_REMPLACER"
    );
  }

  function log(...args) {
    if (typeof CONFIG !== "undefined" && CONFIG.META_PIXEL_DEBUG) {
      // eslint-disable-next-line no-console
      console.log("%c[Meta Pixel]", "color:#7A2E3B;font-weight:bold;", ...args);
    }
  }

  /** Charge le script officiel Meta Pixel une seule fois. */
  function init() {
    if (loaded) return;
    if (!isConfigured()) {
      log(
        "Non initialisé : META_PIXEL_ID vaut encore \"À_REMPLACER\" dans js/config.js. " +
          "Renseigne ton identifiant réel pour activer le Pixel (voir GUIDE-BOUTIQUE-MARIAM.md, section G)."
      );
      return;
    }

    /* eslint-disable */
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );
    /* eslint-enable */

    window.fbq("init", CONFIG.META_PIXEL_ID);
    loaded = true;
    log("Pixel initialisé avec l'ID", CONFIG.META_PIXEL_ID);
  }

  /** Lit la liste des identifiants d'événements déjà envoyés (anti-doublon). */
  function getSentEvents() {
    if (typeof sessionStorage === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(SENT_EVENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function markEventSent(eventKey) {
    if (typeof sessionStorage === "undefined") return;
    try {
      const sent = getSentEvents();
      sent.push(eventKey);
      sessionStorage.setItem(SENT_EVENTS_KEY, JSON.stringify(sent.slice(-50)));
    } catch (e) {
      /* ignore */
    }
  }

  /**
   * Envoie un événement standard Meta Pixel.
   * @param {string} eventName - ex: "PageView", "ViewContent", "AddToCart", "InitiateCheckout", "Purchase"
   * @param {object} params - paramètres de l'événement (value, currency, content_ids, ...)
   * @param {string|null} dedupeKey - si fourni, l'événement n'est envoyé qu'une seule fois par session pour cette clé
   */
  function track(eventName, params, dedupeKey) {
    if (dedupeKey) {
      const sent = getSentEvents();
      const key = `${eventName}:${dedupeKey}`;
      if (sent.includes(key)) {
        log(`Ignoré (déjà envoyé cette session) : ${eventName}`, params);
        return;
      }
      markEventSent(key);
    }

    if (!isConfigured()) {
      log(`(non envoyé, Pixel non configuré) ${eventName}`, params || {});
      return;
    }

    if (typeof window.fbq !== "function") {
      init();
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, params || {});
      log(eventName, params || {});
    }
  }

  return { init, track, isConfigured };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Pixel };
}
