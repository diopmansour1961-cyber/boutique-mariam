/**
 * ============================================================
 *  AVIS CLIENTS — BOUTIQUE MARIAM
 * ============================================================
 *  Pour AJOUTER ou MODIFIER un avis, copie un bloc { ... } et
 *  change le nom, la ville, la note (sur 5) et le commentaire.
 *  Ces avis s'affichent sur la page d'accueil et sur chaque
 *  fiche produit.
 * ============================================================
 */

const REVIEWS = [
  {
    name: "Fatou D.",
    city: "Dakar",
    rating: 5,
    comment: "Commande passée un lundi, reçue le mercredi. La qualité du tissu est vraiment au rendez-vous. Je recommande !"
  },
  {
    name: "Aïssatou B.",
    city: "Thiès",
    rating: 5,
    comment: "Très simple de commander sur WhatsApp, pas besoin de payer en ligne. Le vendeur répond vite et le colis était bien emballé."
  },
  {
    name: "Mariama S.",
    city: "Rufisque",
    rating: 4,
    comment: "Beau sac, exactement comme sur les photos. Livraison gratuite en plus, c'est un vrai plus."
  },
  {
    name: "Khady N.",
    city: "Pikine",
    rating: 5,
    comment: "Deuxième commande chez Boutique Mariam et toujours aussi satisfaite. Le suivi par WhatsApp rassure sur toute la commande."
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = REVIEWS;
}
