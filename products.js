/**
 * ============================================================
 *  CATALOGUE PRODUITS — BOUTIQUE MARIAM
 * ============================================================
 *  Chaque produit est un bloc { ... }. Pour AJOUTER un produit,
 *  copie un bloc entier (de { à },) colle-le juste avant le
 *  "];" final, et modifie les valeurs.
 *
 *  Voir GUIDE-BOUTIQUE-MARIAM.md section B pour les explications
 *  détaillées, étape par étape.
 *
 *  Champs :
 *  - id          : identifiant UNIQUE (jamais deux produits avec le même)
 *  - name        : nom du produit
 *  - description : description du produit
 *  - price       : prix actuel (nombre, sans espace ni FCFA)
 *  - oldPrice    : ancien prix si en réduction (mettre null si aucune réduction)
 *  - photos      : liste des chemins d'images (au moins 1)
 *  - videos      : liste des chemins de vidéos (peut être vide : [])
 *  - quantity    : quantité disponible en stock (0 = épuisé)
 *  - category    : catégorie du produit (texte libre)
 * ============================================================
 */

const PRODUCTS = [
  {
    id: "BM-P001",
    name: "Robe wax élégance",
    description: "Robe en tissu wax authentique, coupe cintrée, doublure intérieure confortable. Idéale pour les grandes occasions comme pour le quotidien.",
    price: 18000,
    oldPrice: 22000,
    photos: [
      "assets/products/BM-P001-1.jpg",
      "assets/products/BM-P001-2.jpg"
    ],
    videos: [
      "assets/products/BM-P001-video.mp4"
    ],
    quantity: 12,
    category: "Robes"
  },
  {
    id: "BM-P002",
    name: "Ensemble deux pièces Awa",
    description: "Haut et jupe assortis, tissu léger et respirant, parfait pour la saison chaude. Disponible en plusieurs tailles.",
    price: 15500,
    oldPrice: null,
    photos: [
      "assets/products/BM-P002-1.jpg"
    ],
    videos: [],
    quantity: 8,
    category: "Ensembles"
  },
  {
    id: "BM-P003",
    name: "Sac à main tressé",
    description: "Sac à main artisanal tressé à la main, doublure intérieure avec poche zippée, anse résistante.",
    price: 9000,
    oldPrice: 11000,
    photos: [
      "assets/products/BM-P003-1.jpg",
      "assets/products/BM-P003-2.jpg"
    ],
    videos: [],
    quantity: 20,
    category: "Accessoires"
  },
  {
    id: "BM-P004",
    name: "Foulard soie imprimé",
    description: "Foulard doux au toucher, imprimé exclusif, se porte au cou, en ceinture ou en accessoire pour cheveux.",
    price: 5000,
    oldPrice: null,
    photos: [
      "assets/products/BM-P004-1.jpg"
    ],
    videos: [
      "assets/products/BM-P004-video.mp4"
    ],
    quantity: 0,
    category: "Accessoires"
  }
];

/** Retrouve un produit du catalogue à partir de son id. Retourne undefined si introuvable. */
function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// Ne pas modifier ce qui suit : rend le catalogue disponible partout.
if (typeof module !== "undefined" && module.exports) {
  module.exports = PRODUCTS;
  module.exports.findProduct = findProduct;
}
